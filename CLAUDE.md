# TikFinity Clone - Project Instructions

## Project Overview
Node.js backend serving an obfuscated TikFinity frontend from `downloads/`. Backend in `backend-node/`, frontend bundle in `downloads/combo/`. Wrapped in an Electron shell (`electron/`) so end users get a single installable desktop app.

## Tech Stack
- **Backend**: Node 20 + Express 4 + Socket.IO v4
- **DB**: better-sqlite3 + Knex (migrations only). File: `<userData>/tikfinity-data/tikfinity.db`
- **Auth**: jsonwebtoken (HS256, 7-day) + bcryptjs
- **TikTok LIVE**: `tiktok-live-connector` v2, embedded in-process (no subprocess hop)
- **Frontend**: Obfuscated Vue 3 bundle, served from cache. ~180 KB of HTML/JS injected at request time via `middleware/index-html.js`
- **Electron shell**: spawns the Node backend via `ELECTRON_RUN_AS_NODE` when packaged, plain `node` in dev
- **Server**: http://localhost:5285
- **Auth gate**: TikfinityServer at 127.0.0.1:5194 (Serial Key validation, called from `routes/key-auth.js`)

## Key Architecture
- `backend-node/src/index.js` — Express + Socket.IO bootstrap, mounts every router under `/api/*`, then mounts `express.static(downloads/)` so unported endpoints fall through to the bundle's pre-recorded JSON fixtures
- `backend-node/src/middleware/index-html.js` — serves `downloads/index.html` with ~180 KB of HTML/JS injection (PostHog/Sentry stubs, auth bridge, login UI, TikTok connect hooks, XHR/fetch monkey-patches). Result cached per (channelId, channelName)
- `backend-node/src/services/tiktok-bridge.js` — embedded TikTok LIVE bridge. On `chat`/`gift`/`like`/etc. events, forwards via Socket.IO + bumps goal counters + awards points + dispatches webhooks + runs chat-command matcher
- `backend-node/src/services/widget-settings-cache.js` — single source of truth for the widget settings bag. Defaults (~200 keys) + DB overrides, broadcast to widgets on save
- API fallback handler catches unhandled `/api/{**path}` routes and logs `[404]` warnings
- PostHog feature flag `new-navigation` controls modern top-nav layout
- Frontend expects `createNavigation()` global function (injected since it's missing from the obfuscated bundle)

## Running

### Dev
```bash
# Full app (Electron + backend-node)
start_desktop.bat

# Backend only (no Electron shell — useful for curl testing)
npm run web
# or
cd backend-node && PORT=5285 node src/index.js
```

### Production build
```bash
# Output: electron/dist/  (NSIS installer + portable .exe)
build-app.bat
```

End users do NOT need Node.js installed — Electron's embedded Node runs the backend.

## Ports
| Port  | Service                          | Notes                                  |
|-------|----------------------------------|----------------------------------------|
| 5285  | Node backend (Express + Socket.IO) | Bundle's HTTP target                 |
| 5194  | TikfinityServer (NOT in this repo) | Auth gate, Serial Key validation     |
| 21213 | Desktop API WebSocket (`electron/wsserver.js`) | Streamerbot plugin endpoint |

## Superpowers Skills
This project uses [superpowers](https://github.com/obra/superpowers) skills framework.

Skills are located at: `../superpowers/skills/`

Available skills:
- `superpowers:brainstorming` - Refine ideas before coding
- `superpowers:writing-plans` - Create detailed implementation plans
- `superpowers:executing-plans` - Execute plans with checkpoints
- `superpowers:test-driven-development` - TDD red/green/refactor
- `superpowers:systematic-debugging` - 4-phase root cause debugging
- `superpowers:verification-before-completion` - Verify before declaring done
- `superpowers:subagent-driven-development` - Parallel agent workflows
- `superpowers:dispatching-parallel-agents` - Concurrent subagent dispatch
- `superpowers:writing-skills` - Create new skills
- `superpowers:using-git-worktrees` - Isolated development branches
- `superpowers:requesting-code-review` - Pre-review checklist
- `superpowers:receiving-code-review` - Respond to feedback
- `superpowers:finishing-a-development-branch` - Merge/PR workflow

**Rule: Invoke relevant skills BEFORE any response or action.**
