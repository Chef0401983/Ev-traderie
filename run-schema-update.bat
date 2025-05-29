cd ev-trader
node scripts/apply-schema.js@echo off
echo Applying EV-Trader database schema updates...
echo.
cd /d "%~dp0"
node scripts/apply-schema.js
echo.
pause
