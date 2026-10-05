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
- Two-voice rule (permanent): the Station Seven broadcast voice and the spouse's break-in are separate voices; Hank recognizes something about the Station voice, the protagonist instantly recognizes their spouse.
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
- New Mercy NPCs: Ruth Calder (58, council leader), Mara Velez (33, medic — clinical honesty, privately records lost patients' names), Eli Boone (24, coming-of-age arc, Lucy mountain beat), Hank Rourke (~68, I-40 reaction significant, connection unresolved), June Bell (46, radio operator), Amos Bell (49, water engineer — the 19-day estimate was "after nineteen days, I don't know what happens"), Lucy Bell (9), Silas Reed (52, rational council critic), Nora Pike (71, archivist — "bring me something true," lore-catalog hook), Wes Dalton (29, mechanic).
- Crossroads: Mae Holloway (61, information broker — delivers "There was another Mercer."), Owen Voss (44, Free Caravan driver — trustworthy-but-stale information principle), Tess Navarro (17, scavenger — independent off-screen life), Abel Rusk (56, ambiguous northbound stranger — identity and "who else is asking" unresolved by rule).
- **Flagged (not changed pending Nic):** Eli's draft age was 21, set to 24 to match the "mid-20s" portrait bible. Hank at ~68 conflicts with the portrait bible's "late 70s" but matches the deeper canon (child in 2029 → ~60–68); `docs/ASSET_MANIFEST.md` correction proposed, not yet applied.
- Roster continues at #016 (Redwater/Haven — route-exclusive characters begin).

## 9. NPC Roster — #016–030 + causality principle (2026-10-05)
Locked with Nic. Added to `docs/NPCS.md`: Redwater #016–022 (Ada Vale, Dr. Samir Kess, Gideon Vale, Rosa Mendoza, Benny Shaw, Kira Shaw, Tomas Wren) and Haven #023–030 (Elias Ward, Miriam Ward, Leah Harrow, Jonah Harrow, David Quill, Sadie Quill, Ezra Cole, Micah Harrow).
- New permanent design principle in `docs/GAME_DESIGN.md`: **DELAYED CONSEQUENCES MUST FEEL SURPRISING IN TIMING, NOT ARBITRARY IN CAUSALITY.**
- Continuity fixes approved and applied: Eli Boone = 24; Hank Rourke ≈ 68; `docs/ASSET_MANIFEST.md` corrected ("late 70s" → "late 60s"), preserving the 2029→2089 chronology.
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
- **Backstage mystery truth frozen as writer canon only:** CUSTODIAN (continuity-defense network, catastrophic utilitarian triage, permanent moral ambiguity); C-07 (fractured continuity process, fallible, never deus ex machina); I-40 warning inserted by C-07 (controlled continuity corridor); Hank's salvage-expedition guilt (not betrayal); the spouse's interrupted warning (unstable/contested broadcast; "I'm alive" caused the journey); MERCER recognized via authorization-chain association (not bloodline); human seekers (Morrow-linked networks, scavenger/mercenary interests; Abel knows pieces, allegiance flexible). Firewall: nothing player-facing may reveal backstage truth before the crew legitimately learns it.
- **Roster complete: exactly 100 authored NPCs** (`docs/NPCS.md` #001–100). 31 collision cleanups approved with final names; Helen Voss (#094) canonized as Owen Voss's deliberate aunt (lightweight family texture); MERCER protected for protagonist/spouse only.
- **Endgame runtime clarified:** the frozen "4–5 hour endgame" = post-reunion spouse-active runtime. Reunion early in Chapter 9 (first 30–45 min) → ~4.5–5h with Claire/Daniel across Chapters 9–10.
- **Engineering principles locked:** one reusable settlement-hub pattern (not six bespoke implementations); data-driven encounters (not expanded hardcoded events); single-file split scheduled no later than Chapter 3 implementation (must preserve Pages deployment + save compatibility); save/state schema (`g.chapter`, `g.consequences`, structured settlement/encounter/NPC/Mercy/montage records) documented before Alpha 0.4 expands Chapter 1 — final-choice credibility computed from accumulated state, never a stored morality score.
- Title-screen timeline fix approved and applied: "thirty-seven years" → sixty years; "CUSTODIAN initiated the collapse" softened to preserve mystery without stating an incomplete interpretation as narrator fact (consistent with §6 ambiguity rule).
