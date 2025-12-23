"""
Flask uygulama yapılandırması
"""
import os

class Config:
    """Temel yapılandırma"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Dizinler
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    STATIC_DIR = os.path.join(BASE_DIR, 'static')
    FACES_DIR = os.path.join(STATIC_DIR, 'faces')
    ATTENDANCE_DIR = os.path.join(STATIC_DIR, 'attendance')
    
    # Dosyalar
    STUDENTS_DB = os.path.join(STATIC_DIR, 'students.json')
    ATTENDANCE_RECORDS = os.path.join(ATTENDANCE_DIR, 'records.json')
    
    # Yüz tanıma ayarları
    FACE_RECOGNITION_TOLERANCE = 0.6
    FACE_DETECTION_MODEL = 'hog'  # 'hog' veya 'cnn'
    
    # Flask ayarları
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5000
    
    # CORS ayarları
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']

class DevelopmentConfig(Config):
    """Geliştirme ortamı yapılandırması"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Üretim ortamı yapılandırması"""
    DEBUG = False
    TESTING = False
    # Üretimde SECRET_KEY mutlaka değiştirilmeli!

# Yapılandırma sözlüğü
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

