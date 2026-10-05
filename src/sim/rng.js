/* sim/rng.js — Seeded RNG foundation (Milestone 1).
   Provides a deterministic PRNG (mulberry32) for future simulation systems.
   NOT wired into any gameplay yet: Chapter One uses no randomness, and the
   preserved combat primitives (sim/combat.js) still use Math.random while
   dormant. The encounter engine (Milestone 3) will adopt makeRng so runs can
   be reproduced from a seed.
   Usage (future): const rng = makeRng(12345); rng() -> [0,1); rng.int(1,6). */

function makeRng(seed) {
  let a = seed >>> 0;
  function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  next.int = function (lo, hi) {
    return lo + Math.floor(next() * (hi - lo + 1));
  };
  next.pick = function (arr) {
    return arr[Math.floor(next() * arr.length)];
  };
  next.seed = seed >>> 0;
  return next;
}
