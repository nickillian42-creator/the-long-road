# Encounter System — THE LONG ROAD
System bible v1 locked by Nic (2026-10-05). The 100 named NPCs are authored identities; this system fills the road between them. Revisit only with Nic's approval.

## Core rule (locked)
**THE ROAD SHOULD CREATE STORIES, NOT INTERRUPT THEM.**

Random encounters must never feel like Pokémon grass. They reinforce the feeling of traveling 780 dangerous miles. They create situations — not stat penalties.

## The two populations
- **~100 authored NPCs** (`docs/NPCS.md`): named characters whose identities matter — they recur, remember, travel, die, and return.
- **Encounter characters**: unnamed or minor survivors who may have ten lines of dialogue and disappear forever — a traveling family, two hunters, a scavenger, an old couple, a group moving south, a wounded traveler, three kids fishing, a trader, a grieving parent, someone asking directions, a woman repairing her truck. **These do not count against the 100.** Their disposability is what makes the named NPCs feel important.

## Encounter tiers (locked)
| Tier | Length | Examples |
|---|---|---|
| **Ambient** | 30 sec – 2 min | Wildlife sighting, abandoned car, weather shift, lone traveler |
| **Road Event** | 3 – 10 min | Breakdown, robbery, sick traveler, animal attack, scavenging location |
| **Story Encounter** | 10 – 30 min | Cannibal camp, convoy dispute, trapped family, abandoned facility |
| **Major Encounter** | 30 – 60+ min | Settlement crisis, faction conflict, CUSTODIAN site, major character event |

The road pulls from the appropriate pool based on **region + route + time + weather + previous choices + resources + crew state.**

## Selection logic (locked): not pure RNG
- Some encounters are random.
- Some are **seeded** (fixed to a location or mileage on first pass).
- Some **require conditions** (a crew member, an item, a flag, a season, a route choice).
- Some happen **only once**.
- Some become **impossible** because of an earlier decision.
- Some **appear different** because of who is in the crew or what the player carries.

## Categories

### Wildlife
Sixty years without wildlife management: coyotes circling camp, feral dog packs, wild hogs, rattlesnakes, mountain lions, black bears in Colorado, elk blocking mountain roads, injured animals, livestock descended from escaped ranch stock.
**Animals don't always mean combat.** Hear something circling camp — burn fuel on a fire? Use food as bait? Spend ammo on a warning shot? Stay quiet? Move camp and gain fatigue? **Sometimes the correct outcome is: you never find out what was out there.** That's creepier.

### Human threats
Raiders, highway robbers, desperate scavengers — with procedural variants: road ambush, fake injury, toll scam, camp robbery, vehicle pursuit, bridge trap, night attack, false distress signal. **Sometimes the "raiders" are three starving teenagers with one barely functional rifle** — a very different decision than twelve organized killers.
**Cannibals: use sparingly.** One isolated encounter can be horrifying precisely because the game doesn't announce it — a camp, food cooking, friendly people, something not adding up, Mara noticing something, the slow realization. Never cartoon villains; sixty years on, a tiny group may have developed a survival practice everyone else considers unthinkable. Believable, dangerous, horrifying.

### Disease & injury
Built on the Alpha 0.3 survival systems — meaningful episodes, not constant sickness: food poisoning, infected cuts, fever, respiratory illness, contaminated water, heat exhaustion, hypothermia, altitude sickness near Colorado, sprains, broken ribs, tooth infection, animal bites.
**Sickness creates story decisions:** Mara develops a fever; a settlement lies 20 miles east; you're traveling north. Detour? Lose a day? **Mercy has nineteen.** Survival mechanics and story talk to each other.

### Environmental trials
Flash flood, thunderstorm, dust storm, wildfire, extreme heat, cold snap, snowstorm, rockslide, washed-out bridge, collapsed tunnel, mud, flooded roadway, lightning, closing mountain pass, a river whose bridge vanished decades ago.
**These make the vehicle choice matter:** the Raptor might have an option the M4 doesn't; the M4 might outrun what the Wagoneer can't; the Wagoneer might carry the equipment that saves everyone; the Eagle stays balanced. **No vehicle is secretly "the correct one."**

