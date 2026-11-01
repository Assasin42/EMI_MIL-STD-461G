/* OTOMATİK ÜRETİLDİ: build-core.py. Elle düzenlemeyin. Kaynak: app/data.js, help.js, gen.js */
/* ===== MIL-STD-461G (11 Aralık 2015) – yapılandırılmış veri =====
   Kaynak: yüklenen MIL-STD-461G PDF. Metin Türkçe özetlenmiştir; sayısal değerler standarttan alınmıştır.
   depth: "tam"  = uygulanabilirlik, limit, ekipman, düzen, kalibrasyon ve adımlar standarttan çıkarıldı
          "kısmi"= bazı alt maddeler (şekiller, ayrıntılı adımlar) standarttan ayrıca takip edilmeli  */

const PLATFORMS = ["Yüzey gemileri","Denizaltılar","Hava aracı – Kara Kuvvetleri (flight line dahil)","Hava aracı – Deniz Kuvvetleri","Hava aracı – Hava Kuvvetleri","Uzay sistemleri ve fırlatma araçları","Kara – Kara Kuvvetleri","Kara – Deniz Kuvvetleri","Kara – Hava Kuvvetleri"];
const SERVICE_OF = ["N","N","A","N","AF","ALL","A","N","AF"]; // Tablo VI / XI satırı (A, N, AF)
const REQ_ORDER = ["CE101","CE102","CE106","CS101","CS103","CS104","CS105","CS109","CS114","CS115","CS116","CS117","CS118","RE101","RE102","RE103","RS101","RS103","RS105"];
/* Tablo V – Requirement matrix (A: uygulanır, L: sınırlı, S: tedarik makamı belirtir, -: uygulanmaz) */
const MATRIX = {
 0:"A A L A S L S L A S A L S A A L L A L",
 1:"A A L A S L S L A S L S S A A L L A L",
 2:"A A L A S S S - A A A L A A A L A A L",
 3:"L A L A S S S - A A A L A L A L L A L",
 4:"- A L A S S S - A A A L A - A L - A -",
 5:"- A L A S S S - A A A L - - A L - A -",
 6:"- A L A S S S - A A A S A - A L L A -",
 7:"- A L A S S S - A A A S A - A L L A L",
 8:"- A L A S S S - A A A - A - A L - A -"
};
const MX = {}; PLATFORMS.forEach((p,i)=>{ MX[i]={}; MATRIX[i].split(" ").forEach((v,j)=>MX[i][REQ_ORDER[j]]=v==="-"?"":v); });
const STATUS_TXT = {A:"Uygulanır",L:"Sınırlı uygulanır (ilgili maddedeki koşullara bağlı)",S:"Tedarik makamı sözleşmede belirtmelidir",""  :"Tablo V'te boş: bu platform için uygulanmaz"};

/* Tablo II – ölçüm alıcı bant genişliği ve süre (emisyon) */
const TABLE_II = [
 [30,1e3,"10 Hz","0,15 sn","0,015 sn/Hz"],
 [1e3,1e4,"100 Hz","0,015 sn","0,15 sn/kHz"],
 [1e4,1.5e5,"1 kHz","0,015 sn","0,015 sn/kHz"],
 [1.5e5,1e7,"10 kHz","0,015 sn","1,5 sn/MHz"],
 [1e7,3e7,"10 kHz","0,015 sn","1,5 sn/MHz"],
 [3e7,1e9,"100 kHz","0,015 sn","0,15 sn/MHz"],
 [1e9,1e11,"1 MHz","0,015 sn","15 sn/GHz"]];
/* Tablo III – alınganlık tarama */
const TABLE_III = [
 [30,1e6,"0,0333 fo/sn","0,05 fo"],
 [1e6,3e7,"0,00667 fo/sn","0,01 fo"],
 [3e7,1e9,"0,00333 fo/sn","0,005 fo"],
 [1e9,4e10,"0,00167 fo/sn","0,0025 fo"]];

/* Tablo VI (CS114) ve Tablo XI (RS103): kurulum ortamı sütunları */
const ENVS = ["Hava aracı – dış veya emniyet kritik","Hava aracı – iç","Tüm gemiler (güverte üstü ve açıkta güverte altı) ve denizaltı dışı","Gemiler (metalik, güverte altı)","Gemiler (metalik olmayan, güverte altı)","Denizaltı (iç)","Kara","Uzay"];
/* satır: [alt Hz, üst Hz, etiket, {A:[8], N:[8], AF:[8]}] ; "-" = tanımsız */
const CS114_TAB = [
 ["4 kHz – 1 MHz",{N:["-","-","77 dBµA","77 dBµA","77 dBµA","77 dBµA","-","-"]}],
 ["10 kHz – 2 MHz",{A:[5,5,2,2,2,1,3,3],N:[5,3,2,2,2,1,2,3],AF:[5,3,"-","-","-","-",2,3]}],
 ["2 MHz – 30 MHz",{A:[5,5,5,2,4,1,4,3],N:[5,5,5,2,4,1,2,3],AF:[5,3,"-","-","-","-",2,3]}],
 ["30 MHz – 200 MHz",{A:[5,5,5,2,2,2,4,3],N:[5,5,5,2,2,2,2,3],AF:[5,3,"-","-","-","-",2,3]}]];
const CS114_MIN = {5:"115 dBµA",4:"103 dBµA",3:"95 dBµA",2:"89 dBµA",1:"83 dBµA"};
const RS103_TAB = [
 ["2 MHz – 30 MHz",{A:[200,200,200,10,50,5,50,20],N:[200,200,200,10,50,5,10,20],AF:[200,20,"-","-","-","-",10,20]}],
 ["30 MHz – 1 GHz",{A:[200,200,200,10,10,10,50,20],N:[200,200,200,10,10,10,10,20],AF:[200,20,"-","-","-","-",10,20]}],
 ["1 GHz – 18 GHz",{A:[200,200,200,10,10,10,50,20],N:[200,200,200,10,10,10,50,20],AF:[200,60,"-","-","-","-",50,20]}],
 ["18 GHz – 40 GHz",{A:[200,200,200,10,10,10,50,20],N:[200,60,200,10,10,10,50,20],AF:[200,60,"-","-","-","-",50,20]}]];

/* Ekipman rolleri (standardın "Test equipment" listelerinden) */
const EQ = {
 rx:["Ölçüm alıcısı","Tablo II bant genişliklerini sağlar; kalibrasyonu geçerli"],
 rec:["Veri kayıt cihazı","Genlik–frekans grafiklerini otomatik çizer"],
 sg:["Sinyal üreteci","Test frekans aralığını ve gereken modülasyonu sağlar"],
 osc:["Osiloskop","Test sinyalinin bant genişliğini karşılar"],
 oscIso:["Osiloskop (yalıtım trafolu) veya ölçüm alıcısı + transdüser","Güç hattı yalıtımı için"],
 lisn:["LISN","Şekil 6 devresine uygun; yalnızca giriş güç hatlarında"],
 cprobe:["Akım probu","Frekans aralığında kalibre"],
 inj:["Akım enjeksiyon probu","Şekil CS114-2'deki kayıp sınırları"],
 calfix:["Kalibrasyon fikstürü","50 Ω koaksiyel hat; ortasında enjeksiyon probu için yer"],
 dc:["Yönlü coupler","İleri güç ölçümü için"],
 pa:["Güç yükselteci","Hedef seviye için yeterli çıkış gücü"],
 att:["50 Ω atenüatörler","Kalibrasyonda kullanılanla aynı devre testte de korunur"],
 load:["50 Ω koaksiyel yükler",""],
 att20:["20 dB, 50 Ω atenüatör","LISN sinyal çıkışına bağlanır"],
 res:["Direnç","Standart şemasına göre (R veya 0,5 Ω)"],
 ct:["Kuplaj trafosu","CS101 şemalarına göre"],
 cap10:["10 µF kapasitör",""],
 iso:["Yalıtım trafoları","AC kaynak yalıtımı"],
 pulse:["50 Ω darbe üreteci (yüklü hat, koaksiyel)","Standart dalga biçimi sınırlarını sağlar"],
 drive:["Sürücü kablosu","50 Ω, 2 m, 500 MHz'de ≤0,5 dB kayıp"],
 dsg:["Sönümlü sinüs geçici üreteci","Çıkış empedansı ≈100 Ω"],
 wfrec:["Dalga biçimi kayıt cihazı",""],
 ltg:["Yıldırım geçici üreteci","Tablo VII dalga biçimleri"],
 injtr:["Enjeksiyon trafoları",""],
 mloop:["İzleme ve kalibrasyon halkası (düşük empedanslı tel)",""],
 vprobe:["Yüksek empedanslı gerilim probları",""],
 bigcap:["≥28.000 µF (DC) / 10 µF (AC) kapasitör","LISN güç giriş tarafı"],
 esd:["ESD generatörü","±2 kV – ±15 kV (en az), 150 pF / 330 Ω ağı, temas ve hava uçları"],
 esdv:["Elektrostatik voltmetre",""],
 esdt:["ESD akım hedefi (2 Ω ±%5)","≥1 GHz tek atım osiloskop ve 20 dB atenüatör ile"],
 ionizer:["İyonlaştırıcı veya 1 MΩ ±%10 direnç","Deşarj sonrası boşaltma"],
 gnd:["Metalik topraklama düzlemi","≥2,25 m², kısa kenar ≥76 cm; kabin zeminine ≥her 1 m'de bağlı, bağlantı direnci ≤2,5 mΩ"],
 shield:["Ekranlı oda (gerekiyorsa emici kaplı)","Ortam, limitin en az 6 dB altında"],
 rod:["104 cm çubuk anten + uyum ağı (10 kHz–30 MHz)","60 cm kenarlı kare karşı ağırlık"],
 bicon:["Biconical anten, 137 cm (30–200 MHz)",""],
 horn1:["Çift sırtlı horn, 69,0×94,5 cm (200 MHz–1 GHz)",""],
 horn2:["Çift sırtlı horn, 24,2×13,6 cm (1–18 GHz)",""],
 stub:["Stub yayıcı ve 10 pF kapasitör","Çubuk anten sistem kontrolü için"],
 loopR:["Radyasyon halkası","12 cm çap, 20 sarım, No.12 yalıtımlı bakır"],
 loopS:["Halka sensör (RS101)","4 cm çap, 51 sarım, 7-41 Litz, elektrostatik ekranlı"],
 loopM:["Halka sensör (RE101)","13,3 cm çap, 36 sarım, DC direnci 5–10 Ω, elektrostatik ekranlı"],
 ohm:["Ohmmetre","Halka direnç kontrolü"],
 volt:["Dar bantlı voltmetre veya ölçüm alıcısı",""],
 txant:["Verici antenler","Frekans bandına uygun"],
 efs:["Elektrik alan sensörü","Fiziksel olarak küçük, elektriksel olarak kısa"],
 pm:["Güç ölçer",""],
 dummy:["50 Ω yapay yük ve rejeksiyon ağları","Verici gücüne göre"],
 tem:["TEM hücre, paralel plaka hattı veya eşdeğeri","Çalışma hacmi (h/3, B/2, A/2) sınırı"],
 tpg:["Geçici darbe üreteci","Tek darbe, ± polarite"],
 sosc:["Saklamalı osiloskop","≥700 MHz tek atım, 1 GSa/s'ye kadar örnekleme"],
 hvp:["Yüksek gerilim probu","≥1 GHz"],
 bdot:["B-dot / D-dot sensör probu ve integratör","İntegratör zaman sabiti, darbe genişliğinin 10 katı"],
 monitor:["EUT izleme düzeneği","Performans kriterinde tanımlı fonksiyonlar"]
};

/* ortak girdi alanları */
const COMMON_INPUTS = [
 {id:"proje",label:"Proje / sözleşme adı",type:"text",req:true,scope:"all"},
 {id:"dokNo",label:"Doküman numarası",type:"text",scope:"all"},
 {id:"eutAd",label:"EUT adı",type:"text",req:true,scope:"all"},
 {id:"eutPN",label:"EUT parça no",type:"text",scope:"all"},
 {id:"eutSN",label:"EUT seri no",type:"text",scope:"all"},
 {id:"platform",label:"Kurulum platformu (Tablo V)",type:"select",req:true,scope:"all",options:PLATFORMS,hint:"Uygulanabilirliği ve bazı limit eğrilerini belirler."},
 {id:"guc",label:"EUT güç girişi",type:"select",req:true,scope:"all",options:["28 V DC","270 V DC","115 V AC 400 Hz","115 V AC 60 Hz","230 V AC 50 Hz","Diğer (aşağıya yazın)"]},
 {id:"gucNot",label:"Güç girişi ek bilgi (akım, faz, güç hattı sayısı)",type:"text",scope:"all"},
 {id:"modlar",label:"EUT çalışma modları",type:"textarea",req:true,scope:"all",hint:"En kötü durum emisyon veya alınganlık üreten modlar."},
 {id:"limitKaynak",label:"Uygulanacak limit / seviye (uyarlama sonrası)",type:"text",req:true,scope:"all",hint:"Sözleşme/ICD'deki şekil veya değer. Örn. 'Şekil RE102-3, ... eğrisi'."},
 {id:"performans",label:"İzlenecek fonksiyonlar ve performans kriteri",type:"textarea",req:true,scope:"Alınganlık",hint:"Neyin izleneceği ve hangi sapmanın bozulma sayılacağı (EUT spesifikasyonundaki tolerans)."},
 {id:"lab",label:"Test laboratuvarı",type:"text",scope:"all"},
 {id:"muh",label:"Test mühendisi",type:"text",scope:"all"},
 {id:"tarih",label:"Planlanan test tarihi",type:"text",scope:"all"},
 {id:"tailor",label:"Standarttan sapma / uyarlama notları",type:"textarea",scope:"all"}
];
const ENV_INPUT = {id:"ortam",label:"Kurulum ortamı (Tablo sütunu)",type:"select",req:true,options:ENVS,hint:"Limit eğrisi / alan seviyesi için tablo sütununu belirler."};

