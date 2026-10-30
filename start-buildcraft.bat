@echo off
title BuildCraft Studio - Desktop Launcher
echo =====================================================================
echo                 BUILDCRAFT STUDIO DESKTOP LAUNCHER
echo                 Design Smarter. Build Better.
echo =====================================================================
echo.

echo [1/2] Starting Spring Boot 3 + SQLite Backend (Port 8080)...
start "BuildCraft Studio Backend" /d "%~dp0backend" cmd /c ""C:\Users\sajum\maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run"

echo Waiting for backend service to initialize...
timeout /t 6 /nobreak > nul

echo [2/2] Launching BuildCraft Studio Electron Desktop Application...
cd /d "%~dp0frontend"
npm.cmd start
