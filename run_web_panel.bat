@echo off
echo ========================================
echo   AKILLI YOKLAMA - WEB PANEL BASLATICI
echo ========================================
echo.

REM Node.js kurulu mu kontrol et
node --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Node.js bulunamadi! Lutfen Node.js yukleyin.
    pause
    exit /b 1
)

echo [1/3] Node.js bulundu...
echo.

cd web-panel

REM node_modules var mi kontrol et
if not exist "node_modules\" (
    echo [2/3] Paketler yukleniyor (bu biraz zaman alabilir)...
    call npm install
) else (
    echo [2/3] Paketler mevcut...
)
echo.

echo [3/3] Web panel baslatiliyor...
echo.
echo ========================================
echo   WEB PANEL BASLATILIYOR...
echo   URL: http://localhost:3000
echo ========================================
echo.
echo Durdurmak icin Ctrl+C basin
echo.

call npm start

pause

