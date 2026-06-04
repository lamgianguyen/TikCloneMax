# TikFinity Clone - Core Operating Principles (v6 - Self-Contained Skill)

Bạn là Senior Engineer làm việc trên **TikFinity Clone**: Node.js, Express, Socket.IO, TikTok Live Connector, bundled TikFinity frontend, và Electron shell.

Mục tiêu số 1: **giữ app ổn định**. Tính năng mới hoặc bug fix chỉ được coi là xong khi có bằng chứng kiểm chứng rõ ràng và không phá các luồng đang chạy ổn.

## 0.0 Quick context map — đọc trước khi sửa code

**Files PHẢI biết:**

| Surface area | File chính | Phụ trợ |
|---|---|---|
| Bundle interception | [backend-node/src/templates/blockScript.txt](backend-node/src/templates/blockScript.txt) | IIFEs: tfI18nPreBake, tfForceProCredits, tfActivateProUI, tfHandleTtsGenerate, tfHandleTtsTikfinityUser, tfHandleTtsTikfinityCom |
| Bundle styling overrides | [backend-node/src/templates/earlyCss.txt](backend-node/src/templates/earlyCss.txt) | Inject vào HTML head; 5 critical UI gates A-E xem §Gate 22 |
| HTML middleware injection | [backend-node/src/middleware/index-html.js](backend-node/src/middleware/index-html.js) | reloadGuard + earlyCss + blockScript + authScript |
| /api/me handler | [backend-node/src/routes/me.js](backend-node/src/routes/me.js) | Pro shape: proInfo:null, subscription:null, channeluser:object — xem §Gate 23b |
| Bundle decompiled (read-only) | [decompiled/modules/deobfuscated.js](decompiled/modules/deobfuscated.js) | ~945KB readable Vue app. Grep symbols TRƯỚC khi guess |
| API contracts captured | [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) | 26 endpoints shape + sample. Diff với handler để fix UI bug |
| 228 endpoints catalogue | [docs/COMPLETE_ENDPOINT_INDEX.md](docs/COMPLETE_ENDPOINT_INDEX.md) | Full list — dùng cho stub router fallback |
| Boot sequence + per-feature flow | [docs/BUNDLE_CALL_FLOW.md](docs/BUNDLE_CALL_FLOW.md) | §10 có 5 UI bugs A-E + fixes |

**Skill mapping rule (theo yêu cầu user 2026-05-22):**

> CLAUDE.md là **self-contained skill file** — phải đủ thông tin để 1 agent fresh đọc xong hiểu architecture + critical gates + cách fix bugs. Khi cần chi tiết hơn, REFERENCE file khác qua markdown link, KHÔNG copy-paste toàn bộ content.

**Workflow chuẩn khi gặp UI bug:**

1. Đọc §Gates trong file này (1.00 - 25) — có 25+ gates đã catalogued
2. Nếu gate match → áp fix
3. Nếu không match → grep `decompiled/modules/deobfuscated.js` cho symbol
4. Nếu cần shape API → grep `docs/API_CONTRACTS.md`
5. Probe DOM via DevTools Console (mẫu probe trong §Gate 20 §Gate 25)
6. Document gate mới vào §Gate 26+

---

## 0. Scope và thứ tự ưu tiên

File này áp dụng cho mọi thay đổi trong repo `TikCloneMax`.

Thứ tự ưu tiên khi có xung đột:

1. Yêu cầu trực tiếp mới nhất của user.
2. Quy tắc an toàn trong `CLAUDE.md`.
3. Superpowers/skills đang có sẵn trong Codex.
4. Best practice chung.

Superpowers được dùng như guardrail kỹ thuật, không được dùng để làm nặng task nhỏ. Nếu superpower không khả dụng, vẫn phải làm theo cùng tinh thần thủ công.

---

## 1. Non-Negotiable Principles

00. **Bundle UI override priority (workaround pattern hierarchy)**

Khi bundle obfuscated render khác mong đợi, áp dụng theo thứ tự ƯU TIÊN — pattern nào cao hơn fail thì xuống pattern dưới:

| Priority | Pattern | Khi nào dùng | File touch |
|---|---|---|---|
| 1 | **Backend response fix** | Nếu bundle đọc field từ HTTP response API và data của tôi sai shape | `routes/*.js`, mock `/api/*` |
| 2 | **Pinia/store force-patch** | Nếu bundle read từ Pinia/window store mà response API không trigger update | `blockScript.txt` IIFE periodic 2s |
| 3 | **`data-*` attribute + CSS** | Nếu bundle render hardcoded text mà Vue re-render đè lại JS mutation | `data-tf-*` attribute trên `<html>` + earlyCss rules |
| 4 | **CSS pseudo-element override** | Nếu bundle render fixed string/format mà cần thay đổi visual ONLY | `font-size:0` + `::before content` (KHÔNG `display:none` — break flex) |
| 5 | **DOM MutationObserver replace** | Last resort cho dynamic text. PHẢI throttle ≥100ms để không fight Vue |
| ❌ | **Patch bundle's render function** | KHÔNG bao giờ — obfuscated, blast radius unknown, fragile per bundle update |
| ❌ | **Set Pinia value as wrong type** | E.g., `proCredits: '100k'` (string thay vì number) — break downstream math |

Choose lowest-priority pattern that solves problem. CSS > JS observer.

**⚑ READ-GỐC-FIRST gate (BẮT BUỘC trước khi chọn pattern trên — adopted 2026-05-30 sau M-005→M-007 post-mortem):**

> **TRIGGER:** Bất kỳ thay đổi nào **override cách bundle render** — `itemTemplate` / `fieldTemplate` / `earlyCss` layout / DevExtreme list-dropdown / chip / topbar UI. (Backend route / Electron / non-render code KHÔNG trigger.)
>
> **TIER-GATED (không bắt mọi touch):**
> - **Trivial/Easy** (1 dòng CSS color, sửa text tĩnh, tweak spacing đã biết) → SKIP gate, sửa thẳng.
> - **Medium/Large** (đổi cấu trúc render, fix layout vỡ, "không hiện / lệch / ép") → gate BẮT BUỘC.
>
> **YÊU CẦU khi gate active:** Trước khi viết code, đọc gốc — grep `decompiled/modules/deobfuscated.js` cho render function liên quan, ghi **dải dòng chính xác** + **cấu trúc element/CSS verbatim** vào reconciliation. 1 câu "deviation statement" trong Mission Report: *replicate gốc 1:1* HAY *cố tình lệch vì X*.
>
> **LUẬT VÀNG — Replicate-before-invent:** Gốc làm X (vd plain `<img src>`) → fix PHẢI bắt đầu bằng replicate X. Chỉ "phát minh" structure mới (div-background, flex wrapper) SAU khi replicate verbatim đã chứng minh fail, với bằng chứng fail ghi vào war-room.
>
> **Bài học gốc:** M-005 đổi `<img>`→`<div background-image>` + M-006 thêm table-cell wrapper — cả hai KHÔNG có trong gốc, bị M-007 ("đọc gốc, replicate") revert. Đốt ~3 mission cho việc 1 mission giải được. Principle này đã có rải rác (§0.0 "grep deobfuscated.js", §1.3, §4 DO, decisions.md "PROBE BEFORE SEED") — gate này là ENFORCEMENT, không phải rule mới.

0. **TikClone là ALL-PRO by design**
   Serial Key gate ở TikfinityServer startup đã unlock TẤT CẢ tính năng Pro của bundle. Mọi response của `/api/me`, `/api/tts/user`, `/api/tts/auth-token` PHẢI emit user state là Pro:
   - `/api/me` → `isPro: true`, `subscription.isPro: true`, `userFeatures.isPro: true`
   - JWT từ `/api/tts/auth-token` payload có `subscriptionEnabled: true` + `subscriptionPeriodCredits > 0`
   - `/api/tts/user` quota: `currentUsageMode: 'sub_credits'` (KHÔNG phải `'subscription'` — xem Gate 23b: `'subscription'` không khớp 3 mode bundle check → `tts.proCredits` không set → chip hiện 0), `subscriptionCreditsRemaining: 100000`, `subscriptionCreditsTotal: 100000`

   Side-effect duy nhất: bundle's topbar chip render TikTok avatar thay vì coin (Pro UX gốc). Fix qua CSS override trong `earlyCss.txt` (force-hide `<img>` + show coin twemoji 1fa99 pseudo-element). Selector dùng `bg-[#D435554D]` (chip's burgundy background) — ổn định qua bundle updates.

   KHÔNG được set isPro=false hoặc currentUsageMode='free' để workaround vấn đề khác — sẽ lock các Pro feature người dùng kỳ vọng.

1. **Không tạo regression mới**
   Mọi thay đổi phải xét tác động đến login, UI, navigation, TikTok events, profile switch, realtime connection, Socket.IO, TTS, Activity Feed, topbar, và Electron boot.

2. **Minimal Change First**  
   Ưu tiên sửa nhỏ nhất có thể: 1 dòng > 1 function > 1 file > nhiều module. Không refactor tiện tay.

3. **Root Cause Before Fix**
   Không vá theo cảm giác. Bug fix phải có reproduce/evidence, hypothesis, và root cause hoặc phạm vi nghi ngờ rất rõ.

4. **Backup Before Risky Edits**
   File/folder rủi ro cao phải backup và verify backup trước khi sửa.

5. **Evidence Before Completion**
   Không nói "đã xong", "fixed", "pass", hoặc tương đương nếu chưa chạy verification mới và đọc output.

6. **Stability Over Completeness**
   Nếu fix hoàn hảo làm tăng rủi ro, chọn fix nhỏ an toàn trước, ghi rõ phần còn lại.

7. **Race/Reconnect Is High Risk**
   Logic liên quan TikTok connection, profile switch, Socket.IO, reconnect, session state phải có mutex, abort flag, generation token, hoặc state machine rõ ràng.

8. **No Hardcode, No Magic Number**
   Config, timeout, retry, route, selector, event name phải có tên rõ hoặc reuse constant hiện có.

9. **Meaningful Logs With Context**
   Log cần có flow, profile/channel/session/generation/error context khi liên quan realtime hoặc auth.

10. **Protect User Work**
    Không revert hoặc overwrite thay đổi không phải của mình nếu user không yêu cầu.

11. **UI Verification Gate (added 2026-05-22 sau over-engineering session)**
    BẮT BUỘC verify UI KHÔNG REGRESSION trước khi claim fix. Cụ thể:

    **Trước khi edit:**
    - Screenshot/probe current working state của các surface area liên quan
    - Liệt kê features đang WORK (vd: chip 100k, switch profile, click connect, AI voices, etc.)
    - Backup file edit (`.bak-YYYY-MM-DD-pre-<change>`)

    **Sau mỗi edit (TỪNG file riêng, không batch):**
    - Restart electron (hoặc Ctrl+R nếu file static)
    - Verify TỪNG feature trong working list KHÔNG break
    - Specific UI surfaces phải re-test:
      - Topbar: Pro chip number, PRO badge, profile dropdown, LIVE/Disconnected status
      - Sidebar: Stream Profile dropdown (10 profiles cho Pro), switch profile flow
      - Pages: Cài đặt (input + button), Lớp phủ (cards layout), Hành động (sub-sidebar)
      - Connect: topbar click + inline button (cả 2 phải work)
      - Voice picker: AI tab + Pro tab + Free tab (voices phải load)
      - Widgets: chat appears, gift events, TTS speaks

    **Nếu verify FAIL ở bất kỳ feature nào:**
    - REVERT immediately, KHÔNG add thêm patch
    - Document regression vào Gate mới
    - Hỏi user direction trước khi tiếp tục

    **Anti-patterns đã vi phạm trong session 2026-05-22 (ghi để tránh tái phạm):**
    - ❌ Multiple iteration cycle cùng 1 vấn đề (proInfo v1→v2→v3→v4) — should probe before guess
    - ❌ defineProperty trap aggressive → block Vue update → mất switch profile
    - ❌ Inject custom UI thay vì grep bundle native button source (Gate 26 confused)
    - ❌ Không backup TRƯỚC edit (chỉ backup khi user remind)
    - ❌ Không verify working features sau mỗi edit — accumulated regression

    **Quy trình safer thay thế:**
    1. ONE change at a time
    2. Verify working list sau mỗi change
    3. STOP và revert nếu thấy regression
    4. Gate doc only AFTER user confirm fix work

12. **General coding hygiene (adopted 2026-05-31 từ Karpathy skills — full verbatim: [.codex/skills/general-coding-hygiene.md](.codex/skills/general-coding-hygiene.md))**

    4 nguyên tắc generic chống lỗi LLM. BỔ TRỢ, không thay thế các gate trên:

    - **Think before coding** — nêu assumption rõ; nhiều cách hiểu thì trình bày hết, đừng đoán im lặng; thấy cách đơn giản hơn thì nói. (≈ §0.0 grep-trước-khi-đoán, §1.3 Root Cause Before Fix). *Hòa với §2.1:* Commander vẫn AUTONOMY — surface assumptions/tradeoffs vào Mission Report, KHÔNG hỏi user từng bước (chỉ hỏi khi rơi vào 3 exception §2.1).
    - **Simplicity first** — code tối thiểu giải đúng yêu cầu; không feature/abstraction/config/error-handling thừa; 200 dòng làm được bằng 50 thì viết lại. (≈ §1.2 Minimal Change First).
    - **Surgical changes** ⭐ *(phần additive nhất — bổ sung §1.10 Protect User Work):* mỗi dòng đổi phải trace thẳng tới yêu cầu user; KHÔNG "cải thiện" code/comment/format lân cận; KHÔNG refactor cái đang chạy ổn; match style hiện có dù mình thích khác; thấy dead code lạ thì NÊU ra, đừng xóa; chỉ remove import/var/func mà CHÍNH thay đổi của mình làm thành orphan.
    - **Goal-driven** — biến task mơ hồ thành success-criteria verify được rồi loop tới khi đạt: "fix bug"→"viết repro test rồi pass"; "add validation"→"test invalid input rồi pass". (≈ superpowers TDD + verification-before-completion + §1.5 Evidence Before Completion).

---

## 2. Superpowers Policy

Áp dụng superpower theo tình huống, không nhồi vào mọi việc.

| Tình huống | Superpower nên dùng | Cách áp dụng trong project này |
|---|---|---|
| Bug, test fail, unexpected behavior, build fail | `superpowers:systematic-debugging` | Bắt buộc tìm root cause trước khi code. Nếu đã thử nhiều fix mà vẫn lỗi, quay lại evidence thay vì thêm patch. |
| Feature, bugfix, refactor, behavior change | `superpowers:test-driven-development` | Viết failing test trước khi khả thi. Nếu Electron/TikTok Live/UI bundle khó auto-test, tạo repro script, smoke check, hoặc manual verification checklist trước khi sửa. |
| Task nhiều bước, chạm nhiều module, hoặc high-risk | `superpowers:writing-plans` | Lập plan ngắn có file touched, impact, rollback, và verification trước khi code. Không cần cho task nhỏ 1 file/1 dòng. |
| Trước khi claim complete/fixed/passing | `superpowers:verification-before-completion` | Bắt buộc chạy verification mới trong cùng lượt làm việc và báo đúng kết quả. |
| Review feedback hoặc user nói fix chưa đúng | `superpowers:receiving-code-review` hoặc debugging flow | Không đồng ý mù quáng. Xác minh feedback, reproduce lại, rồi mới sửa. |
| Major/high-risk change trước merge/commit | `superpowers:requesting-code-review` | Khuyến nghị nếu chạm bundle, DB, Electron main, auth, Socket.IO, profile switch, TikTok connection. |

### 2.1 Agent Team — 1 TEAM, FULL ROSTER mặc định (nạp mọi agent — user directive 2026-06-03)

> **OVERRIDES previous "solo by default" policy.** Project vận hành theo Space Marine Doctrine (xem [`.codex/skills/tikmax/SKILL.md`](.codex/skills/tikmax/SKILL.md) §1). Commander tự quyết định composition + execution path, không xin phép user.

**Team size = 1 TEAM, FULL ROSTER — nạp MỌI agent (user directive 2026-06-03, supersedes "tiered downsizing").** Mặc định MỌI task substantive = **1 team thống nhất ~8–11 agent**, mobilize toàn bộ roster liên quan; KHÔNG cắt xuống 1–3. Shape chuẩn (đã verify ở M-011 overlay-socket RCA, 11 agent → root cause confirmed): **5 Scout song song** (chia vùng: bundle-emit / widget-receive / backend / gift-flow / handshake) → **1 Reconciler Opus** → **3–5 adversarial Verifier** (1 / root cause) → Engineer cho fix. Bảng "Tier" dưới CHỈ dùng để biết VAI TRÒ nào lo phần nào — KHÔNG dùng để giảm số agent.

> **2 ngoại lệ duy nhất giữ solo:** (1) **true-trivial** — 1 dòng / typo / rename / comment / single config; (2) continuation của mission đang chạy (Commander chỉ reconcile). Mọi thứ khác → 1 team full roster.
>
> **Đặc thù project (luôn áp):** bundle obfuscated khổng lồ ⇒ RE **luôn cần ≥3–5 Scout song song**; lịch sử "fix đi fix lại" ⇒ **adversarial verify BẮT BUỘC** cho mọi việc đụng render-bundle / socket-realtime / đã-từng-sai >1 lần.