/* ===== Testler ===== */
const TESTS = [
{id:"CE101",ref:"5.4",type:"CE",kind:"Emisyon",depth:"tam",basic:true,
 name:"İletilen emisyon, ses frekanslı akımlar, güç hatları",freq:[30,1e4,"30 Hz – 10 kHz"],unit:"dBµA",coupling:"Güç hatları (dönüşler dahil), akım",
 purpose:"EUT güç giriş hatları (dönüşler dahil) üzerindeki ses frekanslı iletilen emisyonların limitleri aşmadığını doğrulamak.",
 applic:["Kendi parçası olmayan bir kaynaktan güç alan güç hatları (dönüşler dahil) için 30 Hz – 10 kHz'de uygulanır.","Yüzey gemileri, denizaltılar, Kara Kuvvetleri hava araçları (flight line dahil) ve Deniz Kuvvetleri hava araçları için geçerlidir; Deniz hava araçlarında yalnızca platformda 30 Hz – 10 kHz'de çalışan ASW ekipmanı (Sonobuoy alıcısı, MAD) varsa.","AC uygulamalarda EUT güç frekansının ikinci harmoniğinden başlar."],
 limits:["Yüzey gemisi ve denizaltılar için Şekil CE101-1 ile CE101-3; Kara hava aracı ve Deniz ASW hava aracı için Şekil CE101-4.","DC gemi/denizaltı (Şekil CE101-1): yük akımı ≤3 A ise eğri aynen; 3–185 A arasında 20 log(I/3) kadar gevşetilir; ≥185 A için 35 dB gevşetilir."],
 equipment:["rx","cprobe","sg","rec","osc","res","lisn"],
 setup:["Temel test düzeni: Şekil 2–5 ve madde 4.3.8. LISN, tedarik makamı onaylarsa kaldırılabilir veya alternatif bir stabilizasyon cihazıyla değiştirilebilir.","Ölçüm sistemi doğrulaması için Şekil CE101-5; EUT testi için Şekil CE101-6 düzenini kurun.","Akım probunu LISN'den 5 cm uzağa yerleştirin."],
 check:["Limitin en az 6 dB altında kalibre edilmiş sinyali 1,1 kHz, 3 kHz ve 9,9 kHz'de akım problarına uygulayın.","Akımı osiloskop ve yük direnciyle doğrulayın; dalga biçiminin sinüs olduğunu kontrol edin.","Normal veri taramasıyla aynı şekilde tarayın; kayıt cihazı enjekte edilen seviyeyle ±3 dB uyumlu olmalıdır. Sapma varsa nedeni bulup giderin."],
 steps:["Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin; ölçüm sistemi doğrulamasını yapın.","EUT'yi açın, kararlı hale gelmesini bekleyin.","Bir güç hattı seçin ve akım probunu hat üzerine takın.","Alıcıyı uygulanabilir frekans aralığında, Tablo II'deki bant genişliği ve asgari ölçüm süreleriyle tarayın.","Taramayı her güç hattı (dönüşler dahil) için tekrarlayın."],
 data:["Genlik–frekans grafiklerini otomatik çizin; elle toplanan veri yalnızca grafik doğrulaması için kabul edilir.","Her grafikte limiti gösterin.","Frekans çözünürlüğü en az %1 veya alıcı bant genişliğinin 2 katı (hangisi daha az katıysa); genlik çözünürlüğü en az 1 dB.","Hem ölçüm hem sistem kontrolü grafiklerini verin."],
 special:["Ölçüm sistemi sapması ±3 dB'yi aşarsa teste geçilmez.","Akım probu her hat için ayrı yerleştirilir."],
 verify:["Şekil CE101-1…4 limit eğrilerinin seçimi (güç tipi ve yük akımı)"],
 inputs:[{id:"hatlar",label:"Ölçülecek güç hatları (dönüşler dahil)",type:"text",req:true,hint:"Örn. +28 V, 28 V dönüş"},{id:"yukAkim",label:"Nominal yük akımı (A)",type:"text",hint:"DC gemi/denizaltı limit gevşetmesi için gerekli"}]},

{id:"CE102",ref:"5.5",type:"CE",kind:"Emisyon",depth:"tam",basic:true,
 name:"İletilen emisyon, radyo frekanslı potansiyel, güç hatları",freq:[1e4,1e7,"10 kHz – 10 MHz"],unit:"dBµV",coupling:"Güç hatları, gerilim (LISN)",
 purpose:"EUT güç giriş hatları (dönüşler dahil) üzerindeki RF iletilen emisyonların limitleri aşmadığını doğrulamak.",
 applic:["Kendi parçası olmayan kaynaklardan güç alan tüm güç hatları (dönüşler dahil) için 10 kHz – 10 MHz'de uygulanır."],
 limits:["Şekil CE102-1 (tüm uygulamalar, AC ve DC güç hatları).","Şekilde nominal kaynak gerilimine göre gevşetme belirtilir: 28 V temel eğri; 115 V için 6 dB; 220 V için 9 dB; ≥270 V için 10 dB; 440 V için 12 dB."],
 equipment:["rx","rec","sg","att20","osc","lisn"],
 setup:["Temel test düzeni: Şekil 2–5 ve madde 4.3.8.","Sistem kontrolü: Şekil CE102-2; LISN güç kaynağı bağlı olmamalı. Ölçüm alıcısı LISN sinyal çıkış portundaki 20 dB atenüatöre bağlanır.","EUT testi: Şekil CE102-3; alıcı yine 20 dB atenüatör üzerinden LISN sinyal portuna bağlanır."],
 check:["LISN güç çıkış terminaline 10,5 kHz ve 100 kHz'de 90 dBµV uygulayın; osiloskopla (yüksek empedans) seviye ve sinüs olduğunu doğrulayın. LISN'i ayırıp 50 Ω girişli osiloskopla ölçün; oran 10,5 kHz'de −14 dB (+1/−2 dB), 100 kHz'de −3 dB (+1/−2 dB) olmalı.","Limitin en az 6 dB altındaki sinyali 10,5 kHz, 100 kHz, 1,95 MHz ve 9,8 MHz'de LISN güç çıkış terminaline uygulayın (ilk ikisinde osiloskopla, diğerlerinde kalibre 50 Ω üreteç çıkışıyla).","Normal tarama gibi tarayın; alıcı enjekte seviyenin ±3 dB içinde olmalı. 20 dB atenüatör ve LISN 0,25 µF kuplaj kondansatörü gerilim düşümü için düzeltme faktörü uygulayın.","Her LISN için tekrarlayın."],
 steps:["Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin; sistem kontrolünü yapın.","EUT'yi açıp kararlı hale getirin.","Bir güç hattı seçin; alıcıyı Tablo II bant genişliği ve süreleriyle tarayın.","Her güç hattı için tekrarlayın."],
 data:["Genlik–frekans grafiklerini otomatik çizin; limiti gösterin.","Frekans çözünürlüğü: %1 veya alıcı bant genişliğinin 2 katı; genlik çözünürlüğü ≥1 dB.","Ölçüm ve sistem kontrolü grafiklerini verin."],
 special:["LISN'ler yalnızca giriş güç hatlarında kullanılır; çıkış güç hatlarında kullanılmaz (4.3.6).","LISN bağlantı direnci ≤2,5 mΩ olmalı; LISN empedans grafikleri rapora eklenir."],
 verify:["Şekil CE102-1 eğrisinin okunması (nominal gerilime göre gevşetme)"],
 inputs:[{id:"hatlar",label:"Ölçülecek güç hatları (dönüşler dahil)",type:"text",req:true},{id:"tarama",label:"Alıcı türü",type:"select",options:["Adım ayarlı alıcı","Analog ayarlı alıcı","FFT alıcı"],req:true}]},

{id:"CE106",ref:"5.6",type:"CE",kind:"Emisyon",depth:"kısmi",basic:false,
 name:"İletilen emisyon, anten portu",freq:[1e4,4e10,"10 kHz – 40 GHz"],unit:"dBµV / dBm",coupling:"Verici, alıcı ve yükselteç anten portları",
 purpose:"EUT anten portunda görülen iletilen emisyonların limitleri aşmadığını doğrulamak.",
 applic:["Vericilerin, alıcıların ve yükseltecilerin anten portları için 10 kHz – 40 GHz'de uygulanır; kalıcı monte antenli donanım için uygulanmaz.","Verici modunda, EUT sinyal bant genişliği veya temel frekansın ±%5'i (hangisi büyükse) içinde uygulanmaz. Deniz gemilerinde tepe gücü >1 kW ise dışlama bandı her fazla dB için %0,1 artar.","Başlangıç frekansı: EUT çalışma aralığı 10 kHz–3 MHz ise 10 kHz; 3–300 MHz ise 100 kHz; 300 MHz–3 GHz ise 1 MHz; 3–40 GHz ise 10 MHz.","Üst frekans: 1 GHz altı sistemlerde en yüksek frekansın 20 katı veya 18 GHz (hangisi büyükse); 1 GHz ve üstünde 10 katı veya 40 GHz (hangisi küçükse).","RE103, operasyonel antenli vericiler için alternatif olarak kullanılabilir."],
 limits:["Alıcılar: 34 dBµV. Verici/yükselteç bekleme modu: 34 dBµV.","Verici/yükselteç verici modu: 2. ve 3. harmonik dışındaki harmonikler ve diğer tüm sahte emisyonlar temelden en az 80 dB aşağıda.","2. ve 3. harmonikler: −20 dBm veya temelden 80 dB aşağı (hangisi daha az bastırma gerektiriyorsa).","Deniz gemileri: 2. ve 3. harmonikler −20 dBm; diğerleri −40 dBm (görev çevrimi <%0,2 ise 0 dBm'e gevşetilebilir)."],
 equipment:["rx","att","dummy","dc","sg","rec"],
 setup:["Temel test düzenini (Şekil 2–5, 4.3.8) korumak gerekmez.","Ölçüm sistemi kontrolü için sinyal üreteci yolu, EUT testi için EUT yolu: Şekil CE106-1…3 (seçim, ölçüm ekipmanının verici gücünü kaldırma kapasitesine bağlı)."],
 check:["Şekil CE106-1…3'teki sinyal üreteci yoluyla ölçüm sistemi kontrolü yapılır (ayrıntı: madde 5.6.3.4)."],
 steps:["Ayrıntılı adımlar standardın 5.6.3.4 maddesindeki prosedürden alınmalıdır.","Yükselteç testinde, kullanım amacındaki modülasyonu sağlayan ve sahte/harmonik çıkışları limitin ≥6 dB altında olan sinyal üreteci ile sürülür."],
 data:["Madde 5.6.3.5'e göre."],
 special:["Rejeksiyon ağları ve yönlü couplers verici gücüne göre seçilir; alıcı korunmalıdır."],
 verify:["Adımlar (5.6.3.4), Şekil CE106-1…3, veri sunumu (5.6.3.5)"],
 inputs:[{id:"fTemel",label:"Verici temel frekansı / çalışma aralığı",type:"text",req:true},{id:"pTepe",label:"Verici tepe gücü",type:"text",hint:"Gemi uygulamasında dışlama bandı için gerekli"}]},

{id:"CS101",ref:"5.7",type:"CS",kind:"Alınganlık",depth:"tam",basic:true,
 name:"İletilen alınganlık, güç hatları",freq:[30,1.5e5,"30 Hz – 150 kHz"],unit:"V rms / W",coupling:"Güç hattına seri enjeksiyon",
 purpose:"EUT'nin giriş güç hatlarına binen sinyallere dayanımını doğrulamak.",
 applic:["30 Hz – 150 kHz; AC (faz başına ≤30 A) ve DC giriş güç hatları, dönüşler hariç.","30 A üzerinde akım çeken sistemlerde yalnızca çalışma frekansı ≤150 kHz ve duyarlılığı 1 µV veya daha iyi ise uygulanır.","AC EUT'de güç frekansının ikinci harmoniğinden başlar."],
 limits:["EUT, Şekil CS101-1'deki gerilim seviyelerine maruz kalırken malfunction, performans bozulması veya belirtilen toleransların dışında sapma göstermemelidir.","Şart, güç kaynağı Şekil CS101-2'deki güç seviyesini 0,5 Ω yükte harcayacak şekilde ayarlandığında EUT'nin alınganlık göstermemesiyle de sağlanır."],
 equipment:["sg","pa","oscIso","ct","cap10","res","lisn"],
 setup:["Temel test düzeni: Şekil 2–5 ve 4.3.8.","Kalibrasyon: Şekil CS101-3; osiloskop veya alıcı 0,5 Ω direnç üzerindeki gerilimi izler.","EUT testi: DC veya tek fazlı AC için Şekil CS101-4; üç faz yıldız (4 hat) için CS101-5; üç faz üçgen için CS101-6."],
 check:["Üreteci en düşük test frekansına ayarlayın; sinyali Şekil CS101-2'de limit için belirtilen en yüksek güç seviyesine karşılık gelen gerilime çıkarın; osiloskopta dalga biçiminin sinüs olduğunu doğrulayın.","Kaynak ayarını kaydedin; gerekli frekans aralığını tarayıp seviyeyi korumak için gereken ayarı kaydedin."],
 steps:["Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin; kalibrasyonu yapın.","EUT'yi açıp kararlı hale getirin. DİKKAT: yalıtım trafosu nedeniyle osiloskobun emniyet topraklaması kesiktir; şok tehlikesi olabilir.","Üreteci en düşük frekansa ayarlayın; güç hattında gerekli gerilim veya güç seviyesine çıkın (güç, kalibrasyonda belirlenen seviyeyle sınırlıdır).","Seviyeyi koruyarak Tablo III'teki hızı aşmayacak şekilde frekans aralığını tarayın.","EUT'yi izleyin; alınganlık varsa 4.3.10.4.3'e göre eşik seviyesini belirleyin.","Her güç hattı için tekrarlayın (üçgen: A–B, B–C, C–A; yıldız: A–N, B–N, C–N)."],
 data:["Her hat için test edilen frekans ve genliklerin grafik veya tablo verisi.","Belirlenen alınganlık eşikleri ve ilgili frekanslar."],
 special:["Şok tehlikesi: osiloskop emniyet topraklaması yalıtım trafosu nedeniyle devre dışıdır."],
 verify:["Şekil CS101-1 ve CS101-2 değerleri (güç seviyesi/gerilim)"],
 inputs:[{id:"faz",label:"Güç şebekesi yapısı",type:"select",options:["DC veya tek faz AC","Üç faz yıldız (4 hat)","Üç faz üçgen"],req:true},{id:"izleme",label:"İzleme yöntemi",type:"text",req:true}]},

{id:"CS103",ref:"5.8",type:"CS",kind:"Alınganlık",depth:"kısmi",basic:false,
 name:"İletilen alınganlık, anten portu, intermodülasyon",freq:[1.5e4,1e10,"15 kHz – 10 GHz"],unit:"—",coupling:"Alıcı anten portu",
 purpose:"Anten giriş portlarındaki istenmeyen sinyallerin yol açabileceği intermodülasyon ürünlerinin varlığını belirlemek.",
 applic:["Haberleşme alıcıları, RF yükselteçler, telsizler, radar, akustik ve elektronik harp alıcıları gibi alıcı ön uç donanımı için; bireysel tedarik spesifikasyonunda belirtildiği şekilde uygulanır."],
 limits:["Limit, bireysel tedarik spesifikasyonunda verilir; EUT'de belirtilen toleransların ötesinde intermodülasyon ürünü görülmemelidir."],
 equipment:[],setup:["Ekipman, düzen, prosedür ve veri sunumu vaka bazında, standardın Ek A.5.8 yönlendirmesiyle belirlenir."],
 check:[],steps:["Prosedür Ek A.5.8'e göre vaka bazında hazırlanır."],data:["Ek A.5.8'e göre."],special:[],
 verify:["Tüm prosedür Ek A.5.8'den türetilmelidir"],
 inputs:[{id:"alici",label:"Alıcı tipi ve çalışma frekansları",type:"text",req:true}]},

{id:"CS104",ref:"5.9",type:"CS",kind:"Alınganlık",depth:"kısmi",basic:false,
 name:"İletilen alınganlık, anten portu, istenmeyen sinyallerin reddi",freq:[30,2e10,"30 Hz – 20 GHz"],unit:"—",coupling:"Alıcı anten portu",
 purpose:"Anten giriş portlarındaki istenmeyen sinyallerin yol açabileceği sahte tepkilerin varlığını belirlemek.",
 applic:["Alıcı ön uç donanımı için 30 Hz – 20 GHz; bireysel tedarik spesifikasyonunda belirtildiği şekilde.","Deniz gemileri ve denizaltılarda tüm alıcılar için uygulanır; uygulanabilir frekanslar ön uç tasarımına bağlıdır."],
 limits:["Limit bireysel tedarik spesifikasyonundadır; EUT, belirtilen toleransların ötesinde istenmeyen tepki vermemelidir."],
 equipment:[],setup:["Ekipman, düzen, prosedür ve veri sunumu vaka bazında, Ek A.5.9 yönlendirmesiyle belirlenir."],
 check:[],steps:["Prosedür Ek A.5.9'a göre vaka bazında hazırlanır."],data:["Ek A.5.9'a göre."],special:[],
 verify:["Tüm prosedür Ek A.5.9'dan türetilmelidir"],
 inputs:[{id:"alici",label:"Alıcı tipi ve çalışma frekansları",type:"text",req:true}]},

{id:"CS105",ref:"5.10",type:"CS",kind:"Alınganlık",depth:"kısmi",basic:false,
 name:"İletilen alınganlık, anten portu, çapraz modülasyon",freq:[30,2e10,"30 Hz – 20 GHz"],unit:"—",coupling:"Alıcı anten portu",
 purpose:"Anten portlarındaki istenmeyen sinyallerin yol açabileceği çapraz modülasyon ürünlerinin varlığını belirlemek.",
 applic:["Yalnızca genlik modülasyonlu RF sinyalleri işleyen alıcılar için 30 Hz – 20 GHz; bireysel tedarik spesifikasyonunda belirtildiği şekilde."],
 limits:["Limit bireysel tedarik spesifikasyonundadır."],
 equipment:[],setup:["Ekipman, düzen ve prosedür Ek A.5.10 yönlendirmesiyle belirlenir."],
 check:[],steps:["Prosedür Ek A.5.10'a göre hazırlanır."],data:["Ek A.5.10'a göre."],special:[],
 verify:["Tüm prosedür Ek A.5.10'dan türetilmelidir"],
 inputs:[{id:"alici",label:"Alıcı tipi ve çalışma frekansları",type:"text",req:true}]},

{id:"CS109",ref:"5.11",type:"CS",kind:"Alınganlık",depth:"kısmi",basic:false,
 name:"İletilen alınganlık, yapı akımı",freq:[60,1e5,"60 Hz – 100 kHz"],unit:"A",coupling:"Yapıdan geçen akım",
 purpose:"EUT'nin yapı akımlarına dayanımını doğrulamak.",
 applic:["Çalışma frekansı ≤100 kHz ve duyarlılığı 1 µV veya daha iyi (örn. 0,5 µV) donanım için 60 Hz – 100 kHz; el tipi donanım muaftır."],
 limits:["EUT, Şekil CS109-1'deki değerlere maruz kalırken malfunction, performans bozulması veya tolerans dışı sapma göstermemelidir."],
 equipment:["sg","pa","iso","cprobe","rx","res","ct"],
 setup:["Temel test düzenini korumak gerekmez; özel kalibrasyon gerekmez.","EUT ve test ekipmanı Şekil CS109-2'ye göre, EUT topraklama terminalini kullanan tek noktalı topraklamayla kurulur.","AC kaynakları yalıtım trafolarıyla yalıtılır (DC için uygulanmaz); tüm giriş güç kablolarının emniyet toprağı ayrılır; EUT ve test ekipmanı iletken olmayan yüzeylere konur.","Akım enjeksiyon noktaları: rafa takılmayacak ekipman için yalnızca montaj yüzeyinde çaprazlama uç noktalar; raf/zemin ekipmanında tüm yüzeylerde çaprazlama uçlar; perde montajlıda arka yüzeyde (ayrıntı 5.11.3.3c(2))."],
 check:[],steps:["Ayrıntılı adımlar standardın 5.11.3.4 maddesinden alınmalıdır."],data:["Madde 5.11.3.5'e göre."],special:["Güvenlik: emniyet toprağı kaldırıldığından şok tehlikesine dikkat."],
 verify:["Prosedür adımları (5.11.3.4), Şekil CS109-1 limiti"],
 inputs:[{id:"calisma",label:"EUT çalışma frekansı ve duyarlılığı",type:"text",req:true}]},

{id:"CS114",ref:"5.12",type:"CS",kind:"Alınganlık",depth:"tam",basic:true,
 name:"İletilen alınganlık, toplu kablo enjeksiyonu",freq:[1e4,2e8,"10 kHz – 200 MHz"],unit:"dBµA",coupling:"Kablo demetine akım enjeksiyonu",
 purpose:"EUT kablolarına kuplajlanan RF sinyallere dayanımı doğrulamak.",
 applic:["10 kHz – 200 MHz; güç kabloları dahil tüm ara bağlantı kabloları için.","Gemi ve denizaltı EUT'lerinde ayrıca, komple güç kablolarında (yüksek ve dönüşler, ortak mod testi) 4 kHz – 1 MHz'de 77 dBµA ortak mod limiti uygulanır.","Anten bağlantılı alıcıların anten portuna giden koaksiyel kablolar için uygulanmaz (gemi ve denizaltı hariç)."],
 limits:["Enjeksiyon probu, Şekil CS114-1'deki uygun eğri akımına önceden kalibre edilir; eğri Tablo VI'dan seçilir (aşağıdaki tabloya bakın) ve 1 kHz darbe modülasyonu, %50 görev çevrimi uygulanır.","Şart, EUT kalibrasyondakinden düşük ileri güçlerde alınganlık göstermiyorsa ve kabloda indüklenen gerçek akım Eğri 5=115, 4=103, 3=95, 2=89, 1=83 dBµA'yı sağlıyorsa da karşılanır."],
 equipment:["rx","inj","cprobe","calfix","dc","sg","att","load","pa","lisn"],
 setup:["Temel test düzeni: Şekil 2–5 ve 4.3.8.","Kalibrasyon: Şekil CS114-3. Enjeksiyon probu kalibrasyon fikstürünün orta iletkeni etrafına, izleme probu ikinci fikstüre konur; izleme probu 50 Ω ile sonlandırılır. Fikstürün bir ucu 50 Ω yük, diğer ucu atenüatör üzerinden ölçüm alıcısı A'ya bağlanır.","EUT testi: Şekil CS114-5. Enjeksiyon ve izleme probları EUT konektörüne bağlı kablo demeti etrafına konur; izleme probu konektörden 5 cm (konektör/backshell 5 cm'den uzunsa mümkün olduğunca yakın), enjeksiyon probu izleme probundan 5 cm uzağa."],
 check:["Üreteci 10 kHz'e, modülasyonsuz ayarlayın; kalibrasyon fikstüründe limit akımına ulaşana kadar sinyali artırın; ileri gücü ölçüm alıcısı B'den kaydedin.","10 kHz – 200 MHz taraması yapıp akımı korumak için gereken ileri gücü kaydedin.","Doğrulama (Şekil CS114-4): kalibre ileri gücü uygulayıp, minimum bekleme süresi ve Tablo II'dekinin iki katı adım büyüklüğüyle tarayın; ileri güç kalibrasyonu izlemeli ve akım limite göre 3 dB tolerans içinde olmalıdır."],
 steps:["Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin; kalibrasyon ve doğrulamayı yapın.","EUT'yi açıp kararlı hale getirin.","Üreteci 10 kHz'e, 1 kHz darbe modülasyonu (%50 görev çevrimi, tepe–taban en az 40 dB) ile ayarlayın; modülasyonun sürücü sinyalde olduğunu doğrulayın.","Kalibrasyondaki ileri gücü (veya limit akımını, hangisi daha az katıysa) koruyarak 4.3.10.4.1 ve Tablo III'e göre frekans aralığını tarayın. Korumalı veya düşük empedanslı devrelerde sinyali kademeli artırmak tercih edilebilir.","EUT performansını izleyin; alınganlık varsa 4.3.10.4.3'e göre eşik belirleyin.","Her konektöre bağlı her kablo demeti için tekrarlayın: komple güç kabloları (yüksek ve dönüşler), güç kabloları dönüş ve şasi toprağı (yeşil tel) hariç; hem sinyal hem güç içeren konektörlerde tüm demet, güç iletkenleri ayrı (dönüş ve toprak dahil) ve güç iletkenleri dönüş/toprak olmadan.","Emniyet açısından yedekli kablolama (çoklu veri yolu vb.) varsa eşzamanlı çoklu kablo enjeksiyonu uygulayın."],
 data:["Kalibrasyonda gereken ileri güç–frekans grafikleri.","Her konektör için taranan frekans aralıkları ve uygunluk beyanı; belirlenen eşikler ve frekansları."],
 special:["Modülasyon derinliği her sinyal üreteci/modülasyon kaynağı kombinasyonunda doğrulanmalıdır.","Probları kalibrasyon ile testte aynı sinyal devresiyle (kablolar, atenüatörler) bağlayın."],
 verify:["Şekil CS114-1 eğrilerinin akım değerleri ve Şekil CS114-2 prob kayıp sınırları"],
 table:"CS114",
 inputs:[ENV_INPUT,{id:"kablolar",label:"Test edilecek kablo demetleri",type:"textarea",req:true,hint:"Her konektör için demet ve gruplamalar"}]},

{id:"CS115",ref:"5.13",type:"CS",kind:"Alınganlık",depth:"tam",basic:true,
 name:"Toplu kablo enjeksiyonu, impuls uyarımı",freq:[0,0,"Zaman alanı"],unit:"A (tepe)",coupling:"Kablo demetine impuls akımı",
 purpose:"EUT kablolarına kuplajlanan impuls sinyallere dayanımı doğrulamak.",
 applic:["Tüm hava, uzay ve kara sistemi ara bağlantı kabloları (güç kabloları dahil).","Yüzey gemisi ve denizaltı alt sistemleri için tedarik makamı belirtirse uygulanır."],
 limits:["Şekil CS115-1: tepe akım 5 A; yükselme ve düşme süresi ≤2 ns; darbe genişliği ≥30 ns; tekrar hızı 30 Hz; süre 1 dakika."],
 equipment:["pulse","inj","drive","cprobe","calfix","osc","att","load","lisn"],
 setup:["Temel test düzeni: Şekil 2–5 ve 4.3.8.","Kalibrasyon: Şekil CS115-2; enjeksiyon probunu kalibrasyon fikstürünün orta iletkeni etrafına yerleştirin; bir ucu koaksiyel yük, diğer ucu atenüatörle 50 Ω girişli osiloskopa bağlayın.","EUT testi: Şekil CS115-3; enjeksiyon ve izleme probları EUT konektörüne bağlı kablo demeti etrafında; izleme probu konektörden 5 cm, enjeksiyon probu izleme probundan 5 cm."],
 check:["Darbe üretecini yükselme süresi, darbe genişliği ve tekrar hızı için ayarlayın.","Kalibrasyon fikstüründe istenen akıma ulaşana kadar sinyali artırın; yükselme, düşme, darbe genişliği ve tekrar hızını doğrulayın (kesin darbe şekli indüktif kuplajdan dolayı birebir oluşmaz).","Darbe üreteci genlik ayarını kaydedin."],
 steps:["Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin; kalibrasyonu yapın.","EUT'yi açıp kararlı hale getirin.","Üreteci en az kalibrasyonda belirlenen genliğe ayarlayın; test sinyalini belirtilen tekrar hızı ve sürede uygulayın.","EUT performansını izleyin; alınganlık varsa 4.3.10.4.3'e göre eşik belirleyin.","Osiloskoptan kabloda indüklenen tepe akımı kaydedin.","Her konektöre bağlı her kablo demeti için ve güç iletkenlerini komple/dönüşsüz gruplayarak tekrarlayın."],
 data:["Her arayüz konektörü için uygunluk beyanı ve indüklenen akım seviyesi.","Belirlenen eşikler; enjekte edilen dalga biçimlerinin grafikleri."],
 special:["Test sinyali yalnızca kablo kaynaklı kuplaj için geçerlidir; impuls şekli probla kuplajdan dolayı kesin kopyalanmaz."],
 verify:[],inputs:[{id:"kablolar",label:"Test edilecek kablo demetleri",type:"textarea",req:true}]},

{id:"CS116",ref:"5.14",type:"CS",kind:"Alınganlık",depth:"tam",basic:true,
 name:"İletilen alınganlık, sönümlü sinüs geçicileri, kablolar ve güç hatları",freq:[1e4,1e8,"10 kHz – 100 MHz"],unit:"A (tepe)",coupling:"Kablo ve güç hatlarına sönümlü sinüs akımı",
 purpose:"EUT kablolarına ve güç hatlarına kuplajlanan sönümlü sinüs geçicilerine dayanımı doğrulamak.",
 applic:["10 kHz – 100 MHz; güç kabloları ve ayrı yüksek taraf güç hatları dahil tüm ara bağlantı kabloları. Güç dönüşleri ve nötrler tek tek test edilmeyebilir.","Denizaltı uygulamalarında yalnızca basınç gövdesi dışındaki veya gövdeden çıkan kablo ve hatlar için."],
 limits:["Şekil CS116-1 dalga biçimi, Şekil CS116-2 maksimum akım; test frekansları 0,01 – 0,1 – 1 – 10 – 30 – 100 MHz (platform rezonansı gibi kritik frekanslar varsa onlar da).","Tekrar hızı en fazla 1 darbe/sn, en az 2 sn'de 1 darbe; darbeler 5 dakika boyunca uygulanır.","Sönüm faktörü Q = 15 ± 5."],
 equipment:["dsg","inj","osc","calfix","cprobe","wfrec","att","rx","load","lisn"],
 setup:["Temel test düzeni: Şekil 2–5 ve 4.3.8.","Kalibrasyon (dalga biçimi doğrulaması): Şekil CS116-3.","EUT testi: Şekil CS116-4; enjeksiyon/izleme probları konektör kablo demeti etrafında; izleme probu konektörden 5 cm, enjeksiyon probu 5 cm."],
 check:["Üreteci 10 kHz'e ayarlayın; genliği gereken seviyeye getirin; ayarları kaydedin; dalga biçimini ve Q'yu hesaplayıp kaydedin.","Aynı adımları gereken her frekans için tekrarlayın."],
 steps:["Ekipmanı açıp kararlı hale gelmesini bekleyin; kalibrasyonu yapın.","EUT'yi açıp kararlı hale getirin.","Üreteci bir test frekansına ayarlayın; kalibre sinyalleri sırayla her kablo ve güç hattına uygulayın (gerekli akımı sağlamak için sinyal azaltılabilir).","Her konektör için komple kablo demetine ve her yüksek taraf güç hattına uygulayın; üçgen bağlantılı güç hatlarında her hattı ayrıca bulk kabloya ek olarak test edin.","EUT'yi izleyin; alınganlık varsa 4.3.10.4.3'e göre eşik belirleyin.","Tüm frekanslar ve demetler için tekrarlayın."],
 data:["Her kablo ve hat için test edilen frekans ve genlikler.","Belirlenen eşikler ve frekansları; her konektör için uygunluk göstergeleri.","Kalibre (Q değerli) ve enjekte edilen dalga biçimlerinin grafikleri."],
 special:["Q, ilk tepe akımının 50% sönüme en yakın periyottaki akıma oranının logaritmasından hesaplanır (Şekil CS116-1 notları)."],
 verify:["Şekil CS116-2 tepe akım değerleri"],
 inputs:[{id:"kablolar",label:"Test edilecek kablo demetleri ve güç hatları",type:"textarea",req:true},{id:"ekFrekans",label:"Platform rezonansı gibi ek kritik frekanslar",type:"text"}]},

{id:"CS117",ref:"5.15",type:"CS",kind:"Alınganlık",depth:"kısmi",basic:true,
 name:"İletilen alınganlık, yıldırım kaynaklı geçiciler, kablolar ve güç hatları",freq:[0,0,"Zaman alanı"],unit:"V / A (Tablo VII)",coupling:"Kablo ve güç hatlarına yıldırım geçici enjeksiyonu",
 purpose:"EUT kablolarına ve güç hatlarına kuplajlanan yıldırım kaynaklı geçicilere dayanımı doğrulamak.",
 applic:["Tüm emniyet kritik donanımın ara bağlantı kabloları (komple güç kabloları ve ayrı yüksek taraf güç hatları dahil).","Emniyet kritik fonksiyon yapan donanıma bağlı emniyet kritik olmayan donanım arayüzleri için de uygulanır; emniyet kritik olmayanlar için tedarik makamı belirtirse uygulanabilir.","Güverte üstünden kablo geçen yüzey gemisi donanımı için sınırlı uygulanır."],
 limits:["Tablo VII'deki seviyeler ve Şekil CS117-1…8 dalga biçimleri; platforma ait yıldırım verisi yoksa varsayılan değerlerdir, veri varsa tedarik makamı onayıyla uyarlanabilir.","Güç hatları ayrı ayrı ve demet içinde Tablo VII seviyelerinde test edilir.","Örnek (çoklu vuruş, birinci vuruş, WF2/WF1): iç donanım VL = 300 V (WF2), IT = 600 A (WF1); dış donanım VL = 750 V, IT = 1500 A. Diğer dalga biçimleri ve seviyeler için Tablo VII'ye bakın."],
 equipment:["ltg","injtr","osc","cprobe","att","vprobe","mloop","bigcap","lisn"],
 setup:["Temel test düzeni (Şekil 2–5, 4.3.8); LISN güç giriş tarafında DC için ≥28.000 µF (yüksek ile dönüş arası), AC için 10 µF (yüksek ve dönüş ile toprak düzlemi arası) kapasitör bulunmalıdır.","Kalibrasyon: Şekil CS117-9 (kısa devre akımı ve açık devre gerilimi doğrulaması).","EUT testi: Şekil CS117-10, -11 veya -12; enjeksiyon trafosu ve akım izleme probları konektör kablo demeti etrafında; akım probu konektörden 5–15 cm."],
 check:["Dalga biçimi doğrulaması (kısa devre akımı ve açık devre gerilimi) Şekil CS117-9 ile yapılır."],
 steps:["Ayrıntılı adımlar standardın 5.15.3.4 maddesinden alınmalıdır.","Test seviyeleri ve dalga biçimleri, ekipmanın kurulum alanına (iç/dış, kompozit gövde) göre Tablo VII'den seçilir."],
 data:["Madde 5.15.3.5'e göre."],special:["Tablo VII 'çoklu vuruş' ve 'çoklu patlama' satırlarını ayrı ayrı içerir."],
 verify:["Tablo VII seviyeleri, adımlar (5.15.3.4), veri sunumu"],
 inputs:[{id:"kurulum",label:"Kurulum alanı",type:"select",options:["İç ekipman","Dış ekipman","Kompozit gövde/yapıda yönlendirilmiş"],req:true},{id:"kablolar",label:"Test edilecek kablo demetleri ve güç hatları",type:"textarea",req:true}]},

{id:"CS118",ref:"5.16",type:"CS",kind:"Alınganlık",depth:"kısmi",basic:true,
 name:"İletilen alınganlık, kişi kaynaklı elektrostatik deşarj",freq:[0,0,"Zaman alanı"],unit:"kV",coupling:"ESD (temas / hava)",
 purpose:"EUT'nin, güç verilmiş durumda kişi kaynaklı elektrostatik deşarja dayanımını doğrulamak.",
 applic:["İnsan–makine arayüzü olan elektrikli, elektronik ve elektromekanik alt sistem ve donanım için; mühimmat ürünleri için uygulanmaz."],
 limits:["Tablo VIII seviyeleri, 150 pF kapasitörden 330 Ω dirençle deşarj; devre endüktansı ≤5 µH.","Seviye 1: ±2 kV hava; Seviye 2: ±4 kV hava; Seviye 3: ±8 kV temas/hava; Seviye 4: ±15 kV hava.","İletken yüzeylerde ±8 kV temas deşarjı gereklidir; hava deşarjı yalnızca temas uygulanamadığı yerlerde gereklidir."],
 equipment:["esd","esdv","esdt","osc","att20","gnd","ionizer"],
 setup:["Temel test düzeni: Şekil 2–5 ve 4.3.8.","Test noktaları: operatörün/kurucunun normal kullanımda eriştiği tüm nokta ve yüzeyler (kumanda/tuş takımı, anahtar, düğme, LED, ek yeri, ızgara, konektör kovanı vb.); en azından her yüz.","Kalibrasyon: 150 pF/330 Ω ağı ve hava ucu takılı; Şekil CS118-5 ile ESD generatörü gerilimini elektrostatik voltmetreyle doğrulayın (2 kV'ta ±%10; Tablo VIII'deki her seviye için).","Deşarj akımı doğrulaması: Şekil CS118-6 ile ESD akım hedefi, atenüatör ve osiloskop; Tablo IX değerleri (±8 kV temas: ilk tepe akım 30 A ±%15, yükselme süresi 0,6–1,0 ns, 30 ns'de 16 A ±%30, 60 ns'de 8 A ±%30)."],
 check:["Generatör gerilimi ve deşarj akımı doğrulamaları testten önce yapılıp kaydedilir (ayrıntı 5.16.3.3c)."],
 steps:["Ayrıntılı adımlar standardın 5.16.3.4 maddesinden alınmalıdır.","EUT güç verilmiş durumda test edilir; her uygun test noktasına Tablo VIII seviyelerinde deşarj uygulanır."],
 data:["Madde 5.16.3.5'e göre (deşarj uygulanan noktalar, seviyeler, sonuç ve EUT çalışma davranışı)."],
 special:["Deşarj sonrası EUT'nin ve yüzeyin boşaltılması için iyonlaştırıcı veya 1 MΩ direnç kullanılır."],
 verify:["Adımlar (5.16.3.4), Tablo X generatör özellikleri, uygulanacak seviye"],
 inputs:[{id:"esdSeviye",label:"ESD test seviyesi (Tablo VIII)",type:"select",options:["Seviye 1 (±2 kV hava)","Seviye 2 (±4 kV hava)","Seviye 3 (±8 kV temas/hava)","Seviye 4 (±15 kV hava)"],req:true},{id:"noktalar",label:"Test noktaları (kullanıcı erişimli yüzeyler)",type:"textarea",req:true}]},

{id:"RE101",ref:"5.17",type:"RE",kind:"Emisyon",depth:"tam",basic:true,
 name:"Yayılan emisyon, manyetik alan",freq:[30,1e5,"30 Hz – 100 kHz"],unit:"dBpT",coupling:"Manyetik alan (halka sensör)",
 purpose:"EUT ve elektrik arayüzlerinden yayılan manyetik alan emisyonlarının limitleri aşmadığını doğrulamak.",
 applic:["30 Hz – 100 kHz; donanım ve alt sistem kasaları ile elektrik kablo arayüzlerinden yayılan emisyon için; antenden yayılana uygulanmaz.","Deniz hava araçlarında yalnızca 30 Hz – 10 kHz'de çalışan ASW ekipmanı (Sonobuoy alıcısı, MAD) olan hava araçlarında."],
 limits:["Şekil RE101-1 ve RE101-2'deki seviyeler, 7 cm mesafede aşılmamalıdır."],
 equipment:["rx","rec","loopM","lisn","ohm","sg"],
 setup:["Temel test düzeni: Şekil 2–5 ve 4.3.8.","Sistem kontrolü: Şekil RE101-3. EUT testi: Şekil RE101-4."],
 check:["Limitin (limit eksi halka düzeltme faktörü) en az 6 dB altındaki kalibre sinyali 50 kHz'de uygulayın; alıcıyı 50 kHz'e ayarlayıp okuyun; enjekte seviyeyle ±3 dB uyumlu olmalı.","Ohmmetreyle halka sargı direncinin 5–10 Ω olduğunu doğrulayın."],
 steps:["Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin; sistem kontrolünü yapın.","EUT'yi açıp kararlı hale getirin.","Halka sensörü, ölçülen EUT yüzü veya elektrik arayüz konektöründen 7 cm uzağa; düzlemi EUT yüzlerine ve konektör eksenine paralel yerleştirin.","Maksimum yayılma frekanslarını bulmak için alıcıyı Tablo II ile tarayın.","Alıcıyı bu frekanslardan birine ayarlayıp sensörü 7 cm aralığı koruyarak yüz veya konektör etrafında gezdirin; maksimum yayılma noktasını belirleyin.","Maksimum noktada sensör düzlemini maksimum okuma verecek şekilde döndürüp kaydedin. Emisyon 7 cm'de limiti aşarsa mesafeyi artırın ve emisyon ile mesafeyi tedarik makamının değerlendirmesi için kaydedin (EUT 7 cm'de uyumlu olmalıdır).","200 Hz altında oktav başına en az iki, üzerinde oktav başına en az üç maksimum yayılma frekansı için tekrarlayın.","EUT'nin her yüzü ve her elektrik konektörü için tekrarlayın."],
 data:["Taramaların grafikleri ve her ölçüm frekansının tablosu (madde 5.17.3.5)."],
 special:["EUT 7 cm mesafede limite uymalıdır."],
 verify:["Şekil RE101-1 ve -2 limitleri"],
 inputs:[{id:"yuzeyler",label:"Taranacak EUT yüzleri ve konektörler",type:"textarea",req:true}]},

{id:"RE102",ref:"5.18",type:"RE",kind:"Emisyon",depth:"tam",basic:true,
 name:"Yayılan emisyon, elektrik alan",freq:[1e4,1.8e10,"10 kHz – 18 GHz"],unit:"dBµV/m",coupling:"Elektrik alan (anten)",
 purpose:"EUT kasaları ve tüm ara bağlantı kablolarından yayılan elektrik alan emisyonlarının limitleri aşmadığını doğrulamak.",
 applic:["Donanım ve alt sistem kasaları ile tüm ara bağlantı kabloları için. Kalıcı monte antenli donanımda verici temel frekansında ve gerekli bant genişliğinde uygulanmaz.","Frekans aralığı platforma göre: Kara 2 MHz – 18 GHz; yüzey gemisi, denizaltı, Kara/Deniz hava aracı ve uzay 10 kHz – 18 GHz; Hava Kuvvetleri hava aracı 2 MHz – 18 GHz."],
 limits:["Şekil RE102-1 … RE102-4. 30 MHz üzerinde limit hem yatay hem dikey polarizasyonda sağlanmalıdır."],
 equipment:["rx","rec","rod","bicon","horn1","horn2","sg","stub","lisn","gnd","shield"],
 setup:["Temel test düzeni: Şekil 1–5 ve 4.3.8. EUT, en yüksek yayılan yüzeyi test düzeni sınırının ön kenarına bakacak şekilde yönlendirilir.","Sistem kontrolü: Şekil RE102-5. EUT testi: antenlere göre ayrıntılı düzen.","Çubuk anten: karşı ağırlık (en az 60 cm kare) topraklanmaz (Şekil RE102-6). Uyum ağından yere giden koaksiyel kılıf, en fazla 10 cm fazla uzunlukla zemine bağlanır; kablo uzunluğunun ortasına yakın 20 MHz'de 20–30 Ω empedanslı ferrit boru konur.","Antenler test düzeni sınırının ön kenarından 1 m uzaklıkta; zemin düzleminden 120 cm yükseklikte. Hiçbir anten kısmı duvarlara 1 m'den, tavan ve zemine 0,5 m'den yakın olmamalı.","Anten konum sayısı: 200 MHz altında sınır yan kenarları ≤3 m ise bir konum (ortada); >3 m ise N = (kenar mesafesi/3) yukarı yuvarlanır (Şekil RE102-7). 200 MHz–1 GHz'de her EUT kasası ve kabloların ilk 35 cm'si anten 3 dB ışın genişliği içinde olmalı; 1 GHz ve üzerinde kasa ile kabloların ilk 7 cm'si."],
 check:["Sistem kontrol yolunu (Şekil RE102-5) kullanarak antenin koaksiyel ucundan veri çıkışına: 10,5 kHz (yalnız 10 kHz–2 MHz ölçümlerinde), 2,1 MHz, 12 MHz, 29,5 MHz (aktif çubuk), 197 MHz (biconical), 990 MHz (büyük horn), 17,5 GHz (küçük horn). Pasif uyum ağlı çubuklarda her bandın merkez frekansında.","Limitin (limit eksi anten faktörü) en az 6 dB altında kalibre sinyali anten bağlantı noktasına uygulayın; alıcı ±3 dB içinde olmalı; sapma varsa düzeltin.","Çubuk antende çubuk elemanı çıkarılıp, 10 pF (üretici talimatına göre) kapasitörle sinyal uyum ağına uygulanır (Şekil RE102-8); ticari kalibrasyon aparatı kullanılamaz.","Ölçüm yolu değiştiğinde (koaksiyel, ön yükselteç, alıcı portu) kontrol yenilenir."],
 steps:["Ortam gereksinimlerini (4.3.4) doğrulayın; gerektiğinde ortam grafiklerini alın.","Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin.","Sistem kontrolünü yapın.","Her anten için ilgili frekans aralığını Tablo II bant genişlikleri ve sürelerle tarayın; 30 MHz üzerinde hem yatay hem dikey polarizasyonda.","Gerekli tüm anten konumları için tekrarlayın (200 MHz altı ve üzeri için yukarıdaki kriterler).","Ölçüm yolu ve sonuçlar için 5.18.3.4d ve sonrasındaki maddelerdeki ayrıntıları takip edin."],
 data:["Madde 5.18.3.5'e göre grafikler, limit, anten konumları ve düzen fotoğrafları."],
 special:["Kalıcı monte antenli verici donanımda temel frekans ve gerekli bant genişliği muaftır.","Aktif çubuk antende aşırı yük önlemleri uygulanır (4.3.7.3)."],
 verify:["Şekil RE102-1…4 (platforma göre) ve 5.18.3.4d sonrası ölçüm adımları"],
 inputs:[{id:"anten",label:"Kullanılacak antenler (tip, model, anten faktörü sertifika tarihi)",type:"textarea",req:true},{id:"fUst",label:"Üst frekans sınırı",type:"select",options:["30 MHz","200 MHz","1 GHz","6 GHz","18 GHz"],req:true},{id:"tarama",label:"Alıcı türü",type:"select",options:["Adım ayarlı alıcı","Analog ayarlı alıcı","FFT alıcı"],req:true}]},

{id:"RE103",ref:"5.19",type:"RE",kind:"Emisyon",depth:"kısmi",basic:false,
 name:"Yayılan emisyon, anten sahte ve harmonik çıkışları",freq:[1e4,4e10,"10 kHz – 40 GHz"],unit:"dBc / dBm / RE102 limiti",coupling:"Verici antenleri (operasyonel anten)",
 purpose:"Vericilerin yayılan sahte ve harmonik emisyonlarının limitleri aşmadığını doğrulamak.",
 applic:["CE106'ya alternatif olarak, vericilerin kendi antenleriyle testinde kullanılabilir. Tercih edilen yöntem CE106'dır; aktif anten veya standart olmayan anten empedansı durumlarında RE103 tercih edilmelidir.","10 kHz – 40 GHz; verici bant genişliği veya temel frekansın ±%5'i (hangisi büyükse) içinde uygulanmaz. Başlangıç ve üst frekans kuralları CE106 ile aynıdır."],
 limits:["Verici modunda emisyonlar uygulanabilir RE102 limitini aşmıyorsa şart sağlanır.","Harmonikler (2. ve 3. hariç) ve diğer sahte emisyonlar temelden ≥80 dB aşağıda; 2. ve 3. harmonikler −20 dBm veya 80 dB aşağı (hangisi daha az bastırma gerektiriyorsa). Deniz gemilerinde 2.–3. için −20 dBm, diğerleri −40 dBm (görev çevrimi <%0,2 ise 0 dBm)."],
 equipment:["rx","att","txant","sg","pm","dummy"],
 setup:["Temel test düzenini korumak gerekmez.","Ölçüm sistemi kontrolü: Şekil RE103-1 veya RE103-2; EUT testi için ilgili şekil (ayrıntı 5.19.3.3b)."],
 check:["Şekil RE103-1/2'deki sinyal kontrol yolu ile ölçüm sistemi doğrulanır."],
 steps:["Ayrıntılı adımlar standardın 5.19.3.4 maddesinden alınmalıdır."],
 data:["Madde 5.19.3.5'e göre."],special:["Verici gücünün alıcıyı aşırı yüklememesi için rejeksiyon ağları ve atenüatör kullanılır."],
 verify:["Adımlar (5.19.3.4), düzen şekilleri"],
 inputs:[{id:"fTemel",label:"Verici temel frekansı / çalışma aralığı",type:"text",req:true},{id:"pTepe",label:"Verici tepe gücü",type:"text"}]},

{id:"RS101",ref:"5.20",type:"RS",kind:"Alınganlık",depth:"tam",basic:true,
 name:"Yayılan alınganlık, manyetik alan",freq:[30,1e5,"30 Hz – 100 kHz"],unit:"dBpT",coupling:"Manyetik alan (radyasyon halkası)",
 purpose:"EUT'nin yayılan manyetik alanlara dayanımını doğrulamak.",
 applic:["30 Hz – 100 kHz; donanım ve alt sistem kasaları ile elektrik kablo arayüzleri için; anten kuplajı için uygulanmaz.","Kara Kuvvetleri ve Deniz kara donanımında yalnızca mayın tarama veya mayın tespit kabiliyetli araçlar için.","Deniz gemileri ve denizaltılarda yalnızca çalışma frekansı ≤100 kHz ve duyarlılığı 1 µV veya daha iyi olan donanım için.","Deniz hava araçlarında yalnızca ASW kabiliyetli hava araçları ve elektromanyetik fırlatma sistemiyle fırlatılabilen dış donanım için."],
 limits:["EUT, Şekil RS101-1 ve RS101-2'deki manyetik alanlara maruz kalırken malfunction, performans bozulması veya tolerans dışı sapma göstermemelidir."],
 equipment:["sg","loopR","loopS","volt","cprobe","lisn"],
 setup:["Temel test düzeni: Şekil 2–5 ve 4.3.8.","Kalibrasyon: Şekil RS101-3 (radyasyon halkası ve halka sensör). EUT testi: Şekil RS101-4.","Radyasyon halkası: 12 cm çap, 20 sarım, No.12 yalıtımlı bakır; 5 cm uzaklıkta akım başına 9,5×10⁷ pT. Halka sensör: 4 cm çap, 51 sarım, 7-41 Litz, elektrostatik ekranlı."],
 check:["Kaynağı 1 kHz'e ayarlayın; ölçüm alıcısı A okuması ve halka ilişkisiyle 110 dBpT manyetik akı yoğunluğu sağlayın.","Halka sensör çıkışını ölçüm alıcısı B ile ölçün; antenfaktörüne göre beklenen değerle ±3 dB uyumlu olduğunu doğrulayıp kaydedin."],
 steps:["Ekipmanı açıp kararlı hale gelmesini bekleyin; kalibrasyonu yapın.","EUT'yi açıp kararlı hale getirin.","Halkayı, probe edilen EUT yüzü veya konektörden 5 cm uzağa; düzlemi EUT yüzlerine ve konektör eksenine paralel yerleştirin.","Halkaya, limitin en az 10 dB üzerinde ama 15 A'yı (183 dBpT) geçmeyecek manyetik alan üretecek akım verin.","Tablo III'teki hızlarla uygulanabilir frekans aralığını tarayın.","Alınganlık görülürse maksimum belirti olan frekanslarda oktav başına en az üç test frekansı seçin; halkayı EUT'nin her yüzündeki her 30×30 cm alana ve her elektrik konektörüne taşıyarak tekrarlayın.","Toplanan verilerden oktav başına üç frekans seçip, her birinde limite karşılık gelen akımı uygulayarak EUT'yi izleyin (ayrıntı 5.20.3.4c(3) ve sonrası)."],
 data:["Madde 5.20.3.5'e göre."],special:["Alternatif yöntem: AC Helmholtz bobini (5.20.4)."],
 verify:["Şekil RS101-1 ve -2 limitleri; 5.20.3.4c(3) sonrası adımlar"],
 inputs:[{id:"yuzeyler",label:"Test edilecek EUT yüzleri ve konektörler",type:"textarea",req:true}]},

{id:"RS103",ref:"5.21",type:"RS",kind:"Alınganlık",depth:"tam",basic:true,
 name:"Yayılan alınganlık, elektrik alan",freq:[2e6,4e10,"2 MHz – 40 GHz"],unit:"V/m",coupling:"Elektrik alan (verici anten)",
 purpose:"EUT ve ilişkili kablolamanın elektrik alanlara dayanımını doğrulamak.",
 applic:["Donanım ve alt sistem kasaları ile tüm ara bağlantı kabloları için.","2–30 MHz: Kara Kuvvetleri ve Deniz için zorunlu, diğerleri için isteğe bağlı (tedarik spesifikasyonunda belirtilirse).","30 MHz – 18 GHz: tümü için. 18–40 GHz: tümü için isteğe bağlı (tedarik spesifikasyonunda belirtilirse).","Kara Kuvvetleri ve Hava Kuvvetleri'nde anten bağlantılı alıcıların ayarlı frekansında gereksinim yoktur."],
 limits:["Alan seviyeleri Tablo XI'den (aşağıya bakın), 1 kHz darbe modülasyonu, %50 görev çevrimi ile.","30 MHz'e kadar dikey polarizasyon; 30 MHz üzerinde hem yatay hem dikey. Dairesel polarizasyon kabul edilmez.","Kalıcı bağlı antenli yalnızca alıcı EUT'lerde, alıcı bandı içinde azalmış performansa izin verilir; alan maruziyetinden sonra performans karşılanmalıdır."],
 equipment:["sg","pa","txant","efs","rx","pm","dc","att","rec","lisn","shield"],
 setup:["Temel test düzeni: Şekil 1–5 ve 4.3.8; ekipman düzeni Şekil RS103-1.","Antenler test düzeni sınırından ≥1 m uzakta. 2–200 MHz'de sınır ≤3 m ise anten kenarlar arasında ortada; >3 m ise N = (mesafe/3) yukarı yuvarlanmış (Şekil RS103-3). 200 MHz ve üzerinde çoklu konum gerekebilir (Şekil RS103-2): 200 MHz–1 GHz'de her EUT kasası ve kabloların ilk 35 cm'si; 1 GHz üstünde kasa ve kabloların ilk 7 cm'si anten 3 dB ışın genişliği içinde olmalı.","Elektrik alan sensörleri antenle aynı uzaklıkta, test düzeni sınırının antene en yakın kenarı düzleminde, antenin tam karşısında; 1 GHz altında zemin düzleminden en az 30 cm yukarıda; 1 GHz üstünde aydınlatılan EUT alanına denk yükseklikte. Köşe ve kenarlara yerleştirmeyin."],
 check:["Alan, sensör referans noktasında; uygulanabilir limit seviyesine ayarlanarak ileri güç değerleri tespit edilir (kalibrasyon/alan doğrulaması; ayrıntı için standarttaki şekillere ve 5.21.3.4'e bakın).","Alan sensörünün temel frekanstan okuma yaptığını (harmoniklerden değil) doğrulayın."],
 steps:["EUT ve ekipmanı açıp kararlı hale gelmesini bekleyin.","Test alanını RF tehlikeleri açısından değerlendirin ve personel emniyeti için önlem alın (DoDI 6055.11 maruziyet sınırları).","Verici anten dikey polarizasyonda: sinyal kaynağını 1 kHz darbe modülasyonu, %50 görev çevrimi ile ayarlayın; modülasyonun sürücü sinyalde olduğunu doğrulayın (tepe–taban en az 40 dB). Test başlangıç frekansında alanı kademeli olarak limit seviyesine çıkarın.","Gereken frekans aralıklarını Tablo III hızları ve sürelerine göre tarayın; alan şiddetini limitte tutup EUT performansını izleyin.","Alınganlık varsa 4.3.10.4.3'e göre eşik seviyesini belirleyin.","30 MHz üzerinde yatay polarizasyonda tekrarlayın.","Gerekli her verici anten konumu için tekrarlayın."],
 data:["Test edilen frekans aralıklarını ve alan seviyelerini gösteren grafik/tablo.","Modüleli dalga biçimlerinin eşdeğer tepe algılaması için sensör okuma düzeltme faktörleri.","Belirlenen eşikler; düzen fotoğrafları ve ölçüleri."],
 special:["Alternatif yöntem: reverberasyon odası (mod-tuned), 200 MHz – 40 GHz; mod sayısı N<100 olan frekanslarda oda kullanılmaz (5.21.4).","RF maruziyet güvenliği zorunludur."],
 verify:["Alan kalibrasyon/doğrulama adım ayrıntıları (Şekil RS103-1…3 ve 5.21.3.4)"],
 table:"RS103",
 inputs:[ENV_INPUT,{id:"fUstRS",label:"Üst frekans sınırı (RS103)",type:"select",options:["1 GHz","2 GHz","6 GHz","18 GHz","40 GHz"],req:true},{id:"yuzler",label:"Test edilecek EUT yüzleri",type:"text",req:true}]},

{id:"RS105",ref:"5.22",type:"RS",kind:"Alınganlık",depth:"tam",basic:false,
 name:"Yayılan alınganlık, geçici elektromanyetik alan",freq:[0,0,"Zaman alanı"],unit:"V/m (tepe)",coupling:"Geçici alan (TEM hücre)",
 purpose:"EUT kasasının geçici (EMP benzeri) elektromanyetik alana dayanımını doğrulamak.",
 applic:["Dış elektromanyetik ortama maruz kalan donanım ve alt sistem kasaları için; yüzey gemilerinde dış, güverte üstü ve açıkta güverte altı kurulumlar.","Kara Kuvvetleri hava araçlarında dış kurulumlu emniyet kritik donanım için."],
 limits:["Şekil RS105-1 dalga biçimi: E(t) = E01·k1·(e^(−a1·t) − e^(−b1·t)); E01 = 5×10⁴ V/m (50 kV/m), a1 = 4×10⁷ s⁻¹, b1 = 6×10⁸ s⁻¹, k1 = 1,3.","En az 5 darbe, dakikada en fazla 1 darbe hızıyla uygulanır."],
 equipment:["tem","tpg","sosc","hvp","bdot","lisn"],
 setup:["Temel test düzenini korumak gerekmez; açık radyatör kullanılırsa aşırı dikkat edin.","Kalibrasyon: Şekil RS105-2; EUT yokken B-dot veya D-dot sensörü, EUT ön yüzünün konacağı dikey düzlemdeki beş noktalı ızgaranın merkezine konur; yüksek gerilim probu darbe üretecinin çıkışında, radyasyon sistemi girişine bağlanır.","EUT testi: Şekil RS105-3; EUT merkez ekseni radyasyon sisteminin çalışma hacminin merkezinde; kullanılabilir hacim (h/3, B/2, A/2) aşılmamalı."],
 check:["Darbeyi üretip alanı B-dot/D-dot ile ölçün; tepe genlik, yükselme süresi ve darbe genişliği şartları sağlanmalı: yükselme süresi (10–90%) 1,8–2,8 ns; FWHM darbe genişliği 23 ns ± 5 ns; her ızgara noktasında tepe alan limitin 0–6 dB üzerinde.","Diğer dört ızgara noktası için tekrarlayın; beş noktayı aynı anda sağlayan darbe üreteci ayarını belirleyin."],
 steps:["Ölçüm ekipmanını açıp kararlı hale gelmesini bekleyin; kalibrasyonu yapın.","EUT'yi açıp kararlı hale getirin; mümkün olduğunda ortogonal yönlerde test edin.","Darbeyi kalibrasyonda bulunan genliğin %10'undan başlatıp, 2 veya 3'lük adımlarla gereken seviyeye çıkarın; dalga biçiminin 5.22.3.4b(2) özelliklerine uyduğunu doğrulayın.","Gerekli sayıda darbeyi dakikada en fazla 1 hızla uygulayın; her darbe sırasında ve sonrasında EUT'yi izleyin.","Belirtilen seviyenin altında malfunction olursa testi sonlandırıp seviyeyi kaydedin; alınganlık varsa 4.3.10.4.3'e göre eşik belirleyin."],
 data:["EUT yönelimi ve kablo fotoğrafları; EUT konfigürasyon tarifi.","Her EUT yönelimi için bir darbenin tepe, yükselme ve genişliğini gösteren osiloskop kayıtları; darbe numaraları.","Her arıza için toparlanma süresi."],
 special:["Yüksek gerilimler ölümcül olabilir."],
 verify:[],inputs:[{id:"yonelim",label:"EUT yönelimleri",type:"text",req:true}]}
];


