/* sim/keying.js — chroma-key cutout compositing for character gear layers.
   ---------------------------------------------------------------------------
   Nic's verdict on the badge technique: tilted item cards pasted over the
   portrait don't read as worn/carried gear. Layers flagged `keyed: true` in
   CHAR_LAYER_SPEC are isolated objects on pure #00FF00 green. At render time
   we key out the green, trim to the object's bounding box, and paint the
   cutout onto a <canvas> positioned at the layer's anchor in the existing
   z-order. No card chrome on the figure: no caption, no tilt, no frame.

   Test-grade visuals (see DECISIONS.md §22): knife/flashlight keep their
   card-badge rendering until their gear art exists. Bag-grid item cards are
   untouched everywhere.

   Pure functions (keyAlpha, despillPixel) carry the pixel math so the
   node test harness can verify them without a DOM. */

/* keyAlpha: 0 = key out (near-pure green), 255 = keep. */
function keyAlpha(r, g, b) {
  if (g > 120 && (g - r) > 40 && (g - b) > 40) return 0;
  return 255;
}

/* despillPixel: pull residual green fringe toward neutral on edge pixels
   that survived the key (genuinely green objects would need a better
   despill; none of the gear art is green). */
function despillPixel(r, g, b) {
  var m = Math.max(r, b);
  if (g > m && (g - m) < 60) return [r, m, b];
  return [r, g, b];
}

/* Key out the green in an already-drawn canvas, in place. */
function keyOutCanvas(c) {
  var w = c.width, h = c.height;
  var ctx = c.getContext('2d');
  var id = ctx.getImageData(0, 0, w, h), d = id.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i], g = d[i + 1], b = d[i + 2];
    if (keyAlpha(r, g, b) === 0) { d[i + 3] = 0; }
    else { var ds = despillPixel(r, g, b); d[i] = ds[0]; d[i + 1] = ds[1]; d[i + 2] = ds[2]; }
  }
  ctx.putImageData(id, 0, 0);
  return c;
}

/* Trim fully-transparent borders -> tight cutout canvas. */
function trimCanvas(c) {
  var w = c.width, h = c.height;
  var d = c.getContext('2d').getImageData(0, 0, w, h).data;
  var minx = w, miny = h, maxx = -1, maxy = -1, x, y, a;
  for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
    a = d[(y * w + x) * 4 + 3];
    if (a > 8) {
      if (x < minx) minx = x; if (x > maxx) maxx = x;
      if (y < miny) miny = y; if (y > maxy) maxy = y;
    }
  }
  if (maxx < 0) return c; // nothing visible; return as-is
  var t = document.createElement('canvas');
  t.width = maxx - minx + 1; t.height = maxy - miny + 1;
  t.getContext('2d').drawImage(c, minx, miny, t.width, t.height, 0, 0, t.width, t.height);
  return t;
}

/* Load an <img>, key it, trim it -> cutout canvas (async via onload). */
function keyOutImage(img, done) {
  var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
  if (!w || !h) { done(null); return; }
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  c.getContext('2d').drawImage(img, 0, 0, w, h);
  try { done(trimCanvas(keyOutCanvas(c))); }
  catch (e) { done(null); }
}

/* Cache: spec.file -> trimmed cutout canvas. Keyed once per layer. */
var KEYED_CACHE = {};

/* Paint every keyed-gear canvas currently in the DOM. Called after each
   screen() render; no-ops when no keyed canvases are present. Failures
   never break the render -- the canvas simply stays blank. */
function paintKeyedLayers() {
  if (typeof document === 'undefined' || !document.querySelectorAll) return;
  var nodes = document.querySelectorAll('canvas[data-keyed]');
  for (var i = 0; i < nodes.length; i++) (function (cv) {
    var layerId = cv.getAttribute('data-keyed');
    var spec = (typeof CHAR_LAYER_SPEC !== 'undefined') ? CHAR_LAYER_SPEC[layerId] : null;
    if (!spec || !spec.keyed) return;
    var src = (typeof charLayerArt === 'function') ? charLayerArt(layerId) : null;
    if (!src) return;
    function draw(cut) {
      try {
        var ctx = cv.getContext('2d');
        var W = cv.width, H = cv.height;
        ctx.clearRect(0, 0, W, H);
        var s = Math.min(W / cut.width, H / cut.height);
        var dw = Math.max(1, Math.round(cut.width * s)), dh = Math.max(1, Math.round(cut.height * s));
        ctx.drawImage(cut, Math.round((W - dw) / 2), Math.round((H - dh) / 2), dw, dh);
      } catch (e) { /* never break render */ }
    }
    if (KEYED_CACHE[spec.file]) { draw(KEYED_CACHE[spec.file]); return; }
    var img = new Image();
    img.onload = function () {
      keyOutImage(img, function (cut) {
        if (!cut) return;
        KEYED_CACHE[spec.file] = cut;
        if (document.body && document.body.contains(cv)) draw(cut);
      });
    };
    img.src = src;
  })(nodes[i]);
}
