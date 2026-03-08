/**
 * attendanceService.js
 *
 * Şüpheli (flagged) yoklama kayıtları için backend entegrasyonu.
 * Backend endpoint'leri:
 *   GET   /api/attendance/flagged
 *   PATCH /api/attendance/<id>/review  → { status, is_flagged, flag_reason }
 */

import apiClient from '../../../shared/services/apiClient';

// ── FLAG REASON LABEL MAP ────────────────────────────────────────────────────

const FLAG_REASON_LABELS = {
  duplicate_attendance:     'Çift yoklama girişimi',
  location_bypassed:        'GPS doğrulaması atlandı',
  face_simulated:           'Yüz tanıma simüle edildi',
  location_and_face_bypass: 'GPS ve yüz tanıma ikisi de atlandı',
};

// ── MOCK DATA (backend erişilemezse) ────────────────────────────────────────

const MOCK_FLAGGED = [
  {
    id: 'mock-1',
    student: 'Sarah Johnson',
    studentId: 'STU12345',
    course: 'CS101',
    courseTitle: 'Introduction to Programming',
    timestamp: '2026-03-08 09:05',
    reason: 'Yüz tanıma simüle edildi',
    reasonType: 'warning',
    method: 'GPS + QR',
    location: '—',
    status: 'pending',
  },
  {
    id: 'mock-2',
    student: 'Michael Chen',
    studentId: 'STU12346',
    course: 'CS201',
    courseTitle: 'Data Structures',
    timestamp: '2026-03-08 14:12',
    reason: 'Çift yoklama girişimi',
    reasonType: 'error',
    method: 'QR',
    location: '—',
    status: 'pending',
  },
];

// ── DATA NORMALIZER ──────────────────────────────────────────────────────────
// Backend kaydını UI'ın beklediği shape'e dönüştürür.

function normalizeRecord(r) {
  return {
    id: r.id,
    student: r.name || r.student_id || '—',
    studentId: r.student_id || '—',
    course: r.course_id ? String(r.course_id) : '—',
    courseTitle: r.course_title || '',
    timestamp: r.timestamp
      ? new Date(r.timestamp).toLocaleString('tr-TR')
      : '—',
    reason: FLAG_REASON_LABELS[r.flag_reason] || r.flag_reason || '—',
    reasonType: r.flag_reason === 'duplicate_attendance' ? 'error' : 'warning',
    method: buildMethod(r.verification_steps),
    location: r.verification_steps?.location_distance != null
      ? `${r.verification_steps.location_distance} m`
      : '—',
    status: r.status || 'pending',
  };
}

function buildMethod(steps = {}) {
  const parts = [];
  if (steps.location_ok !== false) parts.push('GPS');
  if (steps.face_ok !== false)     parts.push('Yüz');
  if (steps.qr_ok !== false)       parts.push('QR');
  return parts.length ? parts.join(' + ') : 'QR';
}

// ── API CALLS ────────────────────────────────────────────────────────────────

/**
 * Tüm şüpheli yoklama kayıtlarını getirir.
 */
export const fetchFlaggedRecords = async () => {
  try {
    const data = await apiClient.get('/attendance/flagged');
    if (data.success) {
      const records = (data.records || []).map(normalizeRecord);
      return { success: true, data: records };
    }
    throw new Error('Invalid response');
  } catch (err) {
    console.warn('[attendanceService] API unavailable, using mock:', err.message);
    return { success: true, data: [...MOCK_FLAGGED] };
  }
};

/**
 * Şüpheli kaydı onaylar.
 * PATCH /api/attendance/<id>/review  → status: 'present', is_flagged: false
 */
export const approveFlaggedRecord = async (recordId) => {
  try {
    const data = await apiClient.patch(`/attendance/${recordId}/review`, {
      status: 'present',
      is_flagged: false,
      flag_reason: null,
    });
    return { success: !!data.success };
  } catch (err) {
    console.warn('[attendanceService] approve failed, simulating:', err.message);
    return { success: true };
  }
};

/**
 * Şüpheli kaydı reddeder (absent olarak işaretler).
 * PATCH /api/attendance/<id>/review  → status: 'absent', is_flagged: true
 */
export const rejectFlaggedRecord = async (recordId) => {
  try {
    const data = await apiClient.patch(`/attendance/${recordId}/review`, {
      status: 'absent',
      is_flagged: true,
    });
    return { success: !!data.success };
  } catch (err) {
    console.warn('[attendanceService] reject failed, simulating:', err.message);
    return { success: true };
  }
};

/**
 * Onay/reddi geri alır — tekrar pending'e döner.
 * PATCH /api/attendance/<id>/review  → status: 'pending', is_flagged: true
 */
export const undoFlaggedRecord = async (recordId) => {
  try {
    const data = await apiClient.patch(`/attendance/${recordId}/review`, {
      status: 'pending',
      is_flagged: true,
    });
    return { success: !!data.success };
  } catch (err) {
    console.warn('[attendanceService] undo failed, simulating:', err.message);
    return { success: true };
  }
};

/**
 * Tüm yoklama kayıtlarını getirir (raporlar için).
 */
export const fetchAttendanceRecords = async (filters = {}) => {
  try {
    const data = await apiClient.get('/attendance/records', { params: filters });
    if (data.success) {
      return { success: true, data: data.records || [] };
    }
    throw new Error('Invalid response');
  } catch (err) {
    console.error('[attendanceService] fetchAttendanceRecords error:', err.message);
    return { success: true, data: [] };
  }
};

/**
 * Sınıf detaylarını getirir.
 */
export const fetchClassDetails = async (classId) => {
  try {
    const data = await apiClient.get(`/sessions/${classId}`);
    if (data.success) {
      return { success: true, data: data.session };
    }
    throw new Error('Invalid response');
  } catch (err) {
    console.error('[attendanceService] fetchClassDetails error:', err.message);
    return {
      success: true,
      data: {
        id: classId,
        code: 'CS101',
        title: 'Introduction to Programming',
        room: 'Sınıf 401',
        time: '09:00 - 10:30',
        status: 'Tamamlandı',
        totalStudents: 45,
        present: 42,
        absent: 2,
        flagged: 1,
      },
    };
  }
};
