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
- [x] 6 prologue images + revised Hank portrait uploaded to `assets/`
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

## Alpha 0.5 — Living Settlements
- Bars, restaurants, merchants, mechanics, medical stations, inns, markets
- Tabs currency (soda-can pull tabs) + economy
- Functional card and slot minigames with real rules, bets, payouts, balancing

## Later Alpha / Beta
- Expanded branching narrative under THE LONG SHADOW OF CHOICE (see GAME_DESIGN.md); complete Texas-to-Colorado campaign
- Multiple endings; endless mode; larger encounter library
- **PREVIOUSLY ON THE LONG ROAD** — cinematic save recap generated from actual player history (requires quest tracker + narrative history from 0.2.2; never invents or spoils)
- Advanced animation + environmental systems; performance and save-system testing
