# Current Mission

## Mission ID
M-QA-HARNESS (2026-06-08) — Self-maintaining QA team + harness

**Commander:** current session (Opus 4.8) · **Tier:** Large (durable infra, multi-subsystem)

## Objective
Build a permanent, self-maintaining QA harness + agent team that auto-tests EVERY feature,
records errors+fixes, measures perf (RAM/CPU/lag/crash), finds a live TikTok ID for real-event
tests, and **survives bundle updates** (extends, never restarts from scratch).

## Why (user directive 2026-06-08)
> "tạo 1 đội ngũ agent chuyên test, ghi lỗi cách fix... auto hết mọi tính năng... sau này file
> bundle mã hoá phiên bản mới vẫn BỔ SUNG chứ không phải mỗi lúc code mỗi khác... tự làm tự kiểm
> duyệt tự tạo module test... tìm id đang live, test mọi chức năng, coi lag/crash/đồng bộ giao
> diện/ram/cpu/hiệu năng... làm project chạy không lỗi. xài full agent."

## Durability principle (the differentiator)
Test the **STABLE contract layers**, not obfuscated bundle internals:
- L1 backend HTTP API — OUR backend → stable.
- L2 Socket.IO relay/event layer — OUR socket-manager → stable.
- L3 widget standalone HTML — OUR widget files → semi-stable.
- L4 bundle integration — thin DOM probes + **gate-health** that *flags drift* instead of breaking.

New obfuscated bundle → L1–L3 unchanged; L4 runs RE pipeline (Gate 22) + diff → reports which
Gates broke. Runbook: `qa/BUNDLE_UPDATE.md`.

## Roster (full Opus, max-thinking)
| Agent | Owns (one file each) |
|---|---|
| Commander | `qa/lib/*`, `qa/registry.js`, `qa/run-all.js`, package.json, CLAUDE.md, `.claude/workflows/qa-sweep.js` |
| Engineer-API | `qa/modules/api-contract.test.js` |
| Engineer-Socket | `qa/modules/socket-relay.test.js` |
| Engineer-Widget | `qa/modules/widget-smoke.test.js` |
| Engineer-Perf | `qa/modules/perf-sample.test.js` |
| Engineer-LiveID | `qa/modules/live-id-finder.js` |
| Engineer-GateHealth | `qa/modules/gate-health.test.js` |
| Librarian | `qa/BUNDLE_UPDATE.md`, `qa/README.md`, `.codex/team/qa-team.md` |
| Lỗi-Historian | Commander-kept (results.js auto-writes FIXLOG/TEST_STATUS blocks) |

File ownership absolute — no two agents touch the same file.

## Status — ✅ DONE (2026-06-08)
- [x] Mission declared
- [x] Foundation (Commander) — qa/lib + registry + run-all, all node --check PASS
- [x] Modules (team) — 6 modules, 8 full-Opus agents parallel, all node --check PASS
- [x] qa-sweep workflow — `.claude/workflows/qa-sweep.js`
- [x] Integrated + sweep green — 59 PASS / 27 FAIL (real findings) / 30 SKIP, exit-coded
- [x] Wired — package.json (`npm run qa`), CLAUDE.md §0.0, TEST_STATUS/FIXLOG auto-blocks, memory

**Outcome:** see `.codex/team/current_state.json::m_qa_harness`. 27 FAIL = real pre-existing
issues the harness surfaced (21 widget external-CDN + 6 unguarded settings.isPro). Offered to
user: fix 6 null-guards (low-risk) + plan CDN localization (High-Risk, known-DEFERRED).

## Backups
N/A — all-new files under `qa/`. Edits to package.json/CLAUDE.md are additive (append section).
