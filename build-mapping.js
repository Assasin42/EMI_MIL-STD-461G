// Jira özel alan şemasını core.js'ten üretir -> jira-fields.json
const c=require('./core.js');
const PREFIX="EMC – ";
const LABEL_OVERRIDE={kablolar:"Test edilecek kablo demetleri ve güç hatları",yuzeyler:"Taranacak/test edilecek EUT yüzleri ve konektörler"};
const TYPE={text:"Text Field (single line)",textarea:"Text Field (multi-line)",select:"Select List (single choice)"};
const fields=new Map();
function add(i,testId,scope){
  const ex=fields.get(i.id);
  if(ex){
    if(i.type==="select"&&JSON.stringify(ex.options)!==JSON.stringify(i.options))throw new Error("Seçenek çakışması: "+i.id);
    if(!ex.appliesTo.includes(testId))ex.appliesTo.push(testId);
    if(i.req&&!ex.requiredFor.includes(testId))ex.requiredFor.push(testId);
    return;
  }
  fields.set(i.id,{key:i.id,name:PREFIX+(LABEL_OVERRIDE[i.id]||i.label),jiraType:TYPE[i.type],type:i.type,
    options:i.options||undefined,description:c.helpFor({id:testId},i)||undefined,
    appliesTo:[testId],requiredFor:i.req?[testId]:[]});
}
for(const t of c.TESTS){
  for(const i of c.COMMON_INPUTS){ if(i.scope==="all"||i.scope===t.kind) add(i,t.id); }
  for(const i of t.inputs) add(i,t.id);
}
const all=c.TESTS.map(t=>t.id);
const out=[{key:"testId",name:PREFIX+"Test Türü",jiraType:TYPE.select,type:"select",
  options:c.TESTS.map(t=>t.id+" – "+t.name),description:"Hangi MIL-STD-461G testi için prosedür isteniyor. Seçime göre diğer alanlar gerekir.",appliesTo:all,requiredFor:all}];
for(const f of fields.values()){
  if(f.appliesTo.length===all.length&&f.requiredFor.length>0&&f.requiredFor.length<all.length) f.note="Yalnızca alınganlık testlerinde gerekli.";
  out.push(f);
}
const doc={standard:"MIL-STD-461G",issueType:"EMC Test Prosedür Talebi",
 workflow:{statuses:["Talep","Bilgi Bekleniyor","Taslak Hazır","Mühendis İncelemesi","Onaylandı","Revize Gerekli"],
  transitions:[["Talep","Bilgi Bekleniyor"],["Talep","Taslak Hazır"],["Bilgi Bekleniyor","Taslak Hazır"],["Taslak Hazır","Mühendis İncelemesi"],["Mühendis İncelemesi","Onaylandı"],["Mühendis İncelemesi","Revize Gerekli"],["Revize Gerekli","Talep"]]},
 fields:out};
require('fs').writeFileSync('jira-fields.json',JSON.stringify(doc,null,1),'utf8');
console.log("alan sayısı:",out.length);
