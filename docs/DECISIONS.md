# Project Decisions
Locked in with Nic on 2026-10-04. Revisit only with Nic's approval.

## 1. Art pipeline — collaborative (Muse + ChatGPT)
Original AI-generated artwork in grounded post-apocalyptic realism. No manufacturer badges, no copied game assets, no neon sci-fi aesthetics. Filenames and dimensions in `ASSET_MANIFEST.md`.

## 2. Code structure — single file until it hurts
`index.html` stays monolithic while manageable. Split into CSS/JS/data modules when narrative content makes collaboration painful (expected mid-Alpha 0.3).

## 3. Save compatibility — migrate, don't break
Saves carry a version field (`g.v`). `migrateSave()` upgrades older saves on load. Clean breaks allowed only at Beta, and only if unavoidable.

## 4. Workflow — small fixes direct, features via PR
Small fixes push straight to `main`. Larger features use branches + pull requests for review before going live.

## 5. Standing rules (from the project brief)
- Inspect the repo before assuming; propose before substantial changes.
- Never delete working gameplay to add visuals.
- Test JS syntax and game flows; never claim untested work was tested.
- Show Nic proposed gameplay-balance changes before implementing them.
- No paid services or unnecessary dependencies. GitHub Pages hosting.
- Keep the live GitHub Pages deployment functional at all times.

