/**
 * excuseService.js
 *
 * Mazeret (excuse) istekleri için backend entegrasyonu.
 * Backend endpoint'leri:
 *   GET   /api/excuses?course_id=&student_id=&status=
 *   GET   /api/excuses/<id>
 *   POST  /api/excuses
 *   PATCH /api/excuses/<id>   → { status: 'approved'|'rejected'|'pending', instructor_notes }
 */

import apiClient from '../../../shared/services/apiClient';

// ── EXCUSE TYPE LABELS ───────────────────────────────────────────────────────

const EXCUSE_TYPE_LABELS = {
  health:          'Sağlık (Doktor Raporu)',
  family:          'Aile Acil Durumu',
  school_activity: 'Okul Etkinliği',
  transportation:  'Ulaşım Sorunu',
  other:           'Diğer',
};

// ── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_EXCUSES = [
  {
    id: 'mock-1',
    student: 'Bob Brown',
    studentId: 'STU12002',
    course: 'CS101',
    courseTitle: 'Introduction to Programming',
    classDate: '2026-03-01',
    excuseType: 'health',
    excuseTypeLabel: 'Sağlık (Doktor Raporu)',
    excuseDescription: 'Şiddetli baş ağrısı nedeniyle doktora gittim. Rapor ekte.',
    documents: [],
    submittedAt: '2026-03-01 10:30',
    status: 'pending',
    excuseCount: 2,
  },
  {
    id: 'mock-2',
    student: 'Charlie Davis',
    studentId: 'STU12003',
    course: 'CS201',
    courseTitle: 'Data Structures',
    classDate: '2026-02-28',
    excuseType: 'school_activity',
    excuseTypeLabel: 'Okul Etkinliği',
    excuseDescription: 'Üniversite basketbol turnuvasına katıldım.',
    documents: [],
    submittedAt: '2026-02-28 14:20',
    status: 'pending',
    excuseCount: 1,
  },
];

// ── DATA NORMALIZER ──────────────────────────────────────────────────────────

function normalizeExcuse(e) {
  return {
    id: e.id,
    student: e.student_name || e.student_id || '—',
    studentId: e.student_id || '—',
    course: e.course_id ? String(e.course_id) : '—',
    courseTitle: e.course_title || '',
    classDate: e.session_date || e.submitted_at?.slice(0, 10) || '—',
    excuseType: e.excuse_type || 'other',
    excuseTypeLabel: EXCUSE_TYPE_LABELS[e.excuse_type] || e.excuse_type || 'Diğer',
    excuseDescription: e.description || '',
    documents: e.document_url ? [{ name: 'Belge', url: e.document_url, type: 'file' }] : [],
    submittedAt: e.submitted_at
      ? new Date(e.submitted_at).toLocaleString('tr-TR')
      : '—',
    status: e.status || 'pending',
    instructorNotes: e.instructor_notes || '',
    excuseCount: e.excuse_count || 1,
  };
}

// ── API CALLS ────────────────────────────────────────────────────────────────

/**
 * Mazeret listesini getirir.
 * @param {object} filters - { course_id, student_id, status }
 */
export const fetchExcuseRecords = async (filters = {}) => {
  try {
    const data = await apiClient.get('/excuses', { params: filters });
    if (data.success) {
      const excuses = (data.excuses || []).map(normalizeExcuse);
      return { success: true, data: excuses };
    }
    throw new Error('Invalid response');
  } catch (err) {
    console.warn('[excuseService] API unavailable, using mock:', err.message);
    return { success: true, data: [...MOCK_EXCUSES] };
  }
};

/**
 * Tekil mazeret kaydını getirir.
 */
export const fetchExcuseById = async (excuseId) => {
  try {
    const data = await apiClient.get(`/excuses/${excuseId}`);
    if (data.success) {
      return { success: true, data: normalizeExcuse(data.excuse) };
    }
    throw new Error('Invalid response');
  } catch (err) {
    console.warn('[excuseService] fetchExcuseById fallback:', err.message);
    const mock = MOCK_EXCUSES.find(e => e.id === excuseId) || MOCK_EXCUSES[0];
    return { success: true, data: mock };
  }
};

/**
 * Mazereti onaylar.
 * PATCH /api/excuses/<id>  → { status: 'approved' }
 */
export const approveExcuse = async (excuseId, instructorNotes = '') => {
  try {
    const data = await apiClient.patch(`/excuses/${excuseId}`, {
      status: 'approved',
      instructor_notes: instructorNotes,
    });
    return { success: !!data.success };
  } catch (err) {
    console.warn('[excuseService] approve failed, simulating:', err.message);
    return { success: true };
  }
};

/**
 * Mazereti reddeder.
 * PATCH /api/excuses/<id>  → { status: 'rejected', instructor_notes: reason }
 */
export const rejectExcuse = async (excuseId, reason = '') => {
  try {
    const data = await apiClient.patch(`/excuses/${excuseId}`, {
      status: 'rejected',
      instructor_notes: reason,
    });
    return { success: !!data.success };
  } catch (err) {
    console.warn('[excuseService] reject failed, simulating:', err.message);
    return { success: true };
  }
};

/**
 * Onay/reddi geri alır — pending durumuna döner.
 * PATCH /api/excuses/<id>  → { status: 'pending' }
 */
export const undoExcuse = async (excuseId) => {
  try {
    const data = await apiClient.patch(`/excuses/${excuseId}`, {
      status: 'pending',
      instructor_notes: '',
    });
    return { success: !!data.success };
  } catch (err) {
    console.warn('[excuseService] undo failed, simulating:', err.message);
    return { success: true };
  }
};

/**
 * Yeni mazeret gönderir (öğrenci tarafı).
 * POST /api/excuses
 */
export const submitExcuse = async ({ studentId, courseId, sessionDate, excuseType, description, documentUrl = '' }) => {
  try {
    const data = await apiClient.post('/excuses', {
      student_id: studentId,
      course_id: courseId,
      session_date: sessionDate,
      excuse_type: excuseType,
      description,
      document_url: documentUrl,
    });
    return { success: !!data.success, excuse: data.excuse };
  } catch (err) {
    console.error('[excuseService] submitExcuse error:', err.message);
    return { success: false, error: err.message };
  }
};
