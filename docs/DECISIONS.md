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

## 19. Milestone 2 polish — discovery interstitial (2026-10-05)
Nic playtested the scavenging prototype on mobile and approved the underlying systems, but loot discovery wasn't noticeable enough. Implemented as Milestone 2 polish (not Milestone 3), per Nic's directive: "This is a UX/feedback refinement, not a redesign of the scavenging system."
- **Discovery interstitial:** after a search produces items, a prominent ✦ FOUND ✦ panel lists exactly what was discovered ("Canned Food ×2", "Bottled Water ×1") BEFORE anything enters inventory. Player explicitly decides: TAKE ALL / CHOOSE ITEMS / LEAVE IT ALL. CHOOSE ITEMS expands to per-item TAKE/LEAVE rows. CHOOSE ITEMS is hidden for single-item finds (nothing to choose between). Only contextual options appear.
- **Confirmation names the character:** "Added to Josh's pack: Canned Food ×2, Bottled Water ×1." The searching character (`g.invWho`) receives what is taken.
- **State:** `g.discovery = { who, loc, loot:[{item,qty}], choosing }` — transient, round-trips through the proto save like any other field; no migration needed. Risk/noise accrual, capacity rules, and the FOUND-when-full flow are untouched: TAKE ALL grants via the existing `grantLoot`, so overflow still opens the FOUND panel; choose-mode overflow grounds undecided items and opens FOUND for the remainder.
- **Risk boil-over during a search:** no time to sort — the found loot stays where it fell (location ground, loot-persistent) and the complication fires. Nothing is silently auto-granted, nothing is lost.
- **Chapter One untouched:** `git diff 057dddb -- src/chapters/` is empty; the M2F static leak checks still pass. Changes confined to `src/sim/scavenging.js`, CSS in `src/shell/top.html`, and tests.
- **Tests:** 30 new checks (search→discovery→decide flows, confirmations, choose-mode, leave-to-ground, flee grounds loot, discovery save/load persistence, risk/noise intact). Full suite 350/350 (52 + 70 + 94 + 25 + 109).

