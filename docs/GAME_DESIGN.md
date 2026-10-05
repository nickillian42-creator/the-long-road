# Game Design

Living design document for THE LONG ROAD. Systems are documented here when approved; implementation follows the roadmap.

## Core design principle
**THE WORLD REMEMBERS WHAT YOU DO, AND THE GAME REMINDS YOU WHY IT MATTERS.**

Consequences must be persistent, visible, and traceable to the player's own choices.

## DESIGN PRINCIPLE: THE LONG SHADOW OF CHOICE
**Status:** APPROVED — guiding philosophy for all narrative implementation.

**THE WORLD REMEMBERS WHAT YOU DO. THE CONSEQUENCES DON'T ALWAYS ARRIVE WHEN YOU EXPECT THEM.**

Not every decision should have an immediate or obvious consequence. The Long Road features layered consequences that can emerge:

- Immediately after a decision.
- Several encounters later.
- Days or weeks into the journey.
- During a later chapter.
- At the campaign's conclusion.
- During a second playthrough, when players recognize connections they previously missed.

Examples of the intended feel: a stranger helped early returns much later; stolen supplies leave another settlement unable to survive; an insignificant conversation changes how a companion responds at a critical moment; a decision made hundreds of miles earlier determines who helps near Station Seven; some consequences become clear only on replay with different choices.

### Implementation requirements
1. Track meaningful choices through persistent narrative flags and event history (the `g.flags` + discoveries + quest systems established in Alpha 0.2.2 are the foundation).
2. Allow future encounters to check combinations of previous decisions, not just single flags.
3. Support delayed, conditional, and mutually exclusive consequences.
4. Avoid telegraphing every outcome with obvious GOOD/BAD choice indicators.
5. Keep consequences logically connected to the original decisions, even when the connection is initially hidden.
6. Never manufacture consequences by contradicting established player history.
7. Include delayed consequences in the Previously on The Long Road recap only after the player has actually discovered them.

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
