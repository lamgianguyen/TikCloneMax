@echo off
REM First-time setup for TikFinity clone on a fresh machine.
REM Run this once after cloning. Subsequent launches use start_desktop.bat.
REM
REM Installs deps in: backend-node\, electron\

setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo === TikFinity Clone Setup (Node backend) ===
echo.

REM -- 1. Check prerequisites ----------------------------------------------
echo [1/3] Checking prerequisites...
where node >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Node.js not found. Install Node.js 20+ from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version 2^>nul') do set NODE_VER=%%v
echo   node: !NODE_VER!

where npm >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] npm not found.
    pause
    exit /b 1
)
echo   OK
echo.

REM -- 2. Install backend-node deps ----------------------------------------
echo [2/3] Installing backend-node dependencies...
pushd backend-node
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo   [ERROR] npm install failed in backend-node\
        popd
        pause
        exit /b 1
    )
) else (
    echo   backend-node\node_modules already present, skipping.
)
popd
echo.

REM -- 3. Install electron deps --------------------------------------------
echo [3/3] Installing electron dependencies...
pushd electron
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo   [ERROR] npm install failed in electron\
        popd
        pause
        exit /b 1
    )
) else (
    echo   electron\node_modules already present, skipping.
)
popd
echo.

echo === Setup complete ===
echo.
echo   Dev launch:        start_desktop.bat   (Electron + backend-node)
echo   Backend only:      npm run web         (port 5285, no Electron shell)
echo   Production build:  build-app.bat       (NSIS installer + portable)
echo.
pause
