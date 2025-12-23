@echo off
echo ========================================
echo   AKILLI YOKLAMA - BACKEND BASLATICI
echo ========================================
echo.

REM Python kurulu mu kontrol et
python --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Python bulunamadi! Lutfen Python yukleyin.
    pause
    exit /b 1
)

echo [1/4] Python bulundu...
echo.

REM Sanal ortam var mi kontrol et
if not exist "venv\" (
    echo [2/4] Sanal ortam olusturuluyor...
    python -m venv venv
) else (
    echo [2/4] Sanal ortam mevcut...
)
echo.

echo [3/4] Sanal ortam aktive ediliyor...
call venv\Scripts\activate.bat
echo.

echo [4/4] Gerekli kutuphaneler kontrol ediliyor...
pip install -r requirements.txt --quiet
echo.

echo ========================================
echo   BACKEND BASLATILIYOR...
echo   URL: http://localhost:5000
echo ========================================
echo.
echo Durdurmak icin Ctrl+C basin
echo.

python app.py

pause

