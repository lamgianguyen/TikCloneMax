@echo off
setlocal
cd /d "%~dp0"
echo ==============================================
echo        Khoi dong TikFinity Web (.NET)
echo ==============================================
echo.
echo Dang mo backend .NET tren cong 5285...
echo Vui long giu cua so nay mo de ung dung hoat dong.
echo.
echo De truy cap, hay mo trinh duyet va vao:
echo http://localhost:5285
echo.
where dotnet >nul 2>&1
if errorlevel 1 (
    echo Khong tim thay lenh dotnet. Hay cai .NET SDK 9 truoc.
    pause
    exit /b 1
)
dotnet run --project backend\TikFinityBackend.csproj --no-launch-profile
pause
