# Alpha 0.3 — Survival Gameplay Proposal (FULL)
**Status:** APPROVED IN PRINCIPLE (Nic + ChatGPT, Oct 5, 2026) — direction, numbers, and the three recommendations (keep collapse, TREAT on crew screen only, 2 starting antibiotics) are accepted. **Design safeguards incorporated below per review.** Still **nothing implemented** — final go-ahead on this revised proposal starts work on branch `alpha-0.3-dev`, tested and presented for review before anything touches `main`.
**Goal:** make survival a series of interesting decisions, not decorative stat bars. Every new number must change a decision the player makes.
**Supersedes:** the earlier Alpha 0.3a fatigue/injury sketch (its core numbers are carried forward and expanded here).

## Design goals
1. **Pressure, not busywork.** Food, water, rest, and health must force tradeoffs against the two clocks that matter: the 780-mile road and Mercy's nineteen-day water estimate.
2. **Consequences with arcs.** A risky choice today should unfold over several days (wound → infection → treatment), supporting THE LONG SHADOW OF CHOICE.
3. **Readable on a phone.** No hidden math. Every penalty is shown where the decision is made.
4. **Difficulty means something.** Story stays forgiving, Survival demands planning, Hard punishes waste.

## What is NOT changing
- Travel distances (47 steady / 75 fast), fuel costs, combat damage numbers — untouched.
- All existing story text, choices, encounters, and endings — untouched.
- Food/water base drain formula — unchanged, only restated per-survivor (identical results at full crew).
- The Mercy nineteen-day figure remains a narrative estimate, not a hard game-over timer (per canon).
- Save key stays `longroad_v01`. Existing saves migrate forward (see §11).

---

## 1. Time: the day is the unit
Time passes in **days**, one per world-changing action:
- **Costs a day:** TRAVEL, SCAVENGE, REST / SLEEP, plus specific event choices that say so (sheltering from a dust storm, preparing the vehicle).
- **Free:** CREW, QUEST, JOURNAL screens (information only — checking them never punishes the player).
- The day counter is the game's clock. There is no hour-level granularity in 0.3 — days keep every decision legible on mobile. (Hours remain a possible 0.4+ refinement.)

## 2. Hunger & thirst (staged, same drain math)
Food and water drain per day is restated per survivor so the crew size matters (§8), but produces **identical numbers** at a full crew of 4:

| Difficulty | Drain per survivor/day | Drain at 4 survivors/day |
|---|---|---|
| Story | 0.5 | **2** (unchanged) |
| Survival | 0.675 | **3** (unchanged: was ceil(2×1.35)) |
| Hard | 0.825 | **4** (unchanged: was ceil(2×1.65)) |

Formula: `drain = ceil(0.5 × livingEquivalents × mult)` per resource, where `mult` = 1 / 1.35 / 1.65.

Hunger/thirst are communicated in three stages — no new meters, just readability:
- **SATED** (5+): normal.
- **LOW** (1–4): HUD shows a LOW tag. Fair warning — one day to act before the damage lands.
- **EMPTY** (0): starvation damage, unchanged: player −8 HP/day (−18 if water is the empty one), crew −6 HP/day (−13 if water). Water shortage hurts roughly twice as much as food shortage, as today. Subject to the attrition floor (§5).

**No menu maintenance:** consumption is fully automatic inside the day's cost — there are no eat/drink menus and never will be. The player's knobs are strategic, not repetitive: the RATIONING toggle, and the choice of which days to travel, scavenge, or rest. TREAT is a deliberate spend of scarce supplies, not upkeep.

