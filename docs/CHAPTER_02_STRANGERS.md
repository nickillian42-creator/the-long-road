# CHAPTER TWO: STRANGERS — Design Spec v1
Implementation-ready narrative/design specification. Audited against all frozen canon 2026-10-05 (findings in §38). **Do NOT implement yet.**

## 1. Chapter identity
- **Chapter:** 2 · **Title:** STRANGERS
- **Target playtime:** ~2–3 hours
- **Distance:** early road after Chapter 1 through approximately mile 200–230
- **Primary locations:** road → Crossroads → Redwater OR Haven → road
- **Primary theme:** *What do we owe people we don't know?*
- Chapter 1 establishes *why* Jack/Evelyn leaves Mercy. Chapter 2 establishes *what THE LONG ROAD actually feels like*: functioning communities, travelers, competing ideas about survival, people living lives independent of the protagonist.
- Must combine: authored narrative · survival mechanics · scavenging · named inventory · environmental danger · wildlife · minor/unnamed NPC encounters · crew conversations · exploration · authored NPCs · route choice · delayed consequences.
- **The road must feel like gameplay, not loading space between dialogue scenes.**

## 2. Permanent rules
All existing principles hold, especially: crew knowledge · the world remembers · delayed consequences (surprising in timing, never arbitrary in causality) · the road creates stories, not interruptions. None of the four protected mysteries may be revealed or resolved.

## 3. Structure — five movements
1. **THE ROAD** — teach the player that traveling itself creates stories.
2. **CROSSROADS** — Mercy is one community among many; advance the spouse trail.
3. **THE CHOICE** — two legitimate routes, neither labeled correct.
4. **REDWATER OR HAVEN** — two radically different philosophies of community survival.
5. **BACK TO THE ROAD** — leave immediate consequences unresolved; continue north.

## 4. Scene C2-01 — Second Morning (mandatory, 5–10 min)
Morning after Chapter 1's first camp. **Do not open with another catastrophe — establish routine.** Jack/Evelyn wakes; Josh is already inspecting the vehicle; Mara inventories medical supplies; Eli looks down the road. Suggested exchange — Josh: "Good news." / Player: "What's the bad news?" / Josh: "Didn't say there was good news. Just wanted to see how you'd react." Transition quickly into player control. Purpose: establish crew rhythm, make the expedition physical, introduce Chapter 2 without exposition.

## 5. Encounter Slot A — Road Reclaimed (Ambient; mandatory slot, variable content)
Default authored candidate: a herd of feral cattle occupying the highway. The point is not combat — **the road no longer belongs to humans.** Possible solutions: wait · carefully drive through · leave pavement and go around · create noise · contextual equipment/vehicle option. Different vehicles may offer different solutions; **no vehicle gets an objectively superior outcome.** Once the larger encounter pool exists, do not use the same ambient event every playthrough.

## 6. Scene C2-02 — Cal Danner (NPC #011; authored road encounter; mile 50–60; 5–15 min)
Cal stands near the road with an empty water container; his vehicle failed miles back. He does not threaten the crew. His opening need: **"Got water?"** This is Chapter 2's theme in miniature — the player carries resources Mercy and the expedition need; Cal needs some now. Required response families: give substantial water · give limited water · refuse · question him first · offer trade · offer mechanical assistance (if items/circumstances permit) · threaten/intimidate · potentially transport him toward Crossroads. Jack may receive occasional [STRENGTH]/physical options; Evelyn may receive [INSIGHT]/observation options — **never force one route to be morally better.** Record enough state to distinguish treatment. **Do not display "CAL WILL REMEMBER THAT." Do not pay this off during Chapter 2.** Cal's later outcome remains unresolved.

