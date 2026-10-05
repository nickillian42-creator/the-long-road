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
- Next: Chapter 2 playable narrative before further roster expansion.
