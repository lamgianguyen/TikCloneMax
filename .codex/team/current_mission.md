# Current Mission

## Mission ID
M-2026-06-23-export-import-review — Adversarial re-review setup export/import (sau fix CRITICAL importActions)

**Commander:** current session (Opus 1M) · **Tier:** Large (cross-cutting: bundle RE + backend + Electron)

## Objective
User: "chạy agent team coi lại mấy phần đó kĩ kĩ". Soi lại toàn bộ surface setup export/import:
1. Verify fix vừa thêm `POST /api/importActions` ([import-actions.js](../../backend-node/src/routes/import-actions.js)) ĐÚNG contract bundle + an toàn + không regression Actions table.
2. Soi các phần CHƯA verify: media trong `.tfc` (audioUrl/imageUrl uploaded có round-trip?), sound persist path, events/timer remap, export no-op (settings.restored), backup.js ProfileId orphan.
3. Tìm BẤT KỲ backend dependency khác trong doImport/doExport có thể 404 (importMedia, uploadMedia, …).

## Roster (full Opus inherit, max-thinking, ~9 agent via Workflow)
| Agent | Vùng |
|---|---|
| Reviewer-FixCorrectness | import-actions.js vs bundle doImport contract (mapping keys, overwrite, profileId, response shape) |
| Reviewer-SecurityRegression | SQLi/txn/auth/loopback + regression Actions table (share với /api/rest/action), profileId divergence |
| Scout-ImportCompleteness | re-trace doImport 3358-3565 — mọi api call khác có thể 404? sound/media/events path |
| Scout-ExportBackup | export no-op edge + backup.js ProfileId orphan + media trong .tfc (URL vs file) |
| Reconciler (Opus) | dedup + verdict + minimal fixes |
| Verifier × N | adversarial refute-by-default per issue HIGH/CRITICAL |

## Status — ✅ DONE (2026-06-23)
- [x] Mission declared
- [x] Workflow `review-export-import` chạy (wf_a89bd81f-faf, 8 agent: 4 lens → reconcile → adversarial verify)
- [x] Reconcile + verified findings
- [x] Commander report — **KHÔNG sửa code:** fix `import-actions.js` adversarial-verified CORRECT; cả 3 caveat (profileId blob, size cap, dup id) đều REFUTED là non-issue (xem current_state.json + FIXLOG). backup.js gaps = UI-less, defer.

**Outcome:** `adversariallyVerifiedReal: []` — zero actionable defect trong fix. Per YAGNI/surgical-change → giữ nguyên code. Pending: user restart + UI round-trip test.

## Backups
- `backend-node/src/index.js.bak-2026-06-23-pre-importactions` (từ fix trước)
