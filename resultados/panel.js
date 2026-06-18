const URL="https://nvgkhdrrxqdgxktfkioa.supabase.co";
const KEY="sb_publishable_d1RrtE7S-9a8e8mGKRRjxQ_4HU_nkDl";
const H={apikey:KEY,Authorization:"Bearer "+KEY};
const BLOQUES={
 "Bloque 2 · Sostenibilidad":[
  ["q2_1","Capacidad de emprender rentable y sostenible"],["q2_4","Conocimientos financieros"],["q2_5","Valor compartido"],
  ["q2_6","Liderar impacto social"],["q2_7","Comunicar sostenibilidad"],["q2_8","Toma en cuenta a su comunidad"],
  ["q2_9","Relaciones con actores clave"],["q2_10","Sociedad valora negocios responsables"],
  ["q2_11","Reducir impacto ambiental"],["q2_12","Innovar en conservación"],["q2_13","Medir impacto ambiental"],
  ["q2_14","Tendencias ambientales en decisiones"],["q2_15","Conoce los ODS"]],
 "Bloque 3 · Modelo de negocio":[
  ["q3_1","Producto viable y sostenible"],["q3_2","Modelos de negocio circulares"],["q3_4","Valor en incertidumbre"],
  ["q3_5","Colabora con actores (industria, gobierno…)"],["q3_8","Co-crea soluciones sostenibles"]],
 "Bloque 4 · Identidad y drivers":[
  ["q4_1","Motivado por oportunidades y crecimiento"],["q4_2","Emprender = desarrollo personal"],
  ["q4_3","Pertenencia con su comunidad"],["q4_4","Motivado por problemas de su comunidad"],
  ["q4_6","Emprender para cambiar el mundo"]],
};
const ALLK=[]; Object.values(BLOQUES).forEach(a=>a.forEach(([k])=>ALLK.push(k)));
const DEMOK=["sexo","edad","rango_edad","nivel_educativo","departamento","municipio","vereda"];
let INI=[],FIN=[];
const $=s=>document.querySelector(s);
const avg=(arr,k)=>{const a=arr.map(r=>r[k]).filter(v=>typeof v==="number"&&!isNaN(v));return a.length?a.reduce((x,y)=>x+y,0)/a.length:null;};
const dist=(arr,k)=>{const m={};arr.forEach(r=>{const v=(r[k]??"").toString().trim();if(v)m[v]=(m[v]||0)+1;});return m;};
const f1=v=>v==null?"—":v.toFixed(2);

