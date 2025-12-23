@echo off
echo Akilli Yoklama Sistemi Baslatiliyor...
echo.

echo Python sanal ortam olusturuluyor...
python -m venv venv

echo.
echo Sanal ortam aktive ediliyor...
call venv\Scripts\activate.bat

echo.
echo Gerekli kutuphaneler yukleniyor...
pip install -r requirements.txt

echo.
echo Uygulama baslatiliyor...
python app.py

pause

