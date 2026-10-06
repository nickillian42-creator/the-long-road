/* sim/testitems.js — PROTOTYPE-ONLY test equipment (M2 presentation pass).
   ---------------------------------------------------------------------------
   NOT part of the main item catalog (src/data/items.js). These exist only so
   the layered character renderer has a representative equipment set to bind
   during the PoC: a pistol and a long gun alongside the catalog's knife and
   flashlight.

   TEST-ONLY RULES:
   - Every def carries testOnly: true and a PROTOTYPE TEST ITEM description.
   - registerTestItems() merges them into the item catalog; it is called ONLY
     from the scavenging prototype start. Chapter One games never call it, so
     Chapter One can never see, grant, or reference these items.
   - When final art/systems arrive these defs are replaced or removed —
     nothing in the real game may depend on them. */

const TEST_ITEMS = {
  pistol_test: {
    name: 'Test Pistol (PoC)', art: 'assets/charlayers/pistol.webp',
    find: 'minor', kind: 'weapon', size: 2, stack: 1, equip: 'weapon',
    testOnly: true,
    desc: 'PROTOTYPE TEST ITEM — worn 9mm pistol. Exists only to exercise the character layer renderer.',
    inspect: 'Test-grade layer art. Not part of the real item catalog.',
  },
  longgun_test: {
    name: 'Test Rifle (PoC)', art: 'assets/charlayers/longgun.webp',
    find: 'minor', kind: 'weapon', size: 2, stack: 1, equip: 'weapon',
    testOnly: true,
    desc: 'PROTOTYPE TEST ITEM — weathered bolt-action rifle. Exists only to exercise the character layer renderer.',
    inspect: 'Test-grade layer art. Not part of the real item catalog.',
  },
};

function registerTestItems() {
  for (var id in TEST_ITEMS) ITEMS[id] = TEST_ITEMS[id];
}
