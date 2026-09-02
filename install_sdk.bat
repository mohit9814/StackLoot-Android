@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "C:\Users\pc\AppData\Local\Android\Sdk\cmdline-tools\latest\bin"
(for /L %%i in (1,1,20) do @echo y) | sdkmanager.bat --sdk_root="C:\Users\pc\AppData\Local\Android\Sdk" --licenses
sdkmanager.bat --sdk_root="C:\Users\pc\AppData\Local\Android\Sdk" "platform-tools" "platforms;android-34" "build-tools;34.0.0" "emulator"
