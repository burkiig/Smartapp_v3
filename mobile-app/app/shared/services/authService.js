/**
 * Mobile Auth Service
 * Gerçek Flask backend'e bağlanır, SecureStore'a JWT token kaydeder.
 */
import { auth } from './api';
import { saveTokens, clearTokens, getToken } from '../../../src/utils/tokenStorage';

/**
 * Login — backend'e POST /api/login gönderir, token'ları SecureStore'a kaydeder.
 * @param {string} username
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export const login = async (username, password) => {
  try {
    const data = await auth.login(username, password);

    if (data.success && data.access_token) {
      await saveTokens(data.access_token, data.refresh_token);
    }

    return data;
  } catch (err) {
    const message =
      err?.message || 'Sunucuya bağlanılamadı. Bağlantınızı kontrol edin.';
    return { success: false, message };
  }
};

/**
 * Logout — backend'i bilgilendirir, token'ları temizler.
 */
export const logout = async () => {
  try {
    await auth.logout();
  } catch {
    // Ağ hatası olsa bile token'ları temizle
  } finally {
    await clearTokens();
  }
};

/**
 * Mevcut token'dan kullanıcı var mı diye kontrol eder.
 * @returns {boolean}
 */
export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};
