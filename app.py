from flask import Flask, render_template, request, jsonify, Response, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
import os
from datetime import datetime, timedelta
import json
import base64
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# Optional imports for face recognition (can run without these for testing)
try:
    import cv2
    import face_recognition
    import numpy as np
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    FACE_RECOGNITION_AVAILABLE = False
    print("WARNING: OpenCV and face_recognition not installed. Face recognition features will be disabled.")
    print("Install with: pip install opencv-python face-recognition numpy")

# Load environment variables from .env file
load_dotenv()

# Import data layer and error handling (optional for mock mode)
try:
    from database import get_database_adapter
    from shared.errors import APIError, ValidationError, NotFoundError, DuplicateError
    from shared.logger import setup_logger, get_logger
    from config import Config
    DATABASE_AVAILABLE = True
except ImportError:
    DATABASE_AVAILABLE = False
    print("WARNING: Database modules not available. Running in mock mode.")
    # Mock classes for when database is not available
    class APIError(Exception):
        def __init__(self, message, status_code=500):
            self.message = message
            self.status_code = status_code
        def to_dict(self):
            return {'error': self.message, 'status': self.status_code}
    
    class ValidationError(APIError):
        def __init__(self, message):
            super().__init__(message, 400)
    
    class NotFoundError(APIError):
        def __init__(self, message):
            super().__init__(message, 404)
    
    class DuplicateError(APIError):
        def __init__(self, message):
            super().__init__(message, 409)
    
    class MockLogger:
        def info(self, msg): print(f"[INFO] {msg}")
        def warning(self, msg): print(f"[WARNING] {msg}")
        def error(self, msg, **kwargs): print(f"[ERROR] {msg}")
    
    def setup_logger(*args, **kwargs):
        return MockLogger()
    
    def get_logger(*args, **kwargs):
        return MockLogger()
    
    class Config:
        DEBUG = True
        HOST = '0.0.0.0'
        PORT = 5000
        LOG_LEVEL = 'INFO'
        LOG_FILE = None

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY') or os.environ.get('JWT_SECRET_KEY') or 'dev-secret-key-change-in-production'
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or app.secret_key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

CORS(app, supports_credentials=True, origins=os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(','))

# Initialize JWT Manager
jwt = JWTManager(app)

# Setup logger
log_file = Config.LOG_FILE if hasattr(Config, 'LOG_FILE') and Config.LOG_FILE else None
logger = setup_logger('smart_attendance', log_file=log_file, level=getattr(Config, 'LOG_LEVEL', 'INFO'))

# Initialize database adapter (if available)
if DATABASE_AVAILABLE:
    db = get_database_adapter()
    logger.info(f"Database adapter initialized: {db.__class__.__name__}")
else:
    db = None
    logger.info("Running in MOCK MODE - no database connection")

# Dizinleri oluştur
os.makedirs('static/faces', exist_ok=True)
os.makedirs('static/attendance', exist_ok=True)

# Initialize default users if database is empty
def init_default_users():
    """Initialize default users if none exist"""
    try:
        users = db.get_users()
        if not users:
            logger.info("Initializing default users...")
            
            default_users = [
                {
                    'username': 'admin',
                    'password': generate_password_hash('admin123'),
                    'role': 'admin',
                    'name': 'System Administrator',
                    'email': 'admin@attendance.com'
                },
                {
                    'username': 'instructor1',
                    'password': generate_password_hash('instructor123'),
                    'role': 'instructor',
                    'name': 'Dr. Robert Chen',
                    'department': 'Computer Science',
                    'email': 'robert.chen@university.edu'
                },
                {
                    'username': 'student1',
                    'password': generate_password_hash('student123'),
                    'role': 'student',
                    'name': 'John Doe',
                    'student_id': '2021001',
                    'email': 'john.doe@student.edu'
                }
            ]
            
            for user_data in default_users:
                try:
                    db.create_user(user_data)
                    logger.info(f"Created default user: {user_data['username']}")
                except Exception as e:
                    logger.warning(f"Could not create user {user_data['username']}: {e}")
    except Exception as e:
        logger.error(f"Error initializing default users: {e}")

