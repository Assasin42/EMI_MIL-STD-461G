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


