import React, { createContext, useState, useContext, useEffect } from 'react';
import { hasToken, clearTokens } from '../../src/utils/tokenStorage';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userType, setUserType] = useState('student'); // 'student' or 'instructor'
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const tokenExists = await hasToken();
      setIsLoggedIn(tokenExists);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (type, email, name, id = null) => {
    setUserType(type);
    setUserEmail(email);
    setUserName(name || (type === 'instructor' ? 'Dr. Robert Chen' : 'John Doe'));
    setUserId(id || email);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Clear tokens from secure storage
      await clearTokens();
      
      // Reset state
      setUserType('student');
      setUserEmail('');
      setUserName('');
      setUserId('');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      userType, 
      userEmail, 
      userName,
      userId,
      isLoggedIn,
      isLoading,
      login, 
      logout,
      checkAuthStatus
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}


