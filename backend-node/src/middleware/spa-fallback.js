// SPA fallback. When a request for a path the bundle handles client-side
// (e.g. /widgets, /actions/123) reaches us as a 404 from static, hand back
// the SPA index.html so Vue Router can pick up the URL. Asset extensions
// (.js/.css/.png/...) get a real 404 so missing files surface fast.

const path = require('path');
const { buildIndexHtml } = require('./index-html');
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
    // Detect lang prefix so SPA-fallback for `/vi/...` serves the VN HTML
    // instead of the default English one. Cookie fallback when no prefix
    // — the bundle's client-side router strips /<lang>/ when navigating
    // to /tiktok/* pages, so we need the cookie to keep serving VN.
    const m = String(req.path || '').match(/^\/([a-z]{2})(\/|$)/);
    const urlLang = (m && ['vi', 'de', 'es'].includes(m[1])) ? m[1] : '';
    let lang = urlLang;
    if (!lang) {
      const cookieMatch = String(req.headers.cookie || '').match(/(?:^|;\s*)tf_lang=([a-z]{2})/);
      if (cookieMatch && ['vi', 'de', 'es'].includes(cookieMatch[1])) lang = cookieMatch[1];
    }
    if (urlLang) {
      res.setHeader('Set-Cookie',
        `tf_lang=${urlLang}; Path=/; Max-Age=31536000; SameSite=Lax`);
    }
    const buf = buildIndexHtml({
      channelId: ch ? ch.ChannelId : DEFAULT_CHANNEL_ID,
      channelName: ch ? ch.ChannelName : DEFAULT_CHANNEL_NAME,
      lang,
    });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).end(buf);
  };
}

module.exports = { spaFallback };