def load_known_faces():
    """Kayıtlı yüzleri yükle"""
    known_faces = []
    known_names = []
    
    faces_dir = 'static/faces'
    if os.path.exists(faces_dir):
        for filename in os.listdir(faces_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                image_path = os.path.join(faces_dir, filename)
                image = face_recognition.load_image_file(image_path)
                encodings = face_recognition.face_encodings(image)
                if encodings:
                    known_faces.append(encodings[0])
                    name = os.path.splitext(filename)[0]
                    known_names.append(name)
    
    return known_faces, known_names

@app.route('/')
def index():
    return render_template('index.html')

# ==================== HEALTH CHECK ====================

@app.route('/health', methods=['GET'])
def health_check():
    """System health check endpoint"""
    try:
        db_health = db.health_check()
        
        return jsonify({
            'status': 'healthy',
            'database': db_health,
            'version': '2.0.0',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/health', methods=['GET'])
def api_health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'API is running',
        'version': '2.0.0',
        'timestamp': datetime.now().isoformat()
    })

# ==================== ERROR HANDLERS ====================

@app.errorhandler(APIError)
def handle_api_error(error):
    """Handle custom API errors"""
    logger.warning(f"API Error: {error.message}")
    return jsonify(error.to_dict()), error.status_code

@app.errorhandler(Exception)
def handle_generic_error(error):
    """Handle unexpected errors"""
    logger.error(f"Unexpected error: {error}", exc_info=True)
    return jsonify({
        'error': 'Internal server error',
        'status': 500
    }), 500

# ==================== MOCK USER DATA (Temporary - Replace with DB later) ====================

# MOCK USERS - Geçici hardcoded kullanıcılar
# TODO: DB hazır olunca get_user_from_db() fonksiyonunu gerçek DB sorgusu ile değiştir
MOCK_USERS = {
    # Web Panel Users (existing users from web-panel)
    'instructor1': {
        'username': 'instructor1',
        'password': generate_password_hash('pass123'),
        'role': 'instructor',
        'name': 'Dr. Instructor One',
        'department': 'Computer Science',
        'email': 'instructor1@university.edu'
    },
    'student1': {
        'username': 'student1',
        'password': generate_password_hash('pass123'),
        'role': 'student',
        'name': 'Student One',
        'student_id': 'STU001',
        'email': 'student1@university.edu'
    },
    # Admin User
    'admin': {
        'username': 'admin',
        'password': generate_password_hash('admin123'),
        'role': 'admin',
        'name': 'System Administrator',
        'email': 'admin@demo.com'
    },
    # Mobile Demo Users
    'instructor_demo': {
        'username': 'instructor_demo',
        'password': generate_password_hash('demo123'),
        'role': 'instructor',
        'name': 'Dr. Demo Instructor',
        'email': 'instructor@demo.com',
        'department': 'Computer Science'
    },
    'student_demo': {
        'username': 'student_demo',
        'password': generate_password_hash('demo123'),
        'role': 'student',
        'name': 'Demo Student',
        'email': 'student@demo.com',
        'student_id': 'DEMO001'
    }
}

def get_user_from_db(username):
    """
    Get user from database
    
    TEMPORARY: Returns mock user data
    TODO: Replace with actual database query when DB is ready
    
    Example DB implementation:
        return db.get_user(username)
    
    Args:
        username (str): Username to lookup
        
    Returns:
        dict: User data or None if not found
    """
    # MOCK IMPLEMENTATION - Replace this entire function body with DB query
    return MOCK_USERS.get(username)

# ==================== AUTHENTICATION ====================

@app.route('/api/login', methods=['POST'])
def login():
    """Kullanıcı girişi - JWT token ile"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            raise ValidationError('Kullanıcı adı ve şifre gerekli')
        
        # Get user from database (currently mock data)
        user = get_user_from_db(username)
        
        if user and check_password_hash(user['password'], password):
            # Create JWT tokens
            access_token = create_access_token(identity=username)
            refresh_token = create_refresh_token(identity=username)
            
            # Şifreyi response'dan çıkar
            user_data = {k: v for k, v in user.items() if k != 'password'}
            
            logger.info(f"User logged in: {username}")
            return jsonify({
                'success': True,
                'message': 'Giriş başarılı',
                'user': user_data,
                'access_token': access_token,
                'refresh_token': refresh_token
            })
        
        logger.warning(f"Failed login attempt: {username}")
        return jsonify({'success': False, 'message': 'Kullanıcı adı veya şifre hatalı'}), 401
        
    except APIError:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    """Kullanıcı çıkışı"""
    current_user = get_jwt_identity()
    logger.info(f"User logged out: {current_user}")
    return jsonify({'success': True, 'message': 'Çıkış başarılı'})

@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity)
        
        logger.info(f"Token refreshed for user: {identity}")
        return jsonify({
            'success': True,
            'access_token': access_token
        })
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 401

@app.route('/api/users', methods=['GET'])
def get_users():
    """Tüm kullanıcıları getir (sadece admin)"""
    try:
        if DATABASE_AVAILABLE and db:
            users = db.get_users()
            users_list = [{k: v for k, v in user.items() if k != 'password'} for user in users]
            return jsonify({'success': True, 'users': users_list})
        else:
            # Mock users
            mock_users = [
                {k: v for k, v in user.items() if k != 'password'} 
                for user in MOCK_USERS.values()
            ]
            return jsonify({'success': True, 'users': mock_users})
    except Exception as e:
        logger.error(f"Get users error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/users', methods=['POST'])
def add_user():
    """Yeni kullanıcı ekle (sadece admin)"""
    try:
        data = request.json
        username = data.get('username')
        name = data.get('name')
        email = data.get('email')
        role = data.get('role')
        password = data.get('password')
        
        if not all([username, name, email, role, password]):
            return jsonify({'success': False, 'message': 'Tüm alanlar gerekli'}), 400
        
        if username in users_db:
            return jsonify({'success': False, 'message': 'Kullanıcı adı zaten kullanılıyor'}), 400
        
        users_db[username] = {
            'username': username,
            'password': generate_password_hash(password),
            'role': role,
            'name': name,
            'email': email
        }
        
        if role == 'instructor':
            users_db[username]['department'] = data.get('department', 'Not specified')
        elif role == 'student':
            users_db[username]['student_id'] = data.get('student_id', 'TBD')
        
        save_users_db()
        
        user_data = {k: v for k, v in users_db[username].items() if k != 'password'}
        return jsonify({'success': True, 'message': 'Kullanıcı eklendi', 'user': user_data})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/users/<username>', methods=['DELETE'])
def delete_user(username):
    """Kullanıcı sil (sadece admin)"""
    if username in users_db:
        del users_db[username]
        save_users_db()
        return jsonify({'success': True, 'message': 'Kullanıcı silindi'})
    
    return jsonify({'success': False, 'message': 'Kullanıcı bulunamadı'}), 404

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Tüm dersleri getir"""
    courses = load_courses()
    return jsonify({'success': True, 'courses': courses})

@app.route('/api/courses', methods=['POST'])
def add_course():
    """Yeni ders ekle (sadece admin)"""
    try:
        data = request.json
        courses = load_courses()
        
        course = {
            'id': len(courses) + 1,
            'code': data.get('code'),
            'name': data.get('name'),
            'instructor': data.get('instructor'),
            'schedule': data.get('schedule'),
            'room': data.get('room'),
            'students': 0
        }
        
        courses.append(course)
        save_courses(courses)
        
        return jsonify({'success': True, 'message': 'Ders eklendi', 'course': course})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    """Ders sil (sadece admin)"""
    courses = load_courses()
    courses = [c for c in courses if c['id'] != course_id]
    save_courses(courses)
    return jsonify({'success': True, 'message': 'Ders silindi'})

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    """Tüm sınıfları getir"""
    rooms = load_rooms()
    return jsonify({'success': True, 'rooms': rooms})

@app.route('/api/rooms', methods=['POST'])
def add_room():
    """Yeni sınıf ekle (sadece admin)"""
    try:
        data = request.json
        rooms = load_rooms()
        
        room = {
            'id': len(rooms) + 1,
            'name': data.get('name'),
            'capacity': data.get('capacity'),
            'type': data.get('type'),
            'equipment': data.get('equipment'),
            'status': 'available'
        }
        
        rooms.append(room)
        save_rooms(rooms)
        
        return jsonify({'success': True, 'message': 'Sınıf eklendi', 'room': room})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    """Sınıf sil (sadece admin)"""
    rooms = load_rooms()
    rooms = [r for r in rooms if r['id'] != room_id]
    save_rooms(rooms)
    return jsonify({'success': True, 'message': 'Sınıf silindi'})

@app.route('/api/register', methods=['POST'])
def register_student():
    """Yeni öğrenci kaydet"""
    try:
        data = request.json
        student_id = data.get('student_id')
        name = data.get('name')
        image_data = data.get('image')
        
        if not all([student_id, name, image_data]):
            return jsonify({'success': False, 'message': 'Eksik bilgi'}), 400
        
        # Base64 görüntüyü decode et
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        
        # Numpy array'e çevir
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Yüz tespiti
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_image)
        
        if not face_locations:
            return jsonify({'success': False, 'message': 'Yüz bulunamadı'}), 400
        
        # Görüntüyü kaydet
        filename = f"{student_id}.jpg"
        filepath = os.path.join('static/faces', filename)
        cv2.imwrite(filepath, image)
        
        # Veritabanına ekle
        students_db[student_id] = {
            'name': name,
            'student_id': student_id,
            'image': filename,
            'registered_at': datetime.now().isoformat()
        }
        
        save_students_db()
        
        return jsonify({
            'success': True,
            'message': 'Öğrenci başarıyla kaydedildi',
            'student': students_db[student_id]
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/attendance', methods=['POST'])
def mark_attendance():
    """Yoklama işaretle"""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'success': False, 'message': 'Görüntü bulunamadı'}), 400
        
        # Base64 görüntüyü decode et
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        
        # Numpy array'e çevir
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Yüz tespiti ve tanıma
        face_locations = face_recognition.face_locations(rgb_image)
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
        
        if not face_encodings:
            return jsonify({'success': False, 'message': 'Yüz bulunamadı'}), 400
        
        # Kayıtlı yüzleri yükle
        known_faces, known_names = load_known_faces()
        
        if not known_faces:
            return jsonify({'success': False, 'message': 'Kayıtlı öğrenci bulunamadı'}), 400
        
        # Yüzleri karşılaştır
        tolerance = float(os.environ.get('FACE_RECOGNITION_TOLERANCE', '0.6'))
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_faces, face_encoding, tolerance=tolerance)
            face_distances = face_recognition.face_distance(known_faces, face_encoding)
            
            if True in matches:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    student_id = known_names[best_match_index]
                    
                    # Yoklama kaydı oluştur
                    attendance_record = {
                        'student_id': student_id,
                        'name': students_db.get(student_id, {}).get('name', 'Unknown'),
                        'timestamp': datetime.now().isoformat(),
                        'status': 'present'
                    }
                    
                    attendance_records.append(attendance_record)
                    save_attendance_records()
                    
                    return jsonify({
                        'success': True,
                        'message': 'Yoklama başarıyla işaretlendi',
                        'student': attendance_record
                    })
        
        return jsonify({'success': False, 'message': 'Öğrenci tanınamadı'}), 404
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    """Tüm öğrencileri getir"""
    try:
        if DATABASE_AVAILABLE and db:
            students = db.get_students()
            return jsonify({'success': True, 'students': students})
        else:
            # Mock data
            return jsonify({'success': True, 'students': []})
    except Exception as e:
        logger.error(f"Get students error: {e}")
        return jsonify({'success': False, 'message': str(e), 'students': []}), 500

