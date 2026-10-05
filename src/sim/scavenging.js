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
};

const SCAV_LOCS = {
  roadside: {
    name: 'ROADSIDE STOP — PROTOTYPE',
    desc: 'A gas station dead longer than you\'ve been alive. The pumps are husks. The store door hangs open like a mouth. You don\'t have to go in. That\'s the whole decision.',
    areas: ['shelves', 'fridge', 'backpack', 'cabinet'],
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
    h += '<p class="danger">That was loud. If anything is out there, it heard that — staying longer just got riskier.</p>';
  }

  if (g.found) {
    h += foundPanel();
  } else {
    h += '<div class="eyebrow">SEARCHABLE AREAS — tap one</div><div class="actions">';
    def.areas.forEach(function (a) {
      const area = SCAV_AREAS[a], done = loc.searched[a];
      h += done
        ? '<button disabled>✓ ' + area.name + ' — searched</button>'
        : '<button onclick="scavArea(\'' + a + '\')">' + area.name + '</button>';
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

function scavArea(areaId) {
  const area = SCAV_AREAS[areaId], loc = scavLocState(g.scavLoc);
  if (loc.searched[areaId]) { scavScene(); return; }
  screen('<div class="panel"><h2>' + area.name + '</h2><p>' + area.desc + '</p>' +
    '<p class="muted">How do you work it?</p>' +
    btn('SEARCH QUIETLY — slow, careful', 'scavSearch(\'' + g.scavLoc + '\',\'' + areaId + '\',\'quiet\')', 'choice') +
    btn('FORCE IT — fast, loud', 'scavSearch(\'' + g.scavLoc + '\',\'' + areaId + '\',\'force\')', 'choice') +
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
  const allFit = grantLoot(who, loot, locId);
  saveProto();
  if (loc.risk >= 100) { scavComplication(); return { ok: true }; }
  if (!allFit) notify('No room — decide what to do with it.');
  if (notes.length) notify(notes[0]);
  scavScene();
  return { ok: true };
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
  screen('<div class="panel"><div class="eyebrow">RISK BOILS OVER</div>' +
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
  let h = '<div class="found"><div class="eyebrow">FOUND — ' + charName(f.who).toUpperCase() + ' HAS NO ROOM</div>' +
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
