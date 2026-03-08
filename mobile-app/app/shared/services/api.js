/**
 * Merkezi API Servisi
 * Tüm backend endpoint çağrıları buradan yapılır.
 * apiAdapter → apiClient (Axios + JWT interceptor + NetInfo) üzerinde çalışır.
 */
import apiAdapter from '../utils/apiAdapter';

// ==================== AUTH ====================

export const auth = {
  /** POST /api/login */
  login: (username, password) =>
    apiAdapter.post('/login', { username, password }),

  /** POST /api/logout */
  logout: () =>
    apiAdapter.post('/logout', {}),

  /** POST /api/users/push-token */
  savePushToken: (push_token) =>
    apiAdapter.post('/users/push-token', { push_token }),

  /** POST /api/auth/refresh */
  refresh: () =>
    apiAdapter.post('/auth/refresh', {}),
};

// ==================== SESSIONS ====================

export const sessions = {
  /** GET /api/sessions/active */
  getActive: () =>
    apiAdapter.get('/sessions/active'),

  /** GET /api/sessions?course_id=&status= */
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    ).toString();
    return apiAdapter.get(`/sessions${query ? `?${query}` : ''}`);
  },

  /** GET /api/sessions/<id> */
  get: (sessionId) =>
    apiAdapter.get(`/sessions/${sessionId}`),

  /** POST /api/sessions */
  create: (courseId, date, startTime, endTime) =>
    apiAdapter.post('/sessions', {
      course_id: courseId,
      date,
      start_time: startTime,
      end_time: endTime,
    }),

  /** POST /api/sessions/<id>/close */
  close: (sessionId) =>
    apiAdapter.post(`/sessions/${sessionId}/close`, {}),
};

// ==================== ATTENDANCE ====================

export const attendance = {
  /** GET /api/attendance/records?date= */
  getRecords: (date) => {
    const query = date ? `?date=${date}` : '';
    return apiAdapter.get(`/attendance/records${query}`);
  },

  /**
   * POST /api/attendance — yüz tanıma ile yoklama
   * @param {string} imageBase64 - base64 encoded image
   * @param {string} sessionId
   * @param {{ gps: bool, face: bool, qr: bool }} verificationSteps
   * @param {{ lat: number, lng: number }} location
   */
  markWithFace: (imageBase64, sessionId, verificationSteps = {}, location = null) =>
    apiAdapter.post('/attendance', {
      image: imageBase64,
      session_id: sessionId,
      verification_steps: verificationSteps,
      location,
    }),

  /** GET /api/attendance/flagged */
  getFlagged: () =>
    apiAdapter.get('/attendance/flagged'),

  /** PATCH /api/attendance/<id>/review */
  review: (recordId, isFlagged, flagReason, status) =>
    apiAdapter.patch(`/attendance/${recordId}/review`, {
      is_flagged: isFlagged,
      flag_reason: flagReason,
      status,
    }),
};

// ==================== QR VERIFICATION ====================

export const qrVerify = {
  /**
   * POST /api/verify/qr
   * Yoklama zincirinin son adımı. Tüm doğrulama adımlarının sonuçlarını da gönderir
   * (backend şüpheli durumları tespit etmek için kullanır).
   *
   * @param {string}  sessionId         - Aktif oturum UUID'si
   * @param {string}  qrCode            - QR okuyucudan okunan değer
   * @param {object}  verificationMeta  - Önceki adımlardan gelen ek bilgiler
   * @param {boolean} verificationMeta.location_bypassed - GPS dev modda atlandıysa true
   * @param {boolean} verificationMeta.face_simulated    - Yüz tanıma simüle edildiyse true
   * @param {number}  verificationMeta.location_distance - GPS mesafesi (metre)
   * @param {number}  verificationMeta.face_confidence   - Yüz güven skoru 0-1
   */
  verify: (sessionId, qrCode, verificationMeta = {}) =>
    apiAdapter.post('/verify/qr', {
      session_id: sessionId,
      qr_code: qrCode,
      location_bypassed: verificationMeta.location_bypassed ?? false,
      face_simulated: verificationMeta.face_simulated ?? true,
      location_distance: verificationMeta.location_distance ?? null,
      face_confidence: verificationMeta.face_confidence ?? null,
    }),
};

// ==================== STUDENTS ====================

export const students = {
  /** GET /api/students */
  list: () =>
    apiAdapter.get('/students'),

  /**
   * POST /api/register
   * @param {string} studentId
   * @param {string} name
   * @param {string} [imageBase64]
   */
  register: (studentId, name, imageBase64 = null) =>
    apiAdapter.post('/register', {
      student_id: studentId,
      name,
      image: imageBase64,
    }),

  /** DELETE /api/students/<id> */
  delete: (studentId) =>
    apiAdapter.delete(`/students/${studentId}`),
};

// ==================== COURSES ====================

export const courses = {
  /** GET /api/courses */
  list: () =>
    apiAdapter.get('/courses'),
};

// ==================== EXCUSES ====================

export const excuses = {
  /**
   * GET /api/excuses?student_id=&course_id=
   */
  list: (studentId, courseId) => {
    const params = [];
    if (studentId) params.push(`student_id=${studentId}`);
    if (courseId)  params.push(`course_id=${courseId}`);
    return apiAdapter.get(`/excuses${params.length ? `?${params.join('&')}` : ''}`);
  },

  /**
   * POST /api/excuses
   * @param {object} params
   * @param {string} params.studentId
   * @param {string|number} params.courseId
   * @param {string} params.sessionDate   - 'YYYY-MM-DD'
   * @param {string} params.excuseType    - 'health'|'family'|'school_activity'|'transportation'|'other'
   * @param {string} params.description
   * @param {string} [params.documentUrl]
   */
  submit: ({ studentId, courseId, sessionDate, excuseType, description, documentUrl = '' }) =>
    apiAdapter.post('/excuses', {
      student_id: studentId,
      course_id: courseId,
      session_date: sessionDate,
      excuse_type: excuseType,
      description,
      document_url: documentUrl,
    }),

  /**
   * PATCH /api/excuses/<id>
   */
  review: (excuseId, status, notes = '') =>
    apiAdapter.patch(`/excuses/${excuseId}`, {
      status,
      instructor_notes: notes,
    }),
};

// ==================== DASHBOARD ====================

export const dashboard = {
  stats: () =>
    apiAdapter.get('/dashboard/stats'),

  coursePerformance: () =>
    apiAdapter.get('/dashboard/course-performance'),

  recentActivity: () =>
    apiAdapter.get('/dashboard/recent-activity'),
};
