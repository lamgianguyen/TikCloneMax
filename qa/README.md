# TikMax QA Harness — operator's guide

Self-maintaining QA harness cho TikFinity Clone. Một lệnh `node qa/run-all.js` chạy toàn bộ sweep, ghi kết quả vào `TEST_STATUS.md` + `FIXLOG.md` + `qa/results/*.json`, và **sống sót qua bundle update**.

**DURABILITY principle (lý do harness này khác mọi test script trước):** harness test các **lớp ỔN ĐỊNH** — **L1 API** (backend HTTP của TA), **L2 Socket** (socket-manager của TA), **L3 Widget** (widget HTML của TA), **perf** (RAM/CPU/log). Đây là contract của chính ta nên KHÔNG đổi khi TikFinity push bundle obfuscated mới. Chỉ lớp **L4 gate-health** chạm bundle, và nó CHỈ **FLAG drift** (WARN, không block) — khi 1 anchor trong bundle dời chỗ, gate-health báo "Gate X drift" để bạn vá needle, chứ không làm sập cả sweep. → Bundle mới = L1–L3 pass nguyên si, chỉ cần chỉnh vài needle ở L4. Runbook: [BUNDLE_UPDATE.md](BUNDLE_UPDATE.md).

---

## How to run

> Bật **backend + Electron** trước để các live-check (L1 API, L2 Socket, L3 serve) chạy thật. KHÔNG bật cũng OK — chúng **SKIP gracefully** (không tính là FAIL). Static check L3 (external-libs / debug-spam / null-guard đọc file widget) chạy được cả khi backend down.

```powershell
node qa/run-all.js                  # full sweep, read-only (non-destructive)
node qa/run-all.js --mutating       # + state-changing checks (coinjar reset…)
node qa/run-all.js --only api,socket # subset — chỉ chạy module có tên chứa 'api' HOẶC 'socket'
node qa/run-all.js --json           # machine output (JSON ra stdout, im console)
```

`--only` nhận danh sách phẩy: `--only api,socket` hoặc `--only=widget`. Khớp **substring** trên tên module (đã strip `.test.js`), nên `api` khớp `api-contract`, `widget` khớp `widget-smoke`.

**Exit codes:** `0` = không có FAIL · `1` = ≥1 FAIL · `2` = harness tự sập (lỗi không bắt được). **Backend down KHÔNG phải exit 2** — module tự SKIP, sweep vẫn về 0/1 bình thường.

**`npm run qa`** đã wire (root `package.json` → `node qa/run-all.js`). Chạy thẳng `node qa/run-all.js` cũng được. ⚠️ Một `--only` run = PARTIAL: nó KHÔNG ghi đè FIXLOG failures block (giữ ledger của lần FULL run gần nhất) và TEST_STATUS được gắn cờ "PARTIAL" — muốn ledger đầy đủ phải chạy FULL (không `--only`).

---

## Architecture map

```
qa/
├── run-all.js          # orchestrator: parse flags, load modules theo MODULES[], gọi run(ctx), persist
├── registry.js         # SOURCE OF TRUTH (declarative): api / mutating / socket / widgets / gates / liveCandidates
├── lib/
│   ├── config.js       # paths (DB thật, widget dir, decompiled, TEST_STATUS/FIXLOG) + THRESHOLDS
│   ├── http.js         # HTTP client dependency-free → { ok, status, text, json, ms, error } + .up()
│   ├── socket.js       # Socket.IO v4 client tự viết trên `ws` (EIO4 framing) — emit/on/waitFor/close
│   ├── perf.js         # RAM (tasklist) + CPU (Get-Process) sampling + parse log signals. Windows-first
│   └── results.js      # Lỗi-Historian: ghi block QA-AUTO vào TEST_STATUS.md + FIXLOG.md + json
├── modules/            # mỗi file = 1 KIND of check, implement MODULE CONTRACT
│   ├── api-contract.test.js   # L1 — chạy specs registry.api (+mutating) → status + jsonHas
│   ├── socket-relay.test.js   # L2 — handshake + distributeEvent relay (positive/negative)
│   ├── widget-smoke.test.js   # L3 — file static checks + GET /widget serve
│   ├── perf-sample.test.js    # perf — RAM/CPU/log sampling (ĐÃ build)
│   ├── gate-health.test.js    # L4 — needle-in-bundle drift flag (ĐÃ build; sinh toàn bộ ~53 gate row)
│   ├── live-id-finder.js      # tìm TikTok ID đang live cho real-event test (ĐÃ build)
│   └── chain-*.test.js        # E2E chains: settings / tts / points / goals / coinjar (ĐÃ build, wired ở run-all)
├── .measure/           # Playwright headless ĐO layout overlay thật (chromium cached) — dùng khi fix overlay
└── results/            # run-<id>.json mỗi lần chạy + latest.json (bản mới nhất, ổn định)
```

