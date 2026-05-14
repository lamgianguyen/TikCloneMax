@echo off
set ELECTRON_RUN_AS_NODE=
set NODE_OPTIONS=
cd /d "%~dp0"
node_modules\electron\dist\electron.exe .
