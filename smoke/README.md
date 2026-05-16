# Smoke Tests

Minimum baseline tests verifying core flows still work after a change.
Run before any high-risk edit (especially `middleware/index-html.js`,
`electron/preload.js` auth seed, `routes/me.js`).

## Setup

1. Start the backend (Electron + backend, or `npm run web` standalone)
2. Backend must respond on `http://localhost:5285`

## Run

```powershell
# All tests
pwsh -File smoke\run-all.ps1

# Individual test
pwsh -File smoke\01-boot.ps1
pwsh -File smoke\02-me-status.ps1
pwsh -File smoke\03-connect-disconnect.ps1
```

## Env vars

| Var | Default | Purpose |
|---|---|---|
| `TIKMAX_SMOKE_URL` | `http://localhost:5285` | Backend URL |
| `TIKMAX_SMOKE_USER` | `smoke_test_offline_user_12345` | TikTok username for connect test (offline expected) |
| `TIKMAX_ENABLE_UNSTABLE` | unset | If `1`, skip hidden-module assertions in `02-me-status` |

## Tests

| # | File | What it checks |
|---|---|---|
| 1 | `01-boot.ps1` | `/api/health` responds 200 within 30s |
| 2 | `02-me-status.ps1` | `/api/me` returns channelId; `/api/tiktok/status` returns connected=false; `/api/getAppConfig` returns the expected modules |
| 3 | `03-connect-disconnect.ps1` | Bridge accepts connect, accepts disconnect, settles to disconnected state |

## Adding a new test

Convention: `NN-name.ps1`. Source `common.ps1` for helpers (`Invoke-BackendApi`, `Assert-True`, `Write-Pass`, etc). Exit 0 on pass, non-zero on fail.

## When tests must be run

- **Mandatory** before merging changes that touch:
  - `backend-node/src/middleware/index-html.js` (bundle injection)
  - `electron/preload.js` auth seed
  - `backend-node/src/routes/me.js` (auth + dynamicSettings shape)
  - `backend-node/src/routes/config.js` (isPro + module list)
  - `backend-node/src/services/widget-settings-cache.js`
  - `backend-node/src/services/tiktok-bridge.js`
- **Recommended** before any release build (`build-app.bat`)
