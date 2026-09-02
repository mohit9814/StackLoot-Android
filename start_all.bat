@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   🌟 StackLoot: Complete 1-Click Launch ^& Deploy
echo ===================================================
echo.

set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
set "ANDROID_HOME=C:\Users\pc\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools;%PATH%"

:: 1. Check if emulator is already running
adb devices | findstr "emulator" >nul
if %errorlevel% neq 0 (
    echo [1/4] Starting Pixel 9a Emulator...
    start "" "%ANDROID_HOME%\emulator\emulator.exe" -avd Pixel_9a
    echo Waiting for emulator to boot up...
    adb wait-for-device
    timeout /t 8 /nobreak >nul
) else (
    echo [1/4] Pixel 9a Emulator is already running!
)

:: 2. Build Frontend
echo [2/4] Compiling React/TypeScript frontend...
cd /d "A:\StackLoot-Android"
call npm run build

:: 3. Sync & Build APK
echo [3/4] Syncing Capacitor and building native APK...
call npx cap sync android
cd /d "A:\StackLoot-Android\android"
call gradlew.bat assembleDebug

:: 4. Install & Launch on Emulator
echo [4/4] Installing and launching StackLoot on Pixel 9a...
adb install -r "A:\StackLoot-Android\android\app\build\outputs\apk\debug\app-debug.apk"
adb shell am start -n com.stackloot.app/com.stackloot.app.MainActivity

echo.
echo ===================================================
echo   🎉 StackLoot is LIVE on your Pixel 9a!
echo ===================================================
echo.
pause
