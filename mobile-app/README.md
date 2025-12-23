# Smart Attendance Mobile App 📱

Modern ve kullanıcı dostu bir yoklama sistemi mobil uygulaması. Face ID ve QR Code ile yoklama alabilirsiniz.

## 🎨 Özellikler

### ✅ Giriş Ekranı
- Student/Instructor seçimi
- Şifresiz hızlı giriş
- Modern ve şık tasarım
- Google ve Facebook ile giriş seçenekleri
- Dinamik placeholder ve subtitle (kullanıcı tipine göre)

### 🏠 Ana Sayfa (Dashboard)

#### **Student Dashboard**
- Günlük durum kartı
- Face ID ile yoklama
- QR Code ile yoklama
- Aylık istatistikler
- Son aktiviteler

#### **Instructor Dashboard**
- Genel istatistikler (Toplam sınıf, ortalama katılım, otomatik katılım, manuel incelemeler)
- Bugünün programı (Tamamlandı, Devam ediyor, Yaklaşan dersler)
- Bayraklı katılımlar (Manuel onay bekleyen kayıtlar)
- Filtre seçenekleri (Ay, ders, yöntem)
- Hızlı aksiyonlar (Haftalık program, raporlar)

### 📸 Face ID Yoklama
- Yüz tanıma ile yoklama
- Gradient tasarım (Mor-Pembe)
- Adım adım talimatlar
- Gerçek zamanlı tarama

### 📱 QR Code Scanner
- QR kod okuyucu
- Gradient tasarım (Mavi-Turkuaz)
- Kamera önizlemesi
- Kullanım talimatları

### 📊 Yoklama Geçmişi

#### **Student History**
- Detaylı yoklama kayıtları
- İstatistik kartları (Toplam, Mevcut, Geç)
- Filtreleme seçenekleri
- Genel katılım oranı

#### **Instructor History**
- Sınıf bazlı kayıtlar
- Ders detayları (Toplam, mevcut, geç, yok öğrenciler)
- İstatistik kartları (Toplam sınıf, öğrenci, ortalama oran)
- Filtreleme seçenekleri (Tümü, Bu Hafta, Bu Ay)
- Excel export özelliği

### 👤 Profil Sayfası

#### **Student Profile**
- Kullanıcı bilgileri (Ad, Email, Bölüm, Yıl, Kayıt tarihi)
- Ayarlar menüsü
- Bildirim yönetimi
- Gizlilik ve güvenlik
- Çıkış yapma

#### **Instructor Profile**
- Öğretmen bilgileri (Ad, Email, Bölüm, Ofis, Ofis saatleri)
- Öğretim istatistikleri (Aktif dersler, toplam öğrenci, toplam sınıf, ortalama katılım)
- Ayarlar menüsü
- Ders tercihleri
- Bildirim yönetimi
- Gizlilik ve güvenlik
- Çıkış yapma

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

\`\`\`bash
cd mobile-app
npm install
\`\`\`

### 2. Expo Linear Gradient Yükle

\`\`\`bash
npx expo install expo-linear-gradient
\`\`\`

### 3. Uygulamayı Başlat

\`\`\`bash
npm start
\`\`\`

### 4. Expo Go ile Test Et

- iOS: App Store'dan Expo Go indir
- Android: Play Store'dan Expo Go indir
- QR kodu telefonunuzla okutun

## 📱 Ekran Yapısı

```
app/
├── _layout.js              # Ana layout
├── index.js                # Login ekranı (Student/Instructor seçimi)
├── face-scan.js            # Face ID ekranı (sadece student)
├── qr-scan.js              # QR Scanner ekranı (sadece student)
├── context/
│   └── UserContext.js      # Kullanıcı durumu yönetimi
├── screens/
│   ├── InstructorHome.js   # Instructor ana sayfası
│   ├── InstructorHistory.js # Instructor geçmiş sayfası
│   └── InstructorProfile.js # Instructor profil sayfası
└── (tabs)/
    ├── _layout.js          # Tab navigation (dinamik - kullanıcı tipine göre)
    ├── home.js             # Ana sayfa (Student/Instructor ayrımı)
    ├── history.js          # Geçmiş (Student/Instructor ayrımı)
    └── profile.js          # Profil (Student/Instructor ayrımı)
