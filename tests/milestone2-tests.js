// Milestone 2 tests: inventory, survival, difficulty, scavenging prototype,
// v6 migration, Chapter One preservation. Run with node.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const js = html.split('<script>')[1].split('</scr' + 'ipt>')[0];

let pass = 0, fail = 0;
function check(name, cond, extra = '') {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.log('  FAIL', name, extra); }
}

function fresh() {
  const store = {};
  const screens = [];
  const appObj = {};
  Object.defineProperty(appObj, 'innerHTML', { set(v) { screens.push(v); }, get() { return ''; } });
  const elems = {};
  const fakeEl = (s) => {
    if (!elems[s]) {
      const e = { textContent: '', style: {}, classList: { remove() {}, toggle() {} }, value: '' };
      Object.defineProperty(e, 'innerHTML', { set(v) { screens.push(v); }, get() { return ''; } });
      elems[s] = e;
    }
    return elems[s];
  };
  const ctx = {
    console, Math, JSON, Object, Array, String, Number, Boolean, Error, parseInt, parseFloat,
    setTimeout: () => 0, confirm: () => true,
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    document: {
      querySelector: (s) => s === '#app' ? appObj : fakeEl(s),
      querySelectorAll: () => [],
      body: { classList: { remove() {}, add() {} } },
    },
    window: { scrollTo() {} },
  };
  ctx.window.top = ctx.window;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  const code = js.replace(/start\(\);?\s*$/, '') + `\n;globalThis.__api = { begin, migrateSave, render,
  initSimState, invAdd, invRemove, invHas, invCount, invUsedSlots, invFreeSlots, invFits,
  invUseItem, invEquip, invUnequip, invGive, invDrop, invInspect, itemActions, itemDef,
  grantLoot, setFound, clearFound, foundActions, resolveFound,
  normDiff, diffMods, lootQtyFor, simTick, survOf, survAddCondition, survRemoveCondition,
  restChar, hungerLabel, thirstLabel, healthLabel, survStatusLine, survWarning,
  scavProtoStart, scavScene, scavArea, scavSearch, scavRest, scavEnd, scavLocState,
  scavGroundAdd, scavTakeGround, saveProto, resumeProto, hasProtoSave, scavProto,
  lootLabel, discoveryPanel, discoveryTakeAll, discoveryChoose,
  discoveryTakeOne, discoveryLeaveOne, discoveryLeaveAll,
  itemArt, artTag, blip, packIcon, takeAnimDone, discoveryHeroIdx,
  areaArt, areaArtTag, areaArtId,
  charLayerArt, charLayerImg, charBadge, renderCharacter,
  charTestLayers, invToggleCharLayer, invUnequipSlot,
  registerTestItems,
  CHAR_CANVAS, CHAR_ANCHORS, CHAR_LAYER_ORDER, CHAR_ANCHOR_RULES,
  CHAR_LAYER_SPEC, CHAR_EQUIP_BINDING,
  openInventory, invScreen, invShow, invSelect, invDo,
  has: (n) => typeof globalThis[n] !== 'undefined',
  getG: () => g, setG: v => { g = v; },
  setPlayerName: v => { playerName = v; }, setSexSel: v => { sex = v; },
  setDiff: v => { difficulty = v; }, setCarSel: v => { car = v; },
  getStore: k => null, setStore: (k, v) => {} };`;
  vm.runInContext(code, ctx);
  const api = ctx.__api;
  api.getStore = k => store[k] ?? null;
  api.setStore = (k, v) => { store[k] = String(v); };
  api.newGame = (sex = 'Male') => { api.setPlayerName('Tester'); api.setSexSel(sex); api.setDiff('survivor'); api.setCarSel('eagle'); api.begin(); };
  api.lastScreen = () => screens[screens.length - 1];
  return api;
}

// ---------- M2A: inventory core ----------
console.log('M2A inventory core');
{
  const a = fresh(); a.newGame();
  const g = a.getG();
  check('v6 stamped', g.v === 6);
  check('both packs initialized empty', g.inv.josh.slots.length === 0 && g.inv.mara.slots.length === 0);
  check('10 slots each', a.invFreeSlots('josh') === 10 && a.invFreeSlots('mara') === 10);
  check('together by default', g.together === true && g.found === null);

  let r = a.invAdd('josh', 'water_bottle', 2);
  check('add stacks', r.added === 2 && r.leftover === 0 && a.invCount('josh', 'water_bottle') === 2);
  check('one stack, one slot', a.getG().inv.josh.slots.length === 1 && a.invUsedSlots('josh') === 1);
  r = a.invAdd('josh', 'water_bottle', 3);
  check('partial stack fills then new stack', r.added === 3 && a.getG().inv.josh.slots.length === 2 && a.invCount('josh', 'water_bottle') === 5);

  r = a.invAdd('josh', 'knife', 1);
  check('size-2 item costs 2 slots', a.invUsedSlots('josh') === 4, 'used=' + a.invUsedSlots('josh'));

  // fill to capacity with size-1 non-stackables
  for (let i = 0; i < 6; i++) a.invAdd('josh', 'flashlight', 1);
  check('pack full at 10', a.invUsedSlots('josh') === 10, 'used=' + a.invUsedSlots('josh'));
  r = a.invAdd('josh', 'canned_food', 1);
  check('overflow rejected, nothing lost', r.added === 0 && r.leftover === 1 && a.invCount('josh', 'canned_food') === 0);
  check('invFits false when full', a.invFits('josh', 'canned_food', 1) === false);

  const rem = a.invRemove('josh', 'flashlight', 2);
  check('remove works', rem === 2 && a.invCount('josh', 'flashlight') === 4);
  check('invHas', a.invHas('josh', 'water_bottle', 5) && !a.invHas('josh', 'water_bottle', 6));

  // USE: water eases thirst
  a.survOf('josh').thirst = 2;
  const u = a.invUseItem('josh', 'water_bottle');
  check('drink eases thirst', u.ok && a.survOf('josh').thirst === 1 && a.invCount('josh', 'water_bottle') === 4);
  a.survOf('josh').thirst = 0;
  check('USE hidden when not thirsty', a.itemActions('josh', 'water_bottle').indexOf('use') < 0);
  const u2 = a.invUseItem('josh', 'water_bottle');
  check('USE refused when not thirsty, item kept', !u2.ok && a.invCount('josh', 'water_bottle') === 4);

  // EQUIP
  const e = a.invEquip('josh', 'knife');
  check('equip weapon', e.ok && a.getG().inv.josh.equipment.weapon === 'knife');
  check('equipped frees pack slots', a.invUsedSlots('josh') === 5, 'used=' + a.invUsedSlots('josh'));
  const ue = a.invUnequip('josh', 'weapon');
  check('unequip stows', ue.ok && a.getG().inv.josh.equipment.weapon === null);

  // GIVE
  const gv = a.invGive('josh', 'mara', 'flashlight', 1);
  check('give works when together', gv.ok && a.invCount('mara', 'flashlight') === 1);
  a.getG().together = false;
  const gv2 = a.invGive('josh', 'mara', 'flashlight', 1);
  check('give refused when separated', !gv2.ok && a.invCount('josh', 'flashlight') === 3);
  a.getG().together = true;

  // story item: inspect/drop only (+give when together)
  const acts = a.itemActions('mara', 'dead_phone');
  check('story item actions limited', acts.indexOf('use') < 0 && acts.indexOf('equip') < 0 &&
    acts.indexOf('inspect') >= 0 && acts.indexOf('drop') >= 0, acts.join(','));
  check('inspect text exists', a.invInspect('dead_phone').length > 20);

  // DROP in a scav location -> ground (loot persists there)
  const p = fresh(); p.scavProtoStart();
  p.invAdd('josh', 'rope', 1);
  const d = p.invDrop('josh', 'rope', 1);
  const ground = p.scavLocState('roadside').ground;
  check('drop lands on location ground', d.ok && ground.some(s => s.item === 'rope'));
}

