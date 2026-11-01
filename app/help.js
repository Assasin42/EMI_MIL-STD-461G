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
