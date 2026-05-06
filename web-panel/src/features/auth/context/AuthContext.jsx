import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, getMe } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      const profile = await getMe();
      if (profile) {
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    };
    init();
  }, []);

  // Oturum sona erdiğinde (cookie expire) kullanıcı aktif olmasa bile UI temizlenir.
  // Her 5 dakikada bir /auth/me çağrısı yapılır; başarısız olursa logout.
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const profile = await getMe();
      if (!profile) {
        setUser(null);
        localStorage.removeItem('user');
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (loginIdentifier, password) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await loginUser(loginIdentifier, password);

      if (result.success) {
        setUser(result.user);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMessage = 'Beklenmeyen bir hata oluştu';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();  // server clears httpOnly cookies
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
