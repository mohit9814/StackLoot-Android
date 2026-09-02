@echo off
echo ===================================================
echo   🤖 Opening StackLoot in Android Studio...
echo ===================================================
echo.

set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
set "ANDROID_HOME=C:\Users\pc\AppData\Local\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "A:\StackLoot-Android\android"

echo ✅ Android Studio launched!
echo.
timeout /t 2 /nobreak >nul
exit /b 0