## 20. M2 UX pass — item artwork wiring (2026-10-05)
Nic approved the gritty graphic-novel item art direction and ordered it wired into the prototype as a UX pass — explicitly NOT a mechanics change, NOT Milestone 3. All 13 starter items have individual artworks (`art-preview-items/<id>.webp`, ~600–760KB originals kept local; binaries are never pushed through the GitHub connector, so Nic uploads them via GitHub web whenever he wants them live — same as the comic set).
- **Schema:** every item def gains `art: 'assets/items/<id>.webp'` and `find: 'major'|'minor'`. Only `dead_phone` is major (story-significant); the other 12 are minor. Presentation-only fields; capacity/stacking/use/equip/give/drop/survival effects byte-identical.
- **Art resolution** (`src/sim/art.js`, new): `itemArt(id)` prefers an inlined `ITEM_ART` data-URI map when a preview build provides one, else falls back to the asset path; unknown/missing art returns null and callers render a styled placeholder — never a broken image. `artTag(id, cls)` builds the markup with an onerror self-removal fallback.
- **FOUND sequence:** the discovery interstitial now shows the item artwork LARGE as the hero, with name + inspect/story line — unmistakable. Major finds get `discovery-major` treatment (bigger art, stronger glow, slow pulse); common finds are smaller and quicker. Multi-item finds: the major (or first) item is the hero, the rest list as "ALSO HERE" with thumbnails.
- **Art → bag transition:** after TAKE, a transient `g.takeAnim` panel animates the artwork flying into a pack icon and lands on "Added to Josh's/Mara's pack", with CONTINUE plus a short auto-advance (both guarded/idempotent). The grant itself is unchanged — the animation is pure presentation.
- **Bag inventory:** the pack grid is now DayZ-inspired visual slots — same artwork as discovery in every slot, JOSH | MARA tabs kept, detail panel shows art large. Contextual actions (USE / EQUIP / GIVE / INSPECT / DROP) do exactly what they did; only presentation polished.
- **Full-inventory FOUND panel** shows the item art too; overflow mechanics untouched.
- **Comic blips** (`blip(kind)`): mature, grounded graphic-novel marks — calm (soft ink-wash roundel, area taps, take resolves), talk (speech tick, reserved for future dialogue), danger (jagged dark-rust burst, risk boil-over), urgent (amber pulse, loud-noise warning, full-pack FOUND). Small, brief, pointer-events:none, honors prefers-reduced-motion. NOT superhero, NOT Borderlands.
- **Prototype content:** new searchable area "Abandoned pickup — glovebox" holding the dead phone, so Nic can compare a common find vs a story-significant find in one run.
- **Preview plumbing:** `preview-deploy/item-art.json` maps each id to a data-URI of a 512px-downscaled copy (kept under ~2.5MB total); the parent uploads it and the preview builder inlines it as `ITEM_ART`. The repo's `src/` carries no base64. Originals stay in `art-preview-items/` (untracked by the connector pushes).
- **Tests:** 31 new checks (schema fields, itemArt fallback + data-URI branch, artTag fallback, blip variants, glovebox discovery + major treatment, hero/also-here rendering, take transition set/done/idempotent, bag-grid + detail art, overflow FOUND art, blip hooks). Full suite 381/381 (52 + 70 + 94 + 25 + 140).
- **Chapter One untouched:** `git diff 43a64c2 -- src/chapters/` is empty. No mechanics changes anywhere — presentation only.
- **Transport lesson (2026-10-05):** the GitHub connector's `push_files` cannot carry `index.html` once the built file exceeds ~128KB — the CLI takes its JSON as a single argv argument and the kernel's MAX_ARG_STRLEN (128KB) rejects it ("Argument list too long"). Measured: 129,822-byte index.html → 132,815-byte compact-UTF8 JSON, over by 1,743 bytes. This pass pushed all source/test/doc files (remote commits `10d9dd4`, `0662129`); the rebuilt index.html stayed local-only (commit `2f14013` is the complete record). The build is deterministic (`tools/build.py` regenerates index.html byte-identically), so any checkout can reproduce it. Workarounds: upload index.html via GitHub web, or stop committing the built file on dev branches. This limit will recur and worsen as the game grows — do not shave game code/comments to fit the transport.

## 21. M2 visual pass — illustrated searchable areas (2026-10-05)
Nic saw the prototype on his iPhone and ordered the searchable areas themselves illustrated — the "grid of green buttons" had to go. All five areas have wide-landscape artworks (`art-preview-areas/<id>.webp`, ~590–780KB originals kept local; binaries never pushed through the connector, same as the item art).
- **Cards** (`src/sim/scavenging.js` `scavScene`): each area is now an illustrated card — the image is the dominant element, the location name integrated over the bottom with a gradient shade. Single column on phones, two-up on wider screens. Searched areas keep their artwork but render dim/desaturated with a subtle "✓ SEARCHED" tag — never replaced by plain text.
- **Tap → focus** (`scavArea` reworked): tapping a card opens a focus view — the card art enlarges with a short zoom (CSS keyframes, staged so the choices arrive a beat later), then SEARCH QUIETLY / FORCE IT appear as comic-blip decisions (calm blip for quiet, urgent blip for force). No new state machine, no mechanics changes — pure presentation. honors prefers-reduced-motion.
- **Art resolution** (`src/sim/art.js`): `SCAV_ART` maps area ids → art ids (`shelves→store_shelves`, `fridge→refrigerator`, `backpack→backpack`, `cabinet→cabinet`, `glovebox→glovebox`); `areaArt(id)` prefers an inlined `AREA_ART` data-URI map, else `assets/areas/<id>.webp`; `areaArtTag(id, cls)` renders with the same onerror self-removal fallback as item art — never a broken image.
- **Preview plumbing:** `preview-deploy/area-art.json` maps the 5 ids to data-URIs of 640px-downscaled copies (0.26MB total); the parent uploads it and the preview builder inlines it as `AREA_ART` before the game script.
- **Tests:** 22 new M2I checks (art-id mapping, areaArt fallback + data-URI branch, areaArtTag markup/fallback, cards render with art, searched cards keep art + SEARCHED treatment, focus view art + blip decisions). Full suite 403/403 (52 + 70 + 94 + 25 + 162).
- **Chapter One untouched:** `git diff 6a5c617 -- src/chapters/` is empty. No mechanics changes anywhere — presentation only.
- **Transport (recurring):** `index.html` is now 133KB — still over the connector's 128KB argv ceiling, so it stays local-only again (Nic uploads via GitHub web; `tools/build.py` regenerates it deterministically).

