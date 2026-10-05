# Roadmap
Flexible milestones, not promises. Updated as work lands.

## Alpha 0.2 — Visual Foundation (COMPLETE)
- [x] Blank-screen fix (`top()` → `hud()`)
- [x] Visual framework: scene containers, vehicle art slots, dialogue + crew portraits, screen transitions, environmental animation, reduced-motion support, missing-asset fallbacks
- [x] 17 original assets generated (7 backgrounds, 4 vehicles, 6 portraits)
- [x] Assets uploaded to `assets/` (via GitHub web UI — API corrupts binaries)
- [x] Mobile playtest QA on iPhone Safari

## Alpha 0.2.2 — Cinematic Prologue & Main Quest (COMPLETE)
- [x] Six-page illustrated prologue (canonical narrative, typewriter, Prev/Next/Skip)
- [x] Main quest tracker: THE LAST TRANSMISSION (8 event-driven objectives)
- [x] Discoveries log + Story So Far recap in journal
- [x] Save schema v2 (quests/discoveries backfilled for old saves)
- [x] 6 prologue images + revised Josh portrait uploaded to `assets/`
- [x] Cinematic presentation pass: full-bleed art, overlaid title cards, hidden header, scrollable narration, thumb-friendly controls, reduced-motion preserved
- [x] Mobile playtest QA on iPhone Safari (prologue + artwork confirmed)

## Alpha 0.3a — Foundation (next)
- [x] Save versioning (`g.v` + `migrateSave()`)
- [ ] Narrative content extracted to a data model (encounter/choice/effect schema) so content can be authored without touching game logic
- [ ] Core docs established (this set)

## Alpha 0.3 — Expanded Survival (IN DEVELOPMENT on branch `alpha-0.3-dev`)
- Hunger, thirst, sleep/fatigue, health/injury/infection, treatment choices
- Improved inventory; more encounters; deeper crew interactions; expanded combat UI
- Gameplay-balance proposal reviewed by Nic BEFORE implementation — approved Oct 5, 2026 with 7 safeguards
- [x] Fatigue system (gain/tiers/collapse), wounds & infection, TREAT UI, rationing, resource caps
- [x] Companion bonuses, LIMPING state, narrative beats, attrition floor at 1 HP
- [x] Save schema v3 + additive migration; 41 survival tests passing
- [ ] Nic + ChatGPT review before merge to main

## Alpha 0.4 — World Interaction
- Explorable locations, trading posts, settlements
- Reputation, faction relationships, persistent world consequences
- Vehicle maintenance, damage, upgrades

## Campaign — Chapter 1: THE VOICE (planning complete, implementation next)
- [ ] Chapter 1: THE VOICE (~90–120 min) — Mercy, the marriage, expedition backstory, transmission + spouse voice break-in, expedition authorization, vehicle/inventory prep, departure, first road encounter, first camp. Preserves the existing water-vote choice/flags.
- [ ] Personal quest track: FIND THEM → FOLLOW THE TRAIL → THEY'RE CLOSE → FOUND → GET HOME TOGETHER (separate from THE LAST TRANSMISSION)
- [ ] Save schema v4: `g.route`, `g.spouseName`, `g.quests.personal` (all additive; `longroad_v01` preserved)
- [ ] Architecture groundwork BEFORE content expands (per Campaign Master Plan v1.0 freeze): document save/state schema — `g.chapter`, `g.consequences`, structured settlement outcomes/support records, significant encounter history, Mercy contact/status, major NPC outcome/disposition records, ending-montage inputs. Final-choice credibility computed from accumulated state, never a stored morality score.
- [ ] Reusable settlement-hub pattern designed once (Crossroads first), reused for all later settlements; encounters move toward data-driven definitions
- [ ] Spouse-voice break-in added to prologue transmission (two-voice rule)
- [x] Title-screen text fixes (2026-10-05): sixty years (was "thirty-seven"); CUSTODIAN collapse wording softened to preserve mystery
- [ ] New portraits: `portrait-claire.webp`, `portrait-daniel.webp` (specs in `docs/ASSET_MANIFEST.md`)
- [x] ~100-NPC roster complete (2026-10-05): #031–100 frozen in `docs/NPCS.md`; exactly 100 authored IDs

## Campaign Master Plan v1.0 (FROZEN 2026-10-05)
- [x] `docs/CAMPAIGN_MASTER_PLAN.md` — campaign target, chapter pacing, consequence web, character death, ending montage, final choice architecture, no-filler rule, north star
- [x] `docs/MYSTERIES.md` — backstage truth as writer-only canon (CUSTODIAN, C-07, I-40 warning, Josh, spouse's line, MERCER recognition, human seekers) + reveal schedule
- [x] `docs/CHAPTERS_03_10.md` — chapter outlines for 3–10 (full specs to be written per chapter before implementation)
- [x] `docs/ENCOUNTERS.md` — campaign-wide encounter plan: distribution by chapter, wildlife library, civilians/traders, raiders, environment, sickness, mechanical, strange encounters
- [x] `docs/WORLD.md` — Tollway philosophy, Relay partial function, endgame runtime clarification, Core writer-canon pointer
- [ ] Single-file split scheduled no later than Chapter 3 implementation (must preserve GitHub Pages deployment + save compatibility)

## Campaign — Final Act: Station Seven (planned)
- [ ] Station Seven becomes a substantial final-act location (~4–5 hours with the spouse in party), replacing the placeholder `arrival()`/`finish()` endings
- [ ] Reunion at ~final quarter; spouse joins crew; endgame decided together
- [ ] Four mysteries remain unresolved until authored: I-40 warning source, the spouse's cut-off sentence, C-07's role, CUSTODIAN's moral interpretation

## Alpha 0.5 — Living Settlements
- Bars, restaurants, merchants, mechanics, medical stations, inns, markets
- Tabs currency (soda-can pull tabs) + economy
- Functional card and slot minigames with real rules, bets, payouts, balancing

## Later Alpha / Beta
- Expanded branching narrative under THE LONG SHADOW OF CHOICE (see GAME_DESIGN.md); complete Texas-to-Colorado campaign
- Multiple endings; endless mode; larger encounter library
- **PREVIOUSLY ON THE LONG ROAD** — cinematic save recap generated from actual player history (requires quest tracker + narrative history from 0.2.2; never invents or spoils)
- Advanced animation + environmental systems; performance and save-system testing
