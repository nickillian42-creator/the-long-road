/* sim/invui.js — Touch-first inventory UI (Milestone 2).
   JOSH | MARA tabs (never shrunken side-by-side panels). Tap an item to see
   ONLY the actions that apply right now: USE / EQUIP / UNEQUIP / GIVE /
   INSPECT / DROP. Tap controls throughout; no drag-and-drop required. */

function invShow(who) {
  g.invWho = invKey(who);
  g.invSel = null;
  g.invInspecting = false;
  saveProto();
  invScreen();
}

function invSelect(idx) {
  g.invSel = { who: g.invWho, idx: idx };
  g.invInspecting = false;
  invScreen();
}

function invScreen() {
  if (!g || !g.proto) return start();
  g.phase = 'inv';
  const who = g.invWho || 'josh', inv = invState(who);
  const other = invOther(who);
  const used = invUsedSlots(who);
  const eq = inv.equipment;
  const name = charName(who).toUpperCase();

  let h = '<h2>INVENTORY</h2>';
  h += '<div class="inv-tabs">' +
    '<button class="' + (who === 'josh' ? 'selected' : '') + '" onclick="invShow(\'josh\')">JOSH</button>' +
    '<button class="' + (who === 'mara' ? 'selected' : '') + '" onclick="invShow(\'mara\')">MARA</button></div>';

  // CHARACTER — full-body portrait, prominent.
  // Visual hierarchy: CHARACTER -> WHAT THEY'RE CARRYING -> WHAT'S IN THE BAG.
  h += '<div class="inv-top"><div class="inv-char">' + charArtTag(who, 'char-full') +
    '<div class="inv-char-name"><b>' + name + '</b><br><span class="muted">' +
    escapeHtml(survStatusLine(who)) + '</span></div></div>';

  // ON CHARACTER — equipment positions. PRESENTATION of the existing
  // {weapon, utility} model: HANDS <- weapon, BELT/UTILITY <- utility.
  // BACKPACK is a visual of their carried pack (fill indicator, not a slot
  // in the model); QUICK-ACCESS is a reserved, non-functional slot.
  h += '<div class="inv-side"><div class="eyebrow">ON ' + name + ' — CARRYING</div><div class="loadout">';
  h += eqSlotTag(who, 'HANDS', eq.weapon, 'weapon');
  h += eqSlotTag(who, 'BELT / UTILITY', eq.utility, 'utility');
  h += '<div class="eq-slot"><div class="eyebrow eq-label">BACKPACK</div><div class="eq-pack">' + packIcon() +
    '<span class="slot-name">' + used + '/' + INV_SLOTS + ' in the bag</span></div></div>';
  h += '<div class="eq-slot reserved"><div class="eyebrow eq-label">QUICK-ACCESS</div>' +
    '<div class="eq-empty">reserved</div></div>';
  h += '</div></div></div>';

  // IN THE BAG — the same DayZ-style bag grid as before
  h += '<div class="eyebrow">IN THE BAG — ' + used + '/' + INV_SLOTS + ' SLOTS</div><div class="inv-grid">';
  inv.slots.forEach(function (s, i) {
    const d = itemDef(s.item);
    const sel = g.invSel && g.invSel.who === who && g.invSel.idx === i;
    h += '<button class="slot' + (sel ? ' sel' : '') + '" onclick="invSelect(' + i + ')">' +
      artTag(s.item, 'slot-art') +
      '<span class="slot-name">' + escapeHtml(d.name) + (s.qty > 1 ? ' ×' + s.qty : '') + '</span>' +
      (d.size > 1 ? '<small>' + d.size + ' slots</small>' : '') + '</button>';
  });
  for (let i = inv.slots.length; i < INV_SLOTS; i++) h += '<button class="slot empty" disabled>·</button>';
  h += '</div>';

  // detail panel for the selected item
  if (g.invSel && g.invSel.who === who && inv.slots[g.invSel.idx]) {
    const s = inv.slots[g.invSel.idx], d = itemDef(s.item);
    h += '<div class="detail">' + artTag(s.item, 'detail-art') +
      '<h3>' + escapeHtml(d.name) + (s.qty > 1 ? ' ×' + s.qty : '') + '</h3>';
    h += '<p class="muted">' + escapeHtml(g.invInspecting ? invInspect(s.item) : d.desc) + '</p>';
    const acts = itemActions(who, s.item);
    const labels = { use: 'USE', equip: 'EQUIP', unequip: 'STOW', give: 'GIVE TO ' + charName(other).toUpperCase(), inspect: g.invInspecting ? 'HIDE DETAILS' : 'INSPECT', drop: 'DROP' };
    h += '<div class="actions">';
    acts.forEach(function (a) {
      if (a === 'unequip') {
        const slot = d.equip;
        h += btn('STOW', 'invDo(\'unequip:' + slot + '\')', 'primary');
      } else {
        h += btn(labels[a], 'invDo(\'' + a + '\')', a === 'drop' ? '' : 'primary');
      }
    });
    h += '</div></div>';
  } else {
    h += '<p class="muted">Tap an item to see what ' + charName(who) + ' can do with it.</p>';
  }

  h += '<p class="muted">' + charName(other).toUpperCase() + '\'s pack: ' + invUsedSlots(other) + '/' + INV_SLOTS + ' slots' +
    (g.together === false ? ' · SEPARATED — no handoffs' : '') + '</p>';
  const back = g.invReturn === 'scavend' ? 'scavEnd(false)' : 'scavScene()';
  h += btn('BACK', back, 'choice');
  screen('<div class="panel">' + h + '</div>');
}

