@echo off
cd /d "%~dp0"
if not exist node_modules\electron\dist\electron.exe (
  echo Brak zaleznosci. Uruchom najpierw Instaluj.cmd
  pause
  exit /b 1
)
start "" "node_modules\electron\dist\electron.exe" .
