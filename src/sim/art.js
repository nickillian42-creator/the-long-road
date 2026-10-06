/* sim/art.js — Item artwork resolution + comic-book interaction blips (M2 UX pass).
   ---------------------------------------------------------------------------
   PRESENTATION ONLY. No inventory, survival, or scavenging mechanics here.

   itemArt(id): resolves an item's artwork.
     - Preview builds inline a data-URI map as the global ITEM_ART
       ({ id: 'data:image/webp;base64,...' }); when present it wins.
     - Otherwise falls back to the item def's `art` asset path
       ('assets/items/<id>.webp' — uploaded via GitHub web; the connector
       must never push binaries).
     - Unknown items or missing art -> null. Callers must degrade to a
       styled placeholder, never a broken image.

   artTag(id, cls): ready-to-render artwork markup with graceful fallback.
     Renders a .artwrap span holding the <img>; if the image fails to load
     it removes itself, revealing the .art-fallback glyph underneath.

   blip(kind): mature, grounded graphic-novel interaction blips — NOT
     superhero, NOT Borderlands. Small restrained ink marks whose shape and
     intensity respond to the situation:
       'calm'   — soft ink-wash roundel: calm exploration, quiet resolves
       'talk'   — small speech tick: conversation (reserved; unused in the
                  prototype, defined for the coming dialogue systems)
       'danger' — jagged dark-rust burst, quick and sharp: real danger
       'urgent' — amber jagged pulse: needs a decision right now
     Unknown kinds fall back to 'calm'. Pure CSS animation; honors
     prefers-reduced-motion. pointer-events:none — blips never eat taps. */

function itemArt(id) {
  const def = itemDef(id);
  if (!def) return null;
  if (typeof ITEM_ART !== 'undefined' && ITEM_ART && ITEM_ART[id]) return ITEM_ART[id];
  return def.art || null;
}

function artTag(id, cls) {
  const def = itemDef(id), src = itemArt(id);
  const alt = escapeHtml(def ? def.name : String(id));
  const c = cls ? ' ' + cls : '';
  if (!src) return '<span class="art-fallback' + c + '" aria-label="' + alt + '">◇</span>';
  return '<span class="artwrap' + c + '"><span class="art-fallback">◇</span>' +
    '<img src="' + src + '" alt="' + alt + '" loading="lazy" onerror="this.remove()"></span>';
}

function blip(kind) {
  const k = (kind === 'talk' || kind === 'danger' || kind === 'urgent') ? kind : 'calm';
  return '<span class="blip blip-' + k + '" aria-hidden="true"></span>';
}

/* Minimal SVG rucksack used as the "pack" target of the take transition. */
function packIcon() {
  return '<svg class="pack-svg" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">' +
    '<rect x="24" y="8" width="16" height="12" rx="6" fill="none" stroke="#91b279" stroke-width="2.5"/>' +
    '<rect x="13" y="18" width="38" height="36" rx="11" fill="#3a4a33" stroke="#91b279" stroke-width="2"/>' +
    '<rect x="22" y="29" width="20" height="13" rx="4" fill="#2a3828" stroke="#91b279" stroke-width="1.5"/>' +
    '<line x1="32" y1="18" x2="32" y2="29" stroke="#91b279" stroke-width="1.5"/></svg>';
}

/* --- Searchable-area artwork (M2 visual pass) --------------------------------
   PRESENTATION ONLY. The five prototype areas each have an illustrated card
   (`art-preview-areas/<id>.webp`, wide landscape, same gritty graphic-novel
   style as the item art). areaArt(id) mirrors itemArt(): prefers an inlined
   AREA_ART data-URI map when a preview build provides one, else falls back
   to the asset path 'assets/areas/<id>.webp' (uploaded via GitHub web; the
   connector must never push binaries). Unknown areas -> null; callers render
   a styled placeholder, never a broken image. */
const SCAV_ART = {
  shelves: 'store_shelves',
  fridge: 'refrigerator',
  backpack: 'backpack',
  cabinet: 'cabinet',
  glovebox: 'glovebox',
};

function areaArtId(areaId) { return SCAV_ART[areaId] || null; }

function areaArt(areaId) {
  const artId = areaArtId(areaId);
  if (!artId) return null;
  if (typeof AREA_ART !== 'undefined' && AREA_ART && AREA_ART[artId]) return AREA_ART[artId];
  return 'assets/areas/' + artId + '.webp';
}