// ---------- M2B: survival ----------
console.log('M2B survival');
{
  const a = fresh(); a.scavProtoStart(); // survivor difficulty
  a.simTick(2);
  check('thirst advances before hunger (survivor)', a.survOf('josh').thirst === 1 && a.survOf('josh').hunger === 0);
  a.simTick(1);
  check('hunger follows', a.survOf('josh').hunger === 1);

  const b = fresh(); b.scavProtoStart();
  b.getG().difficulty = 'story';
  b.simTick(3);
  check('story deteriorates slower', b.survOf('josh').thirst === 0, 'thirst=' + b.survOf('josh').thirst);
  const c = fresh(); c.scavProtoStart();
  c.getG().difficulty = 'hardcore';
  c.simTick(1);
  check('hardcore deteriorates faster', c.survOf('josh').thirst === 1 && c.survOf('mara').hunger === 0);

  // neglect at Dehydrated worsens health gradually (survivor: every 2 ticks)
  const d = fresh(); d.scavProtoStart();
  d.survOf('josh').thirst = 3;
  d.simTick(1);
  check('one tick at dehydrated: still holding', d.survOf('josh').health === 'healthy');
  d.simTick(1);
  check('neglect worsens health', d.survOf('josh').health === 'hurt');

  // contextual treatment: bandage cures bleeding, not infection
  const e = fresh(); e.scavProtoStart();
  e.survAddCondition('mara', 'bleeding');
  e.invAdd('mara', 'bandage', 1);
  const t1 = e.invUseItem('mara', 'bandage');
  check('bandage cures bleeding', t1.ok && e.survOf('mara').conditions.indexOf('bleeding') < 0);
  e.survAddCondition('mara', 'infection');
  const t2 = e.invUseItem('mara', 'bandage');
  check('bandage useless vs infection', !t2.ok && e.survOf('mara').conditions.indexOf('infection') >= 0);
  e.invAdd('mara', 'antiseptic', 1);
  const t3 = e.invUseItem('mara', 'antiseptic');
  check('antiseptic cures infection', t3.ok && e.survOf('mara').conditions.indexOf('infection') < 0);

  // medkit stabilizes one step, not a full heal
  const f = fresh(); f.scavProtoStart();
  f.survOf('josh').health = 'badly_hurt';
  f.invAdd('josh', 'medkit', 1);
  const t4 = f.invUseItem('josh', 'medkit');
  check('medkit stabilizes one step', t4.ok && f.survOf('josh').health === 'hurt');

  // recovery needs the combination: fed + hydrated + no acute condition + time
  // (story: thirst advances every 4 ticks, recovery every 2 — room to heal)
  const h = fresh(); h.scavProtoStart();
  h.getG().difficulty = 'story';
  h.survOf('mara').health = 'hurt';
  h.simTick(2);
  check('recovery with food+water+time', h.survOf('mara').health === 'healthy');
  const h2 = fresh(); h2.scavProtoStart();
  h2.survOf('mara').health = 'hurt';
  h2.survOf('mara').thirst = 2;
  h2.simTick(6);
  check('no recovery while thirsty — neglect worsens instead', h2.survOf('mara').health === 'critical');

  // labels + status line
  check('labels', a.hungerLabel(3) === 'Starving' && a.thirstLabel(3) === 'Dehydrated' && a.healthLabel('badly_hurt') === 'Badly Hurt');
  check('status line mentions states', a.survStatusLine('josh').indexOf('Mara') < 0 && a.survStatusLine('josh').indexOf('Josh') === 0);
}

// ---------- M2C: difficulty ----------
console.log('M2C difficulty');
{
  const a = fresh(); a.newGame();
  check('legacy aliases map', a.normDiff('hard') === 'hardcore' && a.normDiff('survival') === 'survivor' && a.normDiff('story') === 'story');
  check('unknown defaults to survivor', a.normDiff('bogus') === 'survivor' && a.normDiff(undefined) === 'survivor');
  const s = a.diffMods('story'), v = a.diffMods('survivor'), h = a.diffMods('hardcore');
  check('pressure scales story<survivor<hardcore', s.thirstEvery > v.thirstEvery && v.thirstEvery > h.thirstEvery);
  check('risk scales', s.riskMult < v.riskMult && v.riskMult < h.riskMult);
  check('loot bonus: story +1, hardcore -1', a.lootQtyFor(2, 'story', true) === 3 && a.lootQtyFor(2, 'hardcore', true) === 1 && a.lootQtyFor(2, 'survivor', true) === 2);
  check('loot bonus only on first stack', a.lootQtyFor(2, 'story', false) === 2);
}