## 22. M2 presentation pass — modular layered character renderer (2026-10-05)
Nic stopped the baked full-body portraits mid-pass and ordered a MODULAR visual equipment system instead: characters render as a composite of layers bound to equipment state. The baked-portrait code (charArt/charArtTag, preview-deploy/char-art.json) was removed and superseded the same night — char-art.json must never be uploaded; char-layers.json replaces it.

### Layer spec (defined in code: src/sim/art.js)
- **Canvas:** 600x900 portrait. Anchor coordinates normalized 0-1000.
- **Locked pose:** standing 3/4 view, facing right — matches the reference full-body illustrations the base/jacket layers were painted from.
- **Anchors:** head (500,110), torso (500,350), legs (500,700), beltLeft (400,500), beltRight (620,500), back (300,380), handR (650,560), handL (330,570), sling (480,330).
- **Layer order back->front:** base outfit -> pants -> torso -> jacket -> backpack -> slung weapon -> belt/holster items -> headwear -> held items. (pants/torso/headwear are reserved slots; the PoC ships base, jacket, backpack, equipment.)
- **Per-anchor scale/rotation rules** (CHAR_ANCHOR_RULES, tuned for the 3/4 pose): belt 0.17/0deg, back 0.30/0deg, hands 0.22/∓12deg, sling 0.44/-22deg. Scale = fraction of canvas width.
- **PoC technique:** the media pipeline cannot produce transparency, so outfit variants (base vs jacket) are FULL-CANVAS mutually-exclusive layers — never pixel-composited. Backpack + equipment render as anchored overlay badges at their anchor points (framed item-art chips pinned to the figure; acceptable PoC technique, explicitly blessed in the brief). The architecture supports true cutout sprites later.

### Asset types
- Character-layer art is a SEPARATE asset type from inventory/FOUND art, tracked in CHAR_LAYER_SPEC even where the PoC reuses a file:
  - knife / flashlight -> reuse existing item art as the badge sprite (reusesItemArt: true; distinct character-layer art later).
  - pistol / longgun / backpack / josh_base / josh_jacket / mara_base / mara_jacket -> dedicated layer art in assets/charlayers/<id>.webp (uploaded via GitHub web; the connector never pushes binaries).
- charLayerArt(id): prefers an inlined CHAR_LAYER_ART data-URI map (preview builds), else the asset path; unknown ids -> null with a styled placeholder, never a broken image.

### Equipment binding (state -> visual)
- CHAR_EQUIP_BINDING: knife -> beltRight (weapon), flashlight -> beltLeft (utility), pistol_test -> handR (weapon), longgun_test -> sling (weapon).
- EQUIP adds the badge immediately; UNEQUIP removes it. Tapping an equipped badge stows it via invUnequipSlot (unchanged invUnequip mechanics — full-bag rule preserved, never silently discards). JOSH | MARA tabs render each character's OWN equipment.
- Jacket/backpack are outfit layers, not equipment-model slots: the PoC exposes explicit LAYERS (TEST) toggle controls in the inventory (transient UI state, defensive defaults jacket+backpack ON, no migration, no gameplay effect).

### Prototype-only test equipment (src/sim/testitems.js)
- pistol_test + longgun_test: testOnly: true, PROTOTYPE TEST ITEM descriptions, registered into the item catalog ONLY by registerTestItems() called from the scavenging prototype start. Chapter One never calls it — Chapter One can never see these items. NOT in src/data/items.js (verified by test). Granted to Josh's prototype starter kit.