function areaArtTag(areaId, cls) {
  const src = areaArt(areaId);
  const area = (typeof SCAV_AREAS !== 'undefined' && SCAV_AREAS[areaId]) || null;
  const alt = escapeHtml(area ? area.name : String(areaId));
  const c = cls ? ' ' + cls : '';
  if (!src) return '<span class="art-fallback area-art' + c + '" aria-label="' + alt + '">◇</span>';
  return '<span class="artwrap area-art' + c + '"><span class="art-fallback">◇</span>' +
    '<img src="' + src + '" alt="' + alt + '" loading="lazy" onerror="this.remove()"></span>';
}

/* --- Modular layered character renderer (M2 presentation pass) --------------
   PRESENTATION ONLY. No inventory, survival, or scavenging mechanics here.

   The baked full-body portraits are GONE (superseded 2026-10-05): characters
   now render as a composite of layers bound to equipment state.

   LAYER SPEC
   - Canvas: 600 x 900 portrait. Anchor coordinates normalized 0-1000.
   - Locked pose: standing 3/4 view, facing right -- matches the reference
     full-body illustrations the base/jacket layers were painted from.
   - Anchors: head, torso, legs, beltLeft, beltRight, back, handR (held),
     handL, sling.
   - Layer order back -> front: base outfit -> pants -> torso -> jacket ->
     backpack -> slung weapon -> belt/holster items -> headwear -> held items.
     (pants / torso / headwear are reserved slots; the PoC ships base, jacket,
     backpack, and equipment only.)
   - PoC technique: the media pipeline cannot produce transparency, so outfit
     variants (base vs jacket) are FULL-CANVAS mutually-exclusive layers --
     never pixel-composited. Backpack + equipment render as anchored overlay
     badges at their anchor points (acceptable PoC technique; the
     architecture supports true cutout sprites later).

   ASSET TYPES
   - Character-layer art is a SEPARATE asset type from inventory/FOUND art,
     tracked in CHAR_LAYER_SPEC even where the PoC reuses a file:
       knife / flashlight -> reuse their existing item art as the badge
         sprite (reusesItemArt: true; distinct character-layer art later).
       pistol / longgun / backpack / josh_base / josh_jacket / mara_base /
         mara_jacket -> dedicated layer art ('assets/charlayers/<id>.webp').
   - charLayerArt(id): prefers an inlined CHAR_LAYER_ART data-URI map (preview
     builds), else 'assets/charlayers/<id>.webp' (uploaded via GitHub web;
     the connector must never push binaries). Unknown ids -> null; callers
     render a styled placeholder, never a broken image. */

const CHAR_CANVAS = { w: 600, h: 900 };

const CHAR_ANCHORS = {
  head:      { x: 500, y: 110 },
  torso:     { x: 500, y: 350 },
  legs:      { x: 500, y: 700 },
  beltLeft:  { x: 400, y: 500 },
  beltRight: { x: 620, y: 500 },
  back:      { x: 300, y: 380 },
  handR:     { x: 650, y: 560 },
  handL:     { x: 330, y: 570 },
  sling:     { x: 480, y: 330 },
};

/* Back -> front. PoC populates: base, jacket, backpack, slung, belt, held. */
const CHAR_LAYER_ORDER = ['base', 'pants', 'torso', 'jacket', 'backpack', 'slung', 'belt', 'headwear', 'held'];

/* Per-anchor presentation rules: scale = fraction of canvas width,
   rotate = degrees. Tuned for the 3/4-view reference pose. */
const CHAR_ANCHOR_RULES = {
  beltLeft:  { scale: 0.17, rotate: 0 },
  beltRight: { scale: 0.17, rotate: 0 },
  back:      { scale: 0.30, rotate: 0 },
  handR:     { scale: 0.22, rotate: -12 },
  handL:     { scale: 0.22, rotate: 12 },
  sling:     { scale: 0.44, rotate: -22 },
};

/* Layer asset manifest. kind = z-order slot; anchor = placement;
   reusesItemArt flags PoC reuse of inventory art as the badge sprite. */
const CHAR_LAYER_SPEC = {
  josh_base:   { kind: 'base',     file: 'josh_base' },
  mara_base:   { kind: 'base',     file: 'mara_base' },
  josh_jacket: { kind: 'jacket',   file: 'josh_jacket' },
  mara_jacket: { kind: 'jacket',   file: 'mara_jacket' },
  backpack:    { kind: 'backpack', file: 'backpack', anchor: 'back' },
  pistol:      { kind: 'held',     file: 'pistol',   anchor: 'handR', item: 'pistol_test' },
  longgun:     { kind: 'slung',    file: 'longgun',  anchor: 'sling', item: 'longgun_test' },
  knife:       { kind: 'belt',     file: null,       anchor: 'beltRight', item: 'knife', reusesItemArt: true },
  flashlight:  { kind: 'belt',     file: null,       anchor: 'beltLeft',  item: 'flashlight', reusesItemArt: true },
};

