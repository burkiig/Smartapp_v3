import * as SecureStore from 'expo-secure-store';

/**
 * Token Storage Keys
 */
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Save token to secure storage
 * @param {string} token - JWT token
 * @param {string} key - Storage key (default: 'auth_token')
 * @returns {Promise<boolean>} Success status
 */
export const saveToken = async (token, key = TOKEN_KEY) => {
  try {
    if (!token) {
      console.warn('[TokenStorage] Attempted to save null/undefined token');
      return false;
    }
    
    await SecureStore.setItemAsync(key, token);
    
    if (__DEV__) {
      console.log(`[TokenStorage] Token saved successfully (${key})`);
    }
    
    return true;
  } catch (error) {
    console.error('[TokenStorage] Error saving token:', error);
    return false;
  }
};

/**
 * Get token from secure storage
 * @param {string} key - Storage key (default: 'auth_token')
 * @returns {Promise<string|null>} Token or null
 */
export const getToken = async (key = TOKEN_KEY) => {
  try {
    const token = await SecureStore.getItemAsync(key);
    
    if (__DEV__ && token) {
      console.log(`[TokenStorage] Token retrieved (${key})`);
    }
    
    return token;
  } catch (error) {
    console.error('[TokenStorage] Error getting token:', error);
    return null;
  }
};

/**
 * Remove token from secure storage
 * @param {string} key - Storage key (default: 'auth_token')
 * @returns {Promise<boolean>} Success status
 */
export const removeToken = async (key = TOKEN_KEY) => {
  try {
    await SecureStore.deleteItemAsync(key);
    
    if (__DEV__) {
      console.log(`[TokenStorage] Token removed (${key})`);
    }
    
    return true;
  } catch (error) {
    console.error('[TokenStorage] Error removing token:', error);
    return false;
  }
};

/**
 * Save both access and refresh tokens
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<boolean>} Success status
 */
export const saveTokens = async (accessToken, refreshToken) => {
  try {
    const results = await Promise.all([
      saveToken(accessToken, TOKEN_KEY),
      saveToken(refreshToken, REFRESH_TOKEN_KEY)
    ]);
    
    return results.every(result => result === true);
  } catch (error) {
    console.error('[TokenStorage] Error saving tokens:', error);
    return false;
  }
};

/**
 * Remove all tokens (logout)
 * @returns {Promise<boolean>} Success status
 */
export const clearTokens = async () => {
  try {
    await Promise.all([
      removeToken(TOKEN_KEY),
      removeToken(REFRESH_TOKEN_KEY)
    ]);
    
    if (__DEV__) {
      console.log('[TokenStorage] All tokens cleared');
    }
    
    return true;
  } catch (error) {
    console.error('[TokenStorage] Error clearing tokens:', error);
    return false;
  }
};

/**
 * Check if user has valid token
 * @returns {Promise<boolean>} True if token exists
 */
export const hasToken = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('[TokenStorage] Error checking token:', error);
    return false;
  }
};
