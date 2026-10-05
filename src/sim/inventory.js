/* sim/inventory.js — Individual character inventories (Milestone 2).
   ---------------------------------------------------------------------------
   No shared magical inventory. Josh and Mara each carry their own items;
   equipped gear stays on the character wearing it. The player manages both.

   Capacity model: INV_SLOTS (10, a balance value — not canon) per character.
   One stack occupies `size` slots regardless of quantity. Consumables stack
   up to their item's `stack` max. No weight simulation.

   State: g.inv = { josh: {slots:[{item,qty}...], equipment:{weapon,utility}},
                    mara: {slots:[...], equipment:{...}} }
          g.together (bool, default true) — GIVE only when together and
                    circumstances permit; separation keeps inventories apart.
          g.found — temporary FOUND state when loot doesn't fit:
                    {who, item, qty, rest:[{item,qty}], loc}
   Transfer/separation future-proofing: every op takes an explicit character;
   nothing ever reads "the" inventory. */

const INV_SLOTS = 10;

function initInvState(s) {
  if (!s.inv) s.inv = {};
  ['josh', 'mara'].forEach(function (k) {
    if (!s.inv[k]) s.inv[k] = { slots: [], equipment: { weapon: null, utility: null } };
    if (!Array.isArray(s.inv[k].slots)) s.inv[k].slots = [];
    if (!s.inv[k].equipment) s.inv[k].equipment = { weapon: null, utility: null };
  });
  if (s.together === undefined) s.together = true;
  if (!('found' in s)) s.found = null;
  return s.inv;
}

function invKey(who) {
  const w = String(who || '').toLowerCase();
  return w === 'mara' ? 'mara' : 'josh';
}

function invState(who) {
  initInvState(g);
  return g.inv[invKey(who)];
}

function invUsedSlots(who) {
  const inv = invState(who);
  let used = 0;
  inv.slots.forEach(function (s) { const d = itemDef(s.item); used += d ? d.size : 1; });
  return used;
}

function invFreeSlots(who) { return INV_SLOTS - invUsedSlots(who); }

/* Pure add against a slot array (dry-run safe). Returns {slots, added, leftover}. */
function invAddTo(slots, itemId, qty) {
  const def = itemDef(itemId);
  const out = slots.map(function (s) { return { item: s.item, qty: s.qty }; });
  if (!def || qty <= 0) return { slots: out, added: 0, leftover: qty };
  let remaining = qty, added = 0;
  function used() {
    let u = 0;
    out.forEach(function (s) { const d = itemDef(s.item); u += d ? d.size : 1; });
    return u;
  }
  if (def.stack > 1) {
    for (let i = 0; i < out.length && remaining > 0; i++) {
      if (out[i].item === itemId && out[i].qty < def.stack) {
        const take = Math.min(def.stack - out[i].qty, remaining);
        out[i].qty += take; remaining -= take; added += take;
      }
    }
  }
  while (remaining > 0) {
    if (used() + def.size > INV_SLOTS) break;
    const take = def.stack > 1 ? Math.min(def.stack, remaining) : 1;
    out.push({ item: itemId, qty: take });
    remaining -= take; added += take;
  }
  return { slots: out, added: added, leftover: remaining };
}

function invAdd(who, itemId, qty) {
  const inv = invState(who);
  const r = invAddTo(inv.slots, itemId, qty);
  inv.slots = r.slots;
  return { added: r.added, leftover: r.leftover };
}

function invFits(who, itemId, qty) {
  return invAddTo(invState(who).slots, itemId, qty).leftover === 0;
}

function invRemove(who, itemId, qty) {
  const inv = invState(who);
  let remaining = qty, removed = 0;
  for (let i = inv.slots.length - 1; i >= 0 && remaining > 0; i--) {
    if (inv.slots[i].item === itemId) {
      const take = Math.min(inv.slots[i].qty, remaining);
      inv.slots[i].qty -= take; remaining -= take; removed += take;
      if (inv.slots[i].qty <= 0) inv.slots.splice(i, 1);
    }
  }
  return removed;
}

function invCount(who, itemId) {
  let n = 0;
  invState(who).slots.forEach(function (s) { if (s.item === itemId) n += s.qty; });
  return n;
}

function invHas(who, itemId, qty) { return invCount(who, itemId) >= (qty || 1); }

