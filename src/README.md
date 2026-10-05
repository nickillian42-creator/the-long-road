# src/ — THE LONG ROAD game source (Milestone 1+)

The game ships as a **single self-contained `index.html`** (GitHub Pages serves
it; the preview builder consumes it; the test harnesses extract its one
`<script>` block). That file is a **build artifact** — never edit it directly.

Edit the modules below, then rebuild:

```
python3 tools/build.py     # regenerates index.html from src/
```

All modules share one global scope (plain `<script>`, no ES modules), so
cross-module calls work exactly as they did in the old single-file layout.
`tools/build.py` concatenates in the listed order; `src/boot.js` (`start();`)
must stay last.

## Layout

```
src/
  shell/top.html        HTML head + CSS + <body> + <script> opener
  shell/bottom.html     </script></body></html>
  core/
    globals.js          shared globals ($, app, g, cars, btn, ASSETS, ...)
    ui.js               rendering primitives (screen, hud, notify, log, ...)
    state.js            save system, migrateSave(), consequence/npc/settlement
                        helpers, quest data fns, treatment history
    engine.js           game flow: start/create/begin/resume/render/newGame
  chapters/
    prologue.js         cinematic prologue (PROLOGUE data + player)
    chapter1.js         CHAPTER ONE: THE VOICE — feature-locked, do not touch
                        prose/choices/pacing/canon
  sim/
    combat.js           preserved turn-based combat primitives (DORMANT —
                        awaiting the encounter engine; see header)
    rng.js              seeded RNG (mulberry32); not wired into gameplay yet
  boot.js               start();
```

## Conventions

- **Feature-locked content** (Chapter One) lives in `chapters/` and must not
  change player-facing behavior. Bug fixes only, with approval.
- **Retired code is deleted, not commented out.** The legacy road loop was
  removed in Milestone 1; its history survives in git.
- **No speculative state.** New `g.*` fields arrive with the milestone that
  needs them, via `migrateSave()` with safe defaults.
- **Tests** (`tests/`) run against the built `index.html`: rebuild before
  running them. `node tests/<file>.js` per file.

## Roadmap slots (do not implement ahead of schedule)

- `sim/` → items, inventory, encounters, npcs, economy, morality,
  reputation, world, activities (Milestones 2–3)
- `data/` → item catalog, encounter definitions (Milestone 2)
- `chapters/` → chapter2.js, ... (after writers' room approval)
