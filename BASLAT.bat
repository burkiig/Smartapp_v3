@echo off
title Akilli Yoklama Sistemi - Ana Menu
color 0A

:menu
cls
echo ========================================
echo   AKILLI YOKLAMA SISTEMI
echo   Yuz Tanima ile Otomatik Yoklama
echo ========================================
echo.
echo [1] Sadece Backend Baslat (port 5000)
echo [2] Web Panel - Gelistirici Modu (port 3000, hot-reload)
echo [3] Web Panel Build + Backend Baslat (tek port 5000)
echo [4] ngrok Baslat (Takim / Mobil Erisim)
echo [5] Sistem Kontrolu
echo [6] Kurulum Rehberi
echo [7] Cikis
echo.
echo ========================================
echo   Tavsiye: Takim erişimi için [4] seçin
echo ========================================
set /p choice="Seciminiz (1-7): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto webpanel_dev
if "%choice%"=="3" goto build_and_run
if "%choice%"=="4" goto ngrok
if "%choice%"=="5" goto test
if "%choice%"=="6" goto help
if "%choice%"=="7" goto exit

echo Gecersiz secim!
timeout /t 2 >nul
goto menu

:backend
cls
echo Backend baslatiliyor (port 5000)...
start "Backend - Akilli Yoklama" cmd /k run_backend.bat
timeout /t 2 >nul
goto menu

:webpanel_dev
cls
echo Web Panel gelistirici modu baslatiliyor (port 3000)...
echo NOT: Backend da ayri terminalde calisyor olmali!
start "Web Panel DEV - Akilli Yoklama" cmd /k run_web_panel.bat
timeout /t 2 >nul
goto menu

:build_and_run
cls
echo ============================================
echo   Web Panel Build + Backend (Tek Port 5000)
echo ============================================
echo.
echo 1. React web panel build ediliyor...
echo    (Bu islem 1-2 dakika surebilir)
echo.
cd /d "%~dp0web-panel"
call npm run build
if errorlevel 1 (
    echo.
    echo HATA: npm build basarisiz!
    echo web-panel klasorunde "npm install" calistirmayi deneyin.
    echo.
    pause
    goto menu
)
cd /d "%~dp0"
echo.
echo 2. Backend baslatiliyor (Web Panel + API hep birlikte port 5000)...
start "Backend+WebPanel - Akilli Yoklama" cmd /k run_backend.bat
timeout /t 3 >nul
echo.
echo ============================================
echo   Sistem hazir!
echo   Adres: http://localhost:5000
echo ============================================
echo.
pause
goto menu

:ngrok
cls
echo ============================================
echo   ngrok - Takim ve Mobil Erisim
echo ============================================
echo.
echo 1. React web panel build ediliyor...
cd /d "%~dp0web-panel"
call npm run build
if errorlevel 1 (
    echo HATA: npm build basarisiz! "npm install" calistirmayi deneyin.
    pause
    goto menu
)
cd /d "%~dp0"
echo.
echo 2. Backend baslatiliyor...
start "Backend+WebPanel - Akilli Yoklama" cmd /k run_backend.bat
timeout /t 4 >nul
echo.
echo 3. ngrok tunnel aciliyor (port 5000)...
start "ngrok Tunnel" cmd /k "ngrok http 5000"
timeout /t 3 >nul
echo.
echo ============================================
echo   ngrok paneli: http://localhost:4040
echo.
echo   Web Panel + API ayni URL'de:
echo   https://xxxx.ngrok-free.app
echo.
echo   Mobil app icin env.js guncelle:
echo   API_URL: 'https://xxxx.ngrok-free.app'
echo.
echo   Takim arkadaşlari Web Panel'e de
echo   ayni ngrok URL'sinden erisebilir!
echo ============================================
echo.
pause
goto menu

:test
cls
echo Sistem kontrolu yapiliyor...
python test_system.py
if errorlevel 1 (
    echo.
    echo Python bulunamadi!
    echo Lutfen KURULUM_REHBERI.txt dosyasini okuyun.
    echo.
    pause
)
goto menu

:help
cls
echo Kurulum rehberi aciliyor...
start notepad KURULUM_REHBERI.txt
timeout /t 2 >nul
goto menu

:exit
cls
echo.
echo Cikiliyor...
echo.
timeout /t 1 >nul
exit

