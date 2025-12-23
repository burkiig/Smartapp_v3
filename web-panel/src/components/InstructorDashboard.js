import React, { useState } from 'react';
import Dashboard from './Dashboard';
import WeeklySchedule from './WeeklySchedule';
import Register from './Register';
import Attendance from './Attendance';
import Students from './Students';
import Records from './Records';
import Settings from './Settings';
import './InstructorDashboard.css';

function InstructorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="instructor-dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="app-title">Attendance System</h2>
          <p className="app-subtitle">Instructor Panel</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>
          <button
            className={activeTab === 'schedule' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('schedule')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-label">Weekly Schedule</span>
          </button>
          <button
            className={activeTab === 'attendance' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('attendance')}
          >
            <span className="nav-icon">✓</span>
            <span className="nav-label">Flagged Attendance</span>
            <span className="badge">3</span>
          </button>
          <button
            className={activeTab === 'reports' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('reports')}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-label">Reports</span>
          </button>
          <button
            className={activeTab === 'register' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('register')}
          >
            <span className="nav-icon">➕</span>
            <span className="nav-label">Register Student</span>
          </button>
          <button
            className={activeTab === 'students' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('students')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-label">Students</span>
          </button>
          <button
            className={activeTab === 'settings' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="instructor-info">
            <div className="instructor-avatar">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="instructor-details">
              <div className="instructor-name">{user.name}</div>
              <div className="instructor-dept">{user.department}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'schedule' && <WeeklySchedule />}
        {activeTab === 'register' && <Register />}
        {activeTab === 'attendance' && <Attendance />}
        {activeTab === 'students' && <Students />}
        {activeTab === 'reports' && <Records />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default InstructorDashboard;

