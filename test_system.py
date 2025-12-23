"""
Sistem kontrolü ve test scripti
"""
import sys
import subprocess

def check_python():
    """Python versiyonunu kontrol et"""
    version = sys.version_info
    print(f"✓ Python {version.major}.{version.minor}.{version.micro} bulundu")
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("✗ UYARI: Python 3.8 veya üstü önerilir")
        return False
    return True

def check_module(module_name):
    """Modül yüklü mü kontrol et"""
    try:
        __import__(module_name)
        print(f"✓ {module_name} yüklü")
        return True
    except ImportError:
        print(f"✗ {module_name} yüklü değil")
        return False

def main():
    print("=" * 50)
    print("  AKILLI YOKLAMA SİSTEMİ - KONTROL")
    print("=" * 50)
    print()
    
    # Python kontrolü
    print("[1] Python Kontrolü:")
    python_ok = check_python()
    print()
    
    # Gerekli modüller
    print("[2] Gerekli Modüller:")
    modules = {
        'flask': 'Flask',
        'flask_cors': 'Flask-CORS',
        'cv2': 'OpenCV',
        'face_recognition': 'face_recognition',
        'numpy': 'NumPy',
        'PIL': 'Pillow'
    }
    
    all_ok = True
    for module, name in modules.items():
        if not check_module(module):
            all_ok = False
    print()
    
    # Dizin kontrolü
    print("[3] Dizin Kontrolü:")
    import os
    dirs = ['templates', 'static', 'static/faces', 'static/attendance']
    for d in dirs:
        if os.path.exists(d):
            print(f"✓ {d}/ mevcut")
        else:
            print(f"✗ {d}/ bulunamadı - oluşturuluyor...")
            os.makedirs(d, exist_ok=True)
    print()
    
    # Sonuç
    print("=" * 50)
    if python_ok and all_ok:
        print("✓ TÜM KONTROLLER BAŞARILI!")
        print()
        print("Sistemi başlatmak için:")
        print("  Backend: run_backend.bat")
        print("  Web Panel: run_web_panel.bat")
    else:
        print("✗ BAZI SORUNLAR VAR!")
        print()
        print("Eksik modülleri yüklemek için:")
        print("  pip install -r requirements.txt")
    print("=" * 50)

if __name__ == '__main__':
    main()
    input("\nDevam etmek için Enter'a basın...")

