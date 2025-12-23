import React, { useState } from 'react';
import './Attendance.css';

function Attendance() {
  const [activeTab, setActiveTab] = useState('all');
  const [flaggedRecords, setFlaggedRecords] = useState([
    {
      id: 1,
      student: 'Sarah Johnson',
      studentId: 'STU12345',
      course: 'CS101',
      courseTitle: 'Introduction to Programming',
      timestamp: '2025-12-07 09:05',
      reason: 'Face verification failed',
      reasonType: 'error',
      method: 'FACE',
      location: '95%',
      status: 'pending'
    },
    {
      id: 2,
      student: 'Michael Chen',
      studentId: 'STU12346',
      course: 'CS201',
      courseTitle: 'Data Structures',
      timestamp: '2025-12-07 14:12',
      reason: 'GPS unstable',
      reasonType: 'warning',
      method: 'QR',
      location: '62%',
      status: 'pending'
    },
    {
      id: 3,
      student: 'Emma Davis',
      studentId: 'STU12347',
      course: 'CS101',
      courseTitle: 'Introduction to Programming',
      timestamp: '2025-12-07 09:08',
      reason: 'Device integrity warning',
      reasonType: 'warning',
      method: 'FACE + QR',
      location: '88%',
      status: 'pending',
      deviceWarning: true
    }
  ]);

  const tabs = [
    { id: 'all', label: 'All', count: 3 },
    { id: 'pending', label: 'Pending', count: 3 },
    { id: 'approved', label: 'Approved', count: 0 },
    { id: 'rejected', label: 'Rejected', count: 0 }
  ];

  const handleApprove = (id) => {
    setFlaggedRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, status: 'approved' } : record
      )
    );
  };

  const handleReject = (id) => {
    setFlaggedRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, status: 'rejected' } : record
      )
    );
  };

  const filteredRecords = flaggedRecords.filter(record => {
    if (activeTab === 'all') return true;
    return record.status === activeTab;
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="attendance-container">
      {/* Header */}
      <div className="attendance-header">
        <div>
          <h2>Flagged Attendance Records</h2>
          <p className="subtitle">Review and approve attendance records that need manual verification</p>
        </div>
        <div className="pending-badge">
          {tabs.find(t => t.id === 'pending').count} Pending Review
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No flagged records found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="flagged-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Timestamp</th>
                <th>Reason</th>
                <th>Method</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">{getInitials(record.student)}</div>
                      <div>
                        <div className="student-name">{record.student}</div>
                        <div className="student-id">{record.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="course-cell">
                      <div className="course-code">{record.course}</div>
                      <div className="course-title">{record.courseTitle}</div>
                    </div>
                  </td>
                  <td>
                    <div className="timestamp">{record.timestamp}</div>
                  </td>
                  <td>
                    <span className={`reason-badge reason-${record.reasonType}`}>
                      {record.reasonType === 'error' ? '⚠️' : '⚠'} {record.reason}
                    </span>
                    {record.deviceWarning && (
                      <div className="device-warning">⚠️ Device warning</div>
                    )}
                  </td>
                  <td>
                    <span className="method-badge">{record.method}</span>
                  </td>
                  <td>
                    <div className="location-cell">
                      <span className="location-icon">📍</span> {record.location}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${record.status}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {record.status === 'pending' && (
                        <>
                          <button 
                            className="action-btn approve-btn"
                            onClick={() => handleApprove(record.id)}
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button 
                            className="action-btn reject-btn"
                            onClick={() => handleReject(record.id)}
                            title="Reject"
                          >
                            ✗
                          </button>
                        </>
                      )}
                      <button className="action-btn details-btn" title="View Details">
                        👁
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Attendance;

