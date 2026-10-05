# Project Decisions
Locked in with Nic on 2026-10-04. Revisit only with Nic's approval.

## 1. Art pipeline — collaborative (Muse + ChatGPT)
Original AI-generated artwork in grounded post-apocalyptic realism. No manufacturer badges, no copied game assets, no neon sci-fi aesthetics. Filenames and dimensions in `ASSET_MANIFEST.md`.

## 2. Code structure — single file until it hurts
`index.html` stays monolithic while manageable. Split into CSS/JS/data modules when narrative content makes collaboration painful (expected mid-Alpha 0.3).

## 3. Save compatibility — migrate, don't break
Saves carry a version field (`g.v`). `migrateSave()` upgrades older saves on load. Clean breaks allowed only at Beta, and only if unavoidable.

## 4. Workflow — small fixes direct, features via PR
Small fixes push straight to `main`. Larger features use branches + pull requests for review before going live.

## 5. Standing rules (from the project brief)
- Inspect the repo before assuming; propose before substantial changes.
- Never delete working gameplay to add visuals.
- Test JS syntax and game flows; never claim untested work was tested.
- Show Nic proposed gameplay-balance changes before implementing them.
- No paid services or unnecessary dependencies. GitHub Pages hosting.
- Keep the live GitHub Pages deployment functional at all times.