```

## 🎨 Renk Paleti

- **Primary**: #5B7FFF (Mavi)
- **Secondary**: #A855F7 (Mor)
- **Success**: #10B981 (Yeşil)
- **Warning**: #F59E0B (Turuncu)
- **Danger**: #EF4444 (Kırmızı)
- **Light**: #F3F4F6 (Açık Gri)
- **Dark**: #1F2937 (Koyu Gri)

## 📦 Kullanılan Paketler

- **expo-router**: Sayfa yönlendirme
- **expo-camera**: Kamera erişimi
- **expo-linear-gradient**: Gradient arka planlar
- **@expo/vector-icons**: İkonlar
- **react-native-safe-area-context**: Güvenli alan yönetimi

## 🔧 Yapılandırma

### app.json
Uygulama yapılandırması için `app.json` dosyasını düzenleyin:
- Uygulama adı
- Paket adı
- İkonlar
- İzinler

### .env
Backend bağlantısı için `.env` dosyasını düzenleyin:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 📱 Responsive Tasarım

Uygulama tüm ekran boyutlarında responsive çalışır:
- iPhone SE'den iPhone 15 Pro Max'e
- Android telefonlar
- Tablet desteği

## 🎯 Özellikler

### ✅ Tamamlanan
- [x] Login ekranı (Student/Instructor seçimi)
- [x] Student ana sayfası
- [x] Instructor ana sayfası
- [x] Face ID ekranı (Student)
- [x] QR Scanner ekranı (Student)
- [x] Student geçmiş ekranı
- [x] Instructor geçmiş ekranı (sınıf bazlı)
- [x] Student profil ekranı
- [x] Instructor profil ekranı (istatistikler ile)
- [x] Dinamik tab navigation (kullanıcı tipine göre)
- [x] User Context (state yönetimi)
- [x] Logout fonksiyonu
- [x] Responsive tasarım
- [x] Bayraklı katılım yönetimi (Instructor)
- [x] Bugünün programı (Instructor)

### 🔜 Gelecek Özellikler
- [ ] Supabase entegrasyonu
- [ ] Gerçek yüz tanıma
- [ ] Gerçek QR kod okuma
- [ ] Push bildirimleri
- [ ] Offline mod
- [ ] Çoklu dil desteği
- [ ] Instructor onay sistemi (bayraklı katılımlar)
- [ ] Excel export
- [ ] Gelişmiş filtreleme

## 📝 Notlar

- Şifresiz giriş aktif (demo için)
- Face ID ve QR Scanner şu an simüle edilmiş
- Backend bağlantısı için Supabase kullanılacak
- **ÖNEMLİ**: Student ve Instructor ekranları tamamen ayrı çalışır
  - Student girdiğinde: Face ID, QR Scanner, kişisel katılım geçmişi
  - Instructor girdiğinde: Dashboard, sınıf yönetimi, bayraklı katılımlar, sınıf geçmişi
  - Tab navigation kullanıcı tipine göre dinamik olarak değişir
  - Logout yapınca kullanıcı context temizlenir

## 🎓 Kullanıcı Tipleri

### Student (Öğrenci)
- Ana sayfa: Yoklama seçenekleri, istatistikler
- History: Kişisel katılım geçmişi
- Profile: Öğrenci bilgileri
- Tabs: Home, History, Profile

### Instructor (Öğretmen)
- Ana sayfa: Dashboard, bugünün programı, bayraklı katılımlar
- Classes: Tüm sınıfların katılım geçmişi
- Profile: Öğretmen bilgileri, öğretim istatistikleri
- Tabs: Dashboard, Classes, Profile

## 🐛 Sorun Giderme

### Metro Bundler hatası
\`\`\`bash
npm run reset
\`\`\`

### Cache temizleme
\`\`\`bash
npx expo start -c
\`\`\`

### Node modules yeniden yükleme
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

## 📞 Destek

Herhangi bir sorun için issue açabilirsiniz.

---

**Geliştirici**: Smart Attendance Team  
**Versiyon**: 1.0.0  
**Tarih**: 2025
