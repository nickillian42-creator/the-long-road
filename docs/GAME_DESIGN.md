# Game Design

Living design document for THE LONG ROAD. Systems are documented here when approved; implementation follows the roadmap.

## Core design principle
**THE WORLD REMEMBERS WHAT YOU DO, AND THE GAME REMINDS YOU WHY IT MATTERS.**

Consequences must be persistent, visible, and traceable to the player's own choices.

## DESIGN PRINCIPLE: THE PLAYER SHOULD KNOW ONLY WHAT THE CREW KNOWS
**Status:** APPROVED — permanent, applies to everything.

Inventory names, descriptions, quests, dialogue, and UI must never reveal information the crew has not discovered. This covers CUSTODIAN, locations, characters, items (see the `knownPurpose` system in the item catalog), and quest language. When in doubt, the crew's knowledge is the ceiling.

## CHARACTER ROUTES
**Status:** APPROVED — campaign canon locked 2026-10-05. Full bible: `docs/CHARACTERS.md`.

Two protagonist routes — **Jack Mercer** (male) and **Evelyn Mercer** (female) — searching for their spouses **Claire Mercer** and **Daniel Mercer**. The routes are not pronoun swaps: Jack receives occasional physical/strength solutions, Evelyn occasional insight/improvisation solutions. Neither route is mechanically superior. The surname Mercer is fixed for surname-recognition story beats.

Campaign structure, personal quest, reunion, and final act: `docs/CAMPAIGN.md`.

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

## ART DIRECTION — playable graphic novel (2nd generation, approved direction pending preview)
**Status:** style-preview phase. Four preview images (Mercy, Baby Raptor, Mara, The Cascade) must be approved by Nic + ChatGPT before the remaining 20 assets are generated. Existing photorealistic artwork stays live until the full 24-asset set is approved and swapped in.

**Goal:** The Long Road should feel like a playable, animated, mature post-apocalyptic graphic novel.

**Style:**
- Mature, cinematic American graphic-novel aesthetic. Heavy black ink outlines, detailed cross-hatching, strong shadows, dramatic contrast, textured brushwork, subtle halftone shading.
- Muted post-apocalyptic earth tones: faded greens, dusty oranges, rust, charcoal, with occasional dramatic accent colors.
- Grounded, believable people and recognizable vehicle silhouettes. Natural proportions, practical clothing, ordinary weathered vehicles — no neon, no sci-fi excess, no futuristic redesigns.
- Hand-illustrated appearance, never glossy AI photorealism. Visually consistent across every asset.
- Original illustrations only. Never imitate or copy a specific comic artist, existing franchise, or copyrighted game.

**Consistency (binding for all future artwork):**
- Recurring characters keep the same face, age, hairstyle, clothing identity, and recognizable features in every illustration. See the character bible in `docs/ASSET_MANIFEST.md`.
- Vehicles keep consistent silhouettes, proportions, and detailing across selection screens, travel scenes, and future encounter art. See the vehicle bible in `docs/ASSET_MANIFEST.md`.
- Hank remains elderly, consistent with canon (a child in 2029, an old man in 2089).
- World, locations, story canon, and atmosphere are preserved — only the rendering style changes.

**Technical:** exact filenames, dimensions, and aspect ratios are preserved (see manifest). Optimized WebP for iPhone Safari. Vehicle art stays suitable for future layered driving animation. Artwork swaps never touch gameplay, quests, narrative, saves, or code.