async function load(){
  try{
    INI=await fetch(`${URL}/rest/v1/bootcamp_pc_diag_inicial?select=*`,{headers:H}).then(r=>r.json());
    FIN=await fetch(`${URL}/rest/v1/bootcamp_pc_diag_final?select=*`,{headers:H}).then(r=>r.json());
    if(!Array.isArray(INI))INI=[]; if(!Array.isArray(FIN))FIN=[];
  }catch(e){ INI=[];FIN=[]; }
  renderRes();
}
function deltaTag(i,f){
  if(i==null||f==null) return '<span class="delta eq">sin datos</span>';
  const d=f-i; const cls=d>0.05?"up":(d<-0.05?"down":"eq"); const s=(d>=0?"+":"")+d.toFixed(2);
  return `<span class="delta ${cls}">Δ ${s}</span>`;
}
function bar(cls,val){ const w=val==null?0:Math.max(2,val/5*100); return `<div class="bar ${cls}"><div style="width:${w}%"></div><span class="v">${val==null?"—":val.toFixed(2)}</span></div>`; }
function renderRes(){
  const v=$("#view-res");
  let h=`<div class="kpis">
    <div class="kpi ini"><b>${INI.length}</b><span>Respuestas · INICIO</span></div>
    <div class="kpi fin"><b>${FIN.length}</b><span>Respuestas · CIERRE</span></div>
    <div class="kpi"><b>${(()=>{const i=avg(INI.flatMap(r=>ALLK.map(k=>r[k])).length?INI:[],null),x=ALLK.map(k=>avg(INI,k)).filter(n=>n!=null);return x.length?(x.reduce((a,b)=>a+b,0)/x.length).toFixed(2):"—";})()}</b><span>Promedio global · inicio</span></div>
    <div class="kpi"><b>${(()=>{const x=ALLK.map(k=>avg(FIN,k)).filter(n=>n!=null);return x.length?(x.reduce((a,b)=>a+b,0)/x.length).toFixed(2):"—";})()}</b><span>Promedio global · cierre</span></div>
  </div>`;
  if(!INI.length&&!FIN.length){ h+=`<div class="card"><p class="muted">Aún no hay respuestas. Comparte el enlace del diagnóstico de inicio para empezar.</p></div>`; v.innerHTML=h; return; }
  // promedio por bloque
  h+=`<div class="card"><h2>Promedio por bloque</h2><div class="sub">Escala 1–5. Δ = cambio entre inicio y cierre.</div><div class="dimavg">`;
  for(const [name,items] of Object.entries(BLOQUES)){
    const ks=items.map(x=>x[0]);
    const ai=ks.map(k=>avg(INI,k)).filter(n=>n!=null); const af=ks.map(k=>avg(FIN,k)).filter(n=>n!=null);
    const mi=ai.length?ai.reduce((a,b)=>a+b,0)/ai.length:null; const mf=af.length?af.reduce((a,b)=>a+b,0)/af.length:null;
    h+=`<div class="d"><div class="lab">${name}</div><div class="nums"><span class="i">${f1(mi)}</span> <span class="a">→</span> <span class="f">${f1(mf)}</span></div><div style="margin-top:6px">${deltaTag(mi,mf)}</div></div>`;
  }
  h+=`</div></div>`;
  // por item
  h+=`<div class="card"><h2>Detalle por afirmación</h2><div class="legend"><span><i style="background:var(--blue)"></i>Inicio</span><span><i style="background:var(--orange)"></i>Cierre</span></div>`;
  for(const [name,items] of Object.entries(BLOQUES)){
    h+=`<h3 style="color:var(--orange2);margin:14px 0 8px;font-size:.95rem">${name}</h3>`;
    items.forEach(([k,lab])=>{
      const i=avg(INI,k),f=avg(FIN,k);
      h+=`<div class="row"><div class="rt"><span>${lab}</span>${deltaTag(i,f)}</div>${bar("ini",i)}${bar("fin",f)}</div>`;
    });
  }
  h+=`</div>`;
  // demograficos
  h+=`<div class="card"><h2>Caracterización del grupo (inicio)</h2><div class="sub">Distribución de las respuestas de inicio.</div><div class="demo">`;
  h+=demoBlock("Sexo",dist(INI,"sexo"));
  h+=demoBlock("Rango de edad",dist(INI,"rango_edad"));
  h+=demoBlock("Nivel educativo",dist(INI,"nivel_educativo"));
  h+=demoBlock("Municipio",dist(INI,"municipio"));
  h+=`</div></div>`;
  v.innerHTML=h;
}
function demoBlock(title,m){
  const ent=Object.entries(m).sort((a,b)=>b[1]-a[1]);
  let h=`<div><div style="font-family:var(--display);font-weight:800;color:var(--forest);margin-bottom:6px">${title}</div>`;
  if(!ent.length) h+=`<div class="muted" style="font-size:.84rem">—</div>`;
  ent.forEach(([k,c])=>h+=`<div class="b"><span>${k}</span><b>${c}</b></div>`);
  return h+`</div>`;
}
// ---- TAB DATOS ----
let unlocked=false;
function renderDat(){
  const v=$("#view-dat");
  if(!unlocked){
    v.innerHTML=`<div class="card"><div class="gate"><h2 style="color:var(--forest)">Datos individuales</h2><p class="muted">Ingresa la clave del facilitador.</p>
      <input id="pw" type="password" placeholder="Contraseña"><button onclick="tryUnlock()">Entrar →</button><div id="pwerr" class="muted" style="color:#c0392b;margin-top:8px"></div></div></div>`;
    const i=document.getElementById("pw"); if(i) i.addEventListener("keydown",e=>{if(e.key==="Enter")tryUnlock();});
    return;
  }
  const rows=INI.map(r=>({m:"inicial",...r})).concat(FIN.map(r=>({m:"final",...r})));
  const cols=["m","created_at","sexo","sexo_otro","edad","rango_edad","nivel_educativo","departamento","municipio","vereda",...ALLK];
  let h=`<div class="card"><h2>Datos individuales (${rows.length})</h2><div class="tools">
    <button onclick="csv()">⬇ Exportar CSV</button><button onclick="load().then(()=>renderDat())">↻ Actualizar</button></div>
    <div class="scroll"><table><thead><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>`;
  rows.forEach(r=>{ h+="<tr>"+cols.map(c=>`<td>${(r[c]??"").toString().slice(0,40)}</td>`).join("")+"</tr>"; });
  h+=`</tbody></table></div></div>`;
  v.innerHTML=h;
}
window.tryUnlock=function(){ const p=document.getElementById("pw").value; if(p==="Diagnosticos2026"){unlocked=true;renderDat();} else {document.getElementById("pwerr").textContent="Clave incorrecta.";} };
window.csv=function(){
  const rows=INI.map(r=>({m:"inicial",...r})).concat(FIN.map(r=>({m:"final",...r})));
  const cols=["m","created_at","sexo","sexo_otro","edad","rango_edad","nivel_educativo","departamento","municipio","vereda",...ALLK];
  const lines=[cols.join(",")].concat(rows.map(r=>cols.map(c=>`"${(r[c]??"").toString().replace(/"/g,'""')}"`).join(",")));
  const blob=new Blob([lines.join("\n")],{type:"text/csv"}); const a=document.createElement("a");
  a.href=URL_OBJ(blob); a.download="diagnostico-bootcamp-pc.csv"; a.click();
};
function URL_OBJ(b){return (window.URL||window.webkitURL).createObjectURL(b);}
window.tab=function(t){
  $("#t-res").classList.toggle("on",t==="res"); $("#t-dat").classList.toggle("on",t==="dat");
  $("#view-res").style.display=t==="res"?"block":"none"; $("#view-dat").style.display=t==="dat"?"block":"none";
  if(t==="dat") renderDat();
};
load();
