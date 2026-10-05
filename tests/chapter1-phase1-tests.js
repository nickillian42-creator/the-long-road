// Alpha 0.4 Chapter 1 Phase 1 (Mercy) tests. Run with node.
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
  const ctx = {
    console, Math, JSON, Object, Array, String, Number, Boolean, Error, parseInt, parseFloat,
    setTimeout: () => 0, confirm: () => true,
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    document: {
      querySelector: (s) => s === '#app' ? appObj : ({ textContent: '', style: {}, classList: { remove() {}, toggle() {} }, value: '' }),
      querySelectorAll: () => [],
      body: { classList: { remove() {}, add() {} } },
    },
    window: { scrollTo() {} },
  };
  ctx.window.top = ctx.window;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  const code = js.replace(/start\(\);?\s*$/, '') + `
;globalThis.__api = { begin, migrateSave, newQuests, updateQuests, render, start, resume,
  mercyTitle, hankRepair, hankRepairChoice, mercyHub,
  mercyWorkshop, mercyWorkshopHelp, mercyWorkshopAge,
  mercyClinic, mercyClinicHelp, mercyClinicHonest,
  mercyWater, mercyWaterHelp, mercyWaterTease,
  ruthCrisis, ruthCrisisChoice, phase1Done,
  recordConsequence, npcState, settleState, encounterState, noteTreatment,
  getG: () => g, setG: v => { g = v; },
  setPlayerName: v => { playerName = v; }, setSexSel: v => { sex = v; },
  setDiff: v => { difficulty = v; }, setCarSel: v => { car = v; } };`;
  vm.runInContext(code, ctx);
  const api = ctx.__api;
  api.screens = () => screens;
  api.lastScreen = () => screens[screens.length - 1];
  api.newGame = (sex = 'Male') => { api.setPlayerName('Tester'); api.setSexSel(sex); api.setDiff('story'); api.setCarSel('eagle'); api.begin(); };
  return api;
}

// ---------- C1: Jack route opening ----------
console.log('C1 Jack route');
{
  const a = fresh(); a.newGame('Male');
  const g = a.getG();
  check('begin routes to hank_repair (not opening)', g.phase === 'hank_repair', 'phase=' + g.phase);
  const s = a.lastScreen();
  check('Josh bolt line present', s.includes('Strip that bolt'));
  check('Jack physical beat', s.includes('arm-wrestle'));
  check('no Evelyn beat on Jack route', !s.includes('sheared clean through'));
  check('tire iron introduced', s.includes('tire iron'));
  check('chapter 1 set', g.chapter === 1);
  a.hankRepairChoice(0);
  check('careful choice: no numeric trust written', a.getG().crew[0].trust === 0);
  check('careful choice: authored treatment, not points', JSON.stringify(a.getG().npcs.hank.treatment) === JSON.stringify(['repair_careful']));
  check('no numeric disposition written', a.getG().npcs.hank.disposition === 0);
  check('tire iron flag set', a.getG().flags.tireIronSeen === true);
  check('hank met', a.getG().npcs.hank && a.getG().npcs.hank.met === true);
  check('continues to hub', a.lastScreen().includes('HEAD INTO MERCY'));
}

// ---------- C2: Evelyn route opening ----------
console.log('C2 Evelyn route');
{
  const a = fresh(); a.newGame('Female');
  const s = a.lastScreen();
  check('Evelyn insight beat', s.includes('sheared clean through'));
  check("Josh's eyes line", s.includes('You’ve got eyes'));
  check('no Jack beat on Evelyn route', !s.includes('arm-wrestle'));
  check('same bolt line', s.includes('Strip that bolt'));
  a.hankRepairChoice(1);
  check('cocky choice: banter, no trust change', a.getG().crew[0].trust === 0 && a.lastScreen().includes('It had threads'));
}

