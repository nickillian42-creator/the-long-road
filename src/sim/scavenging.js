/* sim/scavenging.js — Touch-first scavenging PROTOTYPE (Milestone 2).
   ---------------------------------------------------------------------------
   This is a SEPARATE proof-of-concept scene, not Chapter Two. It does not
   touch Chapter One. Entry: title screen → SCAVENGING PROTOTYPE.

   Interaction model: tap a recognizable searchable area (shelves, fridge,
   backpack, cabinet) — never a generic SEARCH button, never pixel hunting.
   Each search offers two approaches:
     SEARCH QUIETLY — slower (more time passes), low noise
     FORCE IT       — fast, but loud
   Time, risk, and noise are the decisions — not reflexes.

   RISK/TIME: danger accumulating while the crew stays in an unsafe place.
     High risk raises the chance/severity of complications; hitting the
     threshold forces a scare that ends the run — it does not guarantee a
     fight (there is no combat in this prototype).
   NOISE: immediate attention from actions. Loud actions now make later
     actions riskier (risk gains scale with current noise).

   Loot persistence: searched areas stay searched; items left behind sit on
   the location's ground; re-entering never regenerates loot. Prototype saves
   under the isolated key 'longroad_proto' — real saves are never touched.

   DISCOVERY interstitial (Milestone 2 polish): a search that produces loot
   shows a prominent FOUND result BEFORE anything enters inventory. The
   player explicitly decides: TAKE ALL / CHOOSE ITEMS / LEAVE. Taking
   confirms which character's pack received it ("Added to Josh's pack").
   g.discovery = { who, loc, loot:[{item,qty}], choosing } is transient and
   saved with the proto state like everything else. Full-pack overflow still
   routes through the existing FOUND state (grantLoot -> setFound) after
   TAKE ALL. If risk boils over on the search, there is no time to sort —
   the loot stays where it fell (ground) and the complication fires.

   Loot here is authored and fixed (no RNG in Chapter One, and none needed
   for this proof-of-concept); difficulty adjusts quantity via lootQtyFor. */

const PROTO_KEY = 'longroad_proto';

const SCAV_AREAS = {
  shelves: {
    name: 'Store shelves',
    desc: 'Toppled shelving, cans scattered like dice. Most labels are gone; the rest lie.',
    loot: [['canned_food', 2], ['water_bottle', 1]],
    quiet: { risk: 8, noise: 3, ticks: 2, text: 'You work the shelves quietly, testing each can by weight.' },
    force: { risk: 6, noise: 14, ticks: 1, text: 'You sweep the shelves fast. Cans clatter across concrete.' },
  },
  fridge: {
    name: 'Refrigerator',
    desc: 'A cooler with the door swollen shut. Something inside shifted when you knocked.',
    loot: [['mre', 1]],
    quiet: { risk: 10, noise: 4, ticks: 3, text: 'You ease the cooler door with the tire iron, a millimeter at a time.' },
    force: { risk: 7, noise: 20, ticks: 1, text: 'You rip the cooler open. The seal breaks with a crack like a gunshot.' },
  },
  backpack: {
    name: 'Abandoned backpack',
    desc: 'Left by the door, straps cut. Somebody left in a hurry, or didn\'t leave at all.',
    loot: [['bandage', 1], ['ammo_9mm', 4]],
    quiet: { risk: 6, noise: 2, ticks: 1, text: 'You go through the backpack pocket by pocket.' },
    force: { risk: 6, noise: 10, ticks: 1, text: 'You upend the backpack and shake it out.' },
  },
  cabinet: {
    name: 'Under-counter cabinet',
    desc: 'Cleaning supplies and one locked metal box, long since jimmied.',
    loot: [['antiseptic', 1], ['rope', 1]],
    quiet: { risk: 8, noise: 3, ticks: 2, text: 'You pick through the cabinet without rushing.' },
    force: { risk: 6, noise: 16, ticks: 1, text: 'You tear the cabinet doors off their hinges.' },
  },
  glovebox: {
    name: 'Abandoned pickup — glovebox',
    desc: 'A pickup slumps by the pumps, driver door ajar. The glovebox hangs open on a dead latch. Inside: dust, a cracked plastic saint on the dash, and something heavier tucked under the manuals.',
    loot: [['dead_phone', 1]],
    quiet: { risk: 5, noise: 2, ticks: 1, text: 'You ease the glovebox down and feel underneath the manuals.' },
    force: { risk: 4, noise: 9, ticks: 1, text: 'You yank the glovebox. The latch gives with a plastic crack.' },
  },
};

