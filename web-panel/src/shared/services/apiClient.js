/**
 * Web Panel — Ortak API İstemcisi
 *
 * localStorage'daki access_token'ı tüm isteklere otomatik ekler.
 * Tüm feature servis dosyaları bu istemciyi kullanır.
 */

// Boş string = relative URL → hem localhost:5000'de hem ngrok URL'sinde çalışır
const BASE_URL = process.env.REACT_APP_API_URL || '';
const TIMEOUT_MS = 8000;

function getAuthHeader() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, { body, params } = {}) {
  let url = `${BASE_URL}/api${path}`;

  if (params && Object.keys(params).length) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    clearTimeout(timer);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

const apiClient = {
  get:    (path, options) => request('GET',    path, options),
  post:   (path, body)    => request('POST',   path, { body }),
  patch:  (path, body)    => request('PATCH',  path, { body }),
  put:    (path, body)    => request('PUT',    path, { body }),
  delete: (path)          => request('DELETE', path),
};

export default apiClient;