`qa/` **không có node_modules riêng** — cố ý. Khi cần `ws` / `better-sqlite3`, `config.requireBackend(name)` resolve từ `backend-node/node_modules` để KHÔNG bao giờ lệch version với backend đang chạy.

> ⚠️ **Module thiếu file = SKIP, không phải lỗi.** `MODULES` trong `run-all.js` liệt kê mọi module; file thiếu → harness ghi 1 dòng SKIP "module file not built yet" và chạy tiếp. Tính đến 2026-06-11, TẤT CẢ module trong danh sách đã build (api-contract, socket-relay, widget-smoke, perf-sample, gate-health, live-id-finder + 5 chain-*). Thêm module = viết file, harness tự nhặt.

---

## Where results go

Mỗi run ghi 3 nơi (qua `lib/results.js`):

| Đích | Nội dung | Cơ chế |
|---|---|---|
| [`TEST_STATUS.md`](../TEST_STATUS.md) | Bảng run mới nhất (mọi PASS/FAIL/SKIP + perf) | Block giữa `<!-- QA-AUTO:BEGIN -->` … `<!-- QA-AUTO:END -->` — **GHI ĐÈ mỗi run**, phần ngoài block giữ nguyên |
| [`FIXLOG.md`](../FIXLOG.md) | Chỉ các FAIL tự phát hiện (symptom + gate ref + fix hint) | Block `<!-- QA-AUTO-FAILURES:BEGIN -->` … `:END`. Không FAIL → ghi "Không có FAIL ✅" |
| `qa/results/run-<id>.json` + `latest.json` | Full payload (results + metrics + perf) máy đọc | Ghi mới mỗi run; `latest.json` luôn là bản gần nhất |

Mỗi FAIL = **1 strike** theo luật §6.1 (3-strike) trong CLAUDE.md. Sau khi fix thật, ghi root-cause vào **entry FIXLOG thường** (ngoài block QA-AUTO) rồi re-run để xác nhận PASS.

> Block QA-AUTO trong TEST_STATUS/FIXLOG **đừng sửa tay** — run sau ghi đè. Muốn ghi chú thủ công thì viết ngoài 2 marker đó.

---

## How to EXTEND (lời hứa cốt lõi)

### Thêm 1 feature test → thêm 1 entry vào `registry.js`. KHÔNG viết code mới.

Module đọc spec từ registry rồi tự execute. Concrete cho từng list:

**API endpoint** (`registry.api`) — GET/POST read-only:
```js
{ id: 'api.goals', method: 'GET', path: '/api/goals',
  expect: { status: 200, jsonHas: ['goals'] }, severity: 'MEDIUM', gate: 'Gate X' }
// expect.status: number HOẶC mảng code chấp nhận ([200,404]); jsonHas: dot-path PHẢI tồn tại trong body
```

**Socket relay event** (`registry.socket`):
```js
{ id: 'sock.relay.gift', event: 'gift', payload: { __qa: true, diamondCount: 1 },
  expectRelay: true, severity: 'HIGH', gate: 'Gate 35 RC-1' }
// expectRelay:false = negative test (event KHÔNG trong whitelist → PHẢI không tới widget)
```

**Widget name** (`registry.widgets`) — thêm string:
```js
widgets: [ 'coinjar', 'cannon', 'wheel', /* … */, 'mynewwidget' ]
// module tìm downloads/widget/<name>.html → <name>/index.html, chạy static + serve check
```

**Gate needle** (`registry.gates`) — anchor bundle để flag drift:
```js
{ id: 'gate.35.distribute', gate: 'Gate 35', kind: 'needleInDecompiled',
  needle: 'distributeEvent', severity: 'HIGH' }
// needle PHẢI xuất hiện trong file (kind: needleInDecompiled / needleInTemplates).
// Vắng mặt = bundle drift → Gate đó có thể đã vỡ.
```

