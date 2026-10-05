# Roadmap
Flexible milestones, not promises. Updated as work lands.

## Alpha 0.2 — Visual Foundation (in progress)
- [x] Blank-screen fix (`top()` → `hud()`)
- [x] Visual framework: scene containers, vehicle art slots, dialogue + crew portraits, screen transitions, environmental animation, reduced-motion support, missing-asset fallbacks
- [x] 17 original assets generated (7 backgrounds, 4 vehicles, 6 portraits)
- [ ] Assets uploaded to `assets/` (via GitHub web UI — API corrupts binaries)
- [ ] Mobile playtest QA on iPhone Safari

## Alpha 0.3a — Foundation (next)
- [x] Save versioning (`g.v` + `migrateSave()`)
- [ ] Narrative content extracted to a data model (encounter/choice/effect schema) so content can be authored without touching game logic
- [ ] Core docs established (this set)

## Alpha 0.3 — Expanded Survival
- Hunger, thirst, sleep/fatigue, health/injury/infection, treatment choices
- Improved inventory; more encounters; deeper crew interactions; expanded combat UI
- Gameplay-balance proposal reviewed by Nic BEFORE implementation

## Alpha 0.4 — World Interaction
- Explorable locations, trading posts, settlements
- Reputation, faction relationships, persistent world consequences
- Vehicle maintenance, damage, upgrades

## Alpha 0.5 — Living Settlements
- Bars, restaurants, merchants, mechanics, medical stations, inns, markets
- Tabs currency (soda-can pull tabs) + economy
- Functional card and slot minigames with real rules, bets, payouts, balancing

## Later Alpha / Beta
- Expanded branching narrative; complete Texas-to-Colorado campaign
- Multiple endings; endless mode; larger encounter library
- Advanced animation + environmental systems; performance and save-system testing
