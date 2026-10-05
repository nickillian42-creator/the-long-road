# Changelog

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