const SCAV_LOCS = {
  roadside: {
    name: 'ROADSIDE STOP — PROTOTYPE',
    desc: 'A gas station dead longer than you\'ve been alive. The pumps are husks. The store door hangs open like a mouth. You don\'t have to go in. That\'s the whole decision.',
    areas: ['shelves', 'fridge', 'backpack', 'cabinet', 'glovebox'],
  },
};

function initScavState(s) {
  if (!s.scav) s.scav = {};
  return s.scav;
}

/* Combined sim-state initializer (inventories + survival + scavenging).
   Defensive: only fills what's missing, so old saves migrate cleanly. */
function initSimState(s) {
  initInvState(s);
  initSurvState(s);
  initScavState(s);
  if (!('found' in s)) s.found = null;
  if (s.together === undefined) s.together = true;
  return s;
}

function scavLocState(locId) {
  initScavState(g);
  if (!g.scav[locId]) g.scav[locId] = { searched: {}, ground: [], risk: 0, noise: 0, noiseWarned: false };
  return g.scav[locId];
}

function scavGroundAdd(locId, itemId, qty) {
  const loc = scavLocState(locId);
  const ex = loc.ground.find(function (s) { return s.item === itemId; });
  if (ex) ex.qty += qty; else loc.ground.push({ item: itemId, qty: qty });
}

function scavTakeGround(idx) {
  const loc = scavLocState(g.scavLoc);
  const s = loc.ground[idx];
  if (!s) { scavScene(); return; }
  const who = g.invWho || 'josh';
  const r = invAdd(who, s.item, s.qty);
  if (r.leftover > 0) {
    s.qty = r.leftover;
    setFound(who, s.item, r.leftover, [], g.scavLoc);
    loc.ground.splice(idx, 1); // the found item now carries the remainder
  } else {
    loc.ground.splice(idx, 1);
  }
  saveProto();
  scavScene();
}

/* --- prototype entry ---------------------------------------------------- */
let protoDiff = 'survivor';

function setProtoDiff(v) {
  protoDiff = v;
  document.querySelectorAll('#protoDiff button').forEach(function (b) {
    b.classList.toggle('selected', b.dataset.mode === v);
  });
}

function scavProto() {
  document.body.classList.remove('cinema');
  protoDiff = 'survivor';
  screen('<h2>SCAVENGING PROTOTYPE</h2><div class="panel"><p>A Milestone 2 proof-of-concept. Separate from the story — nothing here touches your saved journey.</p><p class="muted">Find → Carry → Choose → Consume/Use → Consequence. One roadside stop. Two pairs of hands. Whatever you find, you carry.</p><div id="protoDiff"></div>' +
    btn('BEGIN PROTOTYPE', 'scavProtoStart()', 'primary') +
    btn('BACK TO TITLE', 'start()', 'choice') + '</div>');
  const pd = document.querySelector('#protoDiff');
  if (pd) {
    pd.innerHTML =
      diffOption('story', 'STORY', 'Forgiving. Slower hunger and thirst, calmer scavenging, more to find.') +
      diffOption('survivor', 'SURVIVOR', 'The intended experience. Balanced scarcity and pressure.') +
      diffOption('hardcore', 'HARDCORE SURVIVAL', 'Faster deterioration, scarcer finds, thinner margins.');
  }
}

function diffOption(mode, label, text) {
  return '<h3>' + label + '</h3><p>' + text + '</p>' +
    '<button class="choice' + (protoDiff === mode ? ' selected' : '') + '" data-mode="' + mode + '" onclick="setProtoDiff(\'' + mode + '\')">' +
    (protoDiff === mode ? '✓ ' : '') + 'SELECT ' + label + '</button>';
}

