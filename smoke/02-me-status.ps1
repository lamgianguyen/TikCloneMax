# Smoke test 2: Auth + status canonical flow.
#
# Tests the REAL flow the app uses:
#   - GET /api/me returns 200 with channelId (auth fallback OK)
#   - GET /api/tiktok/status returns 200 with connected=false initially
#   - GET /api/getAppConfig returns modules list (Hidden ones not present)
#
# Run: pwsh -File smoke\02-me-status.ps1

. $PSScriptRoot\common.ps1

Write-Host '[smoke] 02-me-status: testing /api/me + /api/tiktok/status...' -ForegroundColor Yellow

$failures = 0

# 1. /api/me - canonical auth/profile semantics
try {
    $me = Invoke-BackendApi -Path '/api/me'
    Write-Info "me.channelId = $($me.channelId)"

    if (-not (Assert-True ($null -ne $me) '/api/me returned a response')) { $failures++ }
    if (-not (Assert-True ($null -ne $me.channelId -and $me.channelId -gt 0) '/api/me has channelId > 0 (auth fallback works)')) { $failures++ }
} catch {
    Write-Fail "/api/me threw: $_"
    $failures++
}

# 2. /api/tiktok/status - bridge status
try {
    $status = Invoke-BackendApi -Path '/api/tiktok/status'
    Write-Info "status.connected = $($status.connected), connecting = $($status.connecting)"

    if (-not (Assert-True ($status.status -eq 'ok') '/api/tiktok/status returns status=ok')) { $failures++ }
    if (-not (Assert-True ($null -ne $status.connected) '/api/tiktok/status has connected field')) { $failures++ }
} catch {
    Write-Fail "/api/tiktok/status threw: $_"
    $failures++
}

# 3. /api/getAppConfig - feature gating sanity check
try {
    $config = Invoke-BackendApi -Path '/api/getAppConfig'
    $moduleIds = $config.modules | ForEach-Object { $_.id }
    Write-Info "modules visible: $($moduleIds -join ', ')"

    if (-not (Assert-True ($null -ne $config.modules) '/api/getAppConfig returns modules')) { $failures++ }

    # If TIKMAX_ENABLE_UNSTABLE is unset, media/spotify should be hidden
    $unstableOn = ($env:TIKMAX_ENABLE_UNSTABLE -eq '1') -or ($env:TIKMAX_ENABLE_UNSTABLE -eq 'true')
    if (-not $unstableOn) {
        $hasMedia = $moduleIds -contains 'media'
        $hasSpotify = $moduleIds -contains 'spotify'
        if (-not (Assert-True (-not $hasMedia) 'media module hidden (gate works)')) { $failures++ }
        if (-not (Assert-True (-not $hasSpotify) 'spotify module hidden (gate works)')) { $failures++ }
    } else {
        Write-Info 'TIKMAX_ENABLE_UNSTABLE=1, skipping hidden-module checks'
    }
} catch {
    Write-Fail "/api/getAppConfig threw: $_"
    $failures++
}

if ($failures -gt 0) {
    Write-Host "[smoke] 02-me-status: FAIL ($failures assertion(s) failed)" -ForegroundColor Red
    exit 1
}

Write-Host '[smoke] 02-me-status: PASS' -ForegroundColor Green
exit 0
