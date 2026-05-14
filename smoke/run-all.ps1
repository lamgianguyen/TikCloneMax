# Run all smoke tests in order. Exit non-zero if any test fails.
#
# Run: pwsh -File smoke\run-all.ps1
#
# Env vars:
#   TIKMAX_SMOKE_URL    - Backend URL (default: http://localhost:5285)
#   TIKMAX_SMOKE_USER   - TikTok username for connect test (default: dummy offline user)
#   TIKMAX_ENABLE_UNSTABLE  - If '1', skip hidden-module checks in 02

$ErrorActionPreference = 'Continue'
$tests = @(
    '01-boot.ps1',
    '02-me-status.ps1',
    '03-connect-disconnect.ps1'
)

$totalFail = 0
$results = @()

$psHost = (Get-Process -Id $PID).Path

foreach ($test in $tests) {
    $path = Join-Path $PSScriptRoot $test
    Write-Host ''
    Write-Host "================ $test ================" -ForegroundColor Magenta

    & $psHost -NoProfile -File $path
    $code = $LASTEXITCODE

    if ($code -eq 0) {
        $results += [PSCustomObject]@{ Test = $test; Result = 'PASS' }
    } else {
        $results += [PSCustomObject]@{ Test = $test; Result = "FAIL ($code)" }
        $totalFail++
    }
}

Write-Host ''
Write-Host '================ SUMMARY ================' -ForegroundColor Magenta
$results | Format-Table -AutoSize

if ($totalFail -gt 0) {
    Write-Host "$totalFail test(s) failed" -ForegroundColor Red
    exit 1
}

Write-Host 'All smoke tests passed' -ForegroundColor Green
exit 0