function scavProtoStart() {
  const mode = normDiff(protoDiff);
  g = {
    v: 6, name: 'Scout', sex: 'Male', difficulty: mode, day: 1, miles: 0,
    phase: 'scav', log: [], chapter: 0, consequences: [], flags: {}, npc: {},
    proto: true, together: true,
    crew: [{ name: 'Josh', hp: 100, fatigue: 0 }, { name: 'Mara', hp: 100, fatigue: 0 }],
    scavLoc: 'roadside', invWho: 'josh', invReturn: 'scav',
  };
  initSimState(g);
  // starter kits (prototype only — new Chapter One games start empty)
  invAdd('josh', 'water_bottle', 2);
  invAdd('josh', 'canned_food', 2);
  invAdd('josh', 'flashlight', 1);
  invAdd('josh', 'knife', 1); invEquip('josh', 'knife');
  invAdd('mara', 'water_bottle', 2);
  invAdd('mara', 'canned_food', 1);
  invAdd('mara', 'bandage', 2);
  invAdd('mara', 'dead_phone', 1);
  log('Prototype run started (' + DIFF_MODS[mode].label + ').');
  saveProto();
  scavScene();
}

/* --- prototype persistence (isolated key; real saves untouched) ---------- */
function saveProto() {
  if (g && g.proto) localStorage.setItem(PROTO_KEY, JSON.stringify(g));
}

function hasProtoSave() {
  try { return !!localStorage.getItem(PROTO_KEY); } catch (e) { return false; }
}

function resumeProto() {
  try {
    const s = JSON.parse(localStorage.getItem(PROTO_KEY));
    if (!s || !s.proto) throw Error();
    g = migrateSave(s);
    initSimState(g);
    render();
  } catch (e) { notify('No prototype save found.'); scavProto(); }
}

function clearProto() {
  try { localStorage.removeItem(PROTO_KEY); } catch (e) {}
}

/* --- the location scene -------------------------------------------------- */
function riskBar(loc) {
  const pct = Math.min(100, loc.risk);
  const col = pct >= 75 ? '#dc8c78' : pct >= 40 ? '#e8c96a' : '#b8d68a';
  return '<div class="bar"><span style="width:' + pct + '%;background:' + col + '"></span></div>' +
    '<p class="muted">RISK ' + Math.round(loc.risk) + ' · NOISE ' + Math.round(loc.noise) + '</p>';
}

function scavScene() {
  if (!g || !g.proto) return start();
  g.phase = 'scav';
  saveProto();
  const locId = g.scavLoc, loc = scavLocState(locId), def = SCAV_LOCS[locId];
  const who = g.invWho || 'josh';
  let h = '<h2>' + def.name + '</h2><p class="muted">' + def.desc + '</p>';
  h += riskBar(loc);
  h += '<p class="muted">' + escapeHtml(survStatusLine('josh')) + '<br>' + escapeHtml(survStatusLine('mara')) + '</p>';
  const warns = survWarning('josh').concat(survWarning('mara'));
  if (warns.length) h += '<p class="danger">' + escapeHtml(warns[0]) + '</p>';
  if (loc.noise >= 30 && !loc.noiseWarned) {
    loc.noiseWarned = true;
    h += '<p class="danger">' + blip('urgent') + ' That was loud. If anything is out there, it heard that — staying longer just got riskier.</p>';
  }

  if (g.takeAnim) {
    h += takeAnimPanel();
  } else if (g.found) {
    h += foundPanel();
  } else if (g.discovery) {
    h += discoveryPanel();
  } else {
    h += '<div class="eyebrow">SEARCHABLE AREAS — tap one</div><div class="area-grid">';
    def.areas.forEach(function (a) {
      const area = SCAV_AREAS[a], done = loc.searched[a];
      h += done
        ? '<div class="area-card done" aria-disabled="true">' + areaArtTag(a) +
          '<div class="area-name">✓ ' + escapeHtml(area.name) + ' <span class="searched-tag">SEARCHED</span></div></div>'
        : '<div class="area-card" role="button" tabindex="0" onclick="scavArea(\'' + a + '\')">' + areaArtTag(a) +
          '<div class="area-name">' + escapeHtml(area.name) + '</div></div>';
    });
    h += '</div>';
    if (loc.ground.length) {
      h += '<div class="eyebrow">ON THE GROUND HERE</div>';
      loc.ground.forEach(function (s, i) {
        const d = itemDef(s.item);
        h += btn('TAKE ' + s.qty + '× ' + d.name + ' (' + charName(who) + ')', 'scavTakeGround(' + i + ')', 'choice');
      });
    }
    const searched = def.areas.filter(function (a) { return loc.searched[a]; }).length;
    h += '<p class="muted">Searching as <b>' + charName(who) + '</b> — switch hands in the inventory. ' +
      searched + '/' + def.areas.length + ' areas searched.</p>';
    h += '<div class="actions">' +
      btn('INVENTORY', 'openInventory(\'scav\')', '') +
      btn('REST A WHILE', 'scavRest()', '') +
      btn('LEAVE THIS PLACE', 'scavEnd(false)', '') +
      btn('TITLE SCREEN', 'start()', '') + '</div>';
  }
  screen('<div class="panel">' + h + '</div>');
}

