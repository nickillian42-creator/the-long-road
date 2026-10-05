/* sim/survival.js — Hunger, thirst, health, conditions (Milestone 2).
   ---------------------------------------------------------------------------
   Per-character, gradual, deterministic — no arcade meters, no randomness.
   Time advances in discrete ticks (a search action, a rest, a journey leg).

   Hunger: 0 Fed → 1 Hungry → 2 Very Hungry → 3 Starving
   Thirst: 0 Hydrated → 1 Thirsty → 2 Very Thirsty → 3 Dehydrated
   Thirst always deteriorates faster than hunger (per difficulty tuning).

   Health: healthy → hurt → badly_hurt → critical (ordinal, not a 0-100 bar).
   Conditions coexist with overall health: bleeding, infection, illness,
   exhaustion, limb (limb impairment/injury).

   Pressure model:
   - Bleeding worsens health every 2 ticks until bandaged.
   - Infection worsens health every 3 ticks until treated.
   - At Starving/Dehydrated, health declines every `neglectEvery` ticks.
   - Recovery needs the combination: fed AND hydrated AND no acute condition
     (bleeding/infection/illness) AND time — then health improves slowly.
   Treatment stabilizes; it never insta-heals. Food/water are physical items
   consumed through the inventory system (invUseItem -> survApplyUse).

   State: g.surv = { josh: {hunger, thirst, health, conditions[],
                             thirstAcc, hungerAcc, negAcc, recAcc,
                             bleedAcc, infAcc}, mara: {...} } */

const HUNGER_LABELS = ['Fed', 'Hungry', 'Very Hungry', 'Starving'];
const THIRST_LABELS = ['Hydrated', 'Thirsty', 'Very Thirsty', 'Dehydrated'];
const HEALTH_LABELS = { healthy: 'Healthy', hurt: 'Hurt', badly_hurt: 'Badly Hurt', critical: 'Critical' };
const HEALTH_ORDER = ['healthy', 'hurt', 'badly_hurt', 'critical'];
const COND_LABELS = { bleeding: 'Bleeding', infection: 'Infection', illness: 'Illness', exhaustion: 'Exhaustion', limb: 'Limb Injury' };

function initSurvState(s) {
  if (!s.surv) s.surv = {};
  ['josh', 'mara'].forEach(function (k) {
    if (!s.surv[k]) s.surv[k] = {
      hunger: 0, thirst: 0, health: 'healthy', conditions: [],
      thirstAcc: 0, hungerAcc: 0, negAcc: 0, recAcc: 0, bleedAcc: 0, infAcc: 0,
    };
    const c = s.surv[k];
    ['hunger', 'thirst', 'health', 'conditions', 'thirstAcc', 'hungerAcc', 'negAcc', 'recAcc', 'bleedAcc', 'infAcc']
      .forEach(function (f) { if (c[f] === undefined) c[f] = (f === 'conditions' ? [] : (f === 'health' ? 'healthy' : 0)); });
  });
  return s.surv;
}

function survOf(who) {
  initSurvState(g);
  return g.surv[invKey(who)];
}

function hungerLabel(i) { return HUNGER_LABELS[Math.max(0, Math.min(3, i))]; }
function thirstLabel(i) { return THIRST_LABELS[Math.max(0, Math.min(3, i))]; }
function healthLabel(h) { return HEALTH_LABELS[h] || h; }
function condLabel(c) { return COND_LABELS[c] || c; }

function healthWorsen(s) {
  const i = HEALTH_ORDER.indexOf(s.health);
  if (i >= 0 && i < HEALTH_ORDER.length - 1) s.health = HEALTH_ORDER[i + 1];
}

function healthImprove(s) {
  const i = HEALTH_ORDER.indexOf(s.health);
  if (i > 0) s.health = HEALTH_ORDER[i - 1];
}

function survAddCondition(who, cond) {
  const s = survOf(who);
  if (COND_LABELS[cond] && s.conditions.indexOf(cond) < 0) s.conditions.push(cond);
  return s.conditions;
}

function survRemoveCondition(who, cond) {
  const s = survOf(who);
  const i = s.conditions.indexOf(cond);
  if (i >= 0) s.conditions.splice(i, 1);
  return s.conditions;
}

/* Advances survival pressure by n ticks. Deterministic; difficulty-scaled.
   Returns an array of human-readable developments (for scene feedback). */
