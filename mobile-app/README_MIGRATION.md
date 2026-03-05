# 📱 Mobile App - Flask Backend Entegrasyonu

## 🚀 Hızlı Başlangıç

### 1. Paketleri Kur
```bash
npm install
```

### 2. Backend'i Başlat
Başka bir terminalde:
```bash
cd ..
python app.py
```

### 3. Mobile App'i Başlat
```bash
npm start
```

---

## 🔧 Yapılandırma

### Environment Variables

`.env` dosyası oluştur (opsiyonel - development'ta gerekli değil):
```bash
API_BASE_URL=http://192.168.1.100:5000/api
```

**Not:** Development modda varsayılan olarak `http://localhost:5000/api` kullanılır.

---

## 📁 Yeni Dosya Yapısı

```
mobile-app/
├── src/
│   ├── api/
│   │   └── apiClient.js          # Axios client (JWT interceptor'lı)
│   └── utils/
│       └── tokenStorage.js       # Secure token storage
├── app/
│   ├── context/
│   │   └── UserContext.js        # ✨ Güncellendi (token desteği)
│   ├── shared/
│   │   └── utils/
│   │       └── apiAdapter.js     # ✨ Güncellendi (Axios wrapper)
│   └── index.js                  # ✨ Güncellendi (Backend login)
├── app.config.js                 # ✨ YENİ (environment config)
└── package.json                  # ✨ Güncellendi (axios, expo-secure-store)
```

---

## 🔐 Authentication Flow

### Login
```javascript
import api from './shared/utils/apiAdapter';
import { saveTokens } from '../src/utils/tokenStorage';

const response = await api.post('/login', {
  username: 'admin',
  password: 'admin123'
});

if (response.success) {
  await saveTokens(response.access_token, response.refresh_token);
  // Navigate to home
}
```

### API Çağrıları
```javascript
// Token otomatik olarak eklenir
const students = await api.get('/students');
const attendance = await api.post('/attendance', { image: base64 });
```

### Logout
```javascript
import { clearTokens } from '../src/utils/tokenStorage';

await clearTokens();
// Navigate to login
```

---

## 🧪 Test Kullanıcıları

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Instructor | instructor1 | instructor123 |
| Student | student1 | student123 |

---

## 🔄 Token Refresh

Token otomatik olarak yenilenir:
1. API 401 döndürdüğünde
2. Refresh token ile yeni access token alınır
3. Başarısız istek otomatik tekrar denenir
4. Refresh başarısız olursa login ekranına yönlendirilir

---

## 📡 API Endpoints

### Public
- `POST /api/login` - Login
- `GET /api/health` - Health check

### Protected (JWT gerekli)
- `POST /api/logout` - Logout
- `GET /api/students` - Öğrenci listesi
- `POST /api/attendance` - Yoklama kaydet
- `POST /api/register` - Öğrenci kaydet

### Token Management
- `POST /api/auth/refresh` - Token yenile

---

## 🐛 Debugging

### Backend Bağlantı Sorunu
```javascript
// apiClient.js'de baseURL kontrol et
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:5000/api'; // veya IP adresin
  }
  return Constants.expoConfig?.extra?.API_BASE_URL;
};
```

### Token Sorunları
```javascript
import { getToken, clearTokens } from '../src/utils/tokenStorage';

// Token'ı kontrol et
const token = await getToken();
console.log('Current token:', token);

// Token'ları temizle
await clearTokens();
```

### Network Logs
Console'da API isteklerini görebilirsin:
```
[API Request] POST /login
[API Response] /login: 200
[TokenStorage] Token saved successfully (auth_token)
```

---

## ⚠️ Önemli Notlar

1. **Fiziksel Cihazda Test**: `localhost` yerine bilgisayarın IP adresini kullan
   ```javascript
   // app.config.js
   API_BASE_URL: 'http://192.168.1.100:5000/api'
   ```

2. **CORS**: Flask backend'de CORS ayarları yapıldı
   ```python
   CORS(app, supports_credentials=True)
   ```

3. **Timeout**: API istekleri 10 saniye sonra timeout olur

4. **Network Check**: Her istek öncesi internet bağlantısı kontrol edilir

---

## 🎯 Sonraki Adımlar

- [ ] Backend'i başlat ve health check yap
- [ ] Login ekranında test et
- [ ] Diğer servisleri test et
- [ ] Production için API URL ayarla

**Migration tamamlandı! 🎉**
