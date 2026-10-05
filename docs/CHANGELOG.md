# Changelog

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
