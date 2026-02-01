@echo off
cd /d "%~dp0"
git add -A
git status
git commit -m "Clean repo: remove unnecessary docs, use empty MySQL password, update README"
git push origin main
if errorlevel 1 git push origin master
pause
