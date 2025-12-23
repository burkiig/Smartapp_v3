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
echo [1] Backend Baslat (Sunucu)
echo [2] Web Panel Baslat (Arayuz)
echo [3] Her Ikisini Baslat
echo [4] Sistem Kontrolu
echo [5] Kurulum Rehberi
echo [6] Cikis
echo.
echo ========================================
set /p choice="Seciminiz (1-6): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto webpanel
if "%choice%"=="3" goto both
if "%choice%"=="4" goto test
if "%choice%"=="5" goto help
if "%choice%"=="6" goto exit

echo Gecersiz secim!
timeout /t 2 >nul
goto menu

:backend
cls
echo Backend baslatiliyor...
start "Backend - Akilli Yoklama" cmd /k run_backend.bat
timeout /t 2 >nul
goto menu

:webpanel
cls
echo Web Panel baslatiliyor...
start "Web Panel - Akilli Yoklama" cmd /k run_web_panel.bat
timeout /t 2 >nul
goto menu

:both
cls
echo Her iki servis baslatiliyor...
echo.
echo 1. Backend baslatiliyor...
start "Backend - Akilli Yoklama" cmd /k run_backend.bat
timeout /t 3 >nul
echo.
echo 2. Web Panel baslatiliyor...
start "Web Panel - Akilli Yoklama" cmd /k run_web_panel.bat
echo.
echo Her iki servis baslatildi!
echo Backend: http://localhost:5000
echo Web Panel: http://localhost:3000
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

