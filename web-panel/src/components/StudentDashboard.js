import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

function StudentDashboard({ user }) {
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    attended: 0,
    percentage: 0,
    thisWeek: 0
  });

  useEffect(() => {
    // Mock data - gerçek uygulamada API'den gelecek
    const mockAttendance = [
      { date: '2024-01-08', course: 'CS101', status: 'present', time: '09:00' },
      { date: '2024-01-08', course: 'CS102', status: 'present', time: '11:00' },
      { date: '2024-01-07', course: 'CS101', status: 'present', time: '09:00' },
      { date: '2024-01-07', course: 'CS103', status: 'absent', time: '14:00' },
      { date: '2024-01-06', course: 'CS102', status: 'present', time: '11:00' },
      { date: '2024-01-05', course: 'CS104', status: 'present', time: '13:00' },
    ];

    setAttendanceData(mockAttendance);
    
    const attended = mockAttendance.filter(a => a.status === 'present').length;
    const total = mockAttendance.length;
    const percentage = Math.round((attended / total) * 100);
    
    setStats({
      totalClasses: total,
      attended: attended,
      percentage: percentage,
      thisWeek: 4
    });
  }, []);

  const courses = [
    { code: 'CS101', name: 'Introduction to Programming', attendance: 95 },
    { code: 'CS102', name: 'Data Structures', attendance: 90 },
    { code: 'CS103', name: 'Algorithms', attendance: 85 },
    { code: 'CS104', name: 'Database Systems', attendance: 92 }
  ];

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user.name}!</h1>
          <p className="subtitle">Student ID: {user.student_id}</p>
        </div>
        <div className="user-avatar-large">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.percentage}%</div>
            <div className="stat-label">Overall Attendance</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.attended}</div>
            <div className="stat-label">Classes Attended</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalClasses}</div>
            <div className="stat-label">Total Classes</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📆</div>
          <div className="stat-content">
            <div className="stat-value">{stats.thisWeek}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card courses-card">
          <div className="card-header">
            <h2>My Courses</h2>
            <span className="badge">{courses.length} Courses</span>
          </div>
          <div className="courses-list">
            {courses.map((course) => (
              <div key={course.code} className="course-item">
                <div className="course-info">
                  <div className="course-code">{course.code}</div>
                  <div className="course-name">{course.name}</div>
                </div>
                <div className="course-attendance">
                  <div className="attendance-bar">
                    <div 
                      className="attendance-fill" 
                      style={{ width: `${course.attendance}%` }}
                    ></div>
                  </div>
                  <span className="attendance-percentage">{course.attendance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card attendance-card">
          <div className="card-header">
            <h2>Recent Attendance</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="attendance-list">
            {attendanceData.map((record, index) => (
              <div key={index} className="attendance-item">
                <div className="attendance-date">
                  <div className="date-day">{new Date(record.date).getDate()}</div>
                  <div className="date-month">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
                <div className="attendance-details">
                  <div className="attendance-course">{record.course}</div>
                  <div className="attendance-time">{record.time}</div>
                </div>
                <div className={`attendance-status ${record.status}`}>
                  {record.status === 'present' ? '✓ Present' : '✗ Absent'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card schedule-card">
        <div className="card-header">
          <h2>Today's Schedule</h2>
          <span className="date-badge">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <div className="schedule-list">
          <div className="schedule-item">
            <div className="schedule-time">09:00 - 10:30</div>
            <div className="schedule-details">
              <div className="schedule-course">CS101 - Introduction to Programming</div>
              <div className="schedule-location">📍 Room A-101</div>
            </div>
            <div className="schedule-status upcoming">Upcoming</div>
          </div>
          <div className="schedule-item">
            <div className="schedule-time">11:00 - 12:30</div>
            <div className="schedule-details">
              <div className="schedule-course">CS102 - Data Structures</div>
              <div className="schedule-location">📍 Room B-205</div>
            </div>
            <div className="schedule-status upcoming">Upcoming</div>
          </div>
          <div className="schedule-item">
            <div className="schedule-time">14:00 - 15:30</div>
            <div className="schedule-details">
              <div className="schedule-course">CS103 - Algorithms</div>
              <div className="schedule-location">📍 Room C-301</div>
            </div>
            <div className="schedule-status upcoming">Upcoming</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