function invOther(who) { return invKey(who) === 'josh' ? 'mara' : 'josh'; }

function charName(who) { return invKey(who) === 'josh' ? 'Josh' : 'Mara'; }

/* --- Contextual actions ---------------------------------------------------
   itemActions returns only actions currently applicable:
     use     — consumable with a relevant effect right now
     equip   — weapon/utility not currently equipped (or swap)
     unequip — currently equipped
     give    — together and the other character has room
     inspect — always
     drop    — always */
function itemActions(who, itemId) {
  const def = itemDef(itemId);
  if (!def) return [];
  const k = invKey(who), inv = invState(k), acts = [];
  const surv = survOf(k);
  if (def.use) {
    let usable = false;
    if (def.use.thirst && surv.thirst > 0) usable = true;
    if (def.use.hunger && surv.hunger > 0) usable = true;
    if (def.use.cure && surv.conditions.indexOf(def.use.cure) >= 0) usable = true;
    if (def.use.stabilize && (surv.health !== 'healthy' || surv.conditions.indexOf('illness') >= 0)) usable = true;
    if (usable) acts.push('use');
  }
  if (def.equip) {
    acts.push(inv.equipment[def.equip] === itemId ? 'unequip' : 'equip');
  }
  if (g.together !== false && invHas(k, itemId, 1)) acts.push('give');
  acts.push('inspect');
  acts.push('drop');
  return acts;
}

/* USE: consumable effects dispatch into the survival system. Returns {ok, msg}. */
function invUseItem(who, itemId) {
  const k = invKey(who), def = itemDef(itemId);
  if (!def || !def.use) return { ok: false, msg: 'That can\'t be used.' };
  if (!invHas(k, itemId, 1)) return { ok: false, msg: charName(k) + ' doesn\'t have that.' };
  const surv = survOf(k);
  if (def.use.thirst && surv.thirst <= 0) return { ok: false, msg: 'Not thirsty — save it.' };
  if (def.use.hunger && surv.hunger <= 0) return { ok: false, msg: 'Not hungry — save it.' };
  if (def.use.cure && surv.conditions.indexOf(def.use.cure) < 0)
    return { ok: false, msg: 'No ' + def.use.cure + ' to treat.' };
  const msg = survApplyUse(k, def);
  invRemove(k, itemId, 1);
  return { ok: true, msg: msg };
}

function invEquip(who, itemId) {
  const k = invKey(who), def = itemDef(itemId), inv = invState(k);
  if (!def || !def.equip) return { ok: false, msg: 'That can\'t be equipped.' };
  if (!invHas(k, itemId, 1)) return { ok: false, msg: charName(k) + ' doesn\'t have that.' };
  const slot = def.equip, cur = inv.equipment[slot];
  if (cur === itemId) return { ok: false, msg: 'Already equipped.' };
  invRemove(k, itemId, 1);
  if (cur) {
    if (!invFits(k, cur, 1)) { // no room to stow the old one — undo
      invAdd(k, itemId, 1);
      return { ok: false, msg: 'No room to stow the ' + itemDef(cur).name + '.' };
    }
    invAdd(k, cur, 1);
  }
  inv.equipment[slot] = itemId;
  return { ok: true, msg: def.name + ' equipped (' + slot + ').' };
}

function invUnequip(who, slot) {
  const k = invKey(who), inv = invState(k), cur = inv.equipment[slot];
  if (!cur) return { ok: false, msg: 'Nothing equipped there.' };
  if (!invFits(k, cur, 1)) return { ok: false, msg: 'No room in ' + charName(k) + '\'s pack.' };
  inv.equipment[slot] = null;
  invAdd(k, cur, 1);
  return { ok: true, msg: itemDef(cur).name + ' stowed.' };
}

/* GIVE: only when together. Nothing moves unless the receiver has room. */
function invGive(from, to, itemId, qty) {
  const f = invKey(from), t = invKey(to);
  if (f === t) return { ok: false, msg: 'That\'s the same person.' };
  if (g.together === false)
    return { ok: false, msg: charName(f) + ' and ' + charName(t) + ' are separated — no handoffs.' };
  const n = Math.min(qty || 1, invCount(f, itemId));
  if (n <= 0) return { ok: false, msg: charName(f) + ' doesn\'t have that.' };
  if (!invFits(t, itemId, n))
    return { ok: false, msg: charName(t) + ' has no room for it.' };
  invRemove(f, itemId, n);
  invAdd(t, itemId, n);
  const def = itemDef(itemId);
  return { ok: true, msg: charName(f) + ' gives ' + charName(t) + ' ' + n + '× ' + def.name + '.' };
}

