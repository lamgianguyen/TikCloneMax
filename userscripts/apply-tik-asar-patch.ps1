param([switch]$Rollback)

$TIKFINITY_DIR = "$env:LOCALAPPDATA\Programs\tikfinity\resources"
$ASAR_PATH     = "$TIKFINITY_DIR\app.asar"
$BACKUP_PATH   = "$TIKFINITY_DIR\app.asar.bak-original"
$EXTRACT_DIR   = "$env:TEMP\tik-asar-patch"
$SCRIPT_DIR    = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($Rollback) {
    if (-not (Test-Path $BACKUP_PATH)) { Write-Error "Khong tim thay backup: $BACKUP_PATH"; exit 1 }
    Copy-Item -LiteralPath $BACKUP_PATH -Destination $ASAR_PATH -Force
    Write-Host "OK - Da rollback ve ban goc" -ForegroundColor Green
    exit 0
}

Write-Host "TikFinity Pro Asar Patch" -ForegroundColor Cyan
Write-Host "Asar: $ASAR_PATH"

foreach ($f in @($ASAR_PATH, "$SCRIPT_DIR\tf-pro-patch.js", "$SCRIPT_DIR\tf-pro-renderer.js")) {
    if (-not (Test-Path $f)) { Write-Error "Thieu file: $f"; exit 1 }
}

if (-not (Test-Path $BACKUP_PATH)) {
    Copy-Item -LiteralPath $ASAR_PATH -Destination $BACKUP_PATH -Force
    Write-Host "Backup: $BACKUP_PATH" -ForegroundColor Yellow
}

if (Test-Path $EXTRACT_DIR) { Remove-Item -Recurse -Force $EXTRACT_DIR }

Write-Host "Extracting asar..."
npx --yes @electron/asar extract $ASAR_PATH $EXTRACT_DIR
if ($LASTEXITCODE -ne 0) { Write-Error "Extract asar that bai"; exit 1 }

$indexPath = "$EXTRACT_DIR\index.js"
$indexContent = Get-Content -Raw $indexPath

if ($indexContent.Contains('tf-pro-patch')) {
    Write-Host "index.js da duoc patch roi. Dang ghi de..." -ForegroundColor Yellow
}

$patchAppend = @'

// === TikMax Pro Patch ===
var _tfProPatchContent = '';
try {
  _tfProPatchContent = require('fs').readFileSync(require('path').join(__dirname, 'tf-pro-patch.js'), 'utf8');
} catch(e) {
  console.warn('[TF-PRO] Could not load tf-pro-patch.js:', e.message);
}
'@

$pattern     = "(writeFile\(path\.join\(RES_DIR,\s*'main\.js'\),\s*)mainJsResponse\.data(,)"
$replacement = '${1}(mainJsResponse.data + (_tfProPatchContent ? "\\n\\n" + _tfProPatchContent : ""))${2}'
$patchedIndex = $indexContent -replace $pattern, $replacement

if ($patchedIndex -eq $indexContent) {
    Write-Error "Khong tim thay vi tri patch trong index.js. App co the da doi cau truc."
    Remove-Item -Recurse -Force $EXTRACT_DIR
    exit 1
}

$patchedIndex = $patchedIndex + $patchAppend
[System.IO.File]::WriteAllBytes($indexPath, [System.Text.Encoding]::UTF8.GetBytes($patchedIndex))

Copy-Item -LiteralPath "$SCRIPT_DIR\tf-pro-patch.js"    -Destination "$EXTRACT_DIR\tf-pro-patch.js"    -Force
Copy-Item -LiteralPath "$SCRIPT_DIR\tf-pro-renderer.js" -Destination "$EXTRACT_DIR\tf-pro-renderer.js" -Force
Write-Host "Da copy tf-pro-patch.js + tf-pro-renderer.js"

Write-Host "Repacking asar..."
npx @electron/asar pack $EXTRACT_DIR $ASAR_PATH
if ($LASTEXITCODE -ne 0) { Write-Error "Repack asar that bai"; exit 1 }

Remove-Item -Recurse -Force $EXTRACT_DIR

Write-Host ""
Write-Host "PATCH THANH CONG!" -ForegroundColor Green
Write-Host "Mo TikFinity binh thuong -> Pro tu kich hoat sau moi lan load." -ForegroundColor Green
Write-Host "Rollback: .\apply-tik-asar-patch.ps1 -Rollback" -ForegroundColor DarkGray
