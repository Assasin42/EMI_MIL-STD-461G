// Minimal Jira REST istemcisi (bağımlılıksız, Node 18+). Jira Cloud ve Data Center için REST v2.
const MAPPING=require('./jira-fields.json');
const cfg=()=>({
  base:(process.env.JIRA_BASE_URL||"").replace(/\/$/,""),
  user:process.env.JIRA_USER,token:process.env.JIRA_TOKEN,bearer:process.env.JIRA_BEARER
});
const configured=()=>!!cfg().base&&!!(cfg().bearer||(cfg().user&&cfg().token));
function headers(extra){
  const c=cfg(),h={Accept:"application/json",...extra};
  if(c.bearer)h.Authorization="Bearer "+c.bearer;
  else h.Authorization="Basic "+Buffer.from(c.user+":"+c.token).toString("base64");
  return h;
}
async function jfetch(path,opts={}){
  const res=await fetch(cfg().base+path,{...opts,headers:headers(opts.headers)});
  const text=await res.text();
  if(!res.ok)throw new Error(`Jira ${res.status} ${path}: ${text.slice(0,200)}`);
  return text?JSON.parse(text):null;
}
let fieldCache=null;
async function fieldNameToId(){
  if(fieldCache)return fieldCache;
  const list=await jfetch("/rest/api/2/field");
  fieldCache=Object.fromEntries(list.map(f=>[f.name,f.id]));return fieldCache;
}
const getIssue=key=>jfetch("/rest/api/2/issue/"+encodeURIComponent(key));
function plain(v){
  if(v==null)return undefined;
  if(Array.isArray(v))return v.map(plain).filter(Boolean).join(", ")||undefined;
  if(typeof v==="object")return v.value!==undefined?v.value:(v.name!==undefined?v.name:undefined);
  const s=String(v).trim();return s||undefined;
}
// Jira iş kaydından {alanKey: değer} üretir; alanlar ADLARIYLA bulunur (jira-fields.json).
async function issueToFlat(issue){
  const ids=await fieldNameToId(),flat={},notFound=[];
  for(const f of MAPPING.fields){
    const id=ids[f.name];
    if(!id){notFound.push(f.name);continue;}
    let v=plain(issue.fields[id]);
    if(f.key==="testId"&&v)v=v.split(" ")[0];
    if(v!==undefined)flat[f.key]=v;
  }
  return{flat,notFound};
}
const comment=(key,body)=>jfetch(`/rest/api/2/issue/${encodeURIComponent(key)}/comment`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body})});
async function attach(key,filename,content,mime){
  const fd=new FormData();fd.append("file",new Blob([content],{type:mime}),filename);
  return jfetch(`/rest/api/2/issue/${encodeURIComponent(key)}/attachments`,{method:"POST",headers:{"X-Atlassian-Token":"no-check"},body:fd});
}
module.exports={configured,getIssue,issueToFlat,comment,attach};
