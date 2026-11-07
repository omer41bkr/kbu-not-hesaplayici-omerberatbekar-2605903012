# KBÜ Not Hesaplayıcı (Vize - Final / Bütünleme)

Karabük Üniversitesi Önlisans ve Lisans Eğitim-Öğretim Yönetmeliği'ne uygun olarak geliştirilmiş; yıl içi (vize ve çalışmalar) ile genel/bütünleme sınav notlarını değerlendiren, başarı notunu ve harf notunu (A1, A2, B1, B2, C veya F1, F2, F3) otomatik hesaplayan web uygulamasıdır.

---

## Öğrenci Bilgileri
- **Adı Soyadı:** Ömer Berat Bekar
- **Öğrenci Numarası:** 2605903012
- **Bölüm:** Bilgisayar Mühendisliği
- **Ders:** Web Programlama / İnternet Tabanlı Programlama
- **Canlı Demo Linki:** https://omer41bkr.github.io/kbu-not-hesaplayici-omerberatbekar-2605903012/
- **GitHub Deposu:** https://github.com/omer41bkr/kbu-not-hesaplayici-omerberatbekar-2605903012

---

## Proje Açıklaması
Bu çalışma; saf JavaScript (Vanilla JS), HTML5 ve CSS3 kullanılarak herhangi bir harici kütüphane veya çatı (framework) olmadan geliştirilmiştir. Uygulama; kullanıcı girdilerini dinamik olarak doğrulamakta, KBÜ not baremine göre ders geçme/kalma şartlarını denetlemekte ve sonuçları kullanıcı dostu, duyarlı (responsive) bir arayüz üzerinde anlık olarak sunmaktadır.

---

## KBÜ Yönetmeliğine Göre Hesaplama Mantığı

Karabük Üniversitesi yönetmeliği uyarınca ders başarı notu hesaplanırken yıl içi çalışmalarının %40'ı, dönem sonu genel sınavının (veya bütünleme sınavının) ise %60'ı esas alınır. Eğer öğrenci bütünleme sınavına girmişse, bütünleme notu final notunun yerine geçer ve ağırlığı yine %60 olarak hesaplamaya dahil edilir. Yıl içi çalışma puanı girilmediğinde vize notu doğrudan yıl içi puanı olarak kabul edilir.

Bir dersten başarılı sayılabilmek için iki temel şartın aynı anda sağlanması zorunludur:
1. Genel sınav veya bütünleme sınav notunun en az **50** olması,
2. Yıl içi ve sınav ağırlıkları sonucunda oluşan ders başarı notunun en az **60** olması gerekmektedir.

Sınav notu 50'nin altında kalan ya da genel başarı notu 60'ı bulamayan öğrenciler **F3** harf notu ile dersten kalır. Derse devam şartını sağlamayan öğrenciler doğrudan **F1**, devamı olup sınava girmeyenler ise **F2** notu alarak başarısız sayılırlar. Başarılı olan öğrencilere ise aldıkları puana göre C (60–64), B2 (65–69), B1 (70–79), A2 (80–89) veya A1 (90–100) harf notu verilir.

---

## Harf Notları ve Katsayı Tablosu

| Başarı Notu | Harf Notu | Katsayı | Durum | Açıklama |
| :---: | :---: | :---: | :---: | :--- |
| **90 – 100** | **A1** | 4.00 | Geçti | Üstün Başarı |
| **80 – 89**  | **A2** | 3.50 | Geçti | Mükemmel |
| **70 – 79**  | **B1** | 3.00 | Geçti | Çok İyi |
| **65 – 69**  | **B2** | 2.75 | Geçti | İyi |
| **60 – 64**  | **C**  | 2.50 | Geçti | Koşullu / Yeterli Geçer |
| **-**        | **F1** | 0.00 | Kaldı | Devamsız (Sınav hakkı yok) |
| **-**        | **F2** | 0.00 | Kaldı | Sınava girmedi |
| **&lt; 60**  | **F3** | 0.00 | Kaldı | Sınav &lt; 50 veya Başarı Notu &lt; 60 |

---

## Test Senaryoları ve Beklenen Sonuçlar

Aşağıdaki senaryolar uygulama üzerinde test edilmiş ve tüm şartların eksiksiz sağlandığı doğrulanmıştır:

