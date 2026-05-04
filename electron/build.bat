@echo off
setlocal
echo === TikFinity Desktop Build ===
echo.

set ROOT=%~dp0..

echo [1/5] Publishing .NET backend (self-contained, win-x64)...
dotnet publish "%ROOT%\backend\TikFinityBackend.csproj" -c Release -r win-x64 --self-contained -o "%ROOT%\dist\app"
if %errorlevel% neq 0 (
    echo ERROR: Backend publish failed!
    pause
    exit /b 1
)

echo [2/5] Copying frontend (downloads) into dist\app...
if exist "%ROOT%\dist\app\downloads" rmdir /s /q "%ROOT%\dist\app\downloads"
xcopy "%ROOT%\downloads" "%ROOT%\dist\app\downloads" /E /I /Q /Y >nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy downloads!
    pause
    exit /b 1
)

echo [3/5] Installing TikTok bridge deps + copying into dist\app...
pushd "%ROOT%\tiktok-bridge"
call npm install --production
popd
if %errorlevel% neq 0 (
    echo ERROR: bridge npm install failed!
    pause
    exit /b 1
)
if exist "%ROOT%\dist\app\tiktok-bridge" rmdir /s /q "%ROOT%\dist\app\tiktok-bridge"
xcopy "%ROOT%\tiktok-bridge" "%ROOT%\dist\app\tiktok-bridge" /E /I /Q /Y >nul

echo [4/5] Installing Electron dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Electron npm install failed!
    pause
    exit /b 1
)

echo [5/5] Packaging Electron app (electron-builder)...
call npx electron-builder --win
if %errorlevel% neq 0 (
    echo ERROR: Electron build failed!
    pause
    exit /b 1
)

echo.
echo === Build complete! Output in electron\dist\ ===
pause
