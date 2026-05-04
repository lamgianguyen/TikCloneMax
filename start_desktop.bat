@echo off
echo === TikFinity Desktop (Dev Mode, .NET Backend) ===
echo.
echo Starting Electron with unified .NET backend...

REM Strip env vars that force electron into Node-only mode (breaks GUI)
set ELECTRON_RUN_AS_NODE=
set ELECTRON_NO_ATTACH_CONSOLE=

cd /d "%~dp0electron"
call npx electron .
