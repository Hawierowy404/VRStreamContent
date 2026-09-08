@echo off
cd /d "%~dp0"
set "npm_config_cache=%~dp0.cache\npm"
set "electron_config_cache=%~dp0.cache\electron"
call npm.cmd ci
if errorlevel 1 goto fail
call npm.cmd run setup
if errorlevel 1 goto fail
echo Ready. Run Uruchom.cmd.
pause
exit /b 0
:fail
echo Setup failed. Install Node.js 24 and check your internet connection.
pause
exit /b 1
