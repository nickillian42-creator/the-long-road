# Alpha 0.3 — Survival Systems Balance Proposal
**Status:** PROPOSAL — for Nic's review. Nothing here is implemented yet.
**Goal:** deepen survival without decorative stat bars. Every new number must change a decision.

## What is NOT changing
- Food/water daily drain numbers and difficulty multipliers (1 / 1.35 / 1.65) stay exactly as they are.
- Combat damage numbers, travel distances, fuel costs stay as they are.
- All existing choices, story text, and endings are untouched.

## 1. Fatigue (new stat, 0–100, whole crew + player)
Replaces the current situation where REST is purely beneficial and there's never a reason not to push on.

- **Gain:** +22 per TRAVEL or SCAVENGE, +8 per any other road action (rest, crew check, journal).
- **Relief:** REST action reduces fatigue by 50 (in addition to its current healing/repair).
- **Tiers:**
  - Rested (0–39): no effect.
  - Tired (40–74): travel distance −15%.
  - Exhausted (75–100): travel distance −25%, combat damage −2 per hit, scavenging yields −1 (min 0).
- **Collapse:** at 100, the party is forced to halt — lose 1 day (full food/water drain), health −10 all, fatigue resets to 60.
- **Difficulty:** story ×0.7 gain, survival ×1.0, hard ×1.3. Rested-tier thresholds are the same everywhere; hard mode just gets there faster.

*Why it matters:* creates the classic push-your-luck decision — one more travel day while Tired, or burn a day resting? Interlocks with dwindling food/water.

## 2. Injury & infection (new per-character states)
Gives combat and hazardous events lasting consequences beyond the HP number.

- **States:** `healthy` → `wounded` → `infected`.
- **How you get wounded:** 25% chance when an enemy strike lands in combat; forced clinic doors; driving through the dust storm; raider fight.
- **Wounded effects:** rest healing halved for that character; each new day, 20% chance to become infected.
- **Infected effects:** −6 HP/day (player) or −4 HP/day (crew) until cured. Cannot be healed through by resting.
- **Treatment** (new TREAT button on the crew screen):
  - 1 meds → heal 30 HP **and** clear `wounded`.
  - 1 antibiotics → cure `infected` (does not restore HP).
  - Choice is the gameplay: spend scarce meds now, or risk the 20%?
- **Antibiotics (new item):** start with 1. Scavengeable (clinics always carry 1). No other source until trading (Alpha 0.4).
- **Difficulty:** infection chance per day 10% story / 20% survival / 30% hard.

*Why it matters:* turns "take the risky option" into a multi-day arc instead of a one-line log entry. The stranger/drone/mountain choices stay as written; this only adds consequence weight to physical risks.

## 3. Hunger/thirst readability (no number changes)
- HUD shows a **LOW** tag when food or water ≤ 4. Pure information — the drain math is unchanged. Players currently discover the shortage when the damage lands; this gives them one day's fair warning to act on.

## 4. Save migration
- `g.v` goes 1 → 2. `migrateSave()` backfills: `fatigue: 0`, `antibiotics: 1`, every crew member + player gets `injury: 'healthy'`.
- v1 saves load and play identically to today, plus the new systems.

## 5. UI additions (all additive)
- HUD: thin fatigue bar under the stats + LOW tags + wounded/infected icons on the crew line.
- Crew screen: TREAT button per character (disabled with reason when nothing to treat or no supplies).
- No new road-screen buttons needed — REST already exists and absorbs the sleep role.

## Balance targets (what "correct" looks like)
- Story: a competent player rests every 5–6 days, rarely sees Exhausted, finishes with meds to spare. Forgiving, as advertised.
- Survival: resting every ~4 days is mandatory; antibiotics are spent, not stockpiled; at least one infection scare per campaign.
- Hard: every rest day is a painful trade against the 19-day Mercy clock; running wounded is sometimes correct.

## Open questions for Nic
1. Is the forced-collapse penalty (lose a day + 10 HP) too harsh, or the right teeth?
2. Should TREAT also work during combat (spend a turn), or crew-screen only?
3. Antibiotics starting at 1 — right, or 2?

## Implementation plan (after approval)
1. `g.v = 2` migration + new fields.
2. Fatigue gain/relief/effects in `dayCost()`/`travel()`/`rest()`/`combat()`.
3. Injury states + TREAT UI + antibiotics item.
4. HUD additions.
5. Full flow test + balance sanity pass (scripted 780-mile run per difficulty).