/* DROP: leaves the item at the current scavenging location's ground (loot
   persists there); otherwise it is simply discarded. */
function invDrop(who, itemId, qty) {
  const k = invKey(who);
  const n = Math.min(qty || 1, invCount(k, itemId));
  if (n <= 0) return { ok: false, msg: 'Nothing to drop.' };
  invRemove(k, itemId, n);
  const def = itemDef(itemId);
  if (g.scavLoc && g.scav && g.scav[g.scavLoc]) scavGroundAdd(g.scavLoc, itemId, n);
  return { ok: true, msg: n + '× ' + def.name + ' set down.' };
}

function invInspect(itemId) {
  const def = itemDef(itemId);
  if (!def) return '';
  return def.inspect || def.desc;
}

/* --- FOUND state ----------------------------------------------------------
   When loot doesn't fit, nothing is auto-discarded. g.found holds the
   overflow until the player resolves it: TAKE (if room now) / GIVE (other
   character) / USE (consumable) / LEAVE (drops to the location's ground).
   `rest` carries any further ungranted loot behind this item. */
function setFound(who, itemId, qty, rest, loc) {
  g.found = { who: invKey(who), item: itemId, qty: qty, rest: rest || [], loc: loc || null };
}

function clearFound() { g.found = null; }

function foundActions() {
  if (!g.found) return [];
  const f = g.found, def = itemDef(f.item), acts = [];
  if (invFits(f.who, f.item, f.qty)) acts.push('take');
  const other = invOther(f.who);
  if (g.together !== false && invFits(other, f.item, f.qty)) acts.push('give');
  if (def && def.use && itemActions(f.who, f.item).indexOf('use') >= 0) acts.push('use');
  acts.push('leave');
  return acts;
}

/* Resolves the current FOUND item; then continues with any queued rest. */
function resolveFound(action) {
  const f = g.found;
  if (!f) return { ok: false, msg: 'Nothing to resolve.' };
  const def = itemDef(f.item), other = invOther(f.who);
  let msg = '';
  if (action === 'take') {
    if (!invFits(f.who, f.item, f.qty)) return { ok: false, msg: 'Still no room.' };
    invAdd(f.who, f.item, f.qty);
    msg = charName(f.who) + ' takes ' + f.qty + '× ' + def.name + '.';
  } else if (action === 'give') {
    if (g.together === false || !invFits(other, f.item, f.qty))
      return { ok: false, msg: 'Can\'t hand it over right now.' };
    invAdd(other, f.item, f.qty);
    msg = charName(other) + ' takes ' + f.qty + '× ' + def.name + '.';
  } else if (action === 'use') {
    const r = invUseItem(f.who, f.item);
    if (!r.ok) return r;
    msg = r.msg;
    if (f.qty > 1 && invFits(f.who, f.item, f.qty - 1)) {
      invAdd(f.who, f.item, f.qty - 1);
      msg += ' The rest fits now.';
    } else if (f.qty > 1) {
      if (f.loc) scavGroundAdd(f.loc, f.item, f.qty - 1);
      msg += ' The rest is set down.';
    }
  } else { // leave
    if (f.loc) scavGroundAdd(f.loc, f.item, f.qty);
    msg = f.qty + '× ' + def.name + ' left behind.';
  }
  const rest = f.rest || [];
  clearFound();
  if (rest.length) grantLoot(f.who, rest, f.loc);
  return { ok: true, msg: msg };
}

/* Grants a loot list in order; first overflow opens the FOUND state.
   loot = [{item, qty}...]. Returns true if everything fit. */
function grantLoot(who, loot, loc) {
  const k = invKey(who);
  for (let i = 0; i < loot.length; i++) {
    const r = invAdd(k, loot[i].item, loot[i].qty);
    if (r.leftover > 0) {
      setFound(k, loot[i].item, r.leftover, loot.slice(i + 1), loc);
      return false;
    }
  }
  return true;
}