## 3. Rationing (new decision)
A **RATIONING** toggle on the road screen. When ON:
- Food/water drain is **halved** (rounded up).
- Each rationed day adds **+10 fatigue** to everyone (hunger gnaws; you don't sleep well hungry).
- Toggle is free and can be flipped any day.

*Why it matters:* the "we're almost out of water but the next settlement is two days away" decision. Cheap to implement (one flag, one modifier), most valuable on Hard.

## 4. Sleep & fatigue
REST is the game's sleep mechanic (framed in UI as **REST / SLEEP**). Fatigue is 0–100, tracked per character (player + each crew member — one bad night for the driver matters).

- **Gain:** +25 per TRAVEL or SCAVENGE (the day's labor). ×0.7 Story (18), ×1.0 Survival (25), ×1.3 Hard (33). Rounded.
- **Rationing:** +10/day while rationing (§3).
- **Relief:** REST / SLEEP reduces fatigue by **50** (in addition to its current healing and repair).
- **Tiers:**
  - **Rested (0–39):** no effect.
  - **Tired (40–74):** travel distance −15%.
  - **Exhausted (75–100):** travel distance −25%, combat damage −2 per hit, scavenging yields −1 (min 0).
- **Collapse:** at 100, the party halts involuntarily — lose 1 day (full food/water drain applies), −10 HP to everyone conscious, fatigue resets to 60. Subject to the attrition floor (§5) — collapse can break you, not kill you.

*Why it matters:* the classic push-your-luck call — one more Tired travel day, or burn a day (and 2–4 food/water) sleeping? On Story, collapse is rare (×0.7 gain); on Hard, every rest day hurts against the Mercy clock.

## 5. Health, injury, infection, medical treatment
Injuries give combat and hazardous events a multi-day arc instead of a one-line log entry.

**States:** `healthy` → `wounded` → `infected` (per character, including the player).

**How you get wounded:**
| Source | Wound chance |
|---|---|
| Enemy strike lands in combat | 15% Story / 25% Survival / 35% Hard |
| Forcing the clinic doors | 40% (20% if Eli is healthy — the scout spots the danger) |
| Driving through the dust storm | 30% (15% if Eli is healthy) |
| Raider melee / risky physical choices | 25% |

**Wounded effects:** rest healing halved for that character; each new day, 10% / 20% / 30% chance to become **infected** (by difficulty).
**Infected effects:** −6 HP/day (player) or −4 HP/day (crew) until cured. Infected characters gain **no HP from rest** — the infection consumes it. Rest still relieves their fatigue.
**Incapacitated:** at 0 HP a character is out (not dead): contributes nothing, consumes half rations, and loses companion bonuses (§8). 1 meds via TREAT revives at 25 HP and clears wounded. (Player at 0 HP still ends the journey, as today.)

**Treatment — TREAT button on the crew screen (crew-screen only, see Q2 below):**
- 1 meds → heal **30 HP** (35 if Mara is healthy, §8) **and** clear `wounded`.
- 1 meds on an incapacitated character → revive at 25 HP, clear wounded.
- 1 antibiotics → cure `infected` (does not restore HP — recovery still takes rest and food).
- Buttons show the reason when disabled ("no meds", "nothing to treat").

**Combat keeps its existing MEDKIT button** (+30 HP for 1 meds, costs the turn, does **not** clear wounds). Fast field patch vs. proper camp treatment — different tools, different moments.

**Antibiotics (new item):** start with **2** (approved). Roadside clinics always carry 1. No other source until trading (Alpha 0.4). Cap: 3.

**The attrition floor (anti-death-spiral rule):** damage from hunger, thirst, infection, and fatigue collapse **cannot reduce any character below 1 HP**. Attrition can break the party — never kill it. Death still comes from combat, hazards, and choices, as today. Every condition is curable or recoverable: infections cure (antibiotics), wounds clear (meds/rest), fatigue clears (rest), HP restores (rest/treat). Recovery is always mathematically possible after one unlucky event.

*Why it matters:* "force the clinic doors" stops being a one-line gamble and becomes a three-day story: wounded → rest half-healing → infection scare → spend the antibiotic or risk it. This is THE LONG SHADOW OF CHOICE at the systems level.

## 6. Inventory & carrying capacity
The truck is not a warehouse. Caps force "take it or leave it" calls while scavenging (overflow is wasted and the log says so):

| Item | Cap | Notes |
|---|---|---|
| Food | 30 | |
| Water | 30 | |
| Meds | 6 | |
| Antibiotics | 3 | |
| Parts | 8 | |
| Ammo | 24 | |
| Fuel | vehicle tank (= starting fuel) | Eagle 32 / Wagoneer 48 / Raptor 40 / M4 36 |

No spoilage in 0.3 (noted as a possible later pressure valve). Starting values (§9) sit well under caps, so caps only bite on lucky streaks — exactly when the decision is interesting.

## 7. Difficulty: what changes per mode
| Lever | Story | Survival | Hard |
|---|---|---|---|
| Food/water drain/day (4 crew) | 2 | 3 | 4 |
| Fatigue gain per labor day | 18 | 25 | 33 |
| Wound chance on enemy hit | 15% | 25% | 35% |
| Infection chance per day (wounded) | 10% | 20% | 30% |
| Collapse penalty | −10 HP, −1 day | −10 HP, −1 day | −10 HP, −1 day |
| Promise | Forgiving resources, checkpoints | Scarcer resources, no checkpoints | Extreme scarcity, permadeath |

Story stays true to its name: you will rarely see Exhausted and will finish with meds to spare. Survival makes resting every ~4 days mandatory and guarantees at least one infection scare per campaign. Hard makes every rest day a painful trade against Mercy's clock.

## 8. Companions & vehicle: how survival touches them
**Consumption scales with the living.** `livingEquivalents = conscious + 0.5 × incapacitated`, then `drain = ceil(0.5 × livingEquivalents × mult)`. Losing people slows the drain — the game acknowledges the grim arithmetic without celebrating it.

**Companion skills (only while that companion is healthy — not wounded, infected, incapacitated, or dead):**
- **Mara (medic):** TREAT heals 35 instead of 30.
- **Hank (mechanic):** REST / SLEEP repairs 25% vehicle condition instead of 22% (still costs 1 part).
- **Eli (scout):** wound chance from hazards (clinic doors, dust storm) halved.

**Vehicle condition:**
- 0% → breakdown event (exists today).
- **< 30% ("LIMPING"):** travel distance −10%. Shown in the HUD. Fixed by resting with parts, as today.

## 9. Recommended starting values & consumption rates
Per vehicle (fuel/parts/vehicle stats unchanged from today):

| Vehicle | Food | Water | Meds | Antibiotics | Fuel (tank) | Parts |
|---|---|---|---|---|---|---|
| AMC Eagle | 17 | 17 | 3 | 2 | 32 | 5 |
| Jeep Wagoneer | 23 | 22 | 3 | 2 | 48 | 6 |
| Baby Raptor | 14 | 16 | 3 | 2 | 40 | 4 |
| BMW M4 | 11 | 13 | 3 | 2 | 36 | 3 |

Everyone starts: fatigue 0, injury `healthy`, HP 100.

**The journey math (sanity check):** 780 miles ÷ 47 (steady) ≈ 17 travel days minimum. On Story with the Eagle, that's ~34 food and ~34 water needed vs. 17 carried — roughly half the trip's days must produce food/water through scavenging and events. Tight but fair. On Survival (3/day) it's ~51 needed; on Hard (4/day) ~68 — both demand aggressive scavenging, rationing, and hard calls about resting. That gradient matches what each mode promises.

## 10. Worked example: three days on the road
*Eagle, Story mode, full crew, starting Day 1: food 17, water 17, meds 3, antibiotics 2, fuel 32, fatigue 0, all healthy, 0/780 mi.*

**Day 1 — TRAVEL STEADY.** 47 miles (47/780). Fuel: 47÷18×1.0 = 2.6 gal → 29.4. Fatigue +18 → 18 (Rested). Food/water −2 → 15/15. *Day 2 begins. Nothing dramatic — the road is quiet, which is its own kind of warning.*

**Day 2 — SCAVENGE** (abandoned gas station, forecourt looks unstable — risk it). Find: +5 food, +4 water → 20/19; loose rubble dents the truck (−6% condition, as today). Day cost: −2/−2 → 18/17. Fatigue +18 → 36 (Rested, but Tired is two days away). *Day 3 begins. The HUD shows no LOW tags yet; the player feels ahead.*

**Day 3 — TRAVEL STEADY.** Fatigue is 36 (Rested), so the full 47 miles (94/780). Fuel → 26.8. Food/water → 16/15. Fatigue +18 → **54 (Tired)**. *Day 4 begins with the first real decision of the trip: push on Tired at −15% distance (40 miles instead of 47), or burn a day resting — fatigue → 4, +12 HP, but −2 food/water and one day closer to whatever Mercy becomes. The stranger encounter waits at mile 140, roughly two travel days out.*

**A longer arc (days 9–12, same journey):** the crew forces a clinic's doors. Mara is wounded (40% → it lands). Rest heals her at half rate. Day 11: the 20% infection roll lands — now it's −4 HP/day and rest can't heal through it. The player spends 1 antibiotic (down to 1 of 2) or gambles another day. *That* is a survival story the systems told by themselves.

## 11. Save migration (v2 → v3)
Current saves are v2 (quests/discoveries). Migration backfills:
- `fatigue`: 0 for player and each crew member (or a single party value — recommend per-character, stored as `c.fatigue`).
- `antibiotics`: 2.
- `injury`: `'healthy'` for player and each crew member.
- `rationing`: false.
- v1 saves still migrate v1 → v2 → v3 through the existing chain. Nothing the player has earned is altered; the new systems simply switch on.

## 12. UI additions (all additive — no existing screen is redesigned)
- **HUD:** thin fatigue indicator under the stats; LOW tags on food/water; LIMPING tag on the truck under 30%; wound/infection markers on the crew line.
- **Road screen:** RATIONING toggle button (shows ON/OFF state); REST relabeled **REST / SLEEP**.
- **Crew screen:** TREAT button per character, with disabled reasons ("no meds", "nothing to treat", "needs antibiotics").
- **Journal:** fatigue collapses, infections, and treatments are logged like any other event (feeds the future PREVIOUSLY ON recap).
- **First-time explainers:** the first time each system bites (first Tired, first wound, first LOW tag, first infection), a one-line toast explains it in plain words. Never twice — veterans aren't nagged.

## 13. Balance targets (what "correct" looks like)
- **Story:** rest every 5–6 days, rarely see Exhausted, finish with meds to spare. Forgiving, as advertised.
- **Survival:** resting every ~4 days is mandatory; antibiotics get spent, not stockpiled; at least one infection scare per campaign; rationing is a real consideration past the Panhandle.
- **Hard:** every rest day is a painful trade against the Mercy clock; running wounded is sometimes the correct call; collapse is a live threat.

## 14. Open questions — recommendations (APPROVED Oct 5, 2026)
1. **Is the forced-collapse penalty (lose a day + 10 HP) too harsh?** Recommendation: keep it. It's the only teeth fatigue has, and on Story (×0.7 gain) it's rare. Uniform across difficulties keeps the rule learnable.
2. **Should TREAT work during combat, or crew-screen only?** Recommendation: **crew-screen only.** Combat keeps the existing MEDKIT button for fast patching (+30 HP, no wound clearing). Rationale: combat decisions must stay fast on mobile; wound care is a camp activity. Two tools, two moments, no confusion.
3. **Start with 1 antibiotic or 2?** Recommendation: **2.** The first infection shouldn't be a death sentence before the player has learned the system. Clinics replenish; the cap is 3; scarcity still bites by mid-journey.

## 15. Design safeguards (incorporated per Nic + ChatGPT review, Oct 5, 2026)
1. **Decisions, not maintenance.** Routine consumption is automatic (§2). The only manual controls are the RATIONING toggle and the travel/scavenge/rest choice. No per-meal clicking, ever.
2. **Systems tell stories.** Wounds, infection, fatigue, and treatment produce narrative, not just numbers:
   - First wound → a companion reacts in dialogue (Mara/Hank comment; sets a flag).
   - First infection → a campfire decision event: spend the antibiotic tonight or risk the night (branching choice, recorded).
   - Exhausted travel → small chance of a "weary argument" event: trust −1 with a random conscious companion, or push through together for trust +1 (your call).
   - Treating a companion → trust +1 (gratitude is remembered); leaving someone wounded 3+ days → trust −1.
   - New flags (`treated_<name>`, `neglected_<name>`, `infection_survived`) feed **THE LONG SHADOW OF CHOICE** — future encounters and the 0.4+ settlement systems can check them. Guiding line, retained: *The world remembers what you do. The consequences don't always arrive when you expect them.*
   - All such beats are brief and never block progress.
3. **No early death spirals.** The attrition floor (§5) guarantees one unlucky clinic visit can't cascade into a hopeless party. Two starting antibiotics answer the first infection. No condition is permanent.
4. **Everything is communicated.** Fatigue bar with tier labels, LOW/LIMPING tags, wound/infection icons, travel buttons previewing penalties ("TRAVEL · STEADY — 40 mi (Tired −15%)"), TREAT buttons stating exact costs and effects, journal entries with numbers, first-time toasts (§12).
5. **Difficulty stays meaningful.** The §7 table is the contract: Story's promise (forgiving, checkpoints) is protected by ×0.7 fatigue / 10% infection / 15% wound; Survival demands a rest rhythm and spends antibiotics; Hard makes every rest day a trade against Mercy's clock.
6. **Preservation.** Migration is purely additive — new fields backfilled, existing flags, quests, discoveries, log, and endings untouched. v1→v2→v3 chain intact. Narrative flags ChatGPT authors against (`flags.*`) are never renamed or repurposed.
7. **Test plan (required before review):**
   - **T1 zero supplies:** food=0 & water=0 → damage applies, floors at 1 HP, LOW/EMPTY shown, game continues, no crash.
   - **T2 incapacitated companions:** companion at 0 HP → half rations, no companion bonuses, TREAT revives to 25 HP.
   - **T3 multiple simultaneous conditions:** one character wounded + infected + exhausted → stacking verified (infection damage applies; rest gives no HP but still clears 50 fatigue; no double infection roll while already infected).
   - **T4 save migration:** crafted v1 and v2 saves → migrate → new fields present with correct defaults; old flags/quests/discoveries/log byte-identical.
   - **T5 ending while injured:** wounded + infected party driven to arrival → `finish()` → ending renders, objectives 7–8 complete, no crash.
   - Plus the full existing flow suite re-run (prologue, quests, combat, endings, migration).


## 16. Implementation plan (AFTER final go-ahead — branch `alpha-0.3-dev`, not started)
1. `g.v = 3` migration + new fields (fatigue, antibiotics, injury states, rationing flag).
2. Fatigue gain/relief/tiers/collapse in `dayCost()`, `travel()`, `rest()`, `combat()`.
3. Injury states + wound sources + TREAT UI + antibiotics item + caps.
4. Rationing toggle + drain formula per living equivalents.
5. Companion bonuses (Mara/Hank/Eli) + LIMPING vehicle state.
6. HUD additions (fatigue, LOW/LIMPING tags, condition markers).
7. Full flow test + scripted 780-mile balance run per difficulty.
8. Update CHANGELOG, ROADMAP (0.3 marked complete), ASSET_MANIFEST if needed.
