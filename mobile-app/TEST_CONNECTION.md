# 🔍 BAĞLANTI TEST KILAVUZU

## ✅ Backend Testi (Başarılı!)
```bash
curl http://192.168.1.100:5000/api/health
```
**Sonuç:** ✅ Backend çalışıyor ve IP üzerinden erişilebilir!

---

## 📱 Mobile App Debug Adımları

### 1. Metro Bundler'ı Yeniden Başlat
```bash
cd "C:\Users\BG\Documents\Smart Attendace System\mobile-app"
# Ctrl+C ile durdur
npm start -- --clear
```

### 2. Console Loglarına Dikkat Et

Login yaparken şu logları göreceksin:
```
[apiClient] Base URL: http://192.168.1.100:5000/api
[API Request] POST /login
[API Request] Full URL: http://192.168.1.100:5000/api/login
```

Eğer `localhost` görüyorsan → Cache sorunu var, Metro'yu temizle

---

## 🐛 Olası Sorunlar ve Çözümler

### Sorun 1: Cache Sorunu
**Belirti:** Eski localhost URL'i hala kullanılıyor

**Çözüm:**
```bash
# Metro cache'i temizle
npm start -- --clear

# VEYA tam temizlik
npm run reset
```

### Sorun 2: Telefon/Emulator Farklı Wi-Fi'da
**Belirti:** Network Error

**Çözüm:**
- Telefon ve bilgisayar aynı Wi-Fi'da olmalı
- Bilgisayarın firewall'u 5000 portunu blokluyor olabilir

**Firewall Test:**
```powershell
# Windows Firewall'da 5000 portunu aç
netsh advfirewall firewall add rule name="Flask Backend" dir=in action=allow protocol=TCP localport=5000
```

### Sorun 3: Android Emulator Network Sorunu
**Belirti:** Emulator bağlanamıyor

**Çözüm:**
Emulator için özel IP kullan:
```javascript
// env.js içinde
API_URL: 'http://10.0.2.2:5000',  // Android Emulator için
```

---

## 🧪 Manuel Test

### Test 1: Telefon/Emulator'dan Backend'e Erişim
Expo app'te tarayıcı aç:
```
http://192.168.1.100:5000/api/health
```

Eğer açılmıyorsa → Network sorunu var

### Test 2: Postman/Thunder Client
```
POST http://192.168.1.100:5000/api/login
Content-Type: application/json

{
  "username": "student_demo",
  "password": "demo123"
}
```

---

## 📊 Debug Checklist

- [ ] Backend çalışıyor (`curl` ile test edildi) ✅
- [ ] IP adresi doğru (192.168.1.100) ✅
- [ ] env.js güncel ✅
- [ ] apiClient.js güncel ✅
- [ ] Metro cache temizlendi
- [ ] Aynı Wi-Fi'da
- [ ] Firewall izni verildi
- [ ] Console logları kontrol edildi

---

## 🎯 Beklenen Console Çıktısı

Başarılı login:
```
[apiClient] Base URL: http://192.168.1.100:5000/api
[API Request] POST /login
[API Request] Full URL: http://192.168.1.100:5000/api/login
[API Response] /login: 200
[TokenStorage] Token saved successfully (auth_token)
```

---

## 🚨 Hala Çalışmıyorsa

1. **Backend loglarını kontrol et** (Terminal 8)
2. **Metro bundler loglarını kontrol et** (Terminal 4)
3. **Telefon/Emulator console'unu kontrol et**

**Şüpheli log:** `Network Error` → Backend'e hiç ulaşamıyor demektir
