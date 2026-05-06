@echo off
echo ============================================
echo  PORTFOLIO v2 — Deploying to GitHub...
echo ============================================
echo.

cd /d "%~dp0"

echo [1/7] Cleaning old git data...
if exist ".git" rmdir /s /q ".git"
if exist ".git_old" rmdir /s /q ".git_old"

echo [2/7] Initializing fresh git...
git init

echo [3/7] Setting remote...
git remote add origin https://github.com/stefanitick/portfolio.git

echo [4/7] Creating main branch...
git checkout -b main

echo [5/7] Staging all files...
git add -A

echo [6/7] Committing...
git commit -m "Portfolio v2 — updated %date%"

echo [7/7] Pushing to GitHub (this may take a minute)...
git push origin main --force

echo.
echo ============================================
echo  DONE! Your portfolio is deploying.
echo  Check: https://portfolio-rouge-kappa-84.vercel.app
echo ============================================
echo.
pause
