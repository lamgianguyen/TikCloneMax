@echo off
echo === TikFinity Desktop Build ===
echo.

echo [1/4] Publishing C# backend...
cd /d "%~dp0..\backend"
dotnet publish -c Release -r win-x64 --self-contained -o bin\Release\net9.0\publish
if %errorlevel% neq 0 (
    echo ERROR: Backend publish failed!
    pause
    exit /b 1
)

echo [2/4] Installing TikTok bridge dependencies...
cd /d "%~dp0..\tiktok-bridge"
call npm install --production
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo [3/4] Installing Electron dependencies...
cd /d "%~dp0"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Electron npm install failed!
    pause
    exit /b 1
)

echo [4/4] Building Electron app...
call npx electron-builder --win
if %errorlevel% neq 0 (
    echo ERROR: Electron build failed!
    pause
    exit /b 1
)

echo.
echo === Build complete! Check electron\dist\ for output ===
pause
