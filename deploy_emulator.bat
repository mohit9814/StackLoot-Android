@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   🚀 StackLoot Android: 1-Click Build ^& Deploy
echo ===================================================
echo.

:: 1. Set Java and Android SDK Environment
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
set "ANDROID_HOME=C:\Users\pc\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

:: 2. Check ADB connection
echo [1/5] Checking connected Android Emulator/Device...
adb devices
echo.

:: 3. Build Web/Capacitor Frontend
echo [2/5] Building React/TypeScript frontend (Vite)...
cd /d "A:\StackLoot-Android"
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b %errorlevel%
)

:: 4. Sync Native Capacitor Android Assets
echo [3/5] Syncing Capacitor native assets...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed!
    pause
    exit /b %errorlevel%
)

:: 5. Assemble Native Android APK with Gradle
echo [4/5] Compiling native Android APK (Gradle)...
cd /d "A:\StackLoot-Android\android"
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ❌ Gradle APK build failed!
    pause
    exit /b %errorlevel%
)

:: 6. Install and Launch on Emulator
echo [5/5] Installing APK and launching StackLoot on Emulator...
adb install -r "A:\StackLoot-Android\android\app\build\outputs\apk\debug\app-debug.apk"
if %errorlevel% neq 0 (
    echo ⚠️ Could not install APK. Make sure your Android Emulator is running!
    pause
    exit /b %errorlevel%
)

adb shell am start -n com.stackloot.app/com.stackloot.app.MainActivity

echo.
echo ===================================================
echo   ✅ StackLoot deployed and running on Emulator!
echo ===================================================
echo.
pause
