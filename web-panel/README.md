# Smart Attendance System - Instructor Panel

Modern ve kullanıcı dostu bir yüz tanıma tabanlı yoklama sistemi web paneli.

## 🎨 Tasarım Özellikleri

Bu panel, Figma tasarımından esinlenerek oluşturulmuştur ve aşağıdaki özellikleri içerir:

- **Minimal ve Modern UI**: Gri tonlar ve mavi aksan renkleri
- **Dashboard**: Kapsamlı istatistikler ve grafikler
- **Weekly Schedule**: Haftalık ders programı görüntüleme
- **Sidebar Navigation**: Kolay erişim için yan menü
- **Responsive Design**: Mobil ve tablet uyumlu
- **Clean Typography**: Okunabilir ve profesyonel görünüm

## 📋 Özellikler

### 1. Dashboard
- Toplam ders sayısı
- Ortalama yoklama oranı
- Otomatik yoklama yüzdesi
- Manuel inceleme sayısı
- Ders performans grafikleri
- Son aktiviteler

### 2. Weekly Schedule
- Haftalık ders programı
- Ders detayları (saat, oda, süre)
- Hafta navigasyonu
- Haftalık özet istatistikleri

### 3. Register Student
- Yeni öğrenci kaydı
- Webcam ile fotoğraf çekimi
- Yüz tanıma entegrasyonu

### 4. Flagged Attendance
- Yüz tanıma ile otomatik yoklama
- Gerçek zamanlı kamera görüntüsü
- Anlık sonuç bildirimi

### 5. Students
- Kayıtlı öğrencileri görüntüleme
- Öğrenci kartları
- Öğrenci silme işlemi

### 6. Reports
- Yoklama kayıtları
- Tarih filtreleme
- Tablo görünümü
- Rapor dışa aktarma

## 🚀 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Backend sunucusunu başlatın (ana dizinde):
```bash
python app.py
```

3. Web panelini başlatın:
```bash
npm start
```

Panel `http://localhost:3000` adresinde açılacaktır.

## 🎯 Kullanılan Teknolojiler

- **React 18**: Modern UI framework
- **Axios**: HTTP istekleri
- **React Webcam**: Kamera erişimi
- **CSS3**: Modern styling
- **Responsive Design**: Mobil uyumluluk

## 📱 Responsive Tasarım

Panel aşağıdaki ekran boyutlarında optimize edilmiştir:
- Desktop (1400px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🎨 Renk Paleti

- **Primary**: #0071e3 (Mavi)
- **Success**: #34c759 (Yeşil)
- **Error**: #ff3b30 (Kırmızı)
- **Background**: #f5f5f7 (Açık Gri)
- **Text**: #1d1d1f (Koyu Gri)
- **Secondary Text**: #86868b (Orta Gri)

## 📝 API Endpoints

- `GET /api/students` - Öğrencileri listele
- `POST /api/register` - Yeni öğrenci kaydet
- `DELETE /api/students/:id` - Öğrenci sil
- `POST /api/attendance` - Yoklama işaretle
- `GET /api/attendance/records` - Yoklama kayıtları
- `GET /api/dashboard/stats` - Dashboard istatistikleri
- `GET /api/dashboard/course-performance` - Ders performansı
- `GET /api/dashboard/recent-activity` - Son aktiviteler

## 👨‍🏫 Instructor Panel

Panel, eğitmenler için tasarlanmış olup aşağıdaki bilgileri gösterir:
- Eğitmen adı: Dr. Robert Chen
- Bölüm: Computer Science

Bu bilgiler `App.js` dosyasından özelleştirilebilir.

## 🔧 Özelleştirme

### Sidebar Bilgileri
`src/App.js` dosyasındaki `instructorInfo` state'ini düzenleyin:

```javascript
const [instructorInfo] = useState({
  name: 'Your Name',
  department: 'Your Department',
  avatar: 'YN'
});
```

### Renkler
`src/App.css` ve `src/index.css` dosyalarındaki CSS değişkenlerini düzenleyin.

## 📄 Lisans

MIT License

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.

