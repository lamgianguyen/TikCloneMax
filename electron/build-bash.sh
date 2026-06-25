#!/bin/bash
ROOT="C:/Users/nguyenlg/Documents/TikMax/TikCloneMax"
STAGE="$ROOT/dist/app"
log(){ echo "[$(date +%H:%M:%S)] $*"; }

log "[1/6] clean stage $STAGE"
rm -rf "$STAGE" && mkdir -p "$STAGE" || { log "FAIL clean"; exit 1; }

log "[2/6] backend npm install --omit=dev (vài phút)"
( cd "$ROOT/backend-node" && npm install --omit=dev --no-fund --no-audit ) || { log "FAIL backend-npm"; exit 1; }

log "[3/6] @electron/rebuild better-sqlite3 cho Electron ABI"
( cd "$ROOT/electron" && npm install --no-fund --no-audit --no-save @electron/rebuild \
  && npx @electron/rebuild -f -w better-sqlite3 -m "$ROOT/backend-node" ) || { log "FAIL electron-rebuild"; exit 1; }

log "[4/6] stage backend-node + downloads (copy lớn)"
cp -r "$ROOT/backend-node" "$STAGE/backend-node" || { log "FAIL copy backend"; exit 1; }
cp -r "$ROOT/downloads" "$STAGE/downloads" || { log "FAIL copy downloads"; exit 1; }

log "[5/6] electron npm install"
( cd "$ROOT/electron" && npm install --no-fund --no-audit ) || { log "FAIL electron-npm"; exit 1; }

log "[6/6] electron-builder --win (download electron + nsis, đóng gói)"
( cd "$ROOT/electron" && npx electron-builder --win ) || { log "FAIL electron-builder"; exit 1; }

log "=== BUILD DONE ==="
ls -la "$ROOT/electron/dist/"*.exe 2>/dev/null
