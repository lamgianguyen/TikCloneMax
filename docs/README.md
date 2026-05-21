# Docs Index

Agent đọc file này đầu tiên để hiểu hệ thống tài liệu của project.

## Cấu trúc tài liệu

```
docs/
├── README.md                    👈 file này — index dẫn đường
├── BUNDLE_CALL_FLOW.md          luồng gọi API + UI mapping (cho human + agent đọc)
├── API_CONTRACTS.md             shape + sample của 26 API chính (auto-gen từ HAR)
├── DATABASE.md                  ERD + schema better-sqlite3
├── MIGRATION_PLAN.md            .NET → Node port tracking (archived)
└── superpowers/                 (placeholder)

superpowers/skills/
└── bundle-integration/SKILL.md  skill BẮT BUỘC đọc trước khi sửa code bundle-adjacent

routes-generated/                auto-sinh từ HAR (gitignored)
├── tikfinity.zerody.four.merged.js              Express stub router
├── tikfinity.zerody.four.merged.shapes.md       228 endpoint full catalogue
└── tikfinity.zerody.four.merged.endpoints.json  raw JSON for tooling

decompiled/                      auto-sinh từ webcrack (gitignored)
├── modules/deobfuscated.js      Vue app source readable (945 KB)
└── app/                         TikTok bridge modules (153 chunks)

captures/                        HAR sources (gitignored)
├── tikfinity.zerody.one.har
├── tikfinity.zerody.two.har
├── tikfinity.zerody.three.har
└── tikfinity.zerody.four.har
```

## Khi nào đọc file nào

| Tình huống | Đọc file |
|---|---|
| Mới join project — muốn hiểu tổng quan | `PROJECT.md` (root) + `CLAUDE.md` |
| Sắp sửa template/middleware/route quan trọng | `superpowers/skills/bundle-integration/SKILL.md` **(BẮT BUỘC)** |
| Cần biết bundle gọi API gì khi boot / khi user click feature X | `docs/BUNDLE_CALL_FLOW.md` |
| Cần shape chính xác của 1 endpoint để mock/fix | `docs/API_CONTRACTS.md` |
| Cần xem full danh sách 228 endpoint + preview body | `routes-generated/*.shapes.md` |
| Cần Express stub router để mount tạm | `routes-generated/*.merged.js` |
| Cần đọc logic Vue app gốc | `decompiled/modules/deobfuscated.js` (grep) |
| Cần biết DB schema | `docs/DATABASE.md` |
| Cần biết .NET → Node port progress (archived) | `docs/MIGRATION_PLAN.md` |

## Pipeline reverse-engineering bundle TikFinity

Đây là quy trình mất ~1 ngày người để cào hết shape từ TikFinity gốc, đã làm xong và document đầy đủ:

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: HAR CAPTURE                                            │
│  Chrome DevTools → Network → Preserve log + Disable cache       │
│  → click qua các feature → Save all as HAR with content         │
│  → 4 sessions × 1-5 phút = 427 MB HAR, 6,071 raw requests       │
│  Output: captures/tikfinity.zerody.{one,two,three,four}.har     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: MERGE + DEDUPE                                         │
│  Script: scripts/decompile/merge-har.js                         │
│  - Bỏ static assets (.css, .js, .png, fonts, .woff, .ico)       │
│  - Bỏ 3rd-party (PostHog, Sentry, GA, Cloudflare RUM, ads)      │
│  - Dedupe theo (method, host, path), keep newest                │
│  - Group by category (identity, auth, config, tts, widget, ...)│
│  Output: 228 unique endpoints, 13 categories                    │
│          routes-generated/tikfinity.zerody.four.merged.{js,md,json}│
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: EXTRACT CONTRACTS                                      │
│  Script: scripts/decompile/extract-contracts.js                 │
│  - Recursive type tree mỗi endpoint quan trọng                  │
│  - Sample body (full nếu < 6 KB, truncated nếu lớn)             │
│  - Note auth requirement, query example, captured time          │
│  Output: docs/API_CONTRACTS.md (72 KB, 712 lines)               │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: BUNDLE DECOMPILE                                       │
│  Tool: webcrack (npx)                                           │
│    npx webcrack downloads/combo/modules.js -o decompiled/modules │
│    npx webcrack downloads/combo/app.js -o decompiled/app        │
│  - Decode string array obfuscation (188K transforms)            │
│  - Flatten control-flow (44K transforms)                        │
│  - Unmangle structural mangling, inline dead code               │
│  Output: decompiled/{app,modules}/deobfuscated.js (~1 MB readable)│
│  Limitation: var names vẫn _0x... (semantic mangling)            │
│              nhưng string + control flow READABLE                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: LIVE INSTRUMENTATION                                   │
│  Inline IIFE trong backend-node/src/templates/blockScript.txt   │
│  Off-by-default. Bật trong DevTools:                            │
│    localStorage.setItem('tf-instrument','1'); location.reload() │
│  - Log mọi fetch + XHR call (method, URL, body, status, snippet)│
│  - Push vào window.__tfCallLog (cap 2000)                       │
│  - Download JSON: window.__tfDumpCallLog()                      │
│  Output: tf-call-log-<timestamp>.json (gitignored)              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: DOCUMENT (this folder)                                 │
│  - BUNDLE_CALL_FLOW.md: boot sequence + per-feature flows       │
│  - API_CONTRACTS.md: shape + sample mỗi endpoint                │
│  - SKILL.md: pre-edit checklist + 6 traps đã từng gặp           │
│  - README.md (file này): index                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Số liệu công sức đã đầu tư