| # | Test Senaryosu | Girilen Değerler | Hesaplama Detayı | Beklenen Sonuç | Durum |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **1** | Standart Geçme Durumu | Yıl İçi: 70<br>Final: 60 | `basari = (70 * 0.40) + (60 * 0.60) = 28 + 36 = 64.00` | **64.00 - C (Geçti)** | Doğrulandı |
| **2** | Final Barajı Altında Kalma | Yıl İçi: 95<br>Final: 48 | `sinav = 48 (< 50)` baraj altı | **F3 (Kaldı - Final < 50)** | Doğrulandı |
| **3** | Bütünleme ile Hesaplama | Yıl İçi: 58<br>Bütünleme: 55<br>*(Final boş)* | `basari = (58 * 0.40) + (55 * 0.60) = 23.2 + 33 = 56.20` | **56.20 - F3 (Kaldı - Başarı < 60)** | Doğrulandı |
| **4** | Devamsızlık Durumu | Devamsızım seçili | Devamsız kutucuğu işaretlendiğinde hesap bitirilir | **F1 (Kaldı - Devamsız)** | Doğrulandı |
| **5** | Sınava Katılmama Durumu | Sınava Girdim mi: Hayır | Sınava girmeme seçeneğinde doğrudan F2 verilir | **F2 (Kaldı - Sınava Girmedi)** | Doğrulandı |
| **6** | Hatalı Veri Girişi | Vize: 120 veya -5 | 0–100 dışı değerlerde kırmızı bildirim kutusu gösterilir | **Hata Uyarısı & Hesaplama Durduruldu** | Doğrulandı |

---

## Özellikler ve Kullanılabilirlik (UX)
- **Tek Sayfa & Mobil Uyum:** Mobil cihazlardan (minimum 320px) geniş masaüstü ekranlara kadar kusursuz responsive ızgara düzeni.
- **Dinamik Form Kontrolü:** Bütünleme notu girildiğinde, final not alanı görsel ve işlevsel olarak otomatik biçimde devre dışı kalır.
- **Klavye Desteği:** Alanlar doldurulduktan sonra klavyeden `Enter` tuşuna basılarak hesaplama anında başlatılabilir.
- **Temizleme (Sıfırla) Özelliği:** Tek butonla tüm form alanları, hata bildirimleri ve sonuç paneli başlangıç durumuna getirilir.
- **Hata Yakalama ve Doğrulama:** 0-100 dışı sayılar, boş bırakılan zorunlu alanlar veya geçersiz karakter girişleri kullanıcıya kırmızı uyarı kutusu ve belirgin alan çerçevesi ile bildirilir.

---

## Dosya Yapısı

```text
kbu-not-hesaplayici/
├── index.html       # Semantik HTML5 sayfa yapısı
├── style.css        # Responsive, modern ve sade CSS kuralları
├── script.js        # Form doğrulama, hesap mantığı ve DOM manipülasyonu
└── README.md        # Proje dokümantasyonu ve test raporları
```

---

## Kurulum ve Çalıştırma

### 1. Yerel Ortamda Çalıştırma
Projeyi çalıştırmak için herhangi bir paket yüklemesine veya sunucu kurulumuna ihtiyaç yoktur:
1. Proje dosyalarını bilgisayarınıza indirin veya klonlayın.
2. `index.html` dosyasını Google Chrome, Firefox, Safari veya Edge tarayıcılarından herhangi birinde çift tıklayarak açın.
3. İsteğe bağlı olarak VS Code üzerinden `Live Server` eklentisiyle de çalıştırabilirsiniz.

### 2. Canlı Yayına Alma (GitHub Pages)
1. GitHub hesabınızda `kbu-not-hesaplayici-adsoyad-ogrno` adında yeni bir public depo oluşturun.
2. `index.html`, `style.css`, `script.js` ve `README.md` dosyalarını depoya yükleyin (push).
3. Depo menüsünden **Settings > Pages** sekmesine gidin.
4. **Branch** kısmını `main` (veya `master`) olarak seçip kaydedin.
5. Birkaç dakika içinde verilen canlı linki (örn. `https://kullaniciadi.github.io/...`) ödev teslim formuna ekleyebilirsiniz.

---

## Referanslar ve Notlar
- Karabük Üniversitesi Lisans ve Önlisans Eğitim-Öğretim ve Sınav Yönetmeliği
- Not aralıkları ve harf baremi yönergede belirtilen resmi değerlere tam uyumludur.
