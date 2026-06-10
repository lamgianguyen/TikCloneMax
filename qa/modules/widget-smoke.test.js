// qa/modules/widget-smoke.test.js — L3 widget standalone HTML smoke checks.
//
// For every widget name in ctx.registry.widgets:
//   1. Locate source file: WIDGET_DIR/<name>.html → WIDGET_DIR/<name>/index.html.
//      Neither exists → SKIP (some registry names legitimately have no file).
//   2. STATIC checks (always run, even backend down) — read file text:
//        <id>.external-libs (HIGH, gate "widget-external-libs")
//          FAIL on a blocking external script/style from a known CDN host.
//          PASS when all libs are localized (/js/lib/…, /tf-cdn/…, relative).
//        <id>.debug-spam (LOW, gate "Gate 35-LOG")
//          FAIL on leftover per-frame debug logs (widget settings received…).
//        <id>.null-guard (MEDIUM, gate "Gate 35 RC-D")
//          FAIL only on a CLEAR unguarded `settings.isPro` deref. Else PASS.
//   3. HTTP check (only when ctx.backendUp) — GET /widget/<name>?cid=1&preview=1:
//        <id>.serve PASS on 2xx/30x→2xx with body > 200 bytes; FAIL on 404/500/empty.
//
// Dependency-free (fs + ctx.http only). Never throws out of run(): each widget is
// wrapped in try/catch so a single broken widget = one FAIL + continue.

const fs = require('fs');
const path = require('path');

const AREA = 'L3 Widget';
const MIN_SERVE_BYTES = 200; // a real widget HTML is always larger than this
const EVIDENCE_MAX = 120; // keep evidence terse per contract

// Known CDN HOSTS that, when loaded by a widget, block/hang plain browsers + OBS.
// Localized paths (/js/lib/…, /tf-cdn/…, relative) are GOOD and must NOT match —
// these are HOSTNAMES only, so a relative "/js/lib/jquery.js" can never trip them.
const CDN_HOST_PATTERNS = [
  'code.jquery.com',
  'cdnjs.cloudflare.com',
  'cdnjs.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdn.socket.io',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'gstatic.com',
  'ajax.googleapis.com', // jQuery often served from here too
];

// Leftover per-frame / per-event debug spam (Gate 35-LOG). Conservative: only the
// well-known offenders flagged in CLAUDE.md, matched case-insensitively.
const DEBUG_SPAM_PATTERNS = [
  'widget settings received',
  '"default size"',
  ',"default size"',
  'data received',
];

function clip(str) {
  const s = String(str == null ? '' : str).replace(/\s+/g, ' ').trim();
  return s.length > EVIDENCE_MAX ? s.slice(0, EVIDENCE_MAX - 1) + '…' : s;
}

function result(id, status, evidence, severity, gate, fixHint) {
  return { id, area: AREA, name: id, status, evidence, severity, gate, fixHint };
}

// Locate the source file: <name>.html → <name>/index.html → extension-less
// <name> (webcam/overlay/talking ship as extension-less HTML — the gốc graphic
// overlays — and DO contain real markup incl. external libs worth smoking).
function locateWidgetFile(widgetDir, name) {
  const flat = path.join(widgetDir, `${name}.html`);
  if (safeIsFile(flat)) return flat;
  const dir = path.join(widgetDir, name, 'index.html');
  if (safeIsFile(dir)) return dir;
  const bare = path.join(widgetDir, name);
  if (safeIsFile(bare)) return bare;
  return null;
}

function safeIsFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch (_) {
    return false;
  }
}

// Find the first offending CDN-host reference. Returns the matched host + a short
// quoted substring around it, or null when clean. We scan for the bare hostname so
// localized/relative paths can never false-positive.
function findExternalCdn(text) {
  const lower = text.toLowerCase();
  for (const host of CDN_HOST_PATTERNS) {
    const idx = lower.indexOf(host);
    if (idx === -1) continue;
    // Quote a small window around the hit, not the whole line.
    const start = Math.max(0, idx - 24);
    const snippet = text.slice(start, idx + host.length + 24);
    return { host, snippet };
  }
  return null;
}

