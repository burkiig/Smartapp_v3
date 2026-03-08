"""
MongoDB database adapter
Implements DatabaseAdapter interface using MongoDB for storage
"""

import uuid
from typing import List, Dict, Optional, Any
from datetime import datetime
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, DuplicateKeyError
from .base import DatabaseAdapter
from .schemas import SCHEMAS


class MongoDBAdapter(DatabaseAdapter):
    """MongoDB database implementation"""

    def __init__(self, connection_uri: str, database_name: str):
        self.client = MongoClient(connection_uri)
        self.db = self.client[database_name]
        self._init_collections()
        self._create_indexes()

    def _init_collections(self):
        existing = self.db.list_collection_names()
        for name, schema in SCHEMAS.items():
            if name not in existing:
                self.db.create_collection(name, validator={'$jsonSchema': schema})
            else:
                self.db.command('collMod', name, validator={'$jsonSchema': schema})

    def _create_indexes(self):
        self.db.students.create_index([('student_id', ASCENDING)], unique=True)

        self.db.attendance_logs.create_index([('student_id', ASCENDING)])
        self.db.attendance_logs.create_index([('timestamp', ASCENDING)])
        self.db.attendance_logs.create_index([('session_id', ASCENDING)])
        self.db.attendance_logs.create_index([('is_flagged', ASCENDING)])

        self.db.users.create_index([('username', ASCENDING)], unique=True)
        self.db.users.create_index([('email', ASCENDING)], unique=True)

        self.db.courses.create_index([('code', ASCENDING)], unique=True)
        self.db.rooms.create_index([('name', ASCENDING)], unique=True)

        self.db.attendance_sessions.create_index([('id', ASCENDING)], unique=True)
        self.db.attendance_sessions.create_index([('course_id', ASCENDING)])
        self.db.attendance_sessions.create_index([('status', ASCENDING)])

        self.db.cancellations.create_index([('id', ASCENDING)], unique=True)
        self.db.cancellations.create_index([('course_id', ASCENDING)])

        self.db.excuses.create_index([('id', ASCENDING)], unique=True)
        self.db.excuses.create_index([('student_id', ASCENDING)])
        self.db.excuses.create_index([('course_id', ASCENDING)])

    def _strip_id(self, doc: Optional[Dict]) -> Optional[Dict]:
        if doc and '_id' in doc:
            doc.pop('_id')
        return doc

    # ==================== STUDENTS ====================

    def get_students(self) -> List[Dict[str, Any]]:
        return [self._strip_id(s) for s in self.db.students.find()]

    def get_student(self, student_id: str) -> Optional[Dict[str, Any]]:
        return self._strip_id(self.db.students.find_one({'student_id': student_id}))

    def create_student(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        if 'registered_at' not in student_data:
            student_data['registered_at'] = datetime.now()
        try:
            self.db.students.insert_one(student_data.copy())
            return self._strip_id(student_data)
        except DuplicateKeyError:
            raise ValueError(f"Student {student_data.get('student_id')} already exists")

    def update_student(self, student_id: str, student_data: Dict[str, Any]) -> Dict[str, Any]:
        student_data['updated_at'] = datetime.now()
        result = self.db.students.update_one({'student_id': student_id}, {'$set': student_data})
        if result.matched_count == 0:
            raise ValueError(f"Student {student_id} not found")
        return self.get_student(student_id)

    def delete_student(self, student_id: str) -> bool:
        return self.db.students.delete_one({'student_id': student_id}).deleted_count > 0

    # ==================== ATTENDANCE RECORDS ====================

    def get_attendance_records(self, date: Optional[str] = None) -> List[Dict[str, Any]]:
        query = {}
        if date:
            start = datetime.fromisoformat(date)
            end = datetime.fromisoformat(f"{date}T23:59:59")
            query['timestamp'] = {'$gte': start, '$lte': end}
        return [self._strip_id(r) for r in self.db.attendance_logs.find(query)]

    def create_attendance_record(self, record_data: Dict[str, Any]) -> Dict[str, Any]:
        if 'id' not in record_data:
            record_data['id'] = str(uuid.uuid4())
        if 'timestamp' not in record_data:
            record_data['timestamp'] = datetime.now()
        if 'is_flagged' not in record_data:
            record_data['is_flagged'] = False
        self.db.attendance_logs.insert_one(record_data.copy())
        return self._strip_id(record_data)

    def get_attendance_by_student(self, student_id: str) -> List[Dict[str, Any]]:
        return [self._strip_id(r) for r in self.db.attendance_logs.find({'student_id': student_id})]

    def update_attendance_record(self, record_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        update_data['updated_at'] = datetime.now()
        result = self.db.attendance_logs.update_one({'id': record_id}, {'$set': update_data})
        if result.matched_count == 0:
            raise ValueError(f"Attendance record {record_id} not found")
        return self._strip_id(self.db.attendance_logs.find_one({'id': record_id}))

    def get_flagged_attendance(self) -> List[Dict[str, Any]]:
        return [self._strip_id(r) for r in self.db.attendance_logs.find({'is_flagged': True})]

    # ==================== USERS ====================

    def get_users(self) -> List[Dict[str, Any]]:
        return [self._strip_id(u) for u in self.db.users.find()]

    def get_user(self, username: str) -> Optional[Dict[str, Any]]:
        return self._strip_id(self.db.users.find_one({'username': username}))

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        user_data['created_at'] = datetime.now()
        try:
            self.db.users.insert_one(user_data.copy())
            return self._strip_id(user_data)
        except DuplicateKeyError:
            raise ValueError(f"User {user_data.get('username')} already exists")

    def update_user(self, username: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        user_data['updated_at'] = datetime.now()
        result = self.db.users.update_one({'username': username}, {'$set': user_data})
        if result.matched_count == 0:
            raise ValueError(f"User {username} not found")
        return self.get_user(username)

    def delete_user(self, username: str) -> bool:
        return self.db.users.delete_one({'username': username}).deleted_count > 0

    # ==================== COURSES ====================

    def get_courses(self) -> List[Dict[str, Any]]:
        return [self._strip_id(c) for c in self.db.courses.find()]

    def get_course(self, course_id: int) -> Optional[Dict[str, Any]]:
        return self._strip_id(self.db.courses.find_one({'id': course_id}))

    def create_course(self, course_data: Dict[str, Any]) -> Dict[str, Any]:
        last = self.db.courses.find_one(sort=[('id', -1)])
        course_data['id'] = (last['id'] + 1) if last else 1
        if 'static_qr_code' not in course_data:
            course_data['static_qr_code'] = str(uuid.uuid4())
        if 'enrolled_students' not in course_data:
            course_data['enrolled_students'] = []
        course_data['created_at'] = datetime.now()
        self.db.courses.insert_one(course_data.copy())
        return self._strip_id(course_data)

    def delete_course(self, course_id: int) -> bool:
        return self.db.courses.delete_one({'id': course_id}).deleted_count > 0

    # ==================== ROOMS ====================

    def get_rooms(self) -> List[Dict[str, Any]]:
        return [self._strip_id(r) for r in self.db.rooms.find()]

    def get_room(self, room_id: int) -> Optional[Dict[str, Any]]:
        return self._strip_id(self.db.rooms.find_one({'id': room_id}))

    def create_room(self, room_data: Dict[str, Any]) -> Dict[str, Any]:
        last = self.db.rooms.find_one(sort=[('id', -1)])
        room_data['id'] = (last['id'] + 1) if last else 1
        room_data.setdefault('latitude', None)
        room_data.setdefault('longitude', None)
        room_data.setdefault('geofence_radius', 50)
        room_data['created_at'] = datetime.now()
        self.db.rooms.insert_one(room_data.copy())
        return self._strip_id(room_data)

    def delete_room(self, room_id: int) -> bool:
        return self.db.rooms.delete_one({'id': room_id}).deleted_count > 0

    # ==================== ATTENDANCE SESSIONS ====================

    def get_sessions(
        self,
        course_id: Optional[int] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        query = {}
        if course_id is not None:
            query['course_id'] = course_id
        if status:
            query['status'] = status
        return [self._strip_id(s) for s in self.db.attendance_sessions.find(query)]

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        return self._strip_id(self.db.attendance_sessions.find_one({'id': session_id}))

    def create_session(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        if 'id' not in session_data:
            session_data['id'] = str(uuid.uuid4())
        if 'status' not in session_data:
            session_data['status'] = 'active'
        if 'qr_code' not in session_data:
            session_data['qr_code'] = str(uuid.uuid4())
        session_data['created_at'] = datetime.now()
        self.db.attendance_sessions.insert_one(session_data.copy())
        return self._strip_id(session_data)

    def update_session(self, session_id: str, session_data: Dict[str, Any]) -> Dict[str, Any]:
        session_data['updated_at'] = datetime.now()
        result = self.db.attendance_sessions.update_one({'id': session_id}, {'$set': session_data})
        if result.matched_count == 0:
            raise ValueError(f"Session {session_id} not found")
        return self._strip_id(self.db.attendance_sessions.find_one({'id': session_id}))

    # ==================== CANCELLATIONS ====================

    def get_cancellations(self, course_id: Optional[int] = None) -> List[Dict[str, Any]]:
        query = {}
        if course_id is not None:
            query['course_id'] = course_id
        return [self._strip_id(c) for c in self.db.cancellations.find(query)]

    def create_cancellation(self, cancellation_data: Dict[str, Any]) -> Dict[str, Any]:
        if 'id' not in cancellation_data:
            cancellation_data['id'] = str(uuid.uuid4())
        cancellation_data['notified_at'] = datetime.now()
        self.db.cancellations.insert_one(cancellation_data.copy())
        return self._strip_id(cancellation_data)

    # ==================== EXCUSES ====================

    def get_excuses(
        self,
        student_id: Optional[str] = None,
        course_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        query = {}
        if student_id:
            query['student_id'] = student_id
        if course_id is not None:
            query['course_id'] = course_id
        return [self._strip_id(e) for e in self.db.excuses.find(query)]

    def get_excuse(self, excuse_id: str) -> Optional[Dict[str, Any]]:
        return self._strip_id(self.db.excuses.find_one({'id': excuse_id}))

    def create_excuse(self, excuse_data: Dict[str, Any]) -> Dict[str, Any]:
        if 'id' not in excuse_data:
            excuse_data['id'] = str(uuid.uuid4())
        if 'status' not in excuse_data:
            excuse_data['status'] = 'pending'
        excuse_data['submitted_at'] = datetime.now()
        self.db.excuses.insert_one(excuse_data.copy())
        return self._strip_id(excuse_data)

    def update_excuse(self, excuse_id: str, excuse_data: Dict[str, Any]) -> Dict[str, Any]:
        excuse_data['reviewed_at'] = datetime.now()
        result = self.db.excuses.update_one({'id': excuse_id}, {'$set': excuse_data})
        if result.matched_count == 0:
            raise ValueError(f"Excuse {excuse_id} not found")
        return self._strip_id(self.db.excuses.find_one({'id': excuse_id}))

    # ==================== UTILITY ====================

    def health_check(self) -> Dict[str, Any]:
        try:
            self.client.admin.command('ping')
            return {
                'status': 'healthy',
                'type': 'mongodb',
                'database': self.db.name,
                'collections': len(self.db.list_collection_names()),
                'connected': True
            }
        except ConnectionFailure as e:
            return {
                'status': 'unhealthy',
                'type': 'mongodb',
                'error': str(e),
                'connected': False
            }
