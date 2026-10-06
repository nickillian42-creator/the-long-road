/* sim/art.js — Item artwork resolution + comic-book interaction blips (M2 UX pass).
   ---------------------------------------------------------------------------
   PRESENTATION ONLY. No inventory, survival, or scavenging mechanics here.

   itemArt(id): resolves an item's artwork.
     - Preview builds inline a data-URI map as the global ITEM_ART
       ({ id: 'data:image/webp;base64,...' }); when present it wins.
     - Otherwise falls back to the item def's `art` asset path
       ('assets/items/<id>.webp' — uploaded via GitHub web; the connector
       must never push binaries).
     - Unknown items or missing art -> null. Callers must degrade to a
       styled placeholder, never a broken image.

   artTag(id, cls): ready-to-render artwork markup with graceful fallback.
     Renders a .artwrap span holding the <img>; if the image fails to load
     it removes itself, revealing the .art-fallback glyph underneath.

   blip(kind): mature, grounded graphic-novel interaction blips — NOT
     superhero, NOT Borderlands. Small restrained ink marks whose shape and
     intensity respond to the situation:
       'calm'   — soft ink-wash roundel: calm exploration, quiet resolves
       'talk'   — small speech tick: conversation (reserved; unused in the
                  prototype, defined for the coming dialogue systems)
       'danger' — jagged dark-rust burst, quick and sharp: real danger
       'urgent' — amber jagged pulse: needs a decision right now
     Unknown kinds fall back to 'calm'. Pure CSS animation; honors
     prefers-reduced-motion. pointer-events:none — blips never eat taps. */

function itemArt(id) {
  const def = itemDef(id);
  if (!def) return null;
  if (typeof ITEM_ART !== 'undefined' && ITEM_ART && ITEM_ART[id]) return ITEM_ART[id];
  return def.art || null;
}

function artTag(id, cls) {
  const def = itemDef(id), src = itemArt(id);
  const alt = escapeHtml(def ? def.name : String(id));
  const c = cls ? ' ' + cls : '';
  if (!src) return '<span class="art-fallback' + c + '" aria-label="' + alt + '">◇</span>';
  return '<span class="artwrap' + c + '"><span class="art-fallback">◇</span>' +
    '<img src="' + src + '" alt="' + alt + '" loading="lazy" onerror="this.remove()"></span>';
}

function blip(kind) {
  const k = (kind === 'talk' || kind === 'danger' || kind === 'urgent') ? kind : 'calm';
  return '<span class="blip blip-' + k + '" aria-hidden="true"></span>';
}

/* Minimal SVG rucksack used as the "pack" target of the take transition. */
function packIcon() {
  return '<svg class="pack-svg" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">' +
    '<rect x="24" y="8" width="16" height="12" rx="6" fill="none" stroke="#91b279" stroke-width="2.5"/>' +
    '<rect x="13" y="18" width="38" height="36" rx="11" fill="#3a4a33" stroke="#91b279" stroke-width="2"/>' +
    '<rect x="22" y="29" width="20" height="13" rx="4" fill="#2a3828" stroke="#91b279" stroke-width="1.5"/>' +
    '<line x1="32" y1="18" x2="32" y2="29" stroke="#91b279" stroke-width="1.5"/></svg>';
}

/* --- Searchable-area artwork (M2 visual pass) --------------------------------
   PRESENTATION ONLY. The five prototype areas each have an illustrated card
   (`art-preview-areas/<id>.webp`, wide landscape, same gritty graphic-novel
   style as the item art). areaArt(id) mirrors itemArt(): prefers an inlined
   AREA_ART data-URI map when a preview build provides one, else falls back
   to the asset path 'assets/areas/<id>.webp' (uploaded via GitHub web; the
   connector must never push binaries). Unknown areas -> null; callers render
   a styled placeholder, never a broken image. */
const SCAV_ART = {
  shelves: 'store_shelves',
  fridge: 'refrigerator',
  backpack: 'backpack',
  cabinet: 'cabinet',
  glovebox: 'glovebox',
};

function areaArtId(areaId) { return SCAV_ART[areaId] || null; }

function areaArt(areaId) {
  const artId = areaArtId(areaId);
  if (!artId) return null;
  if (typeof AREA_ART !== 'undefined' && AREA_ART && AREA_ART[artId]) return AREA_ART[artId];
  return 'assets/areas/' + artId + '.webp';
}

function areaArtTag(areaId, cls) {
  const src = areaArt(areaId);
  const area = (typeof SCAV_AREAS !== 'undefined' && SCAV_AREAS[areaId]) || null;
  const alt = escapeHtml(area ? area.name : String(areaId));
  const c = cls ? ' ' + cls : '';
  if (!src) return '<span class="art-fallback area-art' + c + '" aria-label="' + alt + '">◇</span>';
  return '<span class="artwrap area-art' + c + '"><span class="art-fallback">◇</span>' +
    '<img src="' + src + '" alt="' + alt + '" loading="lazy" onerror="this.remove()"></span>';
}

/* --- Character artwork (M2 presentation pass) --------------------------------
   PRESENTATION ONLY. Full-body illustrated portraits of the two crew members
   (`art-preview-chars/<id>.webp`, vertical, same gritty graphic-novel style as
   the item and area art). charArt(who) mirrors itemArt(): prefers an inlined
   CHAR_ART data-URI map when a preview build provides one, else falls back to
   the asset path 'assets/chars/<id>.webp' (uploaded via GitHub web; the
   connector must never push binaries). Unknown characters -> null; callers
   render a styled placeholder, never a broken image. */
const CHAR_ART_IDS = { josh: 'josh_fullbody', mara: 'mara_fullbody' };
const CHAR_NAMES = { josh: 'Josh', mara: 'Mara' };

function charArt(who) {
  const artId = CHAR_ART_IDS[who] || null;
  if (!artId) return null;
  if (typeof CHAR_ART !== 'undefined' && CHAR_ART && CHAR_ART[artId]) return CHAR_ART[artId];
  return 'assets/chars/' + artId + '.webp';
}

function charArtTag(who, cls) {
  const src = charArt(who);
  const alt = escapeHtml((CHAR_NAMES[who] || String(who)) + ' — full-body portrait');
  const c = cls ? ' ' + cls : '';
  if (!src) return '<span class="art-fallback char-art' + c + '" aria-label="' + alt + '">◇</span>';
  return '<span class="artwrap char-art' + c + '"><span class="art-fallback">◇</span>' +
    '<img src="' + src + '" alt="' + alt + '" loading="lazy" onerror="this.remove()"></span>';
}
