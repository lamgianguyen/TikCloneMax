# BUNDLE_UPDATE.md — runbook khi có bundle obfuscated MỚI

> **Đây là cái khác biệt của harness.** Khi user đưa bộ TikFinity combo mới (`app.js` / `modules.js` / `modules.css` / `ui.css`), bạn KHÔNG viết lại test. Bạn **chạy lại RE pipeline + chỉnh vài needle**. L1/L2/L3 (API / Socket / Widget) test backend của TA → pass nguyên si. Chỉ L4 gate-health (anchor trong bundle) có thể drift → bạn vá needle ở [`registry.js::gates`](registry.js).

**Nguyên tắc vàng:** harness **EXTENDS**, không restart. Bạn cập nhật **needles + specs**, KHÔNG rewrite test code mỗi lần bundle đổi.

---

## Bước 0 — Đọc trước

- [CLAUDE.md §9 Bundle Management](../CLAUDE.md) — điều kiện update + "Sau update phải verify".
- [CLAUDE.md §Gate 22](../CLAUDE.md) — RE pipeline đầy đủ (cái bạn sắp chạy lại).
- [README.md](README.md) — cấu trúc harness + MODULE CONTRACT.

---

## Bước 1 — Backup `downloads/combo/` (BẮT BUỘC trước khi đụng)

Bundle là **Critical Bundle Risk** (CLAUDE.md §3). Backup có suffix ngày, KHÔNG overwrite (CLAUDE.md §5):

```powershell
$stamp = Get-Date -Format 'yyyy-MM-dd'
Copy-Item -LiteralPath 'downloads/combo' -Destination "downloads/combo.bak-$stamp-pre-update" -Recurse -Force
Get-ChildItem -LiteralPath 'downloads/combo',"downloads/combo.bak-$stamp-pre-update" -Recurse |
  Measure-Object -Property Length -Sum   # verify backup size khớp
```

Rollback nếu cần (CLAUDE.md §5):
```powershell
Move-Item  -LiteralPath 'downloads/combo' -Destination "downloads/combo.failed-$stamp"
Copy-Item  -LiteralPath "downloads/combo.bak-$stamp-pre-update" -Destination 'downloads/combo' -Recurse -Force
```

## Bước 2 — Drop file mới vào `downloads/combo/`

Thay 4 file: `app.js`, `modules.js`, `modules.css`, `ui.css`. (User tự download từ `https://tikfinity.zerody.one/` — CLAUDE.md §9: DevTools Network → reload → save 4 file.)

## Bước 3 — Re-run RE pipeline (Gate 22, verbatim)

Tái sinh decompiled + contracts để gate-health + bạn có symbol mới mà grep:

```powershell
# (optional) nếu có HAR mới — merge trước:
node --max-old-space-size=6144 scripts/decompile/merge-har.js

# webcrack 2 bundle → decompiled/ (READ-ONLY artifact, đừng sửa tay)
npx webcrack downloads/combo/modules.js -o decompiled/modules
npx webcrack downloads/combo/app.js     -o decompiled/app

# extract API contracts từ HAR/bundle
node scripts/decompile/extract-contracts.js
```

> Shortcut: repo có `npm run reverse` (= `node scripts/decompile/run-all.js`) chạy cả pipeline; `npm run reverse:no-decompile` bỏ qua webcrack. Dùng lệnh verbatim ở trên nếu muốn kiểm soát từng bước.

Sau khi xong, diff để thấy bundle đổi gì (CLAUDE.md §Gate 22):
```powershell
git diff docs/API_CONTRACTS.md               # server gốc đổi shape field nào?
git diff decompiled/modules/deobfuscated.js  # function nào bundle thêm/sửa/dời?
```

## Bước 4 — Chạy harness, đọc gate-health

```powershell
node qa/run-all.js
```

Nhìn kết quả **L4 gate-health**. Mỗi **DRIFT** (FAIL ở `gate.*`) = anchor của 1 Gate đã **dời chỗ trong bundle** → giả định của Gate đó có thể đã vỡ. (Nếu `gate-health.test.js` chưa build → nó SKIP; build module này là điều kiện để bước 5 chạy được.)

## Bước 5 — Vá từng drift (vòng lặp tới khi gate-health xanh)