/* ===== Kullanıcıya yönelik ipuçları ve bilgilendirme ===== */
const HELP={
 proje:"Testin yapıldığı proje veya sözleşmenin adı. Prosedürün ve test raporunun kimliğinde görünür.",
 dokNo:"Kurumunuzun doküman numaralandırma kuralına göre verilen numara. Bilmiyorsanız boş bırakabilirsiniz.",
 eutAd:"EUT (Equipment Under Test), test edilen cihazdır. Adını sözleşme veya spesifikasyondaki gibi yazın.",
 eutPN:"Cihazın parça numarası. Rapor izlenebilirliği için yazılır.",
 eutSN:"Test edilen cihazın seri numarası. Aynı model birden fazla cihaz varsa hangisinin test edildiğini gösterir.",
 platform:"Cihazın kurulacağı platform (uçak, gemi, kara aracı vb.). Standart hangi testin uygulanacağını bu seçime göre belirler (Tablo V). Seçince test düğmelerinde A / L / S durumu görünür.",
 guc:"Cihazın aldığı güç türü. CE101, CE102 ve CS101'de limitler, LISN seçimi ve düzen buna bağlıdır.",
 gucNot:"Akım, faz sayısı ve güç hattı sayısı gibi ayrıntılar. Özellikle DC gemi/denizaltı CE101 limiti yük akımına bağlıdır.",
 modlar:"Cihazın çalışma modları. Test, en çok emisyon veren veya en kolay etkilenen modda yapılmalıdır; mühendisle birlikte karar verin.",
 limitKaynak:"Standart limitleri 'temel' değerler olarak verir; sözleşme veya ICD bunları değiştirebilir (uyarlama, tailoring). Burada test için geçerli son değeri veya şekil numarasını yazın.",
 performans:"Alınganlık testlerinde 'geçti/kaldı' kararı, cihazın hangi fonksiyonunun izleneceğine ve ne kadar sapmanın kabul edileceğine bağlıdır. Bu bilgi cihaz spesifikasyonundan alınır.",
 lab:"Testin yapılacağı laboratuvarın adı.",
 muh:"Prosedürü kontrol edip onaylayacak test mühendisi.",
 tarih:"Testin planlanan tarihi.",
 tailor:"Standarttan sapma veya sözleşmedeki uyarlamaları buraya yazın (örn. 'RE102 üst sınır 1 GHz'e indirildi'). Prosedüre notu olarak eklenir.",
 hatlar:"Ölçülecek güç hatları. Standart, dönüşler dahil her giriş güç hattının ayrı ayrı ölçülmesini ister (örn. +28 V ve 28 V dönüş).",
 yukAkim:"DC gemi/denizaltı CE101 limiti yük akımına göre gevşetilir (3 A üstünde 20·log(I/3) kadar). Nominal yük akımını yazın.",
 tarama:"Alıcı türü (adım ayarlı, analog veya FFT). Tablo II'deki bekleme ve ölçüm süreleri seçime göre değişir.",
 faz:"CS101 düzeni güç şebekesine göre değişir (tek faz/DC, üç faz yıldız veya üçgen).",
 izleme:"Test sırasında cihazın neresinden ne izleneceği (örn. çıkış gerilimi, veri hattı hata sayacı). Alınganlıkta karar bu izlemeye dayanır.",
 ortam:"Cihazın platform içindeki konumu (dışarıda mı, içeride mi, hangi güverte). CS114 eğrisi ve RS103 alan seviyesi tabloda bu sütuna göre okunur.",
 kablolar:"Cihazın konektörlerine bağlı kablo demetlerinin listesi. CS testlerinde her konektöre bağlı her demet ayrı test edilir; güç kabloları ayrıca gruplanır.",
 fTemel:"Vericinin temel çalışma frekansı veya aralığı. CE106 ve RE103'te bu bandın ±%5'i kadar alan test dışıdır.",
 pTepe:"Verici tepe gücü. Gemilerde dışlama bandının genişliği ve ölçüm ekipmanının koruması buna bağlıdır.",
 calisma:"CS109 yalnızca çalışma frekansı ≤100 kHz ve duyarlılığı 1 µV veya daha iyi cihazlara uygulanır; bu bilgileri yazın.",
 kurulum:"CS117 seviyeleri cihazın iç mi dış mı kurulduğuna (ve kompozit yapı olup olmadığına) göre Tablo VII'den seçilir.",
 esdSeviye:"CS118 seviyeleri Tablo VIII'dedir (Seviye 1: ±2 kV hava … Seviye 4: ±15 kV hava). Sözleşme hangi seviyeyi istiyorsa onu seçin.",
 noktalar:"Operatörün veya kurucunun normal kullanımda dokunabildiği yüzeyler (tuş takımı, anahtar, LED, konektör kovanı vb.). ESD bu noktalara uygulanır.",
 yuzeyler:"Taranacak cihaz yüzleri ve konektörler. Manyetik alan testlerinde her yüz ve her elektrik konektörü ayrı taranır.",
 anten:"RE102'de kullanılacak anten tipleri ve anten faktörü kalibrasyon bilgisi. Frekans bandına göre çubuk, biconical ve horn antenleri kullanılır.",
 fUst:"RE102 üst frekans sınırı. Cihazın en yüksek çalışma frekansına ve platform aralığına göre seçilir.",
 fUstRS:"RS103 üst frekans sınırı. 18–40 GHz isteğe bağlıdır; sözleşme belirtirse seçilir.",
 yuzler:"Alan uygulanacak cihaz yüzleri. Her yüz, ışınlanan alanın anten ışın genişliği içinde kalacak şekilde test edilir.",
 yonelim:"RS105'te cihaz mümkünse birbirine dik yönelimlerde test edilir; kullanılacak yönelimleri yazın.",
 alici:"CS103/104/105 alıcı ön uç testleridir; alıcı tipi ve çalışma frekansları prosedürü belirler (Ek A).",
 ekFrekans:"CS116'da platformun rezonans frekansı gibi kritik frekanslar varsa, standart listesine ek olarak test edilir."
};
const helpFor=(t,i)=>HELP[t.id+"."+i.id]||HELP[i.id]||"";

