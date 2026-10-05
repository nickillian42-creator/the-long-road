# Changelog

## Campaign canon freeze (2026-10-05) — docs only, no code changes
- New: `docs/CHARACTERS.md` (character bible: Jack/Evelyn Mercer routes, Claire/Daniel, marriage, expedition backstory, two-voice rule, reunion, spouse survival rule, route differentiation)
- New: `docs/CAMPAIGN.md` (campaign structure: 22–25h targets, personal quest FIND THEM → … → GET HOME TOGETHER, Chapter 1 THE VOICE, final-act Station Seven, four unresolved mysteries, ~100-NPC roster plan)
- `docs/PROLOGUE.md`: spouse voice break-in added to page 6 (THE TRANSMISSION) + permanent two-voice rule; timeline locked at 60 years; "player should know only what the crew knows" principle
- `docs/GAME_DESIGN.md`: crew-knowledge principle + character routes section
- `docs/DECISIONS.md`: canon freeze logged (timeline, protagonists, spouses, expedition, personal quest, final act, mysteries, catalog freeze)
- `docs/ROADMAP.md`: Chapter 1: THE VOICE milestones, personal quest, save v4 notes, portrait requirements, NPC roster, Station Seven final act
- `docs/ASSET_MANIFEST.md`: `portrait-claire.webp` / `portrait-daniel.webp` specs added to manifest + character bible entries for Jack, Evelyn, Claire, Daniel
- 300-item Master Catalog v1.0: audit passed; firearm damage table pending Nic's explicit lock

## World Route / Settlement Framework v1 (2026-10-05) — docs only, no code changes
- New: `docs/WORLD.md` (12 major locations mile 0–780, two route splits, factions, micro-settlement principle, route-design and NPC-design rules, spouse-trail pacing, integration notes for existing encounters)
- `docs/CAMPAIGN.md`: references the world bible
- `docs/DECISIONS.md`: framework v1 locked (location roster, splits, factions, principles)
- Audit findings: no hard contradictions with frozen canon; sentry encounter (~330) should fold into the Blackridge approach; mountain passage (~590) flows into Hollow Creek (~620); consider a mid-trail breadcrumb near Morrow (~520)

