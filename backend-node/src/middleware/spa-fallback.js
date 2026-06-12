// SPA fallback. When a request for a path the bundle handles client-side
// (e.g. /widgets, /actions/123) reaches us as a 404 from static, hand back
// the SPA index.html so Vue Router can pick up the URL. Asset extensions
// (.js/.css/.png/...) get a real 404 so missing files surface fast.

const path = require('path');
const { buildIndexHtml, detectLang } = require('./index-html');
const { DEFAULT_CHANNEL_ID, DEFAULT_CHANNEL_NAME } = require('../config');

// Anything resembling a static file gets a real 404. The bundle never asks
// for "/something.js" via the router.
const HTML_EXTENSIONS = new Set(['', '.html', '.htm']);

function spaFallback() {
  return function (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    // Skip API + Socket.IO + obvious static paths.
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')
        || req.path.startsWith('/img') || req.path.startsWith('/widget')
        || req.path.startsWith('/combo') || req.path.startsWith('/js')
        || req.path.startsWith('/css') || req.path.startsWith('/dx')
        || req.path.startsWith('/sounds') || req.path.startsWith('/twemoji')
        || req.path.startsWith('/uploads') || req.path.startsWith('/docs')) {
      return next();
    }
    const ext = path.extname(req.path).toLowerCase();
    if (ext && !HTML_EXTENSIONS.has(ext)) return next();

    const channels = require('../db/models/channels');
    const ch = channels.findDefault();
    // Use the SAME detection as indexHtmlMiddleware (URL prefix → tf_locale cookie
    // → tf_lang cookie → Accept-Language, all 12 langs) so SPA-fallback routes
    // don't silently downgrade the 8 locales beyond vi/de/es to English. Shared to
    // kill the drift between the two middlewares.
    const lang = detectLang(req);
    // Persist an explicit /<lang>/ URL choice so later prefix-less navigations
    // (the bundle's router strips /<lang>/ on /tiktok/* pages) keep serving it.
    const urlLangMatch = String(req.path || '').match(/^\/([a-z]{2})(\/|$)/);
    if (urlLangMatch && lang && urlLangMatch[1] === lang) {
      res.setHeader('Set-Cookie',
        `tf_lang=${urlLangMatch[1]}; Path=/; Max-Age=31536000; SameSite=Lax`);
    }
    const buf = buildIndexHtml({
      channelId: ch ? ch.ChannelId : DEFAULT_CHANNEL_ID,
      channelName: ch ? ch.ChannelName : DEFAULT_CHANNEL_NAME,
      lang,
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Match indexHtmlMiddleware — the HTML embeds a per-build cache-buster, so it
    // must never be cached by the renderer/Electron disk cache.
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).end(buf);
  };
}

module.exports = { spaFallback };
