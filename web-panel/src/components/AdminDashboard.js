import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstructors: 0,
    totalStudents: 0,
    totalClasses: 0,
    systemHealth: 98
  });

  const [users, setUsers] = useState([
    { id: 1, username: 'admin', name: 'System Administrator', role: 'admin', email: 'admin@attendance.com', status: 'active' },
    { id: 2, username: 'instructor1', name: 'Dr. Robert Chen', role: 'instructor', email: 'robert.chen@university.edu', status: 'active', department: 'Computer Science' },
    { id: 3, username: 'student1', name: 'John Doe', role: 'student', email: 'john.doe@student.edu', status: 'active', studentId: '2021001' },
  ]);

  const [courses, setCourses] = useState([
    { id: 1, code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Robert Chen', students: 45, schedule: 'Mon, Wed 09:00-10:30', room: 'A-101' },
    { id: 2, code: 'CS102', name: 'Data Structures', instructor: 'Dr. Sarah Johnson', students: 38, schedule: 'Tue, Thu 11:00-12:30', room: 'B-205' },
    { id: 3, code: 'CS103', name: 'Algorithms', instructor: 'Dr. Michael Brown', students: 42, schedule: 'Mon, Wed 14:00-15:30', room: 'C-301' },
    { id: 4, code: 'CS104', name: 'Database Systems', instructor: 'Dr. Robert Chen', students: 40, schedule: 'Tue, Thu 13:00-14:30', room: 'A-102' },
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, name: 'A-101', capacity: 50, type: 'Lecture Hall', equipment: 'Projector, Whiteboard', status: 'available' },
    { id: 2, name: 'A-102', capacity: 45, type: 'Lecture Hall', equipment: 'Projector, Whiteboard', status: 'available' },
    { id: 3, name: 'B-205', capacity: 40, type: 'Computer Lab', equipment: 'Projector, 40 PCs', status: 'occupied' },
    { id: 4, name: 'C-301', capacity: 60, type: 'Lecture Hall', equipment: 'Projector, Whiteboard, Audio System', status: 'available' },
  ]);

  const [activities, setActivities] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', name: '', email: '', role: 'student', password: '' });
  const [newCourse, setNewCourse] = useState({ code: '', name: '', instructor: '', schedule: '', room: '' });
  const [newRoom, setNewRoom] = useState({ name: '', capacity: '', type: 'Lecture Hall', equipment: '' });

  useEffect(() => {
    fetchStats();
    fetchActivities();
  }, []);

  const fetchStats = () => {
    setStats({
      totalUsers: users.length,
      totalInstructors: users.filter(u => u.role === 'instructor').length,
      totalStudents: users.filter(u => u.role === 'student').length,
      totalClasses: courses.length,
      systemHealth: 98
    });
  };

  const fetchActivities = () => {
    const mockActivities = [
      { type: 'user', action: 'New instructor registered', user: 'Dr. Sarah Johnson', time: '5 mins ago', icon: '👨‍🏫' },
      { type: 'system', action: 'System backup completed', user: 'System', time: '1 hour ago', icon: '💾' },
      { type: 'attendance', action: 'Bulk attendance recorded', user: 'CS101', time: '2 hours ago', icon: '✓' },
      { type: 'user', action: 'New student enrolled', user: 'Jane Smith', time: '3 hours ago', icon: '🎓' },
      { type: 'system', action: 'Database optimized', user: 'System', time: '5 hours ago', icon: '⚙️' },
    ];
    setActivities(mockActivities);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const user = {
      id: users.length + 1,
      ...newUser,
      status: 'active'
    };
    setUsers([...users, user]);
    setNewUser({ username: '', name: '', email: '', role: 'student', password: '' });
    setShowAddUserModal(false);
    fetchStats();
    alert('User added successfully!');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
      fetchStats();
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    const course = {
      id: courses.length + 1,
      ...newCourse,
      students: 0
    };
    setCourses([...courses, course]);
    setNewCourse({ code: '', name: '', instructor: '', schedule: '', room: '' });
    setShowAddCourseModal(false);
    fetchStats();
    alert('Course added successfully!');
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== courseId));
      fetchStats();
    }
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const room = {
      id: rooms.length + 1,
      ...newRoom,
      status: 'available'
    };
    setRooms([...rooms, room]);
    setNewRoom({ name: '', capacity: '', type: 'Lecture Hall', equipment: '' });
    setShowAddRoomModal(false);
    alert('Room added successfully!');
  };

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== roomId));
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'instructor': return 'role-instructor';
      case 'student': return 'role-student';
      default: return '';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <h1>System Administration</h1>
          <p className="subtitle">Welcome, {user.name}</p>
        </div>
        <div className="header-actions">
          {activeTab === 'users' && (
            <button className="action-btn primary" onClick={() => setShowAddUserModal(true)}>
              <span className="btn-icon">➕</span>
              Add User
            </button>
          )}
          {activeTab === 'courses' && (
            <button className="action-btn primary" onClick={() => setShowAddCourseModal(true)}>
              <span className="btn-icon">➕</span>
              Add Course
            </button>
          )}
          {activeTab === 'rooms' && (
            <button className="action-btn primary" onClick={() => setShowAddRoomModal(true)}>
              <span className="btn-icon">➕</span>
              Add Room
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="tab-icon">👥</span>
          Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <span className="tab-icon">📚</span>
          Courses
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          <span className="tab-icon">🏫</span>
          Rooms
        </button>
        <button 
          className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          <span className="tab-icon">⚙️</span>
          System
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card red">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">👥</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
                <div className="stat-trend positive">All roles</div>
              </div>
            </div>

            <div className="admin-stat-card blue">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">👨‍🏫</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalInstructors}</div>
                <div className="stat-label">Instructors</div>
                <div className="stat-trend positive">Active</div>
              </div>
            </div>

            <div className="admin-stat-card green">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🎓</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalStudents}</div>
                <div className="stat-label">Students</div>
                <div className="stat-trend positive">Enrolled</div>
              </div>
            </div>

            <div className="admin-stat-card purple">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">📚</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.totalClasses}</div>
                <div className="stat-label">Active Courses</div>
                <div className="stat-trend neutral">This semester</div>
              </div>
            </div>

            <div className="admin-stat-card orange">
              <div className="stat-icon-wrapper">
                <span className="stat-icon">🏫</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{rooms.length}</div>
                <div className="stat-label">Total Rooms</div>
                <div className="stat-trend positive">{rooms.filter(r => r.status === 'available').length} available</div>
              </div>
            </div>
          </div>

          <div className="admin-content-grid">
            <div className="admin-card activity-card">
              <div className="card-header">
                <h2>Recent Activity</h2>
                <button className="view-all-link">View All</button>
              </div>
              <div className="activity-list">
                {activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-details">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-meta">
                        <span className="activity-user">{activity.user}</span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-card users-card">
          <div className="card-header">
            <h2>User Management</h2>
            <div className="card-actions">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="search-input"
              />
            </div>
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-username">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <span className="status-badge active">Active</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit" title="Edit">✏️</button>
                        <button className="icon-btn delete" title="Delete" onClick={() => handleDeleteUser(user.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="admin-card courses-card">
          <div className="card-header">
            <h2>Course Management</h2>
            <div className="card-actions">
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="search-input"
              />
            </div>
          </div>
          <div className="courses-table">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Students</th>
                  <th>Schedule</th>
                  <th>Room</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td><strong>{course.code}</strong></td>
                    <td>{course.name}</td>
                    <td>{course.instructor}</td>
                    <td>{course.students}</td>
                    <td>{course.schedule}</td>
                    <td>{course.room}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit" title="Edit">✏️</button>
                        <button className="icon-btn delete" title="Delete" onClick={() => handleDeleteCourse(course.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div className="admin-card rooms-card">
          <div className="card-header">
            <h2>Room Management</h2>
            <div className="card-actions">
              <input 
                type="text" 
                placeholder="Search rooms..." 
                className="search-input"
              />
            </div>
          </div>
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span className={`room-status ${room.status}`}>
                    {room.status === 'available' ? '✓ Available' : '● Occupied'}
                  </span>
                </div>
                <div className="room-details">
                  <div className="room-detail">
                    <span className="detail-icon">👥</span>
                    <span>Capacity: {room.capacity}</span>
                  </div>
                  <div className="room-detail">
                    <span className="detail-icon">🏢</span>
                    <span>{room.type}</span>
                  </div>
                  <div className="room-detail">
                    <span className="detail-icon">🔧</span>
                    <span>{room.equipment}</span>
                  </div>
                </div>
                <div className="room-actions">
                  <button className="icon-btn edit" title="Edit">✏️</button>
                  <button className="icon-btn delete" title="Delete" onClick={() => handleDeleteRoom(room.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="admin-card system-card">
          <div className="card-header">
            <h2>System Overview</h2>
            <span className="status-indicator online">● Online</span>
          </div>
          <div className="system-metrics">
            <div className="metric">
              <div className="metric-label">Server Status</div>
              <div className="metric-value">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '98%' }}></div>
                </div>
                <span className="metric-text">98% Uptime</span>
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Database</div>
              <div className="metric-value">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <span className="metric-text">75% Used</span>
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Storage</div>
              <div className="metric-value">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '45%' }}></div>
                </div>
                <span className="metric-text">45% Used</span>
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">API Response Time</div>
              <div className="metric-value">
                <div className="progress-bar">
                  <div className="progress-fill success" style={{ width: '95%' }}></div>
                </div>
                <span className="metric-text">125ms avg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="modal-close" onClick={() => setShowAddUserModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  required
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="modal-overlay" onClick={() => setShowAddCourseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Course</h2>
              <button className="modal-close" onClick={() => setShowAddCourseModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCourse} className="modal-form">
              <div className="form-group">
                <label>Course Code</label>
                <input
                  type="text"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                  placeholder="e.g., CS105"
                  required
                />
              </div>
              <div className="form-group">
                <label>Course Name</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  placeholder="e.g., Web Development"
                  required
                />
              </div>
              <div className="form-group">
                <label>Instructor</label>
                <select
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                  required
                >
                  <option value="">Select Instructor</option>
                  {users.filter(u => u.role === 'instructor').map(instructor => (
                    <option key={instructor.id} value={instructor.name}>{instructor.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Schedule</label>
                <input
                  type="text"
                  value={newCourse.schedule}
                  onChange={(e) => setNewCourse({...newCourse, schedule: e.target.value})}
                  placeholder="e.g., Mon, Wed 09:00-10:30"
                  required
                />
              </div>
              <div className="form-group">
                <label>Room</label>
                <select
                  value={newCourse.room}
                  onChange={(e) => setNewCourse({...newCourse, room: e.target.value})}
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.name}>{room.name} ({room.type})</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddCourseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="modal-overlay" onClick={() => setShowAddRoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Room</h2>
              <button className="modal-close" onClick={() => setShowAddRoomModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddRoom} className="modal-form">
              <div className="form-group">
                <label>Room Name</label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  placeholder="e.g., A-103"
                  required
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                  placeholder="e.g., 50"
                  required
                />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                  required
                >
                  <option value="Lecture Hall">Lecture Hall</option>
                  <option value="Computer Lab">Computer Lab</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Seminar Room">Seminar Room</option>
                </select>
              </div>
              <div className="form-group">
                <label>Equipment</label>
                <input
                  type="text"
                  value={newRoom.equipment}
                  onChange={(e) => setNewRoom({...newRoom, equipment: e.target.value})}
                  placeholder="e.g., Projector, Whiteboard"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddRoomModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
