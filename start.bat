@echo off
title TikFinity
echo Starting TikFinity...
echo.

cd /d "%~dp0electron"
start "" "node_modules\electron\dist\electron.exe" .

echo TikFinity is starting...
echo Close this window if the app opened successfully.
timeout /t 5