const GLOSSARY=[
 ["EUT","Equipment Under Test: test edilen cihaz veya alt sistem."],
 ["Emisyon / Alınganlık","Emisyon (CE, RE): cihazın çevreye yaydığı girişim. Alınganlık (CS, RS): cihazın dışarıdan gelen girişimden etkilenmemesi."],
 ["CE, CS, RE, RS","C: iletilen (kablo üzerinden), R: yayılan (havadan); E: emisyon, S: alınganlık (susceptibility). Örn. CE102 = iletilen emisyon."],
 ["Uygulanabilirlik (A / L / S)","Tablo V'te A: uygulanır, L: ilgili maddedeki koşullarla sınırlı, S: tedarik makamı sözleşmede belirtirse uygulanır, boş: uygulanmaz."],
 ["Uyarlama (tailoring)","Standart limitlerini veya seviyelerini sözleşmeye göre değiştirmek. Bu yazılımda 'Uygulanacak limit/seviye' alanı bu içindir."],
 ["LISN","Line Impedance Stabilization Network: güç hattına seri bağlanan, ölçüm için sabit empedans sağlayan ve dış gürültüyü ayıran devre."],
 ["Topraklama düzlemi","Test düzeninin üzerine kurulduğu metal yüzey. Standart en az 2,25 m² ve kısa kenarı en az 76 cm ister."],
 ["Ortam seviyesi (ambient)","EUT kapalıyken ölçülen ortam girişimi. Limitin en az 6 dB altında olmalıdır; aksi halde ölçüm geçerli olmaz."],
 ["dBµV, dBµA, dBpT, dBµV/m","Gerilim, akım, manyetik akı yoğunluğu ve elektrik alan şiddetinin logaritmik birimleri. Limitler bu birimlerle verilir."],
 ["6 dB bant genişliği","Alıcının ölçüm penceresi. Tablo II frekansa göre hangi bant genişliğinin kullanılacağını belirler."],
 ["Bekleme / ölçüm süresi","Adım ayarlı alıcıda her frekansta beklenecek en az süre; analog taramada tarama hızı. Çok hızlı taramak emisyonu kaçırır."],
 ["Ölçüm sistemi kontrolü","Teste başlamadan, bilinen bir sinyalle ölçüm zincirinin doğru okuduğunu doğrulamak. Sapma ±3 dB'yi aşarsa düzeltilmeden test yapılmaz."],
 ["Enjeksiyon probu","Kablo demetinin etrafına takılıp içine RF akım indükleyen halka. CS114, CS115 ve CS116'da kullanılır."],
 ["Kalibrasyon fikstürü","Enjeksiyon probunun, 50 Ω'luk bilinen bir hatta kalibre edildiği düzenek."],
 ["Modülasyon (1 kHz darbe, %50)","CS114 ve RS103'te uygulanan test sinyalinin biçimi: 1 kHz'lik darbe, %50 görev çevrimi. Cihazın tepkisini ortaya çıkarmak için kullanılır."],
 ["Performans kriteri","Alınganlıkta cihazın hangi sapmaya kadar normal sayılacağı. Cihaz spesifikasyonundan gelir; standart bunu belirlemez."],
 ["Eşik (threshold) belirleme","Alınganlık görülürse girişimi azaltıp kademeli artırarak cihazın tepki verdiği en düşük seviyeyi bulmak (madde 4.3.10.4.3)."],
 ["Anten faktörü","Antenin ölçtüğü alanı alıcının okuduğu gerilime çevirmek için eklenen düzeltme; kalibrasyon sertifikasında bulunur."],
 ["Karşı ağırlık (counterpoise)","RE102'de çubuk antenin altına konan metal levha (en az 60 cm kare)."]
];