function simTick(n) {
  initSurvState(g);
  const mods = diffMods();
  const notes = [];
  ['josh', 'mara'].forEach(function (k) {
    const s = g.surv[k], nm = charName(k);
    s.thirstAcc += n;
    while (s.thirstAcc >= mods.thirstEvery) {
      s.thirstAcc -= mods.thirstEvery;
      if (s.thirst < 3) { s.thirst++; if (s.thirst === 3) notes.push(nm + ' is dehydrated. This is dangerous.'); }
    }
    s.hungerAcc += n;
    while (s.hungerAcc >= mods.hungerEvery) {
      s.hungerAcc -= mods.hungerAcc;
      if (s.hunger < 3) { s.hunger++; if (s.hunger === 3) notes.push(nm + ' is starving. They need food.'); }
    }
    if (s.conditions.indexOf('bleeding') >= 0) {
      s.bleedAcc += n;
      while (s.bleedAcc >= 2) { s.bleedAcc -= 2; healthWorsen(s); notes.push(nm + ' is losing blood.'); }
    }
    if (s.conditions.indexOf('infection') >= 0) {
      s.infAcc += n;
      while (s.infAcc >= 3) { s.infAcc -= 3; healthWorsen(s); notes.push(nm + '\'s infection is spreading.'); }
    }
    if (s.thirst === 3 || s.hunger === 3) {
      s.negAcc += n;
      while (s.negAcc >= mods.neglectEvery) {
        s.negAcc -= mods.neglectEvery;
        const before = s.health;
        healthWorsen(s);
        if (s.health !== before) notes.push(nm + ' is weakening (' + healthLabel(s.health).toLowerCase() + ').');
      }
    } else { s.negAcc = 0; }
    const acute = s.conditions.some(function (c) { return c === 'bleeding' || c === 'infection' || c === 'illness'; });
    if (s.thirst === 0 && s.hunger === 0 && !acute && s.health !== 'healthy') {
      s.recAcc += n;
      while (s.recAcc >= mods.recoverEvery) {
        s.recAcc -= mods.recoverEvery;
        const before = s.health;
        healthImprove(s);
        if (s.health !== before) notes.push(nm + ' is recovering (' + healthLabel(s.health).toLowerCase() + ').');
      }
    } else { s.recAcc = 0; }
  });
  return notes;
}

/* Consumable effects from invUseItem. Applies the item's use block; the
   caller removes the item from inventory. Returns a message. */
function survApplyUse(who, def) {
  const k = invKey(who), s = survOf(k), nm = charName(k), u = def.use;
  const parts = [];
  if (u.thirst) {
    const before = s.thirst;
    s.thirst = Math.max(0, s.thirst + u.thirst);
    if (s.thirst < before) parts.push('thirst eased (' + thirstLabel(s.thirst).toLowerCase() + ')');
  }
  if (u.hunger) {
    const before = s.hunger;
    s.hunger = Math.max(0, s.hunger + u.hunger);
    if (s.hunger < before) parts.push('hunger eased (' + hungerLabel(s.hunger).toLowerCase() + ')');
  }
  if (u.cure) {
    survRemoveCondition(k, u.cure);
    parts.push(condLabel(u.cure).toLowerCase() + ' treated');
  }
  if (u.stabilize) {
    survRemoveCondition(k, 'illness');
    const before = s.health;
    healthImprove(s);
    parts.push(s.health !== before ? 'stabilized (' + healthLabel(s.health).toLowerCase() + ')' : 'cleaned and dressed, holding steady');
  }
  return nm + ' uses ' + def.name + ': ' + (parts.join('; ') || 'no effect') + '.';
}

/* Rest: clears exhaustion. Time still passes (caller applies ticks);
   resting somewhere unsafe carries its own risk, handled by the caller. */
function restChar(who) {
  const k = invKey(who);
  const had = survOf(k).conditions.indexOf('exhaustion') >= 0;
  survRemoveCondition(k, 'exhaustion');
  return charName(k) + (had ? ' rests and shakes off the exhaustion.' : ' rests a while.');
}

/* One-line status for HUD/scene headers. */
function survStatusLine(who) {
  const k = invKey(who), s = survOf(k);
  let line = charName(k) + ' · ' + thirstLabel(s.thirst) + ' · ' + hungerLabel(s.hunger) + ' · ' + healthLabel(s.health);
  if (s.conditions.length) line += ' · [' + s.conditions.map(condLabel).join(', ').toUpperCase() + ']';
  return line;
}

/* Early, understandable feedback before severe penalties (brief §4). */
function survWarning(who) {
  const s = survOf(who), nm = charName(who), out = [];
  if (s.thirst === 2) out.push(nm + ' is very thirsty — water soon, or this turns.');
  if (s.thirst === 3) out.push(nm + ' is dehydrated. They are running out of time.');
  if (s.hunger === 2) out.push(nm + ' is very hungry — food is becoming urgent.');
  if (s.hunger === 3) out.push(nm + ' is starving. Their hands are starting to shake.');
  s.conditions.forEach(function (c) {
    if (c === 'bleeding') out.push(nm + ' is bleeding — it needs a bandage.');
    if (c === 'infection') out.push(nm + '\'s wound is infected — it needs antiseptic.');
    if (c === 'illness') out.push(nm + ' is ill — a medkit could stabilize them.');
    if (c === 'exhaustion') out.push(nm + ' is exhausted — they need rest.');
    if (c === 'limb') out.push(nm + '\'s limb is injured — a splint would help.');
  });
  return out;
}
