// /api/obs/* — OBS WebSocket REST surface.
//
// The C# version drove a real OBS WebSocket v5 client (`backend/Services/
// ObsService.cs`). The Node port keeps the public API and connection-tracking
// shape but uses a lazy on-demand `obs-websocket-js` client — that package is
// only required if the user actually wires OBS, so the dep is optional and
// loaded with try/catch.
//
// Connection settings live in DynamicSetting (`obs.url`, `obs.password`) and
// are edited via the regular /api/updateSettings flow.

const express = require('express');
const logger = require('../logger');

const router = express.Router();

// ── Lazy OBS WebSocket client ──────────────────────────────────────────────
//
// `obs-websocket-js` is currently not an npm dep — we'll pull it in as part
// of Phase 3 when the bridge service goes live. Until then, this controller
// reports "not connected" and accepts `/connect` as a recorded intent so the
// settings UI doesn't break.

let _obsModule = null;
function tryLoadObsModule() {
  if (_obsModule !== null) return _obsModule || null;
  try {
    _obsModule = require('obs-websocket-js');
    return _obsModule;
  } catch {
    _obsModule = false;
    return null;
  }
}

let _obs = null;        // OBSWebSocket instance
let _connected = false;
let _currentScene = null;
let _knownScenes = [];

async function connectObs(url, password) {
  const mod = tryLoadObsModule();
  if (!mod) {
    logger.warn('[OBS] obs-websocket-js not installed — install to enable real connection');
    return { ok: false, reason: 'obs_module_missing' };
  }
  try {
    if (!_obs) _obs = new (mod.default || mod.OBSWebSocket)();
    if (_connected) await _obs.disconnect().catch(() => {});
    await _obs.connect(url, password || undefined);
    _connected = true;
    _obs.on('CurrentProgramSceneChanged', (e) => { _currentScene = e.sceneName; });
    _obs.on('ConnectionClosed', () => { _connected = false; });
    // Prime the scene list + current scene so /status reflects reality right away.
    try {
      const list = await _obs.call('GetSceneList');
      _knownScenes = (list.scenes || []).map((s) => s.sceneName);
      _currentScene = list.currentProgramSceneName || _currentScene;
    } catch (err) {
      logger.warn({ err }, '[OBS] connected but GetSceneList failed');
    }
    return { ok: true };
  } catch (err) {
    logger.error({ err }, '[OBS] connect failed');
    _connected = false;
    return { ok: false, reason: 'connect_failed', message: err.message };
  }
}

function disconnectObs() {
  if (_obs && _connected) _obs.disconnect().catch(() => {});
  _connected = false;
  _currentScene = null;
  _knownScenes = [];
}

// ── REST endpoints ─────────────────────────────────────────────────────────

router.get('/status', (_req, res) => {
  res.json({
    status: 200,
    connected: _connected,
    currentScene: _currentScene,
  });
});

router.post('/connect', async (req, res) => {
  const dto = req.body || {};
  const url = (dto.Url || dto.url || 'ws://localhost:4455').toString();
  const password = dto.Password || dto.password || undefined;
  const result = await connectObs(url, password);
  if (!result.ok) {
    return res.status(503).json({ status: 503, requested: url, error: result.reason, message: result.message });
  }
  res.json({ status: 200, requested: url });
});

router.post('/disconnect', (_req, res) => {
  disconnectObs();
  res.json({ status: 200, disconnected: true });
});

router.get('/scenes', async (_req, res) => {
  if (!_connected || !_obs) return res.status(409).json({ status: 409, error: 'not connected' });
  try {
    const list = await _obs.call('GetSceneList');
    _knownScenes = (list.scenes || []).map((s) => s.sceneName);
    _currentScene = list.currentProgramSceneName || _currentScene;
    res.json({ status: 200, current: _currentScene, scenes: _knownScenes });
  } catch (err) {
    res.status(500).json({ status: 500, error: err.message });
  }
});

router.post('/scene', async (req, res) => {
  if (!_connected || !_obs) return res.status(409).json({ status: 409, error: 'not connected' });
  const scene = (req.body?.Scene || req.body?.scene || '').toString();
  if (!scene) return res.status(400).json({ error: 'scene required' });
  try {
    await _obs.call('SetCurrentProgramScene', { sceneName: scene });
    _currentScene = scene;
    res.json({ status: 200, scene, switched: true });
  } catch (err) {
    res.status(500).json({ status: 500, scene, switched: false, error: err.message });
  }
});

router.get('/scene/:sceneName/items', async (req, res) => {
  if (!_connected || !_obs) return res.status(409).json({ status: 409, error: 'not connected' });
  const sceneName = req.params.sceneName;
  try {
    const r = await _obs.call('GetSceneItemList', { sceneName });
    res.json({ status: 200, scene: sceneName, items: r.sceneItems || [] });
  } catch (err) {
    res.status(500).json({ status: 500, error: err.message });
  }
});

router.post('/source/toggle', async (req, res) => {
  if (!_connected || !_obs) return res.status(409).json({ status: 409, error: 'not connected' });
  const scene = req.body?.Scene || req.body?.scene;
  const source = req.body?.Source || req.body?.source;
  if (!scene || !source) return res.status(400).json({ error: 'scene + source required' });

  try {
    const items = await _obs.call('GetSceneItemList', { sceneName: scene });
    const item = (items.sceneItems || []).find((i) => i.sourceName === source);
    if (!item) return res.status(404).json({ status: 404, error: 'source not found' });
    const enabled = !item.sceneItemEnabled;
    await _obs.call('SetSceneItemEnabled', {
      sceneName: scene,
      sceneItemId: item.sceneItemId,
      sceneItemEnabled: enabled,
    });
    res.json({ status: 200, toggled: enabled });
  } catch (err) {
    res.status(500).json({ status: 500, toggled: false, error: err.message });
  }
});

module.exports = router;