Với MỖI gate drift:

1. **Grep decompiled cho symbol MỚI** thay cho needle cũ:
   ```powershell
   # ví dụ Gate 35 needle 'distributeEvent' không còn → tìm tên mới quanh chỗ wrap emit
   node -e "const t=require('fs').readFileSync('decompiled/app/deobfuscated.js','utf8'); const i=t.indexOf('io.emit'); console.log(t.slice(i-200,i+200))"
   ```
   (hoặc dùng tool Grep trên `decompiled/modules/deobfuscated.js` / `decompiled/app/deobfuscated.js`.)
2. **Cập nhật fix trong template liên quan** (thường `backend-node/src/templates/blockScript.txt` / `earlyCss.txt`, hoặc route) nếu logic Gate dựa vào symbol vừa đổi. Backup template trước khi sửa (CLAUDE.md §5, High Risk).
3. **Cập nhật needle** trong [`qa/registry.js::gates`](registry.js) thành symbol mới:
   ```js
   { id: 'gate.35.distribute', gate: 'Gate 35', kind: 'needleInDecompiled',
     needle: '<SYMBOL MỚI>', severity: 'HIGH' }
   ```
4. **Re-run** `node qa/run-all.js` → lặp tới khi mọi `gate.*` PASS.

> Bạn chỉ sửa **needle + template fix**. KHÔNG sửa `gate-health.test.js` (logic check). Đó là ý nghĩa "extend, không rewrite".

## Bước 6 — Chạy L1/L2/L3 (api/socket/widget)

```powershell
node qa/run-all.js --only api,socket,widget
```

3 lớp này test **backend của TA** → đáng lẽ **pass không đổi** dù bundle mới. Bất kỳ **FAIL mới** nào ở đây = **integration break thật** (vd bundle đổi event name nó emit, đổi shape nó POST, đổi path widget nó load) → fix backend/route/widget cho khớp. Đọc evidence + fixHint trong FIXLOG block để biết chỗ sửa.

## Bước 7 — Verify in-app (manual smoke, CLAUDE.md §9 "Sau update phải verify")

Restart Electron rồi kiểm tay:

- [ ] Login flow
- [ ] Profile switch (Stream Profile dropdown)
- [ ] Sub-sidebar / navigation
- [ ] TikTok connect/disconnect + chat events vào Activity Feed
- [ ] TTS voice picker (AI/Pro/Free tab) + reader
- [ ] Topbar: Pro chip "100k", PRO badge, LIVE/Disconnected status
- [ ] i18n keys mới (chạy `node backend-node/scripts/extract-new-i18n.js` nếu modal hiện raw key)
- [ ] Overlay/Widget: bấm test gift/wheel/coin → FX nhảy (Gate 35)
- [ ] Console không lỗi nghiêm trọng

Fail ở critical item → **rollback bundle** (Bước 1) trước khi debug lâu.

## Bước 8 — Commit

Theo standing rule của user — push LUÔN kèm doctrine files:

```
CLAUDE.md  FIXLOG.md  TEST_STATUS.md  qa/registry.js  (+ template/route đã sửa)
```

Commit message rõ "bundle update <ngày> + gate needles refreshed". Ghi vào FIXLOG entry thường (ngoài block QA-AUTO) gate nào drift + symbol cũ→mới, để lần update sau tra nhanh.

---

## Tóm tắt — cái gì đổi, cái gì KHÔNG

| Khi bundle mới | Hành động |
|---|---|
| **L1 API / L2 Socket / L3 Widget** | KHÔNG đổi test. Pass = OK. FAIL = integration break thật → fix backend/widget |
| **L4 gate-health drift** | Grep symbol mới → vá template fix + cập nhật `registry.js::gates` needle |
| **Test code (`qa/modules/*`)** | KHÔNG rewrite. Chỉ sửa khi muốn thêm KIND of check mới (xem README "How to EXTEND") |
| **`decompiled/*`** | Tái sinh bằng webcrack (Bước 3). READ-ONLY — đừng sửa tay |

Cross-links: [README.md](README.md) · [.codex/team/qa-team.md](../.codex/team/qa-team.md) · [CLAUDE.md](../CLAUDE.md) §0.0 / §9 / §Gate 22 / §Gate 35.
