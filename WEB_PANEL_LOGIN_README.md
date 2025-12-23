# Web Panel Login Sistemi

## 🎉 Yeni Özellikler

Web panel artık **rol bazlı giriş sistemi** ile geliyor! Artık Instructor, Student ve Admin olarak ayrı ayrı giriş yapabilir ve her role özel dashboard'ları görebilirsiniz.

## 🔐 Giriş Bilgileri

### Instructor (Öğretmen)
- **Kullanıcı Adı:** `instructor1`
- **Şifre:** `instructor123`
- **Özellikler:**
  - Dashboard istatistikleri
  - Haftalık program yönetimi
  - Öğrenci kaydı
  - Yoklama yönetimi
  - Raporlar
  - Öğrenci listesi
  - Ayarlar

### Student (Öğrenci)
- **Kullanıcı Adı:** `student1`
- **Şifre:** `student123`
- **Özellikler:**
  - Kişisel yoklama istatistikleri
  - Ders bazlı yoklama durumu
  - Son yoklama kayıtları
  - Günlük ders programı
  - Genel yoklama yüzdesi

### Admin (Yönetici)
- **Kullanıcı Adı:** `admin`
- **Şifre:** `admin123`
- **Özellikler:**
  - Sistem geneli istatistikler
  - Kullanıcı yönetimi
  - Sistem aktivite logları
  - Sistem sağlık durumu
  - Veritabanı ve sunucu metrikleri

## 🚀 Nasıl Çalıştırılır?

### 1. Backend'i Başlatın
```bash
# Proje ana dizininde
python app.py
```
Backend `http://localhost:5000` adresinde çalışacak.

### 2. Web Panel'i Başlatın
```bash
# web-panel dizinine gidin
cd web-panel

# Bağımlılıkları yükleyin (ilk kez)
npm install

# Geliştirme sunucusunu başlatın
npm start
```
Web panel `http://localhost:3000` adresinde açılacak.

## 📱 Kullanım

1. Web panel açıldığında **Login** ekranı karşınıza gelecek
2. Giriş yapmak istediğiniz **rolü seçin** (Instructor/Student/Admin)
3. İlgili kullanıcı adı ve şifreyi girin
4. "Use Demo Credentials" butonuna basarak otomatik olarak demo bilgileri doldurabilirsiniz
5. "Login" butonuna tıklayın
6. Rolünüze özel dashboard açılacak

## 🎨 Özellikler

### Login Ekranı
- Modern ve kullanıcı dostu tasarım
- Animasyonlu arka plan
- Rol bazlı renk temaları
- Demo bilgileri otomatik doldurma
- Hata mesajları ve validasyon

### Instructor Dashboard
- Mevcut tüm özellikler korundu
- Sidebar navigasyon
- Logout butonu eklendi
- Kullanıcı bilgileri gösterimi

### Student Dashboard
- Kişisel yoklama istatistikleri
- Ders bazlı performans grafikleri
- Son yoklama kayıtları
- Günlük ders programı
- Modern ve responsive tasarım

### Admin Dashboard
- Sistem geneli istatistikler
- Kullanıcı yönetimi tablosu
- Aktivite logları
- Sistem sağlık metrikleri
- Veritabanı ve sunucu durumu

## 🔒 Güvenlik

- Şifreler backend'de hash'lenerek saklanıyor (`werkzeug.security`)
- Session yönetimi
- LocalStorage ile oturum kalıcılığı
- CORS koruması
- Rol bazlı yetkilendirme

## 🛠️ Teknik Detaylar

### Backend (Flask)
- `/api/login` - Kullanıcı girişi
- `/api/logout` - Kullanıcı çıkışı
- `/api/users` - Kullanıcı listesi (admin için)

### Frontend (React)
- `Login.js` - Giriş ekranı
- `InstructorDashboard.js` - Öğretmen paneli
- `StudentDashboard.js` - Öğrenci paneli
- `AdminDashboard.js` - Yönetici paneli
- `App.js` - Ana uygulama ve routing

### Kullanılan Teknolojiler
- React (Frontend)
- Flask (Backend)
- LocalStorage (Oturum yönetimi)
- CSS3 (Animasyonlar ve stil)
- Fetch API (HTTP istekleri)

## 📝 Notlar

- Kullanıcı bilgileri şu an `app.py` içinde hardcoded olarak tutuluyor
- Gerçek bir üretim ortamında veritabanı kullanılmalı
- JWT token sistemi eklenebilir
- Şifre sıfırlama özelliği eklenebilir
- Email doğrulama sistemi eklenebilir

## 🎯 Gelecek Geliştirmeler

- [ ] Veritabanı entegrasyonu
- [ ] JWT token authentication
- [ ] Şifre sıfırlama
- [ ] Email doğrulama
- [ ] 2FA (Two-Factor Authentication)
- [ ] Kullanıcı profil düzenleme
- [ ] Rol bazlı izin yönetimi

## 💡 İpuçları

1. **Hızlı Test:** "Use Demo Credentials" butonunu kullanarak hızlıca test edebilirsiniz
2. **Rol Değiştirme:** Logout yapıp farklı bir rolle giriş yaparak tüm dashboard'ları görebilirsiniz
3. **Oturum Kalıcılığı:** Sayfa yenilendiğinde oturumunuz korunur
4. **Responsive:** Mobil cihazlarda da düzgün çalışır

## 🐛 Sorun Giderme

### Backend bağlantı hatası
- Backend'in çalıştığından emin olun (`python app.py`)
- Port 5000'in kullanılabilir olduğunu kontrol edin

### Login çalışmıyor
- Doğru kullanıcı adı ve şifre girdiğinizden emin olun
- Seçtiğiniz rol ile kullanıcı rolünün eşleştiğinden emin olun
- Browser console'da hata mesajlarını kontrol edin

### Sayfa yüklenmiyor
- `npm install` komutunu çalıştırdığınızdan emin olun
- Port 3000'in kullanılabilir olduğunu kontrol edin
- `npm start` ile geliştirme sunucusunu başlatın

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Browser console'u kontrol edin
2. Backend loglarını kontrol edin
3. Network sekmesinde API isteklerini kontrol edin

---

**Keyifli kullanımlar! 🎉**