## 6. Campaign canon freeze (2026-10-05)
Locked with Nic. Full canon: `docs/CAMPAIGN.md`, `docs/CHARACTERS.md`, `docs/PROLOGUE.md`.
- Timeline: 2029 → 2089 is sixty years. Never state as objective fact that CUSTODIAN initiated the Collapse; cause and CUSTODIAN's role stay deliberately ambiguous.
- Protagonists locked for v1: **Jack Mercer** (male) / **Evelyn Mercer** (female). Spouses: **Claire Mercer** / **Daniel Mercer**. Mercer surname is canonical.
- Two-voice rule (permanent): the Station Seven broadcast voice and the spouse's break-in are separate voices; Ruth recognizes something unsettling about the broadcast's cadence but will not explain it, the protagonist instantly recognizes their spouse. (Retcon 2026-10-05: the Josh-recognition clause was removed; Josh does not recognize the Voice.)
- Expedition backstory: 18 months prior, Mercy detected a changing machine signal from the northwest; the council authorized a small expedition under a one-member-per-household rule; Claire/Daniel volunteered, Jack/Evelyn stayed after their "Don't go" argument.
- Personal quest: **FIND THEM → FOLLOW THE TRAIL → THEY'RE CLOSE → FOUND → GET HOME TOGETHER**, separate from THE LAST TRANSMISSION.
- Reunion guaranteed at ~final quarter; spouse joins the party for a ~4–5 hour Station Seven final act. Spouse is never auto-killed after reunion; final-act player decisions may causally lead to their death — never a cheap scripted twist.
- Current `arrival()`/`finish()` four-ending structure is placeholder/legacy content, to be replaced by the authored Station Seven final act.
- Four mysteries stay unresolved: who added AVOID INTERSTATE 40; what the spouse was about to say; C-07's ultimate role; CUSTODIAN's moral interpretation.
- Permanent principle: **THE PLAYER SHOULD KNOW ONLY WHAT THE CREW KNOWS.**
- 300-item Master Catalog v1.0 frozen (audit passed 2026-10-05; firearm damage table still pending Nic's explicit lock).

## 7. World Route / Settlement Framework v1 (2026-10-05)
Locked with Nic. Full bible: `docs/WORLD.md`.
- 12 major locations, mile 0–780: Mercy (0) · Crossroads (70) · Redwater (150) **or** Haven (175) · Tollway (250) · Blackridge (330) · I-40/C-07 **or** Free Roads (330–450) · Last Stop (450) · Republic of Morrow (520) · Hollow Creek (620) · The Relay (690) · Station Seven (780) · The Core.
- Two route splits (Redwater/Haven, I-40/Free Roads); routes rejoin; splits create different-not-better experiences.
- Route design principle: ~7–9 major communities per typical run; missing content is desirable; no route holds all lore, every route carries enough for the main story.
- Factions: Mercy, Redwater Authority, Haven, Tollkeepers, Republic of Morrow, Free Caravans, CUSTODIAN-related systems (CUSTODIAN is not a conventional faction; intentions ambiguous).
- Micro-settlement principle: small communities between majors; listed examples are direction, not mandatory canon.
- ~100 authored NPCs populated through locations; ~30–45 encountered per run; no generic survivors — name, motivation, reason for being there.
- Spouse-trail pacing: Crossroads (vague memory) → Last Stop (recent encounter) → Relay (proof, THEY'RE CLOSE) → Station Seven (FOUND).
- Haven is ideological conflict, never a cult/cannibal twist. Redwater is morally complicated, never villainous. Morrow's politics have no objectively correct side.

## 8. NPC Roster v1 — #001–015 (2026-10-05)
Locked with Nic. Full roster: `docs/NPCS.md`. Covers Mercy (#001–010), early road (#011), Crossroads (#012–015).
- NPC design rule: people first, not quest dispensers; eventual importance must not be obvious on first encounter; no gamey telegraphing of consequential choices.
- **Surname rule (locked):** Mercer is reserved for the protagonist/spouse trail. #011 was renamed from "Cal Mercer" to **Cal Danner** before freezing.
- New Mercy NPCs: Ruth Calder (58, council leader), Mara Velez (33, medic — clinical honesty, privately records lost patients' names), Eli Boone (24, coming-of-age arc, Lucy mountain beat), Josh Rourke (~68, I-40 reaction significant, connection unresolved), June Bell (46, radio operator), Amos Bell (49, water engineer — the 19-day estimate was "after nineteen days, I don't know what happens"), Lucy Bell (9), Silas Reed (52, rational council critic), Nora Pike (71, archivist — "bring me something true," lore-catalog hook), Wes Dalton (29, mechanic).
- Crossroads: Mae Holloway (61, information broker — delivers "There was another Mercer."), Owen Voss (44, Free Caravan driver — trustworthy-but-stale information principle), Tess Navarro (17, scavenger — independent off-screen life), Abel Rusk (56, ambiguous northbound stranger — identity and "who else is asking" unresolved by rule).
- **Flagged (not changed pending Nic):** Eli's draft age was 21, set to 24 to match the "mid-20s" portrait bible. Josh at ~68 conflicts with the portrait bible's "late 70s" but matches the deeper canon (child in 2029 → ~60–68); `docs/ASSET_MANIFEST.md` correction proposed, not yet applied.
- Roster continues at #016 (Redwater/Haven — route-exclusive characters begin).

## 9. NPC Roster — #016–030 + causality principle (2026-10-05)
Locked with Nic. Added to `docs/NPCS.md`: Redwater #016–022 (Ada Vale, Dr. Samir Kess, Gideon Vale, Rosa Mendoza, Benny Shaw, Kira Shaw, Tomas Wren) and Haven #023–030 (Elias Ward, Miriam Ward, Leah Harrow, Jonah Harrow, David Quill, Sadie Quill, Ezra Cole, Micah Harrow).
- New permanent design principle in `docs/GAME_DESIGN.md`: **DELAYED CONSEQUENCES MUST FEEL SURPRISING IN TIMING, NOT ARBITRARY IN CAUSALITY.**
- Continuity fixes approved and applied: Eli Boone = 24; Josh Rourke ≈ 68; `docs/ASSET_MANIFEST.md` corrected ("late 70s" → "late 60s"), preserving the 2029→2089 chronology.
- Leah/Micah delayed-consequence design locked: outcome depends on concrete assistance (supplies, equipment, route info, escort, directing to settlements), never a good/bad flag; no outcome canonized yet; helping ≠ good ending, refusing ≠ bad ending.
- Route exclusivity locked: normal playthrough does not see both branches fully; campaign-critical information stays branch-independent.
- **Flagged, undecided:** "Ada Vale" vs. catalog `food_040` "Grandma Vale's Fig Jam" — plausible family connection (Ada b. ~2035 could be Grandma Vale's granddaughter) or coincidence. Needs Nic's decision before any writing implies a link.
- Tomas Wren's undefined origin and Abel Rusk's undefined agenda are separate unresolved threads; not connected unless explicitly decided.

## 11. Chapter 2: STRANGERS spec v1 (2026-10-05)
Frozen blueprint in `docs/CHAPTER_02_STRANGERS.md` (implementation NOT authorized).
- Five movements, mile ~0–230; authored spine fixed, road content variable via Encounter System slots A/B/C.
- Mae's breadcrumb advances personal quest FIND THEM → FOLLOW THE TRAIL (THEY'RE CLOSE withheld).
- Redwater/Haven route-exclusive; unchosen normally unavailable; neither labeled correct.
- Grandma Vale's Fig Jam (`food_040`) ↔ Ada Vale connection frozen: pre-Collapse regional brand run by Ada's grandmother; mundane family continuity, not a quest hook (resolves flagged adjacency).
- Fail-forward principle (chapter-scoped): check failures create new situations, not reload prompts.
- §31 state concepts + §39 implementation risks recorded for Chapter 1 tightening and Alpha 0.4 planning (inventory system is the critical dependency; conditional choice rendering; Crossroads hub phase; encounter pool; save-v4 extensions; day budget; stranger integration).

## 10. Encounter System v1 (2026-10-05)
Locked with Nic. Full bible: `docs/ENCOUNTERS.md`.
- The ~100 NPC roster counts **authored named characters only**; unnamed/minor encounter characters are a separate population and don't count against it.
- Four tiers: Ambient (30s–2min), Road Event (3–10min), Story Encounter (10–30min), Major Encounter (30–60+min); pool selected by region + route + time + weather + previous choices + resources + crew state.
- Selection is not pure RNG: random, seeded, conditional, once-only, decision-gated, and crew/item-dependent encounters.
- Categories: wildlife (not always combat; "you never find out what was out there" is a valid outcome), human threats (raider variants; cannibals used once and sparingly, never cartoonish), disease & injury (built on 0.3 systems; sickness creates story decisions against the 19-day clock), environmental trials (vehicle choice matters; no secretly-correct vehicle), mechanical disasters (named-item solutions from the 300 catalog), strange road encounters (some nothing, some loot, some people, a tiny number CUSTODIAN-adjacent — never labeled), ordinary people.
- New permanent rule in `docs/GAME_DESIGN.md`: **THE ROAD SHOULD CREATE STORIES, NOT INTERRUPT THEM.**
- Existing `randomEvent()` 4-event pool is the superseded prototype; encounters must not resolve the four frozen mysteries.

## 12. Campaign Master Plan v1.0 (2026-10-05)
Frozen with Nic after a 27-point audit (no hard contradictions). Full plan: `docs/CAMPAIGN_MASTER_PLAN.md`; chapters 3–10 outlines: `docs/CHAPTERS_03_10.md`; writer-only backstage truth: `docs/MYSTERIES.md`.
- ~25-hour campaign (typical 22–27h); chapters 1–10 with locked pacing; personal quest and Mercy-clock rules; consequence web (immediate/delayed/silent, never visible morality numbers); character-death rules; ending-montage design; four-philosophy final choice (Centralize/Sever/Distribute/Restrict-Hybrid, no canonical best ending); no-filler rule; incremental implementation philosophy.
- **Backstage mystery truth frozen as writer canon only:** CUSTODIAN (continuity-defense network, catastrophic utilitarian triage, permanent moral ambiguity); C-07 (fractured continuity process, fallible, never deus ex machina); I-40 warning inserted by C-07 (controlled continuity corridor); Josh's salvage-expedition guilt (not betrayal); the spouse's interrupted warning (unstable/contested broadcast; "I'm alive" caused the journey); MERCER recognized via authorization-chain association (not bloodline); human seekers (Morrow-linked networks, scavenger/mercenary interests; Abel knows pieces, allegiance flexible). Firewall: nothing player-facing may reveal backstage truth before the crew legitimately learns it.
- **Roster complete: exactly 100 authored NPCs** (`docs/NPCS.md` #001–100). 31 collision cleanups approved with final names; Helen Voss (#094) canonized as Owen Voss's deliberate aunt (lightweight family texture); MERCER protected for protagonist/spouse only.
- **Endgame runtime clarified:** the frozen "4–5 hour endgame" = post-reunion spouse-active runtime. Reunion early in Chapter 9 (first 30–45 min) → ~4.5–5h with Claire/Daniel across Chapters 9–10.
- **Engineering principles locked:** one reusable settlement-hub pattern (not six bespoke implementations); data-driven encounters (not expanded hardcoded events); single-file split scheduled no later than Chapter 3 implementation (must preserve Pages deployment + save compatibility); save/state schema (`g.chapter`, `g.consequences`, structured settlement/encounter/NPC/Mercy/montage records) documented before Alpha 0.4 expands Chapter 1 — final-choice credibility computed from accumulated state, never a stored morality score.
- Title-screen timeline fix approved and applied: "thirty-seven years" → sixty years; "CUSTODIAN initiated the collapse" softened to preserve mystery without stating an incomplete interpretation as narrator fact (consistent with §6 ambiguity rule).

## 13. Character canon retcon (2026-10-05)
Approved by Nic (+ChatGPT narrative review). Controlled retcon: the new character concepts win; downstream story functions are preserved by reassignment, not blind overwrite.
- **Josh Rourke:** ~49 (born ~2040), Mercy mechanic/fabricator. Never knew the pre-collapse world. 11→4 journey guilt replaces the salvage-expedition history. Corridor unease is lived experience, not CUSTODIAN knowledge. He does NOT recognize the Station Seven broadcast.
- **Mara Velez:** ~24, Mercy-raised medic. Map wall is a compilation; multi-source I-40 markings are her key observation. Compassion voice opposite Josh's caution. Asks to travel — crew-assembly beat.
- **Ruth Calder:** ~80 (born ~2009), remembers the old world. Memorial book of Mercy's lost (recurring object). Dark survival history; sister died. Carries the early Voice connection (cadence unsettles her; she will not explain). Not a CUSTODIAN insider.
- **Eli Boone:** ~12, stays in Mercy. Dead phone / "15's the one." (attempt #15). Notices the broadcast's repeat pattern. The Josh/Eli argument + phone-in-bag is the departure's emotional peak.
- **Supersedes:** §12's "Josh's salvage-expedition guilt" backstage entry (rewritten in `docs/MYSTERIES.md`); the two-voice rule's Josh clause (§6 amended); NPCS.md #001–#004 and freeze audit notes.
- **Preserved:** CUSTODIAN/C-07/I-40 truth chain, spouse's interrupted line, MERCER recognition, human seekers, Station Seven as the canonical Voice, Claire/Daniel + Colorado objective, authored treatment/history (no meters ever).
- **Implementation:** Mercy Day preparation sequences + departure convergence on `alpha-0.4-dev`; Eli leaves the traveling crew at departure (crew: protagonist + Josh + Mara). Portraits for all four flagged for a later art pass.

## 14. Crew motivations (2026-10-05)
Locked with Nic (+ChatGPT) before the Chapter One playtest. The initial traveling party is protagonist + Josh + Mara — and they leave for different reasons. Do NOT treat the party as a permanent RPG structure; people encountered later join, leave, refuse, die, separate, or travel temporarily according to their own motivations.
- **Protagonist:** "The person I love is in Colorado." (Claire/Daniel — the central objective, unchanged.)
- **Mara:** "I need to know what's beyond Mercy." She volunteers. Her motivation is partly selfish and human — a life spent studying maps on paper, and now a real chance to see the world. She has genuine practical value as a navigator. Her relationship with the protagonist develops on the road; it does NOT begin as devotion.
- **Josh:** "I can't let what happened before happen again." He does NOT want to leave — Eli, the workshop, responsibilities, and twenty years of avoiding that road. Ruth asks him to see them through the I-40 corridor; his mechanical ability, road experience, and firsthand knowledge of that country could keep them alive. When he sees Mara's route he recognizes 11→4 territory. Publicly he agrees because they need him; privately he is confronting something he has avoided for twenty years (do NOT reveal yet). His commitment is explicitly bounded: **"I'll get you through Forty."** He is NOT committing to Colorado — leaving room for a later, meaningful decision to continue.
- **Ruth** stays in Mercy (~80; Mercy needs her; emotional connection to home). **Eli** stays in Mercy (as implemented) — his desire to go and Josh's refusal hits harder because Josh doesn't want to leave either.

## 15. Follow-up dialogue + the vow (2026-10-05)
Narrative review (Nic + ChatGPT) approved 4 of 5 proposed Chapter One follow-ups; cut #5 (asking Ruth about Josh — departure too dense; Josh's history comes through Josh and the road). Implemented on `alpha-0.4-dev`.
- **Design principle, going forward: Information can be revisited. Decisions cannot.** DEPTH ONLY follow-ups give information/characterization/emotion with no state change — the player explores and continues. CONSEQUENTIAL choices write authored treatment/history once, permanently, with no backing up.
- **#1 Josh's hands** (DEPTH ONLY): "Your hands were shaking." → "They do that sometimes." / "Hands shake. Tools don't." Cause deliberately unexplained; ChatGPT adjusted wording to avoid establishing the tremor as lifelong.
- **#2 Mara's notebook** (DEPTH ONLY): "What's in the notebook?" → her copied routes/half-maps, "My wall started in here." Pre-seeds the Day 2 map wall. No state flag.
- **#3 I-40 "why"** (DEPTH ONLY): "Has anyone tried to find out why?" → "They went anyway. They didn't come back." Makes the danger human without explaining the mystery. No state flag.
- **#4 Ruth's vow** (CONSEQUENTIAL — ONE TIME, two-sided): after "find something for Mercy too. Come back," the player may choose "I will. For Mercy too." → treatment `vowed_for_mercy` ("Then Mercy will remember that. So will I.") or "I can't promise that." → treatment `would_not_vow_for_mercy` ("Good. Promises shouldn't come cheap."). Refusing is respected, never punished, never numeric. Either answer is permanent for the playthrough; the choice is offered once and structurally cannot be re-taken. Both states are reserved for late-game callbacks — the question is whether the protagonist lives according to what they said.
- **Preserved:** authored treatment/history only (no meters); tightly paced Chapter One; all protected lines.

## 16. Backfill canon correction (2026-10-05)
The v4 `migrateSave()` hankSecret backfill still carried pre-retcon text ("Josh admitted he once worked inside a Custodian facility"). Reworded to match the live retconned discovery ("his group lost people near the old interstate works. Something was wrong there. He never understood what."). Migration behavior untouched — surgical text correction only. Repo-wide search confirmed no other live-code claims of Josh/CUSTODIAN employment (MYSTERIES.md and CHAPTER_02_STRANGERS.md already carry the retcon; DECISIONS.md §12's old phrasing is explicitly superseded by §13). Regression tests added so the killed canon cannot return.

## 17. Foundation Milestone 1 — modularization + legacy retirement (2026-10-05)
Nic approved; implemented on `alpha-0.4-dev`. Deliberately boring: no new systems, no Chapter One content changes.
- **Modularized** the single-file build. `src/` is now the source of truth; `tools/build.py` assembles the single-file `index.html` (GitHub Pages + preview + test harnesses all consume the built file unchanged). Layout: `src/core/` (globals, ui, state, engine), `src/chapters/` (prologue, chapter1), `src/sim/` (combat, rng), `src/shell/`, `src/boot.js`. See `src/README.md`.
- **Retired the legacy road loop** (road/travel/scavenge/rest/randomEvent/stranger/drone/mountain/passChoice/arrival/finish/end/journal/crewScreen/questScreen/opening + ~30 support functions). Deleted, not commented out; history in git. No story content transplanted.
- **Preserved:** turn-based combat primitives (`beginBattle`/`battle`/`combat`) verbatim in `src/sim/combat.js` — DORMANT, awaiting the encounter engine (bodies still reference retired `road`/`end`; must be rewired before live use). HUD helpers `fatTier`/`maxFatigue` kept. Quest data fns, `discover`, `updateQuests`, `log` kept as generic infrastructure.
- **Eli retcon enforced in state:** `begin()` no longer initializes Eli as crew (crew = Josh + Mara only). v5 migration strips Eli from existing saves' crews. (`departurePhone()` already removed him at departure; now he is never added.)
- **Numeric crew trust retired:** all live trust writes removed (4 in Chapter One scenes, rest died with the legacy loop). `trust:0` remains as inert data on crew objects; authored `noteTreatment` history is the system of record.
- **v5 migration** (conservative, no speculative fields): Eli strip + remap of retired legacy phases (`opening/road/crew/journal/quest/battle/event/end/arrival/breakdown`) → `phase1_done`. `render()` default also lands on `phase1_done` as belt-and-suspenders.
- **Seeded RNG** (`src/sim/rng.js`, mulberry32) added but NOT wired into gameplay — Chapter One uses zero randomness (statically verified). Combat keeps `Math.random` while dormant; the encounter engine will adopt the seeded RNG.
- **Chapter One behavior preserved:** all kept functions byte-identical to pre-milestone (verified programmatically); the 4 trust-write removals are the only Ch1 code diffs and change no prose/choices/pacing. Visible consequence of the ordered retcon: HUD survivor list now shows Josh + Mara (Eli was never a traveler).
- **Tests:** 241/241 passing (41 legacy alpha03 tests retired with the code they covered; 19 new v5-migration + 25 new Milestone-1 regression tests added).

## 18. Foundation Milestone 2 — survival, inventory & scavenging foundation (2026-10-05)
Nic approved the frozen brief; implemented on `alpha-0.4-dev`. First new gameplay systems on the Milestone 1 architecture. Chapter One untouched (src/chapters/ byte-identical to baseline `3f897a4`).
- **Inventories:** Josh and Mara carry independent packs — no shared inventory. 10 slots per character (balance value, not canon). A stack occupies its item's `size` slots; consumables stack to their max; no weight math. Player manages both packs. GIVE only when `g.together` (default true); separation keeps inventories apart by construction (every op takes an explicit character).
- **Touch-first UX:** JOSH | MARA tabs (never side-by-side mini-panels). Tapping an item shows only applicable actions: USE / EQUIP-UNEQUIP / GIVE / INSPECT / DROP. USE is hidden when it would do nothing (e.g., drinking at Hydrated). No drag-and-drop.
- **Item schema** (`src/data/items.js`): id/name/kind/size/stack/desc/inspect/use/equip. 14 starter items only (water, 2 foods, 4 meds, 2 weapons, 2 utility, ammo, dead phone story object). Every item earns its place. The future 300-item catalog drops into this schema unchanged.
- **Survival:** per-character hunger (Fed→Starving) and thirst (Hydrated→Dehydrated), deterministic tick model — no meters, no randomness. Thirst always deteriorates faster. Health is ordinal (Healthy→Hurt→Badly Hurt→Critical), never a 0–100 bar. Conditions: bleeding/infection/illness/exhaustion/limb. Treatment is contextual (bandage→bleeding, antiseptic→infection, medkit→stabilize one step + illness, splint→limb, rest→exhaustion); nothing insta-heals. Recovery requires fed + hydrated + no acute condition + time. Early warnings precede severe penalties.
- **Difficulty:** canonical STORY / SURVIVOR / HARDCORE SURVIVAL. The pre-existing new-game labels (`story`/`survival`/`hard`) are preserved untouched and aliased at read time (`survival`→SURVIVOR, `hard`→HARDCORE); unknown/missing defaults to SURVIVOR. Modifiers scale scarcity, pressure, risk, and recovery — never enemy stats, never the story. Prototype offers its own difficulty picker defaulting to Survivor.
- **Scavenging prototype:** separate scene from the title screen (NOT injected into Chapter One — `phase1Done` unchanged). One roadside stop, 4 tappable areas (shelves, fridge, backpack, cabinet). Each search: SEARCH QUIETLY (slow, quiet) vs FORCE IT (fast, loud). Risk/time accumulates; noise makes later risk worse; risk ≥ 100 forces a scare that ends the run (no auto-combat). Loot is authored/fixed; searched areas stay searched; dropped/left items persist on the location's ground; re-entry never regenerates. Prototype saves under isolated key `longroad_proto` — real saves never touched.
- **FOUND state:** overflow loot never auto-discards. TAKE (if room now) / GIVE / USE / LEAVE, only applicable options shown; queued remainder resolves in order.
- **Equipment:** minimal Weapon + Utility slots; equipped gear doesn't consume pack slots and stays on its character. No armor/clothing.
- **Save:** v6 migration (conservative — fills only missing fields: empty packs, neutral survival, empty scav state, together=true). `begin()` stamps v:6 with initialized sim state (Chapter One games start with empty packs; the prototype grants its own starter kits).
- **Tests:** 79 new (inventory, survival, difficulty, scavenging, migration, preservation, UI render smoke). Full suite 320/320.
- **Deliberately not built:** Chapter Two, encounter engine, combat changes (still dormant), crafting, skills, economy, armor, Ch1 randomness.