// ---------- M2D: scavenging prototype ----------
console.log('M2D scavenging');
{
  const a = fresh(); a.scavProtoStart();
  const g0 = a.getG();
  check('prototype state isolated', g0.proto === true && g0.v === 6);
  const before = a.invCount('josh', 'canned_food');
  const r = a.scavSearch('roadside', 'shelves', 'quiet');
  check('search opens discovery, grants nothing yet', r.ok && !!a.getG().discovery && a.invCount('josh', 'canned_food') === before);
  check('discovery lists exact loot', a.getG().discovery.loot.length === 2 && a.getG().discovery.loot[0].item === 'canned_food' && a.getG().discovery.loot[0].qty === 2);
  const takeMsg = a.discoveryTakeAll();
  check('take all grants to searching character', a.invCount('josh', 'canned_food') === before + 2);
  check('confirmation names the character', takeMsg.indexOf("Added to Josh's pack") === 0, takeMsg);
  check('area marked searched', a.scavLocState('roadside').searched.shelves === true);
  const n1 = a.invCount('josh', 'water_bottle');
  a.scavSearch('roadside', 'shelves', 'quiet');
  check('re-search gives nothing', a.invCount('josh', 'water_bottle') === n1);

  const b = fresh(); b.scavProtoStart();
  b.scavSearch('roadside', 'backpack', 'quiet');
  const noiseQuiet = b.scavLocState('roadside').noise;
  const c = fresh(); c.scavProtoStart();
  c.scavSearch('roadside', 'backpack', 'force');
  const noiseForce = c.scavLocState('roadside').noise;
  check('force is louder than quiet', noiseForce > noiseQuiet, noiseQuiet + ' vs ' + noiseForce);

  // risk boil-over forces a complication, not a fight
  const d = fresh(); d.scavProtoStart();
  d.scavLocState('roadside').risk = 99;
  d.scavSearch('roadside', 'fridge', 'force');
  check('risk 100 forces complication', d.lastScreen().indexOf('RISK BOILS OVER') >= 0);
  check('fleeing grounds the loot instead of granting it', d.scavLocState('roadside').ground.some(s => s.item === 'mre') && !d.getG().discovery);

  // loot persistence through save/load: searched stays searched, ground stays
  const e = fresh(); e.scavProtoStart();
  e.scavSearch('roadside', 'shelves', 'quiet');
  e.invAdd('josh', 'rope', 1);
  e.invDrop('josh', 'rope', 1); // onto the ground
  e.saveProto();
  const snap = e.getStore('longroad_proto');
  const f = fresh();
  f.setStore('longroad_proto', snap);
  check('proto save detected', f.hasProtoSave());
  f.resumeProto();
  check('searched persists after load', f.scavLocState('roadside').searched.shelves === true);
  check('ground persists after load', f.scavLocState('roadside').ground.some(s => s.item === 'rope'));
  check('pending discovery survives save/load', !!f.getG().discovery && f.getG().discovery.loot.length === 2);
  const wBefore = f.invCount('josh', 'water_bottle');
  f.scavSearch('roadside', 'shelves', 'quiet');
  check('re-entry does not regenerate loot', f.invCount('josh', 'water_bottle') === wBefore);

  // FOUND state: full pack + loot -> no auto-discard, resolve via LEAVE
  const p = fresh(); p.scavProtoStart();
  p.invRemove('josh', 'water_bottle', 2); // clear starter stacks so nothing can merge
  p.invRemove('josh', 'canned_food', 2);
  p.invRemove('josh', 'flashlight', 1);
  for (let i = 0; i < 10; i++) p.invAdd('josh', 'flashlight', 1);
  p.getG().invWho = 'josh';
  p.scavSearch('roadside', 'shelves', 'quiet');
  check('discovery opens before the FOUND flow', !!p.getG().discovery);
  p.discoveryTakeAll();
  check('FOUND state opens on overflow', !!p.getG().found && p.getG().found.item === 'canned_food');
  check('found actions include leave, not auto-take', p.foundActions().indexOf('leave') >= 0);
  const fr = p.resolveFound('leave');
  check('LEAVE drops remainder to ground', fr.ok && p.scavLocState('roadside').ground.some(s => s.item === 'canned_food'));
  check('rest of loot queues next', !!p.getG().found && p.getG().found.item === 'water_bottle');
  p.resolveFound('leave');
  check('FOUND cleared after rest resolved', p.getG().found === null);
}

// ---------- M2E: v6 migration ----------
console.log('M2E migration');
{
  const a = fresh();
  const old = { v: 5, name: 'Old', sex: 'Male', difficulty: 'survivor', crew: [{ name: 'Josh' }, { name: 'Mara' }], phase: 'phase1_done', flags: {}, log: [] };
  const m = a.migrateSave(JSON.parse(JSON.stringify(old)));
  check('v5 -> v6', m.v === 6);
  check('empty packs on migrate', m.inv.josh.slots.length === 0 && m.inv.mara.slots.length === 0);
  check('neutral survival on migrate', m.surv.josh.hunger === 0 && m.surv.mara.thirst === 0 && m.surv.josh.health === 'healthy');
  check('scav + together defaults', JSON.stringify(m.scav) === '{}' && m.together === true && m.found === null);
  check('legacy difficulty value preserved', m.difficulty === 'survivor' && a.normDiff(m.difficulty) === 'survivor');
}

