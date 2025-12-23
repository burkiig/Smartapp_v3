import React, { useState } from 'react';
import './Records.css';

function Records() {
  const [dateRange, setDateRange] = useState('This Month');
  const [course, setCourse] = useState('All Courses');
  const [attendanceMethod, setAttendanceMethod] = useState('All Methods');

  const stats = {
    totalClasses: 66,
    avgAttendance: 92,
    autoAttendance: 95,
    manualReviews: 30
  };

  const coursePerformance = [
    {
      course: 'CS101',
      classes: 24,
      avgAttendance: 94,
      trend: 'up',
      methods: { face: 95, qr: 95 }
    },
    {
      course: 'CS201',
      classes: 22,
      avgAttendance: 89,
      trend: 'down',
      methods: { face: 93, qr: 93 }
    },
    {
      course: 'CS301',
      classes: 20,
      avgAttendance: 92,
      trend: 'up',
      methods: { face: 94, qr: 94 }
    }
  ];

  const failureReasons = [
    { reason: 'Face verification failed', count: 12, percentage: 40, color: '#F59E0B' },
    { reason: 'GPS unstable', count: 9, percentage: 30, color: '#F59E0B' },
    { reason: 'Device integrity warning', count: 6, percentage: 20, color: '#F59E0B' },
    { reason: 'Network issue', count: 3, percentage: 10, color: '#F59E0B' }
  ];

  const exportPDF = () => {
    alert('Exporting as PDF...');
  };

  const exportExcel = () => {
    alert('Exporting as Excel...');
  };

  const scheduleReport = () => {
    alert('Schedule Report...');
  };

  return (
    <div className="records-container">
      {/* Header */}
      <div className="records-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">View attendance insights and export data</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-left">
          <span className="filter-icon">🔍</span>
          <span className="filter-label">Filters</span>
        </div>
        <div className="filters-right">
          <div className="filter-group">
            <label>Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>Custom</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Course</label>
            <select 
              value={course} 
              onChange={(e) => setCourse(e.target.value)}
              className="filter-select"
            >
              <option>All Courses</option>
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Attendance Method</label>
            <select 
              value={attendanceMethod} 
              onChange={(e) => setAttendanceMethod(e.target.value)}
              className="filter-select"
            >
              <option>All Methods</option>
              <option>Face Recognition</option>
              <option>QR Code</option>
              <option>Manual</option>
            </select>
          </div>

          <button className="export-btn" onClick={exportPDF}>
            📥 Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Classes</div>
          <div className="stat-value">{stats.totalClasses}</div>
          <div className="stat-change positive">
            <span>↑</span> +8% from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Avg Attendance</div>
          <div className="stat-value">{stats.avgAttendance}%</div>
          <div className="stat-change positive">
            <span>↑</span> +2% from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Auto Attendance</div>
          <div className="stat-value">{stats.autoAttendance}%</div>
          <div className="stat-footer">Face ID + QR</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Manual Reviews</div>
          <div className="stat-value">{stats.manualReviews}</div>
          <div className="stat-footer">This month</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Course Performance */}
        <div className="content-section">
          <h2 className="section-title">Course Performance</h2>
          <div className="performance-table">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Classes</th>
                  <th>Avg Attendance</th>
                  <th>Trend</th>
                  <th>Methods</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformance.map((item, index) => (
                  <tr key={index}>
                    <td className="course-name">{item.course}</td>
                    <td>{item.classes}</td>
                    <td>
                      <div className="attendance-cell">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${item.avgAttendance}%`}}
                          ></div>
                        </div>
                        <span className="attendance-value">{item.avgAttendance}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`trend-icon ${item.trend}`}>
                        {item.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </td>
                    <td>
                      <div className="methods-badges">
                        <span className="method-badge">face {item.methods.face}%</span>
                        <span className="method-badge">QR {item.methods.qr}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Common Failure Reasons */}
        <div className="content-section">
          <h2 className="section-title">Common Failure Reasons</h2>
          <div className="failure-reasons">
            {failureReasons.map((item, index) => (
              <div key={index} className="failure-item">
                <div className="failure-header">
                  <span className="failure-reason">{item.reason}</span>
                  <span className="failure-count">{item.count}</span>
                </div>
                <div className="failure-bar-container">
                  <div 
                    className="failure-bar" 
                    style={{
                      width: `${item.percentage}%`,
                      background: item.color
                    }}
                  ></div>
                </div>
                <div className="failure-percentage">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h2 className="section-title">Export Options</h2>
        <div className="export-buttons">
          <button className="export-option-btn" onClick={exportPDF}>
            <span className="export-icon">📄</span>
            <span>Export as PDF</span>
          </button>
          <button className="export-option-btn" onClick={exportExcel}>
            <span className="export-icon">📊</span>
            <span>Export as Excel</span>
          </button>
          <button className="export-option-btn" onClick={scheduleReport}>
            <span className="export-icon">📅</span>
            <span>Schedule Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Records;
