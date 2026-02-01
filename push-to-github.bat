@echo off
cd /d "%~dp0"
git add -A
git status
git commit -m "Fix admin login on any machine, view details, price filters"
git push origin main
if errorlevel 1 git push origin master
pause
