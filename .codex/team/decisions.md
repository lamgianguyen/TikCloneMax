# Decisions Log (append-only)

> Immutable record of decisions made during multi-agent operations.
> Newest at top. Never edit prior entries — append corrections as new entries.

## 2026-05-27

- **08:25** Commander: Gate 30i v4 — fixed all field names per runtime probe of dxDataGrid columns config. Wrong: isEnabled/triggerLabel/url/name/keyShortcut. Right: enabled/triggerName/soundUrl/soundName/shortcut. Added `createdAt` ISO date. id must be STRING not number. Migration logic detects v2/v3 bad schemas + re-seeds.
- **08:18** Commander: Gate 30i v3 — added `id` field to seeded sound alert rows + migration logic for prior bad seeds (dxDataGrid keyExpr='id' threw E1046)
- **08:10** Commander: created `.codex/team/` war-room scaffold per Space Marine doctrine
- **08:10** Commander: tikmax-doctrine skill installed at `.codex/skills/tikmax-doctrine/SKILL.md`

## 2026-05-26

(See CLAUDE.md Gate 30 series for pre-doctrine decisions)

---

## Doctrine note: PROBE BEFORE SEED

Gate 30i went through 4 iterations because we **seeded blind without probing** bundle's exact dxDataGrid column config. Lesson for future Librarian/Engineer:
- ALWAYS probe `dxDataGrid('instance').option('columns')` to get exact field names
- Probe `dataType` (string vs number vs boolean vs date)
- Probe `keyExpr` for unique key requirement
- Save schema to skill file (`tikmax-tts-debug/SKILL.md`) so future sessions don't repeat