/* --- area focus ----------------------------------------------------------
   Tapping an illustrated card moves attention toward the object: the card
   art enlarges into a focus view (CSS zoom, staged so the interaction
   choices arrive a beat later), then SEARCH QUIETLY / FORCE IT appear as
   comic-blip decisions. Presentation only — the search mechanics below
   are untouched. */
function scavArea(areaId) {
  const area = SCAV_AREAS[areaId], loc = scavLocState(g.scavLoc);
  if (loc.searched[areaId]) { scavScene(); return; }
  screen('<div class="panel area-focus"><div class="eyebrow">FOCUS ' + blip('calm') + '</div>' +
    '<div class="focus-zoom">' + areaArtTag(areaId, 'focus-art') + '</div>' +
    '<h2>' + escapeHtml(area.name) + '</h2><p>' + area.desc + '</p>' +
    '<p class="muted">How do you work it?</p>' +
    '<div class="actions focus-choices">' +
    btn(blip('calm') + ' SEARCH QUIETLY — slow, careful', 'scavSearch(\'' + g.scavLoc + '\',\'' + areaId + '\',\'quiet\')', 'choice') +
    btn(blip('urgent') + ' FORCE IT — fast, loud', 'scavSearch(\'' + g.scavLoc + '\',\'' + areaId + '\',\'force\')', 'choice') +
    '</div>' +
    btn('STEP BACK', 'scavScene()', 'choice') + '</div>');
}

function scavSearch(locId, areaId, mode) {
  const loc = scavLocState(locId), area = SCAV_AREAS[areaId];
  if (!area || loc.searched[areaId]) { scavScene(); return { ok: false }; }
  const cfg = area[mode], mods = diffMods(g.difficulty);
  const noiseGain = Math.round(cfg.noise * mods.noiseMult);
  const riskGain = Math.round(cfg.risk * mods.riskMult * (1 + loc.noise / 60));
  loc.noise = Math.min(100, loc.noise + noiseGain);
  loc.risk = Math.min(120, loc.risk + riskGain);
  loc.searched[areaId] = true;
  const notes = simTick(cfg.ticks);
  const loot = area.loot
    .map(function (l, i) { return { item: l[0], qty: lootQtyFor(l[1], g.difficulty, i === 0) }; })
    .filter(function (l) { return l.qty > 0 && itemDef(l.item); });
  log(cfg.text + ' Risk +' + riskGain + ', noise +' + noiseGain + '.');
  const who = g.invWho || 'josh';
  if (loc.risk >= 100) {
    // No time to sort anything — what was found stays where it fell.
    loot.forEach(function (l) { scavGroundAdd(locId, l.item, l.qty); });
    g.discovery = null;
    saveProto();
    scavComplication();
    return { ok: true };
  }
  g.discovery = loot.length ? { who: who, loc: locId, loot: loot, choosing: false } : null;
  saveProto();
  if (notes.length) notify(notes[0]);
  scavScene();
  return { ok: true };
}