**Destructive check** → thêm vào `registry.mutating` (chỉ chạy với `--mutating`). Mỗi cái phải self-undoing / idempotent (reset state phù du).

### Thêm 1 KIND of check mới → 1 file `qa/modules/`, đăng ký vào `MODULES`

Viết file implement [MODULE CONTRACT](#the-module-contract) dưới đây, rồi thêm filename vào mảng `MODULES` trong `run-all.js`. Harness tự load + chạy + persist.

---

## The MODULE CONTRACT

Mọi `qa/modules/*.js` export đúng shape này (trích nguyên văn từ `run-all.js`):

```js
module.exports = {
  name: 'api-contract',
  area: 'L1 API',
  needsBackend: true,             // true + backend down → toàn module SKIP (không chạy run)
  async run(ctx) {                // ctx = { config, http, connectSocket, perf, registry, log, backendUp, mutating }
    return {
      results: [ { id, area, name, status:'PASS'|'FAIL'|'SKIP', evidence, severity, gate, fixHint } ],
      metrics: { /* optional, tự do */ },
    };
  },
};
```

**Result row fields:** `id` (unique), `area` (vd 'L1 API'), `name`, `status` ('PASS'|'FAIL'|'SKIP'), `evidence` (chuỗi ngắn — cắt ~120 ký tự trong bảng), `severity` ('CRITICAL'|'HIGH'|'MEDIUM'|'LOW'), `gate` (gate ref nếu có), `fixHint` (gợi ý sửa, vào FIXLOG khi FAIL).

**ctx** harness inject: `config` (paths+thresholds), `http` (client `lib/http`), `connectSocket` (`lib/socket.connect`), `perf` (`lib/perf`), `registry`, `log` (im khi `--json`), `backendUp` (bool), `mutating` (bool).

**Quy ước sống còn (mọi module hiện tại đều theo):** `run()` **KHÔNG được throw** — bọc try/catch từng spec, biến lỗi thành 1 FAIL row + chạy tiếp. Nếu run() throw, harness bắt và ghi 1 FAIL `mod.<name>.crash` (HIGH) nhưng đó là dấu hiệu module viết ẩu.

---

## Thresholds

Khai báo trong `lib/config.js::THRESHOLDS`. Một check FAIL khi vượt budget của nó.

| Key | Default | Ý nghĩa |
|---|---|---|
| `httpMs` | 1500 | Budget mỗi HTTP request (L1). Vượt → note "slow"; vượt >2× → 1 perf-FAIL (LOW) |
| `socketDeliverMs` | 3000 | Budget relay 1 event controlpage→widget (L2) |
| `backendRssMb` | 700 | Trần RSS của node backend |
| `electronRssMb` | 2000 | Trần tổng RSS các electron.exe |
| `cpuPct` | 85 | Trần CPU% trung bình trong cửa sổ sample |
| `renderStretchMs` | 400 | Budget overlay stretch (Gate 30d / STRETCH-DIAG trong log) |

Tune: sửa số trong `config.js`. Lưu ý `backendRssMb` / `electronRssMb` / `cpuPct` / `renderStretchMs` chỉ có tác dụng khi `perf-sample.test.js` được build (hiện chưa).

---

## Known current findings

Harness ghi số liệu live mỗi run — đừng tin con số tĩnh ở đây, **chạy nó để lấy bản mới nhất**:

```powershell
node qa/run-all.js            # rồi đọc TEST_STATUS.md block QA-AUTO + qa/results/latest.json
```

Trạng thái build module tính đến 2026-06-11: TẤT CẢ đã build — `api-contract` / `socket-relay` / `widget-smoke` / `perf-sample` / `gate-health` / `live-id-finder` + 5 `chain-*`. Bảng QA-AUTO trong TEST_STATUS phản ánh đúng những module **tồn tại lúc run đó** — nếu thấy "module file not built yet" cho module bạn biết đã có, đó là snapshot cũ; chạy lại để cập nhật.

---

## Cross-links

- [BUNDLE_UPDATE.md](BUNDLE_UPDATE.md) — runbook khi user đưa bundle obfuscated mới.
- [.codex/team/qa-team.md](../.codex/team/qa-team.md) — đội QA agent thường trực + cách triệu tập.
- [CLAUDE.md](../CLAUDE.md) §0.0 (docs cross-link), §6.1 (FIXLOG 3-strike), §Gate 22 (RE pipeline), §Gate 35 (overlay/widget realtime).
