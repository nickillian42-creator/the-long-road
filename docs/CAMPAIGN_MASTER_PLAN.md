# Campaign Master Plan v1.0 — THE LONG ROAD
Frozen by Nic 2026-10-05. Chapters 1–10 · ~25-hour target · encounter campaign · consequence architecture · final act.
Chapter detail: Ch1 in `docs/CAMPAIGN.md`, Ch2 in `docs/CHAPTER_02_STRANGERS.md`, Ch3–10 in `docs/CHAPTERS_03_10.md`.
Backstage mystery truth (writer knowledge only): `docs/MYSTERIES.md`.

## Campaign target
~25 hours for a normal first playthrough. Main-story-focused: 15–18h. Typical: 22–27h. Exploration-heavy: 30+h.
The 25 hours INCLUDES story, travel, encounters, combat, scavenging, settlements, optional conversations, survival decisions, and exploration — not 25 hours of scripted narrative plus encounters. Do not artificially pad runtime.

## Chapter pacing (see `docs/CHAPTERS_03_10.md` for Ch3–10 detail)
| Chapter | Title | Hours | Miles |
|---|---|---|---|
| 1 | THE VOICE | 1.5–2 | Mercy → road |
| 2 | STRANGERS | 2–3 | 0–230 |
| 3 | THE ROAD REMEMBERS | 2–2.5 | 200–330 |
| 4 | DO NOT TAKE I-40 | 2.5–3 | 330–430 |
| 5 | DEAD SIGNALS | 2–2.5 | 430–500 |
| 6 | THE LONG WAY NORTH | 3 | 500–590 |
| 7 | HIGH COUNTRY | 2–2.5 | 590–670 |
| 8 | CONTINUITY | 2–2.5 | 670–760 |
| 9 | STATION SEVEN | 2.5 | 760–780 |
| 10 | THE LAST ROAD | 3 | Station Seven + The Core |

Endgame runtime (clarified 2026-10-05): the frozen "4–5 hour endgame" means **post-reunion spouse-active runtime**. The reunion occurs early in Chapter 9 (ideally within the first 30–45 minutes), yielding ~4.5–5 hours of gameplay with Claire/Daniel in the party across Chapters 9–10.

## Personal quest (locked)
FIND THEM → FOLLOW THE TRAIL → THEY'RE CLOSE → FOUND → GET HOME TOGETHER.
Reunion is not the ending — the relationship continues through the final act.

## Mercy clock (locked)
Nineteen days is an estimate of when sustainable support fails — not "everyone dies at midnight on Day 20." The game tracks elapsed days; detours, rest, and exploration affect Mercy's eventual condition. The player should feel pressure without being forced to speedrun. Ending states distinguish: early return/contact · reasonable return · significantly delayed return · information/resources transmitted before physical return.

## Encounter campaign
Random/dynamic encounters operate across Chapters 1–10 — they do not begin in Chapter 2 and do not disappear when the plot becomes urgent. Target: ~30–45 meaningful ambient/road/story encounters per normal ~25-hour run. Master pool supports 100+ scenarios/variants; no single run sees everything. Quiet travel is part of pacing. Distribution by chapter in `docs/ENCOUNTERS.md`.

## Consequence web (locked design)
Do not make every choice return — that becomes predictable. Three classes:
- **Immediate:** the player understands quickly.
- **Delayed:** returns hours later.
- **Silent:** changes world state without explicit notification.
Examples: helping a traveler lets them reach another settlement; robbing someone creates a later enemy; accurate route information saves people; bad information unintentionally kills; traders carry information about the player forward; Leah/Micah's outcome depends on concrete assistance; Cal may return based on treatment; Tess may reappear changed; Morrow's politics affect final support; Redwater/Haven appear in the ending montage; Tollway affects later movement of people/resources. **Never show invisible morality numbers.**

## Character death (locked)
Crew death is possible where existing design permits, never cheap. A major character must not die from one opaque RNG roll. Death results from understandable combinations of: condition, player decision, resources, previous injury, risk, failure to treat, major authored consequence. Claire/Daniel's reunion is guaranteed at that story point; after reunion, spouse death is possible ONLY through understandable late-game consequences — never randomly, never immediately after reunion.

## Ending montage (locked design)
The ending reconstructs the player's journey — show what happened to people, never just GOOD ENDING / BAD ENDING. Potential returns: Mercy · Ruth · June/Amos/Lucy · Silas · Cal · Crossroads · Tess · Redwater OR Haven · Tollway · Free Roads/I-40 consequences · Last Stop · Morrow · Hollow Creek · Station Seven · surviving crew · Claire/Daniel · significant minor-encounter consequences.

## Final choice architecture (locked)
The Core presents no perfect button. Final decisions emerge from accumulated information and relationships. Four philosophies:
- **CENTRALIZE** — restore/strengthen CUSTODIAN authority. Benefit: enormous restoration capability. Risk: surrendering major human decisions to the logic that abandoned populations.
- **SEVER** — disable centralized decision authority, preserve what independent infrastructure survives. Benefit: autonomy. Risk: interconnected systems fail permanently.
- **DISTRIBUTE** — break central authority; give communities regional control. Benefit: shared human agency. Risk: conflict over resources, misuse.
- **RESTRICT / HYBRID** — possible only with sufficient discoveries/relationships/items/knowledge. Limited coordination requiring distributed human authorization for population-level decisions. **Not automatically the golden ending** — it creates its own risks.
The player's journey determines which options are credible and what consequences follow. There is no canonical best ending.

## Chapter 10 end state
Final outcomes combine: CUSTODIAN decision · Mercy · spouse · crew survival · communities · information shared · relationships · time · resources · discoveries. The player may save Mercy without creating a perfect world; may preserve infrastructure while fearing what they empowered; may destroy central control while losing irreplaceable capabilities; may distribute control and create hope plus future conflict. **The last emotional beat concerns home, not technology** — Jack/Evelyn and Claire/Daniel deciding what comes next together, if both survive.

## No-filler rule (locked)
Do not fill every mile. Travel can montage. Quiet road can pass. A ten-minute uninterrupted crew conversation can be worth more than another combat encounter. Sometimes nothing happens — that makes danger less predictable.

## Implementation philosophy (locked)
This plan is NOT permission to implement the entire game in one pass. Development stays incremental: Alpha 0.4 (Chapter 1) → playtest → Alpha 0.5 (Chapter 2) → playtest → chapter-by-chapter or system-by-system. Each pass must preserve saves/migrations, frozen canon, and working features; run tests; provide an iPhone-playable dev build before main merge; never silently change story.

## Creative north star (locked)
THE LONG ROAD is not fundamentally a story about defeating an AI. It is about people trying to rebuild after the systems they trusted failed them. The final question is not "Can you save civilization?" but **"Who gets to decide what saving civilization means?"** — and beneath it, the simplest reason the protagonist ever got into the vehicle: *get back to the person you love.*