/* --- DISCOVERY interstitial ----------------------------------------------
   Prominent FOUND result shown before anything enters inventory. The
   discovered item's artwork is the hero of the moment: large for the
   headline find, with its name and inspect/story line. Story-significant
   finds (find:'major') get a bigger, more dramatic treatment; common loot
   stays quicker and more subtle. The player explicitly decides:
   TAKE ALL / CHOOSE ITEMS / LEAVE. Taking confirms which character's pack
   received it, then the artwork visibly flies into the pack (takeAnim).
   Full-pack overflow still routes through the existing FOUND state
   (grantLoot -> setFound); risk/noise/capacity mechanics are untouched. */
function discoveryHeroIdx(d) {
  for (let i = 0; i < d.loot.length; i++) {
    const def = itemDef(d.loot[i].item);
    if (def && def.find === 'major') return i;
  }
  return 0;
}

function discoveryPanel() {
  const d = g.discovery, who = d.who;
  const hi = discoveryHeroIdx(d), hero = d.loot[hi], hdef = itemDef(hero.item);
  const major = hdef && hdef.find === 'major';
  let h = '<div class="found discovery' + (major ? ' discovery-major' : '') + '">';
  h += '<div class="eyebrow">✦ FOUND ✦</div>';
  // the artwork is the hero: never wonder "did I actually find something?"
  h += artTag(hero.item, major ? 'hero-art' : 'hero-art minor');
  h += '<h3>' + escapeHtml(hdef.name) + (hero.qty > 1 ? ' ×' + hero.qty : '') + '</h3>';
  h += '<p class="storyline">' + escapeHtml(invInspect(hero.item)) + '</p>';
  if (!d.choosing) {
    const rest = d.loot.filter(function (l, i) { return i !== hi; });
    if (rest.length) {
      h += '<div class="eyebrow">ALSO HERE</div><div class="loot-list">';
      rest.forEach(function (l) {
        h += '<div class="loot-mini">' + artTag(l.item, 'mini-art') +
          '<span>' + escapeHtml(lootLabel(l)) + '</span></div>';
      });
      h += '</div>';
    }
    h += '<p class="muted">' + charName(who) + ' found ' +
      (d.loot.length > 1 ? 'these' : 'this') + ' — decide:</p>';
    h += '<div class="actions">' + btn('TAKE ALL', 'discoveryTakeAll()', 'primary');
    if (d.loot.length > 1) h += btn('CHOOSE ITEMS', 'discoveryChoose()', 'choice');
    h += btn('LEAVE IT ALL', 'discoveryLeaveAll()', 'choice') + '</div>';
  } else {
    h += '<p class="muted">Take or leave each one — nothing moves until you decide.</p>';
    d.loot.forEach(function (l, i) {
      h += '<div class="loot-row">' + artTag(l.item, 'mini-art') + '<span>' + lootLabel(l) + '</span>' +
        '<span class="loot-btns"><button onclick="discoveryTakeOne(' + i + ')">TAKE</button>' +
        '<button onclick="discoveryLeaveOne(' + i + ')">LEAVE</button></span></div>';
    });
    h += '<div class="actions">' + btn('TAKE ALL THE REST', 'discoveryTakeAll()', 'primary') +
      btn('LEAVE THE REST', 'discoveryLeaveAll()', 'choice') + '</div>';
  }
  h += '</div>';
  return h;
}

/* --- take transition: artwork visibly flies into the pack ----------------
   After TAKE, the item art animates into a pack icon and lands on the
   "Added to <Name>'s pack" confirmation. g.takeAnim is transient (like
   g.discovery); CONTINUE or a short auto-advance finalizes via
   takeAnimDone(). Mechanics unchanged — the grant already happened. */