function findDebugSpam(text) {
  const lower = text.toLowerCase();
  for (const pat of DEBUG_SPAM_PATTERNS) {
    const idx = lower.indexOf(pat.toLowerCase());
    if (idx === -1) continue;
    const start = Math.max(0, idx - 16);
    const snippet = text.slice(start, idx + pat.length + 16);
    return { pat, snippet };
  }
  return null;
}

// Null-guard check for `settings.isPro` (Gate 35 RC-D). Be conservative: only FAIL
// on a CLEAR unguarded deref. A deref is considered guarded when a `settings &&`
// (or `settings &&` after a `!preview &&`) guard sits close before the deref, or the
// deref already uses optional chaining (`settings?.isPro`). When unsure → PASS+note.
const ISPRO_DEREF = /(!\s*)?settings\s*\.\s*isPro/g;
const GUARD_LOOKBEHIND = 80; // chars before the deref to scan for a null guard

function checkNullGuard(text) {
  if (text.indexOf('settings.isPro') === -1 && text.indexOf('settings?.isPro') === -1) {
    return { status: 'skip' }; // widget never references settings.isPro
  }

  let match;
  ISPRO_DEREF.lastIndex = 0;
  while ((match = ISPRO_DEREF.exec(text)) !== null) {
    const at = match.index;
    // Optional-chaining form `settings?.isPro` is inherently safe — skip it.
    if (text.slice(Math.max(0, at - 1), at + 'settings'.length + 4).includes('settings?.')) {
      continue;
    }
    // Skip derefs inside a line comment (`// …`) or block-comment continuation
    // (`* …`) — commented-out code is not a live crash risk (e.g. firework).
    const lineStart = text.lastIndexOf('\n', at) + 1;
    const lineBefore = text.slice(lineStart, at);
    if (lineBefore.includes('//') || /^\s*\*/.test(lineBefore)) {
      continue;
    }
    const before = text.slice(Math.max(0, at - GUARD_LOOKBEHIND), at);
    const guarded =
      /settings\s*&&/.test(before) || // `settings &&` near deref
      /&&\s*settings\b/.test(before) || // `… && settings`
      /settings\s*\?\./.test(before) || // optional chaining earlier in expr
      /typeof\s+settings/.test(before); // typeof settings === …
    if (!guarded) {
      const start = Math.max(0, at - 24);
      const snippet = text.slice(start, at + 'settings.isPro'.length + 8);
      return { status: 'fail', snippet };
    }
  }
  return { status: 'pass' };
}

async function checkServe(http, name) {
  // http.get follows up to the lib's default; a 30x with a body still counts when
  // the final status is 2xx. We treat status in [200,400) + body>200 as healthy.
  const r = await http.get(`/widget/${encodeURIComponent(name)}?cid=1&preview=1`);
  const bytes = r && r.text ? Buffer.byteLength(r.text, 'utf8') : 0;
  const okStatus = r && r.status >= 200 && r.status < 400;
  if (okStatus && bytes > MIN_SERVE_BYTES) {
    return result(
      `widget.${name}.serve`,
      'PASS',
      `${r.status} · ${bytes}B`,
      'MEDIUM',
      'Gate 35'
    );
  }
  const why = r && r.status > 0 ? `status=${r.status} bytes=${bytes}` : `no response (${r && r.error})`;
  return result(
    `widget.${name}.serve`,
    'FAIL',
    clip(why),
    'HIGH',
    'Gate 35',
    `GET /widget/${name}?cid=1&preview=1 must return 2xx HTML — check route + file serving`
  );
}

