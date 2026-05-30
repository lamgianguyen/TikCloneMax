# `.codex/skills/` — TikMax skill registry

## Active skill

| Skill | File | Purpose |
|---|---|---|
| **tikmax** | [`tikmax/SKILL.md`](tikmax/SKILL.md) | Master skill — doctrine + architecture + operating playbooks (TTS, i18n, profile switch, bundle update, CDN cache). Read this for ANY TikMax work. |

## Deprecated (merged into `tikmax/SKILL.md` on 2026-05-28)

- `tikmax-core` → §2 Architecture
- `tikmax-doctrine` → §1 Doctrine (8-10 agent team, ALWAYS-ON, Commander autonomy)
- `tikmax-tts-debug` → §3.1 TTS playbook
- `tikmax-debug-locale` → §3.2 i18n playbook
- `tikmax-profile-switch` → §3.3 Profile switch playbook
- `tikmax-bundle-update` → §3.4 Bundle update playbook

**Why consolidated:** 6 split skill files caused Claude to read the wrong file or skip content. One master skill = single source of truth, predictable read path.

## Composition with superpowers

The `tikmax` skill is an **operational playbook** — it encodes TikMax-specific knowledge.

Combine with `superpowers` (framework, not replacement):
- `superpowers:systematic-debugging` — bug investigation methodology
- `superpowers:writing-plans` — multi-step feature implementation
- `superpowers:verification-before-completion` — never claim "done" without verify

Order: read `tikmax/SKILL.md` first (knows the repo) → apply superpowers methodology.

## Adding a new playbook

Don't create a new skill directory. Add a new `§3.N <topic>` subsection inside `tikmax/SKILL.md` and update §3 table of contents.

If skill grows past ~1000 lines, consider splitting — but keep ONE entry-point skill so Claude doesn't dispatch to wrong file.

## File layout

```
.codex/
├── skills/
│   ├── README.md             ← This file
│   └── tikmax/SKILL.md       ← ALL skill content (read this for any TikMax work)
└── team/                     ← War-room (shared by all agents)
    ├── current_mission.md    ← Active mission status board
    ├── current_state.json    ← Machine-readable progress + team_roster
    ├── decisions.md          ← Decisions log (append-only)
    ├── mission-NNN-reconciliation.md  ← Commander synth reports
    ├── scout-*-report.md     ← Per-Scout findings
    └── *.bak-*               ← Historical state snapshots (gitignored)
```

## Related repo docs

| Doc | Purpose |
|-----|---------|
| `../../CLAUDE.md` | Gate system + Risk Tiers + Verification Matrix + Order of fixes |
| [`general-coding-hygiene.md`](general-coding-hygiene.md) | General LLM coding hygiene (Karpathy skills, 2026-05-31) — verbatim source; distilled into CLAUDE.md §1.12. Reconciles "ask if uncertain" with §2.1 Commander autonomy. |
| `../../docs/ARCHITECTURE.md` | Process tree + routes + data flow |
| `../../docs/MIGRATION_PLAN.md` | C# → Node migration history |
| `../../docs/GATES_ARCHIVED.md` | Superseded gates (historical context) |
| `../../decompiled/modules/deobfuscated.js` | Reverse-engineered bundle (grep target, read-only) |
| `~/.claude/projects/c--Users-nguyenlg-Documents-TikMax/memory/` | Cross-session feedback memory |