### Mechanical disasters
The vehicle is practically another character: flat tire, overheating, broken belt, damaged suspension, dead battery, fuel leak, stuck vehicle, engine trouble, broken windshield, blocked radiator.
**Named-item integration (300-item catalog):** not "PARTS −2" but — the temperature needle climbs, Josh kills the engine, *"Pop the hood,"* and the player has a RoadKing Radiator Hose, a Federal Repair Kit, an Ironclad Wrecking Bar. The catalog becomes the solution space.

### Strange road encounters
The ones that matter most. **Not everything needs an explanation:** a radio repeating the same six seconds nightly; a freshly painted highway sign reading TURN AROUND; an intact house in the middle of nowhere; a car parked across the road, driver's door open; someone watching from a distant overpass; a town where every building bears the same painted symbol; a child's bicycle in the middle of a highway; a still-warm campfire; a working vending machine; cattle walking an abandoned interstate; a buried 2027 time capsule; a still-transmitting weather station; an old emergency siren suddenly activating.
**Some are nothing. Some lead to loot. Some lead to people. A tiny number eventually connect to CUSTODIAN. The player must never know which category they're in at first.** That uncertainty is critical — and it complies with the crew-knowledge rule: the game never explains what the crew couldn't understand.

### Ordinary people
Traveling families, hunters, scavengers, old couples, groups moving south, wounded travelers, kids fishing, traders, grieving parents, people asking directions, a woman repairing her truck. Ten lines, then gone forever — usually.

## Anti-patterns (locked)
- No "random encounter → lose 5 HP" filler. Every encounter is a situation.
- Cannibals used once, sparingly, never as a settlement twist (Haven is explicitly not this).
- No cartoon villains anywhere in the encounter pool.
- No secretly-correct vehicle.
- Strange encounters are never labeled by category.
- Encounters must not resolve any of the four frozen mysteries.

## Implementation notes (for build time, not now)
- The existing `randomEvent()` 4-event pool is the prototype this system replaces — superseded, not contradicted.
- The flat 30% encounter chance in `travel()` gets replaced by the tiered/conditional selection logic.
- Ambient-tier encounters can be log-only or single-choice; heavier tiers use the existing `event()`/choice primitives.
- Encounter state (seen-once flags, seeded placements, conditional availability) lives in `g.flags` / save blob per the existing systems — no new architecture required.

## Scale target
~100 authored NPCs **plus** potentially hundreds of encounter variants across tiers and categories. Chapter 2 is written with this layer in mind from the beginning.

---

## Campaign-wide encounter plan (Campaign Master Plan v1.0, frozen 2026-10-05)
Encounters operate across Chapters 1–10 — they do not begin in Chapter 2 and do not disappear when the plot becomes urgent. Target: ~30–45 meaningful encounters per normal ~25-hour run; master pool of 100+ scenarios/variants; no single run sees everything. Quiet travel is part of pacing.

### Distribution by chapter
- **Ch1:** grounded wildlife, weather, stranded travelers, scavenging, ordinary road danger.
- **Ch2:** wildlife, Cal, traders, storms, civilians, uncertainty.
- **Ch3:** caravans, Tollway patrols, organized crime, returning consequences.
- **Ch4:** dangerous road infrastructure, raiders, Free Roads civilians, I-40 anomalies.
- **Ch5:** sparse population, Dead Corridor, scavenging, unsettling environments, the single major cannibal storyline.
- **Ch6:** merchants, patrols, refugees, farms, criminals, political travelers around Morrow.
- **Ch7:** high-country wildlife/weather/altitude/vehicle danger.
- **Ch8:** fewer ordinary encounters; more active infrastructure and communication phenomena.
- **Ch9:** Station Seven environmental/survivor/system encounters.
- **Ch10:** encounters increasingly generated from the player's accumulated history.

