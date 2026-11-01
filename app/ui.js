const $=(s,r=document)=>r.querySelector(s);
try{const s=localStorage.getItem("emc3_vals");if(s)state.vals=JSON.parse(s)||{};}catch(e){}
persist=function(){try{localStorage.setItem("emc3_vals",JSON.stringify(state.vals));}catch(e){}};
state.hints=true;state.filter="all";state.q="";
/* ===== Görünümler ===== */
function whereLine(t){
  if(["CS103","CS104","CS105"].includes(t.id))return `<span class="where">Standartta: madde ${t.ref} ve Ek A.${t.ref}</span><br>`;
  const n=t.ref;return `<span class="where">Standartta: uygulanabilirlik ${n}.1 · limit ${n}.2 · amaç ${n}.3.1 · ekipman ${n}.3.2 · düzen ${n}.3.3 · adımlar ${n}.3.4 · veri ${n}.3.5</span><br>`;
}
const SERVER=!!window.EMC_SERVER;
function renderCards(){
  const el=$("#cards");if(!el)return;
  const q=(state.q||"").toLowerCase().trim();
  const list=TESTS.filter(t=>(state.filter==="all"||t.kind===state.filter)&&(!q||(t.id+" "+t.name+" "+t.freq[2]).toLowerCase().includes(q)));
  el.innerHTML=list.length?list.map(x=>{const s=statusFor(x);
    const b=s===null?"":`<span class="st st-${s||"x"}" title="${esc(STATUS_TXT[s])}">${s||"–"}</span>`;
    return `<button class="tcard" data-test="${x.id}" aria-pressed="${x.id===state.testId}"><span class="tc-top"><b>${x.id}</b><span class="tc-kind">${x.kind==="Emisyon"?"EMİSYON":"ALINGANLIK"}</span>${b}</span><span class="tc-name">${esc(x.name)}</span><span class="tc-f">${esc(x.freq[2])}</span></button>`;}).join(""):`<p class="status">Eşleşen test bulunamadı.</p>`;
}
function renderGen(){
  const t=getTest(state.testId);const{common,specific}=allInputs(t);
  const fld=i=>{const v=getVal(t,i);
    const hint=i.hint?`<span class="hint">${esc(i.hint)}</span>`:"";const req=i.req?`<span class="req">gerekli</span>`:"";
    let c;
    if(i.type==="select")c=`<select data-in="${i.id}"><option value="">Seçin</option>${i.options.map(o=>`<option ${o===v?"selected":""}>${esc(o)}</option>`).join("")}</select>`;
    else if(i.type==="textarea")c=`<textarea data-in="${i.id}">${esc(v)}</textarea>`;
    else c=`<input type="text" data-in="${i.id}" value="${esc(v)}">`;
    const hp=helpFor(t,i);
    const det=hp?`<details class="help"><summary>Bu nedir?</summary><div>${esc(hp)}</div></details>`:"";
    return `<div class="fld"><label>${esc(i.label)}${req}${c}${hint}</label>${det}</div>`;};
  const st=statusFor(t);
  const stLine=st===null?"Platform seçilince Tablo V durumu gösterilir.":`Tablo V: <b>${st||"uygulanmaz"}</b> (${esc(STATUS_TXT[st])})`;
  const seg=[["all","Tümü"],["Emisyon","Emisyon"],["Alınganlık","Alınganlık"]].map(([k,l])=>`<button class="seg" data-filter="${k}" aria-pressed="${state.filter===k}">${l}</button>`).join("");
  const dl=SERVER?`<button class="btn ghost" id="dlMd">.md indir</button><button class="btn ghost" id="dlHtml">.html indir</button><button class="btn ghost" id="dlDoc">Word (.doc)</button>`:"";
  $("#main").innerHTML=`<div class="grid"><div id="formcol">
    <section class="panel step"><h2><span class="n">1</span>Platform ve test</h2>
      ${fld(COMMON_INPUTS.find(i=>i.id==="platform"))}
      <div class="legend"><span class="st st-A">A</span> uygulanır <span class="st st-L">L</span> sınırlı <span class="st st-S">S</span> tedarik makamı belirtir <span class="st st-x">–</span> uygulanmaz</div>
      <div class="finder"><input type="search" id="testSearch" placeholder="Test ara (örn. RE102, kablo, manyetik)" value="${esc(state.q||"")}" aria-label="Test ara"><div class="segs">${seg}</div></div>
      <div class="cards" id="cards"></div>
      <div class="testmeta"><b>${t.id}</b> · madde ${t.ref} · ${esc(t.freq[2])}<br>${esc(t.name)}<br>${stLine}<br>${whereLine(t)}<span class="depth d-${t.depth==="tam"?"tam":"k"}">${t.depth==="tam"?"Standarttan tam çıkarıldı":"Kısmi: bazı alt maddeler standarttan tamamlanmalı"}</span></div>
    </section>
    <section class="panel step"><h2><span class="n">2</span>Bilgileri girin</h2>
      <div id="prog"></div>
      <details class="grp" open><summary>Ortak bilgiler</summary>${common.filter(i=>i.id!=="platform").map(fld).join("")}</details>
      <details class="grp" open><summary>${t.id} için gerekli bilgiler</summary>${specific.map(fld).join("")}</details>
      <div id="missing"></div>
      <button class="btn ghost" id="clearBtn" style="margin-top:12px">Girdileri temizle</button>
    </section>
  </div><section class="outcol"><div class="toolbar no-print"><span class="n">3</span><b class="tb-title">Prosedür taslağı</b>
    <button class="btn" id="copyBtn">Kopyala (Markdown)</button><button class="btn ghost" id="printBtn">Yazdır / PDF</button>${dl}
    <label class="chk"><input type="checkbox" id="hintsChk" ${state.hints?"checked":""}> İpuçları</label><span class="status" id="status" role="status"></span></div>
    <div class="sheet" id="sheet"></div></section></div>`;
  renderCards();updatePreview();
}
function updatePreview(){
  const t=getTest(state.testId);
  $("#sheet").innerHTML=`<span class="draft">TASLAK · test mühendisi onayı bekliyor</span>`+mdToHTML(buildMD(t,state.hints));
  const m=missing(t);const{common,specific}=allInputs(t);const reqs=[...common,...specific].filter(i=>i.req);
  const done=reqs.length-m.length,pct=reqs.length?Math.round(done*100/reqs.length):100;
  $("#prog").innerHTML=`<div class="prog" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><div class="status">Gerekli bilgiler: ${done}/${reqs.length}</div>`;
  $("#missing").innerHTML=m.length?`<div class="missing"><b>${m.length} gerekli bilgi eksik</b><ul>${m.map(i=>`<li>${esc(i.label)}</li>`).join("")}</ul></div>`:`<div class="missing ok"><b>Gerekli tüm bilgiler dolu.</b> Taslağı standartla karşılaştırıp onaya sunabilirsiniz.</div>`;
}
function download(name,text,mime){
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:mime+";charset=utf-8"}));a.download=name;
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
function fullHTML(t,word){
  const css="body{font-family:Calibri,Arial,sans-serif;max-width:800px;margin:2em auto;line-height:1.5}table{border-collapse:collapse;width:100%}td,th{border:1px solid #777;padding:4px 6px;text-align:left;vertical-align:top}h1{font-size:20pt}h2{font-size:14pt;border-top:1px solid #aaa;padding-top:6px}mark{background:#ffe9a8}";
  const head=word?`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${t.id}</title><style>${css}</style></head>`:`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${t.id} prosedür taslağı</title><style>${css}</style></head>`;
  return head+`<body>${mdToHTML(buildMD(t,false))}</body></html>`;
}
function renderMatrix(){
  const p=platIdx();
  const head=REQ_ORDER.map(r=>`<th class="v"><span>${r}</span></th>`).join("");
  const rows=PLATFORMS.map((pl,i)=>`<tr class="${i===p?"sel":""}"><th class="rowh"><button class="linklike" data-plat="${i}">${esc(pl)}</button></th>${REQ_ORDER.map(r=>{const v=MX[i][r];return `<td><button class="cell st-${v||"x"}" data-cell="${r}|${i}" title="${r}: ${esc(STATUS_TXT[v])}">${v||"–"}</button></td>`;}).join("")}</tr>`).join("");
  $("#main").innerHTML=`<div class="panel"><h2>Uygulanabilirlik matrisi (MIL-STD-461G Tablo V)</h2>
  <p class="status">Bir hücreye veya satır adına tıklayınca platform ve test seçilir; prosedür üreticiye geçilir.</p>
  <div class="scroll"><table class="mx"><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
  <p class="status"><b>A</b>: uygulanır · <b>L</b>: ilgili maddedeki koşullara bağlı sınırlı · <b>S</b>: tedarik makamı sözleşmede belirtmelidir · <b>–</b>: tabloda boş (uygulanmaz). Tablo V standartta 26. sayfadadır.</p></div>`;
}
function renderCmp(){
  const opt=sel=>TESTS.map(x=>`<option value="${x.id}" ${x.id===sel?"selected":""}>${x.id}: ${esc(x.name)}</option>`).join("");
  const A=getTest(state.cmpA),B=getTest(state.cmpB);
  const sd=(a,b)=>({c:a.filter(x=>b.includes(x)),oa:a.filter(x=>!b.includes(x)),ob:b.filter(x=>!a.includes(x))});
  const eq=sd(A.equipment,B.equipment);
  const tag=(arr,cls="")=>arr.length?arr.map(k=>`<span class="tag ${cls}">${esc(EQ[k][0])}</span>`).join(""):"—";
  const ins=sd(A.inputs.map(i=>i.label),B.inputs.map(i=>i.label));
  const tg=(arr,cls="")=>arr.length?arr.map(x=>`<span class="tag ${cls}">${esc(x)}</span>`).join(""):"—";
  const ul=a=>a.length?`<ul style="margin:0;padding-left:18px">${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"—";
  const row=(k,a,b)=>`<tr><td class="k">${k}</td><td>${a}</td><td>${b}</td></tr>`;
  const plats=PLATFORMS.map((p,i)=>`${MX[i][A.id]||"–"} / ${MX[i][B.id]||"–"}`);
  $("#main").innerHTML=`<div class="panel"><h2>İki testi karşılaştırın</h2>
  <div class="row2"><label>Test A<select id="cmpA">${opt(state.cmpA)}</select></label><label>Test B<select id="cmpB">${opt(state.cmpB)}</select></label></div>
  <div class="scroll"><table class="cmp"><tr><th></th><th>${A.id}</th><th>${B.id}</th></tr>
  ${row("Madde",A.ref,B.ref)}${row("Tür",A.kind,B.kind)}${row("Frekans / alan",esc(A.freq[2]),esc(B.freq[2]))}${row("Bağlantı",esc(A.coupling),esc(B.coupling))}${row("Birim",esc(A.unit),esc(B.unit))}
  ${row("Uygulanabilirlik",ul(A.applic),ul(B.applic))}${row("Limit",ul(A.limits),ul(B.limits))}${row("Test düzeni",ul(A.setup),ul(B.setup))}${row("Doğrulama/kalibrasyon",ul(A.check),ul(B.check))}
  <tr><td class="k">Ekipman: ortak</td><td colspan="2">${tag(eq.c,"common")}</td></tr>
  <tr><td class="k">Ekipman: yalnız A / yalnız B</td><td>${tag(eq.oa)}</td><td>${tag(eq.ob)}</td></tr>
  <tr><td class="k">Teste özgü girdiler</td><td>${tg(ins.oa)}</td><td>${tg(ins.ob)}</td></tr>
  <tr><td class="k">Ortak girdiler</td><td colspan="2">${tg(ins.c,"common")}</td></tr>
  <tr><td class="k">Tablo V (A / B)</td><td colspan="2">${PLATFORMS.map((p,i)=>`<div><span class="tag">${plats[i]}</span> ${esc(p)}</div>`).join("")}</td></tr>
  </table></div>
  <p class="status">Ortak ekipman ve girdiler, aynı test düzeneğinin birden fazla testte yeniden kullanılabileceğini gösterir. Emisyon ve alınganlık arasındaki temel fark: alınganlıkta izleme düzeneği, performans kriteri ve eşik belirleme gerekir.</p></div>`;
}
function renderData(){
  const t=getTest(state.testId);
  $("#main").innerHTML=`<div class="panel"><h2>Standarttan çıkarılan yapılandırılmış veri</h2>
  <p class="status">Üreteç bu veri üzerinde çalışır. Yeni test veya standart eklemek için aynı şemada kayıt eklemek yeterlidir. Veri, yüklenen MIL-STD-461G PDF'inden çıkarılmıştır.</p>
  <div class="row2"><label>Test<select id="dataTest">${TESTS.map(x=>`<option value="${x.id}" ${x.id===t.id?"selected":""}>${x.id}</option>`).join("")}</select></label>
  <div class="toolbar" style="align-items:end"><button class="btn" id="copyJson">JSON kopyala</button><span class="status" id="status" role="status"></span></div></div>
  <h2>${t.id} kaydı</h2><pre class="json">${esc(JSON.stringify(t,null,2))}</pre>
  <h2>Tablo V (uygulanabilirlik) – JSON</h2><pre class="json">${esc(JSON.stringify(MX,null,1))}</pre></div>`;
}
function renderMethod(){
  const full=TESTS.filter(t=>t.depth==="tam").map(t=>t.id).join(", "),part=TESTS.filter(t=>t.depth!=="tam");
  $("#main").innerHTML=`<div class="panel method"><h2>Kaynak, yöntem ve veri kapsamı</h2>
  <p>Veri modeli MIL-STD-461G (11 Aralık 2015) PDF'inden çıkarılmıştır. Her test maddesinde aynı alanlar aranır:</p>
  <table class="cmp"><tr><th>Aranan bilgi</th><th>Standartta nerede</th><th>Şema alanı</th></tr>
  <tr><td class="k">Amaç</td><td>X.3.1 Purpose</td><td><code>purpose</code></td></tr>
  <tr><td class="k">Uygulanabilirlik</td><td>X.1 Applicability, Tablo V</td><td><code>applic</code>, matris</td></tr>
  <tr><td class="k">Limit</td><td>X.2 Limits, Tablo VI/XI, şekiller</td><td><code>limits</code>, <code>table</code></td></tr>
  <tr><td class="k">Ekipman</td><td>X.3.2 Test equipment</td><td><code>equipment</code></td></tr>
  <tr><td class="k">Düzen</td><td>X.3.3 Setup, 4.3.x genel koşullar</td><td><code>setup</code>, <code>basic</code></td></tr>
  <tr><td class="k">Doğrulama</td><td>X.3.4 Procedures (integrity check/calibration)</td><td><code>check</code></td></tr>
  <tr><td class="k">Adımlar</td><td>X.3.4 Procedures</td><td><code>steps</code></td></tr>
  <tr><td class="k">Veri sunumu</td><td>X.3.5 Data presentation</td><td><code>data</code></td></tr></table>
  <h3>Veri kapsamı</h3>
  <p><b>Standarttan tam çıkarılanlar (${TESTS.filter(t=>t.depth==="tam").length}):</b> ${full}.</p>
  <p><b>Kısmi olanlar (${part.length}):</b></p><ul>${part.map(t=>`<li><b>${t.id}</b>: ${esc(t.verify.join("; ")||"—")}</li>`).join("")}</ul>
  <h3>Genel kurallar</h3>
  <p>Bant genişlikleri (Tablo II), tarama hızları (Tablo III), ortam seviyesi, topraklama düzlemi, LISN ve kablolama (4.3.x) test prosedürlerine otomatik eklenir. CS114 eğri seçimi (Tablo VI) ve RS103 alan seviyesi (Tablo XI), seçilen platform ve ortama göre tablodan okunur.</p>
  <h3>Sınırlamalar</h3>
  <ul><li>Limit eğrileri (şekiller) sayısal olarak verilmemiştir; ilgili şekil numaraları belirtilir ve sözleşmedeki uyarlamaya göre kullanıcı girdisiyle alınır.</li><li>Tabloda "–" olan hücreler, standartta değer tanımlanmadığı anlamına gelir.</li><li>Prosedür taslağı, test mühendisinin standart metniyle karşılaştırması olmadan kullanılamaz.</li></ul></div>`;
}
function renderGlossary(){
  $("#main").innerHTML=`<div class="panel method"><h2>Sözlük ve ipuçları</h2>
  <p class="status">Prosedürde geçen terimlerin kısa açıklamaları. Prosedür üreticide her girdinin altındaki "Bu nedir?" bağlantısı ve prosedür içindeki ipucu satırları da aynı amaçla eklenmiştir.</p>
  <h3>Standartta bilgi nerede bulunur?</h3>
  <p>Her test maddesi (örneğin RE102 = madde 5.18) aynı düzende yazılmıştır: <b>5.18.1</b> uygulanabilirlik, <b>5.18.2</b> limit, <b>5.18.3</b> test prosedürü; bunun içinde <b>.1</b> amaç, <b>.2</b> ekipman, <b>.3</b> düzen, <b>.4</b> adımlar, <b>.5</b> veri sunumu. Tüm testlerde ortak kurallar madde 4.3'tedir. Tablo II ölçüm bant genişlikleri, Tablo III tarama hızları, Tablo V uygulanabilirlik, Tablo VI CS114 eğrileri, Tablo XI RS103 alan seviyeleridir.</p>
  <h3>Terimler</h3>
  <dl class="gl">${GLOSSARY.map(g=>`<dt>${esc(g[0])}</dt><dd>${esc(g[1])}</dd>`).join("")}</dl></div>`;
}
function render(){
  document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===state.tab));
  ({gen:renderGen,matrix:renderMatrix,cmp:renderCmp,data:renderData,method:renderMethod,glossary:renderGlossary})[state.tab]();
}
function flash(m){const s=$("#status");if(s){s.textContent=m;setTimeout(()=>{if(s)s.textContent="";},2500);}}
async function copyText(txt){
  try{await navigator.clipboard.writeText(txt);flash("Kopyalandı");return;}catch(e){}
  const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();
  try{document.execCommand("copy");flash("Kopyalandı");}catch(e){flash("Kopyalanamadı; metni elle seçin");}ta.remove();
}
document.addEventListener("click",e=>{
  const tab=e.target.closest("#tabs button");if(tab){state.tab=tab.dataset.tab;render();return;}
  const chip=e.target.closest("[data-test]");if(chip){state.testId=chip.dataset.test;renderGen();return;}
  const pl=e.target.closest("[data-plat]");if(pl){state.vals.platform=PLATFORMS[+pl.dataset.plat];persist();state.tab="gen";render();return;}
  const cell=e.target.closest("[data-cell]");if(cell){const[r,i]=cell.dataset.cell.split("|");state.testId=r;state.vals.platform=PLATFORMS[+i];persist();state.tab="gen";render();return;}
  const fl=e.target.closest("[data-filter]");if(fl){state.filter=fl.dataset.filter;document.querySelectorAll("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.filter===state.filter));renderCards();return;}
  if(e.target.id==="themeBtn"){const r=document.documentElement;const cur=r.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");r.dataset.theme=cur==="dark"?"light":"dark";return;}
  { const t0=getTest(state.testId),nm=t0.id+"-prosedur-taslagi";
    if(e.target.id==="dlMd")return download(nm+".md",buildMD(t0,false),"text/markdown");
    if(e.target.id==="dlHtml")return download(nm+".html",fullHTML(t0,false),"text/html");
    if(e.target.id==="dlDoc")return download(nm+".doc",fullHTML(t0,true),"application/msword"); }
  if(e.target.id==="copyBtn")copyText(buildMD(getTest(state.testId)));
  if(e.target.id==="printBtn"){try{window.print();}catch(err){flash("Yazdırma bu ortamda kullanılamıyor");}}
  if(e.target.id==="copyJson")copyText(JSON.stringify(getTest(state.testId),null,2));
  if(e.target.id==="clearBtn"){state.vals={};persist();renderGen();}
});
document.addEventListener("input",e=>{
  if(e.target.id==="testSearch"){state.q=e.target.value;renderCards();return;}
  const id=e.target.dataset&&e.target.dataset.in;if(!id)return;
  const t=getTest(state.testId);const i=[...COMMON_INPUTS,...t.inputs].find(x=>x.id===id);setVal(t,i,e.target.value);
  if(id==="platform"){renderGen();return;}
  updatePreview();
});
document.addEventListener("change",e=>{
  if(e.target.id==="hintsChk"){state.hints=e.target.checked;updatePreview();return;}
  if(e.target.id==="cmpA"){state.cmpA=e.target.value;renderCmp();}
  if(e.target.id==="cmpB"){state.cmpB=e.target.value;renderCmp();}
  if(e.target.id==="dataTest"){state.testId=e.target.value;renderData();}
  if(e.target.dataset&&e.target.dataset.in==="platform"){renderGen();}
});
render();