function sectionTips(t){
  const n=t.ref,short=["CS103","CS104","CS105"].includes(t.id);
  return {
   1:"Bu bilgiler raporun kimliğidir. Eksik bırakılırsa prosedür izlenemez.",
   2:short?`Standartta ilgili madde ${n} ve Ek A.${n}'dir.`:`Standartta ${n}.3.1 (Purpose). Testin neyi doğruladığını söyler.`,
   3:short?`Standartta ${n} (uygulanabilirlik) ve Tablo V. Bu test platformunuza uygulanmıyorsa gerisi gereksizdir.`:`Standartta ${n}.1 (Applicability) ve Tablo V. Önce bu testin platformunuz için gerekli olup olmadığına bakılır; L ve S durumlarında sözleşmeden ek karar gerekir.`,
   4:"EUT bilgileri ve cihazın çalışma modları. Test, en kötü durumu üreten moda göre yapılır.",
   5:short?"Ekipman bu testte vaka bazında belirlenir.":`Standartta ${n}.3.2 (Test equipment). Model, seri no ve kalibrasyon tarihini laboratuvar doldurur; kalibrasyonu geçmiş cihaz kullanılamaz.`,
   6:"Tüm testler için ortak kurallar standardın 4.3 maddesindedir; her test maddesinde yeniden yazılmaz.",
   7:short?"Düzen vaka bazında belirlenir.":`Standartta ${n}.3.3 (Setup). Şekil numaralarına bakarak düzeni kurun; EUT yerleşimi ve kablo yönlendirmesi sonucu doğrudan etkiler.`,
   8:"Test başlamadan ölçüm zincirinin doğru çalıştığı kanıtlanır. Bu adım geçilmezse test geçersiz sayılır.",
   9:short?"Adımlar Ek A'dan türetilir.":`Standartta ${n}.3.4 (Procedures). Adımlar sırayla ve eksiksiz izlenmelidir.`,
   10:short?"Limit bireysel tedarik spesifikasyonunda verilir.":`Standartta ${n}.2 (Limits) ve ilgili şekiller. Hangi eğrinin geçerli olduğu platforma ve sözleşmeye göre belirlenir.`,
   11:short?"":`Standartta ${n}.3.5 (Data presentation). Raporda hangi grafik ve kayıtların bulunacağını söyler.`,
   12:t.kind==="Emisyon"?"Emisyonda karar basittir: ölçülen seviye limitin altında mı?":"Alınganlıkta karar, cihazın izlenen fonksiyonunun test boyunca bozulup bozulmadığına göre verilir.",
   13:"Güvenlik uyarıları, muafiyetler ve standardın özel notları.",
   14:"Yazılımın standarttan otomatik çıkaramadığı maddelerdir; test mühendisi bu maddeleri standart metninden kontrol eder.",
   15:"Hazırlayan, kontrol eden test mühendisi ve onaylayan imzalar."
  };
}