## NPC Roster v1 — #001–015 (2026-10-05) — docs only, no code changes
- New: `docs/NPCS.md` (Mercy #001–010, early road #011, Crossroads #012–015; design rule, surname rule, continuity/audit notes)
- `docs/DECISIONS.md`: roster freeze logged (design rule, Mercer surname protection, Cal Danner rename, full name/role list, two flagged age items)
- Audit: zero surname collisions; Mercy families consistent; existing Ruth/Mara/Eli/Hank characterization preserved (additive only); Hank item hooks intact; no crew-knowledge violations; none of the four mysteries weakened
- Adjustments: Eli 21→24 (portrait-bible alignment); Hank ~68 flagged vs. manifest "late 70s" (deeper 2029-child canon favors ~68; manifest fix proposed, not applied)
- index.html, Alpha 0.3 implementation, and save code untouched

## NPC Roster — #016–030 (2026-10-05) — docs only, no code changes
- `docs/NPCS.md`: Redwater #016–022 and Haven #023–030 appended, with route-exclusivity lock, Leah/Micah delayed-consequence design, and full audit notes
- `docs/GAME_DESIGN.md`: new permanent principle — surprising timing, never arbitrary causality
- `docs/ASSET_MANIFEST.md`: Hank corrected to late 60s (≈68)
- `docs/DECISIONS.md`: causality principle, continuity fixes, roster freeze, Vale collision flagged as open
- Audit: zero name collisions (one flagged catalog adjacency: Ada Vale / Grandma Vale's Fig Jam — undecided); ages/relationships verified; WORLD.md compliance confirmed; neither settlement objectively good/evil; four mysteries untouched; Tomas/Abel documented as unlinked; route exclusivity compatible with 7–9 location target
- index.html, Alpha 0.3 gameplay/save code untouched; stopped after #030, Chapter 2 not begun

## Alpha 0.3 — Expanded Survival (in development on `alpha-0.3-dev`)
- Fatigue: +25 per travel/scavenge (x0.7 story, x1.3 hard); tiers Rested/Tired (-15% travel)/Exhausted (-25% travel, -2 combat dmg, -1 scavenge); collapse at 100 costs a day, -10 HP, resets to 60
- Wounds & infection: combat hits, clinic doors, dust storms can wound; wounded halves rest healing and can turn infected; TREAT on crew screen (1 meds: +30 HP, clears wound, revives at 25; 1 antibiotic cures infection); combat MEDKIT unchanged
- Start with 2 antibiotics; rationing toggle halves food/water drain but +10 fatigue/day
- Living-equivalents drain (incapacitated crew count half; story 2 / survival 3 / hard 4 per day at full party); attrition (hunger/thirst/infection/collapse) can't drop anyone below 1 HP
- Resource caps (food/water 30, meds 6, antibiotics 3, parts 8, ammo 24, fuel = tank) with overflow logging
- Companion bonuses: Mara +5 TREAT healing, Hank +3% repairs, Eli halves hazard wound risk (only while healthy)
- LIMPING vehicle state below 30% (-10% travel); HUD fatigue bar, LOW/LIMP tags, wound/infection markers
- Narrative beats: first-wound dialogue, first-infection campfire decision, weary-argument event, treat/neglect trust flags
- Save schema v3 with additive migration; 41 survival tests passing (T1-T5 + regression + balance)

## Alpha 0.2.2 — cinematic prologue presentation pass
- Prologue now plays in a dedicated cinematic mode: the permanent game header and footer are hidden while the six pages are on screen, giving the artwork full-bleed space.
- Title, page number, and subtitle are overlaid on the artwork as a title card; narration appears below in a script-style layout distinct from normal gameplay panels.
- Narration area scrolls internally on long pages (e.g. The Transmission) with improved line spacing for mobile.
- Page dots enlarged; Prev/Next are full-height thumb-friendly buttons; Skip Intro remains full-width.
- Cinematic mode exits automatically on Skip, on BEGIN JOURNEY (character creation), on New Journey title screen, and on Continue Saved Journey — the header always returns for gameplay.
- No narrative text changes, no gameplay or save-schema changes. Reduced-motion behavior preserved (typewriter completes instantly, Ken Burns disabled).

## Alpha 0.2.2 (2026-10-04)
- Cinematic six-page prologue (THE WORLD WE LOST) on New Journey: Ken Burns art, typewriter narration, Prev/Next/Skip, page dots
- Main quest tracker: THE LAST TRANSMISSION with 8 event-driven objectives (quest continues past Station Seven: truth + Mercy's fate)
- Discoveries log and generated Story So Far recap in the journal; new QUEST road-screen button
- Save schema v2: quests/discoveries with migration for older saves
- Hank re-aged to late sixties to match canon (child during the 2029 collapse)

## Alpha 0.2 (2026-10-04)
- Fixed blank-screen crash: renamed global `top()` → `hud()` (it collided with the browser's read-only `window.top` and killed the whole script)
- Visual framework: illustrated scene containers, vehicle artwork slots, dialogue + crew portraits, CSS screen transitions, animated road lines and drifting dust, `prefers-reduced-motion` support, `onerror` fallbacks for missing art
- Save schema: added version field (`g.v`) with `migrateSave()` for forward migration
- Docs established: README, DECISIONS, ROADMAP, ASSET_MANIFEST, CHANGELOG, TECHNICAL

## Alpha 0.1 (2026-10-04)
- Initial working prototype: title → character creation → difficulty → vehicle select → Chapter One → road loop → encounters → turn-based combat → Station Seven arrival → 4 endings
- 4 vehicles, 3 difficulties, crew trust system, narrative flags, localStorage saves
