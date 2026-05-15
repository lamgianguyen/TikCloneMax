@echo off
REM First-time setup for TikFinity clone on a fresh machine.
REM Run this once after cloning the repo. Subsequent launches use start_desktop.bat.

setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo === TikFinity Clone Setup ===
echo.

REM -- 1. Check prerequisites ----------------------------------------------
echo [1/4] Checking prerequisites...
where dotnet >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] .NET SDK not found. Install .NET 9 SDK from https://dotnet.microsoft.com/download
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('dotnet --version 2^>nul') do set DOTNET_VER=%%v
echo   dotnet: !DOTNET_VER!

where node >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Node.js not found. Install Node.js 18+ from https://nodejs.org
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

REM -- 2. Install npm deps -------------------------------------------------
echo [2/4] Installing electron dependencies...
pushd electron
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo   [ERROR] npm install failed in electron/
        popd
        pause
        exit /b 1
    )
) else (
    echo   electron/node_modules already present, skipping.
)
popd
echo.

echo [3/4] Installing tiktok-bridge dependencies...
pushd tiktok-bridge
if not exist node_modules (
    call npm install
    if errorlevel 1 (
        echo   [ERROR] npm install failed in tiktok-bridge/
        popd
        pause
        exit /b 1
    )
) else (
    echo   tiktok-bridge/node_modules already present, skipping.
)
popd
echo.

REM -- 3. Build backend ----------------------------------------------------
echo [4/4] Building .NET backend...
pushd backend
call dotnet build --nologo -v quiet
if errorlevel 1 (
    echo   [ERROR] dotnet build failed
    popd
    pause
    exit /b 1
)
popd
echo.

echo === Setup complete ===
echo Run start_desktop.bat to launch the app, or start_project.bat for the web version.
echo.
pause
