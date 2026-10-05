# Game Design

Living design document for THE LONG ROAD. Systems are documented here when approved; implementation follows the roadmap.

## Core design principle
**THE WORLD REMEMBERS WHAT YOU DO, AND THE GAME REMINDS YOU WHY IT MATTERS.**

Consequences must be persistent, visible, and traceable to the player's own choices.

---

## FEATURE: PREVIOUSLY ON THE LONG ROAD
**Status:** APPROVED — scheduled for a later milestone (see ROADMAP.md).
**Prerequisites:** quest tracker + narrative history system (Alpha 0.2.2).

### Concept
When a player returns to an existing saved journey (Continue), the game presents a short, cinematic recap generated from their actual saved history — a "previously on" sequence that re-grounds them in their story before they play on.

### Content (generated, never written by hand per playthrough)
The recap reflects only recorded player history:
- Current day, region/location, and expedition progress (miles traveled).
- Major decisions and their consequences (choice flags: Mercy's water vote, stranger outcome, sentry encounter, mountain passage, etc.).
- Crew relationships and unresolved tensions (trust values, injuries, deaths).
- Important encounters and discoveries (discoveries log).
- Mercy's evolving situation (days elapsed against the nineteen-day estimate, promises made).
- Unresolved story threads and current objectives (quest tracker state).

### Hard rules
- **Never invent events.** Every line of the recap must trace to a recorded flag, stat, log entry, or discovery.
- **Never reveal undiscovered information.** The recap only references what the player has actually encountered.
- **Concise.** A short sequence, not a lore dump — atmosphere over exposition.

### Presentation
- Original artwork (reuse location art + portraits; dedicated recap art only if justified).
- Atmospheric transitions consistent with the prologue system (fades, slow image drift).
- Concise narrative writing in the game's voice.

### Controls
- Skippable at any point (one tap to the road screen).
- Replayable on demand from the journal.

### Technical notes (for implementation time)
- Recap generator reads the save blob (`longroad_v01`, schema v2+) — same data the Story So Far recap uses, extended.
- No new save fields required if quest/discovery/flag coverage is complete; audit coverage before building.
- Must respect `prefers-reduced-motion`.
