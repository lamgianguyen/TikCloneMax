# Common helpers for smoke tests.
# Source from each test: . $PSScriptRoot\common.ps1

$script:BackendUrl = if ($env:TIKMAX_SMOKE_URL) { $env:TIKMAX_SMOKE_URL } else { 'http://127.0.0.1:5285' }
$Global:BackendUrl = $script:BackendUrl

function Write-Pass {
    param([string]$Message)
    Write-Host "  PASS  $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    Write-Host "  FAIL  $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "  INFO  $Message" -ForegroundColor Cyan
}

function Assert-True {
    param(
        [Parameter(Mandatory)] [bool]$Condition,
        [Parameter(Mandatory)] [string]$Message
    )
    if ($Condition) {
        Write-Pass $Message
        return $true
    }
    Write-Fail $Message
    return $false
}

function Invoke-BackendApi {
    param(
        [Parameter(Mandatory)] [string]$Path,
        [string]$Method = 'GET',
        [object]$Body = $null,
        [int]$TimeoutSec = 5
    )
    $url = "$BackendUrl$Path"
    $params = @{
        Uri = $url
        Method = $Method
        TimeoutSec = $TimeoutSec
        ErrorAction = 'Stop'
    }
    if ($Body) {
        $params.Body = ($Body | ConvertTo-Json -Compress)
        $params.ContentType = 'application/json'
    }
    return Invoke-RestMethod @params
}

function Wait-ForBackend {
    param([int]$MaxWaitSec = 30)
    $url = "$($Global:BackendUrl)/api/health"
    $deadline = (Get-Date).AddSeconds($MaxWaitSec)
    while ((Get-Date) -lt $deadline) {
        try {
            $null = Invoke-RestMethod -Uri $url -TimeoutSec 2 -ErrorAction Stop
            return $true
        } catch {
            # Retry on connect refused / timeout while backend is starting
        }
        Start-Sleep -Milliseconds 500
    }
    return $false
}
