# Prologue & Main Quest — Alpha 0.2.2
Canonical narrative approved by Nic (2026-10-04). This document is the single source of truth for the prologue text and quest structure.

## PROLOGUE: THE WORLD WE LOST
Shown once per New Journey (never on Continue). Six pages + final transition. One cinematic image per page (`assets/bg-prologue-*.webp`, 1400×700). Typewriter narration, Prev/Next/Skip, page dots, Ken Burns drift. Spoiler rule: CUSTODIAN's crisis is established; the full truth is never revealed here.

### Page 1 — BEFORE THE SILENCE (2029)
The world did not know it was living through its final ordinary days.

Humanity had built systems capable of managing entire nations. Power, transportation, communications, agriculture, and defense had become connected through an autonomous network known as CUSTODIAN.

Its purpose was simple: preserve civilization, whatever the cost.

Nobody imagined how much that promise might demand.

### Page 2 — THE CASCADE (The day everything changed)
It began with interruptions. A power station going dark. A hospital losing contact with its suppliers. Aircraft grounded. Emergency broadcasts contradicting one another.

Then the networks stopped answering.

Cities lost power. Governments lost communication. Automated systems continued operating without explanation, while others shut down entirely.

Nobody knew whether CUSTODIAN had failed, been compromised, or was still carrying out its instructions.

By the time anyone understood the scale of the disaster, there was no longer a way to stop it.

### Page 3 — THE LAST EXODUS (The roads became graveyards)
Millions fled the cities.

Highways filled with vehicles carrying everything their owners believed they would need. Fuel ran dry. Hospitals emptied. Food shipments never arrived.

Neighbors became strangers. Strangers became threats.

Some communities opened their gates. Others built walls.

The old world did not disappear in a single explosion. It died slowly, one abandoned home, one empty road, one unanswered radio call at a time.

### Page 4 — SIXTY YEARS LATER (2089)
Sixty years have passed since the collapse.

Forests consume highways. Rusting vehicles lie where their owners left them. Entire cities stand silent beneath the weight of a world that has learned to live without humanity.

The people who remember civilization are growing old. Their children have inherited its ruins.

Small settlements survive through trade, scavenging, farming, and sometimes violence.

But scattered across the continent, machines from the old world still operate.

And occasionally, something speaks through the static.

### Page 5 — MERCY, TEXAS (Nineteen days)
Mercy is your home.

Its walls have endured raiders, drought, disease, and generations of uncertainty. Its people have survived by sharing what little they have.

Three days ago, the settlement's well became contaminated.

The remaining clean water is estimated to last nineteen days under strict rationing.

Ruth, Mercy's council leader, has exhausted every nearby option.

For the first time in years, the people of Mercy are discussing whether their home can survive another month.

Then an old radio comes alive.

### Page 6 — THE TRANSMISSION (Continuity Station Seven)
A voice emerges from the static. Calm. Clear. Almost impossibly familiar.

"CONTINUITY STATION SEVEN OPERATIONAL."

"MEDICAL FACILITIES ACTIVE. CLEAN WATER AVAILABLE."

"AVOID INTERSTATE 40."

The transmission repeats. Its origin appears to be somewhere in Colorado, nearly eight hundred miles away.

Hank, Mercy's aging mechanic, goes pale when he hears it.

He recognizes the voice.

He heard it sixty years ago, when the world was ending.

And it hasn't changed.

### Final transition — MAIN QUEST UNLOCKED: THE LAST TRANSMISSION
Your home is running out of water.

A voice from the dead world is offering salvation.

You have four survivors, one vehicle, and 780 miles of dangerous country between Mercy and the truth.

You cannot know what waits at the end of the road.

Only what happens if you never leave.

EVERY MILE COSTS SOMETHING.

[BEGIN JOURNEY] → character creation

## MAIN QUEST: THE LAST TRANSMISSION
Eight objectives, completed by story events — never by bare distance traveled:

| # | Objective | Completes when |
|---|---|---|
| 1 | Leave Mercy before the water runs out | Chapter One choice made |
| 2 | Cross North Texas | The stranger encounter is resolved |
| 3 | Cross the Panhandle | The Custodian sentry encounter is resolved |
| 4 | Survive the Dead Corridor | The mountain passage is reached |
| 5 | Cross the mountain passage | The passage choice is made |
| 6 | Reach Continuity Station Seven | Arrival (780 miles) |
| 7 | Discover the truth behind the transmission | An ending is chosen |
| 8 | Decide the fate of Mercy | An ending is chosen |

Discoveries log notable finds (C-07 tag, access frequency, broadcast terminal, Hank's secret). The journal's Story So Far recap is generated from the player's actual flags.

## Design notes
- Mercy's nineteen-day water reserve is an estimate at departure, not an automatic game-over timer. Time-passage consequences are a future milestone.
- Hank was a child when he first heard the voice; he is now an elderly mechanic. Portrait, dialogue, and backstory follow that timeline.
- Quest state lives in the save blob (`g.quests`, `g.discoveries`), schema v2, backfilled for older saves.
