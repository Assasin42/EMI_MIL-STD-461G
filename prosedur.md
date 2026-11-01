# RE102 Test Prosedürü Taslağı
**Yayılan emisyon, elektrik alan**
Referans: MIL-STD-461G, madde 5.18. Bu doküman taslaktır; test mühendisi tarafından standart metniyle karşılaştırılıp onaylanmadan kullanılamaz.
## 1. Doküman bilgileri
| Alan | Değer |
|---|---|
| Proje / sözleşme | Örnek Proje |
| Doküman no | — |
| Test laboratuvarı | — |
| Test mühendisi | — |
| Planlanan tarih | — |
## 2. Amaç
EUT kasaları ve tüm ara bağlantı kablolarından yayılan elektrik alan emisyonlarının limitleri aşmadığını doğrulamak.
## 3. Kapsam ve uygulanabilirlik
- Test türü: Emisyon; frekans/alan: 10 kHz – 18 GHz; bağlantı: Elektrik alan (anten).
- Platform: Hava aracı – Kara Kuvvetleri (flight line dahil). Tablo V durumu: A – Uygulanır.
- Donanım ve alt sistem kasaları ile tüm ara bağlantı kabloları için. Kalıcı monte antenli donanımda verici temel frekansında ve gerekli bant genişliğinde uygulanmaz.
- Frekans aralığı platforma göre: Kara 2 MHz – 18 GHz; yüzey gemisi, denizaltı, Kara/Deniz hava aracı ve uzay 10 kHz – 18 GHz; Hava Kuvvetleri hava aracı 2 MHz – 18 GHz.
- Seçilen platform için RE102 frekans aralığı: 10 kHz – 18 GHz (madde 5.18.1).
## 4. Test edilecek öğe (EUT)
| Alan | Değer |
|---|---|
| EUT adı | Örnek EUT |
| Parça no / seri no | — / — |
| Güç girişi | 28 V DC |
| Çalışma modları | Normal çalışma modu |
| Kullanılacak antenler (tip, model, anten faktörü sertifika tarihi) | Çubuk, biconical, çift sırtlı horn |
| Üst frekans sınırı | 18 GHz |
| Alıcı türü | Adım ayarlı alıcı |
## 5. Ekipman listesi
| Ekipman | Gereksinim | Model / seri no | Kalibrasyon geçerlilik |
|---|---|---|---|
| Ölçüm alıcısı | Tablo II bant genişliklerini sağlar; kalibrasyonu geçerli | ____ | ____ |
| Veri kayıt cihazı | Genlik–frekans grafiklerini otomatik çizer | ____ | ____ |
| 104 cm çubuk anten + uyum ağı (10 kHz–30 MHz) | 60 cm kenarlı kare karşı ağırlık | ____ | ____ |
| Biconical anten, 137 cm (30–200 MHz) | — | ____ | ____ |
| Çift sırtlı horn, 69,0×94,5 cm (200 MHz–1 GHz) | — | ____ | ____ |
| Çift sırtlı horn, 24,2×13,6 cm (1–18 GHz) | — | ____ | ____ |
| Sinyal üreteci | Test frekans aralığını ve gereken modülasyonu sağlar | ____ | ____ |
| Stub yayıcı ve 10 pF kapasitör | Çubuk anten sistem kontrolü için | ____ | ____ |
| LISN | Şekil 6 devresine uygun; yalnızca giriş güç hatlarında | ____ | ____ |
| Metalik topraklama düzlemi | ≥2,25 m², kısa kenar ≥76 cm; kabin zeminine ≥her 1 m'de bağlı, bağlantı direnci ≤2,5 mΩ | ____ | ____ |
| Ekranlı oda (gerekiyorsa emici kaplı) | Ortam, limitin en az 6 dB altında | ____ | ____ |
Birincil ölçüm cihazları ve aksesuarları ISO/IEC 17025 veya ISO 10012'ye göre kalibre edilmelidir (madde 4.3.11).
## 6. Genel test koşulları
- Ortam: EUT kapalı ve yardımcı ekipman açıkken ölçülen ortam elektromanyetik seviyesi, ekranlı odada limitin en az 6 dB altında olmalıdır (4.3.4).
- Topraklama düzlemi: gerçek kurulumu temsil etmeli; bilinmiyorsa metalik düzlem. En az 2,25 m², kısa kenar en az 76 cm; ekranlı oda zeminine en az her 1 m'de bağlı, bağlantı direnci ≤2,5 mΩ (4.3.5).
- Güç empedansı: EUT giriş güç hatları LISN ile kontrol edilir; LISN çıkış güç hatlarında kullanılmaz; LISN, bağlantı direnci ≤2,5 mΩ ile toprak düzlemine bağlıdır (4.3.6).
- Kablolama: kurulumu simüle eder; her ara bağlantı kablosunun en az ilk 2 m'si sınırın ön kenarına paralel serilir; kalan kısım arkaya zikzak yönlendirilir; kablolar zeminden 5 cm yukarıda iletken olmayan malzemeyle desteklenir; kablolar arası 2 cm; ön kenara en yakın kablo topraklama düzlemi ön kenarından 10 cm içeride (4.3.8.6.1).
- Giriş güç hatları: 2 m'si ön kenara paralel serilir; her hat (nötr ve dönüşler dahil) bir LISN'e bağlanır. Kurulumda kabloya bağlı güç hatları demetten ayrılıp LISN'lere yönlendirilir. Birincil güç hatları, dönüşler ve toprak telleri ekranlanmaz (4.3.8.6.2).
- Kablo ekranları yalnızca kurulum gerekliliklerinde belirtilmişse kullanılır (4.3.8.6).
## 7. Test düzeni
- Temel test düzeni: Şekil 1–5 ve 4.3.8. EUT, en yüksek yayılan yüzeyi test düzeni sınırının ön kenarına bakacak şekilde yönlendirilir.
- Sistem kontrolü: Şekil RE102-5. EUT testi: antenlere göre ayrıntılı düzen.
- Çubuk anten: karşı ağırlık (en az 60 cm kare) topraklanmaz (Şekil RE102-6). Uyum ağından yere giden koaksiyel kılıf, en fazla 10 cm fazla uzunlukla zemine bağlanır; kablo uzunluğunun ortasına yakın 20 MHz'de 20–30 Ω empedanslı ferrit boru konur.
- Antenler test düzeni sınırının ön kenarından 1 m uzaklıkta; zemin düzleminden 120 cm yükseklikte. Hiçbir anten kısmı duvarlara 1 m'den, tavan ve zemine 0,5 m'den yakın olmamalı.
- Anten konum sayısı: 200 MHz altında sınır yan kenarları ≤3 m ise bir konum (ortada); >3 m ise N = (kenar mesafesi/3) yukarı yuvarlanır (Şekil RE102-7). 200 MHz–1 GHz'de her EUT kasası ve kabloların ilk 35 cm'si anten 3 dB ışın genişliği içinde olmalı; 1 GHz ve üzerinde kasa ile kabloların ilk 7 cm'si.
## 8. Ölçüm sistemi doğrulaması / kalibrasyon
- Sistem kontrol yolunu (Şekil RE102-5) kullanarak antenin koaksiyel ucundan veri çıkışına: 10,5 kHz (yalnız 10 kHz–2 MHz ölçümlerinde), 2,1 MHz, 12 MHz, 29,5 MHz (aktif çubuk), 197 MHz (biconical), 990 MHz (büyük horn), 17,5 GHz (küçük horn). Pasif uyum ağlı çubuklarda her bandın merkez frekansında.
- Limitin (limit eksi anten faktörü) en az 6 dB altında kalibre sinyali anten bağlantı noktasına uygulayın; alıcı ±3 dB içinde olmalı; sapma varsa düzeltin.
- Çubuk antende çubuk elemanı çıkarılıp, 10 pF (üretici talimatına göre) kapasitörle sinyal uyum ağına uygulanır (Şekil RE102-8); ticari kalibrasyon aparatı kullanılamaz.
- Ölçüm yolu değiştiğinde (koaksiyel, ön yükselteç, alıcı portu) kontrol yenilenir.
### Alıcı bant genişliği ve ölçüm süresi (Tablo II)
| Frekans aralığı | 6 dB bant genişliği | Min. bekleme (adım ayarlı) | Min. ölçüm süresi (analog) |
|---|---|---|---|
| 10 kHz – 150 kHz | 1 kHz | 0,015 sn | 0,015 sn/kHz |
| 150 kHz – 10 MHz | 10 kHz | 0,015 sn | 1,5 sn/MHz |
| 10 MHz – 30 MHz | 10 kHz | 0,015 sn | 1,5 sn/MHz |
| 30 MHz – 1 GHz | 100 kHz | 0,015 sn | 0,15 sn/MHz |
| 1 GHz – 100 GHz | 1 MHz | 0,015 sn | 15 sn/GHz |
Video filtresi kullanılmaz; daha geniş bant genişlikleri kullanılabilir ancak bant genişliği düzeltme faktörü uygulanmaz (4.3.10.3.1).
## 9. Test adımları
1. Ortam gereksinimlerini (4.3.4) doğrulayın; gerektiğinde ortam grafiklerini alın.
2. Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin.
3. Sistem kontrolünü yapın.
4. Her anten için ilgili frekans aralığını Tablo II bant genişlikleri ve sürelerle tarayın; 30 MHz üzerinde hem yatay hem dikey polarizasyonda.
5. Gerekli tüm anten konumları için tekrarlayın (200 MHz altı ve üzeri için yukarıdaki kriterler).
6. Ölçüm yolu ve sonuçlar için 5.18.3.4d ve sonrasındaki maddelerdeki ayrıntıları takip edin.
## 10. Limitler
- Şekil RE102-1 … RE102-4. 30 MHz üzerinde limit hem yatay hem dikey polarizasyonda sağlanmalıdır.
- Uygulanacak limit/seviye (uyarlama sonrası): Şekil RE102-3 (sözleşmeye göre)
- Ölçü birimi: dBµV/m
## 11. Veri sunumu
- Madde 5.18.3.5'e göre grafikler, limit, anten konumları ve düzen fotoğrafları.
## 12. Kabul kriteri
- Ölçülen emisyonlar tüm frekanslarda uygulanan limitin altında kalmalıdır. Tüm emisyonlar Tablo II bant genişlikleriyle ölçülür ve limitle kıyaslanır; dar bant/geniş bant ayrımı uygulanmaz (4.3.10.3.2).
## 13. Özel şartlar ve dikkat edilecek noktalar
- Kalıcı monte antenli verici donanımda temel frekans ve gerekli bant genişliği muaftır.
- Aktif çubuk antende aşırı yük önlemleri uygulanır (4.3.7.3).
## 14. Standarttan doğrulanması gereken maddeler
- Şekil RE102-1…4 (platforma göre) ve 5.18.3.4d sonrası ölçüm adımları
## 15. Onay
| Hazırlayan | Kontrol (test mühendisi) | Onay |
|---|---|---|
| ____ | ____ | ____ |
