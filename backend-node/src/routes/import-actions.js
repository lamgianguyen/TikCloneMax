// /api/importActions — native ".tfc" Import Settings → Actions reinsert.
//
// The bundle's setup.doImport (decompiled/modules/deobfuscated.js:3399) POSTs
// { targetProfileId, actions } here when the user ticks the "Actions" box in the
// Import Settings dialog, then consumes `response.newRecordMappings` — a map from
// each imported action's ORIGINAL id to its freshly-inserted local id — to
// re-point imported events/timers at the new rows (modules:3403-3432, 3505).
//
// Without this route the call 404s, doImport rejects BEFORE settings.save(), and
// the whole import (actions AND the settings/sounds/events chosen in the same
// run) is lost with a generic "Import failed" toast. See FIXLOG "import-actions".
//
// api.doAction (app:73960) is jQuery dataType:"json", so the success callback
// receives the raw JSON body — newRecordMappings must sit at top level.
//
// Semantics mirror the dialog's own promise ("existing actions with the same
// name will be overwritten"): same-name actions in the target profile are
// replaced; unrelated actions are kept. One better-sqlite3 transaction = atomic.

const express = require('express');
const db = require('../db/conn');
const actions = require('../db/models/actions');
const channels = require('../db/models/channels');
const sockets = require('../services/socket-manager');
const logger = require('../logger');

const router = express.Router();

function resolveChannelId(req) {
  if (req.auth && req.auth.channelId > 0) return req.auth.channelId;
  const def = channels.findDefault();
  return def ? def.ChannelId : 0;
}

// Target profile: explicit body value wins (bundle sends the active profileId),
// else fall back to the channel's current ProfileId, else profile 1.
function resolveProfileId(req, channelId, requested) {
  if (Number.isFinite(requested) && requested > 0) return requested;
  if (channelId > 0) {
    const ch = channels.findById(channelId);
    if (ch && ch.ProfileId > 0) return ch.ProfileId;
  }
  return 1;
}

router.post('/importActions', (req, res) => {
  const channelId = resolveChannelId(req);
  if (channelId <= 0) return res.status(400).json({ status: 400, message: 'no channel' });

  const body = req.body || {};
  const profileId = resolveProfileId(
    req,
    channelId,
    Number(body.targetProfileId ?? body.TargetProfileId)
  );
  const items = Array.isArray(body.actions) ? body.actions : [];

  // Keyed by the imported action's ORIGINAL id → new local id. The bundle looks
  // up _0x2ddb56[importedAction.id] (modules:3418) so the key MUST be a.id.
  const newRecordMappings = {};

  const txn = db.transaction(() => {
    // Overwrite-by-name: delete only same-name actions in this (channel, profile);
    // unrelated actions survive. Matches the dialog's "same name overwritten" text.
    const names = new Set(
      items
        .filter((a) => a && typeof a === 'object' && typeof a.name === 'string')
        .map((a) => a.name)
    );
    if (names.size > 0) {
      for (const row of actions.listByChannelProfile(channelId, profileId)) {
        if (names.has(row.Name)) actions.remove(row.Id);
      }
    }

    let order = 0;
    for (const a of items) {
      if (!a || typeof a !== 'object') continue;
      // Store the whole imported action as ConfigJson (mirrors seed.js importer);
      // mapAction reads media/dynamicConfig back out of this blob on GET.
      const newId = actions.create({
        ChannelId: channelId,
        ProfileId: profileId,
        Name: typeof a.name === 'string' ? a.name : `Action ${order + 1}`,
        Type: typeof a.type === 'string' ? a.type : '',
        TriggerValue: typeof a.triggerValue === 'string' ? a.triggerValue : null,
        ConfigJson: JSON.stringify(a),
        Enabled: a.enabled === false ? false : true,
        Sort: Number.isFinite(a.sort) ? a.sort : order,
      });
      order++;
      if (a.id !== undefined && a.id !== null) newRecordMappings[a.id] = newId;
    }
  });

  try {
    txn();
  } catch (err) {
    logger.error({ err }, '[ImportActions] transaction failed');
    return res.status(500).json({ status: 500, message: err.message });
  }

  // Reflect imported actions in any live UI without forcing a renderer reload
  // (the bundle reloads itself after import — modules:3317 — but a connected
  // overlay/control page benefits from the nudge).
  try {
    sockets.broadcast('actionsChanged', {});
  } catch (e) {
    logger.warn({ err: e }, '[ImportActions] broadcast failed');
  }

  res.json({ status: 200, message: 'OK', newRecordMappings });
});

module.exports = router;