// ---------- M2F: Chapter One preservation ----------
console.log('M2F preservation');
{
  const ch1 = fs.readFileSync(path.join(__dirname, '..', 'src', 'chapters', 'chapter1.js'), 'utf8');
  const banned = ['invAdd', 'scavProto', 'simTick', 'Math.random', 'makeRng', 'SCAVENGING PROTOTYPE', 'g.inv', 'g.surv'];
  let clean = true;
  banned.forEach(function (t) { if (ch1.indexOf(t) >= 0) { clean = false; console.log('   LEAKED INTO CH1:', t); } });
  check('no M2 systems leak into chapter1.js', clean);
  check('phase1Done has no prototype entry', ch1.indexOf('scavProto') < 0);
  const eng = fs.readFileSync(path.join(__dirname, '..', 'src', 'core', 'engine.js'), 'utf8');
  check('prototype entry lives on title screen only', eng.indexOf('SCAVENGING PROTOTYPE') >= 0);

  const a = fresh(); a.newGame();
  const g = a.getG();
  check('crew still Josh + Mara, no Eli', g.crew.length === 2 && !g.crew.some(c => c.name === 'Eli'));
  const srcAll = ['state.js', 'engine.js', 'ui.js', 'globals.js'].map(f => fs.readFileSync(path.join(__dirname, '..', 'src', 'core', f), 'utf8')).join('\n');
  check('no trust++ anywhere in core', srcAll.indexOf('trust++') < 0 && srcAll.indexOf('trust --') < 0);

  // combat stays dormant: no live caller outside sim/combat.js
  const simFiles = fs.readdirSync(path.join(__dirname, '..', 'src', 'sim')).filter(f => f !== 'combat.js');
  const chapters = fs.readdirSync(path.join(__dirname, '..', 'src', 'chapters'));
  let dormant = true;
  simFiles.concat(['core/engine.js', 'core/state.js']).forEach(function (f) {
    const p = path.join(__dirname, '..', 'src', f.indexOf('/') >= 0 ? f : 'sim/' + f);
    const body = fs.readFileSync(p, 'utf8');
    if (/[^a-zA-Z]beginBattle\s*\(/.test(body)) { dormant = false; console.log('   LIVE COMBAT CALLER:', f); }
  });
  chapters.forEach(function (f) {
    const body = fs.readFileSync(path.join(__dirname, '..', 'src', 'chapters', f), 'utf8');
    if (/[^a-zA-Z]beginBattle\s*\(/.test(body)) { dormant = false; console.log('   LIVE COMBAT CALLER:', f); }
  });
  check('combat still dormant', dormant);
}

// ---------- M2G: UI render smoke (templates don't throw, key elements present) ----------
console.log('M2G render smoke');
{
  const a = fresh(); a.scavProtoStart();
  check('scav scene renders', a.lastScreen().indexOf('ROADSIDE STOP') >= 0);
  a.scavArea('fridge');
  check('area detail renders', a.lastScreen().indexOf('Refrigerator') >= 0 && a.lastScreen().indexOf('FORCE IT') >= 0);
  a.openInventory('scav');
  let s = a.lastScreen();
  check('inventory renders with tabs', s.indexOf('INVENTORY') >= 0 && s.indexOf('JOSH') >= 0 && s.indexOf('MARA') >= 0);
  check('character + layered figure shown', s.indexOf('char-figure') >= 0 && s.indexOf('LAYERS (TEST)') >= 0 && s.indexOf('IN THE BAG') >= 0);
  check('layer toggles present', s.indexOf('JACKET:') >= 0 && s.indexOf('BACKPACK:') >= 0);
  a.invShow('mara');
  check('tab switch renders Mara', a.lastScreen().indexOf('Bandage') >= 0);
  a.invShow('josh');
  a.getG().invSel = { who: 'josh', idx: 0 }; // water_bottle stack
  a.invScreen();
  s = a.lastScreen();
  check('item detail shows contextual actions', s.indexOf('Bottled Water') >= 0 && s.indexOf('INSPECT') >= 0 && s.indexOf('DROP') >= 0);
  a.getG().invSel = { who: 'josh', idx: 2 }; // flashlight (utility)
  a.invScreen();
  check('utility offers EQUIP', a.lastScreen().indexOf('EQUIP') >= 0);
  a.scavEnd(false);
  check('end screen renders', a.lastScreen().indexOf('PROTOTYPE RUN') >= 0);
  // difficulty picker on the prototype intro
  const b = fresh(); b.scavProto();
  check('intro shows difficulty choice', b.lastScreen().indexOf('HARDCORE SURVIVAL') >= 0);
}

// ---------- M2H: discovery interstitial (Milestone 2 polish) ----------
console.log('M2H discovery interstitial');
{
  // search -> discovery lists exact items, nothing enters inventory first
  const a = fresh(); a.scavProtoStart();
  const before = a.invCount('josh', 'canned_food');
  const r = a.scavSearch('roadside', 'shelves', 'quiet');
  const d = a.getG().discovery;
  check('search opens discovery, grants nothing yet', r.ok && !!d && a.invCount('josh', 'canned_food') === before);
  check('discovery holds exact loot', d.loot.length === 2 && d.loot[0].item === 'canned_food' && d.loot[0].qty === 2 && d.loot[1].item === 'water_bottle' && d.loot[1].qty === 1);
  const scr = a.lastScreen();
  check('discovery panel is prominent', scr.indexOf('✦ FOUND ✦') >= 0 && scr.indexOf('Canned Food ×2') >= 0 && scr.indexOf('Bottled Water ×1') >= 0);
  check('contextual options shown', scr.indexOf('TAKE ALL') >= 0 && scr.indexOf('CHOOSE ITEMS') >= 0 && scr.indexOf('LEAVE IT ALL') >= 0);

  // TAKE ALL -> confirmation names the character
  const msg = a.discoveryTakeAll();
  check('take all clears discovery', a.getG().discovery === null);
  check('take all grants to the searching character', a.invCount('josh', 'canned_food') === before + 2 && a.invCount('josh', 'water_bottle') === 3);
  check('confirmation names the character and the loot', msg.indexOf("Added to Josh's pack:") === 0 && msg.indexOf('Canned Food ×2') >= 0, msg);

  // LEAVE -> ground, inventory untouched
  const b = fresh(); b.scavProtoStart();
  const wb = b.invCount('josh', 'water_bottle');
  b.scavSearch('roadside', 'backpack', 'quiet');
  b.discoveryLeaveAll();
  check('leave clears discovery', b.getG().discovery === null);
  const gr = b.scavLocState('roadside').ground;
  check('left items sit on the ground', gr.some(s => s.item === 'bandage') && gr.some(s => s.item === 'ammo_9mm'));
  check('leave adds nothing to packs', b.invCount('josh', 'water_bottle') === wb && b.invCount('josh', 'bandage') === 0);

  // CHOOSE ITEMS -> per-item take/leave
  const c = fresh(); c.scavProtoStart();
  c.scavSearch('roadside', 'shelves', 'quiet');
  c.discoveryChoose();
  check('choose mode renders per-item rows', c.lastScreen().indexOf('loot-row') >= 0);
  const tmsg = c.discoveryTakeOne(0); // Canned Food ×2
  check('take one grants only that item', c.invCount('josh', 'canned_food') === 4 && c.getG().discovery.loot.length === 1);
  check('take-one confirmation names the character', tmsg.indexOf("Added to Josh's pack: Canned Food ×2") === 0, tmsg);
  check('discovery still pending for the rest', !!c.getG().discovery);
  c.discoveryLeaveOne(0); // Bottled Water ×1
  check('deciding everything clears discovery', c.getG().discovery === null);
  check('left item sits on the ground', c.scavLocState('roadside').ground.some(s => s.item === 'water_bottle'));

  // single-item discovery hides CHOOSE ITEMS (nothing to choose between)
  const e = fresh(); e.scavProtoStart();
  e.scavSearch('roadside', 'fridge', 'quiet');
  const escr = e.lastScreen();
  check('single item: choose hidden, take/leave shown', escr.indexOf('CHOOSE ITEMS') < 0 && escr.indexOf('TAKE ALL') >= 0 && escr.indexOf('LEAVE IT ALL') >= 0);

  // searching as Mara -> Mara's pack, Mara named
  const f = fresh(); f.scavProtoStart();
  f.getG().invWho = 'mara';
  f.scavSearch('roadside', 'backpack', 'quiet');
  check('discovery records the searching character', f.getG().discovery.who === 'mara');
  const mb = f.invCount('mara', 'bandage');
  const fmsg = f.discoveryTakeAll();
  check('take all lands in Mara\'s pack', f.invCount('mara', 'bandage') === mb + 1);
  check('confirmation names Mara', fmsg.indexOf("Added to Mara's pack:") === 0, fmsg);

  // risk/noise and searched state are unaffected by the interstitial
  const g2 = fresh(); g2.scavProtoStart();
  g2.scavSearch('roadside', 'backpack', 'quiet');
  const loc = g2.scavLocState('roadside');
  check('risk and noise still accrue', loc.risk > 0 && loc.noise > 0);
  check('area marked searched while discovery pending', loc.searched.backpack === true);

  // choose-mode overflow still routes through FOUND; undecided items grounded
  const h = fresh(); h.scavProtoStart();
  h.invRemove('josh', 'water_bottle', 2);
  h.invRemove('josh', 'canned_food', 2);
  h.invRemove('josh', 'flashlight', 1);
  for (let i = 0; i < 10; i++) h.invAdd('josh', 'flashlight', 1);
  h.getG().invWho = 'josh';
  h.scavSearch('roadside', 'shelves', 'quiet');
  h.discoveryChoose();
  h.discoveryTakeOne(0); // Canned Food ×2, no room at all
  check('choose overflow opens FOUND, clears discovery', !!h.getG().found && h.getG().discovery === null);
  check('undecided item grounded, not lost', h.scavLocState('roadside').ground.some(s => s.item === 'water_bottle'));
}

// ---------- M2J: item art wiring (M2 UX pass) ----------
console.log('M2J item art wiring');
{
  // schema: every item carries art + find; only dead_phone is major
  const ids = ['water_bottle','canned_food','mre','bandage','antiseptic','medkit','splint','knife','tire_iron','flashlight','rope','ammo_9mm','dead_phone'];
  const t = fresh();
  check('all 13 items have art paths', ids.every(id => t.itemDef(id) && t.itemDef(id).art === 'assets/items/' + id + '.webp'));
  check('find prominence: dead_phone major, rest minor',
    t.itemDef('dead_phone').find === 'major' && ids.filter(id => id !== 'dead_phone').every(id => t.itemDef(id).find === 'minor'));
  // mechanics untouched by the new fields
  check('mechanics intact: equip/use still defined', t.itemDef('knife').equip === 'weapon' && t.itemDef('water_bottle').use.thirst === -1 && t.itemDef('bandage').use.cure === 'bleeding');

  // itemArt: asset-path fallback when no ITEM_ART map is inlined
  check('itemArt falls back to asset path', t.itemArt('knife') === 'assets/items/knife.webp');
  check('itemArt unknown id -> null (graceful)', t.itemArt('nope') === null);

  // itemArt: data-URI branch when a preview build inlines ITEM_ART
  {
    const c2 = { ITEM_ART: { knife: 'data:image/webp;base64,AAA' },
      itemDef: (id) => id === 'knife' ? { art: 'assets/items/knife.webp' } : null,
      escapeHtml: (s) => String(s) };
    vm.createContext(c2);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src/sim/art.js'), 'utf8'), c2);
    check('itemArt prefers inlined data URI', vm.runInContext('itemArt("knife")', c2) === 'data:image/webp;base64,AAA');
    check('itemArt data-URI artTag embeds it', vm.runInContext('artTag("knife")', c2).indexOf('src="data:image/webp;base64,AAA"') >= 0);
  }

  // artTag: img with alt text; fallback glyph when art missing
  const tag = t.artTag('knife', 'hero-art');
  check('artTag renders img with item name alt', tag.indexOf('<img') >= 0 && tag.indexOf('alt="Hunting Knife"') >= 0 && tag.indexOf('hero-art') >= 0);
  check('artTag degrades gracefully', t.artTag('nope').indexOf('art-fallback') >= 0 && t.artTag('nope').indexOf('<img') < 0);

  // blip variants
  check('blip calm', t.blip('calm').indexOf('blip-calm') >= 0);
  check('blip talk', t.blip('talk').indexOf('blip-talk') >= 0);
  check('blip danger', t.blip('danger').indexOf('blip-danger') >= 0);
  check('blip urgent', t.blip('urgent').indexOf('blip-urgent') >= 0);
  check('blip unknown -> calm', t.blip('zzz').indexOf('blip-calm') >= 0);
  check('blips never eat taps', t.blip('danger').indexOf('aria-hidden="true"') >= 0);

  // glovebox: new searchable area, story-significant loot
  const u = fresh(); u.scavProtoStart();
  check('glovebox is a searchable area', u.lastScreen().indexOf('Abandoned pickup') >= 0);
  u.scavSearch('roadside', 'glovebox', 'quiet');
  check('glovebox search discovers the dead phone', !!u.getG().discovery && u.getG().discovery.loot.some(l => l.item === 'dead_phone'));
  const gscr = u.lastScreen();
  check('story find gets the major dramatic treatment', gscr.indexOf('discovery-major') >= 0);
  check('discovery shows art + inspect line', gscr.indexOf('artwrap') >= 0 && gscr.indexOf('Dead Phone') >= 0 && gscr.indexOf('15&#39;s the one') >= 0);

  // common find stays subtle (minor treatment, still unmistakable)
  const v = fresh(); v.scavProtoStart();
  v.scavSearch('roadside', 'shelves', 'quiet');
  const vscr = v.lastScreen();
  check('common find: no major treatment', vscr.indexOf('discovery-major') < 0);
  check('common find: hero art + exact loot', vscr.indexOf('artwrap') >= 0 && vscr.indexOf('Canned Food ×2') >= 0 && vscr.indexOf('Bottled Water ×1') >= 0);

  // take transition: art flies into the pack, confirmation names the character
  const w = fresh(); w.scavProtoStart();
  w.scavSearch('roadside', 'shelves', 'quiet');
  const wmsg = w.discoveryTakeAll();
  check('take all still grants + returns message', wmsg.indexOf("Added to Josh's pack:") === 0 && w.invCount('josh', 'canned_food') >= 2);
  check('take transition state set', !!w.getG().takeAnim && w.getG().takeAnim.who === 'josh');
  const wscr = w.lastScreen();
  check('transition panel shows flying art + pack', wscr.indexOf('take-anim') >= 0 && wscr.indexOf('fly-art') >= 0 && wscr.indexOf('pack-svg') >= 0);
  w.takeAnimDone();
  check('transition done returns to scene', w.getG().takeAnim === null && w.lastScreen().indexOf('ROADSIDE STOP') >= 0);
  check('transition done is idempotent', (w.takeAnimDone(), true));

  // inventory renders recognizable art (visual continuity with discovery)
  const x = fresh(); x.scavProtoStart(); x.openInventory('scav');
  const xscr = x.lastScreen();
  check('bag grid shows item art', xscr.indexOf('slot-art') >= 0 && xscr.indexOf('assets/items/water_bottle.webp') >= 0);
  x.invSelect(0);
  check('detail panel shows art', x.lastScreen().indexOf('detail-art') >= 0);
  x.invShow('mara');
  check('mara tab keeps art + tabs', x.lastScreen().indexOf('slot-art') >= 0 && x.lastScreen().indexOf('JOSH') >= 0 && x.lastScreen().indexOf('MARA') >= 0);

  // full-inventory FOUND panel carries art too
  const y = fresh(); y.scavProtoStart();
  y.invRemove('josh', 'water_bottle', 2); y.invRemove('josh', 'canned_food', 2); y.invRemove('josh', 'flashlight', 1);
  for (let i = 0; i < 10; i++) y.invAdd('josh', 'flashlight', 1);
  y.getG().invWho = 'josh';
  y.scavSearch('roadside', 'shelves', 'quiet');
  y.discoveryTakeAll();
  const yscr = y.lastScreen();
  check('overflow FOUND panel shows art', !!y.getG().found && yscr.indexOf('found-art') >= 0);

  // blips appear at gameplay moments
  const z = fresh(); z.scavProtoStart(); z.scavArea('shelves');
  check('area tap shows calm blip', z.lastScreen().indexOf('blip-calm') >= 0);
}

// ---------- M2I: illustrated searchable-area cards (visual pass) ----------
console.log('M2I illustrated area cards');
{
  const t = fresh();

  // area-art id mapping covers all five prototype areas
  const areas = ['shelves', 'fridge', 'backpack', 'cabinet', 'glovebox'];
  const arts = ['store_shelves', 'refrigerator', 'backpack', 'cabinet', 'glovebox'];
  areas.forEach(function (a, i) {
    check('areaArtId maps ' + a, t.areaArtId(a) === arts[i]);
  });
  check('areaArtId unknown area -> null', t.areaArtId('moon') === null);

  // areaArt: asset-path fallback when no AREA_ART map is inlined
  check('areaArt falls back to asset path', t.areaArt('shelves') === 'assets/areas/store_shelves.webp');
  check('areaArt unknown area -> null (graceful)', t.areaArt('moon') === null);

  // areaArt: data-URI branch when a preview build inlines AREA_ART
  {
    const vm2 = require('vm');
    const c2 = { AREA_ART: { store_shelves: 'data:image/webp;base64,BBB' },
      SCAV_AREAS: { shelves: { name: 'Store shelves' } },
      escapeHtml: (s) => String(s) };
    vm2.createContext(c2);
    vm2.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'sim', 'art.js'), 'utf8'), c2);
    check('areaArt prefers inlined data URI', vm2.runInContext('areaArt("shelves")', c2) === 'data:image/webp;base64,BBB');
    check('areaArtTag embeds data URI', vm2.runInContext('areaArtTag("shelves")', c2).indexOf('src="data:image/webp;base64,BBB"') >= 0);
  }

  // areaArtTag: landscape card markup with alt text; fallback glyph when missing
  const tag = t.areaArtTag('fridge', 'focus-art');
  check('areaArtTag renders img with area name alt', tag.indexOf('<img') >= 0 && tag.indexOf('alt="Refrigerator"') >= 0 && tag.indexOf('area-art') >= 0 && tag.indexOf('focus-art') >= 0);
  check('areaArtTag unknown area -> fallback glyph', t.areaArtTag('moon').indexOf('art-fallback') >= 0);

  // scav scene renders illustrated cards, not text buttons
  const a = fresh(); a.scavProtoStart();
  const scr = a.lastScreen();
  check('scene renders area cards', scr.indexOf('area-card') >= 0 && scr.indexOf('area-grid') >= 0);
  check('cards carry area art', scr.indexOf('assets/areas/store_shelves.webp') >= 0);
  check('card names integrated', scr.indexOf('Store shelves') >= 0 && scr.indexOf('Abandoned pickup') >= 0);
  check('no plain text area buttons remain', scr.indexOf("scavArea('shelves')\">Store shelves<") < 0);

  // searched areas stay visual: dim + searched treatment, never plain text
  a.scavSearch('roadside', 'shelves', 'quiet');
  a.discoveryTakeAll(); a.takeAnimDone();
  const scr2 = a.lastScreen();
  check('searched card keeps art but marked done', scr2.indexOf('area-card done') >= 0 && scr2.indexOf('SEARCHED') >= 0);
  check('searched card still shows artwork', scr2.indexOf('assets/areas/store_shelves.webp') >= 0);

  // focus view: tap -> zoom transition, art hero, blip decisions
  const b = fresh(); b.scavProtoStart(); b.scavArea('glovebox');
  const fscr = b.lastScreen();
  check('focus view shows area art large', fscr.indexOf('focus-art') >= 0 && fscr.indexOf('assets/areas/glovebox.webp') >= 0);
  check('focus view names the area', fscr.indexOf('Abandoned pickup') >= 0);
  check('focus offers quiet + force as blip decisions', fscr.indexOf('SEARCH QUIETLY') >= 0 && fscr.indexOf('FORCE IT') >= 0 && fscr.indexOf('blip-calm') >= 0 && fscr.indexOf('blip-urgent') >= 0);
  check('focus view has step back', fscr.indexOf('STEP BACK') >= 0);
}

