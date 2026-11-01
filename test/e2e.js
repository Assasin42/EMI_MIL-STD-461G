// Sahte Jira ile uçtan uca test: node test/e2e.js
const http=require("http"),assert=require("assert");
const issues={
 "EMC-1":{fields:{cf_test:{value:"RE102 – Yayılan emisyon, elektrik alan"},cf_proje:"Deneme proje",cf_eut:"EUT-A",cf_plat:{value:"Hava aracı – Kara Kuvvetleri (flight line dahil)"},cf_guc:{value:"28 V DC"},cf_mod:"Normal mod",cf_lim:"Şekil RE102-3",cf_anten:"Biconical, çubuk, horn",cf_fust:{value:"18 GHz"},cf_tar:{value:"Adım ayarlı alıcı"}}},
 "EMC-2":{fields:{cf_test:{value:"RS103 – Yayılan alınganlık, elektrik alan"},cf_proje:"Deneme proje"}}
};
const names={cf_test:"EMC – Test Türü",cf_proje:"EMC – Proje / sözleşme adı",cf_eut:"EMC – EUT adı",cf_plat:"EMC – Kurulum platformu (Tablo V)",cf_guc:"EMC – EUT güç girişi",cf_mod:"EMC – EUT çalışma modları",cf_lim:"EMC – Uygulanacak limit / seviye (uyarlama sonrası)",cf_anten:"EMC – Kullanılacak antenler (tip, model, anten faktörü sertifika tarihi)",cf_fust:"EMC – Üst frekans sınırı",cf_tar:"EMC – Alıcı türü"};
const log=[];
const mock=http.createServer((req,res)=>{
  let b=[];req.on("data",c=>b.push(c));req.on("end",()=>{
    const buf=Buffer.concat(b);
    log.push({m:req.method,u:req.url,auth:req.headers.authorization,len:buf.length,body:buf.toString("utf8").slice(0,4000)});
    res.setHeader("Content-Type","application/json");
    if(req.url==="/rest/api/2/field")return res.end(JSON.stringify(Object.entries(names).map(([id,name])=>({id,name}))));
    const m=req.url.match(/^\/rest\/api\/2\/issue\/([^/]+)$/);
    if(m&&req.method==="GET")return issues[m[1]]?res.end(JSON.stringify(issues[m[1]])):(res.statusCode=404,res.end("{}"));
    res.end("[]");
  });
});
mock.listen(0,async()=>{
  process.env.JIRA_BASE_URL="http://127.0.0.1:"+mock.address().port;
  process.env.JIRA_USER="u@x.com";process.env.JIRA_TOKEN="tok";process.env.WEBHOOK_SECRET="s3";
  const server=require("../server.js");
  await new Promise(r=>server.listen(0,r));
  const base="http://127.0.0.1:"+server.address().port;
  const post=(p,b,h={})=>fetch(base+p,{method:"POST",headers:{"Content-Type":"application/json",...h},body:JSON.stringify(b)}).then(async r=>({s:r.status,j:await r.json()}));
  try{
    let r=await post("/jira/webhook",{issueKey:"EMC-1"});
    assert.strictEqual(r.s,401);
    r=await post("/jira/webhook",{issueKey:"EMC-1"},{"X-Webhook-Secret":"s3"});
    assert.strictEqual(r.s,200);assert.strictEqual(r.j.ok,true,JSON.stringify(r.j));
    assert.deepStrictEqual(r.j.attached.length,2);assert.strictEqual(r.j.applicability.status,"A");
    const att=log.filter(l=>l.u.endsWith("/attachments"));assert.strictEqual(att.length,2);
    assert.ok(att[0].body.includes("RE102 Test Prosedürü Taslağı"));
    assert.ok(log.some(l=>l.u.endsWith("/comment")&&l.body.includes("hazırlandı")));
    r=await post("/jira/webhook",{issueKey:"EMC-2"},{"X-Webhook-Secret":"s3"});
    assert.strictEqual(r.j.ok,false);assert.ok(r.j.missing.length>5);
    const cm=log.filter(l=>l.u.endsWith("/comment")).pop();assert.ok(cm.body.includes("eksik"));
    assert.ok(log.every(l=>l.auth&&l.auth.startsWith("Basic ")));
    r=await post("/generate",{testId:"CS114",fields:{platform:"Hava aracı – Deniz Kuvvetleri",ortam:"Hava aracı – iç"}},{"X-Webhook-Secret":"s3"});
    assert.ok(r.j.markdown.includes("Eğri"));
    r=await post("/jira/webhook",{issueKey:"EMC-9"},{"X-Webhook-Secret":"s3"});assert.strictEqual(r.s,500);
    console.log("TÜM TESTLER GEÇTİ  (Jira çağrıları:",log.length+")");
  }catch(e){console.error("BAŞARISIZ:",e.message);process.exitCode=1;}
  server.close();mock.close();
});
