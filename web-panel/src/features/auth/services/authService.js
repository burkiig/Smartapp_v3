// Boş string = relative URL → hem localhost:5000'de hem ngrok URL'sinde çalışır
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Login service — calls real Flask API and stores JWT tokens
 * @param {string} username
 * @param {string} password
 * @param {string} role
 * @returns {Promise<{success: boolean, user?: object, access_token?: string, error?: string}>}
 */
export const loginUser = async (username, password, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.message || 'Giriş başarısız' };
    }

    if (data.user.role !== role) {
      return {
        success: false,
        error: `Bu hesap ${role} olarak kayıtlı değil`
      };
    }

    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    return {
      success: true,
      user: data.user,
      access_token: data.access_token,
      refresh_token: data.refresh_token
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Bağlantı hatası. Sunucu çalışıyor mu?' };
  }
};

/**
 * Register student — calls real Flask API with JWT token
 * @param {object} userData  { studentId, name, image }
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const registerUser = async (userData) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        student_id: userData.studentId,
        name: userData.name,
        image: userData.image
      })
    });

    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: 'Bağlantı hatası. Sunucu çalışıyor mu?' };
  }
};

/**
 * Logout service — calls Flask logout endpoint with JWT token
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('access_token');
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};
