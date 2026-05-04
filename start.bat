@echo off
title TikFinity
echo Starting TikFinity...
echo.

REM Strip env vars that force electron into Node-only mode (breaks GUI)
set ELECTRON_RUN_AS_NODE=
set ELECTRON_NO_ATTACH_CONSOLE=

cd /d "%~dp0electron"
start "" "node_modules\electron\dist\electron.exe" .

echo TikFinity is starting...
echo Close this window if the app opened successfully.
timeout /t 5