// ---------- C3: hub gating + all exploration orders ----------
console.log('C3 hub gating and exploration orders');
{
  const visit = { mercyWorkshop: 'mercyWorkshop', mercyClinic: 'mercyClinic', mercyWater: 'mercyWater' };
  const orders = [
    ['mercyWorkshop', 'mercyClinic', 'mercyWater'],
    ['mercyWorkshop', 'mercyWater', 'mercyClinic'],
    ['mercyClinic', 'mercyWorkshop', 'mercyWater'],
    ['mercyClinic', 'mercyWater', 'mercyWorkshop'],
    ['mercyWater', 'mercyWorkshop', 'mercyClinic'],
    ['mercyWater', 'mercyClinic', 'mercyWorkshop'],
  ];
  let orderOk = true;
  for (const order of orders) {
    const a = fresh(); a.newGame('Male'); a.hankRepairChoice(0); a.mercyHub();
    if (a.lastScreen().includes('ruthCrisis()')) { orderOk = false; console.log('   Ruth early:', order.join(',')); }
    order.forEach((fn, i) => {
      a[fn](); a.mercyHub();
      const ruthVisible = a.lastScreen().includes('ruthCrisis()');
      if ((i < 2 && ruthVisible) || (i === 2 && !ruthVisible)) { orderOk = false; console.log('   gating wrong at step', i, order.join(',')); }
    });
  }
  check('all 6 exploration orders gate Ruth correctly', orderOk);
  // settlement + npc state after full exploration
  const b = fresh(); b.newGame('Female'); b.hankRepairChoice(1); b.mercyHub();
  b.mercyWorkshop(); b.mercyClinic(); b.mercyWater(); b.mercyHub();
  const g = b.getG();
  check('mercy settlement visited', g.settlements.mercy && g.settlements.mercy.visited === true);
  check('mara met', g.npcs.mara && g.npcs.mara.met === true);
  check('eli met', g.npcs.eli && g.npcs.eli.met === true);
  check('explore flags all true', g.flags.mercyExplore.workshop && g.flags.mercyExplore.clinic && g.flags.mercyExplore.water);
}

// ---------- C4: location scenes content ----------
console.log('C4 location content');
{
  const a = fresh(); a.newGame('Male'); a.hankRepairChoice(0);
  a.mercyWorkshop();
  check('workshop: aging equipment', a.lastScreen().includes('older than the Collapse'));
  a.mercyWorkshopHelp();
  check('workshop help: no numeric trust written', a.getG().crew[0].trust === 0);
  check('workshop help: treatment recorded', a.getG().npcs.hank.treatment.includes('helped_workshop'));
  check('Josh accumulates both treatments', JSON.stringify(a.getG().npcs.hank.treatment) === JSON.stringify(['repair_careful','helped_workshop']));
  const b = fresh(); b.newGame('Male'); b.hankRepairChoice(0);
  b.mercyClinic();
  const cs = b.lastScreen();
  check('clinic: supplies concern', cs.includes('washing bandages') || cs.includes('half-empty'));
  check('clinic: Mara clinical honesty voice', cs.includes('split lip'));
  b.mercyClinicHelp();
  check('clinic help: no numeric trust written', b.getG().crew[1].trust === 0);
  check('clinic help: treatment recorded', JSON.stringify(b.getG().npcs.mara.treatment) === JSON.stringify(['helped_clinic']));
  const c = fresh(); c.newGame('Male'); c.hankRepairChoice(0);
  c.mercyWater();
  const ws = c.lastScreen();
  check('water: strain shown', ws.includes('barely trembles') || ws.includes('dying'));
  check('water: mountains bit', ws.includes('mountainous') || ws.includes('never seen a mountain'));
  check('water: Eli humor voice', ws.includes('load-bearing'));
  c.mercyWaterHelp();
  check('water help: treatment recorded', JSON.stringify(c.getG().npcs.eli.treatment) === JSON.stringify(['helped_water_station']));
}

