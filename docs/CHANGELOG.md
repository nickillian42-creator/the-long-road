# Changelog

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