function staticResultsFor(name, file) {
  const results = [];
  let externalLibHit = false;
  let debugSpamHit = false;

  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    results.push(
      result(
        `widget.${name}.read`,
        'FAIL',
        clip(`read error: ${e.message}`),
        'MEDIUM',
        'widget-smoke',
        `Cannot read ${path.basename(file)} — check file permissions`
      )
    );
    return { results, externalLibHit, debugSpamHit };
  }

  // ── external-libs (HIGH) ──────────────────────────────────────────────────
  const cdn = findExternalCdn(text);
  if (cdn) {
    externalLibHit = true;
    results.push(
      result(
        `widget.${name}.external-libs`,
        'FAIL',
        clip(`CDN ${cdn.host}: …${cdn.snippet}…`),
        'HIGH',
        'widget-external-libs',
        'Localize blocking CDN lib to /js/lib/ — external libs hang OBS/plain browsers'
      )
    );
  } else {
    results.push(
      result(`widget.${name}.external-libs`, 'PASS', 'no CDN-host libs', 'HIGH', 'widget-external-libs')
    );
  }

  // ── debug-spam (LOW) ──────────────────────────────────────────────────────
  const spam = findDebugSpam(text);
  if (spam) {
    debugSpamHit = true;
    results.push(
      result(
        `widget.${name}.debug-spam`,
        'FAIL',
        clip(`leftover log: …${spam.snippet}…`),
        'LOW',
        'Gate 35-LOG',
        'Remove leftover per-frame/per-event debug console.log'
      )
    );
  } else {
    results.push(result(`widget.${name}.debug-spam`, 'PASS', 'no debug spam', 'LOW', 'Gate 35-LOG'));
  }

  // ── null-guard (MEDIUM) ───────────────────────────────────────────────────
  const ng = checkNullGuard(text);
  if (ng.status === 'fail') {
    results.push(
      result(
        `widget.${name}.null-guard`,
        'FAIL',
        clip(`unguarded settings.isPro: …${ng.snippet}…`),
        'MEDIUM',
        'Gate 35 RC-D',
        'Guard with `!preview && settings && settings.isPro === false` — settings may be null'
      )
    );
  } else if (ng.status === 'pass') {
    results.push(result(`widget.${name}.null-guard`, 'PASS', 'settings.isPro guarded', 'MEDIUM', 'Gate 35 RC-D'));
  } else {
    // skip = widget never references settings.isPro → nothing to guard
    results.push(result(`widget.${name}.null-guard`, 'PASS', 'no settings.isPro deref', 'MEDIUM', 'Gate 35 RC-D'));
  }

  return { results, externalLibHit, debugSpamHit };
}

module.exports = {
  name: 'widget-smoke',
  area: AREA,
  needsBackend: false, // static checks always run; HTTP checks gated on ctx.backendUp

  async run(ctx) {
    const widgetDir = ctx.config.WIDGET_DIR;
    const names = (ctx.registry && ctx.registry.widgets) || [];
    const results = [];
    const metrics = { widgetsChecked: 0, withFile: 0, externalLibHits: 0, debugSpamHits: 0 };

    for (const name of names) {
      metrics.widgetsChecked += 1;
      try {
        const file = locateWidgetFile(widgetDir, name);
        if (!file) {
          results.push(
            result(`widget.${name}.locate`, 'SKIP', 'no html file', 'LOW', 'widget-smoke')
          );
          continue;
        }
        metrics.withFile += 1;

        const stat = staticResultsFor(name, file);
        stat.results.forEach((r) => results.push(r));
        if (stat.externalLibHit) metrics.externalLibHits += 1;
        if (stat.debugSpamHit) metrics.debugSpamHits += 1;

        if (ctx.backendUp) {
          try {
            results.push(await checkServe(ctx.http, name));
          } catch (e) {
            results.push(
              result(`widget.${name}.serve`, 'FAIL', clip(`serve threw: ${e.message}`), 'HIGH', 'Gate 35')
            );
          }
        } else {
          results.push(
            result(`widget.${name}.serve`, 'SKIP', 'backend down', 'LOW', 'Gate 35')
          );
        }
      } catch (e) {
        // A thrown widget = one FAIL + continue (never throw out of run()).
        results.push(
          result(`widget.${name}.crash`, 'FAIL', clip(`widget check threw: ${e.message}`), 'HIGH', 'widget-smoke')
        );
      }
    }

    return { results, metrics };
  },
};
