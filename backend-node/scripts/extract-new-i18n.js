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
const OUT = path.join(__dirname, '..', 'src', 'templates', 'i18n-patch.json');

const vi = fs.readFileSync(VI_PATH, 'utf8');
const en = fs.readFileSync(EN_PATH, 'utf8');

// Find the bundle's locale object — `localization:{<lang>:{...}}`. Inside vi,
// the `vi` key has all VN translations. Inside en, the `en` key has English.
// We extract every "tts.*" / "credits_*" / "upgrade_*" / "voice_picker.*" key
// from VI and check if it exists in EN. Missing ones get queued.

const KEY_RE = /"((?:tts\.[a-z0-9_.]+|credits_[a-z_]+|upgrade_[a-z_]+))":"((?:[^"\\]|\\.)*)"/g;

const viMap = new Map();
let m;
while ((m = KEY_RE.exec(vi)) !== null) {
  viMap.set(m[1], m[2]);
}
KEY_RE.lastIndex = 0;

const enMap = new Map();
while ((m = KEY_RE.exec(en)) !== null) {
  enMap.set(m[1], m[2]);
}

// Missing in English: keys that exist in VI but not in EN.
const missing = {};
for (const [k, vVal] of viMap.entries()) {
  if (!enMap.has(k)) {
    missing[k] = vVal;
  }
}

console.log(`VI keys: ${viMap.size}`);
console.log(`EN keys: ${enMap.size}`);
console.log(`Missing in EN: ${Object.keys(missing).length}`);
console.log('Sample:');
for (const k of Object.keys(missing).slice(0, 10)) {
  console.log(`  ${k} = ${missing[k]}`);
}

fs.writeFileSync(OUT, JSON.stringify(missing, null, 2), 'utf8');
console.log(`\nWrote ${OUT} (${fs.statSync(OUT).size} bytes)`);
