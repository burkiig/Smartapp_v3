import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userType, setUserType] = useState('student'); // 'student' or 'instructor'
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (type, email, name) => {
    setUserType(type);
    setUserEmail(email);
    setUserName(name || (type === 'instructor' ? 'Dr. Robert Chen' : 'John Doe'));
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserType('student');
    setUserEmail('');
    setUserName('');
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ 
      userType, 
      userEmail, 
      userName,
      isLoggedIn, 
      login, 
      logout 
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