// ---------- M2J: character + loadout inventory presentation ----------
// ---------- M2K: modular layered character renderer ----------
console.log('M2K layered character renderer');
{
  const t = fresh();

  // layer spec: canvas, anchors, order
  check('canvas is 600x900', t.CHAR_CANVAS.w === 600 && t.CHAR_CANVAS.h === 900);
  const anchors = ['head','torso','legs','beltLeft','beltRight','back','handR','handL','sling'];
  check('all nine anchors defined', anchors.every(function (a) { return !!t.CHAR_ANCHORS[a]; }));
  check('anchors normalized 0-1000', anchors.every(function (a) {
    const p = t.CHAR_ANCHORS[a]; return p.x >= 0 && p.x <= 1000 && p.y >= 0 && p.y <= 1000;
  }));
  const order = t.CHAR_LAYER_ORDER;
  check('layer order back->front', order.indexOf('base') < order.indexOf('jacket') &&
    order.indexOf('jacket') < order.indexOf('backpack') &&
    order.indexOf('backpack') < order.indexOf('slung') &&
    order.indexOf('slung') < order.indexOf('belt') &&
    order.indexOf('belt') < order.indexOf('held'));

  // equipment -> anchor mapping (weapon -> hands/sling/belt, utility -> belt)
  const spec = t.CHAR_LAYER_SPEC, bind = t.CHAR_EQUIP_BINDING;
  check('knife binds weapon -> beltRight', bind.knife.slot === 'weapon' && spec.knife.anchor === 'beltRight');
  check('flashlight binds utility -> beltLeft', bind.flashlight.slot === 'utility' && spec.flashlight.anchor === 'beltLeft');
  check('pistol binds weapon -> handR', bind.pistol_test.slot === 'weapon' && spec.pistol.anchor === 'handR');
  check('longgun binds weapon -> sling', bind.longgun_test.slot === 'weapon' && spec.longgun.anchor === 'sling');

  // inventory vs character-layer art are separate asset types; PoC reuse flagged
  check('knife/flashlight reuse flagged', spec.knife.reusesItemArt === true && spec.flashlight.reusesItemArt === true);
  check('layer art has own files', !!spec.pistol.file && !!spec.longgun.file && !!spec.backpack.file);

  // charLayerArt resolution
  check('charLayerArt falls back to asset path', t.charLayerArt('josh_base') === 'assets/charlayers/josh_base.webp');
  check('charLayerArt backpack path', t.charLayerArt('backpack') === 'assets/charlayers/backpack.webp');
  check('charLayerArt unknown id -> null', t.charLayerArt('nope') === null);
  check('charLayerArt reuse-only layer -> null', t.charLayerArt('knife') === null);

  // charLayerArt: data-URI branch when a preview build inlines CHAR_LAYER_ART
  {
    const c2 = { CHAR_LAYER_ART: { josh_base: 'data:image/webp;base64,DDD' },
      escapeHtml: function (s) { return String(s); } };
    vm.createContext(c2);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src/sim/art.js'), 'utf8'), c2);
    check('charLayerArt prefers inlined data URI', vm.runInContext('charLayerArt("josh_base")', c2) === 'data:image/webp;base64,DDD');
  }

  // test items: prototype-only, never in the main catalog
  t.registerTestItems();
  check('pistol_test flagged testOnly', t.itemDef('pistol_test').testOnly === true);
  check('longgun_test flagged testOnly', t.itemDef('longgun_test').testOnly === true);
  const catalogSrc = fs.readFileSync(path.join(__dirname, '..', 'src/data/items.js'), 'utf8');
  check('test items absent from main catalog', catalogSrc.indexOf('pistol_test') < 0 && catalogSrc.indexOf('longgun_test') < 0);

  // figure rendering: jacket XOR base (mutually exclusive full-canvas layers)
  const a = fresh(); a.scavProtoStart();
  a.openInventory('scav');
  let s = a.lastScreen();
  check('figure renders', s.indexOf('char-figure') >= 0);
  check('jacket on by default (base hidden)', s.indexOf('data-layer="josh_jacket"') >= 0 && s.indexOf('data-layer="josh_base"') < 0);
  check('backpack badge on by default', s.indexOf('data-layer="backpack"') >= 0 && s.indexOf('data-anchor="back"') >= 0);
  check('starter knife badge at beltRight', s.indexOf('data-layer="knife"') >= 0 && s.indexOf('data-anchor="beltRight"') >= 0);
  check('knife badge flags item-art reuse', s.indexOf('data-reuse="item-art"') >= 0);

  // layer order in markup: base/jacket before backpack before belt badges
  const iJ = s.indexOf('data-layer="josh_jacket"'), iB = s.indexOf('data-layer="backpack"'), iK = s.indexOf('data-layer="knife"');
  check('z-order back->front in markup', iJ >= 0 && iJ < iB && iB < iK);

  // jacket toggle swaps the full-canvas layer
  a.invToggleCharLayer('josh', 'jacket');
  s = a.lastScreen();
  check('jacket off shows base', s.indexOf('data-layer="josh_base"') >= 0 && s.indexOf('data-layer="josh_jacket"') < 0);
  a.invToggleCharLayer('josh', 'jacket');

  // backpack toggle adds/removes the layer
  a.invToggleCharLayer('josh', 'backpack');
  check('backpack off removes badge', a.lastScreen().indexOf('data-layer="backpack"') < 0);
  a.invToggleCharLayer('josh', 'backpack');

  // EQUIP pistol -> badge appears at handR immediately
  // starter kit: water(0) food(1) flashlight(2) pistol_test(3) longgun_test(4)
  a.getG().invSel = { who: 'josh', idx: 3 };
  a.invDo('equip');
  check('equip moves test pistol to equipment', a.getG().inv.josh.equipment.weapon === 'pistol_test');
  s = a.lastScreen();
  check('pistol badge appears on figure', s.indexOf('data-layer="pistol"') >= 0 && s.indexOf('data-anchor="handR"') >= 0);

  // EQUIP longgun (swaps pistol back to bag) -> sling badge
  const n = a.getG().inv.josh.slots.findIndex(function (x) { return x.item === 'longgun_test'; });
  a.getG().invSel = { who: 'josh', idx: n };
  a.invDo('equip');
  s = a.lastScreen();
  check('longgun badge at sling after swap', s.indexOf('data-layer="longgun"') >= 0 && s.indexOf('data-anchor="sling"') >= 0);
  check('swapped pistol left the figure', s.indexOf('data-layer="pistol"') < 0);

  // UNEQUIP via badge tap path -> badge removed, item back in bag
  a.invUnequipSlot('josh', 'weapon');
  const g2 = a.getG();
  check('unequip returns rifle to bag', g2.inv.josh.equipment.weapon === null && a.invCount('josh', 'longgun_test') === 1);
  check('rifle badge gone after stow', a.lastScreen().indexOf('data-layer="longgun"') < 0);

  // per-character independence: josh's gear never renders on mara
  a.getG().invSel = { who: 'josh', idx: a.getG().inv.josh.slots.findIndex(function (x) { return x.item === 'pistol_test'; }) };
  a.invDo('equip');
  a.invShow('mara');
  s = a.lastScreen();
  check('mara figure independent', s.indexOf('data-layer="mara_jacket"') >= 0 && s.indexOf('data-layer="pistol"') < 0);
  a.invShow('josh');
  check('josh keeps his pistol badge', a.lastScreen().indexOf('data-layer="pistol"') >= 0);

  // full-bag UNEQUIP blocked: nothing discarded, badge stays
  const b = fresh(); b.scavProtoStart();
  b.getG().invSel = { who: 'josh', idx: 3 };
  b.invDo('equip'); // pistol equipped
  // josh used: water(1) food(1) flashlight(1) longgun(2) = 5; fill to 10
  ['bandage', 'antiseptic', 'ammo_9mm', 'dead_phone', 'mre'].forEach(function (id) { b.invAdd('josh', id, 1); });
  check('bag filled to capacity', b.invUsedSlots('josh') === 10);
  b.invUnequipSlot('josh', 'weapon');
  const g3 = b.getG();
  check('full-bag unequip keeps pistol equipped', g3.inv.josh.equipment.weapon === 'pistol_test');
  check('full-bag unequip discards nothing', b.invUsedSlots('josh') === 10 && b.invCount('josh', 'pistol_test') === 0);
  check('pistol badge stays on figure', b.lastScreen().indexOf('data-layer="pistol"') >= 0);
}