@app.route('/api/attendance/records', methods=['GET'])
def get_attendance_records():
    """Yoklama kayıtlarını getir"""
    try:
        date = request.args.get('date')
        
        if DATABASE_AVAILABLE and db:
            # DB'den al
            records = db.get_attendance_records()
            if date and records:
                records = [r for r in records if r.get('timestamp', '').startswith(date)]
            return jsonify({'success': True, 'records': records or []})
        else:
            # Mock data
            return jsonify({'success': True, 'records': []})
    except Exception as e:
        logger.error(f"Get attendance records error: {e}")
        return jsonify({'success': False, 'message': str(e), 'records': []}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Dashboard istatistiklerini getir"""
    try:
        # Toplam öğrenci sayısı
        if DATABASE_AVAILABLE and db:
            students = db.get_students()
            total_students = len(students) if students else 0
        else:
            total_students = 0
        
        # Toplam ders sayısı (benzersiz tarihler)
        if DATABASE_AVAILABLE and db:
            records = db.get_attendance_records() or []
        else:
            records = []
            
        unique_dates = set()
        for record in records:
            date = record.get('timestamp', '').split('T')[0]
            if date:
                unique_dates.add(date)
        total_classes = len(unique_dates)
        
        # Ortalama yoklama oranı
        if total_classes > 0 and total_students > 0:
            avg_attendance = round((len(records) / (total_classes * total_students)) * 100)
        else:
            avg_attendance = 0
        
        # Bugünkü yoklama
        today = datetime.now().strftime('%Y-%m-%d')
        today_records = [r for r in records if r.get('timestamp', '').startswith(today)]
        present_today = len(today_records)
        
        # Son ayın istatistikleri
        from datetime import timedelta
        last_month = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        last_month_records = [r for r in records if r.get('timestamp', '') >= last_month]
        
        stats = {
            'total_students': total_students,
            'total_classes': total_classes,
            'avg_attendance': avg_attendance,
            'auto_attendance': 95,  # Mock data
            'manual_reviews': 30,   # Mock data
            'present_today': present_today,
            'absent_today': total_students - present_today,
            'last_month_records': len(last_month_records)
        }
        
        return jsonify({'success': True, 'stats': stats})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/dashboard/course-performance', methods=['GET'])
def get_course_performance():
    """Ders performans verilerini getir"""
    try:
        # Mock data - gerçek uygulamada veritabanından gelecek
        performance = [
            {'course': 'CS101', 'attendance': 95, 'students': 45},
            {'course': 'CS102', 'attendance': 88, 'students': 38},
            {'course': 'CS103', 'attendance': 92, 'students': 42},
            {'course': 'CS104', 'attendance': 90, 'students': 40}
        ]
        
        return jsonify({'success': True, 'performance': performance})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/dashboard/recent-activity', methods=['GET'])
def get_recent_activity():
    """Son aktiviteleri getir"""
    try:
        # Son 10 yoklama kaydını al
        if DATABASE_AVAILABLE and db:
            all_records = db.get_attendance_records() or []
        else:
            all_records = []
            
        recent_records = sorted(
            all_records, 
            key=lambda x: x.get('timestamp', ''), 
            reverse=True
        )[:10]
        
        activities = []
        for record in recent_records:
            activities.append({
                'type': 'attendance',
                'title': f"{record['name']} - Yoklama",
                'timestamp': record['timestamp'],
                'details': f"Öğrenci No: {record['student_id']}"
            })
        
        return jsonify({'success': True, 'activities': activities})
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Öğrenci sil"""
    try:
        if DATABASE_AVAILABLE and db:
            # Görüntü dosyasını sil
            student = db.get_student(student_id)
            if student and student.get('image'):
                filepath = os.path.join('static/faces', student['image'])
                if os.path.exists(filepath):
                    os.remove(filepath)
            
            db.delete_student(student_id)
            return jsonify({'success': True, 'message': 'Öğrenci silindi'})
        else:
            return jsonify({'success': False, 'message': 'Database not available'}), 503
    except Exception as e:
        logger.error(f"Delete student error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== CLASS MANAGEMENT ====================

@app.route('/api/classes/upcoming', methods=['GET'])
def get_upcoming_classes():
    """Gelecek tarihli dersleri getir"""
    try:
        instructor_id = request.args.get('instructor_id')
        
        # Mock data - gerçekte veritabanından gelecek
        from datetime import timedelta
        today = datetime.now()
        
        upcoming_classes = [
            {
                'id': 1,
                'course': 'CS101',
                'title': 'Introduction to Programming',
                'date': (today + timedelta(days=1)).strftime('%Y-%m-%d'),
                'time': '09:00 - 10:30',
                'room': 'Room 401',
                'status': 'scheduled',
                'students_enrolled': 45
            },
            {
                'id': 2,
                'course': 'CS201',
                'title': 'Data Structures',
                'date': (today + timedelta(days=1)).strftime('%Y-%m-%d'),
                'time': '14:00 - 15:30',
                'room': 'Lab 204',
                'status': 'scheduled',
                'students_enrolled': 38
            },
            {
                'id': 3,
                'course': 'CS301',
                'title': 'Algorithms',
                'date': (today + timedelta(days=2)).strftime('%Y-%m-%d'),
                'time': '16:00 - 17:30',
                'room': 'Room 405',
                'status': 'scheduled',
                'students_enrolled': 32
            },
            {
                'id': 4,
                'course': 'CS102',
                'title': 'Advanced Programming',
                'date': (today + timedelta(days=3)).strftime('%Y-%m-%d'),
                'time': '10:00 - 11:30',
                'room': 'Lab 301',
                'status': 'scheduled',
                'students_enrolled': 40
            },
        ]
        
        logger.info(f"Fetched {len(upcoming_classes)} upcoming classes for instructor: {instructor_id}")
        return jsonify({
            'success': True,
            'classes': upcoming_classes
        })
        
    except Exception as e:
        logger.error(f"Get upcoming classes error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/classes/cancel', methods=['POST'])
def cancel_class():
    """Dersi iptal et"""
    try:
        data = request.json
        class_id = data.get('class_id')
        reason = data.get('reason')
        instructor_id = data.get('instructor_id')
        
        # Validation
        if not all([class_id, reason, instructor_id]):
            raise ValidationError('Tüm alanlar gerekli (class_id, reason, instructor_id)')
        
        # İptal kaydı oluştur
        cancellation = {
            'class_id': class_id,
            'reason': reason,
            'instructor_id': instructor_id,
            'cancelled_at': datetime.now().isoformat(),
            'status': 'cancelled'
        }
        
        # TODO: Veritabanına kaydet (şimdilik sadece log)
        logger.info(f"Class {class_id} cancelled by {instructor_id}. Reason: {reason}")
        
        # TODO: Öğrencilere bildirim gönder
        
        return jsonify({
            'success': True,
            'message': 'Ders başarıyla iptal edildi',
            'cancellation': cancellation
        })
        
    except APIError:
        raise
    except Exception as e:
        logger.error(f"Class cancellation error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

def save_students_db():
    """Öğrenci veritabanını kaydet"""
    with open('static/students.json', 'w', encoding='utf-8') as f:
        json.dump(students_db, f, ensure_ascii=False, indent=2)

def save_attendance_records():
    """Yoklama kayıtlarını kaydet"""
    with open('static/attendance/records.json', 'w', encoding='utf-8') as f:
        json.dump(attendance_records, f, ensure_ascii=False, indent=2)

def save_users_db():
    """Kullanıcı veritabanını kaydet"""
    with open('static/users.json', 'w', encoding='utf-8') as f:
        json.dump(users_db, f, ensure_ascii=False, indent=2)

def load_courses():
    """Dersleri yükle"""
    if os.path.exists('static/courses.json'):
        with open('static/courses.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_courses(courses):
    """Dersleri kaydet"""
    with open('static/courses.json', 'w', encoding='utf-8') as f:
        json.dump(courses, f, ensure_ascii=False, indent=2)

def load_rooms():
    """Sınıfları yükle"""
    if os.path.exists('static/rooms.json'):
        with open('static/rooms.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_rooms(rooms):
    """Sınıfları kaydet"""
    with open('static/rooms.json', 'w', encoding='utf-8') as f:
        json.dump(rooms, f, ensure_ascii=False, indent=2)

def load_data():
    """DEPRECATED: Verileri yükle - Now using database adapter"""
    logger.warning("load_data() is deprecated. Using database adapter instead.")
    pass

# Initialize default users on startup
init_default_users()

if __name__ == '__main__':
    logger.info(f"Starting Smart Attendance System v2.0.0")
    logger.info(f"Database mode: {db.__class__.__name__}")
    
    # Get configuration from environment variables
    debug_mode = os.environ.get('DEBUG', 'true').lower() == 'true'
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', '5000'))
    
    logger.info(f"Server starting on {host}:{port} (debug={debug_mode})")
    app.run(debug=debug_mode, host=host, port=port)