const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const state={tab:"gen",testId:"RE102",vals:{},cmpA:"RE102",cmpB:"RS103"};
let persist=function(){};
const getTest=id=>TESTS.find(t=>t.id===id);
const isCommon=id=>COMMON_INPUTS.some(c=>c.id===id);
function allInputs(t){return{common:COMMON_INPUTS.filter(i=>i.scope==="all"||i.scope===t.kind),specific:t.inputs};}
function getVal(t,i){return((isCommon(i.id)?state.vals[i.id]:state.vals[t.id+"."+i.id])||"").toString().trim();}
function setVal(t,i,v){if(isCommon(i.id))state.vals[i.id]=v;else state.vals[t.id+"."+i.id]=v;persist();}
function missing(t){const{common,specific}=allInputs(t);return[...common,...specific].filter(i=>i.req&&!getVal(t,i));}
function platIdx(){return PLATFORMS.indexOf((state.vals.platform||"").trim());}
function statusFor(t){const p=platIdx();return p<0?null:MX[p][t.id];}
function fmtHz(h){return h>=1e9?(h/1e9)+" GHz":h>=1e6?(h/1e6)+" MHz":h>=1e3?(h/1e3)+" kHz":h+" Hz";}

/* ===== Prosedür üretici ===== */
function buildMD(t,hints){
  const all=[...COMMON_INPUTS,...t.inputs];
  const g=id=>{const i=all.find(x=>x.id===id);const v=getVal(t,i);return v||`⟦GİRİLMELİ: ${i.label}⟧`;};
  const o=id=>{const i=all.find(x=>x.id===id);return getVal(t,i)||"—";};
  const L=[];const bl=a=>a.forEach(x=>L.push("- "+x));
  const p=platIdx();
  L.push(`# ${t.id} Test Prosedürü Taslağı`);
  L.push(`**${t.name}**`);
  L.push(`Referans: MIL-STD-461G, madde ${t.ref}. Bu doküman taslaktır; test mühendisi tarafından standart metniyle karşılaştırılıp onaylanmadan kullanılamaz.`);
  if(t.depth==="kısmi") L.push(`**Not:** ${t.id} için bu taslakta standardın bazı alt maddeleri (ayrıntılı adımlar, şekiller veya vaka bazlı kısımlar) özetlenmiştir. Bölüm 14'teki maddeler standarttan tamamlanmalıdır.`);
  L.push(`## 1. Doküman bilgileri`);
  L.push(`| Alan | Değer |\n|---|---|`);
  L.push(`| Proje / sözleşme | ${g("proje")} |`);
  L.push(`| Doküman no | ${o("dokNo")} |`);
  L.push(`| Test laboratuvarı | ${o("lab")} |`);
  L.push(`| Test mühendisi | ${o("muh")} |`);
  L.push(`| Planlanan tarih | ${o("tarih")} |`);
  L.push(`## 2. Amaç`);L.push(t.purpose);
  L.push(`## 3. Kapsam ve uygulanabilirlik`);
  L.push(`- Test türü: ${t.kind}; frekans/alan: ${t.freq[2]}; bağlantı: ${t.coupling}.`);
  const st=statusFor(t);
  if(p<0) L.push(`- Platform durumu (Tablo V): ⟦GİRİLMELİ: Kurulum platformu⟧`);
  else L.push(`- Platform: ${PLATFORMS[p]}. Tablo V durumu: ${st?st+" – ":""}${STATUS_TXT[st]}.`);
  bl(t.applic);
  if(t.id==="RE102"&&p>=0){const r=[0,1,2,3,5].includes(p)?"10 kHz – 18 GHz":"2 MHz – 18 GHz";L.push(`- Seçilen platform için RE102 frekans aralığı: ${r} (madde 5.18.1).`);}
  if(t.id==="RS103"&&p>=0){const s=SERVICE_OF[p];L.push(`- 2–30 MHz bölümü: ${(s==="A"||s==="N")?"Kara Kuvvetleri ve Deniz için zorunlu":"isteğe bağlı (tedarik spesifikasyonunda belirtilirse)"}; 18–40 GHz isteğe bağlıdır (madde 5.21.1).`);}
  L.push(`## 4. Test edilecek öğe (EUT)`);
  L.push(`| Alan | Değer |\n|---|---|`);
  L.push(`| EUT adı | ${g("eutAd")} |`);
  L.push(`| Parça no / seri no | ${o("eutPN")} / ${o("eutSN")} |`);
  L.push(`| Güç girişi | ${g("guc")}${o("gucNot")==="—"?"":" ("+o("gucNot")+")"} |`);
  L.push(`| Çalışma modları | ${g("modlar")} |`);
  t.inputs.forEach(i=>L.push(`| ${i.label} | ${g(i.id)} |`));
  L.push(`## 5. Ekipman listesi`);
  if(t.equipment.length){
    L.push(`| Ekipman | Gereksinim | Model / seri no | Kalibrasyon geçerlilik |\n|---|---|---|---|`);
    t.equipment.forEach(k=>{const e=EQ[k];L.push(`| ${e[0]} | ${e[1]||"—"} | ____ | ____ |`);});
    L.push(`Birincil ölçüm cihazları ve aksesuarları ISO/IEC 17025 veya ISO 10012'ye göre kalibre edilmelidir (madde 4.3.11).`);
  } else L.push(`Ekipman listesi bu test için standartta vaka bazında belirlenir (Ek A).`);
  L.push(`## 6. Genel test koşulları`);
  if(t.basic){
    bl([`Ortam: EUT kapalı ve yardımcı ekipman açıkken ölçülen ortam elektromanyetik seviyesi, ekranlı odada limitin en az 6 dB altında olmalıdır (4.3.4).`,
    `Topraklama düzlemi: gerçek kurulumu temsil etmeli; bilinmiyorsa metalik düzlem. En az 2,25 m², kısa kenar en az 76 cm; ekranlı oda zeminine en az her 1 m'de bağlı, bağlantı direnci ≤2,5 mΩ (4.3.5).`,
    `Güç empedansı: EUT giriş güç hatları LISN ile kontrol edilir; LISN çıkış güç hatlarında kullanılmaz; LISN, bağlantı direnci ≤2,5 mΩ ile toprak düzlemine bağlıdır (4.3.6).`,
    `Kablolama: kurulumu simüle eder; her ara bağlantı kablosunun en az ilk 2 m'si sınırın ön kenarına paralel serilir; kalan kısım arkaya zikzak yönlendirilir; kablolar zeminden 5 cm yukarıda iletken olmayan malzemeyle desteklenir; kablolar arası 2 cm; ön kenara en yakın kablo topraklama düzlemi ön kenarından 10 cm içeride (4.3.8.6.1).`,
    `Giriş güç hatları: 2 m'si ön kenara paralel serilir; her hat (nötr ve dönüşler dahil) bir LISN'e bağlanır. Kurulumda kabloya bağlı güç hatları demetten ayrılıp LISN'lere yönlendirilir. Birincil güç hatları, dönüşler ve toprak telleri ekranlanmaz (4.3.8.6.2).`,
    `Kablo ekranları yalnızca kurulum gerekliliklerinde belirtilmişse kullanılır (4.3.8.6).`]);
  } else L.push(`Bu test için temel test düzeninin (Şekil 2–5) korunması gerekmez; ayrıntı bölüm 7'dedir. Ortam seviyesi limitin en az 6 dB altında olmalıdır (4.3.4).`);
  L.push(`## 7. Test düzeni`);bl(t.setup);
  L.push(`## 8. Ölçüm sistemi doğrulaması / kalibrasyon`);
  if(t.check.length)bl(t.check);else L.push(`Bu test için standartta vaka bazında belirlenir.`);
  if(t.kind==="Emisyon"&&t.freq[0]>0){
    L.push(`### Alıcı bant genişliği ve ölçüm süresi (Tablo II)`);
    L.push(`| Frekans aralığı | 6 dB bant genişliği | Min. bekleme (adım ayarlı) | Min. ölçüm süresi (analog) |\n|---|---|---|---|`);
    TABLE_II.filter(r=>r[1]>t.freq[0]&&r[0]<t.freq[1]).forEach(r=>L.push(`| ${fmtHz(r[0])} – ${fmtHz(r[1])} | ${r[2]} | ${r[3]} | ${r[4]} |`));
    L.push(`Video filtresi kullanılmaz; daha geniş bant genişlikleri kullanılabilir ancak bant genişliği düzeltme faktörü uygulanmaz (4.3.10.3.1).`);
  }
  if(t.kind==="Alınganlık"&&t.freq[0]>0){
    L.push(`### Frekans tarama hızları (Tablo III)`);
    L.push(`| Frekans aralığı | Analog tarama (maks. hız) | Adımlı tarama (maks. adım) |\n|---|---|---|`);
    TABLE_III.filter(r=>r[1]>t.freq[0]&&r[0]<t.freq[1]).forEach(r=>L.push(`| ${fmtHz(r[0])} – ${fmtHz(r[1])} | ${r[2]} | ${r[3]} |`));
  }
  L.push(`## 9. Test adımları`);t.steps.forEach((s,i)=>L.push(`${i+1}. ${s}`));
  L.push(`## 10. Limitler`);bl(t.limits);
  if(t.table==="CS114"||t.table==="RS103"){
    const ei=ENVS.indexOf(getVal(t,ENV_INPUT));const sv=p>=0?(SERVICE_OF[p]==="ALL"?"A":SERVICE_OF[p]):null;
    const tab=t.table==="CS114"?CS114_TAB:RS103_TAB;
    L.push(`### ${t.table==="CS114"?"Tablo VI (CS114 limit eğrisi)":"Tablo XI (RS103 alan seviyesi, V/m)"}`);
    if(ei<0||!sv){L.push(`⟦GİRİLMELİ: Kurulum platformu ve kurulum ortamı⟧`);}
    else{
      L.push(`Seçim: ${PLATFORMS[p]}; ortam: ${ENVS[ei]}; Tablo satırı: ${sv==="A"?"Kara Kuvvetleri (A)":sv==="N"?"Deniz (N)":"Hava Kuvvetleri (AF)"}.`);
      L.push(`| Frekans aralığı | Değer |\n|---|---|`);
      tab.forEach(r=>{const row=r[1][sv];const v=row?row[ei]:undefined;L.push(`| ${r[0]} | ${v===undefined||v==="-"?(r[0].startsWith("4 kHz")?"Yalnızca gemi/denizaltı ortamları için tanımlı":"Tabloda tanımsız (tedarik makamına danışın)"):(t.table==="CS114"&&typeof v==="number"?`Eğri ${v} (min. ${CS114_MIN[v]})`:v)} |`);});
    }
  }
  L.push(`- Uygulanacak limit/seviye (uyarlama sonrası): ${g("limitKaynak")}`);
  L.push(`- Ölçü birimi: ${t.unit}`);
  L.push(`## 11. Veri sunumu`);bl(t.data);
  L.push(`## 12. Kabul kriteri`);
  if(t.kind==="Emisyon"){L.push(`- Ölçülen emisyonlar tüm frekanslarda uygulanan limitin altında kalmalıdır. Tüm emisyonlar Tablo II bant genişlikleriyle ölçülür ve limitle kıyaslanır; dar bant/geniş bant ayrımı uygulanmaz (4.3.10.3.2).`);}
  else{
    L.push(`- EUT, test boyunca malfunction, performans bozulması veya spesifikasyondaki toleransların dışında sapma göstermemelidir.`);
    L.push(`- İzlenecek fonksiyonlar ve performans kriteri: ${g("performans")}`);
    L.push(`- Alınganlık görülürse eşik seviyesi (4.3.10.4.3): (a) girişimi EUT toparlanana kadar azaltın; (b) başarısızlık bandında frekansı elle ayarlayıp adım büyüklüğünü iteratif yarılayarak en düşük eşiği bulun; (c) sinyali ek 6 dB azaltın; (d) alınganlık yeniden oluşana kadar kademeli artırın; bu seviye eşiktir; (e) seviye, frekans aralığı, en alınganlık frekansı ve diğer parametreleri kaydedin. Gözlenen tüm alınganlık ve anomaliler belgelenir.`);
  }
  L.push(`## 13. Özel şartlar ve dikkat edilecek noktalar`);
  if(t.special.length)bl(t.special);else L.push(`- Standartta bu test için ek özel şart yoktur.`);
  if(o("tailor")!=="—")L.push(`- Uyarlama notu: ${o("tailor")}`);
  L.push(`## 14. Standarttan doğrulanması gereken maddeler`);
  if(t.verify.length)bl(t.verify);else L.push(`- Bu test için ayrıca doğrulanması gereken madde işaretlenmemiştir; yine de limit şekilleri ve platform tablolarının test mühendisi tarafından kontrol edilmesi gerekir.`);
  L.push(`## 15. Onay`);
  L.push(`| Hazırlayan | Kontrol (test mühendisi) | Onay |\n|---|---|---|\n| ____ | ____ | ____ |`);
  if(!hints)return L.join("\n");
  const tips=sectionTips(t),R=[];
  L.forEach(l=>{R.push(l);const mm=l.match(/^## (\d+)\./);if(mm&&tips[+mm[1]])R.push("> "+tips[+mm[1]]);});
  return R.join("\n");
}
function mdToHTML(md){
  const lines=md.split("\n");let out="",i=0,list=null;
  const inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/⟦(.+?)⟧/g,"<mark>$1</mark>");
  const close=()=>{if(list){out+=`</${list}>`;list=null;}};
  while(i<lines.length){const l=lines[i];
    if(l.startsWith("|")){close();const rows=[];while(i<lines.length&&lines[i].startsWith("|")){rows.push(lines[i]);i++;}
      const cells=r=>r.replace(/^\||\|$/g,"").split("|").map(c=>c.trim());
      out+=`<div class="tw"><table><thead><tr>${cells(rows[0]).map(c=>`<th>${inl(c)}</th>`).join("")}</tr></thead><tbody>`;
      rows.slice(2).forEach(r=>{out+=`<tr>${cells(r).map(c=>`<td>${inl(c)}</td>`).join("")}</tr>`;});out+=`</tbody></table></div>`;continue;}
    if(l.startsWith("> ")){close();out+=`<p class="tip"><b>İpucu:</b> ${inl(l.slice(2))}</p>`;}
    else if(l.startsWith("# ")){close();out+=`<h1>${inl(l.slice(2))}</h1>`;}
    else if(l.startsWith("### ")){close();out+=`<h3>${inl(l.slice(4))}</h3>`;}
    else if(l.startsWith("## ")){close();out+=`<h2>${inl(l.slice(3))}</h2>`;}
    else if(/^- /.test(l)){if(list!=="ul"){close();out+="<ul>";list="ul";}out+=`<li>${inl(l.slice(2))}</li>`;}
    else if(/^\d+\. /.test(l)){if(list!=="ol"){close();out+="<ol>";list="ol";}out+=`<li>${inl(l.replace(/^\d+\. /,""))}</li>`;}
    else if(l.trim()===""){close();}
    else{close();out+=`<p>${inl(l)}</p>`;}
    i++;}
  close();return out;
}



function generate(testId, flat){
  const t=getTest(testId);
  if(!t)throw new Error("Bilinmeyen test: "+testId);
  state.vals={};flat=flat||{};
  const all=[...COMMON_INPUTS,...t.inputs],invalid=[];
  for(const i of all){
    let v=flat[i.id];if(v==null)continue;v=String(v).trim();if(!v)continue;
    if(i.type==="select"&&!i.options.includes(v)){invalid.push({id:i.id,label:i.label,value:v,options:i.options});continue;}
    if(isCommon(i.id))state.vals[i.id]=v;else state.vals[t.id+"."+i.id]=v;
  }
  const miss=missing(t),st=statusFor(t),p=platIdx();
  const md=buildMD(t,false);
  return{testId:t.id,ok:miss.length===0&&invalid.length===0,
    missing:miss.map(i=>({id:i.id,label:i.label})),invalid,
    applicability:{platform:p<0?null:PLATFORMS[p],status:st,text:st===null?null:STATUS_TXT[st]},
    depth:t.depth,markdown:md,html:mdToHTML(md)};
}
module.exports={TESTS,COMMON_INPUTS,PLATFORMS,STATUS_TXT,generate,helpFor,getTest,isCommon};
