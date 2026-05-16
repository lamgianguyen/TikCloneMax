@echo off
setlocal
echo === TikFinity Desktop Build (Node backend) ===
echo.

set ROOT=%~dp0..
set STAGE=%ROOT%\dist\app

if exist "%STAGE%" rmdir /s /q "%STAGE%"
mkdir "%STAGE%"

echo [1/4] Installing Node backend deps + rebuilding native modules for Electron...
pushd "%ROOT%\backend-node"
call npm install --omit=dev --no-fund --no-audit
if %errorlevel% neq 0 (
    echo ERROR: backend-node npm install failed!
    popd
    pause
    exit /b 1
)
popd

:: Rebuild better-sqlite3 against Electron's Node ABI so the embedded Node
:: runtime (ELECTRON_RUN_AS_NODE) can load the prebuilt binary. @electron/rebuild
:: auto-detects the Electron version installed in this directory.
echo     Rebuilding better-sqlite3 for Electron ABI...
pushd "%~dp0"
call npm install --no-fund --no-audit --no-save @electron/rebuild
call npx @electron/rebuild -f -w better-sqlite3 -m "%ROOT%\backend-node"
popd
if %errorlevel% neq 0 (
    echo ERROR: @electron/rebuild on better-sqlite3 failed.
    echo If the prebuilt is missing, you may need a C++ toolchain. See:
    echo   https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md
    pause
    exit /b 1
)

echo     Staging backend-node \(electron-builder will filter out data/node_modules cache/.git\)...
xcopy "%ROOT%\backend-node" "%STAGE%\backend-node" /E /I /Q /Y >nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to stage backend-node!
    pause
    exit /b 1
)

echo [2/4] Copying frontend (downloads) into stage...
xcopy "%ROOT%\downloads" "%STAGE%\downloads" /E /I /Q /Y >nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy downloads!
    pause
    exit /b 1
)

echo [3/4] Installing Electron dependencies...
call npm install --no-fund --no-audit
if %errorlevel% neq 0 (
    echo ERROR: Electron npm install failed!
    pause
    exit /b 1
)

echo [4/4] Packaging Electron app (electron-builder)...
call npx electron-builder --win
if %errorlevel% neq 0 (
    echo ERROR: Electron build failed!
    pause
    exit /b 1
)

echo.
echo === Build complete! Output in electron\dist\ ===
echo.
echo NSIS installer:  electron\dist\TikFinity Setup 1.0.0.exe
echo Portable build:  electron\dist\TikFinity 1.0.0.exe
echo.
pause
