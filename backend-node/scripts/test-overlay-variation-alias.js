// Unit test for the graphic-overlay variation key alias.
//
// Bug: graphic-overlay widgets (webcam/overlay/talking) read their style under
// the NON-prefixed key `${widgetId}_variation` (e.g. webcam_pure_variation),
// but the bundle persists it as `widget_webcam_pure_variation`. The widget
// never finds the variation → preview freezes on the default.
//
// Run: node backend-node/scripts/test-overlay-variation-alias.js
const path = require('path');
const assert = require('assert');

// widget-settings-cache loads db/conn at require time; point it at the repo's
// dev DB dir so the module initialises without touching the live desktop DB.
process.env.TIKMAX_DATA_DIR = path.join(__dirname, '..', 'data');

const cache = require('../src/services/widget-settings-cache');

let passed = 0;
function check(name, fn) {
  try {
    fn();
    console.log('  PASS', name);
    passed++;
  } catch (err) {
    console.error('  FAIL', name, '→', err.message);
    process.exitCode = 1;
  }
}

assert(typeof cache._aliasGraphicOverlayKeys === 'function',
  '_aliasGraphicOverlayKeys must be exported');

const alias = cache._aliasGraphicOverlayKeys;

check('de-prefixes webcam variation the widget reads', () => {
  const bag = { widget_webcam_pure_variation: 'greenscreen 4 panels' };
  alias(bag);
  assert.strictEqual(bag.webcam_pure_variation, 'greenscreen 4 panels');
});

check('keeps the prefixed original (control page still reads it)', () => {
  const bag = { widget_webcam_pure_variation: 'greenscreen 4 panels' };
  alias(bag);
  assert.strictEqual(bag.widget_webcam_pure_variation, 'greenscreen 4 panels');
});

check('covers overlay + talking categories', () => {
  const bag = {
    widget_overlay_sakura_variation: 'frame',
    widget_talking_pure_variation: 'livechat',
  };
  alias(bag);
  assert.strictEqual(bag.overlay_sakura_variation, 'frame');
  assert.strictEqual(bag.talking_pure_variation, 'livechat');
});

check('does NOT clobber an existing non-prefixed value', () => {
  const bag = {
    widget_webcam_pure_variation: 'STALE',
    webcam_pure_variation: 'greenscreen blank',
  };
  alias(bag);
  assert.strictEqual(bag.webcam_pure_variation, 'greenscreen blank');
});

check('ignores unrelated widget_ keys', () => {
  const bag = { widget_chat_fontType: 'Roboto' };
  alias(bag);
  assert.strictEqual(bag.chat_fontType, undefined);
});

check('aliases animation too (same prefix bug class)', () => {
  const bag = { widget_webcam_pure_animation: 'true' };
  alias(bag);
  assert.strictEqual(bag.webcam_pure_animation, 'true');
});

console.log(`\n${passed} checks passed`);
