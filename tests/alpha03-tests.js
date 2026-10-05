// Alpha 0.3 survival tests: T1-T5 + regression + balance. Run with node.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const js = html.split('<script>')[1].split('</scr' + 'ipt>')[0];

let pass = 0, fail = 0;
function check(name, cond, extra = '') {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.log('  FAIL', name, extra); }
}

// fresh sandbox per test group
function sandbox() {
  const store = {};
  const screens = [];
  const notes = [];
  const logs = [];
  const ctx = {
    console, Math, JSON, Object, Array, String, Number, Boolean, Error, parseInt, parseFloat, isNaN,
    setTimeout: () => 0,
    confirm: () => true,
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => store[k] = String(v), removeItem: k => delete store[k] },
    document: {
      querySelector: () => ({ textContent: '', style: {}, classList: { remove() {}, toggle() {} }, value: '' }),
      querySelectorAll: () => [],
      body: { classList: { remove() {}, add() {} } },
    },
    window: { scrollTo() {} },
  };
  ctx.window.top = ctx.window;
  const app = { _h: '', set innerHTML(v) { this._h = v; screens.push(v); } };
  ctx.document.querySelector = (s) => s === '#app' ? app : ({ textContent: '', style: {}, classList: { remove() {}, toggle() {} }, value: '' });
  // app is resolved via $('#app') each call; patch: make $ return app for #app
  const run = new Function('ctx', `
    with (ctx) {
      const $ = s => document.querySelector(s);
      ${js.replace(/start\(\);?$/, '')}
      return { begin, dayCost, travel, scavenge, rest, combat, treat, treatInfo, toggleRation,
        woundChar, gainFatigue, checkCollapse, travelDist, drainRate, livingEq, fatTier, maxFatigue,
        gain, migrateSave, newQuests, arrival, finish, wearyChoice, infectChoice, infectionEvent,
        wearyArgument, road, crewScreen, beginBattle, battle, randomChoice, end, event,
        getG: () => g, setG: v => g = v,
        setPlayerName: v => playerName = v, setSexSel: v => sex = v, setDiff: v => difficulty = v, setCarSel: v => car = v,
        screens: [], notes: [] };
    }`);
  // simpler: eval in a vm context
  return { ctx, store, screens, notes };
}

