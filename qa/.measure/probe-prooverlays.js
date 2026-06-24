const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const out = { steps: [] };

// Confirm session Pro flag
out.sessionIsPro = window.session?.me?.isPro ?? null;
out.userFeaturesIsPro = window.session?.me?.userFeatures?.isPro ?? null;
out.navIsPro = (() => {
  try {
    const apps = document.querySelectorAll('[data-v-app]');
    for (const a of apps) {
      const inst = a.__vue_app__ || a._vnode?.appContext?.app;
    }
  } catch (_) {}
  return undefined;
})();

// Navigate to overlays page
try {
  window.navigation.pageChange('obsoverlays');
  out.steps.push('pageChange obsoverlays called');
} catch (e) {
  out.steps.push('pageChange err: ' + e.message);
}

await sleep(6000);

// Trigger obsoverlays.show() to ensure cards render
try {
  if (window.obsoverlays && window.obsoverlays.show) {
    window.obsoverlays.show();
    out.steps.push('obsoverlays.show called');
  }
} catch (e) { out.steps.push('show err: ' + e.message); }

await sleep(2500);

// restrictedWidgetsMap is module-internal; read widgetsURls (exposed) + scan DOM textboxes.
out.widgetsUrlsKeys = (() => {
  try { return Object.keys(window.widgetsURls || {}); } catch (_) { return null; }
})();

// Collect ALL dxTextBox input values on the page (the copy-URL fields)
const proIds = ['likefountain', 'cannon', 'wheelofactions', 'coinjar', 'coinmatch', 'penaltybattle', 'topg', 'tops'];
out.cards = {};

// Strategy: scan all readonly text inputs, classify by whether value contains a known overlay path or the lock string
const inputs = Array.from(document.querySelectorAll('input[readonly], .dx-texteditor-input'));
out.totalReadonlyInputs = inputs.length;
const lockHits = [];
const realUrlHits = [];
for (const inp of inputs) {
  const v = (inp.value || '').trim();
  if (!v) continue;
  if (v.includes('Pro exclusive')) lockHits.push(v);
  if (/\/widget\//.test(v) || /localhost:5285/.test(v)) {
    // tag which overlay this url belongs to
    realUrlHits.push(v);
  }
}
out.lockStringCount = lockHits.length;
out.lockStringSamples = lockHits.slice(0, 10);
out.realWidgetUrlCount = realUrlHits.length;

// Per-overlay: find the URL value via widgetsURls map (bundle-maintained) which holds resolved url + element
out.perOverlay = {};
try {
  const wu = window.widgetsURls || {};
  for (const id of proIds) {
    const entry = wu[id];
    if (!entry) { out.perOverlay[id] = { present: false }; continue; }
    let domVal = null;
    try {
      const el = entry.element;
      if (el && el.dxTextBox) domVal = el.dxTextBox('instance').option('value');
    } catch (_) {}
    out.perOverlay[id] = {
      present: true,
      resolvedUrl: entry.url || null,
      domTextBoxValue: domVal,
      locked: typeof domVal === 'string' && domVal.includes('Pro exclusive'),
    };
  }
} catch (e) {
  out.perOverlayErr = e.message;
}

return out;
