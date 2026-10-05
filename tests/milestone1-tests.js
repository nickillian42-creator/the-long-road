// Milestone 1 regression tests: modular foundation, legacy retirement,
// Eli retcon, trust-write removal, RNG foundation. Run with node.
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
  const code = js.replace(/start\(\);?\s*$/, '') + `\n;globalThis.__api = { begin, migrateSave, render,
  hankRepair, hankRepairChoice, mercyHub, mercyWorkshop, mercyWorkshopHelp,
  mercyClinic, mercyClinicHelp, mercyWater, mercyWaterHelp, ruthCrisis, ruthCrisisChoice,
  mercyDay, departure, departurePhone, phase1Done, makeRng,
  has: (n) => typeof globalThis[n] !== 'undefined',
  getG: () => g, setG: v => { g = v; },
  setPlayerName: v => { playerName = v; }, setSexSel: v => { sex = v; },
  setDiff: v => { difficulty = v; }, setCarSel: v => { car = v; } };`;
  vm.runInContext(code, ctx);
  const api = ctx.__api;
  api.newGame = (sex = 'Male') => { api.setPlayerName('Tester'); api.setSexSel(sex); api.setDiff('story'); api.setCarSel('eagle'); api.begin(); };
  api.lastScreen = () => screens[screens.length - 1];
  return api;
}

// ---------- M1: Eli not in traveling crew ----------
console.log('M1 Eli retcon');
{
  const a = fresh(); a.newGame('Male');
  const g = a.getG();
  check('crew has 2 members', g.crew.length === 2, 'len=' + g.crew.length);
  check('no Eli in crew', !g.crew.some(c => c.name === 'Eli'));
  check('Josh and Mara present', g.crew[0].name === 'Josh' && g.crew[1].name === 'Mara');
  check('new game is v6', g.v === 6);
}

// ---------- M2: no numeric trust writes from live gameplay ----------
console.log('M2 trust writes retired');
{
  const a = fresh(); a.newGame('Male');
  a.hankRepairChoice(0);
  check('hankRepairChoice writes no trust', a.getG().crew[0].trust === 0);
  a.mercyWorkshopHelp();
  check('mercyWorkshopHelp writes no trust', a.getG().crew[0].trust === 0);
  const b = fresh(); b.newGame('Female');
  b.hankRepairChoice(1);
  b.mercyClinicHelp();
  check('mercyClinicHelp writes no trust', b.getG().crew[1].trust === 0);
  b.mercyWaterHelp();
  check('mercyWaterHelp writes no trust', b.getG().crew.every(c => c.trust === 0));
  // authored treatment history still recorded (the replacement system)
  check('treatments still recorded', b.getG().npcs.mara.treatment.includes('helped_clinic'));
}

// ---------- M3: legacy road loop retired ----------
console.log('M3 legacy retirement');
{
  const a = fresh();
  const retired = ['road', 'travel', 'scavenge', 'rest', 'randomEvent', 'randomChoice',
    'stranger', 'strangerChoice', 'drone', 'droneChoice', 'mountain', 'passChoice',
    'opening', 'openingChoice', 'crewScreen', 'journal', 'journalEnd', 'replay',
    'arrival', 'finish', 'end', 'event', 'dayCost', 'gain', 'gainFatigue', 'drainRate',
    'travelDist', 'checkCollapse', 'woundChar', 'newDayChar', 'toggleRation',
    'wearyArgument', 'wearyChoice', 'infectionEvent', 'infectChoice', 'treat',
    'treatBtn', 'treatInfo', 'questScreen', 'storySoFar', 'regionBg', 'regionName',
    'findParts', 'repairBreakdown', 'eliHealthy', 'maraHealthy', 'hankHealthy',
    'fatGain', 'livingEq', 'diffMult', 'maxFatigue'];
  // maxFatigue/fatTier are kept (HUD deps) — verify separately
  const retiredNoHud = retired.filter(n => n !== 'maxFatigue');
  let allGone = true;
  for (const n of retiredNoHud) {
    if (a.has(n)) { allGone = false; console.log('   STILL PRESENT:', n); }
  }
  check('legacy functions absent (' + retiredNoHud.length + ' checked)', allGone);
  check('fatTier kept (HUD dep)', a.has('fatTier'));
  check('maxFatigue kept (HUD dep)', a.has('maxFatigue'));
}

// ---------- M4: combat primitives preserved dormant ----------
console.log('M4 combat preservation');
{
  const a = fresh();
  check('beginBattle preserved', a.has('beginBattle'));
  check('battle preserved', a.has('battle'));
  check('combat preserved', a.has('combat'));
}

// ---------- M5: seeded RNG foundation ----------
console.log('M5 RNG');
{
  const a = fresh();
  check('makeRng exists', a.has('makeRng'));
  const r1 = a.makeRng(12345), r2 = a.makeRng(12345), r3 = a.makeRng(99999);
  const s1 = [r1(), r1(), r1()], s2 = [r2(), r2(), r2()], s3 = [r3(), r3(), r3()];
  check('same seed, same sequence', JSON.stringify(s1) === JSON.stringify(s2));
  check('different seed, different sequence', JSON.stringify(s1) !== JSON.stringify(s3));
  check('range [0,1)', s1.every(v => v >= 0 && v < 1));
  const r4 = a.makeRng(7);
  check('int(lo,hi) in range', Array.from({ length: 50 }, () => r4.int(1, 6)).every(v => v >= 1 && v <= 6 && Number.isInteger(v)));
  check('pick from array', ['a', 'b', 'c'].includes(a.makeRng(3).pick(['a', 'b', 'c'])));
}

// ---------- M6: render() covers live phases, no legacy ----------
console.log('M6 render coverage');
{
  const a = fresh(); a.newGame('Male');
  const phases = ['hank_repair', 'mercy_hub', 'mercy_workshop', 'mercy_clinic', 'mercy_water',
    'ruth_crisis', 'mercy_day', 'day_josh', 'day_mara', 'day_ruth', 'day_eli',
    'departure', 'phase1_done'];
  let ok = true;
  for (const ph of phases) {
    try {
      a.getG().phase = ph;
      a.render();
    } catch (e) { ok = false; console.log('   render crashed on', ph, e.message); }
  }
  check('all live phases render', ok);
  // legacy phase falls through to safe default, not a crash
  a.getG().phase = 'road';
  let crashed = false;
  try { a.render(); } catch (e) { crashed = true; }
  check('legacy phase renders safe default', !crashed && a.getG().phase === 'phase1_done');
}

// ---------- M7: Chapter One uses no randomness ----------
console.log('M7 Ch1 determinism');
{
  // Static check on the authored module: Chapter One must not depend on
  // Math.random or the new seeded RNG (neither is wired into its scenes).
  const ch1src = fs.readFileSync(path.join(__dirname, '..', 'src', 'chapters', 'chapter1.js'), 'utf8');
  check('no Math.random in chapter1.js', !ch1src.includes('Math.random'));
  check('no makeRng in chapter1.js', !ch1src.includes('makeRng'));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