/* Equipment item -> layer binding. weapon -> hands/sling/belt per the item's
   anchor mapping; utility -> belt. */
const CHAR_EQUIP_BINDING = {
  knife:        { layer: 'knife',      slot: 'weapon' },
  flashlight:   { layer: 'flashlight', slot: 'utility' },
  pistol_test:  { layer: 'pistol',     slot: 'weapon' },
  longgun_test: { layer: 'longgun',    slot: 'weapon' },
};

function charLayerArt(id) {
  const spec = CHAR_LAYER_SPEC[id];
  if (!spec || !spec.file) return null;
  if (typeof CHAR_LAYER_ART !== 'undefined' && CHAR_LAYER_ART && CHAR_LAYER_ART[spec.file]) return CHAR_LAYER_ART[spec.file];
  return 'assets/charlayers/' + spec.file + '.webp';
}

function charLayerZ(kind) { return CHAR_LAYER_ORDER.indexOf(kind) * 10; }

/* Full-canvas outfit layer (base XOR jacket -- mutually exclusive). */
function charLayerImg(layerId) {
  const spec = CHAR_LAYER_SPEC[layerId];
  const src = charLayerArt(layerId);
  const label = escapeHtml(layerId);
  const inner = src
    ? '<img src="' + src + '" alt="' + label + '" loading="lazy" onerror="this.remove()">'
    : '<span class="layer-missing">◇ ' + label + '</span>';
  return '<div class="char-layer" data-layer="' + layerId + '" style="z-index:' + charLayerZ(spec.kind) + '">' + inner + '</div>';
}

/* Anchored equipment badge. Equipment badges are tappable -> stow (slot);
   pure-visual layers (backpack) render as spans. */
function charBadge(layerId, who, slot) {
  const spec = CHAR_LAYER_SPEC[layerId];
  const a = CHAR_ANCHORS[spec.anchor], r = CHAR_ANCHOR_RULES[spec.anchor] || { scale: 0.2, rotate: 0 };
  const src = spec.reusesItemArt ? itemArt(spec.item) : charLayerArt(layerId);
  const def = spec.item ? itemDef(spec.item) : null;
  const label = escapeHtml(def ? def.name : layerId);
  const inner = src
    ? '<img src="' + src + '" alt="' + label + '" loading="lazy" onerror="this.remove()">'
    : '<span class="layer-missing">◇</span>';
  const style = 'left:' + (a.x / 10) + '%;top:' + (a.y / 10) + '%;width:' + Math.round(r.scale * 100) +
    '%;z-index:' + charLayerZ(spec.kind) + ';transform:translate(-50%,-50%) rotate(' + r.rotate + 'deg)';
  const attrs = 'class="char-badge" data-layer="' + layerId + '" data-anchor="' + spec.anchor + '"' +
    (spec.reusesItemArt ? ' data-reuse="item-art"' : '') + ' style="' + style + '"';
  const body = inner + '<span class="badge-cap">' + label + '</span>';
  return slot
    ? '<button ' + attrs + ' onclick="invUnequipSlot(\'' + who + '\',\'' + slot + '\')">' + body + '</button>'
    : '<span ' + attrs + '>' + body + '</span>';
}

/* renderCharacter(who): the composite figure. Equipment state drives the
   renderer -- EQUIP adds the badge immediately, UNEQUIP removes it.
   Per-character: each tab renders that character's OWN equipment. */
function renderCharacter(who) {
  const k = (who === 'mara') ? 'mara' : 'josh';
  const eq = invState(k).equipment, tl = charTestLayers(k);
  let h = '<div class="char-figure" role="img" aria-label="' + escapeHtml(k === 'mara' ? 'Mara' : 'Josh') + '">';
  // full-canvas outfit: jacket XOR base (mutually exclusive -- no transparency)
  h += charLayerImg(tl.jacket ? k + '_jacket' : k + '_base');
  // backpack layer (PoC test toggle)
  if (tl.backpack) h += charBadge('backpack', k, null);
  // equipment badges, bound to equipment state
  ['weapon', 'utility'].forEach(function (slot) {
    const id = eq[slot], b = CHAR_EQUIP_BINDING[id];
    if (b) h += charBadge(b.layer, k, slot);
  });
  return h + '</div>';
}