function takeAnimPanel() {
  const t = g.takeAnim, first = t.items[0];
  let h = '<div class="take-anim"><div class="eyebrow">SECURED ' + blip('calm') + '</div>';
  h += '<div class="fly-wrap">' + artTag(first.item, 'fly-art') +
    '<div class="pack-target">' + packIcon() +
    '<div class="muted">' + escapeHtml(charName(t.who)) + '\'s pack</div></div></div>';
  h += '<h3>' + escapeHtml(t.msg) + '</h3>';
  if (t.items.length > 1) {
    h += '<div class="loot-list">';
    t.items.slice(1).forEach(function (l) {
      const dd = itemDef(l.item);
      h += '<div class="loot-mini">' + artTag(l.item, 'mini-art') +
        '<span>' + escapeHtml(dd.name) + (l.qty > 1 ? ' ×' + l.qty : '') + '</span></div>';
    });
    h += '</div>';
  }
  h += btn('CONTINUE', 'takeAnimDone()', 'primary') + '</div>';
  return h;
}

function takeAnimDone() {
  const t = g && g.takeAnim;
  if (!t) return;
  g.takeAnim = null;
  if (t.msg) notify(t.msg);
  saveProto();
  scavScene();
}
function lootLabel(l) {
  const def = itemDef(l.item);
  return (def ? def.name : l.item) + ' ×' + l.qty;
}

function discoveryTakeAll() {
  const d = g.discovery;
  if (!d) { scavScene(); return ''; }
  const names = d.loot.map(lootLabel).join(', ');
  const items = d.loot.map(function (l) { return { item: l.item, qty: l.qty }; });
  g.discovery = null;
  const allFit = grantLoot(d.who, d.loot, d.loc);
  const msg = allFit
    ? 'Added to ' + charName(d.who) + '\'s pack: ' + names + '.'
    : 'No room — decide what to do with it.';
  saveProto();
  if (allFit) {
    // artwork visibly flies into the pack before the confirmation lands
    g.takeAnim = { items: items, who: d.who, msg: msg };
    saveProto();
    scavScene();
    setTimeout(function () { takeAnimDone(); }, 1800);
  } else {
    notify(msg);
    scavScene();
  }
  return msg;
}

function discoveryChoose() {
  if (g.discovery) { g.discovery.choosing = true; saveProto(); }
  scavScene();
}

function discoveryLeaveAll() {
  const d = g.discovery;
  if (!d) { scavScene(); return ''; }
  d.loot.forEach(function (l) { scavGroundAdd(d.loc, l.item, l.qty); });
  g.discovery = null;
  const msg = 'Left where it lay.';
  notify(msg);
  saveProto();
  scavScene();
  return msg;
}

function discoveryTakeOne(i) {
  const d = g.discovery;
  if (!d || !d.loot[i]) { scavScene(); return ''; }
  const l = d.loot.splice(i, 1)[0];
  const r = invAdd(d.who, l.item, l.qty);
  let msg;
  if (r.leftover > 0) {
    // Partial fit: the remainder goes through the existing FOUND flow;
    // anything still undecided drops to the ground so nothing is lost
    // and nothing is silently auto-granted.
    d.loot.forEach(function (x) { scavGroundAdd(d.loc, x.item, x.qty); });
    g.discovery = null;
    setFound(d.who, l.item, r.leftover, [], d.loc);
    msg = 'No room for all of it — decide what to do with it.';
  } else {
    msg = 'Added to ' + charName(d.who) + '\'s pack: ' + lootLabel(l) + '.';
    g.takeAnim = { items: [{ item: l.item, qty: l.qty }], who: d.who, msg: msg };
    if (!d.loot.length) g.discovery = null;
  }
  saveProto();
  if (g.takeAnim) {
    scavScene();
    setTimeout(function () { takeAnimDone(); }, 1800);
  } else {
    notify(msg);
    scavScene();
  }
  return msg;
}

function discoveryLeaveOne(i) {
  const d = g.discovery;
  if (!d || !d.loot[i]) { scavScene(); return ''; }
  const l = d.loot.splice(i, 1)[0];
  scavGroundAdd(d.loc, l.item, l.qty);
  if (!d.loot.length) g.discovery = null;
  saveProto();
  scavScene();
  return '';
}

