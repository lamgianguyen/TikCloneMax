# Bundle Reverse-Engineering Workflow

Three tools that together replace the "patch one gate at a time" loop.

## 1. Decompile the bundle (one-shot, ~30s)

```bash
# Vue 3 app code (the obfuscated UI):
npx webcrack downloads/combo/modules.js -o decompiled/modules
# TikTok bridge wrapper:
npx webcrack downloads/combo/app.js -o decompiled/app
```

After it runs:

- `decompiled/modules/deobfuscated.js` ≈ 945 KB readable Vue 3 source. Symbol
  names stay mangled (`_0xabc...`) but **all strings are decoded** and control
  flow is flattened. Grep for any bundle behaviour you'd previously chased via
  stack trace — `settings.restore`, `loadAiVoiceState`, `switchProfile`,
  `tts.voice_picker`, etc. all resolve to a real line you can read.
- `decompiled/app/` splits the browserify-style 153-module bundle into one
  file per module under `node_modules/`. Useful when you want to see exactly
  what version of `tiktok-live-connector` / `axios` / `protobufjs` the bundle
  ships.

Re-run after every `downloads/combo/*` swap.

## 2. Capture real-server contracts via HAR → stub generator

The fast way to learn the shape of an endpoint the bundle calls is to let the
real TikFinity server answer it once and snapshot the response.

```text
1. Open https://tikfinity.zerody.one/ in Chrome (NOT inside our app).
2. DevTools → Network → Preserve log ON → Disable cache ON.
3. Reload, then click every screen / modal you care about
   (Overlays, Voice Picker → AI tab, profile switch, etc.).
4. Right-click the request list → "Save all as HAR with content".
5. Save under captures/<name>.har in this repo (gitignored).
```

Then:

```bash
node scripts/decompile/har-to-stubs.js captures/<name>.har \
  --out routes-generated/<name>.js
```

Output:

- `routes-generated/<name>.js` — Express router, one handler per unique
  `(method, path)`, body = the actual JSON the real server returned.
- `routes-generated/<name>.shapes.md` — human-readable list of every endpoint
  (status, content-type, body size, first 200 chars) for quick review.

Mount the generated router temporarily in `backend-node/src/index.js` to let
the bundle hit it before you port the logic properly. Drop the line once the
real handler is in place.

## 3. Auto-instrument live traffic (zero-config)

To capture traffic from inside our app without HAR re-recording, enable the
instrumentation IIFE that's now baked into `templates/blockScript.txt`:

```js
// In the Electron app's DevTools console:
localStorage.setItem('tf-instrument', '1');
location.reload();
```

After reload, every fetch + XHR is recorded in `window.__tfCallLog` with
method, URL, request body, response status, and a body snippet (first 500
chars). Trigger the feature you want to learn about (open a modal, switch
profile, etc.), then:

```js
window.__tfDumpCallLog();          // downloads JSON of all traffic
window.__tfDumpCallLog('/api/tts'); // filter by URL substring
```

Off by default; setting the localStorage flag back to anything else (or
clearing it) and reloading disables it. Adds ~3 KB to the injected script and
two function wrappers — no perf impact when disabled.

## Suggested workflow when a bundle behaviour breaks

1. Grep `decompiled/modules/deobfuscated.js` for the symptom string (e.g. the
   modal text key or function name from the stack trace). Read the function.
2. If the function fetches data, enable instrumentation, trigger it once, dump
   the call log, see the exact URL + payload + response the bundle expects.
3. Mirror the contract in `backend-node/src/routes/<name>.js`. If the response
   is large, generate the handler from a HAR capture instead of writing it
   manually.
4. `POST http://127.0.0.1:5285/api/_dev/reload-html` after editing templates;
   restart Electron after editing `routes/`, `middleware/`, or `index.js`.