// ---------- C5: Ruth crisis + stop ----------
console.log('C5 Ruth crisis');
{
  for (const n of [0, 1, 2]) {
    const a = fresh(); a.newGame(n === 2 ? 'Female' : 'Male'); a.hankRepairChoice(0);
    a.mercyWorkshop(); a.mercyClinic(); a.mercyWater();
    a.ruthCrisis();
    const rs = a.lastScreen();
    check(`ruth scene renders (choice ${n})`, rs.includes('Nineteen days') && rs.includes('Ruth'));
    check(`not a death timer (choice ${n})`, rs.includes('not a deadline'));
    check(`ruth met (choice ${n})`, a.getG().npcs.ruth && a.getG().npcs.ruth.met === true);
    const before = a.getG().consequences.length;
    a.ruthCrisisChoice(n);
    const g = a.getG();
    check(`exactly one consequence recorded (choice ${n})`, g.consequences.length === before + 1 && g.consequences.length === 1, 'len=' + g.consequences.length);
    const c0 = g.consequences[0];
    check(`consequence kind valid (choice ${n})`, ['decision', 'encounter', 'settlement', 'npc', 'mercy', 'quest'].includes(c0.kind), 'kind=' + c0.kind);
    check(`consequence stamped (choice ${n})`, c0.day === 1 && c0.chapter === 1);
    const want = ['crisis_resolve','crisis_practical','crisis_silent'][n];
    check(`ruth treatment = actual position (choice ${n})`, JSON.stringify(a.getG().npcs.ruth.treatment) === JSON.stringify([want]), JSON.stringify(a.getG().npcs.ruth.treatment));
    check(`ruth disposition untouched (choice ${n})`, a.getG().npcs.ruth.disposition === 0);
    a.phase1Done();
    check(`phase1 done, game saved (choice ${n})`, a.getG().phase === 'phase1_done' && a.getG().flags.phase1 === true);
    check(`stop card renders (choice ${n})`, a.lastScreen().includes('TO BE CONTINUED'));
  }
}

// ---------- C6: save/load across Phase 1 ----------
console.log('C6 save/load');
{
  const phases = ['hank_repair', 'mercy_hub', 'mercy_workshop', 'mercy_clinic', 'mercy_water', 'ruth_crisis', 'phase1_done'];
  let ok = true;
  for (const ph of phases) {
    const a = fresh(); a.newGame('Male'); a.hankRepairChoice(0);
    if (ph !== 'hank_repair') a.mercyHub();
    if (ph === 'mercy_workshop') a.mercyWorkshop();
    if (ph === 'mercy_clinic') a.mercyClinic();
    if (ph === 'mercy_water') a.mercyWater();
    if (ph === 'ruth_crisis' || ph === 'phase1_done') { a.mercyWorkshop(); a.mercyClinic(); a.mercyWater(); a.ruthCrisis(); }
    if (ph === 'phase1_done') a.phase1Done();
    // round-trip through localStorage JSON like a real save
    const raw = JSON.stringify(a.getG());
    const b = fresh();
    b.setG(b.migrateSave(JSON.parse(raw)));
    if (b.getG().phase !== ph) { ok = false; console.log('   phase lost:', ph, '->', b.getG().phase); continue; }
    b.render();
    if (!b.lastScreen() || b.lastScreen().length < 200) { ok = false; console.log('   render empty at', ph); }
  }
  check('all 7 phases survive save/load + render', ok);
}

// ---------- C7: legacy preservation ----------
console.log('C7 legacy preservation');
{
  const a = fresh();
  a.newGame('Male');
  check('personal quest untouched at stage 0', a.getG().quests.personal && a.getG().quests.personal.stage === 0);
  check('no consequence flooding in Phase 1', (() => {
    const b = fresh(); b.newGame('Female'); b.hankRepairChoice(1);
    b.mercyWorkshopHelp(); b.mercyClinicHonest(); b.mercyWaterTease();
    b.ruthCrisisChoice(0);
    return b.getG().consequences.length === 1;
  })());
}

// ---------- C8: noteTreatment unit behavior ----------
console.log('C8 treatment helper');
{
  const a = fresh(); a.newGame('Male');
  const t1 = a.noteTreatment('hank','repair_careful');
  const t2 = a.noteTreatment('hank','repair_careful');
  check('deduplicates repeat entries', t1.length === 1 && t2.length === 1);
  a.noteTreatment('hank','helped_workshop');
  check('accumulates multiple entries', a.getG().npcs.hank.treatment.length === 2);
  check('survives save/load', (() => {
    const raw = JSON.stringify(a.getG());
    const b = fresh(); b.setG(b.migrateSave(JSON.parse(raw)));
    return JSON.stringify(b.getG().npcs.hank.treatment) === JSON.stringify(['repair_careful','helped_workshop']);
  })());
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
