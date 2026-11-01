// EMC prosedür servisi: POST /generate, POST /jira/webhook, GET /schema, GET /health
const http=require("http"),fs=require("fs"),path=require("path");
const core=require("./core.js");
const jira=require("./jira.js");
const MAPPING=require("./jira-fields.json");
const PORT=process.env.PORT||8080,SECRET=process.env.WEBHOOK_SECRET;

const page=(title,body)=>`<!doctype html><html lang="tr"><meta charset="utf-8"><title>${title}</title><style>body{font:15px/1.5 system-ui,sans-serif;max-width:860px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:5px 8px;text-align:left;vertical-align:top}mark{background:#ffe9a8}</style><body>${body}</body></html>`;
function readJson(req){return new Promise((ok,no)=>{let s="";req.on("data",c=>{s+=c;if(s.length>2e6){req.destroy();no(new Error("gövde çok büyük"));}});req.on("end",()=>{try{ok(s?JSON.parse(s):{});}catch(e){no(new Error("geçersiz JSON"));}});});}
const send=(res,code,obj)=>{res.writeHead(code,{"Content-Type":"application/json; charset=utf-8"});res.end(JSON.stringify(obj));};

async function handleWebhook(body){
  const key=body.issueKey;
  if(!key)throw Object.assign(new Error("issueKey gerekli"),{code:400});
  let flat=body.fields;
  if(!flat){
    if(!jira.configured())throw Object.assign(new Error("JIRA_BASE_URL ve kimlik bilgileri tanımlı değil; alanları 'fields' ile gönderin"),{code:400});
    const issue=await jira.getIssue(key);
    const r=await jira.issueToFlat(issue);flat=r.flat;
    if(r.notFound.length>=MAPPING.fields.length)throw Object.assign(new Error("Jira'da EMC alanları bulunamadı (alan adları jira-fields.json ile eşleşmeli)"),{code:422});
  }
  const testId=(body.testId||flat.testId||"").toString().split(" ")[0];
  if(!testId)return{ok:false,issueKey:key,error:"Test Türü seçilmemiş",missing:[{id:"testId",label:"Test Türü"}]};
  const out=core.generate(testId,flat);
  const res={ok:out.ok,issueKey:key,testId,missing:out.missing,invalid:out.invalid.map(i=>({id:i.id,label:i.label,value:i.value})),applicability:out.applicability,depth:out.depth,attached:[],commented:false};
  if(body.dryRun||!jira.configured())return{...res,dryRun:true};
  if(out.ok){
    const base=`${key}-${testId}-prosedur-taslagi`;
    await jira.attach(key,base+".md",out.markdown,"text/markdown");
    await jira.attach(key,base+".html",page(`${testId} prosedür taslağı`,out.html),"text/html");
    res.attached=[base+".md",base+".html"];
    const note=out.depth==="kısmi"?"\nNot: Bu test için bazı alt maddeler standarttan tamamlanmalıdır (taslağın 14. bölümü).":"";
    await jira.comment(key,`${testId} prosedür taslağı hazırlandı ve eklendi. Platform durumu (Tablo V): ${out.applicability.status||"uygulanmaz"}. Test mühendisi incelemesi gerekir.${note}`);
  }else{
    const lines=[...out.missing.map(m=>`* ${m.label}`),...out.invalid.map(i=>`* ${i.label}: "${i.value}" geçerli bir seçenek değil`)];
    await jira.comment(key,`${testId} prosedür taslağı için eksik veya hatalı bilgiler var:\n${lines.join("\n")}`);
  }
  res.commented=true;return res;
}

const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://x");
    if(req.method==="GET"&&(url.pathname==="/"||url.pathname==="/index.html")){
      const f=path.join(__dirname,"public","index.html");
      if(!fs.existsSync(f))return send(res,404,{error:"public/index.html yok; 'python3 app/build_html.py' ile üretin"});
      res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});return res.end(fs.readFileSync(f));
    }
    if(req.method==="GET"&&url.pathname==="/health")return send(res,200,{ok:true,jira:jira.configured()});
    if(req.method==="GET"&&url.pathname==="/schema")return send(res,200,MAPPING);
    if(req.method==="POST"&&(url.pathname==="/generate"||url.pathname==="/jira/webhook")){
      if(SECRET&&req.headers["x-webhook-secret"]!==SECRET)return send(res,401,{error:"yetkisiz"});
      const body=await readJson(req);
      if(url.pathname==="/generate"){
        if(!body.testId)return send(res,400,{error:"testId gerekli"});
        return send(res,200,core.generate(body.testId,body.fields||{}));
      }
      return send(res,200,await handleWebhook(body));
    }
    send(res,404,{error:"bulunamadı"});
  }catch(e){send(res,e.code||500,{error:e.message});}
});
if(require.main===module)server.listen(PORT,()=>console.log("EMC prosedür servisi :"+PORT));
module.exports=server;
