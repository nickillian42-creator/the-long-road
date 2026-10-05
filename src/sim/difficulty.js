/* sim/difficulty.js — Difficulty architecture (Milestone 2).
   Three canonical modes. Difficulty modifies resource scarcity, survival
   pressure, risk, consequences, and recovery margins — never enemy hit points,
   and never the authored story/world (identical across modes).

   The pre-existing new-game screen offers 'story' / 'survival' / 'hard'
   (legacy labels, Chapter One setup — left untouched). normDiff() maps those
   to the canonical modes so old and new code agree:
     story    -> STORY
     survival -> SURVIVOR
     hard     -> HARDCORE SURVIVAL
   Unknown/missing values default to SURVIVOR (the intended default).

   Modifier fields:
     thirstEvery / hungerEvery : sim ticks per hunger/thirst stage advance
                                 (lower = harsher; thirst always faster)
     riskMult / noiseMult      : scavenging pressure scaling
     lootBonus                 : flat qty adjustment on authored loot
                                 (+1 story, 0 survivor, -1 hardcore)
     neglectEvery              : ticks at Starving/Dehydrated per health decline
     recoverEvery              : ticks well-fed/hydrated/treated per health recovery */

const DIFF_MODS = {
  story:    { label: 'STORY',            thirstEvery: 4, hungerEvery: 6, riskMult: 0.6, noiseMult: 0.6, lootBonus:  1, neglectEvery: 3, recoverEvery: 2 },
  survivor: { label: 'SURVIVOR',         thirstEvery: 2, hungerEvery: 3, riskMult: 1.0, noiseMult: 1.0, lootBonus:  0, neglectEvery: 2, recoverEvery: 3 },
  hardcore: { label: 'HARDCORE SURVIVAL', thirstEvery: 1, hungerEvery: 2, riskMult: 1.5, noiseMult: 1.5, lootBonus: -1, neglectEvery: 1, recoverEvery: 4 },
};

const DIFF_ALIASES = {
  story: 'story', survival: 'survivor', survivor: 'survivor',
  hard: 'hardcore', hardcore: 'hardcore',
};

function normDiff(d) { return DIFF_ALIASES[d] || 'survivor'; }

function diffMods(d) { return DIFF_MODS[normDiff(d === undefined ? (typeof g !== 'undefined' && g ? g.difficulty : undefined) : d)]; }

/* Authored loot quantity adjusted by difficulty. Applied to the first stack of
   a loot grant (keeps prototype loot legible); never drops below 0. */
function lootQtyFor(base, d, first) {
  const bonus = first ? diffMods(d).lootBonus : 0;
  return Math.max(0, base + bonus);
}