## 7. Scene C2-03 — First Full Scavenge (optional/strongly encouraged; ruined roadside service station; 5–15 min)
Where the 300-item catalog begins feeling like physical objects, not abstract counters. Candidate finds (use actual frozen catalog IDs/names at implementation; never invent duplicates): canned food (e.g. `food_002` Prairie Gold Canned Chili) · jerky (`food_001` Dusty's Original Beef Strips) · RoadKing tire equipment (`tool_007` Tire Plug Kit, `vehicle_013` Tire Patch Bundle) · storm matches (`tool_012` Trailmaster Storm Matches) · old maps (`junk_003` Lone Star Road Map, 2028) · trade junk · one rare low-probability item. **Inventory capacity matters — the player may have to leave something behind.** Utility/capability checks use frozen vocabulary (`pry`, `cut`, `repair`, `ignite`, passive capabilities); **never require an exact tool if another carried item legitimately provides the same utility.** First strong lesson: *what you choose to carry can become part of the story.*

## 8. Encounter Slot B — Night (Ambient/road event; 3–10 min)
Default: something moves outside camp — scratching, movement beyond the firelight. Eli hears it first. Causes may be coyotes, feral dogs, or another plausible regional animal. **The player does NOT necessarily learn what it was.** Responses: investigate · remain quiet · maintain/increase fire · use food as bait · fire a warning shot · relocate camp (fatigue/resource cost) · `capability:light` · contextual options. **One valid resolution: the crew never discovers what was outside camp.** Intentional. Do not force combat.

## 9. Scene C2-04 — Crossroads Approach (mandatory; mile ~70)
First substantial community outside Mercy. Emphasize visually/narratively, not via exposition dump: converted truck stop · trailers/semitrucks in defenses · traders · animals · smoke · improvised structures · travelers · children · arguments · music · repaired vehicles · commerce. **Eli should be particularly affected** — Mercy was his conception of civilization; Crossroads proves the surviving world is much larger. Let the environment communicate.

## 10. Crossroads Exploration Hub (semi-open settlement)
Player controls encounter order. Core authored characters: **Mae Holloway (#012), Owen Voss (#013), Tess Navarro (#014), Abel Rusk (#015)** — plus minor/unnamed residents and travelers who **do not count against the 100**. Contents: trade · conversation · repair opportunity · rumor/information · food/drink · optional exploration · optional evening content. **Do not make every interaction mandatory.**

## 11. Scene C2-05 — Tess
Tess steals a **non-critical** item — never: a protected item, a spouse-critical item, **Josh's Tire Iron**, a required quest item, or an irreplaceable progression object. Prefer a low/moderate-value consumable or trade item. Player catches or confronts her. Response families: demand return · let her keep it · ask why · threaten · negotiate · catch a lie via route/contextual insight. She may claim it's for somebody else — **do not establish whether that's true.** Record treatment; do not pay it off immediately.

## 12. Scene C2-06 — Mae's Breadcrumb
First significant confirmation of the spouse's trail after the transmission. Jack/Evelyn asks about Claire/Daniel or shows evidence. Mae: **"Mercer…"** (player responds) **"There was another Mercer."** Let the moment breathe — do not bury it in a dialogue dump. Mae remembers the spouse but cannot conveniently reconstruct the whole journey; she directs the protagonist toward Owen for northbound travel knowledge. **Personal quest: FIND THEM → FOLLOW THE TRAIL** (unless audit places the transition slightly later in Crossroads). **Do not advance to THEY'RE CLOSE.**

## 13. Scene C2-07 — Owen's Road
Owen provides route/world information: he knows Redwater, has heard of/visited Haven, has dealt with the Tollkeepers. His information is **incomplete/stale — a trustworthy NPC can be wrong without lying.** On I-40: Player: "What about Forty?" / Owen: "Don't." / Player: "Why?" / Owen: "Because I like sleeping." Josh and Owen may exchange a look. Neither explains. **Do NOT reveal the I-40 mystery.**

## 14. Scene C2-08 — Abel's Warning (prefer evening/quiet)
Abel approaches privately. Preserve: Abel: "You're looking for someone." / Player: "Maybe." / Abel: "Then stop saying their name to strangers." / Player: "Why?" / Abel: "Because you aren't the only one asking about them." Abel leaves unexplained. Do NOT reveal: who Abel is · who is asking · whether the target is Claire/Daniel specifically or the expedition more broadly (beyond what the crew can reasonably infer) · whether Abel is friend or enemy · whether CUSTODIAN is involved. Crew may speculate afterward — conclusions stay speculation.

## 15. Optional Crossroads Night (optional settlement content)
Leave quickly or spend time: card game · trade · vehicle repair · drink/meal · Mara conversation · Eli with travelers · Tess follow-up · **Josh briefly disappearing** (must NOT reveal his protected mystery yet) · minor traveler stories · item-specific interactions. Staying costs time but offers information/opportunities; leaving saves time but sacrifices content. **Do not make either choice secretly optimal.**

## 16. Grandma Vale's Fig Jam — canon decision (FROZEN)
**`food_040` (Grandma Vale's Fig Jam) is connected to Ada Vale's family.** It was a pre-Collapse regional brand created/run by Ada Vale's grandmother; Ada (born after the Collapse) grew up on family stories about the business. This is **mundane world continuity, not a quest or destiny connection.** If the player carries `food_040` when meeting Ada: optional small interaction — Ada turns the jar over: "Where'd you find this?" / "On the road." / "That's my grandmother." / "Seriously?" / "Before everything went to hell, apparently people paid eight dollars for her figs." / Josh: "Eight dollars?" / Ada: "That's the part you find unbelievable?" Minor relationship/worldbuilding effect only; no large reward. Reinforces that old junk can have unexpected human significance.

## 17. Scene C2-09 — Route Debate
Characters discuss actual roads and destinations — **never a videogame menu reading REDWATER ROUTE / HAVEN ROUTE.** Information is imperfect. **Redwater direction:** reliable water, established roads, known settlement, shorter/more predictable — but outsiders restricted, water tightly controlled. **Haven direction:** agricultural, food, reputation for safety/hospitality — but route information less certain, strange/contradictory rumors (without spoiling Haven's actual issue). Crew members may disagree. Player chooses. **The unchosen settlement normally becomes unavailable for this playthrough. Do not immediately tell the player what they missed.** Record the route choice.

## 18. Encounter Slot C — Between Communities (variable road event/story encounter; 5–20 min)
Encounter System slot, not a fixed scene. Candidate template: severe thunderstorm / flash flooding — visibility drops, road becomes dangerous, crew spots another vehicle off the roadway with people trapped. Environmental danger and human responsibility become one decision: stop and help · assess first · continue · use equipment · risk vehicle · route-specific protagonist ability · spend supplies · provide directions · contextual solutions. The final pool may substitute other region-appropriate events. **Demonstrates that encounter systems interact rather than appearing as isolated random cards.**

## 19A–24A. REDWATER BRANCH
- **19A Arrival:** First image — Tomas Wren and his sick daughter outside the settlement. They need clean water. Redwater has denied them entry. Beyond the gate: healthy crops, functioning water infrastructure, healthy residents, armed security. Initial emotional reaction should favor Tomas — then the chapter complicates that judgment.
- **20A Gideon:** Controls initial access; professional, not cruel. Explains enough policy to establish outsiders don't simply walk in and consume resources. Aggression gets an appropriate response. Jack: intimidation/physical-presence possibilities. Evelyn: insight/social-reading possibilities. Neither bypasses the settlement conflict.
- **21A Ada:** Eventually meets the crew; Mercy's own water crisis gives the discussion weight. Ada stays understandable — her core: **"I have buried people because I couldn't say no."** Learn the drought history gradually; never dump it in her first speech. Vale-jam interaction here or later if carried.
- **22A Exploration:** Samir (moral limits of rationing), Rosa (reservoir may be recovering — evidence uncertain), Benny (a once-necessary policy can become destructive if permanent), Kira (younger generation living under trauma-based decisions they never experienced), Gideon (the opposite generational response), residents/minor NPCs.
- **23A Tomas problem:** He has lied about where he and his daughter came from. **Do not define the final truth** unless existing canon requires it; expose enough for uncertainty without resolving his history. Player may influence: water/medical treatment · admission · personal resource spending · investigation · public stance for/against Ada's policy. No simplistic morality scoring.
- **24A Climax:** **Do NOT permanently solve Redwater.** The player affects its trajectory. Remember: relationships with Ada and Gideon · Rosa's evidence (supported/investigated?) · Tomas/daughter treatment · Samir's actions (discovered/protected/exposed?) · Benny/Kira interactions · Mercy discussed as future partner? · Vale-jam interaction occurred? The player leaves without knowing Redwater's ultimate fate.

## 19B–24B. HAVEN BRANCH
- **19B Arrival:** Tonal inversion. Haven welcomes: hot food, agriculture, music, children, comfortable sleep, healthy residents, social cooperation. Player should think: *why doesn't everyone live here?* **No horror cues. Do NOT telegraph "secret evil town." Haven genuinely works.**
- **20B Elias & Miriam:** Elias explains the community philosophy gradually. Miriam demonstrates residents can genuinely love the system. Preserve: Player: "Can you choose to leave?" / Miriam: "Why would I?" — **not evidence she secretly wants to escape.**
- **21B Haven life:** Experience Haven *before* Leah's request: shared meal · Ezra playing guitar · children dancing · agricultural work · Eli/Sadie conversation · David at the gate · ordinary residents. **Essential — the player must understand what Haven provides before judging what it takes away.**
- **22B Leah's request:** Leah approaches privately. Preserve: "You're leaving tomorrow?" / (confirmed) / "Take us with you." Then reveal Micah — **the request is to take an eight-year-old into a dangerous world.**
- **23B The argument:** Hear multiple perspectives first — no narrator endorsement. **Leah:** freedom worth risk; her right to decide for herself and Micah. **Jonah:** their parents died outside — "She's alive here"; helping her endangers his nephew. **Elias:** Haven accepted obligations when it took this family in; obligations don't dissolve when someone rejects them. **David:** Haven saved him and his children; the rule protects people from choices made in anger, grief, or restlessness. **Miriam:** many would remain even with the right to leave. **Ezra:** supports the right to leave while believing many would return.
- **24B Climax:** Player may: refuse Leah · openly argue for release · negotiate · secretly help · provide supplies without transport · provide information · potentially take Leah/Micah (feasibility permitting) · expose the plan · other contextual solutions. **Do not force every option to succeed — FAIL FORWARD:** failed persuasion/covert action creates a changed situation, not a dead-end reload. If they leave, record concrete support: food · water · medicine · weapon/equipment · route information · destination recommendation · escort/transport · other meaningful support. **Their later fate is NOT resolved in Chapter 2.** If they remain, record why/how. Jonah, David, Elias, and others remember the protagonist's involvement.

## 25. Fail-forward principle (Chapter 2)
The player should rarely need to reload from a failed dialogue/utility/encounter check. Failure usually means: spend extra resource · lose time · suffer injury/fatigue · damage a relationship · lose an opportunity · receive incomplete information · create a different later state · take another route/solution. **Failure should create story. It should not usually stop story.**

## 26. Survival integration
Chapter 2 uses Alpha 0.3 systems as narrative pressure, not disconnected meters: fatigue affects travel decisions · injuries affect encounter options · infection matters · food/water expenditure affects generosity · time expenditure matters **because Mercy has nineteen days** · named medical items may provide contextual options · vehicle condition may influence road-event solutions. **No unavoidable early death spirals — existing safeguards remain.**

## 27. Vehicle differentiation
All four vehicles stay viable: **Eagle** balanced · **Wagoneer** cargo/capacity · **Baby Raptor** rough-terrain/off-road · **BMW M4** speed-focused with cargo/terrain limits. Include contextual vehicle differences (terrain bypass · carrying capacity · escaping environmental danger · transporting people · fuel considerations). **No secretly-optimal vehicle; no major story content locked behind one vehicle.**

## 28. Jack/Evelyn differentiation
Begin the frozen distinction: **Jack** — physical force, carrying/lifting, intimidation, physical intervention, protection. **Evelyn** — observation, reading people, deduction, improvisation, noticing inconsistencies. Neither route gets more content; they sometimes reach different solutions to the same problem. Use [STRENGTH]/[INSIGHT] markers where natural, not everywhere.

## 29. Crew reactions
Mara (medical ethics, triage, unnecessary risk), Eli (actively learning from the protagonist), Josh (pragmatic, experienced, skeptical of simple answers) respond to player behavior — **remembered narratively, never visible "MARA +5" point popups.** Crew members may disagree with each other; never one unified opinion block.

## 30. Discoveries
Add discoveries only when the crew actually understands something: Crossroads confirms organized communities exist well beyond Mercy · evidence confirms Claire/Daniel passed through Crossroads · Redwater/Haven reveals another model of post-Collapse civilization. Never convert overheard rumors into Discoveries. Preserve Finding → Reading → Understanding.

## 31. State/history to remember (concepts; schema not yet implemented)
- **Cal:** encountered · helped/refused/threatened · water/resources given · transport/repair assistance.
- **Crossroads:** Tess encountered/treatment/stolen-item outcome · Mae breadcrumb received · Owen information received · Abel warning received · stayed overnight / left early.
- **Route:** Redwater or Haven.
- **Redwater:** relationships/decisions · Tomas treatment · Rosa evidence · Samir situation · Mercy discussed · Vale-jam interaction.
- **Haven:** Leah's request learned · stance toward Haven · Leah/Micah outcome · exact supplies/support provided · Jonah/Elias/David reactions.
- **Road encounters:** store only meaningful history future content could reasonably use. **Avoid flag explosion for trivial details.**

## 32. Consequences that must NOT pay off yet
Do not resolve in Chapter 2: Cal's fate · Tess's longer arc · Abel's identity · who else is asking about Claire/Daniel · Redwater's political future · Kira's decision · Leah/Micah's fate · Jonah's long-term response · I-40 truth · Josh's secret · CUSTODIAN's intentions. **Create questions and trajectories; don't close everything opened.**

## 33. Chapter end
Redwater or Haven disappears behind the crew. Back on the road. Eli eventually asks: **"You think we did the right thing?"** Response families: "Yeah." / "No." / "Ask me when this is over." / "There wasn't a right thing." Josh waits, then: **"Get used to that."** Silence. Vehicle continues north. **No consequence montage. No reveal of what happened after the player left.** Then: **CHAPTER TWO COMPLETE — STRANGERS — The road continues.**

## 34. Variable playthrough requirement
Authored spine is fixed: Second Morning → Cal → Crossroads → spouse breadcrumb → route choice → Redwater/Haven → chapter end. Road content around the spine pulls from the Encounter System. Example: cattle → Cal → service station → unknown nighttime animal → Crossroads → flash flood/trapped traveler → Redwater. Or: abandoned ambulance → Cal → snake encounter → alternate scavenge site → Crossroads → stranded family → Redwater. Both remain Chapter 2. **Variability must not destroy pacing or withhold required narrative information.**

## 35. Pacing target
Opening road 20–30 min · Cal/scavenging/night/road 20–30 min · Crossroads 35–50 min · Route transition 10–20 min · Redwater OR Haven 45–70 min · Chapter ending 5–10 min. **Total ~2–3 hours** depending on exploration. Never artificially stretch scenes.

## 36. Chapter Two success test
By the end of STRANGERS, the player should understand: Mercy is not the world · people rebuilt · different communities solved survival differently · resources have human consequences · the crew notices what the player does · items can matter outside their numerical effects · travel itself creates stories · the spouse left a real trail · somebody else may be interested in that trail · route choices genuinely change the experience — and **there may not always be a clean answer.**

---

## 37. Audit record (2026-10-05)
Audited against: CHARACTERS.md · CAMPAIGN.md · WORLD.md · NPCS.md · ENCOUNTERS.md · GAME_DESIGN.md · the complete frozen 300-item catalog · Chapter 1 mileage/timeline · existing engine code.
- **No hard contradictions found.** Spec is clean against all frozen canon.
- **Mileage:** Chapter 1 ends at first camp; Chapter 2's "Second Morning" is a clean handoff. Mile ~70 Crossroads ✓, mile 50–60 Cal ✓, Redwater ~150 / Haven ~175 with chapter ending ~200–230 ✓ (WORLD.md).
- **Quest pacing:** Mae's breadcrumb = FIND THEM → FOLLOW THE TRAIL ✓; THEY'RE CLOSE correctly withheld for The Relay.
- **NPC dialogue** matches NPCS.md verbatim for Mae ("There was another Mercer"), Owen ("Because I like sleeping"), Abel ("you aren't the only one asking about them"), Ada ("I have buried people because I couldn't say no"), Miriam ("Why would I?"), Jonah ("She's alive here"). All route-exclusive and delayed-consequence rules respected.
- **Item catalog:** candidate scavenges map to real frozen IDs (`food_002`, `food_001`, `tool_007`, `vehicle_013`, `tool_012`, `junk_003`); utility checks (`pry`/`cut`/`repair`/`ignite`) use frozen vocabulary; Tess theft exclusions protect `melee_020` (Josh's Tire Iron).
- **19-day clock:** spec uses it as pressure only; no game-over exists in code or canon — compatible.
- **Soft note (not a contradiction):** §29's "no visible MARA +5" vs. the existing crew screen's numeric trust display. Existing code shows trust numbers but never pops point notifications on reactions — the spec's narrative-memory requirement is satisfied as long as trust changes keep arriving as log narration rather than new point popups.
- **Integration gap (flagged, not a contradiction):** the existing bloodied-stranger encounter (quest "Cross North Texas") has no explicit home in this structure. It falls in Chapter 2's mileage band — place it as a fixed story encounter between the route choice and settlement arrival (or in Encounter Slot C's region) during implementation planning.

## 38. Newly frozen decisions (2026-10-05)
1. **Chapter 2: STRANGERS** — this spec is the implementation blueprint (implementation not yet authorized).
2. **Grandma Vale's Fig Jam (`food_040`) ↔ Ada Vale** — pre-Collapse regional brand run by Ada's grandmother; mundane family continuity, not a quest hook (resolves the flagged catalog adjacency from the #016–030 freeze).
3. **Fail-forward** — Chapter 2 design principle: check failures create new situations, not reload prompts (kept chapter-scoped, not yet promoted to a permanent global rule).
4. **Authored spine + variable road** — fixed spine with Encounter-System road content around it; two playthroughs need not have identical road experiences.

## 39. Implementation risks for later (engine/architecture)
Biggest-first, for Chapter 1 tightening and Alpha 0.4 planning:
1. **Inventory system is the critical dependency.** Tess's theft, the scavenge scene, utility/capability checks, and named-item solutions all require the 300-item catalog implemented as real objects (instances with frozen IDs, stack behavior, utility tags, slot capacity). Chapter 2 cannot be built as specified without at least a minimal inventory system first.
2. **Conditional choice rendering.** Item-aware dialogue ([PRY IT OPEN — requires `pry`], disabled/hidden options), protagonist-specific options ([STRENGTH]/[INSIGHT] keyed to the not-yet-implemented `g.route`), and crew-state options all need a choice-option predicate system. Current `event()` choices are static.
3. **Crossroads hub needs a location phase.** Semi-open settlement with player-chosen order requires a persistent hub screen with multiple exits — a new `g.phase` pattern beyond the linear road→event→road flow.
4. **Encounter pool system.** Slots A/B/C plus route/region/weather/crew-conditioned selection need the ENCOUNTERS.md selection logic implemented, replacing the flat 30% RNG in `travel()`.
5. **Save v4 extensions.** Beyond the planned `g.route`/`g.spouseName`/`g.quests.personal`: route-choice flag, per-NPC memory flags (§31), and *structured* support records (e.g. Leah/Micah's exact supplies) that flat booleans can't carry. All fit in `g.flags` + small structures — plan now, not later.
6. **Day budget.** Chapter 2's content (~2–3h playtime) should be day-budgeted during implementation: roughly 6–10 in-game days keeps the 19-day pressure real without making later chapters unwinnable.
7. **Stranger integration.** Place the existing bloodied-stranger encounter explicitly in the Chapter 2 structure (§37).
8. **Testing surface.** Semi-open order, two exclusive branches, and variable encounters multiply test paths — the existing `tests/` pattern should get a chapter-2 fixture with branch coverage before implementation starts.
