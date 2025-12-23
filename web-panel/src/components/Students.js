import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Students.css';

const API_URL = 'http://localhost:5000';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/students`);
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Öğrenciler yüklenemedi:', error);
    }
    setLoading(false);
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/api/students/${studentId}`);
      if (response.data.success) {
        loadStudents();
      }
    } catch (error) {
      console.error('Öğrenci silinemedi:', error);
    }
  };

  if (loading) {
    return (
      <div className="students-container">
        <h2>Kayıtlı Öğrenciler</h2>
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="students-container">
      <div className="header-with-button">
        <div>
          <h2>Students</h2>
          <p style={{fontSize: '16px', color: '#86868b', marginTop: '4px'}}>
            Toplam {students.length} öğrenci kayıtlı
          </p>
        </div>
        <button className="btn btn-primary" onClick={loadStudents}>
          🔄 Yenile
        </button>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <p>Henüz kayıtlı öğrenci yok</p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map((student) => (
            <div key={student.student_id} className="student-card">
              <img
                src={`${API_URL}/static/faces/${student.image}`}
                alt={student.name}
                className="student-image"
              />
              <h3>{student.name}</h3>
              <p className="student-id">No: {student.student_id}</p>
              <button
                className="btn btn-danger"
                onClick={() => deleteStudent(student.student_id)}
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;

