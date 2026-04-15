@echo off
echo === TikFinity Desktop (Dev Mode, .NET Backend) ===
echo.
echo Starting Electron with unified .NET backend...

cd /d "%~dp0electron"
call npx electron .
