@echo off
echo ===================================================
echo   📱 Launching Google Pixel 9a Android Emulator...
echo ===================================================
echo.

set "ANDROID_HOME=C:\Users\pc\AppData\Local\Android\Sdk"
set "PATH=%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%"

start "" "%ANDROID_HOME%\emulator\emulator.exe" -avd Pixel_9a -no-snapshot-load

echo ✅ Pixel 9a Emulator starting in background window!
echo.
timeout /t 3 /nobreak >nul
exit /b 0
