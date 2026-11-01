# EMC Prosedür Servisi ve Jira Entegrasyonu
# EMC Procedure Service and Jira Integration

[English](#english) | [Türkçe](#türkçe)

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe

Bu klasör, MIL-STD-461G standardından oluşturulan veri modelini kullanarak **EMC test prosedürü taslakları üreten bir servis** ve bu servisi **Jira iş akışına entegre eden bir araç seti** içerir.

Test mühendisi Jira üzerinden bir talep oluşturur. Servis, talepteki bilgileri kullanarak prosedür taslağını oluşturur ve ilgili iş kaydına ekler. Eksik bilgi bulunması durumunda eksik alanları Jira kaydına yorum olarak ekler.

> **Durum:** Servis ve Jira istemcisi, sahte (mock) bir Jira sunucusu kullanılarak uçtan uca test edilmiştir (`npm test`). Gerçek bir Jira ortamında henüz test edilmemiştir. Alan adları, kimlik doğrulama ve Automation ayarları kurulum sırasında ilgili ortamda doğrulanmalıdır.

### Hızlı Başlangıç (5 Dakika – Jira Gerekmez)

1. **Node.js 18 veya üzeri** sürümünü [nodejs.org](https://nodejs.org/) adresinden yükleyin. Sürümü kontrol edin: `node --version`
2. ZIP dosyasını çıkarın ve terminal üzerinden proje klasörüne gidin: `cd jira-kit`
3. İsteğe bağlı olarak testleri çalıştırın: `npm test`. İşlem sonunda `TÜM TESTLER GEÇTİ` mesajı görüntülenmelidir.
4. Servisi başlatın: `node server.js`
5. Tarayıcınızdan `http://localhost:8080` adresini açın.

Açılan arayüzden platformu ve test türünü seçerek gerekli bilgileri girebilirsiniz. Prosedür taslağı sağ tarafta gerçek zamanlı olarak oluşturulur.

Oluşturulan taslaklar `.md`, `.html` ve Word (`.doc`) formatlarında indirilebilir. Ayrıca yazdırma özelliği kullanılarak PDF formatına dönüştürülebilir.

Servisi durdurmak için terminalde `Ctrl+C` tuşlarına basın.

**Port değiştirme:**

- Linux/macOS: `PORT=3000 node server.js`
- Windows PowerShell: `$env:PORT=3000; node server.js`

**API üzerinden doğrudan test:**

- Linux/macOS:
  `curl -X POST http://localhost:8080/generate -H "Content-Type: application/json" -d @ornek-istek.json`

- Windows PowerShell:
  `Invoke-RestMethod -Uri http://localhost:8080/generate -Method Post -ContentType "application/json; charset=utf-8" -Body ([Text.Encoding]::UTF8.GetBytes((Get-Content ornek-istek.json -Raw -Encoding UTF8)))`

Veri modeli veya arayüz değiştirildiğinde:

- `app/` klasöründeki ilgili dosyaları düzenleyin.
- `npm run build` komutuyla çekirdek modülü ve Jira alan şemasını yenileyin.
- `python3 app/build_html.py` komutuyla web arayüzünü yeniden oluşturun.

### 1. Sistem Akışı

```text
Test Mühendisi
      |
      v
Jira Talebi (EMC Test Prosedür Talebi)
      |
      v
Jira Automation: Send Web Request
      |
      v
EMC Servisi
      |
      |-- Jira REST API üzerinden kayıt bilgilerini okur.
      |-- Alanları isimlerine göre eşleştirir.
      |-- core.js ile doğrulama yapar ve prosedürü oluşturur.
      |
      |-- Bilgiler tamamsa:
      |      .md ve .html dosyalarını ekler.
      |      "Taslak hazır" yorumu oluşturur.
      |
      |-- Eksik bilgi varsa:
      |      Eksik alanları Jira kaydına yorum olarak ekler.
      |
      v
Jira Automation
      |
      |-- ok = true  -> Taslak Hazır
      |-- ok = false -> Bilgi Bekleniyor
      |
      v
Mühendis İncelemesi
      |
      |-- Onaylandı
      |-- Revize Gerekli
```

Jira bu mimaride **arayüz, iş akışı yönetimi, onay ve izlenebilirlik** katmanlarını üstlenir. Prosedür üretiminden sorumlu veri modeli ve üretici modülü Jira'dan bağımsızdır. Böylece aynı çekirdek hem web uygulamasında hem de servis tarafında kullanılabilir.

### 2. Jira Kurulumu

1. **Sorun Türü:** `EMC Test Prosedür Talebi` isimli bir sorun türü oluşturun.
2. **Özel Alanlar:** Aşağıdaki tabloda listelenen alanları Jira üzerinde oluşturun. Servis alanları isimlerine göre eşleştirdiğinden alan adları birebir aynı olmalıdır. Ayrıntılı tanımlar ve seçenekler `jira-fields.json` dosyasında bulunmaktadır. Her alanın `description` değeri Jira alan açıklaması olarak kullanılabilir.
3. **Koşullu Alanlar:** Bazı alanlar yalnızca belirli test türlerinde gereklidir. Koşullu görünürlük için Jira Service Management formlarının koşullu mantığı veya ScriptRunner/Behaviours gibi eklentiler kullanılabilir. Bu özellikler yoksa tüm alanlar görünür olur; servis seçilen test türüne göre gerekli alanları kontrol eder.
4. **İş Akışı:** Talep → Bilgi Bekleniyor → Taslak Hazır → Mühendis İncelemesi → Onaylandı / Revize Gerekli.
5. **Automation Kuralı:**
   - Tetikleyici: Kayıt oluşturulduğunda veya Bilgi Bekleniyor durumundaki kaydın alanları değiştiğinde.
   - Eylem: `Send web request`.
   - HTTP yöntemi: `POST`.
   - URL: `https://<servis>/jira/webhook`
   - Başlık: `X-Webhook-Secret`
   - Gövde: `{"issueKey": "{{issue.key}}"}`
   - Yanıtı bekle seçeneğini etkinleştirin.
   - Yanıtın `ok` değerine göre ilgili durum geçişini gerçekleştirin. Jira Cloud için `webResponse.body.ok` kullanılabilir. Data Center sürümünde Smart Value desteği doğrulanmalıdır.

### Özel Alan Listesi

| Alan Adı | Jira Türü | İlgili Testler | Zorunlu |
|---|---|---|---|
| EMC – Test Türü | Select List (single choice) | Tümü | Evet |
| EMC – Proje / sözleşme adı | Text Field (single line) | Tümü | Evet |
| EMC – Doküman numarası | Text Field (single line) | Tümü | Hayır |
| EMC – EUT adı | Text Field (single line) | Tümü | Evet |
| EMC – EUT parça no | Text Field (single line) | Tümü | Hayır |
| EMC – EUT seri no | Text Field (single line) | Tümü | Hayır |
| EMC – Kurulum platformu (Tablo V) | Select List (single choice) | Tümü | Evet |
| EMC – EUT güç girişi | Select List (single choice) | Tümü | Evet |
| EMC – Güç girişi ek bilgi (akım, faz, güç hattı sayısı) | Text Field (single line) | Tümü | Hayır |
| EMC – EUT çalışma modları | Text Field (multi-line) | Tümü | Evet |
| EMC – Uygulanacak limit / seviye (uyarlama sonrası) | Text Field (single line) | Tümü | Evet |
| EMC – Test laboratuvarı | Text Field (single line) | Tümü | Hayır |
| EMC – Test mühendisi | Text Field (single line) | Tümü | Hayır |
| EMC – Planlanan test tarihi | Text Field (single line) | Tümü | Hayır |
| EMC – Standarttan sapma / uyarlama notları | Text Field (multi-line) | Tümü | Hayır |
| EMC – Ölçülecek güç hatları (dönüşler dahil) | Text Field (single line) | CE101, CE102 | Evet |
| EMC – Nominal yük akımı (A) | Text Field (single line) | CE101 | Hayır |
| EMC – Alıcı türü | Select List (single choice) | CE102, RE102 | Evet |
| EMC – Verici temel frekansı / çalışma aralığı | Text Field (single line) | CE106, RE103 | Evet |
| EMC – Verici tepe gücü | Text Field (single line) | CE106, RE103 | Hayır |
| EMC – İzlenecek fonksiyonlar ve performans kriteri | Text Field (multi-line) | CS101, CS103, CS104, CS105, CS109, CS114, CS115, CS116, CS117, CS118, RS101, RS103, RS105 | Evet |
| EMC – Güç şebekesi yapısı | Select List (single choice) | CS101 | Evet |
| EMC – İzleme yöntemi | Text Field (single line) | CS101 | Evet |
| EMC – Alıcı tipi ve çalışma frekansları | Text Field (single line) | CS103, CS104, CS105 | Evet |
| EMC – EUT çalışma frekansı ve duyarlılığı | Text Field (single line) | CS109 | Evet |
| EMC – Kurulum ortamı (Tablo sütunu) | Select List (single choice) | CS114, RS103 | Evet |
| EMC – Test edilecek kablo demetleri ve güç hatları | Text Field (multi-line) | CS114, CS115, CS116, CS117 | Evet |
| EMC – Platform rezonansı gibi ek kritik frekanslar | Text Field (single line) | CS116 | Hayır |
| EMC – Kurulum alanı | Select List (single choice) | CS117 | Evet |
| EMC – ESD test seviyesi (Tablo VIII) | Select List (single choice) | CS118 | Evet |
| EMC – Test noktaları (kullanıcı erişimli yüzeyler) | Text Field (multi-line) | CS118 | Evet |
| EMC – Taranacak/test edilecek EUT yüzleri ve konektörler | Text Field (multi-line) | RE101, RS101 | Evet |
| EMC – Kullanılacak antenler (tip, model, anten faktörü sertifika tarihi) | Text Field (multi-line) | RE102 | Evet |
| EMC – Üst frekans sınırı | Select List (single choice) | RE102 | Evet |
| EMC – Üst frekans sınırı (RS103) | Select List (single choice) | RS103 | Evet |
| EMC – Test edilecek EUT yüzleri | Text Field (single line) | RS103 | Evet |
| EMC – EUT yönelimleri | Text Field (single line) | RS105 | Evet |

### 3. Servisin Çalıştırılması

Node.js 18 veya üzeri sürüm gereklidir. Harici Node.js bağımlılığı bulunmamaktadır.

```bash
# Jira bağlantı ayarları
export JIRA_BASE_URL="https://jira.sirket.local"

# Cloud: E-posta adresi + API token
export JIRA_USER="servis.hesabi@..."

# Kimlik doğrulama token'ı
export JIRA_TOKEN="..."

# Data Center: Kişisel erişim token'ı kullanımı
# JIRA_BEARER ortam değişkeni desteklenir.

export WEBHOOK_SECRET="uzun-rastgele-bir-sir"

# Servisi başlat
node server.js
```

Varsayılan port `8080`'dir. Farklı bir port kullanmak için `PORT` ortam değişkenini tanımlayın.

Servis kurum içi ortamda çalıştırılmalıdır. Böylece buluş ve cihaz bilgileri kurum dışına aktarılmaz.

Servis hesabına yalnızca ilgili Jira projesinde şu yetkileri verin:

- Kayıt görüntüleme
- Yorum ekleme
- Dosya eki ekleme

### 4. API Uç Noktaları

| Yöntem | Yol | Açıklama |
|---|---|---|
| GET | `/` | Web arayüzü ve prosedür üretici |
| GET | `/health` | Servis ve Jira yapılandırma durumu |
| GET | `/schema` | Jira alan şeması (`jira-fields.json`) |
| POST | `/generate` | `{testId, fields}` → `{ok, missing, invalid, markdown, html, applicability}` |
| POST | `/jira/webhook` | `{issueKey}` veya doğrudan `{fields}` değerleri. `dryRun: true` ile Jira'ya yazmadan test yapılabilir. |

**API test örneği:**

```bash
curl -X POST localhost:8080/generate \
  -H 'Content-Type: application/json' \
  -d @ornek-istek.json
```

### 5. Proje Yapısı

| Dosya | Açıklama |
|---|---|
| `core.js` | Veri modeli (19 test) ve prosedür üreticisi. Otomatik oluşturulur. |
| `jira-fields.json` | Veri modelinden oluşturulan Jira alan şeması ve iş akışı. |
| `jira.js` | Jira REST istemcisi; alan eşleştirme, okuma, yorum ve dosya eki işlemleri. |
| `server.js` | HTTP servisi. |
| `test/e2e.js` | Sahte Jira sunucusu ile uçtan uca testler. |
| `app/data.js` | Veri modeli kaynak dosyası. |
| `app/help.js` | Yardım ve açıklama metinleri. |
| `app/gen.js` | Prosedür üretim mantığı. |
| `app/ui.js` | Web arayüzü kaynak dosyası. |
| `app/build_html.py` | Web arayüzünü oluşturan Python betiği. |

`core.js` dosyası `npm run build` komutuyla yeniden oluşturulur.

### 6. Sınırlamalar ve Açık Konular

- Sistem henüz gerçek bir Jira ortamında test edilmemiştir. Jira Cloud / Data Center sürümü, REST API v2 desteği ve Automation eylemleri kurulum sırasında doğrulanmalıdır.
- Mevcut çıktı formatları Markdown ve HTML'dir. DOCX/PDF üretimi gelecekte eklenebilir.
- Kısmi testlerde (CE106, CS103–105, CS109, CS117, CS118 ve RE103) prosedür taslağının 14. bölümü ilgili standart bilgileri kullanılarak tamamlanmalıdır.
- Talep sahibinin yetkileri, kayıt gizliliği ve verilerin saklanma politikası kurumun BT güvenlik kurallarına uygun olarak belirlenmelidir.

---

<a name="english"></a>
## 🇬🇧 English

This directory contains a **service that generates EMC test procedure drafts** using a data model derived from the MIL-STD-461G standard, along with a **toolkit that integrates the service into Jira workflows**.

A test engineer creates a request in Jira. The service uses the submitted information to generate a procedure draft and attaches it to the corresponding Jira issue. If any required information is missing, the service adds a comment listing the missing fields.

> **Status:** The service and Jira client have been tested end-to-end against a mock Jira server (`npm test`). They have **not yet been tested against a real Jira instance**. Field names, authentication, and Automation settings must be verified in the target environment during deployment.

### Quick Start (5 Minutes – No Jira Required)

1. Install **Node.js 18 or later** from [nodejs.org](https://nodejs.org/). Verify the installation using `node --version`.
2. Extract the ZIP archive and navigate to the project directory: `cd jira-kit`
3. Optionally run the tests: `npm test`. The process should finish with the message `TÜM TESTLER GEÇTİ`.
4. Start the service: `node server.js`
5. Open `http://localhost:8080` in your browser.

Select the platform and test type in the web interface, then enter the required information. The procedure draft is generated and displayed in real time on the right-hand side.

Generated drafts can be downloaded in `.md`, `.html`, and Word (`.doc`) formats. You can also use the print function to save them as PDF files.

To stop the service, press `Ctrl+C` in the terminal.

**Changing the port:**

- Linux/macOS: `PORT=3000 node server.js`
- Windows PowerShell: `$env:PORT=3000; node server.js`

**Testing the API directly:**

- Linux/macOS:
  `curl -X POST http://localhost:8080/generate -H "Content-Type: application/json" -d @ornek-istek.json`

- Windows PowerShell:
  `Invoke-RestMethod -Uri http://localhost:8080/generate -Method Post -ContentType "application/json; charset=utf-8" -Body ([Text.Encoding]::UTF8.GetBytes((Get-Content ornek-istek.json -Raw -Encoding UTF8)))`

If the data model or user interface changes:

- Modify the relevant files in the `app/` directory.
- Run `npm run build` to regenerate the core module and Jira field schema.
- Run `python3 app/build_html.py` to rebuild the web interface.

### 1. Workflow Overview

```text
Test Engineer
      |
      v
Jira Request (EMC Test Procedure Request)
      |
      v
Jira Automation: Send Web Request
      |
      v
EMC Service
      |
      |-- Retrieves the Jira issue via the REST API.
      |-- Maps fields using their names.
      |-- Validates the input and generates the procedure using core.js.
      |
      |-- If all required information is available:
      |      Attaches .md and .html files.
      |      Adds a "Draft is ready" comment.
      |
      |-- If information is missing:
      |      Adds a comment listing the missing fields.
      |
      v
Jira Automation
      |
      |-- ok = true  -> Draft Ready
      |-- ok = false -> Awaiting Information
      |
      v
Engineering Review
      |
      |-- Approved
      |-- Revision Required
```

In this architecture, Jira acts as the **user interface, workflow management, approval, and traceability layer**.

The core procedure-generation software, consisting of the data model and generation engine, is independent of Jira. Therefore, the same core module can be used by both the web application and the backend service.

### 2. Jira Configuration

1. **Issue Type:** Create an issue type named `EMC Test Procedure Request`.
2. **Custom Fields:** Create the fields listed in the table below. Field names must match exactly because the service identifies fields by their names. Detailed definitions and available options are provided in `jira-fields.json`. The `description` value of each field can be used as its Jira field description.
3. **Conditional Fields:** Some fields are required only for specific test types. Conditional visibility can be implemented using Jira Service Management form logic or plugins such as ScriptRunner/Behaviours. If these features are unavailable, all fields remain visible, while the service validates only those required for the selected test type.
4. **Workflow:** Request → Awaiting Information → Draft Ready → Engineering Review → Approved / Revision Required.
5. **Automation Rule:**
   - Trigger: When an issue is created or when fields change while the issue is in the Awaiting Information status.
   - Action: `Send web request`.
   - HTTP method: `POST`.
   - URL: `https://<service>/jira/webhook`
   - Header: `X-Webhook-Secret`
   - Request body: `{"issueKey": "{{issue.key}}"}`
   - Enable the option to wait for the response.
   - Perform the appropriate workflow transition based on the `ok` value in the response. For Jira Cloud, `webResponse.body.ok` may be used. Verify Smart Value support in your Jira Data Center version.

### Custom Field List

| Field Name | Jira Field Type | Applicable Tests | Required |
|---|---|---|---|
| EMC – Test Type | Select List (single choice) | All | Yes |
| EMC – Project / Contract Name | Text Field (single line) | All | Yes |
| EMC – Document Number | Text Field (single line) | All | No |
| EMC – EUT Name | Text Field (single line) | All | Yes |
| EMC – EUT Part Number | Text Field (single line) | All | No |
| EMC – EUT Serial Number | Text Field (single line) | All | No |
| EMC – Installation Platform (Table V) | Select List (single choice) | All | Yes |
| EMC – EUT Power Input | Select List (single choice) | All | Yes |
| EMC – Additional Power Input Information (Current, Phase, Number of Power Lines) | Text Field (single line) | All | No |
| EMC – EUT Operating Modes | Text Field (multi-line) | All | Yes |
| EMC – Applicable Limit / Level (After Tailoring) | Text Field (single line) | All | Yes |
| EMC – Test Laboratory | Text Field (single line) | All | No |
| EMC – Test Engineer | Text Field (single line) | All | No |
| EMC – Planned Test Date | Text Field (single line) | All | No |
| EMC – Standard Deviations / Tailoring Notes | Text Field (multi-line) | All | No |
| EMC – Power Lines to Be Measured (Including Returns) | Text Field (single line) | CE101, CE102 | Yes |
| EMC – Nominal Load Current (A) | Text Field (single line) | CE101 | No |
| EMC – Receiver Type | Select List (single choice) | CE102, RE102 | Yes |
| EMC – Transmitter Fundamental Frequency / Operating Range | Text Field (single line) | CE106, RE103 | Yes |
| EMC – Transmitter Peak Power | Text Field (single line) | CE106, RE103 | No |
| EMC – Functions to Be Monitored and Performance Criteria | Text Field (multi-line) | CS101, CS103, CS104, CS105, CS109, CS114, CS115, CS116, CS117, CS118, RS101, RS103, RS105 | Yes |
| EMC – Power Network Configuration | Select List (single choice) | CS101 | Yes |
| EMC – Monitoring Method | Text Field (single line) | CS101 | Yes |
| EMC – Receiver Type and Operating Frequencies | Text Field (single line) | CS103, CS104, CS105 | Yes |
| EMC – EUT Operating Frequency and Susceptibility | Text Field (single line) | CS109 | Yes |
| EMC – Installation Environment (Table Column) | Select List (single choice) | CS114, RS103 | Yes |
| EMC – Cable Bundles and Power Lines to Be Tested | Text Field (multi-line) | CS114, CS115, CS116, CS117 | Yes |
| EMC – Additional Critical Frequencies (e.g. Platform Resonances) | Text Field (single line) | CS116 | No |
| EMC – Installation Area | Select List (single choice) | CS117 | Yes |
| EMC – ESD Test Level (Table VIII) | Select List (single choice) | CS118 | Yes |
| EMC – Test Points (User-Accessible Surfaces) | Text Field (multi-line) | CS118 | Yes |
| EMC – EUT Surfaces and Connectors to Be Scanned / Tested | Text Field (multi-line) | RE101, RS101 | Yes |
| EMC – Antennas to Be Used (Type, Model, Antenna Factor, Calibration Certificate Date) | Text Field (multi-line) | RE102 | Yes |
| EMC – Upper Frequency Limit | Select List (single choice) | RE102 | Yes |
| EMC – Upper Frequency Limit (RS103) | Select List (single choice) | RS103 | Yes |
| EMC – EUT Surfaces to Be Tested | Text Field (single line) | RS103 | Yes |
| EMC – EUT Orientations | Text Field (single line) | RS105 | Yes |

### 3. Running the Service

Node.js 18 or later is required. No external Node.js dependencies are needed.

```bash
# Jira connection settings
export JIRA_BASE_URL="https://jira.company.local"

# Cloud: Email address + API token
export JIRA_USER="service.account@..."

# Authentication token
export JIRA_TOKEN="..."

# Data Center: Personal access token
# The JIRA_BEARER environment variable is supported.

export WEBHOOK_SECRET="long-random-secret-string"

# Start the service
node server.js
```

The default port is `8080`. Set the `PORT` environment variable to use a different port.

The service should run within the organization's internal network to prevent project and device information from being transferred outside the organization.

Grant the service account only the following permissions within the relevant Jira project:

- Browse issues
- Add comments
- Create attachments

### 4. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Web interface and procedure generator |
| GET | `/health` | Service and Jira configuration status |
| GET | `/schema` | Jira field schema (`jira-fields.json`) |
| POST | `/generate` | `{testId, fields}` → `{ok, missing, invalid, markdown, html, applicability}` |
| POST | `/jira/webhook` | Accepts `{issueKey}` or direct `{fields}` values. Use `dryRun: true` to test without writing to Jira. |

**Quick API test:**

```bash
curl -X POST localhost:8080/generate \
  -H 'Content-Type: application/json' \
  -d @ornek-istek.json
```

### 5. Project Structure

| File | Description |
|---|---|
| `core.js` | Data model (19 tests) and procedure generator. Automatically generated. |
| `jira-fields.json` | Jira field schema and workflow generated from the data model. |
| `jira.js` | Jira REST client for field mapping, issue retrieval, comments, and attachments. |
| `server.js` | HTTP service. |
| `test/e2e.js` | End-to-end tests using a mock Jira server. |
| `app/data.js` | Data model source file. |
| `app/help.js` | Help and description texts. |
| `app/gen.js` | Procedure generation logic. |
| `app/ui.js` | Web interface source file. |
| `app/build_html.py` | Python script for generating the web interface. |

The `core.js` file is regenerated using the `npm run build` command.

### 6. Limitations and Open Questions

- The system has not yet been tested against a real Jira instance. Jira Cloud / Data Center compatibility, REST API v2 support, and Automation actions must be verified during deployment.
- Current output formats are Markdown and HTML. DOCX/PDF generation may be added in the future.
- For partial test implementations (CE106, CS103–105, CS109, CS117, CS118, and RE103), Section 14 of the generated procedure draft must be completed using the relevant standard requirements.
- Requester permissions, issue confidentiality, and data retention policies must be defined in accordance with the organization's IT security policies.
