# Technical Notes

## Architecture
Single-file build (`index.html`): CSS in `<style>`, game code in one `<script>`. Every screen renders through `screen()`; game state lives in the global `g`. Rendering helpers (`hud()`, `btn()`, `img()`, `scene()`, `portrait()`) are additive and stateless.

Planned (Alpha 0.3a): extract narrative content into a `STORY` data object — encounters defined as data (title, body, choices, effects, conditions, portrait) with one generic renderer — so content can be authored without touching game logic.

## Save format
- Key: `longroad_v01` in localStorage. JSON blob, written on every state change via `save()`.
- `g.v`: schema version (currently `1`). `migrateSave()` runs on every load and upgrades older saves forward. Never remove fields without a migration step.
- Current fields (v2): `v, name, sex, difficulty, car, day, miles, fuel, food, water, parts, hp, meds, ammo, health, crew[{name,hp,trust}], flags{}, log[], phase, enemy, checkpoint, endingText, won, quests{main{id,title,objectives[{id,text,done}]}}, discoveries[{title,text,day}]`.
- v1→v2 migration backfills `quests` (fresh objective list) and `discoveries` ([]), then silently completes objectives matching the save's existing flags.

## Assets
`assets/*.webp`, referenced with relative paths. Every `<img>` carries `onerror="this.remove()"` — a missing file falls back to the built-in CSS visuals; the game never breaks on partial asset sets.

## Deployment
GitHub Pages serves the `main` branch. No build step, no dependencies. Note: the GitHub API connector corrupts binary uploads — images must be added via the GitHub web UI. Text files (HTML/CSS/JS/MD) push fine through the API.

## Testing
- `node --check` on the extracted `<script>` for syntax.
- A DOM-stub flow harness covering: start → creation → difficulty → vehicle → Chapter One → road → region backgrounds → encounters → combat → crew/journal → arrival → endings, plus old-save resume compatibility.
- Real-device check (iPhone Safari) by Nic for visuals and touch layout.