/* Equipment-position markup. weapon -> HANDS, utility -> BELT/UTILITY.
   Tap an equipped item to stow it (routes through invUnequipSlot, which uses
   the unchanged invUnequip mechanics — full-bag rule preserved). */
function eqSlotTag(who, label, itemId, slot) {
  let h = '<div class="eq-slot"><div class="eyebrow eq-label">' + label + '</div>';
  if (itemId) {
    const d = itemDef(itemId);
    h += '<button class="eq-item" onclick="invUnequipSlot(\'' + who + '\',\'' + slot + '\')">' +
      artTag(itemId, 'eq-art') +
      '<span class="slot-name">' + escapeHtml(d.name) + '</span>' +
      '<small>tap to stow</small></button>';
  } else {
    h += '<div class="eq-empty">— empty —</div>';
  }
  return h + '</div>';
}

/* invUnequipSlot: stow the equipped item directly. Same invUnequip mechanics
   as before; unlike the old EQUIPPED-row buttons it does not depend on a bag
   selection first, so tapping an equipped item always stows it. */
function invUnequipSlot(who, slot) {
  const r = invUnequip(invKey(who), slot);
  if (r.msg) notify(r.msg);
  saveProto();
  invScreen();
}

/* invDo dispatches the tapped contextual action for the selected item. */
function invDo(action) {
  const sel = g.invSel;
  if (!sel) { invScreen(); return; }
  const who = sel.who, inv = invState(who), s = inv.slots[sel.idx];
  if (!s) { g.invSel = null; invScreen(); return; }
  const itemId = s.item, def = itemDef(itemId), other = invOther(who);
  let msg = '';
  if (action === 'use') {
    const r = invUseItem(who, itemId);
    msg = r.msg;
  } else if (action === 'equip') {
    const r = invEquip(who, itemId);
    msg = r.msg;
  } else if (action.indexOf('unequip:') === 0) {
    const r = invUnequip(who, action.split(':')[1]);
    msg = r.msg;
  } else if (action === 'give') {
    const r = invGive(who, other, itemId, s.qty);
    msg = r.msg;
  } else if (action === 'inspect') {
    g.invInspecting = !g.invInspecting;
    invScreen();
    return;
  } else if (action === 'drop') {
    const r = invDrop(who, itemId, s.qty);
    msg = r.msg;
  }
  g.invSel = null;
  g.invInspecting = false;
  if (msg) notify(msg);
  saveProto();
  invScreen();
}