### Wildlife library
Varies by region and behavior. Animals are ordinary wildlife in a world with dramatically reduced human control — never mutated monsters. Texas/Plains: coyotes, feral dogs, wild hogs, rattlesnakes, copperheads where plausible, bobcats, mountain lions, aggressive/feral cattle, feral horses, territorial deer/bucks, vultures, hawks, owls, skunks, raccoons, foxes, swarming insects, bees/wasps, dangerous spiders where appropriate. Northern/high-country: black bears, mountain lions, coyotes, wolves if ecologically plausible in 2089, elk, moose, mule deer, bighorn sheep, foxes, porcupines, scavenger birds, smaller animals able to damage supplies/equipment. Animals can attack, stalk, defend young or food, block roads, raid supplies, damage camp, indicate nearby danger/carcass/water, provide hunting opportunity, flee, or simply be observed. Some encounters can seriously wound or kill through poor decisions or pre-existing compromise. **Bear tracks can be the entire encounter.**

### Random civilians / traders
A large unnamed/minor-character population: traveling families, lone scavengers, hunters, mechanics, medics, merchants, refugees, couriers, farmers, children with adults nearby, grieving travelers, people moving settlements, injured travelers, religious travelers, storytellers, musicians, surveyors, former soldiers, ordinary people. Many support bargaining for food, water, ammunition, medicine, tools, vehicle parts, fuel, clothing, information, collectibles, junk. **Prices are contextual** — someone dying of thirst values water differently than someone beside a reservoir. A trader may bargain honestly, overcharge, bluff, unknowingly sell something valuable, recognize an item, refuse trade, or remember a previous interaction. Some people are encountered once and never again — genuinely.

### Raiders / human hostility
Not one generic faction. Archetypes: highway ambush, fake injured traveler, false distress signal, bridge trap, extortion checkpoint, camp robbery, vehicle pursuit, scavengers turning hostile, desperate civilians threatening the crew, organized raider patrol, raiders fighting another group, attempted theft, surrendering attacker, wounded enemy asking for help. Many support negotiation, intimidation, bribery, trade, retreat, stealth, alternate routes, or combat — **combat is never mandatory.** Raiders value survival: they flee, surrender, miscalculate. Some apparent raiders turn out not to be.

### Environment (campaign-wide)
Thunderstorms, flash floods, extreme heat, drought, dust, wildfire, cold snaps, snow, blizzards, ice, rockslides, mud, washed-out roads, collapsed bridges, unstable structures, lightning, river crossings, altitude. Environment interacts with vehicle, inventory, fatigue, wounds, time, and crew.

### Sickness / medical trials
Story-driven, never busywork: food poisoning, fever, contaminated water, respiratory illness, infected wounds, animal bite, heat exhaustion, hypothermia, altitude sickness, sprains, fractures, dental infection. Template: Mara becomes seriously ill; treatment exists off-route; Mercy's clock is running; the player chooses whether to detour — survival mechanics and story become the same decision.

### Mechanical encounters
Flat tire, overheating, belt/hose failure, dead battery, damaged suspension, fuel leak, stuck vehicle, broken windshield, radiator obstruction, electrical problems. Named inventory matters — never "PARTS −2" where a physical item/utility interaction makes a better scene. Not a maintenance-chore simulator.

### Strange encounters (campaign-wide)
Repeating six-second radio signal; freshly painted TURN AROUND sign; intact house; abandoned running vehicle; distant watcher; repeated unknown symbol; bicycle in roadway; warm abandoned campfire; functioning vending machine; cattle herd on interstate; time capsule; automated weather station; activating emergency siren; lights in an empty structure. Some mundane, some dangerous, some loot, some human, very few CUSTODIAN-connected. **Never labeled as CUSTODIAN encounters** — the crew initially sees only what is physically happening.