### Files
- src/sim/art.js: CHAR_CANVAS / CHAR_ANCHORS / CHAR_LAYER_ORDER / CHAR_ANCHOR_RULES / CHAR_LAYER_SPEC / CHAR_EQUIP_BINDING, charLayerArt(), charLayerImg(), charBadge(), renderCharacter(). (Baked charArt/charArtTag removed.)
- src/sim/testitems.js (new): TEST_ITEMS + registerTestItems(). Wired into tools/build.py after data/items.js.
- src/sim/scavenging.js: prototype start registers test items and grants pistol_test + longgun_test to Josh.
- src/sim/invui.js: invScreen renders renderCharacter(who) + LAYERS (TEST) toggles; charTestLayers()/invToggleCharLayer(); invUnequipSlot kept (badge tap-to-stow). Dead eqSlotTag removed.
- src/shell/top.html: .char-figure stage + .char-layer + .char-badge CSS (replaces baked .char-art rules).
- preview-deploy/char-layers.json: 7 downscaled (<=480px) data URIs, 0.44MB total; parent uploads it and the preview builder inlines it as CHAR_LAYER_ART before the game script. preview-deploy/char-art.json DELETED (superseded).

### Tests
- 38 new M2K checks: canvas/anchors normalized, layer order, equipment->anchor mapping, reuse flags, charLayerArt fallback + data-URI branch, test items testOnly + absent from main catalog, figure renders, jacket XOR base mutual exclusivity + toggle, backpack toggle, z-order back->front in markup, EQUIP pistol -> badge at handR, EQUIP longgun swap -> sling badge + pistol badge gone, UNEQUIP -> badge removed + item back in bag, per-character independence, full-bag UNEQUIP blocked with nothing discarded + badge stays. M2G smoke updated. Full suite 442/442 (52 + 70 + 94 + 25 + 201).
- Chapter One untouched: git diff <base> -- src/chapters/ is empty. No mechanics changes anywhere — presentation only.

### Transport (recurring)
- index.html is now ~145KB — still over the connector's 128KB argv ceiling, local-only again (Nic uploads via GitHub web; tools/build.py regenerates deterministically). preview-deploy/char-art.json removed; do not upload it.

### Addendum 2026-10-05 — keyed gear compositing replaces badge cards (Nic playtest verdict)
- Nic: equipped gear as tilted item cards pasted over the portrait does not read as worn/carried. Fix: true cutout compositing for gear with keyed art.
- New module src/sim/keying.js (wired in tools/build.py after sim/art.js): chroma-key cutout at render time. keyAlpha(r,g,b) keys near-pure #00FF00 (g>120, g-r>40, g-b>40); despillPixel pulls residual green fringe to neutral; keyOutImage draws to offscreen canvas, keys, trims transparent borders to a tight bounding box; paintKeyedLayers() paints each canvas[data-keyed] fitted/centered, cached per file, on img onload. Called from screen() after every render (guarded try/catch; no-ops when absent). Failures never break render.
- CHAR_LAYER_SPEC: backpack/pistol/longgun flagged keyed:true with files backpack-keyed/pistol-keyed/rifle-keyed (pure-green keyed assets in art-preview-chars/, generated Oct 5; binaries never through the connector). Keyed layers render as <canvas> at their anchor/scale with NO card chrome: no caption, no tilt/rotate, no badge frame. Unequip tap target preserved (button wrapper). z-order unchanged.
- Knife/flashlight keep card-badge rendering (reusesItemArt) — flagged PENDING GEAR ART in code comments until their keyed art exists. Bag-grid item cards unchanged everywhere. LAYERS (TEST) labeling kept so test-grade status is visible.
- char-layers.json: backpack/pistol/longgun entries replaced with keyed versions (<=480px, 0.44MB total incl. 4 base/jacket layers). Originals untouched.
- Tests: 18 new M2K-keyed checks (keyed flags + file pointers, keyAlpha on bg/gunmetal/wood samples, despill, canvas-not-img on figure, no card chrome on keyed layers, unequip target kept, knife still card badge with caption, unequip removes canvas). Full suite 465/465 (52 + 70 + 94 + 25 + 224). Chapter One byte-identical. No mechanics changes.
- Transport: index.html ~151KB local-only (Nic uploads via GitHub web or regenerates via tools/build.py).