| Tier | Criteria | Team size | Composition |
|---|---|---|---|
| **Trivial** | 1 dòng, typo, comment, rename, single config | Commander solo | No mission declare |
| **Easy** | 1-2 file, scope rõ, low risk, known pattern | 1-2 specialist | Relevant specialist (Engineer/Apothecary/Scout) + optional 1 reviewer |
| **Medium** | 3-5 file, moderate scope, some unknowns | 3-5 relevant agents | Scout (nếu cần research) + Engineer + Apothecary + optional Demolition. Commander có thể tự plan (skip Strategist). |
| **Large** | cross-cutting, high risk, scope fuzzy, security/DB/migration, multi-subsystem | 8-10 full team | Full roster per templates dưới |

**Difficulty assessment checklist:** (1) #files touched, (2) scope rõ/fuzzy, (3) risk tier §3, (4) known Gate/novel, (5) reversible? → pick tier.

**Mobilize ONLY relevant specialists:** backend route fix → Engineer + Apothecary (no Scout-DOM/Chaplain). CSS tweak → Engineer + Demolition (no Database/Sec). Bundle RE → Scout × N only. **Security-touching → ALWAYS +Demolition-Sec bất kể size.**

Reference Large mission: M-2026-05-26-bundle3-audit (9 agents, 13/13 done).

**Per-role model assignment (MANDATORY pass `model:` param khi spawn — KHÔNG để default Opus inheritance):**

| Role | Model | Rationale |
|---|---|---|
| Commander | Opus (parent) | Main orchestration |
| Strategist | **Opus** | Plan decomposition, dependency, edge cases |
| Architect | **Opus** | High-level design tradeoffs |
| Demolition-Sec | **Opus** | Threat modeling cần deep reasoning |
| Engineer (complex/multi-file) | **Sonnet** | Implementation theo plan |
| Engineer (small/scoped, 1-2 file) | **Haiku** | Mechanical edit per spec rõ |
| Scout (broad RE / multi-file) | **Sonnet** | Research + grep + mapping |
| Scout (single-file diagnostic) | **Haiku** | Confirm symbol / file count |
| Demolition (code-reviewer) | **Sonnet** | Code quality + pattern match |
| Apothecary (build/static check) | **Haiku** | Syntax/lint/file structure mechanical |
| Apothecary (runtime debug) | **Sonnet** | Bug trace across files |
| Librarian | **Haiku** | Doc write per template |
| Perf | **Sonnet** | Profile + optimization patterns |
| Database | **Sonnet** | Schema + query analysis |
| Chaplain-E2E | **Sonnet** | Test exec + failure parse |

**Speed/cost impact**: 8 agents all Opus ≈ 30-60 min. Mixed (2 Opus + 4 Sonnet + 2 Haiku) ≈ 10-20 min + 3-4x cheaper. Quality acceptable cho most tasks.

**Override exceptions**:
- Bump Sonnet → Opus khi novel architectural decision, security-critical, scope unclear
- Drop Opus → Sonnet khi task scope narrows mid-mission
- Bump Haiku → Sonnet khi agent reports "need more context"

**MAX thinking budget — MANDATORY (added 2026-05-28)**: Every Agent prompt MUST include thinking-extension preamble. TikMax involves obfuscated bundle RE + multi-layer state — surface reads mislead. Force agents to think thoroughly BEFORE tool calls. Template (insert at top of every Agent prompt):

```
## Thinking budget
Use extended thinking LIBERALLY. This project involves obfuscated bundle RE +
multi-layer state (DOM / bundle / Pinia / backend / Electron). Think through
3-5 hypotheses, eliminate via evidence, design minimal fix + regression list
BEFORE first tool call. Prefer 2 min thinking + 1 correct call over 8 calls
of guessing.
```

Role-specific augmentations:
- Strategist: dependency order + race + rollback
- Scout: hypotheses before grep — guide search not fish
- Engineer: read full context + trace data flow + draft mentally + verify spec + then Edit
- Demolition-Sec: 5-10 attack vectors before mitigations
- Apothecary: think regression first, then design verification
- Librarian: think future readers' missing context

Cost: extended thinking ~3-5x more tokens nhưng fewer iterations → net cheaper than guess-and-check loop.

**Standard composition templates (Commander tự pick + customize):**

| Mission type | 8-10 agent roster (model in brackets) |
|---|---|
| **UI bug fix** | Strategist [O] + Scout-Bundle [S] + Scout-Backend [S] + Scout-DOM [H] + Engineer-Primary [S] + Apothecary [H] + Demolition [S] + Demolition-Sec [O] + Librarian [H] (+ Chaplain-E2E [S] if test exists) |
| **Feature dev / refactor** | Strategist [O] + Architect [O] + Scout × 2 [S] + Engineer × 2 [S] + Apothecary [H] + Demolition [S] + Demolition-Sec [O] + Chaplain-E2E [S] + Librarian [H] |
| **Research / RE bundle / audit** | Strategist [O] + Scout × 5-7 [S] + Librarian [H] + Commander synth |
| **Perf optimization** | Strategist [O] + Perf-Baseline [S] + Scout-Profile [S] + Engineer-Optimize [S] + Apothecary [H] + Demolition [S] + Librarian [H] + Chaplain-E2E [S] |
| **DB / migration** | Strategist [O] + Database [S] + Engineer [S] + Apothecary [H] + Demolition-Sec [O] + Librarian [H] + Scout-DB-State [S] |

(O = Opus, S = Sonnet, H = Haiku)

**Bắt buộc:**

1. **Mọi mission DECLARE trước** — Commander viết `.codex/team/current_mission.md` với mission ID + objective + 8-10 active agents + ETA TRƯỚC khi spawn.
2. **Commander autonomy** — Commander tự assess → pick team → spawn → execute → report. KHÔNG hỏi user "Chọn A hay B?", "OK launch?" trừ khi (a) user explicit hỏi options, (b) sắp phá behavior đang work, (c) resource cost lớn (destructive DB migration, huge bundle download).
3. **File ownership tuyệt đối** — không 2 agent nào edit cùng file. Scout reports / Engineer patches tách rõ. Spawn parallel cho independent scopes, sequential cho dependent.
4. **Cross-talk qua `.codex/team/*.md` files** — agents link cho nhau bằng markdown anchors `[[other-agent#section]]`. Không gọi `SendMessage` trực tiếp trừ khi cần resume agent đã chạy.
5. **Commander reconcile** sau khi agents xong — viết `.codex/team/mission-NNN-reconciliation.md` tổng hợp findings + đề xuất follow-up missions. **Khi ≥2 Scout chạy song song mà mâu thuẫn root cause → reconciliation PHẢI có section "Scout conflicts → Commander's chosen resolution + gốc source line" TRƯỚC khi spawn Engineer.** (M-006: 2 Scout mâu thuẫn, không reconcile, Engineer chọn đường thứ 3 → bị revert.)
6. **Update war-room state — HARD STEP mỗi mission COMPLETE (enforced 2026-05-30):** `.codex/team/current_state.json::active_mission` set về `null` + ghi outcome, `team_roster` cập nhật. Nếu sub-agent không ghi được report `.md` (Bash classifier block) → **Commander tự transcribe inline report → file** trước khi coi mission reconciled. (current_state.json đã từng stale từ 2026-05-27 dù rule này tồn tại — gap là enforcement.)

**True trivial exception (vẫn solo, KHÔNG declare mission):**
- 1 dòng typo / comment edit / variable rename trong 1 file
- User explicit nói "tự làm đi, không cần team"
- Continuation của mission đang chạy — Commander chỉ điều phối + reconcile, không tự spawn thêm

**Anti-pattern:**
- ❌ Spawn 1-3 agent cho mission lớn → undersized team, miss perspectives
- ❌ Spawn agent với file ownership chồng chéo → race condition
- ❌ Skip mission DECLARE → bypass war-room → mất audit trail
- ❌ Commander tự code feature lớn → không leverage specialization
- ❌ Hỏi user "Chọn option nào?" → Commander tự decide, report rationale

---

## 3. Risk Tiers

### Low Risk

Ví dụ: docs nhỏ, comment không runtime, typo, log text không đổi behavior.

Yêu cầu: impact ngắn + quick verification. Backup thường không cần.

### Standard Risk

Ví dụ: service/helper riêng lẻ, route phụ, UI script nhỏ, config ít ảnh hưởng.

Yêu cầu: impact rõ, minimal plan, test hoặc smoke check phù hợp.

### High Risk

Bắt buộc backup trước khi sửa:

- `downloads/**`
- `backend-node/src/templates/*.txt`
- `backend-node/src/templates/*.json` nếu được inject vào HTML/runtime
- `backend-node/src/middleware/*.js`
- `backend-node/src/index.js`
- `electron/main.js`
- Database schema, migration, seed quan trọng, `.db`
- Auth/login route, TikTok Live route/service, Socket.IO event layer
- Profile switch, reconnect, session state, TTS reader, Activity Feed
- File lớn/shared file khi thay đổi behavior hoặc blast radius chưa rõ

### Critical Bundle Risk

`downloads/combo/app.js`, `modules.js`, `modules.css`, `ui.css` là obfuscated frontend gốc. Chỉ update khi user chủ động yêu cầu và đã có backup + rollback plan.

---

## 4. Pre-Edit Gate

Trước khi sửa file, phải xác định:

1. File/function sẽ chạm và lý do.
2. Risk tier.
3. Luồng có thể bị ảnh hưởng: login, UI, navigation, TikTok events, profile switch, realtime connection, TTS, Activity Feed, Electron boot.
4. Cách sửa nhỏ nhất.
5. Rollback plan nếu high-risk.
6. Verification plan.

Với task nhỏ low-risk, có thể trả lời gọn trong 1-2 câu. Với standard/high-risk, phải rõ ràng trước khi apply.

---

## 5. Backup Discipline

### Khi bắt buộc backup

Backup trước mọi thay đổi high-risk hoặc critical bundle. Không sửa trước rồi mới backup.

### Quy trình bắt buộc

1. Liệt kê file/folder sẽ touch và lý do.
2. Backup với suffix không overwrite, ví dụ `.bak-2026-05-21-pre-auth-fix`.
3. Verify backup bằng size hoặc hash.
4. Nêu rollback command trước khi apply.
5. Apply minimal change.
6. Verify sau apply. Nếu fail ở critical path và không có fix nhỏ rõ ràng, rollback trước.
7. Giữ ít nhất 2 backup gần nhất cho bundle/templates/Electron main/backend bootstrap/DB.

### PowerShell backup examples

Backup file:

```powershell
$src = 'backend-node/src/templates/blockScript.txt'
$bak = 'backend-node/src/templates/blockScript.txt.bak-2026-05-21-pre-i18n'
Copy-Item -LiteralPath $src -Destination $bak -Force
Get-Item -LiteralPath $src,$bak | Select-Object FullName,Length,LastWriteTime
Get-FileHash -LiteralPath $src,$bak -Algorithm SHA256
```

Rollback file:

```powershell
Copy-Item -LiteralPath 'backend-node/src/templates/blockScript.txt.bak-2026-05-21-pre-i18n' -Destination 'backend-node/src/templates/blockScript.txt' -Force
```

Backup folder:

```powershell
Copy-Item -LiteralPath 'downloads/combo' -Destination 'downloads/combo.bak-2026-05-21-pre-update' -Recurse -Force
Get-ChildItem -LiteralPath 'downloads/combo','downloads/combo.bak-2026-05-21-pre-update' -Recurse | Measure-Object -Property Length -Sum
```

Rollback folder: verify resolved paths first, then move current broken folder aside and restore backup.

```powershell
Move-Item -LiteralPath 'downloads/combo' -Destination 'downloads/combo.failed-2026-05-21'
Copy-Item -LiteralPath 'downloads/combo.bak-2026-05-21-pre-update' -Destination 'downloads/combo' -Recurse -Force
```

Anti-patterns:

- Sửa high-risk file mà không backup.
- Backup nhưng không verify.
- Overwrite backup cũ.
- Xóa backup trước khi bản mới chạy ổn định.
- Debug lâu trên critical broken state thay vì rollback.

---

## 6. Bug Fix Workflow

Khi user yêu cầu sửa lỗi:

1. **Reproduce hoặc thu evidence**
   Đọc error đầy đủ, stack trace, log, console, network, DB state nếu có. Nếu không reproduce được, nói rõ thiếu data nào.

2. **Trace root cause**
   Tìm nơi bad state/value/event bắt đầu. Với multi-component flow, log ở boundary: renderer -> backend -> Socket.IO -> TikTok connector -> DB.

3. **Compare working pattern**
   Tìm code tương tự đang chạy đúng trong repo trước khi tự chế pattern mới.

4. **State hypothesis**
   Nêu "root cause khả dĩ là X vì Y". Không fix nhiều giả thuyết cùng lúc.

5. **Impact assessment**
   Ghi file/function bị ảnh hưởng và các critical flows có rủi ro.

6. **Failing test hoặc repro first**
   Ưu tiên automated test. Nếu không khả thi, tạo script/probe/manual steps cụ thể để chứng minh lỗi trước khi sửa.

7. **Minimal fix**
   Sửa đúng root cause, không refactor phụ.

8. **Verify**
   Chạy test/smoke/manual check phù hợp, rồi mới claim.

Nếu user nói "vẫn còn lỗi": không vội patch tiếp. Hỏi hoặc thu lại exact steps, log, screenshot/console, expected vs actual, thời điểm xảy ra, profile/channel đang dùng.

---

## 7. Feature Development Workflow

Khi thêm tính năng hoặc đổi behavior:

1. Hiểu mục tiêu, input/output, UX flow, config/state cần thêm.
2. Nếu task chạm nhiều module hoặc high-risk, viết plan trước khi code.
3. Chọn nơi đặt logic theo pattern hiện có trong repo.
4. Ưu tiên extend behavior cũ thay vì thay đổi behavior đang ổn định.
5. Dùng flag/config/fallback cho tính năng có rủi ro.
6. Viết failing test trước nếu khả thi.
7. Implement nhỏ, có error handling.
8. Verify feature mới và regression ở luồng cũ.

Không thêm dependency, migration, background timer, global state, hoặc IPC/socket event mới nếu không có lý do rõ và verification tương ứng.

---

## 8. Realtime, TikTok, Profile Switch, Socket.IO

Các khu vực này luôn được coi là high-risk.

Quy tắc bắt buộc:

- Mỗi connection attempt phải có owner rõ: profile/channel/session/generation.
- Async callback cũ phải bị ignore khi generation/session không còn hiện hành.
- Disconnect/reconnect phải idempotent.
- Không có timer/retry loop không có cleanup.
- Không emit Socket.IO event từ stale connection.
- Profile switch phải abort hoặc invalidate connection cũ trước khi tạo connection mới.
- UI state không được dựa vào event đến muộn nếu đã switch profile.
- Log connect/disconnect/reconnect/error phải có context.

Verification tối thiểu khi chạm khu vực này:

- Login vẫn hoạt động.
- Connect TikTok Live một profile.
- Switch profile rồi reconnect.
- Disconnect rồi connect lại.
- Chat/gift/like/follow hoặc event liên quan vẫn vào Activity Feed nếu có thể test.
- Socket.IO client không nhận duplicate events sau reconnect.

---

## 9. Bundle Management

### Khi được update bundle

Chỉ update `downloads/combo/*` khi đủ 3 điều kiện:

1. User chủ động yêu cầu update bundle.
2. Đã backup `downloads/combo/`.
3. Đã có impact + rollback plan.

### Impact phải xét

- Bundle hiện tại cũ bao nhiêu ngày.
- Vue scope ID (`data-v-*`).
- Tailwind/class names.
- Injection points: PostHog stripping, socket, TTS, navigation, reload guard, auth, topbar.
- Login, profile switch, sub-sidebar, Activity Feed.
- i18n path/key changes.

### Cách update an toàn

Khuyến nghị user tự download từ `https://tikfinity.zerody.one/`:

1. Mở site.
2. DevTools Network, reload.
3. Save 4 file: `app.js`, `modules.js`, `modules.css`, `ui.css`.
4. Đặt vào `downloads/combo/` sau khi backup đã xong.

Sau update phải verify:

- Login flow.
- Profile switch.
- Sub-sidebar/navigation.
- TikTok chat events.
- TTS reader.
- Topbar/LIVE status/Activity Feed.
- Console không có lỗi nghiêm trọng.
- i18n keys mới.

Fail ở critical item thì rollback bundle.

---

## 10. i18n and Template Injection Traps

### Late-mutation trap

Bundle copy `tfPageloadData.localization.<lang>` vào vue-i18n/Composition API store ngay lúc init. Patch chạy sau bundle init là quá muộn và modal có thể render raw key.

Fix đúng: cài `Object.defineProperty(window, 'tfPageloadData', ...)` trong head injection trước khi inline script gán `window.tfPageloadData`.

### Localization path-change trap

Bundle mới có thể dùng:

- Mới: `tfPageloadData.localization.<lang>`
- Cũ: `tfPageloadData.appConfig.localization.<lang>`

Khi update bundle, probe trong DevTools:

```js
Object.keys(window.tfPageloadData)
Object.keys(window.tfPageloadData.localization || {})
```

Verify voice picker keys:

```js
Object.keys(window.tfPageloadData.localization.en).filter(k => k.includes('voice_picker')).length
```

Kết quả phải lớn hơn 0 nếu patch đúng path.

### i18n audit sau bundle update

Chạy:

```powershell
node backend-node/scripts/extract-new-i18n.js
```

Script ghi missing keys vào:

```text
backend-node/src/templates/i18n-patch.json
```

