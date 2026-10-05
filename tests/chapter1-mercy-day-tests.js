// Alpha 0.4 Chapter 1 — Mercy Day (preparation sequences) + departure tests. Run with node.
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
      querySelector: (s) => s === '#app' ? appObj : ({ textContent: '', style: {}, classList: { remove() {}, toggle() {}, add() {} }, value: '' }),
      querySelectorAll: () => [],
      body: { classList: { remove() {}, add() {}, toggle() {} } },
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
  ruthCrisis, ruthCrisisChoice, mercyDay,
  dayJosh, dayJoshChoice, dayMara, dayMaraChoice,
  dayRuth, dayRuthChoice, dayEli, dayEliChoice,
  departure, departureArgument, departurePhone, phase1Done,
  eliHealthy, drainRate,
  recordConsequence, npcState, settleState, encounterState, noteTreatment,
  getG: () => g, setG: v => { g = v; },
  setPlayerName: v => { playerName = v; }, setSexSel: v => { sex = v; },
  setDiff: v => { difficulty = v; }, setCarSel: v => { car = v; } };`;
  vm.runInContext(code, ctx);
  const api = ctx.__api;
  api.screens = () => screens;
  api.lastScreen = () => screens[screens.length - 1];
  api.newGame = (sex = 'Male') => { api.setPlayerName('Tester'); api.setSexSel(sex); api.setDiff('story'); api.setCarSel('eagle'); api.begin(); };
  // Play through the existing Phase 1 content to the end of the Ruth crisis.
  api.reachMercyDay = () => {
    api.newGame('Male');
    api.hankRepairChoice(0); api.mercyHub();
    api.mercyWorkshop(); api.mercyClinic(); api.mercyWater(); api.mercyHub();
    api.ruthCrisis(); api.ruthCrisisChoice(0); api.mercyDay();
  };
  return api;
}

// ---------- D1: hub structure ----------
console.log('D1 hub structure');
{
  const a = fresh(); a.reachMercyDay();
  check('mercy_day phase', a.getG().phase === 'mercy_day');
  const s = a.lastScreen();
  check('four threads offered', /dayJosh\(\)/.test(s) && /dayMara\(\)/.test(s) && /dayRuth\(\)/.test(s) && /dayEli\(\)/.test(s));
  check('departure locked until all done', !/departure\(\)/.test(s));
  check('day counter advances fiction', /DAY 2/.test(s));
}

// ---------- D2: threads in any order (order A) ----------
console.log('D2 order A: josh, mara, ruth, eli');
{
  const a = fresh(); a.reachMercyDay();
  a.dayJosh(); a.dayJoshChoice(0); a.mercyDay();
  a.dayMara(); a.dayMaraChoice(1); a.mercyDay();
  a.dayRuth(); a.dayRuthChoice(2); a.mercyDay();
  a.dayEli(); a.dayEliChoice(0); a.mercyDay();
  check('departure unlocked after all four', /departure\(\)/.test(a.lastScreen()));
  const t = a.getG().npcs;
  check('josh treatments', JSON.stringify(t.hank.treatment) === JSON.stringify(['repair_careful', 'saw_the_notches', 'pressed_about_past']));
  check('mara treatments', JSON.stringify(t.mara.treatment) === JSON.stringify(['saw_map_wall', 'asked_to_come', 'hesitated_mara']));
  check('ruth treatments', JSON.stringify(t.ruth.treatment) === JSON.stringify(['crisis_resolve', 'saw_memorial', 'heard_cadence', 'sat_quietly']));
  check('eli treatments', JSON.stringify(t.eli.treatment) === JSON.stringify(['phone_moment', 'marked_the_pattern', 'eli_begged', 'was_gentle']));
}

// ---------- D3: threads in any order (order B, reverse) ----------
console.log('D3 order B: eli, ruth, mara, josh');
{
  const a = fresh(); a.reachMercyDay();
  a.dayEli(); a.dayEliChoice(2); a.mercyDay();
  a.dayRuth(); a.dayRuthChoice(1); a.mercyDay();
  a.dayMara(); a.dayMaraChoice(2); a.mercyDay();
  a.dayJosh(); a.dayJoshChoice(1); a.mercyDay();
  check('departure unlocked (reverse order)', /departure\(\)/.test(a.lastScreen()));
  const t = a.getG().npcs;
  check('josh let_it_lie', t.hank.treatment.includes('let_it_lie') && !t.hank.treatment.includes('pressed_about_past'));
  check('eli deferred_to_josh', t.eli.treatment.includes('deferred_to_josh'));
}

// ---------- D4: Josh scene content rules ----------
console.log('D4 josh content rules');
{
  const a = fresh(); a.reachMercyDay();
  a.dayJosh();
  check('eleven notches clue', /eleven tally notches/i.test(a.lastScreen()));
  a.dayJoshChoice(0);
  const s = a.lastScreen();
  check('11->4 stated plainly', /Eleven of us left the flats/i.test(s));
  check('corridor unease present', /Places like this/i.test(s));
  check('no Voice recognition (correction 1)', !/recognizes the voice|worst day of his life/i.test(s));
  check('no broadcast-triggered reaction', !/broadcast.*still|still.*broadcast/i.test(s));
}

// ---------- D5: Mara scene content rules ----------
console.log('D5 mara content rules');
{
  const a = fresh(); a.reachMercyDay();
  a.dayMara();
  check('map wall is a compilation', /copied and recopied/i.test(a.lastScreen()));
  a.dayMaraChoice(0);
  const s = a.lastScreen();
  check('multi-source I-40 markings (correction 2)', /Different people.*Different years\. Same road/s.test(s));
  check('not a printed pre-collapse map', !/pre-collapse.*red line|printed.*red/i.test(s));
  check('spouse objective present', /Claire/.test(s));
}

// ---------- D6: Ruth scene content rules ----------
console.log('D6 ruth content rules');
{
  const a = fresh(); a.reachMercyDay();
  a.dayRuth();
  const s0 = a.lastScreen();
  check('memorial book seeded', /Somebody should write them down/.test(s0));
  check('cadence without explanation', /heard that cadence before/i.test(s0));
  check('no machine-reading reveal', !/machine reading/i.test(s0));
  a.dayRuthChoice(0);
  check('sister hint, short', /She died anyway/.test(a.lastScreen()));
  const b = fresh(); b.reachMercyDay(); b.dayRuth(); b.dayRuthChoice(1);
  check('cadence question deflected', b.lastScreen().includes('"No." Ruth says it gently'));
}

// ---------- D7: Eli scene content rules ----------
console.log('D7 eli content rules');
{
  const a = fresh(); a.reachMercyDay();
  a.dayEli();
  const s0 = a.lastScreen();
  check('fifteen setup (correction 3)', /fourteen times/i.test(s0) && /fifteen's the one/i.test(s0));
  check("father's voice turn", /forgetting what he sounded like/i.test(s0));
  check('pattern observation, not answer', /same part every time/i.test(s0) && !/machine reading|CUSTODIAN/i.test(s0));
  a.dayEliChoice(0);
  check('fifteen echoed', /Fifteen's the one/i.test(a.lastScreen()));
}

// ---------- D8: departure convergence ----------
console.log('D8 departure');
{
  const a = fresh(); a.reachMercyDay();
  a.dayJosh(); a.dayJoshChoice(0); a.mercyDay();
  a.dayMara(); a.dayMaraChoice(0); a.mercyDay();
  a.dayRuth(); a.dayRuthChoice(0); a.mercyDay();
  a.dayEli(); a.dayEliChoice(0); a.mercyDay();
  a.departure();
  check('ruth releases mara', /bring her back too/i.test(a.lastScreen()));
  a.departureArgument();
  const sArg = a.lastScreen();
  check('argument staged', /Somebody has to/.test(sArg));
  check('father/son unspoken', /became a father by accident/i.test(sArg));
  check('pressed past branches the scene', /what leaving costs him/i.test(sArg));
  a.departurePhone();
  check('eli removed from crew', a.getG().crew.length === 2 && !a.getG().crew.some(c => c.name === 'Eli'));
  check('crew order intact (josh, mara)', a.getG().crew[0].name === 'Josh' && a.getG().crew[1].name === 'Mara');
  check('eliStays flag', a.getG().flags.eliStays === true);
  check('stayed_in_mercy recorded', a.getG().npcs.eli.treatment.includes('stayed_in_mercy'));
  check("15's the one note", /15's the one/.test(a.lastScreen()));
  check('attempt-15 meaning present', /Fourteen times Josh tried/i.test(a.lastScreen()));
  check('not a mystery box', !/mysterious|unknown meaning|what could it mean/i.test(a.lastScreen()));
  a.phase1Done();
  check('phase1_done', a.getG().phase === 'phase1_done');
  check('ending: colorado + spouse', /Colorado/.test(a.lastScreen()) && /Claire/.test(a.lastScreen()));
}

// ---------- D9: no numeric relationship systems ----------
console.log('D9 authored history only');
{
  const a = fresh(); a.reachMercyDay();
  a.dayJosh(); a.dayJoshChoice(0); a.mercyDay();
  a.dayMara(); a.dayMaraChoice(0); a.mercyDay();
  a.dayRuth(); a.dayRuthChoice(0); a.mercyDay();
  a.dayEli(); a.dayEliChoice(0); a.mercyDay();
  a.departure(); a.departureArgument(); a.departurePhone();
  const t = a.getG().npcs;
  const clean = ['hank', 'mara', 'ruth', 'eli'].every(id => !t[id] || t[id].disposition === 0 || t[id].disposition === undefined);
  check('no numeric disposition written by new scenes', clean);
  check('treatments are string arrays', ['hank', 'mara', 'ruth', 'eli'].every(id => Array.isArray(t[id].treatment) && t[id].treatment.every(x => typeof x === 'string')));
}

// ---------- D10: post-departure mechanics safety ----------
console.log('D10 post-departure safety');
{
  const a = fresh(); a.reachMercyDay();
  a.dayJosh(); a.dayJoshChoice(1); a.mercyDay();
  a.dayMara(); a.dayMaraChoice(1); a.mercyDay();
  a.dayRuth(); a.dayRuthChoice(1); a.mercyDay();
  a.dayEli(); a.dayEliChoice(1); a.mercyDay();
  a.departure(); a.departureArgument(); a.departurePhone();
  let crashed = false;
  try { a.eliHealthy(); a.drainRate(); } catch (e) { crashed = true; }
  check('eliHealthy/drainRate safe without Eli', !crashed);
  check('eliHealthy false when gone', a.eliHealthy() === false);
}

// ---------- D11: save/load across new phases ----------
console.log('D11 save/load');
{
  const a = fresh(); a.reachMercyDay();
  a.dayMara(); a.dayMaraChoice(0);
  // round-trip through the game's own save path
  const g1 = JSON.parse(JSON.stringify(a.getG()));
  const b = fresh();
  b.setG(b.migrateSave(JSON.parse(JSON.stringify(g1))));
  b.render();
  check('phase survives reload', b.getG().phase === 'day_mara');
  check('treatments survive reload', b.getG().npcs.mara.treatment.includes('welcomed_mara'));
  check('mercyDay flags survive reload', b.getG().flags.mercyDay.mara === true);
}

// ---------- D12: treatment dedup ----------
console.log('D12 dedup');
{
  const a = fresh(); a.reachMercyDay();
  a.dayJosh(); a.dayJoshChoice(0); a.mercyDay();
  a.dayJosh(); a.dayJoshChoice(0); a.mercyDay();
  const t = a.getG().npcs.hank.treatment;
  check('no duplicate keys on replay', t.length === new Set(t).size && t.includes('saw_the_notches') && t.includes('pressed_about_past'));
}

// ---------- D13: crew motivations ----------
console.log('D13 crew motivations');
{
  const a = fresh(); a.reachMercyDay();
  a.dayJosh(); a.dayJoshChoice(1);
  check('josh reluctant seed', /Done with roads/.test(a.lastScreen()));
  const b = fresh(); b.reachMercyDay();
  b.dayMara();
  const sMara = b.lastScreen();
  check('mara self-driven ask', /I want to see it for real/.test(sMara));
  check('no devotion framing', !/Take me with you\. Please/.test(sMara));
  const c = fresh(); c.reachMercyDay();
  c.dayJosh(); c.dayJoshChoice(0); c.mercyDay();
  c.dayMara(); c.dayMaraChoice(0); c.mercyDay();
  c.dayRuth(); c.dayRuthChoice(0); c.mercyDay();
  c.dayEli(); c.dayEliChoice(0); c.mercyDay();
  c.departure();
  const sDep = c.lastScreen();
  check('ruth asks josh', /I'm asking you to go with them/.test(sDep));
  check('bounded commitment', /I'll get you through Forty/.test(sDep));
  check('no colorado promise from josh', !/I'll get you to Colorado|through to Colorado/.test(sDep));
  check('agreed_to_forty recorded', c.getG().npcs.hank.treatment.includes('agreed_to_forty'));
  c.departureArgument();
  check('eli calls out reluctance', /You don't even want to go/.test(c.lastScreen()));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
