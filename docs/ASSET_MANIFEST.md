# Asset Manifest
All artwork is original. WebP format. Naming: lowercase, hyphenated. Never use manufacturer promotional art, game assets, or copyrighted compositions.

## Location backgrounds — 1400×500
| Filename | Used for | Status |
|---|---|---|
| `bg-title.webp` | Title screen | Generated, pending upload |
| `bg-mercy.webp` | Chapter One — Mercy settlement | Generated, pending upload |
| `bg-north-texas.webp` | Road region, miles 0–190 | Generated, pending upload |
| `bg-panhandle.webp` | Road region, miles 190–390 | Generated, pending upload |
| `bg-dead-corridor.webp` | Road region, miles 390–580 | Generated, pending upload |
| `bg-mountain-passage.webp` | Road region, miles 580–780 | Generated, pending upload |
| `bg-station-seven.webp` | Arrival / ending | Generated, pending upload |

## Vehicles — 1000×620
| Filename | Vehicle | Status |
|---|---|---|
| `vehicle-eagle.webp` | AMC Eagle-inspired AWD wagon | Generated, pending upload |
| `vehicle-wagon.webp` | Jeep Wagoneer-inspired SUV | Generated, pending upload |
| `vehicle-raptor.webp` | Baby Raptor-inspired off-roader | Generated, pending upload |
| `vehicle-m4.webp` | BMW M4-inspired coupe | Generated, pending upload |

## Character portraits — 480×480
| Filename | Character | Status |
|---|---|---|
| `portrait-ruth.webp` | Ruth, Mercy council leader | Generated, pending upload |
| `portrait-mara.webp` | Mara, crew medic | Generated, pending upload |
| `portrait-hank.webp` | Hank, crew mechanic | Generated, pending upload |
| `portrait-eli.webp` | Eli, crew scout | Generated, pending upload |
| `portrait-stranger.webp` | The dehydrated traveler | Generated, pending upload |
| `portrait-custodian.webp` | Custodian sentry | Generated, pending upload |

## Art direction
Grounded post-apocalyptic realism. Natural human proportions, ordinary weathered vehicles, overgrown highways, practical clothing, cinematic lighting. The collapse was in 2029; the game is set in 2089 — six decades of wear. No futuristic vehicles, neon, glowing armor, or sci-fi excess.

## Adding or replacing assets
Upload WebP files to `assets/` using the exact filenames above — the game picks them up automatically with no code changes. Missing files degrade gracefully to the built-in CSS visuals (every `<img>` has an `onerror` fallback), so partial sets are safe.