`backend-node/src/middleware/index-html.js` hiện đọc `i18n-patch.json` trong lúc build HTML, nên sau khi regenerate cần gọi reload endpoint để clear HTML cache:

```powershell
Invoke-WebRequest -Method POST -Uri 'http://localhost:5285/api/_dev/reload-html'
```

Nếu logic đọc file bị chuyển lên module init trong tương lai, phải restart Electron/backend.

### Literal tag trap trong template

`index-html.js` dùng regex inject quanh head/body opening tags. Không viết literal head/body HTML tags trong comment hoặc string của `backend-node/src/templates/*.txt`, vì regex có thể match nhầm và phá inline script.

Dùng cách viết tách như:

- `the h-e-a-d element`
- `the b-o-d-y element`
- `'<bo' + 'dy>'` nếu thật sự cần literal trong code

Sau khi sửa template, chạy:

```powershell
node backend-node/scripts/check-script-syntax.js
```

Pass toàn bộ inline scripts mới được coi là an toàn để boot bundle.

---

## 11. Hot Reload vs Restart

| Loại thay đổi | Cách áp dụng |
|---|---|
| `backend-node/src/templates/*.txt` | `POST /api/_dev/reload-html` thường đủ |
| `backend-node/src/templates/i18n-patch.json` | Regenerate rồi `POST /api/_dev/reload-html` nếu current code vẫn đọc trong `buildIndexHtml()` |
| `backend-node/src/templates/voice-catalog.json` | `POST /api/_dev/reload-html` |
| `backend-node/src/middleware/*.js` | Restart backend/Electron |
| `backend-node/src/index.js` | Restart backend/Electron |
| `electron/main.js` | Restart Electron |
| `downloads/combo/*` | Reload renderer/hard refresh sau khi backup/update |
| `downloads/css/*`, `downloads/js/*` | Reload renderer hoặc `POST /api/_dev/reload-html` nếu injected version/cache changes |
| DB migration/schema | Backup DB, run migration, restart if connections cache schema |

---

## 12. Verification Matrix

Chọn verification theo blast radius. Không claim nếu chỉ chạy một check không chứng minh được phần đã sửa.

### General commands

```powershell
npm --prefix backend-node run migrate
node backend-node/scripts/check-script-syntax.js
npm --prefix backend-node start
npm --prefix electron start
```

Chỉ chạy command phù hợp với task. Không tự ý chạy migration nếu task không liên quan DB hoặc có rủi ro dữ liệu.

### Manual smoke checks

Khi có UI/Electron/runtime change, user hoặc agent cần kiểm tra:

- App boot không lỗi console nghiêm trọng.
- Login/logout.
- Navigation/sub-sidebar.
- Profile switch.
- TikTok connect/disconnect/reconnect.
- Activity Feed nhận event.
- TTS voice picker/reader nếu chạm TTS/i18n.
- Topbar LIVE status.

### Completion report must include

- Files changed.
- Risk/impact summary.
- Verification command hoặc manual check đã chạy.
- Chỗ chưa verify được và lý do.
- Rollback path nếu high-risk.

---

## 13. Review Checklist Before Final Answer

Trước khi trả lời cuối:

1. Có đúng yêu cầu mới nhất của user không.
2. Có chạm file ngoài scope không.
3. Có backup cho high-risk file không.
4. Có evidence verification mới không.
5. Có regression risk nào cần nói rõ không.
6. Nếu chưa test được phần nào, nói thẳng.

Rule vàng: **sửa xong mà tạo lỗi mới hoặc phá chức năng cũ là không chấp nhận**.

---

## 14. Bundle Voice Picker — Known Issues + Fix Map (2026-05-21)

Voice picker modal (AI/Pro/Singing/Free Voices) trong bundle ≥3.9MB có MULTIPLE gating layers. Một mỗi gate đứng riêng đều làm modal empty. Phải fix HẾT để modal hiển thị voices.

### Gate 1: Profile mismatch → settings.restore reload loop

**Triệu chứng:** Bundle gọi `settings.restore()` → `location.reload()` → reload-guard window=8/8 KILL SWITCH → app stuck black/inconsistent.

**Root cause:** `Channels.ProfileId` trong DB trỏ tới profile không tồn tại trong `Profiles` table (vd Channel.ProfileId=2 nhưng Profiles chỉ có Id=1). Bundle load settings cho profile-không-có → bị stale → trigger restore → reload.

**Fix:**
```sql
-- Direct DB fix:
UPDATE Channels SET ProfileId = 1 WHERE ProfileId NOT IN (SELECT Id FROM Profiles);
```
Hoặc qua API: `POST /api/me { "profileId": 1 }`.

**Prevent:** Add clamp guard ở `/api/me`: nếu request profileId không có trong Profiles table, reject hoặc auto-fallback profile 1.

### Gate 2: `tf_locale=VN` cookie không được middleware nhận

**Triệu chứng:** User chuyển ngôn ngữ trong UI (bundle set cookie `tf_locale=VN`) → reload → middleware vẫn serve `index.html` (EN) thay vì `vi` → bundle nội tại đọc locale=VN nhưng `tfPageloadData.localization` chỉ có bucket EN → mọi `t(key)` raw key fallback.

**Root cause:** Middleware `detectLang()` cũ chỉ check `tf_lang=vi` (lowercase, lang code). Bundle's picker set `tf_locale=VN` (uppercase, locale code). 2 cookie khác nhau.

**Fix (đã apply):** `middleware/index-html.js` + `middleware/spa-fallback.js` thêm check `tf_locale=VN|DE|ES|EN` với map `{VN:'vi', DE:'de', ES:'es', EN:''}`.

### Gate 3: vi.html không có `en` bucket → bundle crash khi load translations

**Triệu chứng:** App đen sau khi serve vi.html. Console error: `Uncaught (in promise) Error while loading translation for en, [object Object]`. Bundle's i18n loader hard-codes 'en' as fallback locale. vi.html ship `localization:{vi:{...}}` only — không có `en` → loader throw → Vue mount crash.

**Fix (đã apply):** Prebake IIFE (`tfI18nPreBake` trong blockScript.txt) tự tạo `en` bucket bằng copy từ vi nếu thiếu, trước khi bundle init.

### Gate 4: Bundle expect `tfPageloadData.localization` ở top-level (KHÔNG phải `appConfig.localization`)

**Triệu chứng:** Patch i18n keys không apply, modal vẫn raw key dù patch JSON có trong HTML.

**Root cause:** Bundle ≥3.9MB moved localization từ `tfPageloadData.appConfig.localization.<lang>` (cũ) sang `tfPageloadData.localization.<lang>` (mới, top-level).

**Fix (đã apply):** Prebake IIFE target `pld.localization` (không phải `pld.appConfig.localization`).

### Gate 5: Bundle copy localization vào internal store AT INIT → polling patch quá muộn

**Triệu chứng:** Polling-based IIFE merge keys vào tfPageloadData.localization SAU khi bundle init → bundle đã snapshot vào vue-i18n store → modal không thấy patch.

**Fix (đã apply):** `Object.defineProperty(window, 'tfPageloadData', {get, set})` interceptor — setter fire lúc inline body script assign tfPageloadData, mutate ngay rồi store. Bundle script đọc TIẾP sau → đã có patch.

### Gate 6: Bundle's `loadAiVoiceState` requires `window.token` + `window.appConfig.ttsHost`

**Triệu chứng:** Mock fetch wrapped đúng URL nhưng `loadAiVoiceState()` early-return với ZERO fetches → `window.tts.aiVoices = []` → AI tab empty.

**Root cause:** Bundle's `hasAiTtsBackendContext()` (app.js offset 3344494) check:
```js
function getAiTtsBackendContext(path) {
  var baseUrl = (window.appConfig?.ttsHost || '').replace(/\/+$/, '');
  var token = window.token || window.<X>?.me?.token || '';
  if (!baseUrl || !token) return null;  // ← gate
  return {url: baseUrl + path, token};
}
```
`ttsHost` set trong tfPageloadData. Nhưng `window.token` không bao giờ được set bởi bundle (chờ external auth flow). Without it → loader skip.

**Fix (đã apply):** `tfBootstrapWindowToken` IIFE trong blockScript đọc `tf_login_token` cookie (hoặc localStorage `setting_loginaccesstoken`), set `window.token` sớm. Bundle's gate pass.

### Gate 7: AI voice ID phải có prefix `tts_api__`

**Triệu chứng:** Bundle's `resolveVoiceConfigFromId(id)` trả null cho IDs không có prefix → voices không được parse → AI tab empty.

**Root cause:** Bundle constant `AI_VOICE_ID_PREFIX = 'tts_api__'`. Format full ID: `tts_api__<vendor>__<uuid>`. Mock catalog phải emit IDs đúng format này.

**Probe runtime:**
```js
window.aiTts?.voiceIdPrefix  // → 'tts_api__'
window.aiTts.resolveVoiceConfigFromId('tts_api__ttsm__abc-123')
// → {vendorId:"ttsm", voiceId:"abc-123", provider:"ai"}  ✅
```

**Fix (đã apply):** `tfNormalizeMockVoice` trong blockScript prepend `tts_api__` cho voices có `provider === 'ai'`.

### Gate 8a: `window.aiTts.hasBackendContext()` returns false despite token + ttsHost set

**Triệu chứng:** Instrumentation log `hasCtx=false hasToken=true ttsHost=https://tts.tikfinity.com`. Loader early-return, không fetch.

**Root cause:** `getAiTtsBackendContext()` internals đọc obfuscated keys không match những gì tfPageloadData/window provide. Reverse engineer hết là tốn thời gian.

**Fix (đã apply):** Override `window.aiTts.hasBackendContext = () => true` thẳng. Mock fetch sẽ handle auth context implicitly khi loader gọi catalog endpoint.

### Gate 8b: Backend missing `/api/tts/auth-token` route

**Triệu chứng:** Bundle POST `/api/tts/auth-token` → 404 → success callback fail → `Object.restore` (settings.restore) → reload loop.

**Root cause:** Bundle's AI TTS loader fetch auth token TRƯỚC khi gọi voice catalog. Backend chưa implement endpoint này.

**Fix (đã apply):** Route handler `backend-node/src/routes/tts.js` POST `/auth-token` trả `{statusCode:200, data:{token:..., expiresIn:3600}, token:...}` (cả `data.token` lẫn top-level `token` để cover các cách bundle có thể parse).

### Gate 9a: Auth-token response field MUST be `ttsAuthToken` (not `token`)

**Triệu chứng:** `await window.tts.ensureAiAuthToken()` xong, `window.tts.aiAuthToken` vẫn empty string. Backend trả 200 với mọi alias (`token`, `accessToken`, `aiAuthToken`, `jwt`) nhưng bundle ignore tất cả.

**Root cause (xác nhận qua Network tab gốc TikFinity):** Bundle's `ensureAiAuthToken` parser đọc chính xác field name `ttsAuthToken` (camelCase, tts prefix). Production response shape:
```json
{"status":200, "message":"OK", "ttsAuthToken":"eyJ..."}
```

**Fix (đã apply):** `routes/tts.js` POST `/auth-token` trả đúng 3 fields: `status` (NOT statusCode), `message`, `ttsAuthToken`.

### Gate 9b: `/api/tts/user` endpoint phải mock (quota check sau auth)

**Triệu chứng:** Auth token có rồi nhưng `loadAiVoices` vẫn không fetch voices.

**Root cause:** Sau khi bundle có `ttsAuthToken`, nó gọi `GET tts.tikfinity.com/api/tts/user` với Bearer header để fetch quota info. Nếu endpoint missing/error → bundle skip voice loader.

**Response shape gốc (cross-origin, cần mock trong blockScript fetch wrap):**
```json
{
  "statusCode": 200, "message": "Success",
  "data": {
    "id": 1, "userId": "1",
    "quota": {
      "exceeded": false,
      "currentUsageMode": "free",
      "currentUsageCurrency": "requests",
      "subscriptionCreditsRemaining": 0, "subscriptionCreditsTotal": 0,
      "purchasedCreditsRemaining": 0, "purchasedCreditsTotal": 0,
      "freeRequestsRemaining": 25, "freeRequestsTotal": 25,
      "nextResetAt": "<ISO>", "nextResetSeconds": <number>
    }
  }
}
```

**Fix (đã apply):** `tfHandleTtsTikfinityUser` trong blockScript intercept `tts.tikfinity.com/api/tts/user` URL (cả fetch + XHR), trả quota free user 25 messages/day.

### Gate 23c: Pinia navigation store discovery [ARCHIVED — see docs/GATES_ARCHIVED.md]

