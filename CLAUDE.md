# TikFinity Clone - Project Instructions

## Project Overview
.NET 9 backend serving an obfuscated TikFinity frontend from `downloads/`. Backend is in `backend/`, frontend bundle in `downloads/combo/`.

## Tech Stack
- Backend: .NET 9, Entity Framework Core, SQL Server
- Frontend: Obfuscated Vue 3 bundle (served from memory cache)
- Bridge: Node.js TikTok bridge via WebSocket (port 5286)
- Server runs on: http://localhost:5285

## Key Architecture
- `backend/Program.cs` contains the main server + `BuildIndexHtml()` which injects ~2000 lines of JS (PostHog/Sentry stubs, auth bridge, login UI, TikTok connect hooks, XHR/fetch monkey-patches)
- Frontend expects `createNavigation()` global function (injected by Program.cs since it's missing from the downloaded bundle)
- PostHog feature flag `new-navigation` controls modern top-nav layout
- API fallback handler catches unhandled `/api/{**path}` routes and logs warnings

## Running
```bash
cd backend && dotnet run
```

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
