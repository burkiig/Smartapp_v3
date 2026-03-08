"""
MongoDB schema validation definitions
Ensures data consistency in MongoDB collections
"""

# Students Collection Schema
STUDENT_SCHEMA = {
    "bsonType": "object",
    "required": ["student_id", "name"],
    "properties": {
        "student_id":    {"bsonType": "string"},
        "name":          {"bsonType": "string"},
        "image":         {"bsonType": "string"},
        "push_token":    {"bsonType": "string", "description": "Expo push notification token"},
        "registered_at": {"bsonType": "date"},
        "updated_at":    {"bsonType": "date"}
    }
}

# Attendance Records Schema — extended with Phase 1 fields
ATTENDANCE_SCHEMA = {
    "bsonType": "object",
    "required": ["student_id", "timestamp", "status"],
    "properties": {
        "id":         {"bsonType": "string", "description": "UUID for record updates"},
        "student_id": {"bsonType": "string"},
        "name":       {"bsonType": "string", "description": "Student name (denormalized)"},
        "timestamp":  {"bsonType": "date"},
        "status": {
            "bsonType": "string",
            "enum": ["present", "absent", "late"],
        },
        "session_id":  {"bsonType": "string"},
        "course_id":   {"bsonType": "int"},
        "verification_steps": {
            "bsonType": "object",
            "properties": {
                "gps":  {"bsonType": "bool"},
                "face": {"bsonType": "bool"},
                "qr":   {"bsonType": "bool"}
            }
        },
        "is_flagged":      {"bsonType": "bool"},
        "flag_reason":     {"bsonType": ["string", "null"]},
        "face_confidence": {"bsonType": "double"},
        "location": {
            "bsonType": "object",
            "properties": {
                "lat": {"bsonType": "double"},
                "lng": {"bsonType": "double"}
            }
        }
    }
}

# Users Collection Schema
USER_SCHEMA = {
    "bsonType": "object",
    "required": ["username", "password", "role", "name", "email"],
    "properties": {
        "username":   {"bsonType": "string"},
        "password":   {"bsonType": "string"},
        "role": {
            "bsonType": "string",
            "enum": ["admin", "instructor", "student"]
        },
        "name":       {"bsonType": "string"},
        "email": {
            "bsonType": "string",
            "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        "department":  {"bsonType": "string"},
        "student_id":  {"bsonType": "string"},
        "push_token":  {"bsonType": "string"},
        "created_at":  {"bsonType": "date"},
        "updated_at":  {"bsonType": "date"}
    }
}

# Courses Collection Schema — extended with Phase 1 fields
COURSE_SCHEMA = {
    "bsonType": "object",
    "required": ["code", "name", "instructor"],
    "properties": {
        "id":        {"bsonType": "int"},
        "code":      {"bsonType": "string"},
        "name":      {"bsonType": "string"},
        "instructor": {"bsonType": "string"},
        "schedule": {
            "bsonType": "object",
            "properties": {
                "days":       {"bsonType": "array",  "items": {"bsonType": "string"}},
                "start_time": {"bsonType": "string"},
                "end_time":   {"bsonType": "string"},
                "room_id":    {"bsonType": "int"}
            }
        },
        "static_qr_code":    {"bsonType": "string", "description": "Static QR for course identification"},
        "enrolled_students": {"bsonType": "array",  "items": {"bsonType": "string"}},
        "room":              {"bsonType": "string"},
        "students":          {"bsonType": "int"},
        "created_at":        {"bsonType": "date"}
    }
}

# Rooms Collection Schema — extended with GPS fields
ROOM_SCHEMA = {
    "bsonType": "object",
    "required": ["name", "capacity", "type"],
    "properties": {
        "id":       {"bsonType": "int"},
        "name":     {"bsonType": "string"},
        "capacity": {"bsonType": "int", "minimum": 1},
        "type": {
            "bsonType": "string",
            "enum": ["classroom", "lab", "auditorium", "other"]
        },
        "equipment":        {"bsonType": "string"},
        "status": {
            "bsonType": "string",
            "enum": ["available", "occupied", "maintenance"]
        },
        "latitude":         {"bsonType": ["double", "null"], "description": "Room GPS latitude"},
        "longitude":        {"bsonType": ["double", "null"], "description": "Room GPS longitude"},
        "geofence_radius":  {"bsonType": "int",    "description": "Geofence radius in meters"},
        "created_at":       {"bsonType": "date"}
    }
}

# Attendance Sessions Schema
ATTENDANCE_SESSION_SCHEMA = {
    "bsonType": "object",
    "required": ["id", "course_id", "date", "start_time", "status"],
    "properties": {
        "id":         {"bsonType": "string", "description": "UUID"},
        "course_id":  {"bsonType": "int"},
        "date":       {"bsonType": "string", "description": "YYYY-MM-DD"},
        "start_time": {"bsonType": "string"},
        "end_time":   {"bsonType": "string"},
        "status": {
            "bsonType": "string",
            "enum": ["active", "closed", "cancelled"]
        },
        "qr_code":    {"bsonType": "string", "description": "One-time QR code for this session"},
        "created_at": {"bsonType": "date"},
        "updated_at": {"bsonType": "date"}
    }
}

# Cancellations Schema
CANCELLATION_SCHEMA = {
    "bsonType": "object",
    "required": ["id", "course_id", "instructor_id", "date", "reason"],
    "properties": {
        "id":            {"bsonType": "string"},
        "course_id":     {"bsonType": "int"},
        "instructor_id": {"bsonType": "string"},
        "date":          {"bsonType": "string"},
        "reason":        {"bsonType": "string"},
        "notified_at":   {"bsonType": "date"}
    }
}

# Excuses Schema
EXCUSE_SCHEMA = {
    "bsonType": "object",
    "required": ["id", "student_id", "course_id", "session_date"],
    "properties": {
        "id":               {"bsonType": "string"},
        "student_id":       {"bsonType": "string"},
        "course_id":        {"bsonType": "int"},
        "session_date":     {"bsonType": "string"},
        "document_url":     {"bsonType": "string"},
        "status": {
            "bsonType": "string",
            "enum": ["pending", "approved", "rejected"]
        },
        "instructor_notes": {"bsonType": "string"},
        "submitted_at":     {"bsonType": "date"},
        "reviewed_at":      {"bsonType": "date"}
    }
}

# All collection schemas — used by MongoDBAdapter._init_collections()
SCHEMAS = {
    'students':            STUDENT_SCHEMA,
    'attendance_logs':     ATTENDANCE_SCHEMA,
    'users':               USER_SCHEMA,
    'courses':             COURSE_SCHEMA,
    'rooms':               ROOM_SCHEMA,
    'attendance_sessions': ATTENDANCE_SESSION_SCHEMA,
    'cancellations':       CANCELLATION_SCHEMA,
    'excuses':             EXCUSE_SCHEMA
}