// M2K-resume: prototype-only test items are registered + backfilled on resume,
// so saves created before they existed still get the full equipment set.
console.log('M2K resume backfill');
{
  const a = fresh();
  a.scavProtoStart();
  a.saveProto();
  // simulate a save from before test items existed: strip them from the stored JSON
  const s = JSON.parse(a.getStore('longroad_proto'));
  s.inv.josh.slots = s.inv.josh.slots.filter(function (x) { return x.item !== 'pistol_test' && x.item !== 'longgun_test'; });
  a.setStore('longroad_proto', JSON.stringify(s));
  a.resumeProto();
  check('resume backfills pistol_test', a.invHas('josh', 'pistol_test', 1));
  check('resume backfills longgun_test', a.invHas('josh', 'longgun_test', 1));
  check('resume registers test catalog', a.itemDef('pistol_test') && a.itemDef('pistol_test').testOnly === true);
  // backfilled pistol equips and renders its badge
  const g4 = a.getG();
  g4.invSel = { who: 'josh', idx: g4.inv.josh.slots.findIndex(function (x) { return x.item === 'pistol_test'; }) };
  a.invDo('equip');
  check('backfilled pistol equips', a.getG().inv.josh.equipment.weapon === 'pistol_test');
  check('pistol badge renders after resume-equip', a.lastScreen().indexOf('data-layer="pistol"') >= 0);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
