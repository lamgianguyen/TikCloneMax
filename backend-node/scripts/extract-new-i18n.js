// One-off: extract translation keys from downloads/vi that don't exist in
// downloads/index.html, so we can inject them as a runtime patch into the
// bundle's `appConfig.localization.en` (and any other locale that's missing
// the new keys). Result is written to backend-node/src/templates/i18n-patch.json
// and consumed by blockScript.txt at runtime.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const VI_PATH = path.join(ROOT, 'downloads', 'vi');
const EN_PATH = path.join(ROOT, 'downloads', 'index.html');
// Optional newer EN baseline — pass --source=/path/to/tikfinity-prod-html as the
// EN reference. When present, we extract EN translations from THAT file (the
// latest TikFinity production SSR output for /tiktok/tts) instead of vi. This
// keeps modal labels matching TikFinity gốc instead of mixing in VN strings.
const argSource = process.argv.find(a => a.startsWith('--source='));
const SOURCE_PATH = argSource ? argSource.slice('--source='.length) : VI_PATH;
const OUT = path.join(__dirname, '..', 'src', 'templates', 'i18n-patch.json');

const source = fs.readFileSync(SOURCE_PATH, 'utf8');
const en = fs.readFileSync(EN_PATH, 'utf8');
console.log(`Source: ${SOURCE_PATH}`);
console.log(`Baseline EN: ${EN_PATH}`);

// Find the bundle's locale object — `localization:{<lang>:{...}}`. Inside vi,
// the `vi` key has all VN translations. Inside en, the `en` key has English.
// We extract every "tts.*" / "credits_*" / "upgrade_*" / "voice_picker.*" key
// from VI and check if it exists in EN. Missing ones get queued.

// Match any quoted dotted/underscored translation key — broaden from the
// original `tts.*` / `credits_*` / `upgrade_*` allowlist so we also pick up
// the new `coin_drop_*`, `pro_dropdown_*`, etc. that newer TikFinity bundles
// keep adding. The bundle's localization object uses BOTH quoted dot-keys
// like "tts.voice_picker.ai_tab":"AI" AND unquoted identifier-keys like
// actionsandevents_action_exec_queue_limit_warning:"Screen queue is full!".
// We only care about quoted keys here — those are the new ones bundle update
// adds; unquoted identifiers are the legacy English baseline already in
// downloads/index.html.
const KEY_RE = /"([a-z0-9_]+(?:\.[a-z0-9_]+)+)":"((?:[^"\\]|\\.)*)"/g;

const sourceMap = new Map();
let m;
while ((m = KEY_RE.exec(source)) !== null) {
  sourceMap.set(m[1], m[2]);
}
KEY_RE.lastIndex = 0;

const enMap = new Map();
while ((m = KEY_RE.exec(en)) !== null) {
  enMap.set(m[1], m[2]);
}

// Missing in baseline EN: keys in source but not in current downloads/index.html.
const missing = {};
for (const [k, vVal] of sourceMap.entries()) {
  if (!enMap.has(k)) {
    missing[k] = vVal;
  }
}

console.log(`Source keys: ${sourceMap.size}`);
console.log(`Baseline EN keys: ${enMap.size}`);
console.log(`Missing in baseline EN: ${Object.keys(missing).length}`);
console.log('Sample:');
for (const k of Object.keys(missing).slice(0, 10)) {
  console.log(`  ${k} = ${missing[k]}`);
}

// MERGE, do NOT overwrite. i18n-patch.json holds hand-curated values (Vietnamese
// labels for menu_* / overlay keys etc. added manually because KEY_RE below only
// matches DOTTED keys — flat underscore keys like "menu_countdowngoals" are NEVER
// auto-extracted; see SKILL.md §3.6 Tier 4). Existing keys WIN over freshly
// extracted English so re-running after a bundle update augments instead of
// clobbering the curated fix. Delete a key from the JSON by hand to force re-extract.
let existing = {};
try {
  if (fs.existsSync(OUT)) existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
} catch (err) {
  console.warn(`! could not parse existing ${OUT} (${err.message}) — treating as empty`);
}
const merged = Object.assign({}, missing, existing); // existing curated values take precedence
const addedCount = Object.keys(merged).length - Object.keys(existing).length;

fs.writeFileSync(OUT, JSON.stringify(merged, null, 2), 'utf8');
console.log(`\nMerged: kept ${Object.keys(existing).length} existing + added ${addedCount} new = ${Object.keys(merged).length} total`);
console.log(`Wrote ${OUT} (${fs.statSync(OUT).size} bytes)`);
console.log(`\n⚠ FLAT underscore keys (no dot, e.g. menu_countdowngoals) are NOT auto-extracted.`);
console.log(`  After a bundle update, eyeball new overlay menu labels in the sidebar; if a raw`);
console.log(`  key shows, add it MANUALLY to ${path.basename(OUT)} with a Vietnamese value, then`);
console.log(`  POST /api/_dev/reload-html. (SKILL.md §3.6 Tier 4.)`);
