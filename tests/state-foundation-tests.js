// Alpha 0.4 State Foundation tests: v4 schema, migration, helpers, backfill. Run with node.
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
;globalThis.__api = { migrateSave, newQuests, begin, recordConsequence, npcState, settleState, encounterState,
  getG: () => g, setG: v => { g = v; },
  setPlayerName: v => { playerName = v; }, setSexSel: v => { sex = v; },
  setDiff: v => { difficulty = v; }, setCarSel: v => { car = v; },
  kinds: () => CONSEQUENCE_KINDS.slice() };`;
  vm.runInContext(code, ctx);
  const api = ctx.__api;
  api.newGame = (sex = 'Male') => { api.setPlayerName('Tester'); api.setSexSel(sex); api.setDiff('survival'); api.setCarSel('eagle'); api.begin(); };
  return api;
}

// ---------- S1: v1 -> v4 ----------
console.log('S1 v1->v4 migration');
{
  const a = fresh();
  const v1 = { name: 'Old', difficulty: 'survival', sex: 'Male', day: 5, miles: 100, health: 80, food: 10, water: 10, crew: [{ name: 'Josh', hp: 90 }], flags: {} };
  const m = a.migrateSave(JSON.parse(JSON.stringify(v1)));
  check('v bumps to 4', m.v === 4, 'v=' + m.v);
  check('chapter defaults to 1', m.chapter === 1);
  check('structures initialized', Array.isArray(m.consequences) && m.consequences.length === 0 && typeof m.settlements === 'object' && typeof m.npcs === 'object' && typeof m.encounters === 'object' && !Array.isArray(m.encounters));
  check('mercy defaults (no game-over)', m.mercy && m.mercy.contact === 'none' && m.mercy.lastKnown === 'stable');
  check('route derived jack', m.route === 'evelyn' ? false : m.route === 'jack', 'route=' + m.route);
  check('spouseName derived Claire', m.spouseName === 'Claire', 'spouse=' + m.spouseName);
  check('quests.personal created', m.quests && m.quests.personal && m.quests.personal.id === 'find-them');
  const f = fresh();
  const v1f = { name: 'OldF', difficulty: 'story', sex: 'Female', day: 2, flags: {} };
  const mf = f.migrateSave(JSON.parse(JSON.stringify(v1f)));
  check('female -> evelyn/Daniel', mf.route === 'evelyn' && mf.spouseName === 'Daniel', mf.route + '/' + mf.spouseName);
}

// ---------- S2: v2 -> v4, flags preserved, backfill ----------
console.log('S2 v2->v4 flags + backfill');
{
  const a = fresh();
  const flags = { mercy: 2, stranger: 0, droneResult: 1, pass: true, hankSecret: true, tag: true };
  const v2 = { v: 2, name: 'Mid', difficulty: 'hard', sex: 'Male', day: 40, miles: 350, health: 66, crew: [], flags: JSON.parse(JSON.stringify(flags)), quests: a.newQuests(), discoveries: [] };
  const before = JSON.parse(JSON.stringify(v2.flags));
  const m = a.migrateSave(JSON.parse(JSON.stringify(v2)));
  check('legacy flags byte-identical', JSON.stringify(m.flags) === JSON.stringify(before));
  check('5 backfilled consequences', m.consequences.length === 5, 'n=' + m.consequences.length);
  const kinds = m.consequences.map(c => c.kind).sort().join(',');
  check('backfill kinds correct', kinds === 'decision,encounter,encounter,encounter,npc', kinds);
  check('backfill flagged', m.consequences.every(c => c.backfilled === true));
  check('mercy departure detail', m.consequences[0].label === 'Mercy departure' && /secretly took extra water/.test(m.consequences[0].detail));
  const hankC = m.consequences.find(c => c.label === "Josh's secret");
  check('hank backfill retconned', !!hankC && /lost people near the old interstate works/.test(hankC.detail));
  check('hank backfill kills facility canon', !!hankC && !/worked inside/i.test(hankC.detail) && !/Custodian facility/i.test(hankC.detail));
  check('existing personal preserved', m.quests.personal.id === 'find-them');
  // re-migration must not duplicate
  const m2 = a.migrateSave(JSON.parse(JSON.stringify(m)));
  check('no duplicate backfill on re-migrate', m2.consequences.length === 5 && m2.v === 4);
}

// ---------- S3: v3 -> v4 preserves survival fields ----------
console.log('S3 v3->v4 survival preservation');
{
  const a = fresh();
  const v3 = { v: 3, name: 'S3', difficulty: 'survival', sex: 'Female', day: 12, miles: 200, pfat: 55, injury: 'wounded', woundedDays: 2, antibiotics: 1, rationing: true, crew: [{ name: 'Josh', hp: 80, fatigue: 30, injury: 'healthy', woundedDays: 0, neglectDone: false }], flags: { mercy: 1 }, quests: a.newQuests(), discoveries: [] };
  const m = a.migrateSave(JSON.parse(JSON.stringify(v3)));
  check('v3 fields preserved', m.pfat === 55 && m.injury === 'wounded' && m.antibiotics === 1 && m.rationing === true && m.crew[0].fatigue === 30);
  check('v4 structures added', m.v === 4 && m.chapter === 1 && Array.isArray(m.consequences));
  check('route from sex', m.route === 'evelyn' && m.spouseName === 'Daniel');
}

// ---------- S4: empty flags -> no backfill ----------
console.log('S4 no spurious backfill');
{
  const a = fresh();
  const m = a.migrateSave({ v: 2, name: 'X', sex: 'Male', difficulty: 'story', day: 3, flags: {}, quests: a.newQuests(), discoveries: [], crew: [] });
  check('empty consequences when no legacy flags', m.consequences.length === 0);
}

// ---------- S5: helpers ----------
console.log('S5 state helpers');
{
  const a = fresh(); a.newGame();
  const g = a.getG();
  g.day = 10; g.miles = 150;
  const kinds = a.kinds();
  check('six closed kinds', kinds.length === 6 && kinds.indexOf('decision') >= 0 && kinds.indexOf('mercy') >= 0, kinds.join(','));
  let ok = true;
  for (const k of kinds) { const e = a.recordConsequence(k, 'L' + k, 'D' + k); if (!e || e.kind !== k || e.day !== 10 || e.chapter !== 1 || e.miles !== 150) ok = false; }
  check('all six kinds record with stamps', ok);
  const bad = a.recordConsequence('morality', 'X', 'Y');
  check('closed set rejects unknown kind', bad === null && a.getG().consequences.length === 6);
  const n = a.npcState('tess');
  check('npc create-on-read defaults', n.met === false && n.status === 'alive' && n.disposition === 0 && n.treatment === null);
  n.treatment = 'gave water'; 
  check('npc mutation persists', a.npcState('tess').treatment === 'gave water');
  const st = a.settleState('tollway');
  check('settlement defaults', st.visited === false && st.disposition === 'unknown' && typeof st.supportGiven === 'object');
  const en = a.encounterState('cattle-herd');
  check('encounter defaults', en.seen === 0 && en.outcome === null);
  en.seen = 1; en.outcome = 'waited';
  check('encounter mutation persists', a.encounterState('cattle-herd').seen === 1);
}

// ---------- S6: new game initializes v4 ----------
console.log('S6 new game init');
{
  const a = fresh(); a.newGame();
  const g = a.getG();
  check('new game stamps v4', g.v === 4, 'v=' + g.v);
  check('new game chapter 1 + empty histories', g.chapter === 1 && g.consequences.length === 0 && Object.keys(g.settlements).length === 0);
  check('new game route/spouse/personal', g.route === 'jack' && g.spouseName === 'Claire' && g.quests.personal.id === 'find-them');
  check('new game mercy sane', g.mercy.contact === 'none' && g.mercy.lastKnown === 'stable');
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
