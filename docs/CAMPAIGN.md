# Campaign Canon — THE LONG ROAD
Authoritative campaign structure locked by Nic (2026-10-05). Revisit only with Nic's approval. Character detail lives in `docs/CHARACTERS.md`; moment-to-moment canon in `docs/PROLOGUE.md`.

## Permanent principles
- **THE WORLD REMEMBERS WHAT YOU DO. THE CONSEQUENCES DON'T ALWAYS ARRIVE WHEN YOU EXPECT THEM.**
- **THE PLAYER SHOULD KNOW ONLY WHAT THE CREW KNOWS.** Inventory names, descriptions, quests, dialogue, and UI must never reveal what the crew hasn't discovered.

## Timeline (locked)
**2029 → 2089: sixty years.** Never state as objective fact that CUSTODIAN initiated the Collapse. The cause of the Collapse and CUSTODIAN's role remain deliberately ambiguous — evidence must support conflicting interpretations (some frightening, some rational, some suggesting humans misunderstood what they asked it to preserve).

## Campaign targets
- Typical first playthrough: **~22–25 hours**.
- Mainline rush: ~15–18 hours. Exploration-heavy: 30+ hours.
- NPC catalog target: **~100 authored NPCs**, roughly 30–45 encountered in a typical run.

## Preserved canon
2029 Collapse / 2089 setting · Mercy, Texas · 19-day sustainability crisis (an estimate, not a game-over timer) · ~780-mile journey · Continuity Station Seven, Colorado · **AVOID INTERSTATE 40** warning · CUSTODIAN / C-07 mystery · Mara, Eli, Hank, Ruth · existing quests, discoveries, and flags where compatible · 300-item Master Catalog v1.0 · "The world remembers what you do" · "Previously On The Long Road."

## The four unresolved mysteries (do NOT answer yet)
1. Who inserted **AVOID INTERSTATE 40** into the transmission.
2. What Claire/Daniel was about to say after *"And if you're hearing this—"*.
3. C-07's ultimate role.
4. CUSTODIAN's ultimate moral interpretation.

These stay unresolved through campaign planning. No document, item description, quest text, or UI may resolve them early.

## Quest structure
Two tracks, separate and both visible:

**Main quest — THE LAST TRANSMISSION** (existing 8 objectives; Mercy's survival / Station Seven).

**Personal quest — FIND THEM**, evolving through named stages:
**FIND THEM → FOLLOW THE TRAIL → THEY'RE CLOSE → FOUND → GET HOME TOGETHER**

Exact stage transitions are established during campaign writing. The final transformation (FOUND → GET HOME TOGETHER) reframes the quest: the objective is no longer searching, but choosing what the couple does together.

## Chapter 1 — THE VOICE (~90–120 minutes)
Establishes: Mercy and its 19-day crisis · the marriage and the expedition backstory (one-per-household rule, the "Don't go" argument) · Ruth, Mara, Eli, Hank · the Station Seven transmission **with the spouse's voice break-in** · the I-40 warning · expedition authorization · vehicle selection · inventory preparation · departure · first road encounter · first camp.

The existing water-vote choice and its flags/trust effects are preserved as one beat inside the expansion.

## Chapter 2 — STRANGERS (~2–3 hours)
Establishes: what the road actually feels like · Crossroads and the world beyond Mercy · Cal Danner · the spouse's first trail confirmation (Mae: "There was another Mercer"; personal quest FIND THEM → FOLLOW THE TRAIL) · Owen's route knowledge and I-40 avoidance · Abel's warning · the Redwater/Haven route choice (unchosen branch normally unavailable) · the fail-forward principle. Full implementation-ready blueprint: `docs/CHAPTER_02_STRANGERS.md`.

## The journey
The ~780-mile road structure, regions, and existing authored encounters (stranger, Custodian sentry, mountain passage) stand. Spouse breadcrumbs are layered across the journey — never on a schedule: someone remembers them, a campsite holds something recognizable, a trader carries their object, a name appears somewhere impossible, a radio recording, a CUSTODIAN system reacting to the surname Mercer.

Full route bible — settlements, route splits, factions, micro-settlements, NPC design rules: `docs/WORLD.md`.

## The reunion (final quarter)
Per `docs/CHARACTERS.md`: genuine reunion, no dialogue wheel, no exposition. Guaranteed once the player reaches that story point.

## The final act — Station Seven (~4–5 hours with the spouse present)
The 780-mile journey still culminates at Station Seven, but **Station Seven becomes a substantial final-act location, not the current immediate ending.** Claire/Daniel is reunited with the protagonist around the final quarter and joins the party; the final hours encompass unraveling Station Seven / CUSTODIAN and determining Mercy's fate — decided together, with the spouse holding opinions, knowledge the player lacks, and the standing to disagree.

**The current `arrival()`/`finish()` four-ending structure is placeholder/legacy campaign content**, to be replaced and expanded by the authored Station Seven final act.

## Spouse survival (locked)
Reunion is guaranteed. The spouse is never automatically killed after reunion. Final-act player decisions may causally lead to Claire/Daniel's death — never as a cheap scripted twist.

## Save-schema notes (for implementation time, not now)
- `g.route` ('jack'/'evelyn'), `g.spouseName` ('Claire'/'Daniel') stored explicitly.
- `g.quests.personal` quest track; backfilled by migration.
- Spouse joins via `g.crew.push()`; portraits `portrait-claire.webp` / `portrait-daniel.webp` required.
- Migration: existing saves derive spouse from `g.sex`; the voice break-in is treated as already heard; history is never rewritten.

## NPC roster (upcoming)
~100 authored NPCs. Roster design begins after this freeze, alongside Chapter 2. Typical run encounters ~30–45.
