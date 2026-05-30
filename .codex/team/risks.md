# Risks Tracker (append-only)

> Known risks identified by agents. Apothecary + Chaplain append here.

## Open risks

### From session 2026-05-27
- **PENDING-RESTART**: 2 migrations (RevokedTokens FK, composite indexes) not yet applied — require Electron restart
- **PENDING-RESTART**: /myinstants-proxy/* route added but not loaded — require Electron restart
- **UNTESTED**: setInterval stabilize guards (Gate Task #6) — no long-session test yet (need 60s+ idle to confirm clearInterval fires)
- **UNTESTED**: cookie injection allowlist (Gate Task #7) — no negative test (malicious langCode)
- **UNTESTED**: HTML JSON escape (Gate Task #8) — no `</script>` poison-payload test
- **OBSERVED**: bundle's `settings.get()` lowercases keys — easy to miss, need probe before seeding any localStorage default (Gate 30i v1 was wrong because of this)

## Resolved risks

(empty)

## Risk severity legend

- **CRITICAL**: data loss, security exploit, app boot failure
- **HIGH**: feature broken for normal user
- **MEDIUM**: feature degraded, workaround exists
- **LOW**: cosmetic, edge case, non-blocking
