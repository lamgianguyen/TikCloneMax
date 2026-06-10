# QA Team — đội QA agent thường trực (M-QA-HARNESS)

> Đội chuyên test thường trực cho TikFinity Clone. Built mission **M-QA-HARNESS (2026-06-08)**. Đội này **không tan rã sau mission** — nó là chủ sở hữu vĩnh viễn của `qa/` + workflow `qa-sweep`. Mỗi feature mới / mỗi bundle update → đội này mở rộng coverage, KHÔNG viết lại từ đầu.
>
> Doctrine nền: [CLAUDE.md §2.1](../../CLAUDE.md) (1 team, full roster, full-Opus max-thinking). Vận hành hằng ngày: harness [`qa/run-all.js`](../../qa/run-all.js).

---

## Roster (full Opus, max-thinking — file ownership tuyệt đối)

Mỗi agent sở hữu ĐÚNG 1 file. Không 2 agent nào chạm cùng file (CLAUDE.md §2.1 #3).

| Agent | Owns (1 file) | Lo phần gì |
|---|---|---|
| **Commander** | `qa/lib/*`, `qa/registry.js`, `qa/run-all.js`, `package.json`, `CLAUDE.md`, `.claude/workflows/qa-sweep.js` | Orchestrate, foundation lib, source-of-truth registry, wiring. Tự assess → pick → spawn → reconcile |
| **Engineer-API** | `qa/modules/api-contract.test.js` | L1 — execute `registry.api` (+`mutating`): status + `jsonHas` mọi endpoint backend |
| **Engineer-Socket** | `qa/modules/socket-relay.test.js` | L2 — handshake + `distributeEvent` relay (whitelist positive + negative leak test) |
| **Engineer-Widget** | `qa/modules/widget-smoke.test.js` | L3 — static (external-libs / debug-spam / null-guard) + GET `/widget` serve |
| **Engineer-Perf** | `qa/modules/perf-sample.test.js` | RAM/CPU sampling + parse log (STRETCH-DIAG / error / reload churn) vs THRESHOLDS |
| **Engineer-LiveID** | `qa/modules/live-id-finder.js` | Tìm 1 TikTok ID đang live (user account → fallback always-on) cho real-event test |
| **Engineer-GateHealth** | `qa/modules/gate-health.test.js` | L4 — needle-in-bundle drift flag (`registry.gates`). FLAG, không block |
| **Librarian** | `qa/README.md`, `qa/BUNDLE_UPDATE.md`, `.codex/team/qa-team.md` | Doc operator-guide + bundle-update runbook + file này |
| **Lỗi-Historian** | (Commander-kept) | `lib/results.js` auto-ghi block QA-AUTO vào FIXLOG/TEST_STATUS. Mở mission đọc FIXLOG, đóng mission cập nhật |

> Tính đến 2026-06-08: `api-contract` / `socket-relay` / `widget-smoke` đã build; `perf-sample` / `gate-health` / `live-id-finder` chưa → harness SKIP chúng (run-all.js degrade file thiếu thành SKIP, không lỗi).

---

## Cách TRIỆU TẬP đội (going forward)

### (a) Fast path — `node qa/run-all.js`

Harness **CHÍNH LÀ** daily-driver của đội đã tự động hoá. Không cần spawn agent. 1 lệnh chạy mọi module hiện có, ghi kết quả vào TEST_STATUS/FIXLOG/json. Dùng cho:
- Kiểm tra hồi quy sau bất kỳ thay đổi backend/widget.
- Smoke nhanh trước commit.
- Re-run xác nhận PASS sau khi fix 1 FAIL (vòng 3-strike).

```powershell
node qa/run-all.js                  # full
node qa/run-all.js --only api,socket # subset
node qa/run-all.js --mutating        # + destructive (coinjar reset…)
```

### (b) Deep path — workflow `qa-sweep`

Khi cần **mở rộng / sửa MODULE** (bundle vừa update, hoặc feature mới cần coverage, hoặc 1 module crash), Commander chạy:

```js
Workflow({ name: 'qa-sweep' })
```

→ Commander re-spawn các Engineer (theo roster trên) để:
- Bundle update: chạy [BUNDLE_UPDATE.md](../../qa/BUNDLE_UPDATE.md) — RE pipeline + Engineer-GateHealth vá needle drift trong `registry.gates`, các Engineer khác xác nhận L1–L3 vẫn pass.
- Feature mới: Engineer phụ trách thêm spec vào `registry.js` (api/socket/widget/gates) — thường KHÔNG cần code mới (xem README "How to EXTEND").
- Module mới (KIND of check mới): 1 Engineer viết file `qa/modules/*` theo MODULE CONTRACT, Commander thêm vào `MODULES[]` của `run-all.js`.

> `.claude/workflows/qa-sweep.js` do Commander sở hữu (chưa build tính đến 2026-06-08 — wire trong mission này). Tới khi có, deep path = Commander spawn thủ công theo roster.

---

## Doctrine

- **Full-Opus max-thinking** mọi agent (CLAUDE.md §2.1) — bundle obfuscated + multi-layer state, surface read dễ lừa.
- **File ownership tuyệt đối** — registry (Commander) là core diff-able; module (Engineer) là executor. Tách rõ, spawn parallel cho scope độc lập.
- **Kết quả auto-record** — `lib/results.js` ghi block QA-AUTO vào TEST_STATUS (run mới nhất) + FIXLOG (FAIL). Mỗi FAIL = 1 strike (CLAUDE.md §6.1). Fix xong → ghi root-cause vào entry FIXLOG **thường** (ngoài block) rồi re-run xác nhận PASS.
- **Gate-health drift drives the bundle-update loop** — L4 chỉ FLAG, không block. Drift = anchor bundle dời → vá needle, không sập sweep. Đây là cơ chế "sống sót qua bundle update".
- **DURABILITY** — test lớp ỔN ĐỊNH (L1 API / L2 socket / L3 widget của TA), bundle internals chỉ chạm qua needle flag. Bundle mới → L1–L3 nguyên si, chỉ chỉnh L4.

---

## Cross-links

- [qa/README.md](../../qa/README.md) — operator's guide: run / extend / MODULE CONTRACT / thresholds.
- [qa/BUNDLE_UPDATE.md](../../qa/BUNDLE_UPDATE.md) — runbook bundle obfuscated mới (8 bước).
- [CLAUDE.md §0.0](../../CLAUDE.md) — docs cross-link map · §2.1 agent team doctrine · §6.1 FIXLOG 3-strike · §Gate 22 RE pipeline · §Gate 35 overlay/widget realtime.
- [current_mission.md](current_mission.md) — mission M-QA-HARNESS declare + roster gốc.
