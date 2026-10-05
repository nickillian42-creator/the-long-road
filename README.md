# THE LONG ROAD
**Every Mile Costs Something.**

A turn-based, branching, post-apocalyptic survival RPG for mobile browsers. Civilization collapsed in 2029; the game takes place in 2089, sixty years later. You lead a four-person expedition from Mercy, Texas toward Continuity Station Seven in Colorado — 780 miles of consequential choices.

**Play:** https://nickillian42-creator.github.io/the-long-road/

## Current state
Alpha 0.2 — visual foundation. Single-file build (`index.html`) plus `assets/` (17 original WebP illustrations).

## Team
- **Nic** — creator, game director, final decision-maker
- **ChatGPT** — narrative, game design, artwork, feature planning
- **Muse (Dwight)** — code review, implementation, debugging, testing, architecture

## Docs
Start with `docs/ROADMAP.md`, then `docs/TECHNICAL.md`. Decisions are locked in `docs/DECISIONS.md`.

## Local development
Open `index.html` in any modern mobile or desktop browser. No build step, no dependencies, no accounts. Saves live in the browser's localStorage under `longroad_v01`.

## Contributing
- Small fixes go straight to `main`. Larger features use branches + pull requests.
- Never delete working gameplay to add visuals.
- Preserve save compatibility (see `docs/TECHNICAL.md`).
- Test JS syntax and game flows before pushing; never claim untested work was tested.
- Original artwork only. No paid services. Keep the live deployment functional.
