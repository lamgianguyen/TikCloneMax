# Current Mission

## Mission ID
M-REVIEW-FLOW (2026-06-10) — Full clone-flow review (read-only audit)

**Commander:** current session (Opus/Fable) · **Tier:** Large (cross-cutting audit, multi-subsystem)

## Objective
Review toàn bộ luồng clone xem "có gì không ổn":
boot/serve → auth/ALL-PRO → TikTok connect/realtime relay → widget/overlay settings chain
→ actions/points client-side contract → DB/REST verb coverage → QA harness health + doc drift.

**READ-ONLY mission** ~~chỉ báo cáo findings~~ → **NÂNG QUYỀN (user directive 2026-06-10): "thấy cái nào sai cứ sửa thẳng luôn, toàn quyền ở project này"** — sau khi review confirm findings, Commander triển khai fix phase:
- Backup trước mọi high-risk file (§5), one change at a time (§1.11), verify sau mỗi fix.
- Fix theo thứ tự CRITICAL → HIGH → MEDIUM (low-risk trước trong cùng severity).
- Ghi FIXLOG + TEST_STATUS khi đóng mission. User sẽ review code sau.

## Roster (full Opus inherit, max-thinking, ~11 agents via Workflow)
| Agent | Vùng (read-only) |
|---|---|
| Lỗi-Historian | FIXLOG.md + TEST_STATUS.md — known dead-ends, OPEN items, strikes |
| Scout-Boot | electron/main.js, src/index.js, middleware/*, templates blockScript/earlyCss |
| Scout-AuthPro | routes/me.js, key-auth.js, auth, services/jwt.js, routes/tts.js — ALL-PRO invariants |
| Scout-Realtime | routes/tiktok.js, services/tiktok-bridge.js, socket-manager.js — Gate 35, race/reconnect |
| Scout-WidgetOverlay | routes/widget.js, widget-defaults, widget-settings-cache, settings — settings→preview chain |
| Scout-ActionsPoints | routes/actions.js, points.js, notifications.js, services/points.js — verb coverage + double-fire |
| Scout-DB-REST | db models/migrations + remaining routes vs COMPLETE_ENDPOINT_INDEX |
| Scout-QA-Docs | qa/ harness vs staged bundle captures/bundle-new-2026-06/, TEST_STATUS OPEN, doc drift |
| Reconciler (Opus) | dedup + cross-check vs Historian + conflict resolution |
| Verifier × N | adversarial refute-by-default per consolidated finding |

## Status — ✅ DONE (2026-06-11)
- [x] Mission declared
- [x] Workflow review-clone-flow chạy (wf_16f80415-bf9, 29 agent → 18 confirmed / 2 refuted)
- [x] Reconciliation + verified findings
- [x] **Fix phase: 18/18 finding fixed** (1 CRITICAL + 8 HIGH + 9 MEDIUM) — xem [FIXLOG.md](../../FIXLOG.md) entry [2026-06-11]
- [x] Verify: node --check 18/18 + require-smoke 13/13 + serializeConfigJson 11/11 + backend boot + full QA sweep (api 45/0, socket 35/0, gate 53/0)
- [x] FIXLOG + TEST_STATUS (QA-AUTO blocks tự ghi) cập nhật

**Outcome:** 25 sweep FAIL = 21 RC-6 CDN (known-open) + 3 chain.db (DB-path drift standalone) + 1 eventcarousel (refuted EISDIR) — KHÔNG regression. 2 refuted: eventcarousel-EISDIR (Express tự guard), bridge-broadcast-asymmetry (no consumer). Backups: actions/index/tiktok-bridge + 4 widget `.bak-2026-06-11-*`. Cần user restart Electron để áp + runtime-verify (double-fire/disconnect/notifications/action-form).

## Backups
N/A — read-only audit, không edit file ngoài .codex/team/*.