function fresh() {
  const store = {};
  const screens = [];
  const vm = require('vm');
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
;globalThis.__api = { begin, dayCost, travel, scavenge, rest, combat, treat, treatInfo, toggleRation,
  woundChar, gainFatigue, checkCollapse, travelDist, drainRate, livingEq, fatTier, maxFatigue,
  gain, migrateSave, newQuests, arrival, finish, wearyChoice, infectChoice, infectionEvent,
  wearyArgument, road, crewScreen, beginBattle, battle, randomChoice, end, event, updateQuests,
  getG: () => g, setG: v => { g = v; },
  setPlayerName: v => { playerName = v; }, setSexSel: v => { sex = v; },
  setDiff: v => { difficulty = v; }, setCarSel: v => { car = v; } };`;
  vm.runInContext(code, ctx);
  const api = ctx.__api;
  api.newGame = () => { api.setPlayerName('Tester'); api.setSexSel('Male'); api.setDiff('survival'); api.setCarSel('eagle'); api.begin(); api.getG().phase = 'road'; };
  api.store = store; api.screens = screens;
  return api;
}

// ---------- T1: zero supplies -> attrition floor at 1 HP ----------
console.log('T1 zero supplies');
{
  const a = fresh(); a.newGame();
  const g = a.getG();
  g.food = 0; g.water = 0; g.health = 5; g.crew.forEach(c => c.hp = 5);
  a.dayCost();
  const g2 = a.getG();
  check('player floored at 1 HP (not dead)', g2.health === 1 && g2.phase !== 'end', 'hp=' + g2.health + ' phase=' + g2.phase);
  check('crew floored at 1 HP', g2.crew.every(c => c.hp === 1));
}

// ---------- T2: incapacitated companions ----------
console.log('T2 incapacitated companions');
{
  const a = fresh(); a.newGame();
  const g = a.getG();
  g.crew[0].hp = 0; g.crew[0].fatigue = 40; // Josh out
  const d = a.drainRate();
  // livingEq = 1 + 2 + 0.5 = 3.5 -> ceil(0.5*3.5*1.35)=ceil(2.3625)=3
  check('drain counts incapacitated as half (survival=3)', d === 3, 'drain=' + d);
  const medsBefore = g.meds;
  g.crew[0].injury = 'healthy';
  a.treat(false, 0);
  const g2 = a.getG();
  check('TREAT revives to 25 HP', g2.crew[0].hp === 25, 'hp=' + g2.crew[0].hp);
  check('TREAT consumed 1 meds', g2.meds === medsBefore - 1);
  check('treat flag set', g2.flags['treated_Josh'] === true);
}

// ---------- T3: multiple simultaneous conditions ----------
console.log('T3 multiple conditions');
{
  const a = fresh(); a.newGame();
  const g = a.getG();
  g.pfat = 80; g.injury = 'wounded'; g.health = 50;         // player: exhausted + wounded
  g.crew[1].injury = 'infected'; g.crew[1].hp = 60;         // Mara infected
  g.crew[1].fatigue = 80;
  const hpBefore = g.crew[1].hp;
  // force infection roll to hit: stub Math.random
  const origRandom = Math.random; Math.random = () => 0.01;
  a.dayCost();
  Math.random = origRandom;
  const g2 = a.getG();
  check('infection damages but floors at >=1', g2.crew[1].hp === hpBefore - 4, 'hp=' + g2.crew[1].hp);
  check('wounded player can become infected', g2.injury === 'infected', 'injury=' + g2.injury);
  check('first-infection event armed', g2.pendingInfection === 'YOU' || g2.flags.firstInfectionEvent === true);
  // rest: infected get no healing, fatigue -50
  const fBefore = g2.pfat;
  a.rest();
  const g3 = a.getG();
  check('rest clears 50 fatigue', g3.pfat === fBefore - 50, 'pfat=' + g3.pfat);
  check('infected player gets no rest healing', g3.health === g2.health, 'hp ' + g2.health + '->' + g3.health);
}

// ---------- T4: migration fidelity ----------
console.log('T4 migration');
{
  const a = fresh();
  // v1 save: no v, no quests, no discoveries
  const v1 = { name: 'Old', difficulty: 'survival', day: 5, miles: 100, health: 80, food: 10, water: 10, crew: [{ name: 'Josh', hp: 90, trust: 1 }, { name: 'Mara', hp: 100, trust: 0 }, { name: 'Eli', hp: 70, trust: -1 }], flags: { mercy: 0 } };
  const m1 = a.migrateSave(JSON.parse(JSON.stringify(v1)));
  check('v1 -> v4', m1.v === 4);
  check('v1 backfills fatigue/injury', m1.pfat === 0 && m1.injury === 'healthy' && m1.crew[0].fatigue === 0 && m1.crew[0].injury === 'healthy');
  check('v1 gets 2 antibiotics', m1.antibiotics === 2);
  check('v1 quests created', m1.quests && m1.quests.main.objectives.length === 8);
  // v2 save: fields preserved byte-identical
  const v2 = { v: 2, name: 'Mid', difficulty: 'hard', day: 9, miles: 300, health: 66, food: 4, water: 7, fuel: 20, parts: 3, hp: 80, meds: 2, ammo: 5, car: 'wagon', sex: 'Female', crew: [{ name: 'Josh', hp: 100, trust: 2 }, { name: 'Mara', hp: 40, trust: 0 }, { name: 'Eli', hp: 100, trust: 1 }], flags: { tag: true, drone: true }, log: ['x'], phase: 'road', enemy: null, checkpoint: null, quests: a.newQuests(), discoveries: [{ title: 't', text: 'x', day: 3 }] };
  const before = JSON.parse(JSON.stringify(v2));
  const m2 = a.migrateSave(JSON.parse(JSON.stringify(v2)));
  let same = true;
  for (const k of Object.keys(before)) {
    if (k === 'v') { if (m2.v !== 4) { same = false; console.log('   v not bumped'); } continue; }
    if (k === 'crew') {
      for (let i = 0; i < before.crew.length; i++)
        for (const ck of Object.keys(before.crew[i]))
          if (JSON.stringify(m2.crew[i][ck]) !== JSON.stringify(before.crew[i][ck])) { same = false; console.log('   crew field changed:', ck); }
      continue;
    }
    if (JSON.stringify(m2[k]) !== JSON.stringify(before[k])) { same = false; console.log('   changed:', k); }
  }
  check('v2 old field values preserved (v bumped, crew extended)', same);
  check('v2 -> v4 adds survival fields', m2.v === 4 && m2.pfat === 0 && m2.antibiotics === 2 && m2.rationing === false);
}

// ---------- T5: ending while injured ----------
console.log('T5 ending while injured');
{
  const a = fresh(); a.newGame();
  const g = a.getG();
  g.miles = 780; g.injury = 'wounded'; g.crew[1].injury = 'infected'; g.crew[1].hp = 30;
  g.flags.tag = true;
  a.arrival();
  const g2 = a.getG();
  check('arrival phase set', g2.phase === 'arrival' || g2.phase === 'event');
  a.finish(3);
  const g3 = a.getG();
  check('ending completes while injured', g3.phase === 'end' && g3.won === true);
  const obj = id => g3.quests.main.objectives.find(o => o.id === id).done;
  check('truth + mercy-fate objectives done', obj('uncover-truth') === true && obj('mercy-fate') === true);
  check('reach-station done at 780mi', obj('reach-station') === true);
}

// ---------- Regression: core flows ----------
console.log('REGRESSION');
{
  const a = fresh(); a.newGame();
  const g = a.getG();
  check('begin state v-fields', g.pfat === 0 && g.antibiotics === 2 && g.injury === 'healthy' && g.crew.every(c => c.fatigue === 0));
  check('drain story full party = 2', (() => { g.difficulty = 'story'; return a.drainRate(); })() === 2);
  check('drain survival full party = 3', (() => { g.difficulty = 'survival'; return a.drainRate(); })() === 3);
  check('drain hard full party = 4', (() => { g.difficulty = 'hard'; return a.drainRate(); })() === 4);
  g.difficulty = 'survival';
  g.rationing = true;
  check('rationing halves drain (3->2)', a.drainRate() === 2, 'drain=' + a.drainRate());
  g.rationing = false;
  // fatigue tiers & travel
  check('travelDist rested steady = 47', a.travelDist(47) === 47);
  g.pfat = 50;
  check('tired steady = 39 (47*.85 floor)', a.travelDist(47) === 39, 'got ' + a.travelDist(47));
  g.pfat = 80;
  check('exhausted steady = 35', a.travelDist(47) === 35, 'got ' + a.travelDist(47));
  g.hp = 20;
  check('limping stacks: 47*.75*.9=31', a.travelDist(47) === 31, 'got ' + a.travelDist(47));
  g.pfat = 0; g.hp = 100;
  // caps
  g.food = 29; const added = a.gain('food', 5);
  check('cap: food 29 +5 -> 30, waste logged', added === 1 && g.food === 30 && g.log[0].includes('left behind'));
  // wound + treat flow
  a.woundChar('player');
  check('wound sets injury + firstWound flag', g.injury === 'wounded' && g.flags.firstWound === true);
  const meds0 = g.meds, hp0 = g.health = 60;
  a.treat(true, 0);
  check('treat heals 30 (35 w/ Mara)', g.health === hp0 + 35 && g.meds === meds0 - 1 && g.injury === 'healthy', 'hp=' + g.health);
  // collapse
  g.pfat = 100; g.health = 50; const day0 = g.day;
  const c = a.checkCollapse();
  const g2 = a.getG();
  check('collapse triggers, fatigue->60, day+1', c === true && g2.pfat === 60 && g2.day === day0 + 1, 'day ' + day0 + '->' + g2.day);
  check('collapse damage floors at 1', g2.health >= 1);
  // rationing toggle
  a.toggleRation();
  check('rationing toggles on', a.getG().rationing === true);
  // combat wound path exists (smoke: call combat with mocked enemy)
  a.beginBattle('Raider', 10, 1);
  const e = a.getG().enemy;
  check('battle starts', a.getG().phase === 'battle' && e.hp === 10);
}

// ---------- Balance sanity: journey math ----------
console.log('BALANCE');
{
  // proposal: story 2/day over ~19 days; survival 3/day; hard 4/day
  const a = fresh();
  for (const [diff, per] of [['story', 2], ['survival', 3], ['hard', 4]]) {
    a.newGame(); const g = a.getG(); g.difficulty = diff;
    const got = a.drainRate();
    check(diff + ' daily drain = ' + per, got === per, 'got ' + got);
  }
  // fatigue: 4 steady travels on survival = 100 -> collapse; rest cadence works
  const b = fresh(); b.newGame(); const g = b.getG(); g.difficulty = 'survival';
  b.gainFatigue(25); b.gainFatigue(25);
  check('2 travels -> 50 (Tired)', g.pfat === 50 && b.fatTier(b.maxFatigue().m) === 'Tired');
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
