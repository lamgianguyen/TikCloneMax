@echo off
echo === TikFinity Desktop (Dev Mode, .NET Backend) ===
echo.
echo Starting Electron with unified .NET backend...
echo (Port cleanup for zombie processes from previous runs is handled inside
echo  Electron bootstrap — see freeOurPorts() in main.js)

REM Strip env vars that force electron into Node-only mode (breaks GUI)
set ELECTRON_RUN_AS_NODE=
set ELECTRON_NO_ATTACH_CONSOLE=

cd /d "%~dp0electron"
call npx electron .