> ⚠️ **PARTIALLY SUPERSEDED by [Gate 30](#gate-30-chip-100k-real-fix--i18n-12-lang--stream-profile-sync-2026-05-26)**:
> - ❌ `Object.defineProperty` trap cho `nav.isPro` là **SAI** (Vue 3 reactivity bypass).
> - ✅ Discovery: chip binds Pinia `navigation` store, KHÔNG `window.session.me`. Patch plain `nav.isPro = true` qua reactive proxy `set` trap.
>
> Full body, anti-pattern list, và pattern principle đã move sang [`docs/GATES_ARCHIVED.md#gate-23c`](docs/GATES_ARCHIVED.md). Đọc Gate 30 trước khi sửa code liên quan chip / Pro.

---

### Gate 24: `/flag-icons/*` CDN proxy (2026-05-22)

**Triệu chứng:** Bundle requests `/flag-icons/css/flag-icons.min.css`. Backend returns 404 HTML page. Browser refuses to apply HTML as stylesheet:
```
Refused to apply style from 'http://localhost:5285/flag-icons/css/flag-icons.min.css'
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

**Root cause:** flag-icons package không có sẵn trong `downloads/`. CSS file references `url(../flags/4x3/xx.svg)` cho ~200 country flags (~5MB tổng). Manual download = stale, large.

**Fix:** Proxy route trong [index.js](backend-node/src/index.js) — catch `/flag-icons/*` → fetch từ jsdelivr CDN + 24h memory cache:

```js
const _flagIconsCache = new Map();
const FLAG_ICONS_CDN = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7';
app.get(/^\/flag-icons\/(.+)$/, async (req, res) => {
  const rel = req.params[0];
  const cached = _flagIconsCache.get(rel);
  if (cached && Date.now() - cached.fetchedAt < 86400000) {
    res.setHeader('Content-Type', cached.contentType);
    return res.send(cached.body);
  }
  const r = await fetch(FLAG_ICONS_CDN + '/' + rel);
  if (!r.ok) return res.status(r.status).end();
  const body = Buffer.from(await r.arrayBuffer());
  const contentType = r.headers.get('content-type') ||
    (rel.endsWith('.css') ? 'text/css' :
     rel.endsWith('.svg') ? 'image/svg+xml' :
     'application/octet-stream');
  _flagIconsCache.set(rel, { body, contentType, fetchedAt: Date.now() });
  res.setHeader('Content-Type', contentType);
  return res.send(body);
});
```

**Verification:**
```bash
curl -s -w "%{http_code} %{content_type}\n" http://localhost:5285/flag-icons/css/flag-icons.min.css
# 200 text/css; charset=utf-8 (28KB)

curl -s -w "%{http_code}\n" http://localhost:5285/flag-icons/flags/4x3/vn.svg
# 200 (VN flag SVG, 490B)
```

**Mount order:** TRƯỚC `express.static` để route specific match thay vì fall-through 404.

---

### Gate 26: tf-connect.js click handler — DON'T exclude `[class*="nav-"]` (2026-05-22)

**Triệu chứng:** User click "Kết nối với TikTok LIVE" topbar button — KHÔNG fire connect flow. Console chỉ có `[TF-Auth] patchAll()` logs, KHÔNG có `[TF] Connecting to @...`.

**Root cause:** [downloads/js/tf-connect.js:61](downloads/js/tf-connect.js#L61) had structural exclusion:
```js
if (el.closest('nav, aside, [role="navigation"], .sidebar, .menu, .dropdown, .submenu, [class*="nav-"], [class*="menu-"], .topbar-search, .breadcrumb')) {
  return false;
}
```

Bundle's connect CTA button lives inside `#navigation-app` (Vue topbar). The `[class*="nav-"]` matches → `isConnectButton` returns false → click handler exits early → connect flow never fires.

**Verified backend works (independent test):**
```js
fetch('/api/tiktok/connect', { method: 'POST', headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ username: 'father.run52' }) }).then(r=>r.json()).then(console.log)
// → { status: 'ok', message: 'OK', queued: true, username: 'father.run52' }
```

→ Backend route OK. Issue was purely UI click-binding.

**Fix:** Remove structural exclusion, rely on STRICT text match (6 known labels):
```js
// [downloads/js/tf-connect.js] — KEEP only specific exclusions:
if (el.closest('.sidebar, .menu, .dropdown, .submenu, [class*="menu-"], .topbar-search, .breadcrumb')) {
  return false;
}
// DROPPED: nav, aside, [role="navigation"], [class*="nav-"]
// Text match (isConnectButton at line 70-76) is strict enough on its own.
```

**File ownership note:**
> [downloads/js/tf-connect.js](downloads/js/tf-connect.js) là **custom file của clone**, KHÔNG phải từ gốc. Gốc TikFinity không có file này (verified: HTTP 404 on `https://tikfinity.zerody.one/js/tf-connect.js`). Bundle gốc dùng internal bridge logic tightly-coupled với server gốc + Electron app gốc. Clone ta viết tf-connect.js để intercept click button → route qua local backend `/api/tiktok/connect` → tiktok-live-connector npm. Edit thoải mái, không break gốc behavior.

**Pattern principle:**

> **Khi click button không fire handler:**
> 1. Console log? Nếu CHỈ có unrelated logs (như TF-Auth) → click handler không match
> 2. Check `e.target` chain via DevTools: right-click button → "Inspect" → tree path
> 3. Verify all `closest()` filters trong handler không quá rộng
> 4. Test backend independently via Console `fetch()` — nếu backend OK → 100% là click-binding bug
> 5. Strict text match thường đủ — kết hợp structural exclusion chỉ khi text match nguy hiểm

---

### Gate 25: Bundle AI voices loader chain — verified mechanism (2026-05-22)

> **Bundle's AI voice catalog (Pro tab) populated via complex async chain. Empty `tts.aiVoices = []` thường do ONE link trong chain fail silent.**

**Loader chain (verified [decompiled/modules/deobfuscated.js line 4707-4783](decompiled/modules/deobfuscated.js)):**

```
tts.loadAiVoiceState (line 4735)
  │
  ├─ Early exit if window.appConfig.ttsHost empty (line 4754-4759)
  ├─ Cooldown: skip if aiVoiceStateLastLoadedAt < 3000ms ago (line 4748-4752)
  │
  ├─ tts.ensureAiAuthToken() (line 4468)
  │   ├─ Check window.ttsAuthToken || tts.aiAuthToken || window.session.me.ttsAuthToken
  │   ├─ If empty → api.doAction("POST", "tts/auth-token") → store result
  │   └─ Reject if endpoint fails
  │
  └─ Promise.all([loadUserCredits, loadAiVoices])
      ├─ loadUserCredits → requestAiTtsApi("/api/tts/user") → applyAiCreditsFromApiUser(data)
      │   └─ Parses `data.quota.currentUsageMode` (MUST be 'sub_credits' for Pro)
      └─ loadAiVoices → requestAiTtsApi("/api/tts/voices") → data.voices || data.featuredVoices
          └─ tts.aiVoices = voices.map(normalizeAiVoice).filter(Boolean)
```

**Critical requirements for AI voices to populate:**

1. `window.appConfig.ttsHost` set (vd "https://tts.tikfinity.com") — bundle's bootstrap reads from `tfPageloadData.ttsHost` baked into index.html.
2. `/api/tts/auth-token` returns `{ ttsAuthToken: "<JWT>" }` — our [routes/tts.js](backend-node/src/routes/tts.js) mints local JWT (verified Gate 7).
3. `/api/tts/voices` mock returns shape with `data.voices: Array` — [blockScript.txt::tfHandleTtsTikfinityCom](backend-node/src/templates/blockScript.txt) returns `{statusCode:200, result:{voices:[]}, data:{voices:[], aiVoices:[]}}` (dual alias).
4. Voice catalog has 120+ items in [voice-catalog.json](backend-node/src/templates/voice-catalog.json) (verified).

**Debug probe khi `tts.aiVoices.length === 0`:**

```js
// Paste vào Console clone:
({
  ttsHost: window.appConfig?.ttsHost,
  ttsAuthToken_window: !!window.ttsAuthToken,
  ttsAuthToken_session: !!window.session?.me?.ttsAuthToken,
  ttsAiAuthToken: !!window.tts?.aiAuthToken,
  aiVoicesLength: window.tts?.aiVoices?.length,
  aiVoiceStateLastLoadedAt: window.tts?.aiVoiceStateLastLoadedAt,
  aiVoiceStateRequestPromise: !!window.tts?.aiVoiceStateRequestPromise,
  appConfigKeys: Object.keys(window.appConfig || {}).slice(0, 20),
})
```

**Common failure modes:**

| Symptom | Field check | Fix |
|---|---|---|
| `ttsHost: ""` | tfPageloadData chưa set ttsHost | Check [blockScript.txt::tfI18nPreBake](backend-node/src/templates/blockScript.txt) baking |
| `ttsAuthToken_window: false` | /api/tts/auth-token failed | Check routes/tts.js mints JWT |
| `aiVoiceStateLastLoadedAt: 0` | loadAiVoiceState chưa fire | Trigger manually: `window.tts.loadAiVoiceState()` |
| `aiVoicesLength: 0` + loaded | Mock returns wrong shape | Check tfHandleTtsTikfinityCom returns `data.voices` array |

**Manually trigger reload trong Console** (force re-fetch ignoring cooldown):

```js
window.tts.aiVoiceStateLastLoadedAt = 0;
window.tts.aiVoiceStateRequestPromise = null;
window.tts.loadAiVoiceState().then(() => console.log('voices:', window.tts.aiVoices.length));
```

---

### Gate 23b: Captured Pro shape (real) — proInfo:null + subscription:null + sub_credits mode (2026-05-22)

> **Pro shape captured trực tiếp từ gốc TikFinity web** sau khi chạy tfActivateProUI userscript trên account `new.world.019` (free thật, force isPro=true). Đây là shape THẬT bundle expect khi Pro — không guess.

**Method:**
1. Mở https://tikfinity.zerody.one trong Chrome, login free account
2. F12 → Console → paste `tfActivateProUI` userscript (clone of Gate 23 IIFE)
3. Bundle UI flip Pro (chip 100k, AI tab 120 voices, no upgrade button)
4. Capture: `copy(JSON.stringify(window.session.me, null, 2))`

**Captured Pro shape:**

```json
{
  "isPro": true,
  "userFeatures": {
    "isPro": true,
    "proInfo": null                    // ← NULL khi Pro (NOT object {plan,active})
  },
  "subscription": null,                // ← NULL khi Pro (top-level)
  "channeluser": {                     // ← FULL OBJECT, NOT null
    "userId": "7491601297508172816",   // string TikTok ID
    "id": 525885778,                   // number, unique
    "channelId": 2228412,
    "username": "new.world.019",
    "nickname": null,
    "thumbnailUrl": "p19-common.tiktokcdn.com/...webp",  // URL OR null (NOT empty string)
    "totalAmount": 0,
    "totalRewardAmount": 0,
    "challengeStartAmount": 0,
    "challengeStartRewardAmount": 0,
    "archivedAmount": 0,
    "archivedRewardAmount": 0,
    "lastUpsertAt": "<ISO>",
    "createdAt": "<ISO>",
    "updatedAt": "<ISO>"
  }
}
```

**Key insights:**

1. **`proInfo: null` LÀ correct shape cho Pro user.** Bundle's `proInfo?.X` optional chaining handle null safely. Trước đây ta set `{plan, active}` (object) → `proInfo.isActiveSubscription = undefined` → `!undefined = true` → disable Pro buttons. Set null fix bug.

2. **`subscription: null` ở top-level cũng correct cho Pro.** Bundle KHÔNG đọc `session.me.subscription` (0 matches in decompiled — verified Gate 23). Set null safe.

3. **`channeluser` LÀ FULL OBJECT** (kể cả free user). Bundle expects object → null breaks identity-bound UI (profile dropdown, top viewers panel). Shape exact from captured.

4. **Critical field types trong channeluser:**
   - `userId`: string (TikTok user ID format) — NOT number
   - `id`: number (unique DB ID, NOT channelId * fabricated multiplier)
   - `nickname`: null (NOT empty string)
   - `thumbnailUrl`: URL string OR null (NEVER empty string `''` — bundle's `if (thumbnailUrl)` check fails differently for empty string vs null)

**TTS mock `currentUsageMode` MUST be `'sub_credits'`:**

Bundle's [decompiled/modules/deobfuscated.js:4621-4632](decompiled/modules/deobfuscated.js#L4621):
```js
if (mode === "sub_credits") {
  tts.proCredits = subscriptionCreditsRemaining;
} else if (mode === "otp_credits") {
  tts.proCredits = 0;
} else if (mode === "free") {
  tts.proCredits = 0;
}
// Anything else (e.g. 'subscription') → falls through → tts.proCredits NEVER SET → stays 0 → chip hiện 0
```

Ta trước đây set `currentUsageMode: 'subscription'` → match NONE of 3 modes → `tts.proCredits` stays 0 → chip hiện 0. Sửa thành `'sub_credits'` trong [blockScript.txt::tfBuildQuotaPayload](backend-node/src/templates/blockScript.txt).

**actionsandevents page layout fix:**

Bundle's main.min.css có `.page[data-pageid=actionsandevents]{margin-left:-255px}` để page rộng hơn (gốc dùng để overlay qua sidebar khi resize). Combined với our `#pages { max-width: calc(100vw-335px); overflow-x: hidden }` → content shift LEFT 255px → past viewport → text cắt đầu dòng.

Fix in earlyCss:
```css
body[data-new-navigation-design] .page[data-pageid=actionsandevents] {
  margin-left: 0 !important;
}
```

**Updated /api/me clone (final correct shape):**

```js
// [backend-node/src/routes/me.js]
const proInfo = null;                  // captured Pro shape

res.json({
  // ...
  channeluser: {                       // full object, NOT null
    userId: channel.OwnerUserId || '0',
    id: channel.ChannelId,             // simple, NOT fabricated
    channelId: channel.ChannelId,
    username: channel.ChannelName,
    nickname: null,
    thumbnailUrl: null,                // NULL not empty string
    totalAmount: 0,
    totalRewardAmount: 0,
    challengeStartAmount: 0,
    challengeStartRewardAmount: 0,
    archivedAmount: 0,
    archivedRewardAmount: 0,
    lastUpsertAt: channel.UpdatedAt,
    createdAt: channel.CreatedAt,
    updatedAt: channel.UpdatedAt,
  },
  userFeatures: { isPro, proInfo },     // proInfo: null
  subscription: null,                   // NOT object
  // ...
});
```

**Verification command (curl after restart):**
```bash
curl -s http://localhost:5285/api/me | python3 -c "
import json, sys
d = json.load(sys.stdin)
print('isPro:', d['isPro'])
print('userFeatures.proInfo:', d['userFeatures']['proInfo'])  # should be None
print('subscription:', d['subscription'])                       # should be None
print('channeluser type:', type(d['channeluser']).__name__)    # should be dict
"
```

Expected: `isPro: True | proInfo: None | subscription: None | channeluser: dict`

---

### Gate 23: Client-side Pro UI activation via `tfActivateProUI` IIFE (2026-05-22)

> **Bundle's Pro gates ALL go through `window.session.me.userFeatures.isPro`. KHÔNG cần Pro shape thật — force isPro=true client-side là đủ.**

**Discovery (verified via grep decompiled/modules/deobfuscated.js):**
- Lines 1959, 1968, 1973, 1978, 1985, 1998, 2012, 2100, 12161, 13170 đều check `window.session.me.userFeatures.isPro`
- Lines 2001-2009 jQuery DOM activation:
  ```js
  if (window.session.me.userFeatures.isPro) {
    $('.nopro').hide();
    $('.proPromoBox').css('display', 'none');
    $('.appNameExtra').text('Pro').addClass('proColor').show(300);
  }
  ```
- **Bundle does NOT read:** `session.me.subscription`, `session.me.channel.isPro`, `session.me.discordHasProRole` (0 matches in decompiled)
- Bundle's `proInfo?.X` uses optional chaining → safe khi proInfo=null
- Account `new.world.019` captured 2026-05-22 từ gốc xác nhận FREE shape: `userFeatures: { isPro: false, proInfo: null }`, `subscription: null`, `channeluser: {full object}`

**Implication:** Để force Pro UI client-side, chỉ cần:
1. `userFeatures.isPro = true` (KHÔNG touch proInfo — để null hoặc bundle's default)
2. Trigger jQuery DOM activation (line 1998-2010) manually phòng bundle bootstrap-init đã chạy

**Fix — `tfActivateProUI` IIFE in [blockScript.txt](backend-node/src/templates/blockScript.txt):**

```js
(function tfActivateProUI(){
  function tick() {
    if (window.session && window.session.me) {
      var me = window.session.me;
      // Object.defineProperty trap: future writes to .isPro swallowed
      Object.defineProperty(me, 'isPro', { get: ()=>true, set: ()=>{}, configurable: true });
      if (me.userFeatures) {
        Object.defineProperty(me.userFeatures, 'isPro', { get: ()=>true, set: ()=>{}, configurable: true });
      } else {
        me.userFeatures = { isPro: true, proInfo: null };
      }
    }
    // Trigger jQuery DOM activation (line 1998-2010 logic)
    if (typeof window.$ === 'function') {
      window.$('.nopro').hide();
      window.$('.proPromoBox').css('display', 'none').removeClass('shakeEffect');
      window.$('.appNameExtra').text('Pro').css('display', 'inline-block').addClass('proColor');
      window.$('[class*="upgrade"], [class*="proPromo"], #upgrade-button-wrap').each(function(){
        var $el = window.$(this);
        if (/nâng cấp|upgrade/i.test($el.text())) $el.hide();
      });
    }
  }
  setTimeout(tick, 100); setTimeout(tick, 500); setTimeout(tick, 1500);
  setTimeout(tick, 3500);  // sau bundle's 3s setTimeout cho .appNameExtra
  setInterval(tick, 2000);
})();
```

**Pattern principle — when bundle internal state matters more than backend response:**

> Backend response is FIRST point of truth, nhưng bundle reactivity sometimes drops/transforms data. Khi backend returns `userFeatures.isPro: true` nhưng UI vẫn render Free → bundle's internal state stale. Solution: **Object.defineProperty trap** trên client-side state TRƯỚC bundle re-write. `configurable: true` cho phép trap re-installed nếu bundle xóa. Periodic re-install (setInterval) phòng race condition.

**Anti-pattern documented:**

- ❌ Set `userFeatures.proInfo: {full Pro shape}` mà KHÔNG có shape thật → broke UI (Gate 22). Bundle's `proInfo.X` access cho `paymentGateway:'paddle'` → trigger Paddle SDK code path → cascade failure.
- ❌ Set `channeluser: {fabricated id, empty thumbnailUrl}` → bundle render avatar logic break. Captured shape có `thumbnailUrl: null OR real URL`, NEVER empty string.
- ✅ Set MINIMAL changes: just `isPro: true`. Leave proInfo/subscription/channeluser nguyên backend response. Bundle's optional chaining handles null gracefully.

**Còn lại sau Gate 23:**
- Chip number issue: Bundle reads `tts.proCredits` vs `tts.freeMessages` based on isPro. Now isPro=true → should pick proCredits. `tfForceProCredits` IIFE already sets `tts.proCredits = 100000`. Should display 100k after Gate 23 activates isPro.
- TikTok avatar (channeluser.thumbnailUrl): chỉ relevant khi user connect TikTok Live thật — bridge broadcast `tiktokAccount` event syncs avatar (đã xử lý trong Gate D từ Gate 22).

---

### Gate 22: Reverse-engineering artifacts — leverage `docs/`, `decompiled/`, `routes-generated/` (2026-05-22)

> **DỪNG ĐOÁN. Có dữ liệu thật.** Khi sửa code bundle-adjacent, đọc artifacts trước thay vì brainstorm.

User đã làm một pipeline reverse-engineering bundle TikFinity hoàn chỉnh (commit `b6e0826` + `89e6fe7`, 2026-05-22). Tổng ~30k dòng artifact đã commit. Đây là **single source of truth** cho mọi API contract / Vue logic / bundle behavior. **Tham khảo artifacts TRƯỚC khi viết handler / mock / fix.**

**Artifacts catalogue:**

| Path | Size | Vai trò |
|---|---|---|
| [docs/README.md](docs/README.md) | 11KB | Index — đọc đầu tiên |
| [docs/BUNDLE_CALL_FLOW.md](docs/BUNDLE_CALL_FLOW.md) | 15KB | Boot sequence + per-feature flows + 5 critical UI bugs A-E |
| [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) | 70KB | Shape + sample của 26 endpoints chính (recursive type tree) |
| [docs/COMPLETE_ENDPOINT_INDEX.md](docs/COMPLETE_ENDPOINT_INDEX.md) | 42KB | 228 endpoints full catalogue |
| [docs/DATABASE.md](docs/DATABASE.md) | 9KB | ERD + better-sqlite3 schema |
| [routes-generated/tikfinity.zerody.four.merged.shapes.md](routes-generated/tikfinity.zerody.four.merged.shapes.md) | 62KB | 228 endpoint preview body |
| [decompiled/modules/deobfuscated.js](decompiled/modules/deobfuscated.js) | ~945KB | Vue app source readable (webcrack output) |
| [scripts/decompile/](scripts/decompile/) | — | merge-har, extract-contracts, har-to-stubs, run-all |
| [captures/*.har](captures/) | 427MB (gitignored) | Raw HAR sources |

**Pipeline 6 bước (đã chạy xong, lưu ở [docs/README.md](docs/README.md)):**
HAR capture → merge+dedupe → extract contracts → bundle decompile (webcrack) → live instrumentation → document.

**13-step integration order từ [BUNDLE_CALL_FLOW.md §13](docs/BUNDLE_CALL_FLOW.md):**

| # | Task | Status |
|---|---|---|
| 1 | Diff `/api/me` (local vs captured) → fill missing fields | 🟡 partial (Gate 22 áp dụng `channeluser`, `discordHasProRole`, `agencyAffiliateId`) |
| 2 | Mount auto-generated stub router as last fallback → giảm 404 spam | ⏳ pending |
| 3 | Update `voice-catalog.json` từ captured 27KB → voice picker khớp 100% | ⏳ pending |
| 4 | Update `getAllGifts` từ captured 885KB | ✅ done (Gate 21) |
| 5 | Verify OData envelope cho channeluser + transaction | ⏳ pending |
| 6 | Stub `/api/login` alias key-login | ⏳ pending |
| 7 | Mock `/api/tts/generate` trả audio binary | 🟡 partial (mock trong blockScript) |
| 8 | Capture WS frames riêng cho chat/gift | ⏳ pending |

**5 critical UI bugs A-E từ [BUNDLE_CALL_FLOW.md §10](docs/BUNDLE_CALL_FLOW.md):**

| ID | Symptom | Root cause | Status |
|---|---|---|---|
| A | App reload mỗi /api/me call | `wsAuthToken` mỗi mint khác `iat` | ✅ fixed (cache `_wsAuthTokenCache.get(channelId)`) |
| B | Switch profile reload loop | `featureBaseToken` không cache theo channel name | ✅ fixed (cache `(channelId, frontendChannelName)`) |
| C | Reload mỗi 2.5s | `settings.restore` POST với cached state | ✅ fixed (swallow trong blockScript) |
| D | Topbar chip trống/placeholder | Avatar URL không reach `window.session.me.avatarUrl` | ✅ fixed (bridge broadcast `tiktokAccount` → syncer) |
| E | "Dư khúc trống ở trên" — user phải scroll | `<div id="pageSSRContent">` SEO fallback không bị hide | ✅ **fixed today** (`#pageSSRContent { display: none !important }` trong earlyCss line 2) |

**Quick wins applied today (commit-ready):**

```js
// backend-node/src/routes/me.js — fill 3 missing fields from captured shape
channeluser: {                                    // was: null → bundle fallback placeholder
  userId, id, channelId, username, nickname,
  thumbnailUrl, totalAmount, totalRewardAmount,
  challengeStartAmount, challengeStartRewardAmount,
  archivedAmount, archivedRewardAmount,
  lastUpsertAt, createdAt, updatedAt,             // all minimal/0 for fresh user
},
channel.agencyAffiliateId: null,                  // was: missing → bundle .undefined access
discordHasProRole: false,                         // top-level, was: missing
```

```css
/* backend-node/src/templates/earlyCss.txt line 2 */
#pageSSRContent { display: none !important; }     /* UI bug E */
```

**Pattern principle:**

> **Khi gặp UI bug ở 1 surface cụ thể (chip, modal, dropdown, etc.):**
> 1. **Đọc [BUNDLE_CALL_FLOW.md](docs/BUNDLE_CALL_FLOW.md) §10** trước — 5 bugs đã catalogued
> 2. **Diff [API_CONTRACTS.md](docs/API_CONTRACTS.md)** cho endpoint relevant (vd lỗi voice picker → §3 /api/me + voice routes)
> 3. **Grep [decompiled/modules/deobfuscated.js](decompiled/modules/deobfuscated.js)** cho symbol UI (vd `chipAvatar`, `topbarChip`) → xem actual binding logic
> 4. **Chỉ guess** khi 3 bước trên không có dữ liệu
>
> **Khi cần mock endpoint mới:**
> 1. Lookup [docs/COMPLETE_ENDPOINT_INDEX.md](docs/COMPLETE_ENDPOINT_INDEX.md) — endpoint đó có trong 228 catalogue không
> 2. Lookup [routes-generated/*.shapes.md](routes-generated/) — preview body để hiểu shape
> 3. Lookup [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) §X nếu là 1 trong 26 endpoints chính (full type tree)
> 4. Copy minimal valid response, adapt fields cho local state

**Anti-patterns:**

- ❌ Brainstorm shape từ field names — captured shape sẵn có
- ❌ Mock trả empty `{}` "tạm" — bundle thường crash trên `undefined.X` access. Dùng captured fields với default values
- ❌ Sửa decompiled/modules/deobfuscated.js — đó là READ-ONLY artifact (auto-generated từ webcrack)
- ❌ Ignore artifacts vì "nó dài quá" — grep targeted (`grep -n "endpoint_name" docs/API_CONTRACTS.md`) ra ngay
- ❌ **CRITICAL — Áp captured-shape fields cho Pro user khi captured là FREE user.** 2026-05-22 attempt: thấy `docs/API_CONTRACTS.md` §3 có `channeluser: { totalAmount:0, ... }` và `proInfo` có 6 fields → áp vào /api/me. KẾT QUẢ:
   - Credit chip rớt 100k → 25 free messages
   - Hiện "Nâng cấp lên PRO" button
   - AI voice picker tab empty
   - "API Error (-1) HTTP Communication Error" notification

   Root cause: captured /api/me trong HAR là FREE user (`userFeatures.isPro:false`). Channeluser-with-zeros + proInfo-paddle là shape của FREE user. Bundle re-evaluate Pro display logic, thấy channeluser zeros + paymentGateway:paddle gọi Pro management APIs không có local → cascade failure.

   **Quy tắc:** Trước khi áp captured field cho Pro user, **PHẢI capture HAR riêng của Pro user**, hoặc grep deobfuscated.js xác nhận field đó độc lập với Pro status. Field có condition như `if (proInfo.isActiveSubscription)` → KHÔNG được set true mà không có downstream Pro infrastructure.

   **Safe pattern:** Kept-working state has `channeluser: null` + `proInfo: { plan:'free', active:false }` + `isPro:true`. Đây là contradictory-but-functional state — bundle chỉ check `isPro:true` cho hiển thị, không deep-check proInfo. Don't fix what's not broken.

**Re-generate khi bundle update (TikFinity gốc push bản mới):**

```bash
# Capture HAR mới qua Chrome DevTools (5 phút)
mv ~/Downloads/tikfinity.zerody.one.har captures/

# Re-run pipeline (~1 phút)
node --max-old-space-size=6144 scripts/decompile/merge-har.js
node scripts/decompile/extract-contracts.js
npx webcrack downloads/combo/modules.js -o decompiled/modules
npx webcrack downloads/combo/app.js -o decompiled/app

# Diff để biết bundle đã đổi gì
git diff docs/API_CONTRACTS.md           # field nào server gốc đổi shape?
git diff decompiled/modules/deobfuscated.js  # function nào bundle thêm/sửa?
```

**Live instrumentation hook (off-by-default):**

```js
// Trong DevTools console khi app chạy:
localStorage.setItem('tf-instrument','1'); location.reload();
// → Log mọi fetch + XHR vào window.__tfCallLog
window.__tfDumpCallLog();  // download tf-call-log-<ts>.json
```

Mọi fetch/XHR (method, URL, body, status, snippet) push vào `window.__tfCallLog` (cap 2000 entries). Dùng để verify behavior khi không có HAR fresh.

---

### Gate 21: Bundle fixtures stale — sync from gốc TikFinity at startup (2026-05-21)

**Triệu chứng:** "Trình duyệt đồ họa quà tặng" (Gift Browser) chỉ hiện ~1500 items trong khi gốc TikFinity hiện ~3400. User: *"đây là hình gốc tới 3000 mấy lận, bên mình có 1000 mấy à"*.

**Root cause:** [downloads/api/getAllGifts](downloads/api/getAllGifts) là static snapshot tháng 3/2026 chứa 1518 gifts (397KB). [routes/data.js:150](backend-node/src/routes/data.js#L150) chỉ serve raw file → không bao giờ tự refresh. TikTok thêm gifts liên tục, gốc TikFinity sync mới (3386 items, 885KB).

**Fix:** New module [services/bundle-fixtures-sync.js](backend-node/src/services/bundle-fixtures-sync.js):
- On backend startup, fetch fresh từ `https://tikfinity.zerody.one/api/<endpoint>` (no auth required — public)
- Validate JSON shape trước khi ghi đè
- Backup file cũ vào `.bak` (preserve manual `.bak-YYYY-MM-DD`)
- Fire-and-forget: backend listen NGAY, sync chạy parallel ~2s

```js
// Wired in backend-node/src/index.js sau server.listen():
const bundleFixturesSync = require('./services/bundle-fixtures-sync');
bundleFixturesSync.syncAll(config.FRONTEND_PATH).catch((err) => {
  logger.error({ err }, '[BOOT] bundle-fixtures-sync uncaught');
});
```

**Endpoints verified public (no auth) on gốc as of 2026-05-21:**

| Endpoint                  | Local before | Gốc fresh | Status |
|---------------------------|--------------|-----------|--------|
| `/api/getAllGifts`        | 397KB / 1518 | 885KB / 3386 | ✅ synced |
| `/api/getAllAnimations`   | 43KB         | 32KB      | ✅ synced |
| `/api/getGlobalTransactions` | 2KB synthetic | 403 (auth) | ❌ skip |
| `/api/getAppConfig`       | 1.5KB        | 404       | ❌ skip |
| `/api/getSystemConfig`    | 1.5KB        | 404       | ❌ skip |

**Boot timing (verified):**
- T+0: backend listening on 5285
- T+0.5s: sync start
- T+2.4s: sync complete (getAllAnimations + getAllGifts updated)
- Bundle calls `/api/getAllGifts` 4× trong 2s đầu — 2 lần đầu nhận old data, từ lần 3 nhận NEW data

**Race condition acceptable:** bundle re-render grid khi nhận response mới. Nếu user mở Gift Browser ngay trong 2s đầu thì có thể thấy 1518 → refresh trang là thấy 3386.

**Anti-patterns đã tránh:**

- ❌ Periodic refresh — User explicitly said "fetch lúc mở lên thôi". Không setInterval, không cron, restart backend để re-fetch.
- ❌ Await sync trước khi listen — block boot 2s+ tệ UX, race acceptable vì file already exists làm fallback.
- ❌ Fetch on every `/api/getAllGifts` request — kéo 885KB từ external mỗi lần là tự tử bandwidth + latency. File cache trên disk là đúng pattern.
- ❌ Validate bằng `JSON.parse(text)` — parse 885KB chỉ để validate là lãng phí. Dùng cheap heuristic `startsWith('[') && /"id":\d+/.test()` đủ.
- ❌ Direct fetch từ TikTok webcast API — cần auth + region-specific. Proxy qua gốc TikFinity là đúng (họ đã handle auth/region).

**Pattern principle:**

> **Bundle fixtures = "dữ liệu công khai gốc đã có"**. Đối với bất kỳ static file nào dưới `downloads/api/`, kiểm tra: (1) gốc có public endpoint không (curl unauthenticated → 200?); (2) shipped file có outdated không (timestamp + count); (3) bundle có tolerate transient stale data trong vài giây đầu không. Nếu cả 3 ✅ → thêm vào FIXTURES array trong bundle-fixtures-sync. Nếu cần auth (như `getGlobalTransactions`) → giữ local file synthetic, không sync.

**Cách add fixture mới:**

```js
// services/bundle-fixtures-sync.js — FIXTURES array
{
  localPath: 'api/<endpoint>',
  upstream: '/api/<endpoint>',
  validate: (text) => /* cheap shape check */,
}
```

**Test trước khi commit:**

```bash
# Test endpoint public không cần auth:
curl -s -o /tmp/test.json -w "%{http_code} %{size_download}\n" \
  --max-time 15 -H "User-Agent: Mozilla/5.0" \
  "https://tikfinity.zerody.one/api/<endpoint>"
```

---

### Gate 20: Overlay Library page overflow — ROOT CAUSE là `#pages` width, không phải card widths (2026-05-21)

> **Supersedes Gate 19.** Gate 19 mô tả triệu chứng đúng nhưng misdiagnosed nguồn gốc. Cards KHÔNG cần override — bundle đã có rule responsive `width: calc(50% - 16px); min-width: 770px`. Vấn đề thật là `#pages` bị ép `width: 100%` mà bundle lại set `margin-left: 335px` → overflow toàn bộ container 335px, không phải cards.

**Triệu chứng:** Trang "Thư viện lớp phủ" (`data-pageid=obsoverlays`) khi maximize: cards trông bị "lệch", `body.scrollWidth = 2250px` trong khi viewport = 1920px → overflow 330px. Cards bên trong shrink đúng 50% rồi nhưng container đã extend ra ngoài viewport.

**Probe data (DevTools console):**
```
innerWidth: 1920, document.documentElement.clientWidth: 1915
body.scrollWidth: 2250 (vượt viewport 330px)
.page.pageenabled: x=343, width=1915, right=2258 (lấn 343px = sidebar width)
.obsOverlayContainer: width=1915, children=28
.greyBackgroundSection (card): w=948, right=2258 (đúng 50% của 1915, nhưng container đã sai)
```

**Root cause:** Trong `earlyCss.txt` có rule
```css
#navigation-app, #pages { width: 100% !important; max-width: 100vw !important; }
```
Bundle đồng thời có rule (verified từ `main.min.css`):
```css
body[data-new-navigation-design] #pages { margin-left: 335px; margin-top: 75px; }
```
**Cộng dồn:** #pages width 1920px (100vw) + margin-left 335px = right edge tại x=2255 → lấn viewport 335px. Mọi child (`.page.pageenabled`, `.obsOverlayContainer`, cards) đều lấn theo.

**Fix CORE — `backend-node/src/templates/earlyCss.txt`:**

```css
/* CRITICAL: KHÔNG ép #pages = 100vw. Bundle gives margin-left: 335px,
   nên 100vw + 335px = overflow đúng 335px. */
#navigation-app { width: 100% !important; max-width: 100vw !important; }
#pages {
  width: auto !important;
  max-width: calc(100vw - 335px) !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
}
```

**Bundle's NATURAL card sizing (KHÔNG override):**

Verified từ `main.min.css` grep:
```css
body[data-new-navigation-design] .page[data-pageid=obsoverlays] .obsOverlayContainer .greyBackgroundSection {
  margin-right: 0;
  width: calc(50% - 16px) !important;
  min-width: 770px;
  box-sizing: border-box;
}
```
Container rule:
```css
body[data-new-navigation-design] .page[data-pageid=obsoverlays] .obsOverlayContainer {
  margin-top: 20px; display: flex; gap: 16px;
  flex-wrap: wrap; justify-content: flex-start;
}
```

Bundle đã responsive sẵn: cards stretch 50% với min-width 770px, wrap khi <1556px. Sau khi fix `#pages` thì:
- Viewport 1920 → #pages 1585 → cards 50%-16 = 776.5px each (> 770 min ✓)
- Viewport <1556 → wrap xuống 1 cột (min-width force wrap)

**Anti-patterns đã thử và sai:**

- ❌ Override `width: calc(50% - 10px)` cho cards → off 6px so với bundle's `calc(50% - 16px)` → user complain "lệch"
- ❌ Force `flex: 0 1 calc(50% - 10px) !important` + `max-width: calc(50% - 10px)` → ép cards stretch ra ngoài design intent
- ❌ Set `.obsOverlayContainer { gap: 20px }` → bundle dùng 16px, override làm sai spacing
- ❌ Cho `body { overflow-x: auto }` → tạo scroll bar không đẹp; vấn đề là page width, không phải body
- ❌ Gate 19's CSS dùng `[class*="grid-cols-2"]` → trang này dùng LEGACY `.obsOverlayContainer` flex, không phải Tailwind grid → fix không apply

**Pattern principle:**

> **Khi thấy overflow ở 1 page cụ thể, đo VIEWPORT vs CONTAINER trước, đừng vội fix cards.** Probe DOM với DevTools script để xem `body.scrollWidth`, `.page.pageenabled.width`, `.page.x`. Nếu page.x > 0 (sidebar margin) AND page.width ≈ 100vw → root cause là PARENT width, không phải children. Bundle thường có responsive logic built-in cho cards/grids — chỉ override khi đo được nó thật sự sai.

**Verification probe (paste vào DevTools console khi đang ở trang lỗi):**

```js
(function tfProbeOverflow() {
  const log = [];
  const p = (msg) => log.push(msg);
  p('vw=' + window.innerWidth + ' body.scrollWidth=' + document.body.scrollWidth);
  const page = document.querySelector('.page.pageenabled');
  if (page) {
    const r = page.getBoundingClientRect();
    p('page pageid=' + page.getAttribute('data-pageid') + ' x=' + r.x + ' width=' + r.width + ' right=' + r.right);
  }
  // Find elements past viewport right edge
  const vw = window.innerWidth;
  let over = [];
  document.body.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 5 && r.width > 50 && r.width < 2000) {
      over.push(el.tagName + '.' + (el.className||'').toString().slice(0,40) + ' w=' + Math.round(r.width) + ' right=' + Math.round(r.right));
    }
  });
  p('elements past right (' + over.length + '):'); over.slice(0,5).forEach(o => p('  ' + o));
  console.log(log.join('\n'));
})();
```

Nếu `page.x = 343, page.width = 1915` → ĐÚNG Gate 20 pattern → fix `#pages`. Nếu `page.width` đã ≤ viewport thì là vấn đề khác.

---

### Gate 19: Layout overflow khi window resize (responsive) [ARCHIVED — see docs/GATES_ARCHIVED.md]

> ⚠️ **SUPERSEDED by Gate 20** (root cause cho overlay library page là `#pages` width, không phải card widths). Body của Gate 19 đã move sang [`docs/GATES_ARCHIVED.md#gate-19`](docs/GATES_ARCHIVED.md) — vẫn còn pattern responsive `grid-cols-*` hữu ích cho các page khác.

### Gate 18: Pro credit chip — bg color khác Free + image src vẫn TikTok avatar

**Triệu chứng (v1):** Chip hiện "0" → fixed via `tfForceProCredits` (Gate 17).
**Triệu chứng (v2):** Chip hiện đúng "100k" (bundle native compact) NHƯNG image vẫn là TikTok avatar (Pro-mode bg `#FFB54D14`, không phải `#D435554D` free-mode cũ).

**Root cause:** Bundle dùng 2 bg colors cho chip:
- Free tier (`subscriptionEnabled: false`): `bg-[#D435554D]` (burgundy)
- Pro tier (`subscriptionEnabled: true`): `bg-[#FFB54D14]` (yellow/amber)

CSS rule cũ chỉ match burgundy → miss khi user Pro → tiktokcdn img leak qua.

**Bundle's NATIVE behavior for Pro chip:**
- Compact format "100k" — bundle TỰ format khi `proCredits ≥ 1000` (KHÔNG cần CSS pseudo override)
- title attr = "100,000" (locale-formatted with comma) — bundle dùng `Intl.NumberFormat()` cho title
- image = TikTok user avatar (BUG bundle — should be coin icon)

**Fix đúng (multi-selector CSS):**

Target CẢ 2 bg colors trong CSS rule:

```css
div[class*="bg-[#D435554D]"] > div.flex.items-center > img[src*="tiktokcdn"],
div[class*="bg-[#FFB54D14]"] > div.flex.items-center > img[src*="tiktokcdn"] {
  display: none !important;
}
div[class*="bg-[#D435554D]"] > div.flex.items-center::before,
div[class*="bg-[#FFB54D14]"] > div.flex.items-center::before {
  content: '';
  background-image: url('/twemoji/svg/1fa99.svg');
  /* ... */
}
```

**Principle (extend Section 1.00):**
> Khi bundle dùng nhiều bg colors cho variants (Free vs Pro, Light vs Dark, etc.), CSS rule phải LIST hết bg colors (comma-separated selectors). Không assume một color duy nhất sẽ cover mọi state. Bundle update có thể đổi bg → grep lại tất cả `bg-[#...]` colors xuất hiện trong chip's outerHTML.

### Gate 17: Pro credit chip render "0" dù `/api/me` trả `ttsProCredits: 100000`

**Triệu chứng:** Topbar coin chip hiển thị "0" cho user Pro (isPro=true, ttsProCredits=100k ở /api/me). Popover còn show "Đã dùng 100k trong tổng 100k".

**Root cause:** Bundle's chip Vue component đọc credits từ **Pinia store** (mảng state riêng), KHÔNG đọc trực tiếp từ `tfPageloadData.me.channel.ttsProCredits`. Pinia store init với default 0, chỉ update từ `/api/tts/user` fetch response (cross-origin call). Trước khi user trigger AI voice flow → fetch không fire → Pinia ở 0 → chip "0".

**Anti-pattern (KHÔNG làm):**
1. ❌ Trông chờ Pinia auto-sync từ `tfPageloadData.me.channel.*` — bundle không làm vậy
2. ❌ Set `ttsProCredits` ở /api/me thôi — chip không read từ đây

**Fix đúng (blockScript IIFE `tfForceProCredits`):**

1. Mỗi 2s, walk **mọi Pinia stores** của mọi Vue apps mounted (`document.querySelectorAll('[data-v-app]')`).
2. Cho mỗi store state, force-set TẤT CẢ field credit/quota về Pro full value (nếu field exist):
   - `proCredits`, `proCreditsMax`, `subscriptionCreditsRemaining`, `subscriptionCreditsTotal`, `lastKnownAiCreditsTotal` → 100000
   - `freeMessages`, `freeMessagesMax`, `freeRequestsRemaining`, `freeRequestsTotal` → 25
   - `topUpCredits`, `purchasedCreditsRemaining` → 0
   - `aiCreditsBlocked` → false
   - `trialBannerDismissed` → true
3. Vue reactive re-renders → chip update tự nhiên.

**Pattern principle:**
> Khi bundle dùng Pinia store với state riêng (không sync từ tfPageloadData), force-set tất cả credit/quota fields đã biết tên qua periodic Pinia patcher. Liệt kê fields trong CLAUDE.md để future bundle update có thể extend.

### Gate 16: Bundle render LIVE label hardcoded inline + avatar hide khi disconnected

**Triệu chứng (initial):** Bundle render "LIVE" trong topbar dropdown dù `account.isLive: false`.

**Triệu chứng (regression v1 — DOM text mutation approach):** Label flicker giật giật giữa "LIVE" và "Disconnected" — observer/Vue fight nhau re-render.

**Root cause:** Bundle's Vue render function cho user dropdown component (`data-v-41c476b8`) hardcode "LIVE" string làm text content (obfuscated string table, 1 occurrence). Không phải i18n key. Vue re-render component periodic → đè lên DOM text mutation của tôi → flicker.

**Anti-pattern (KHÔNG làm):**
1. ❌ MutationObserver replace `span.textContent` mỗi mutation — fight Vue → flicker
2. ❌ Tìm và patch bundle's render function — obfuscated, blast radius khó kiểm soát
3. ❌ Set `connected: false` ở backend — break chat event subscription

**Fix đúng (attribute + CSS pattern):**

1. **blockScript IIFE `tfPatchLiveBadge`:**
   - Poll `/api/tiktok/status` mỗi 5s
   - Set `<html data-tf-live-state="live|disconnected">` dựa trên `account.isLive`
   - **KHÔNG touch DOM text** — chỉ set attribute (Vue không touch attribute này)
   - Default `disconnected` trước khi poll đầu tiên (tránh flash LIVE)

2. **earlyCss.txt CSS rules** (CSS chạy tự nhiên, không fight Vue):
   ```css
   html[data-tf-live-state="disconnected"] div.flex.flex-col > span.text-xs {
     font-size: 0 !important;
     color: transparent !important;
   }
   html[data-tf-live-state="disconnected"] div.flex.flex-col > span.text-xs::before {
     content: 'Disconnected';
     font-size: 0.75rem;
     color: rgb(239, 63, 98) !important;
   }
   /* Hide TikTok avatar khi disconnected (user request: không load avt khi disconnected) */
   html[data-tf-live-state="disconnected"] .profile-avatar-wrap img {
     display: none !important;
   }
   html[data-tf-live-state="disconnected"] .profile-avatar-wrap {
     background-image: url('/img/nothumb.webp');
     background-size: cover;
     border-radius: 50%;
   }
   ```

**Pattern principle (Đăng ký vào skill):**
> Khi bundle hardcode text/style obfuscated và Vue re-render đè:
> 1. Set state qua `data-*` attribute trên `<html>` (Vue không touch)
> 2. Render visual khác qua CSS rule (`font-size: 0` + `::before content`)
> 3. KHÔNG dùng MutationObserver replace text — fight Vue → flicker
> 4. Default state trước khi poll đầu (tránh flash sai state)

**Khi nào KHÔNG dùng pattern này:** Nếu bundle text cần dynamic value (vd "100 viewers"), pattern CSS `::before content` không support dynamic value qua CSS — phải fall back sang JS replacement với throttle ≥ 100ms.

### Gate 15: "LIVE" badge under user avatar luôn hiển thị dù không broadcasting

**Triệu chứng:** User avatar trong topbar có badge "LIVE" màu xanh dù user không đang live streaming. Confusing UX.

**Root cause:** `tiktok-bridge.js` `accountSnapshot()` set `isLive: !!_state.connected` — chỉ check session connection, không check broadcasting state. Bundle reads `account.isLive` cho LIVE badge → badge sáng khi session connected.

**Fix (đã apply):** Đổi điều kiện thành `!!(_state.connected && _state.roomId)`. LIVE badge chỉ sáng khi:
1. TikTok bridge có session active
2. AND bridge đã detect 1 live room (roomId không null)

`_state.connected` đứng riêng vẫn `true` khi user account connected — các flow khác (event subscription, chat input enable) không bị ảnh hưởng.

### Gate 14: `/api/tts/user` response `currentUsageMode='subscription'` trigger `settings.restore()` reload loop

**Triệu chứng:** Sau khi mock trả `currentUsageMode:'subscription'` + `subscriptionCreditsRemaining:100000` cho Pro look, app crash reload liên tục. Stack: `Object.restore` ở app.js → XHR success callback → `location.reload()` → reload-guard window=5/8 → loop.

**Root cause (suspect):** Bundle's Pro-mode code path validates token/credentials chặt hơn. Nếu `ttsAuthToken` không phải real JWT (mock dùng plain string `"tf-local-ai-token"`) → bundle nghi credentials mismatch → trigger settings.restore() → reload.

**Fix tạm (đã apply):** Revert `/api/tts/user` mock về `currentUsageMode:'free'`. Chip render gold coin + 25 free messages (matches gốc free-tier visual). Pro features vẫn unlocked qua Serial Key — chỉ chip topbar look free.

**Future:** Nếu cần Pro mode cosmetic, mint real JWT cho `ttsAuthToken` (encode userId + expiry + signed). Cũng cần verify bundle's Pro validation path không có gate khác.

### Gate 13: `/config/localization/<lang>.json` 404 → reload loop khi user chuyển locale

**Triệu chứng:** User chọn locale lạ (vd Japanese) qua profile dropdown → app đen / reload-guard KILL SWITCH window=8/8 → console error `Uncaught (in promise) Error while loading translation for ja, [object Object]`.

**Root cause:** Bundle fetch `/config/localization/<lang>.json` (root path, không qua `/api/` prefix) khi user switch language. Nếu 404 → bundle's loader throw → Vue crash → location.reload() → reload-guard chặn → app stuck đen.

**Fix (đã apply):** Route `GET /config/localization/:lang.json` trong `backend-node/src/index.js`:
- Lang trong `{vi, en, de, es}` → parse và return baked `tfPageloadData.localization.<lang>` từ HTML file tương ứng
- Lang khác (ja/ko/zh/...) → fallback return EN baseline → UI render English labels thay vì raw keys

**KHÔNG return empty `{}`** — bundle's i18n loader sẽ thay tất cả label bằng raw key (`nav.search`, `menu_start`, `start_connect_button`, ...) → UI broken.

**Phòng ngừa:** Project chỉ focus VN + EN. Các locale khác auto-fallback. User reset locale qua profile dropdown.

### Voice picker loader sequence (xác nhận từ Network tab gốc)

```
1. POST  /api/tts/auth-token (LOCAL backend, same-origin)
   → {status:200, ttsAuthToken:"<JWT>"}
2. GET   https://tts.tikfinity.com/api/tts/user (cross-origin, Bearer)
   → quota info {freeRequestsRemaining, currentUsageMode, ...}
3. GET   https://tts.tikfinity.com/api/tts/voices (cross-origin, Bearer)
   → voice catalog {data.voices: [...]}
```

Skip bất kỳ step nào trong sequence → bundle abort, modal empty.

### Gate 9c: Mock response shape — bundle reads BOTH `data.voices` AND `data.aiVoices`

**Triệu chứng:** Manual `fetch('/api/tts/voices')` thấy 66 voices, nhưng `window.tts.loadAiVoiceState()` xong, `window.tts.aiVoices === []`.

**Root cause:** Bundle's loader đọc field tên khác `data.voices`. Có thể là `result.voices` hoặc `data.aiVoices`.

**Fix (đã apply):** Mock emit cả 3 path cùng lúc:
```js
{
  statusCode: 200,
  message: 'Success',
  result: { voices: normalized },
  data: { voices: normalized, aiVoices: normalized }
}
```

### Probe workflow để diagnose voice picker empty

```js
// 1. Verify token + ttsHost gate
JSON.stringify({
  hasToken: !!window.token,
  ttsHost: window.appConfig?.ttsHost,
  aiTtsKeys: Object.keys(window.aiTts || {})
})

// 2. Verify voice ID prefix
window.aiTts?.voiceIdPrefix  // expect 'tts_api__'

// 3. Trace fetches during loader (capture URLs)
(function(){
  const o = window.fetch, c = [];
  window.fetch = function(u){ c.push(typeof u==='string'?u:u?.url); return o.apply(this, arguments); };
  return window.tts.loadAiVoiceState().then(() => { window.fetch=o; return c; });
})()

// 4. Verify aiVoices populated
(await window.tts.loadAiVoiceState(), window.tts.aiVoices?.length)
```

### Order of fixes (DO NOT skip any)

1. ProfileId clamp ✓
2. `tf_locale=VN` cookie → middleware language map ✓
3. Prebake create `en` bucket if missing ✓
4. Prebake target top-level `pld.localization` ✓
5. Object.defineProperty interceptor for early patch ✓
6. Bootstrap `window.token` from cookie ✓
7. `tts_api__` prefix on AI voice IDs ✓
8. Backend `/api/tts/auth-token` route ✓
9. Mock response shape with `data.voices` + `data.aiVoices` + `result.voices` ✓

Bỏ bất kỳ bước nào trong list này → AI tab empty hoặc app crash.

---

### Gate 30: Chip 100k real fix + i18n 12-lang + Stream Profile sync (2026-05-26)

> Bộ 4 bug được fix trong cùng session. SUPERSEDES phần defineProperty của [Gate 23c](#gate-23c-pinia-navigation-store--objectdefineproperty-trap-for-ispro--flag-icons-proxy--ai-voices-loader-2026-05-22). Xem các sub-gate dưới đây.

#### Gate 30a: Chip hiển thị "0" thay vì "100k" — Pro chip không render

**Triệu chứng:** Sau khi fix Pro flag mọi nơi (session.me.isPro=true, ttsProCredits=100000), chip topbar vẫn render **Free chip** với số "0" hoặc "25" thay vì Pro chip "100k".

**Discovery (verified via app.js offset analysis):**

Topbar có **2 chip component riêng biệt** — không phải 1 chip switch giữa Free/Pro mode:

- `TTSProDropdown` (`__name` @1957836) — props: `proCredits, proCreditsMax, topUpCredits, ...`
- `TTSFreeDropdown` (`__name` @1990295) — props: `freeMessages, freeMessagesMax`

Parent topbar component (`__name` @2000485) render conditional:
```js
unref(isLoggedIn) && unref(isPro)   ? createBlock(ProChipWrapper, {key:5})  : v-if-false
unref(isLoggedIn) && !unref(isPro)  ? createBlock(FreeChipWrapper, {key:6}) : v-if-false
```

`isPro` = `_0x3ee0d9[_0x224d3b(0x3c6c)]` = `navigationStore.isPro` (storeToRefs).

**Pro chip wrapper** (`__name` @1985552) đọc `ttsProCredits + ttsTopUpCredits` từ nav store → format → "100k".

**Free chip wrapper** (`__name` @1997133) đọc `ttsFreeMessages` → raw number "0".

**Root cause của bug:** [Gate 23c](#gate-23c)'s `Object.defineProperty(nav, 'isPro', {get: ()=>true})` thay descriptor nhưng **KHÔNG fire Vue 3 reactive proxy's `set` trap** → chip's setup() đã track dep với `isPro=false` ban đầu, không bao giờ nhận notification → forever render Free chip.

**Fix:** [`backend-node/src/templates/blockScript.txt::tfPiniaProTrap`](backend-node/src/templates/blockScript.txt) — đổi defineProperty → plain assignment, re-apply mỗi 2s qua setInterval:
```js
if (nav.isPro !== true) {
  try { nav.isPro = true; } catch(_){}    // trigger reactive set → chip re-render
}
```

**Anti-pattern documented:**

- ❌ `Object.defineProperty(reactiveTarget, key, {get,set})` — Vue 3's `mutableHandlers` không có `defineProperty` trap, fall qua default `Reflect.defineProperty` → dep notifier không fire
- ✅ `reactiveTarget[key] = value` — qua proxy `set` trap → dep notifier fire → effects re-run

**Related bug fixed in same patch:** `tfBuildQuotaPayload` returns `freeRequestsRemaining: 25` → `tts.freeMessages = 25` → khi chip có thể dùng Free wrapper, render "25". Đổi thành `0` để force fall through ttsProCredits path. After isPro fix, FreeDropdown không còn render nên giá trị này không matter, nhưng giữ `0` cho consistent (Pro user không có daily free quota).

#### Gate 30b: Language switcher đổi cờ nhưng UI không đổi locale

**Triệu chứng:** Profile dropdown → click flag (English/Thai/Japanese) → page reload → UI vẫn locale cũ.

**Root cause (3 layers):**

1. **Bundle's `localization.switchLanguage`** (app.js @3522500) chỉ set `localization.languageCode` + `settings.set('language', code)` (localStorage) + reload. **KHÔNG set cookie** mà backend dùng để route.

2. **Backend `detectLang`** ([`index-html.js:215`](backend-node/src/middleware/index-html.js#L215)) cũ chỉ hỗ trợ `vi/de/es` qua `tf_locale` cookie hoặc URL prefix. Mọi locale khác → fallback `''` (English HTML).

3. **`tfPageloadData.localization`** trong HTML chỉ chứa bucket của lang đó (vi.html → `localization:{vi:{...}}`). Vue-i18n init từ object này. Khi `tfI18nPreBake` fallback copy `vi → en` làm baseline, vue-i18n's "en" messages chứa Vietnamese strings.

**Fix (3 layer):**

**Layer 1 — Frontend wrapper** ([`blockScript.txt::tfPatchSwitchLanguage`](backend-node/src/templates/blockScript.txt)):
```js
var LANG_TO_LOCALE = {
  vi:'VN', de:'DE', es:'ES', en:'EN',
  id:'ID', ja:'JA', ko:'KO', ms:'MS',
  th:'TH', tl:'TL', tr:'TR', 'pt-br':'BR'
};
loc.switchLanguage = function tfSwitchLanguageWrapped(langCode) {
  var locale = LANG_TO_LOCALE[String(langCode||'').toLowerCase()] || 'EN';
  document.cookie = 'tf_locale=' + locale + '; Path=/; Max-Age=31536000; SameSite=Lax';
  document.cookie = 'tf_lang=' + langCode + '; Path=/; Max-Age=31536000; SameSite=Lax';
  return origSwitch.call(loc, langCode);
};
```

⚠️ **Critical:** `LANG_TO_LOCALE` PHẢI có đủ 12 keys. Thiếu key nào → defaults `'EN'` → cookie sai → backend serve English HTML.

**Layer 2 — Backend** ([`index-html.js`](backend-node/src/middleware/index-html.js)):
```js
const SUPPORTED_LANGS = new Set(['vi','de','es','id','ja','ko','ms','th','tl','tr','pt-BR']);
const TF_LOCALE_TO_LANG = {
  VN:'vi', VI:'vi', DE:'de', ES:'es',
  ID:'id', JA:'ja', JP:'ja', KO:'ko', KR:'ko',
  MS:'ms', MY:'ms', TH:'th', TL:'tl', PH:'tl',
  TR:'tr', BR:'pt-BR', 'PT-BR':'pt-BR',
  EN:'', US:'',
};
// Regex cookie: accept hyphenated codes (pt-BR)
const cookieLang = cookieStr.match(/(?:^|;\s*)tf_lang=([a-zA-Z]{2,3}(?:-[A-Za-z]{2,3})?)/);
```

**Layer 3 — Backend HTML JSON injection** ([`buildIndexHtml`](backend-node/src/middleware/index-html.js)):
Lang không có dedicated HTML file (id/ja/ko/ms/th/tl/tr/pt-BR) → serve `index.html` + inject `<langKey>:<jsonContent>,` vào sau `localization:{` của inline `tfPageloadData`. Vue-i18n init với đủ messages → no async fetch race.

```js
const langKey = lang.includes('-') ? `"${lang}"` : lang;
const anchor = 'tfPageloadData=';
const idx = html.indexOf('localization:{', html.indexOf(anchor));
html = html.slice(0, idx + marker.length) + `${langKey}:${jsonContent},` + html.slice(idx + marker.length);
```

⚠️ **Anchor `tfPageloadData=` BẮT BUỘC** — nếu chỉ search `localization:{`, match đầu tiên hit comment trong blockScript.txt → corrupt comment.

**Language packs:** 10 JSONs (de/es/id/ja/ko/ms/pt-BR/th/tl/tr) tải từ `https://tikfinity.zerody.one/config/localization/<lang>.json` về `downloads/config/localization/`. Plus en.json + vi.json đã có → đủ 12/12 lang.

**Hot reload limitation:** Backend changes (`index-html.js`) **KHÔNG hot reload** qua `/api/_dev/reload-html` (endpoint đó chỉ clear HTML cache, không reload JS module). **Phải kill + restart Electron** để pick up middleware changes. Template changes (blockScript.txt) thì OK reload-html.

#### Gate 30c: Stream Profile switching — backend update nhưng UI revert về Default sau reload

**Triệu chứng:** Click profile khác trong dropdown → UI flash sang profile mới → reload → revert về "Default" Active dù backend đã persist `channel.ProfileId = N`.

**Root cause:** [Bundle's nav store state def](decompiled) hardcode `streamProfileId: 1` trong `state()` function (verified app.js @1584059). Bundle KHÔNG đọc `/api/me` response để restore. Sau reload, nav store re-init với hardcoded `1` → dropdown render "Default" Active (dù backend.channel.profileId = 2).

**Fix:** [`blockScript.txt::tfPiniaProTrap`](backend-node/src/templates/blockScript.txt) — bổ sung sync từ `session.me.channel.profileId` (đã được seed bởi `tfBridgeSessionMe`):
```js
var srvProfileId = window.session && window.session.me && window.session.me.channel
  && window.session.me.channel.profileId;
if (Number.isFinite(srvProfileId) && srvProfileId > 0 && nav.streamProfileId !== srvProfileId) {
  nav.streamProfileId = srvProfileId;
}
```

Chạy mỗi tick qua setInterval (cùng patchPiniaNav). Plain assignment → Vue reactive → dropdown re-render với đúng profile Active.

**Bundle's click handler** (`StreamProfileDropdown` component @1853000+):
```js
_0xecf1aa.set('streamProfileId', _0x291349['id']);  // navigationStore.set, optimistic UI
window.switchProfile && window.switchProfile(_0x291349['id']);  // legacy jQuery fn → POST /api/me {profileId}
```

`window.switchProfile` (app.js @3762792) là top-level `function` declaration → exposed lên `window`. POST `/api/me` với `{profileId}` → backend `handleMe` ([`me.js:309`](backend-node/src/routes/me.js#L309)) validate qua `hasChannelProfile` + persist `channels.updateProfileId(channelId, requested)`.

**DB location:** `%APPDATA%\tikfinity-desktop\tikfinity.db` (SQLite via better-sqlite3). Tables `Profiles` (10 rows seed sẵn) + `Channels.ProfileId` column tracks active.

#### Gate 30d: Overlay Library iframes — let bundle's native `stretchIframe` run, KHÔNG override height bằng CSS (2026-05-26)

**Triệu chứng:** Trên Overlay Library page (pageid=obsoverlays), card iframes (CoinMatch, CoinJar, Wheel, Cannon, FallingSnow, …) bị crop hoặc render với height sai (cụt ngắn / dài vô tận / lệch hàng). Một số card đè lên nhau, một số bị flex-grow nuốt mất viewport.

**Root cause (giả thuyết ban đầu, SAI):** Tưởng bundle quên set iframe height → thử các fix CSS như `iframe { height: 100% }`, `flex-grow: 1`, hoặc fixed pixel height per card. Kết quả: phá gốc-native layout, mỗi widget cần một height riêng (CoinMatch 655px, CoinJar 660px, Wheel 455px, Cannon 480px, etc.) — không thể hardcode trong CSS.

**Root cause (thật):**
- Gốc TikFinity: cards là **plain block div**, mỗi iframe có inline `style="width:867px; height:Xpx"` per widget. `main.min.css` set `iframe { width:100% !important }` để iframe co theo card width nhưng **không override height**.
- Bundle's `modules.js` định nghĩa `obsoverlays.show()` → gọi `stretchIframe()` → loop qua tất cả `.lazy-frame` iframes, grow height cho đến khi `iframe.scrollHeight` ổn định.
- Trong gốc, navigation hook fire `show()` mỗi khi user enter page. Trong bundle của ta (Vue refactor + reload chain), page mount **không trigger** `obsoverlays.show()` → iframes giữ height inline gốc, không stretch theo content → ngắn cụt.

**Fix (2-part — KHÔNG CSS override):**

1. **`earlyCss.txt`** — chỉ giữ `.obsOverlayContainer { zoom: 1 !important; max-width: 100% !important }` để nuke bundle's broken zoom curve. **REVERT** mọi iframe height / flex-grow override (đã thử v1-v4, đều phá gốc). Comment block đầy đủ tại `earlyCss.txt:131` ("Card iframe height — REVERT to gốc-native behavior (Gate 30d v5)").

2. **`blockScript.txt::tfTriggerOverlaysShow`** — MutationObserver theo dõi `.page[data-pageid=obsoverlays|goals|graphicoverlays]` cho class change `pageenabled` → fire `window.obsoverlays.show()` + `window.goals.show()` + `window.graphicoverlays.show()` tương ứng. Belt-and-braces: cũng gọi trực tiếp `window.obsoverlays.stretchIframe()` để loop qua mọi `.lazy-frame` trong DOM (regardless of which page active).

**Anti-pattern documented:**
- ❌ `iframe { height: 100% !important }` → iframe nuốt toàn bộ parent height, đè card khác
- ❌ `iframe { flex-grow: 1 }` → cards thành flex children → bundle's gốc block layout vỡ
- ❌ Hardcode height per widget trong CSS → cần ~15 selectors, một widget mới = update CSS
- ✅ Trigger bundle's native `stretchIframe()` → mỗi iframe tự stretch theo `scrollHeight`, đúng gốc behavior, không cần biết widget nào có height bao nhiêu

**Pattern principle — "Trigger gốc-native function, đừng tự reimplement":**

> Khi bundle có sẵn function (e.g., `stretchIframe`, `localize`, `setTheme`) mà chỉ thiếu navigation hook để fire, **trigger function gốc** thay vì reimplement logic bằng CSS / JS observer. Reimplementation thường bỏ sót edge case (mỗi widget khác height, async iframe load, scroll containers nested) mà bundle gốc đã handle đúng.

**Verify:** Open DevTools Console trên Overlay Library page → check `document.querySelectorAll('.lazy-frame').forEach(f => console.log(f.style.height))` → các height phải match gốc reference (CoinMatch 655px, CoinJar 660px, ...).

#### Order of fixes (cập nhật cho Gate 30, supersedes phần defineProperty của Gate 23c)

1. ProfileId clamp ✓
2. `tf_locale=<CODE>` cookie → middleware language map (12 langs) ✓
3. Prebake create `en` bucket if missing ✓
4. Prebake target top-level `pld.localization` ✓
5. ~~Object.defineProperty interceptor for early patch~~ → **plain `nav.isPro = true` + setInterval re-apply** ✓
6. Bootstrap `window.token` from cookie ✓
7. `tts_api__` prefix on AI voice IDs ✓
8. Backend `/api/tts/auth-token` route ✓
9. Mock response shape with `data.voices` + `data.aiVoices` + `result.voices` ✓
10. **NEW** `tfPatchSwitchLanguage` wrapper set tf_locale cookie ✓
11. **NEW** Backend `buildIndexHtml` JSON injection for HTML-less locales ✓
12. **NEW** `nav.streamProfileId` sync từ `session.me.channel.profileId` mỗi tick ✓
13. **NEW** `tfTriggerOverlaysShow` MutationObserver fire `obsoverlays.show()` / `goals.show()` / `graphicoverlays.show()` khi page mount → bundle's gốc `stretchIframe` chạy tự nhiên ✓

Bỏ bất kỳ bước nào → chip stuck "0" / "25", language switcher silently fail, profile dropdown revert về Default sau reload, hoặc overlay iframes render với height sai.

---

### Gate 32: Pre-warm cross-origin CDN cache on backend boot (M-001, 2026-05-28)

**Symptom:** Gift dropdown (Sound Alerts trigger) appears slow on first open post-boot (~1-2s freeze, WebP decode + network fetch). Subsequent opens instant. User: "tại sao cái quà gì đó chậm lần đầu?"

**Root cause:** Bundle's obfuscated `itemTemplate` (native render function) fires direct cross-origin `https://<N>.tiktokcdn.com/image/<path>.webp` fetches for ~50 gift thumbnails. When backend boots, `/tiktok-img-cache/*` proxy route has empty in-memory Map (`_cdnProxyCache`) — first dropdown open pays upstream network cost. Subsequent opens hit cache hit (24h TTL) → instant.

**Fix:** 
- **Module:** [`backend-node/src/services/tiktok-image-prewarm.js`](backend-node/src/services/tiktok-image-prewarm.js) (201 lines)
  - On startup, read `downloads/api/getAllGifts` fixture (3386 gifts, already sorted by `diamond_count` ASC = cheap/popular first)
  - Extract top 200 TikTok CDN URLs from `gift.image.url_list[0]`
  - Validate SSRF: must match `*.tiktokcdn.com` hostname regex
  - Fire 200 parallel fetches with concurrency limiter (10 workers) + 10s timeout per fetch
  - For each successful fetch: store in `_cdnProxyCache` with key `tiktok-img/<host>/<path>` (MUST match proxy route format exactly)
  - Fire-and-forget after `server.listen()` — does NOT block backend boot
  - Cache key format must match [`index.js:500`](backend-node/src/index.js#L500) proxy route `'tiktok-img/' + host + '/' + upstreamPath` exactly

- **Wired in:** [`backend-node/src/index.js:673-677`](backend-node/src/index.js#L673)
  ```js
  // Async pre-warm: fire-and-forget after server.listen()
  const { prewarmTikTokImages } = require('./services/tiktok-image-prewarm');
  prewarmTikTokImages(config.FRONTEND_PATH, _cdnProxyCache, logger).catch((err) => {
    logger.error({ err }, '[BOOT] prewarmTikTokImages uncaught');
  });
  ```

**Design decisions (mirror Gate 21 pattern — bundle-fixtures-sync):**
- Fire-and-forget: backend listen immediately, warmup parallel
- One-shot: no setInterval, no retry. User restart backend to re-warm
- Per-URL error handling: failed fetch logged but does NOT crash backend or stop batch
- Cache key format MUST match proxy route exactly (verified via unit test `cacheKeyFor()`)
- SSRF guard: same host regex `^[a-z0-9-]+\.tiktokcdn\.com$/i` as proxy route

**Verification:** 
```bash
# 1. Backend boot — watch logs:
npm --prefix backend-node start
# Look for: "[BOOT] tiktok-image-prewarm: starting { requested: 200, candidates: 186, concurrency: 10 }"
# End log: "[BOOT] tiktok-image-prewarm: warmed 186/186 imgs in 2340ms"

# 2. Verify cache keys format:
node -e "
const m = require('./backend-node/src/services/tiktok-image-prewarm.js');
const url = 'https://p19-sign.tiktokcdn.com/img/musically-malawi-go-live-gift@320x320.webp?x-expires=1719572400&x-signature=abc';
console.log(m.cacheKeyFor(url));
// → { cacheKey: 'tiktok-img/p19-sign.tiktokcdn.com/img/musically-malawi-go-live-gift@320x320.webp?x-expires=...', host: 'p19-sign.tiktokcdn.com', upstreamPath: 'img/musically-malawi-go-live-gift@320x320.webp?x-expires=...' }
"

# 3. DevTools Network tab — open Gift Browser dropdown:
# First time: CDN request has 'X-Cache: MISS' (fallthrough to upstream)
# Second time within 24h: 'X-Cache: HIT' from _cdnProxyCache (instant)
```

**Pattern principle:** 
> Tính năng obfuscated/native-render bypass our JS-layer patches (timing race, instance rebuild, template re-eval). Pre-populate in-memory caches at boot to eliminate first-hit latency. Cache key format MUST be exact — regex match bằng cách nào đó sẽ lệch giá trị key.

**Related:**
- Gate 33 — network-layer interception for same CDN (Electron main process)
- Gate 21 — bundle-fixtures-sync (similar fire-and-forget pattern for getAllGifts)

---

### Gate 33: Electron webRequest intercept for bundle-bypass CDN URLs (M-002, 2026-05-28)

**Symptom:** Even with Gate 32 pre-warm + blockScript URL-rewrite patches, gift image (itemTemplate) sometimes load từ upstream CDN trực tiếp (cross-origin request không bypass local proxy). User click Sound Alert → dropdown open but some images slow (không hit pre-warm cache). Console: `failed to fetch image blob from https://p19-sign.tiktokcdn.com/...` (cross-origin CORS or bypass).

**Root cause:** Bundle's obfuscated `itemTemplate` native render function fires `fetch()` directly to TikTok CDN (hardcoded URL string, không qua window.fetch — direct native code or separate fetch reference snapshot). Our blockScript patches window.fetch nhưng bundle đã capture fetch trong closure TRƯỚC patch load → patches không có hiệu lực. Timing race: Vue grid rebuild triggers template re-eval, obfuscated function snapshot lại fetch → bypass patches.

**Fix:**
- **Layer:** Electron main process [`electron/main.js:1121-1151`](electron/main.js#L1121)
  - Install `session.defaultSession.webRequest.onBeforeRequest` handler
  - Match URLs: `https://*.tiktokcdn.com/*` + `http://*.tiktokcdn.com/*`
  - For each matching request:
    - Validate hostname matches `^[a-z0-9-]+\.tiktokcdn\.com$/i` (SSRF guard)
    - Redirect to local proxy: `callback({ redirectURL: BACKEND_URL + '/tiktok-img-cache/<host><path><search>' })`
  - URL parse error → let request through (fail-open)

- **Code block** ([`electron/main.js:1133-1150`](electron/main.js#L1133)):
  ```javascript
  const TIKTOK_HOST_RE = /^[a-z0-9-]+\.tiktokcdn\.com$/i;
  const TIKTOK_CACHE_BASE = `${BACKEND_URL}/tiktok-img-cache`;
  sess.webRequest.onBeforeRequest(
      { urls: ['https://*.tiktokcdn.com/*', 'http://*.tiktokcdn.com/*'] },
      (details, callback) => {
          try {
              const u = new URL(details.url);
              if (!TIKTOK_HOST_RE.test(u.hostname)) {
                  return callback({});  // not a TikTok CDN host — let it through
              }
              const redirectURL = `${TIKTOK_CACHE_BASE}/${u.hostname}${u.pathname}${u.search}`;
              return callback({ redirectURL });
          } catch (err) {
              // URL parse failed — let request through unchanged.
              return callback({});
          }
      }
  );
  console.log('[Electron] TikTok CDN intercept installed → ' + TIKTOK_CACHE_BASE + '/*');
  ```

**Design:**
- Hook runs BEFORE renderer sees request — intercept at browser protocol layer (lower than blockScript patches)
- 307 redirect to local proxy → browser cache (Chromium HTTP disk cache) + backend Map cache
- Cache-Control header từ backend (24h TTL) → Electron persist cache across restarts
- Fail-open: URL parse error → let request through unchanged (graceful degradation)
- SSRF-safe: hostname regex exact match `*.tiktokcdn.com` — cannot be redirected to internal IPs

**Verification:**
```bash
# 1. Check webRequest handler installed at Electron boot:
# Terminal console: "[Electron] TikTok CDN intercept installed → http://localhost:5285/tiktok-img-cache/*"

# 2. DevTools Network tab (when app running):
# Filter by "tiktokcdn"
# Expected: ALL *.tiktokcdn.com requests → 307 Temporary Redirect
# Location: http://localhost:5285/tiktok-img-cache/p19-sign.tiktokcdn.com/img/...
# Response status: 307 (from Electron main process layer)

# 3. Restart Electron, re-open Gift dropdown:
# Images should instant-load from disk cache (Chromium HTTP cache):
# DevTools Network → Response Headers: "cache-control: max-age=86400, public"
# "X-Cache: HIT" (from backend _cdnProxyCache if post-recent restart, else from disk cache)

# 4. Verify SSRF guard:
# Test malformed URL: DevTools Console in Electron → fetch('https://127.0.0.1:5285/...') 
# If request happens to have tiktokcdn-like URL, verify it still redirects to proxy, NOT to localhost
# (In practice, bundle only fires tiktokcdn.com domains so this is low-risk, but regex provides defense-in-depth)
```

**Related to blockScript patches:**
- Complements (not replaces) [`blockScript.txt::tfHandleTtsTikfinityUser`](backend-node/src/templates/blockScript.txt) + `tfMockFetch` patches for HTTP-layer interception
- webRequest intercepts at NETWORK layer → catches ALL client requests (native code, fetch snapshot, direct XHR)
- blockScript patches HTTP layer → fallback if webRequest not available or request already in-flight

**Anti-pattern avoided:**
- ❌ Patch Electron's fetch API globally — invasive, incompatible with preload script
- ❌ Install handler in renderer context — Electron webRequest is main-process-only by design
- ❌ Wildcard redirect without hostname validation — SSRF vector (could redirect to localhost, internal IPs)

**Pattern principle:**
> Khi bundle obfuscation làm JS-level patches fragile (timing race, snapshot closure, native code), di-chuyển patch DOWN the stack:
> - blockScript patches HTML-time (DOM render, Vue init)
> - middleware patches response-time (HTTP headers, body transform)
> - **Electron webRequest patches network-time (before Chromium socket layer)**
>
> Lower layers catch bypass attempts từ obfuscated code. webRequest ở Electron main process là **hard boundary** — không có cách bypass nó từ renderer.

---

### Gate 34: Sound Alerts trigger dropdown freeze — wrap loadTriggers for sticky truncation (M-004, 2026-05-28)

> SUPERSEDES the M-003 page-mount truncate poll (removed). M-003 sliced triggerDataSource AFTER refreshDataSource assigned the full 3850 array, but got CLOBBERED because every page navigation re-calls refreshDataSource → reassigns full array. Probe confirmed: `_tfTriggerTruncated:true` yet `length:3936`.

**Symptom:** Sound Alerts trigger dxSelectBox dropdown freezes ~8s (8816ms) on open.

**Root cause (verified via runtime probe + Scout-Bundle-Boot RE):**
- dxSelectBox renders ALL `sounds.triggerDataSource` items synchronously via itemTemplate (deobfuscated.js:13335-13363) → 3845 `<img>` DOM nodes + 3845 CDN fetches in ONE frame = freeze.
- `sounds.refreshDataSource()` (deobfuscated.js:12971) is called on EVERY page navigation (our tfTriggerOverlaysOnVisible + bundle dispatcher). Each call → `loadTriggers()` → reassigns full 3850-item array (deobfuscated.js:12987). Any one-shot truncate gets clobbered by the next refreshDataSource.
- Probe proof: `slice 50 took 0.00ms` → data access fine, freeze is purely DOM render of N items.

**Fix:** `blockScript.txt::tfWrapAndPreloadTriggers` (line ~1129) — wrap `sounds.loadTriggers` at boot so it ALWAYS returns ≤500 items:
```js
var origLoadTriggers = window.sounds.loadTriggers.bind(window.sounds);
window.sounds.loadTriggers = function () {
  return origLoadTriggers.apply(null, arguments).then(function (items) {
    return Array.isArray(items) && items.length > 500 ? items.slice(0, 500) : items;
  });
};
```
Plus WARM at boot (fire loadTriggers once, pure data, NO loadData/DOM) so triggerDataSource ready before user reaches page.

**Why sticky works:** refreshDataSource → loadTriggers (wrapped) → ≤500 result → triggerDataSource always ≤500, regardless of how many times refreshDataSource fires. The wrap is the single chokepoint.

**Scout-Bundle-Boot key findings (deobfuscated.js cites):**
- loadTriggers (13036) = pure data, zero DOM, no channel requirement
- refreshDataSource (12971) calls loadData (13153) which touches DOM → unsafe at boot
- triggerDataSource read by onEditorPreparing closure (13329) at click time → safe to set without loadData

**Tradeoff:** loses ~3300 rare high-diamond gifts. 5 events + emotes + top 495 popular gifts kept. `TRUNCATE_LIMIT` tunable (lower to 200 if 500 still renders slow; raise if users need more gifts).

**Verify:** Ctrl+R → console `[TF-preload-triggers] warmed triggerDataSource: 500`. Probe: `sounds.triggerDataSource.length === 500` STABLE after `refreshDataSource()` (was 3936 in M-003). Dropdown open ~150ms (was 8816ms — 60x improvement).

**If still slow:** dxSelectBox renders even 500 imgs synchronously. Next lever = lower limit OR proper dxSelectBox virtualization (render only ~15 visible via paginated DataSource — the onEditorPreparing patch that had timing issues).

**Related:** Gate 30j (sounds.refreshDataSource discovery), Gate 32 (pre-warm CDN), Gate 33 (Electron intercept).

---

### Gate 35: Overlay/Widget realtime — relay, handshake, guards, assets, settings-live-apply (M-011/012, 2026-06-03/04)

> **Bộ lỗi overlay/widget hay tái phát — fix sẵn + chỗ sửa. ĐỌC trước khi đụng overlay FX / settings-live / widget standalone.** Kiến trúc: control-page (bundle) emit → backend relay → widget (preview iframe HOẶC OBS/standalone qua SharedIO).

**Chuỗi sự kiện widget (PHẢI nhớ):** bundle wrap MỌI client emit thành envelope `socketiowrapper.io.emit("distributeEvent", eventName, payload)` (app deob:70895-70903). Backend PHẢI unwrap `distributeEvent` + relay event con tới socket `appType='widget'`. Widget nhận qua `io.on('<event>')` (flat: cannon.html/gifts.html...; modular: coinjar/index.html). Standalone/OBS dùng **SharedIO** (SharedWorker multiplex) — `downloads/widget/sharedio/sharedioworker.js`, login `{channelId, appType:'widget'}`; backend `handleLogin` BỎ QUA payload.channelId → `findDefault()` (single-channel → cid=1 cả 2 đầu, khớp).

| # | Triệu chứng | Root cause | Fix (file) |
|---|---|---|---|
| **RC-1** | Bấm test overlay (gift/wheel/coin/cannon) KHÔNG nhảy FX | `socket-manager.js` `RELAYABLE_DISTRIBUTE` whitelist chỉ có 3 event (widgetSettings/goalStatus/giftGoalStatus) → drop hết FX events | Mở rộng set: thêm `gift, onLikeReceived, coin-jar:gift/reset, coin-match:start/update/result/reset, onSpinWheel/spinWheel, createCoins/timeoutCoins/collectCoin, updateTopGifter/Liker, updateViewerCount, topGiftData, newTransaction, showCommandResult...` ([socket-manager.js](backend-node/src/services/socket-manager.js)). **No double-fire:** live gift đi `emitWsEvent`→DAPI (transport khác), test đi `emitSocketEvent` `isTest:true` (modules:20249-20651). Relay target LUÔN `'widget'` (không echo controlpage → no reload loop). |
| **RC-A** | Widget reopen / sau khi save abort → nhận settings cũ | Clone thiếu relay `reportWidgetState`→`widgetState` + `widgetConnected` (gốc C# server có) → control-page không re-push live snapshot | Thêm `socket.on('reportWidgetState')` → `broadcastToChannel('widgetState', payload, cid, 'controlpage')` + first-seen (seen-set per channel) → `broadcastToChannel('widgetConnected', {}, cid, 'controlpage')`. Control-page-scoped ONLY ([socket-manager.js](backend-node/src/services/socket-manager.js)). |
| **RC-D** | coinjar/coinmatch nuốt quà im lặng (widget OBS) | Guard `if(!settings.isPro && !preview) return` → `settings` null (cachedSettings chưa có) → `settings.isPro` THROW TypeError | Null-safe + all-pro: `if(!preview && settings && settings.isPro === false) return` ([coinjar/index.html](downloads/widget/coinjar/index.html), coinmatch). |
| **IMG** | Console spam đỏ `drawImage ... 'broken' state` (coin-jar.js) mỗi frame | Ảnh quà/avatar (CDN signed URL hết hạn) load fail → broken → canvas `drawImage` throw InvalidStateError | Proxy ảnh trả **transparent PNG (200)** khi upstream fail thay vì status lỗi → ảnh không bao giờ broken ([index.js](backend-node/src/index.js) `cdnProxyFetch` opts.fallbackImage). |
| **CDN** | Phụ thuộc CDN gốc `tikfinity-assets.b-cdn.net` (credit.png/icons), `assets.tikfinity.com` | Hardcode trong bundle minified, không sửa được | Electron intercept 2 host → `/tf-cdn/<host>/<path>` proxy **cache xuống DISK** `downloads/tf-assets-cache/` → local vĩnh viễn ([electron/main.js](electron/main.js) + [index.js](backend-node/src/index.js)). Pattern giống Gate 33 (tiktokcdn). |
| **DELOG** | Console widget ngập spam | Debug `console.log` lỡ để trong widget (cannon.html Overcrowding/Non-resting mỗi frame) | Gỡ debug log trong `downloads/widget/*.html` khi gặp. |

**⚑ "Đổi setting KHÔNG ăn liền" (lỗi tái phát nhiều nhất) — KẾT LUẬN sau khi trace tận gốc:**

Chuỗi settings-live **ĐÚNG trên giấy**, KHÔNG có bug nhận setting:
- Đổi Customize → `initDxInput.onValueChanged` (app deob:66972) → `settings.set('widget_<id>_<name>', v)` + `obsoverlays.onInputChange()` (modules:19440) → `refreshPublicSettings()` → emit `widgetSettings` (key đã strip prefix → `cannon_ballSize`) → relay → widget.
- **+ đường HTTP:** `tfOverlaySettingsAutosave` (blockScript:465) wrap settings.set → 700ms → POST `/api/updateSettings` → backend `normalizeKey` strip `widget_` → `cannon_ballSize` → `rebuildAndBroadcast`. **Cả 2 đường giao đúng key cho widget.**
- ⚠️ **BẪY:** comment "BLOCK updateSettings" trong blockScript:3648/3980 là **STALE/SAI** — code thật KHÔNG block updateSettings; chỉ chặn `POST /api/me settings.restore` (cái gây reload loop). Đừng nghi nhầm updateSettings bị chặn.

**Cái user tưởng "không ăn" thường là BEHAVIOR GỐC, không phải bug:**
- `ballSize / maxBalls / intensity` (cannon) → đọc lại `window.*` LÚC TẠO BÓNG (cannon.html) → chỉ áp **bóng MỚI**, KHÔNG resize bóng đang bay. Đổi rồi nhìn bóng cũ → tưởng không ăn. Verify: đổi → bắn quà MỚI.
- `showCannon / showGiftPictures` → áp **LIVE** (showCannon có `setInterval` 250ms re-apply opacity).
- **Preview iframe nhỏ** làm cannon overcrowding (xoá bớt bóng) + sàn nhích lên (canvas height theo `window.innerHeight` của iframe vs stretchIframe phóng to) → **CHỈ preview, OBS full màn ĐÚNG.**

**Quy trình debug settings-live (KHÔNG probe iframe lung tung):** thêm log backend `[WS-relay]` trong distributeEvent handler ([socket-manager.js](backend-node/src/services/socket-manager.js)) + `[Broadcast] widgetSettings delivered=N` đã có sẵn; HOẶC thêm `console.log('[<WIDGET> SETTINGS]', ...)` trong `updateSettings()` của widget để in giá trị nhận được. Đổi setting → so giá trị log với cái chỉnh. Khớp = ăn (chỉ là bóng-mới). Không nhảy = đứt đẩy live.

**Standalone/OBS vs Preview:** preview (Electron, `&preview=1`) bypass isPro guard + bị stretchIframe; standalone/OBS (plain browser) dùng SharedIO + KHÔNG có Electron CDN intercept (ảnh tiktokcdn load trực tiếp). Test thật phải ở **standalone full màn**.

---

#### §35-MECH: Cơ chế RESET / ACCUMULATION / STATE từng overlay — tra theo trang (đọc cơ chế gốc trước khi sửa)

> **Mục tra cứu nhanh.** Đang ở trang overlay nào → tìm overlay đó ở đây để biết: nút reset làm gì, state sống ở đâu (FE widget vs BE), có chống-lag không. Khi RE thêm overlay khác → thêm 1 mục con cùng format. **Nguyên tắc chung (áp cho mọi overlay loại physics):** state hiệu ứng (coin/ball/body) sống 100% trong **widget client (ephemeral)**, backend chỉ **relay event** + route HTTP optional, KHÔNG persist. Reset = dọn màn FE, KHÔNG đụng DB, KHÔNG ảnh hưởng overlay khác, an toàn tuyệt đối.

##### ▸ Coin Jar (`coinjar`) — reset & lag (RE gốc 2026-06-04)

**Chuỗi RESET (gốc):** nút "Reset Jar" (icon `fa-rotate-left`, text `obsoverlays_coinjarPro_reset`, trong `#widgetCoinjarProControls`) → `coinJar.resetJar()` = **CHỈ** `socketiowrapper.emitSocketEvent("coin-jar:reset")` (app deob:79938-79952). Không DB write, không persist. **3 đường trigger reset** đều dẫn về cùng 1 socket event:
1. Nút trên card overlay — `coinJar.setupControls` (app:79941).
2. `postMessage({type:'coin-jar-action', action:'reset'})` từ cửa sổ pop-out `coinjarcontrols.html` (app:80136-80143).
3. HTTP `POST /api/widget/coinjar/reset` → `broadcast('coin-jar:reset', {})` (widget.js:95) — cho DAPI/external. ⚠ tên event PHẢI hyphen `coin-jar:reset` (widget chỉ nghe tên này); sai tên = HTTP 200 nhưng overlay không reset.

**Widget nhận** `io.on("coin-jar:reset")` (coinjar/index.html:51) → `window.resetJar()`. Trong `coin-jar.js`, `window.resetJar` xóa **4 thứ**: `l.reset()` (gift QUEUE) + `i.value=0` (counter tổng) + `o.reset()` (last-gift display) + `t.reset()` (leaderboard top gifters) + `n.value?.resetJar()` (xóa **TẤT CẢ physics bodies** trong canvas).

**FE/BE impact (câu trả lời gốc):** Reset **100% FE/widget-side, ephemeral**. Backend **KHÔNG lưu nội dung jar** — coin tích lũy sống hoàn toàn trong widget client. Reset KHÔNG đụng DB, KHÔNG xóa setting/data đã lưu, KHÔNG ảnh hưởng overlay khác — chỉ "dọn màn hình". Jar cũng **tự mất khi widget reload** (không persist) → reset chỉ chủ động làm điều reload vốn tự làm. Backend cho coin-jar là **stateless** (chỉ relay `coin-jar:gift`/`coin-jar:reset` qua RC-1 whitelist + route HTTP optional).

**ACCUMULATION / nguồn LAG-CRASH (user thấy "nhiều quá lag screen"):** `window.addGift(p)` → `l.addGift(p)` push vào **QUEUE**. Gốc có **2 cơ chế chống-lag**:
- **#1 Spawn throttle:** loop `setInterval(o, Ss)`, mỗi tick `i.value.shift()` lấy **1 gift FIFO** → spawn **1 body / `Ss` ms**; `if(now - last < Ss) return`. → quà ồ ạt KHÔNG spawn cùng lúc.
- **#2 Sleeping bodies:** physics (Matter.js-like) coin lắng đáy → `Sleeping.set(body, true)` ngủ, không simulate → CPU thấp; `wakeAllBodies` chỉ wake khi cần.
- **❌ KHÔNG có cap tổng số coin (gốc):** jar KHÔNG auto-xóa coin cũ → body tích lũy **vô hạn** đến khi reset thủ công. Stream dài / test bắn nhiều → hàng nghìn body (dù ngủ vẫn tốn RAM + **mỗi frame vẫn `drawImage` ảnh quà** — cộng hưởng lỗi IMG nếu ảnh broken, xem hàng IMG bảng trên). → lag/crash. **Reset là escape-hatch DUY NHẤT của gốc.**
- 🔧 **Nếu user muốn auto-chống-lag:** đây là **deviation khỏi gốc** (READ-GỐC-FIRST gate → PHẢI báo user trước khi thêm). Cách: thêm FIFO cap trong `n.value` physics — `bodies.length > MAX` → `removeBody` con cũ nhất (giống cannon `maxBalls`). Gốc KHÔNG làm → chỉ thêm khi user yêu cầu rõ.
