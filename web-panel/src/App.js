import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'instructor':
      return <InstructorDashboard user={user} onLogout={handleLogout} />;
    case 'student':
      return (
        <div className="App">
          <header className="app-header">
            <div className="header-content">
              <h1 className="header-title">Smart Attendance System</h1>
              <p className="header-subtitle">Student Portal</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </header>
          <StudentDashboard user={user} />
        </div>
      );
    case 'admin':
      return (
        <div className="App">
          <header className="app-header admin-header">
            <div className="header-content">
              <h1 className="header-title">Smart Attendance System</h1>
              <p className="header-subtitle">Admin Portal</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </header>
          <AdminDashboard user={user} />
        </div>
      );
    default:
      return (
        <div className="error-container">
          <h2>Invalid user role</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
  }
}

export default App;

