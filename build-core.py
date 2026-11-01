# core.js = data.js + help.js + gen.js + generate() + export (tek kaynak: ../app)
r=lambda f:open('app/'+f,encoding='utf8').read()
extra='''
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
'''
open('core.js','w',encoding='utf8').write('/* OTOMATİK ÜRETİLDİ: build-core.py. Elle düzenlemeyin. Kaynak: app/data.js, help.js, gen.js */\n'+r('data.js')+'\n'+r('help.js')+'\n'+r('gen.js')+extra)
