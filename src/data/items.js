/* data/items.js — Item catalog + schema (Milestone 2).
   ---------------------------------------------------------------------------
   ITEM SCHEMA (future 300-item catalog drops in here unchanged):
     id:      unique string key
     name:    display name
     kind:    'water' | 'food' | 'med' | 'ammo' | 'tool' | 'weapon' | 'utility' | 'story'
     size:    inventory slots one stack occupies (capacity model: a stack costs
             `size` slots regardless of quantity; no weight simulation)
     stack:   max units per stack (1 = not stackable)
     desc:    short practical description
     inspect: longer text shown on INSPECT (flavor / environmental storytelling)
     use:     consumable effect, if any:
                {thirst:-N} | {hunger:-N} | {cure:'bleeding'|'infection'|'illness'|'limb'}
                | {stabilize:true}  (improves overall health one step, not a full heal)
     equip:   'weapon' | 'utility' for equippable items (minimal paper-doll:
              Weapon + Utility only; no armor/clothing complexity)
     art:     asset path for the item's artwork ('assets/items/<id>.webp').
              Resolved at runtime by itemArt(): preview builds inline a
              data-URI map (ITEM_ART); otherwise the asset path is used.
     find:    'major' | 'minor' — discovery prominence. Major finds (story
              objects) get the larger, more dramatic FOUND treatment;
              common loot stays quick and subtle. Presentation only.

   Every item must earn its place: survival, equipment, or storytelling purpose.
   This is the STARTER set for the Milestone 2 proof-of-concept only. */

const ITEMS = {
  water_bottle: {
    name: 'Bottled Water', art: 'assets/items/water_bottle.webp', find: 'minor', kind: 'water', size: 1, stack: 4,
    desc: 'Sealed plastic bottle. Dusty, but the cap holds.',
    inspect: 'The label is sun-bleached past reading. Whatever was in the Mercy cistern tasted of rust; this tastes of nothing, which is better.',
    use: { thirst: -1 },},
  canned_food: {
    name: 'Canned Food', art: 'assets/items/canned_food.webp', find: 'minor', kind: 'food', size: 1, stack: 3,
    desc: 'Dented can. Label long gone.',
    inspect: 'You shake it. Something solid shifts inside. Out here, mystery you can eat is a gift.',
    use: { hunger: -1 },},
  mre: {
    name: 'Packaged Meal (MRE)', art: 'assets/items/mre.webp', find: 'minor', kind: 'food', size: 1, stack: 2,
    desc: 'Military ration pack. Dense, salty, complete.',
    inspect: 'The packaging says it expired eleven years ago. The packaging has been wrong about everything else too.',
    use: { hunger: -2 },},
  bandage: {
    name: 'Bandage', art: 'assets/items/bandage.webp', find: 'minor', kind: 'med', size: 1, stack: 4,
    desc: 'Clean rolled gauze.',
    inspect: 'Mara would approve of the fold job. Stops bleeding. Does nothing for anything else.',
    use: { cure: 'bleeding' },},
  antiseptic: {
    name: 'Antiseptic', art: 'assets/items/antiseptic.webp', find: 'minor', kind: 'med', size: 1, stack: 2,
    desc: 'Small brown bottle. Stings going on.',
    inspect: 'Smells like a Mercy clinic morning. Kills infection in a wound. Useless against hunger, thirst, or bad decisions.',
    use: { cure: 'infection' },},
  medkit: {
    name: 'Field Medkit', art: 'assets/items/medkit.webp', find: 'minor', kind: 'med', size: 2, stack: 1,
    desc: 'Canvas roll: sutures, salve, splints, strong hands in a bag.',
    inspect: 'Everything Mara wishes she had more of. Stabilizes a hurt person — it will not make them whole.',
    use: { stabilize: true },},
  splint: {
    name: 'Limb Splint', art: 'assets/items/splint.webp', find: 'minor', kind: 'med', size: 2, stack: 1,
    desc: 'Rigid brace with straps.',
    inspect: 'Two flat boards and someone\'s belt, basically. Holds a bad limb still enough to travel on.',
    use: { cure: 'limb' },},
  knife: {
    name: 'Hunting Knife', art: 'assets/items/knife.webp', find: 'minor', kind: 'weapon', size: 2, stack: 1,
    desc: 'Worn sheath, honest edge.',
    inspect: 'Not a fighting knife — a working one. Opens cans, cuts rope, and, if it comes to it, ends arguments.',
    equip: 'weapon',},
  tire_iron: {
    name: 'Tire Iron', art: 'assets/items/tire_iron.webp', find: 'minor', kind: 'weapon', size: 2, stack: 1,
    desc: 'Heavy steel. Josh\'s answer to most problems.',
    inspect: 'Scratched and true. Josh has fixed half of Mercy with this and threatened the other half. He\'d want it back.',
    equip: 'weapon',},
  flashlight: {
    name: 'Flashlight', art: 'assets/items/flashlight.webp', find: 'minor', kind: 'utility', size: 1, stack: 1,
    desc: 'Hand-crank torch. No batteries to die.',
    inspect: 'Thirty seconds of cranking buys you ten minutes of light. Dark corners stop being a gamble.',
    equip: 'utility',},
  rope: {
    name: 'Rope Coil', art: 'assets/items/rope.webp', find: 'minor', kind: 'utility', size: 2, stack: 1,
    desc: 'Twenty feet of braided nylon.',
    inspect: 'Frayed at one end, strong everywhere else. Holds packs shut, rigs shelters, hauls what you can\'t carry.',
    equip: 'utility',},
  ammo_9mm: {
    name: '9mm Rounds', art: 'assets/items/ammo_9mm.webp', find: 'minor', kind: 'ammo', size: 1, stack: 10,
    desc: 'Loose cartridges in a cloth wrap.',
    inspect: 'Nine millimeters of "not today." Only useful if someone\'s holding the thing that fires them.',},
  dead_phone: {
    name: 'Dead Phone', art: 'assets/items/dead_phone.webp', find: 'major', kind: 'story', size: 1, stack: 1,
    desc: 'A dead phone. Screen dark.',
    inspect: 'A kid\'s handwriting on a scrap of tape: 15\'s the one. It doesn\'t turn on. You carry it anyway.',},
};

function itemDef(id) { return ITEMS[id] || null; }
