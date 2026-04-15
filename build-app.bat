@echo off
echo ============================================
echo   TikFinity Clone - Build Script
echo ============================================
echo.

REM Publish .NET backend as self-contained for win-x64
echo [1/3] Publishing .NET backend (self-contained, win-x64)...
dotnet publish backend\TikFinityBackend.csproj -c Release -r win-x64 --self-contained -o dist\app
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: dotnet publish failed. Make sure .NET 9 SDK is installed.
    pause
    exit /b 1
)
echo       Done.
echo.

REM Copy downloads folder (frontend static files)
echo [2/3] Copying frontend files (downloads)...
if exist dist\app\downloads rmdir /s /q dist\app\downloads
xcopy downloads dist\app\downloads /E /I /Q /Y >nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to copy downloads folder.
    pause
    exit /b 1
)
echo       Done.
echo.

REM Copy tiktok-bridge folder (Node.js bridge)
echo [3/3] Copying TikTok bridge...
if exist dist\app\tiktok-bridge rmdir /s /q dist\app\tiktok-bridge
xcopy tiktok-bridge dist\app\tiktok-bridge /E /I /Q /Y >nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to copy tiktok-bridge folder.
    pause
    exit /b 1
)
echo       Done.
echo.

echo ============================================
echo   Build complete!  Output: dist\app\
echo ============================================
echo.
echo To run the app, use: dist\start.bat
echo.
echo NOTE: Node.js must be installed on the target
echo       machine for the TikTok bridge to work.
echo       Download from: https://nodejs.org/
echo.
pause
