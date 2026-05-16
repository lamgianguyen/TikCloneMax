// /api/tts/generate — TikTok TTS proxy.
//
// Mirrors Tikfinity's `tikfinity-tts-api.zerody.one` endpoint so the
// bundle's TTS module works without depending on Tikfinity's commercial
// proxy. Direct port of `backend/Controllers/TtsController.cs`.
//
// Auth: reuses the `sessionid` cookie the TikTok bridge writes to
// `%APPDATA%/tikfinity-desktop/tiktok-session.json`. The bridge populates
// it on TikTok login; without it TTS returns 503.

const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const router = express.Router();

// useast1a works for all regions in testing; useast2a returns 411.
const TIKTOK_TTS_ENDPOINT =
  'https://api16-normal-c-useast1a.tiktokv.com/media/api/text/speech/invoke/';

function resolveSessionFilePath() {
  if (process.env.TIKTOK_SESSION_FILE) return process.env.TIKTOK_SESSION_FILE;
  const productDir = 'tikfinity-desktop';
  const fileName = 'tiktok-session.json';
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA;
    if (!appData) return null;
    return path.join(appData, productDir, fileName);
  }
  if (process.platform === 'darwin') {
    return path.join(process.env.HOME || '', 'Library', 'Application Support', productDir, fileName);
  }
  return path.join(process.env.HOME || '', '.config', productDir, fileName);
}

function readStoredSessionId() {
  if (process.env.TIKTOK_SESSIONID) return process.env.TIKTOK_SESSIONID;
  const filePath = resolveSessionFilePath();
  if (!filePath || !fs.existsSync(filePath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data || typeof data.sessionId !== 'string' || !data.sessionId.trim()) return null;
    if (data.expiresAt) {
      const exp = new Date(data.expiresAt);
      if (!Number.isNaN(exp.getTime()) && exp.getTime() <= Date.now()) return null;
    }
    return data.sessionId;
  } catch {
    return null;
  }
}

async function callTikTokTts(voice, text, sessionId) {
  const url =
    `${TIKTOK_TTS_ENDPOINT}?text_speaker=${encodeURIComponent(voice)}` +
    `&req_text=${encodeURIComponent(text)}` +
    '&speaker_map_type=0&aid=1233';

  const ctrl = new AbortController();
  const timeoutHandle = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'User-Agent':
          'com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)',
        Cookie: `sessionid=${sessionId}`,
        Accept: 'application/json',
      },
      signal: ctrl.signal,
    });

    if (!resp.ok) {
      logger.warn(`[TTS] TikTok returned ${resp.status}`);
      return null;
    }

    const payload = await resp.json().catch(() => null);
    if (!payload || payload.status_code !== 0) {
      logger.warn(`[TTS] TikTok error status_code=${payload?.status_code} msg=${payload?.status_msg}`);
      return null;
    }
    const vStr = payload.data?.v_str;
    if (!vStr) {
      logger.warn('[TTS] TikTok returned empty audio data');
      return null;
    }
    try {
      return Buffer.from(vStr, 'base64');
    } catch (err) {
      logger.error({ err }, '[TTS] failed to base64-decode response');
      return null;
    }
  } finally {
    clearTimeout(timeoutHandle);
  }
}

router.get('/generate', async (req, res) => {
  const voice = typeof req.query.voice === 'string' && req.query.voice ? req.query.voice : 'en_us_002';
  const rawText = typeof req.query.text === 'string' ? req.query.text : '';
  if (!rawText.trim()) return res.status(400).json({ error: 'text is required' });

  const trimmed = rawText.length > 300 ? rawText.slice(0, 300) : rawText;
  const sessionId = readStoredSessionId();
  if (!sessionId) {
    logger.warn('[TTS] No TikTok sessionid — user needs to sign in via TikTok login flow first');
    return res.status(503).json({
      error: 'tiktok_session_missing',
      message: 'Sign in to TikTok first to enable TTS',
    });
  }

  try {
    const audio = await callTikTokTts(voice, trimmed, sessionId);
    if (!audio) return res.status(502).json({ error: 'tts_upstream_failed' });
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).end(audio);
  } catch (err) {
    if (err?.name === 'AbortError') {
      return res.status(504).json({ error: 'tts_upstream_timeout' });
    }
    logger.error({ err, voice }, '[TTS] generate failed');
    res.status(502).json({ error: 'tts_upstream_exception', message: err?.message });
  }
});

module.exports = router;