| Tài sản | Kích thước | Effort tạo ra |
|---|---|---|
| 4 HAR captures | 427 MB | ~30 phút clicking DevTools |
| 228 unique endpoint catalogue | 7.5 MB JSON | merge-har.js (auto) |
| `API_CONTRACTS.md` shape doc | 72 KB / 712 lines | extract-contracts.js (auto) |
| `BUNDLE_CALL_FLOW.md` | ~22 KB / 520 lines | hand-written |
| `SKILL.md` | ~14 KB / 200 lines | hand-written |
| Decompiled Vue app | 945 KB readable | webcrack (auto, ~30s) |
| Decompiled bridge | 153 modules | webcrack (auto, ~30s) |
| Auto-instrumentation hook | ~3 KB injected | hand-written, off-by-default |
| 3 reusable scripts | ~600 lines | hand-written |

**Total**: từ "đoán shape" (mất 1-3 ngày debug mỗi feature) → "tra docs là biết" (mất 5 phút).

## Re-generate khi bundle update

Khi TikFinity gốc push bundle mới (`downloads/combo/{app,modules}.js` thay đổi):

```bash
# 1. Capture HAR mới từ tikfinity.zerody.one (Chrome DevTools)
mv ~/Downloads/tikfinity.zerody.one.har captures/

# 2. Re-run pipeline
node --max-old-space-size=6144 scripts/decompile/merge-har.js
node scripts/decompile/extract-contracts.js
npx webcrack downloads/combo/modules.js -o decompiled/modules
npx webcrack downloads/combo/app.js -o decompiled/app

# 3. Diff vs old để biết bundle đã đổi gì
git diff docs/API_CONTRACTS.md           # field nào server gốc đổi shape?
git diff decompiled/modules/deobfuscated.js  # function nào bundle thêm/sửa?

# 4. Update local handlers theo diff
# 5. Test bundle boot, không reload loop, UI render đúng
```

## Mọi script đều có README riêng

| Script | Doc |
|---|---|
| `scripts/decompile/merge-har.js` | comment đầu file + `scripts/decompile/README.md` |
| `scripts/decompile/extract-contracts.js` | comment đầu file |
| `scripts/decompile/har-to-stubs.js` | comment đầu file + `scripts/decompile/README.md` |

## Liên hệ context

Để hiểu sâu hơn mỗi phần:

- **Tại sao project tồn tại + tech stack**: `PROJECT.md` (root)
- **Quy tắc viết code + risk tier + backup**: `CLAUDE.md` (root)
- **9 voice picker gates đã giải quyết**: `CLAUDE.md §14`
- **Hot reload table**: `CLAUDE.md §11`
- **Verification matrix**: `CLAUDE.md §12`
