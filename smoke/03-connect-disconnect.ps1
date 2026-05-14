# Smoke test 3: TikTok connect/disconnect lifecycle.
#
# Tests the live path without requiring a real LIVE account:
#   - POST /api/tiktok/connect accepts username
#   - Bridge transitions to connecting state
#   - POST /api/tiktok/disconnect cleans up
#   - Final status: connected=false, connecting=false
#
# We use a username that's almost certainly offline so we don't depend on
# network/account state. The point is to verify the lifecycle plumbing, not
# that TikTok itself works.
#
# Run: pwsh -File smoke\03-connect-disconnect.ps1

. $PSScriptRoot\common.ps1

Write-Host '[smoke] 03-connect-disconnect: testing connect lifecycle...' -ForegroundColor Yellow

$failures = 0
$testUser = if ($env:TIKMAX_SMOKE_USER) { $env:TIKMAX_SMOKE_USER } else { 'smoke_test_offline_user_12345' }

# 1. Initial state should be disconnected
try {
    $status = Invoke-BackendApi -Path '/api/tiktok/status'
    Write-Info "initial: connected=$($status.connected) connecting=$($status.connecting)"
    if ($status.connected) {
        Write-Info 'already connected — disconnecting first'
        Invoke-BackendApi -Path '/api/tiktok/disconnect' -Method POST | Out-Null
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Fail "initial status check failed: $_"
    $failures++
}

# 2. Issue connect
try {
    $connectResp = Invoke-BackendApi -Path '/api/tiktok/connect' -Method POST -Body @{ username = $testUser }
    Write-Info "connect response: $($connectResp | ConvertTo-Json -Compress)"
    if (-not (Assert-True ($null -ne $connectResp) '/api/tiktok/connect accepted request')) { $failures++ }
} catch {
    Write-Fail "/api/tiktok/connect threw: $_"
    $failures++
}

# 3. Wait briefly for bridge to attempt connection (will fail because user offline)
Write-Info 'waiting 5s for bridge to settle...'
Start-Sleep -Seconds 5

# 4. Disconnect (cleanup) - even if connect failed, this should succeed
try {
    $disconnectResp = Invoke-BackendApi -Path '/api/tiktok/disconnect' -Method POST
    Write-Info "disconnect response: $($disconnectResp | ConvertTo-Json -Compress)"
    if (-not (Assert-True ($null -ne $disconnectResp) '/api/tiktok/disconnect accepted request')) { $failures++ }
} catch {
    Write-Fail "/api/tiktok/disconnect threw: $_"
    $failures++
}

# 5. Final state should be disconnected
Start-Sleep -Seconds 1
try {
    $finalStatus = Invoke-BackendApi -Path '/api/tiktok/status'
    Write-Info "final: connected=$($finalStatus.connected) connecting=$($finalStatus.connecting)"
    if (-not (Assert-True (-not $finalStatus.connected) 'final state: not connected')) { $failures++ }
    if (-not (Assert-True (-not $finalStatus.connecting) 'final state: not connecting')) { $failures++ }
} catch {
    Write-Fail "final status check failed: $_"
    $failures++
}

if ($failures -gt 0) {
    Write-Host "[smoke] 03-connect-disconnect: FAIL ($failures assertion(s) failed)" -ForegroundColor Red
    exit 1
}

Write-Host '[smoke] 03-connect-disconnect: PASS' -ForegroundColor Green
exit 0
