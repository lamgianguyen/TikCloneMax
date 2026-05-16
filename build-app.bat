@echo off
REM Top-level build wrapper for production installer.
REM
REM Delegates to electron\build.bat which:
REM   1. npm install + @electron/rebuild on backend-node (better-sqlite3 ABI)
REM   2. Stages backend-node + downloads under dist\app\
REM   3. Runs electron-builder to produce NSIS installer + portable .exe
REM
REM Output: electron\dist\  (Setup .exe + portable .exe)
REM
REM End users do NOT need Node.js installed — Electron's embedded Node
REM (ELECTRON_RUN_AS_NODE=1) runs the backend.

setlocal
cd /d "%~dp0electron"
call build.bat
exit /b %errorlevel%