function scavRest() {
  const loc = scavLocState(g.scavLoc), mods = diffMods(g.difficulty);
  const notes = simTick(2);
  const m1 = restChar('josh'), m2 = restChar('mara');
  loc.risk = Math.min(120, loc.risk + Math.round(4 * mods.riskMult));
  log('Rested a while. Risk +' + Math.round(4 * mods.riskMult) + '.');
  notify(m1 + ' ' + m2);
  if (notes.length) setTimeout(function () { notify(notes[0]); }, 2500);
  saveProto();
  if (loc.risk >= 100) { scavComplication(); return; }
  scavScene();
}

function scavComplication() {
  const loc = scavLocState(g.scavLoc);
  log('Complication: movement outside. Time to go.');
  saveProto();
  screen('<div class="panel"><div class="eyebrow">RISK BOILS OVER ' + blip('danger') + '</div>' +
    '<p>Headlights sweep the lot — or something that wants you to think they did. A cart tips over out by the pumps with a sound like the world clearing its throat.</p>' +
    '<p>Nobody argues. You take what you can carry and go, quiet as dust.</p>' +
    '<p class="muted">What you left behind stays where it fell.</p>' +
    btn('SLIP AWAY', 'scavEnd(true)', 'primary') + '</div>');
}

function scavEnd(fled) {
  if (!g || !g.proto) return start();
  g.phase = 'scavend';
  saveProto();
  const loc = scavLocState(g.scavLoc), def = SCAV_LOCS[g.scavLoc];
  const n = def.areas.filter(function (a) { return loc.searched[a]; }).length;
  screen('<div class="panel"><div class="eyebrow">PROTOTYPE RUN ' + (fled ? '— CUT SHORT' : '— PAUSED') + '</div>' +
    '<h2>' + (fled ? 'Gone like smoke.' : 'You step back out into the dust.') + '</h2>' +
    '<p>' + n + '/' + def.areas.length + ' areas searched. ' +
    (loc.ground.length ? 'Some of what you found is still sitting on the ground in there.' : 'You carried out everything worth carrying.') + '</p>' +
    '<p class="muted">' + escapeHtml(survStatusLine('josh')) + '<br>' + escapeHtml(survStatusLine('mara')) + '</p>' +
    '<p class="muted">The loop, end to end: find → carry → choose → consume/use → consequence. That\'s the whole game, in miniature.</p>' +
    '<div class="actions">' +
    btn('INVENTORY', 'openInventory(\'scavend\')', '') +
    btn('GO BACK IN', 'scavScene()', '') +
    btn('NEW PROTOTYPE RUN', 'scavProto()', '') +
    btn('TITLE SCREEN', 'start()', '') + '</div></div>');
}

/* --- FOUND panel (no auto-discard, ever) ---------------------------------- */
function foundPanel() {
  const f = g.found, def = itemDef(f.item), acts = foundActions();
  const labels = { take: 'TAKE', give: 'GIVE TO ' + charName(invOther(f.who)).toUpperCase(), use: 'USE NOW', leave: 'LEAVE IT' };
  let h = '<div class="found"><div class="eyebrow">FOUND — ' + charName(f.who).toUpperCase() + ' HAS NO ROOM ' + blip('urgent') + '</div>' +
    artTag(f.item, 'found-art') +
    '<h3>' + f.qty + '× ' + def.name + '</h3><p class="muted">' + escapeHtml(def.desc) + '</p>' +
    '<p>Nothing is thrown away for you. Decide:</p><div class="actions">';
  acts.forEach(function (a) {
    h += btn(labels[a], 'resolveFoundUI(\'' + a + '\')', a === 'leave' ? '' : 'primary');
  });
  h += '</div></div>';
  return h;
}

function resolveFoundUI(action) {
  const r = resolveFound(action);
  notify(r.msg);
  saveProto();
  scavScene();
}

/* --- inventory entry from prototype -------------------------------------- */
function openInventory(ret) {
  g.invReturn = ret || 'scav';
  if (!g.invWho) g.invWho = 'josh';
  g.invSel = null;
  g.phase = 'inv';
  saveProto();
  invScreen();
}
