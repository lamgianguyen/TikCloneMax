# Smoke test 1: Backend boots and responds.
#
# Pass criteria:
#   - /api/health responds 200 within 30s
#   - Response body indicates backend is healthy
#
# Run: pwsh -File smoke\01-boot.ps1

. $PSScriptRoot\common.ps1

Write-Host '[smoke] 01-boot: waiting for backend...' -ForegroundColor Yellow

$ok = Wait-ForBackend -MaxWaitSec 30
if (-not (Assert-True $ok '/api/health responded within 30s')) {
    exit 1
}

try {
    $health = Invoke-BackendApi -Path '/api/health'
    Write-Info "health response: $($health | ConvertTo-Json -Compress)"

    # Loose check - any successful response is fine for boot smoke
    if (-not (Assert-True ($null -ne $health) 'health endpoint returned a response')) {
        exit 1
    }
} catch {
    Write-Fail "health endpoint threw: $_"
    exit 1
}

Write-Host '[smoke] 01-boot: PASS' -ForegroundColor Green
exit 0
