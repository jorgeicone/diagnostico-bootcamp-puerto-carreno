const URL="https://nvgkhdrrxqdgxktfkioa.supabase.co";
const KEY="sb_publishable_d1RrtE7S-9a8e8mGKRRjxQ_4HU_nkDl";
const params=new URLSearchParams(location.search);
const MOMENTO=(params.get("m")||"inicial").toLowerCase()==="final"?"final":"inicial";
const TABLE=MOMENTO==="final"?"bootcamp_pc_diag_final":"bootcamp_pc_diag_inicial";
document.getElementById("momento-badge").textContent=MOMENTO==="final"?"DIAGNÓSTICO DE CIERRE":"DIAGNÓSTICO DE INICIO";

const NIVELES=["Sin estudios","Primaria incompleta","Primaria completa","Secundaria incompleta","Secundaria completa","Técnico incompleto","Técnico completo","Tecnológico incompleto","Tecnológico completo","Universitario incompleto","Universitario completo","Posgrado (especialización, maestría, doctorado)","No sabe"];
const RANGOS=["Menos de 18","18-24","25-34","35-44","45-54","55-64","65-99","Sin respuesta / Rechaza"];

const LIK=[
 {blk:"Bloque 2 · Conocimiento y actitudes hacia la sostenibilidad", dim:"Dimensión Económica", items:[
   ["q2_1","Confío plenamente en mi capacidad para desarrollar un emprendimiento o negocio rentable y a la vez sostenible."],
   ["q2_4","Poseo sólidos conocimientos y habilidades financieras para gestionar eficientemente los recursos económicos en un emprendimiento sostenible."],
   ["q2_5","Conozco plenamente el concepto de valor compartido y sé cómo implementarlo en un emprendimiento sostenible."],
 ]},
 {dim:"Dimensión Social", items:[
   ["q2_6","Me siento con las capacidades necesarias para liderar iniciativas de impacto que promuevan el bienestar social en mi comunidad."],
   ["q2_7","Confío en mi habilidad para comunicar efectivamente la importancia de la sostenibilidad a diferentes grupos de interés."],
   ["q2_8","Siempre tomo en cuenta las expectativas de mi comunidad en mi intención de adoptar prácticas sostenibles."],
   ["q2_9","Me siento capaz de construir relaciones sólidas con actores clave (clientes, empleados y proveedores) para lograr objetivos sociales."],
   ["q2_10","Considero que la sociedad en general valora los negocios que son socialmente responsables."],
 ]},
 {dim:"Dimensión Ambiental", items:[
   ["q2_11","Poseo el conocimiento y habilidades necesarias para implementar prácticas que reduzcan el impacto ambiental que produzca mi negocio."],
   ["q2_12","Tengo los conocimientos y habilidades necesarias para innovar en procesos que promuevan la conservación de recursos naturales."],
   ["q2_13","Conozco los procedimientos y soy consciente de la necesidad de medir el impacto ambiental de las operaciones en un emprendimiento."],
   ["q2_14","Considero las tendencias ambientales actuales al tomar decisiones empresariales."],
   ["q2_15","Tengo conocimiento de los Objetivos de Desarrollo Sostenible (ODS) establecidos por Naciones Unidas en la Agenda 2030."],
 ]},
 {blk:"Bloque 3 · Modelo de negocio y uso de recursos hacia la sostenibilidad", items:[
   ["q3_1","Poseo los conocimientos y habilidades necesarias para que un producto o servicio sea económicamente viable y ambientalmente sostenible."],
   ["q3_2","He implementado modelos de negocio circulares para mejorar el bienestar de mi comunidad."],
   ["q3_4","He implementado estrategias o acciones para crear valor económico en condiciones de incertidumbre."],
   ["q3_5","Frecuentemente suelo integrarme o colaborar con otros actores de la industria, el gobierno, instituciones educativas u organizaciones civiles para desarrollar proyectos sostenibles."],
   ["q3_8","Frecuentemente estoy dispuesto a colaborar con diferentes actores sociales para co-crear soluciones sostenibles."],
 ]},
 {blk:"Bloque 4 · Identidad social y drivers para emprender", items:[
   ["q4_1","Mi principal motivador para emprender es la búsqueda de nuevas oportunidades de negocio y crecimiento personal."],
   ["q4_2","Ser emprendedor es parte fundamental de mi desarrollo personal."],
   ["q4_3","Siento un fuerte sentido de pertenencia con la comunidad donde habito."],
   ["q4_4","Los problemas de mi comunidad son el principal motivador para generar nuevas iniciativas."],
   ["q4_6","Considero que el emprendimiento es el mejor camino para cambiar el mundo y construir una realidad mejor."],
 ]},
];

const A={}; // answers
const $=s=>document.querySelector(s);
const E=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
let qn=0;

function leafH(){return '<svg style="width:20px;height:20px;color:#fff"><use href="#leaf"/></svg>';}

function optGroup(key,opts,onPick){
  const w=E("div","opts");
  opts.forEach(o=>{
    const b=E("button","opt",o); b.type="button";
    b.onclick=()=>{ A[key]=o; w.querySelectorAll(".opt").forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); w.classList.remove("miss"); onPick&&onPick(o); };
    w.appendChild(b);
  });
  w.dataset.key=key; return w;
}
function scale(key){
  const wrap=E("div");
  const row=E("div","scale");
  for(let i=1;i<=5;i++){ const b=E("button",null,i); b.type="button";
    b.onclick=()=>{ A[key]=i; row.querySelectorAll("button").forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); row.classList.remove("miss"); };
    row.appendChild(b);
  }
  row.dataset.key=key;
  wrap.appendChild(row);
  wrap.appendChild(E("div","scale-cap","<span>1 · muy poco identificado</span><span>5 · muy identificado</span>"));
  return wrap;
}
function qBox(num,text,node){
  const q=E("div","q");
  q.appendChild(E("div","qt",`<span class="n">${num}</span>${text}`));
  q.appendChild(node);
  return q;
}

function build(){
  const root=$("#blocks");
  // BLOQUE 1
  const b1=E("div","blk");
  b1.appendChild(E("div","blk-h",`${leafH()} Bloque 1 · Variables sociodemográficas`));
  qn=0;
  b1.appendChild(qBox(++qn,"Sexo:", (()=>{ const wrap=E("div");
     const g=optGroup("sexo",["Hombre","Mujer","Otro","Rechaza o NR"],v=>{ otro.style.display=v==="Otro"?"block":"none"; });
     const otro=E("input","inp"); otro.placeholder="¿Cuál?"; otro.style.cssText="display:none;margin-top:9px"; otro.oninput=()=>A.sexo_otro=otro.value;
     wrap.appendChild(g); wrap.appendChild(otro); return wrap; })()));
  const edad=E("input","inp"); edad.type="number"; edad.min=10; edad.max=99; edad.placeholder="Edad en años"; edad.oninput=()=>A.edad=edad.value?parseInt(edad.value):null; edad.dataset.key="edad";
  b1.appendChild(qBox(++qn,"¿Cuál es su edad (en años)?",edad));
  const rg=E("select"); rg.innerHTML='<option value="">Selecciona…</option>'+RANGOS.map(r=>`<option>${r}</option>`).join(""); rg.onchange=()=>{A.rango_edad=rg.value;rg.classList.remove("miss")}; rg.dataset.key="rango_edad";
  b1.appendChild(qBox(++qn,"Indique su rango de edad:",rg));
  const nv=E("select"); nv.innerHTML='<option value="">Selecciona…</option>'+NIVELES.map(r=>`<option>${r}</option>`).join(""); nv.onchange=()=>{A.nivel_educativo=nv.value;nv.classList.remove("miss")}; nv.dataset.key="nivel_educativo";
  b1.appendChild(qBox(++qn,"¿Cuál es el nivel educativo más alto que ha completado?",nv));
  ["departamento","municipio","vereda"].forEach((k,i)=>{
    const labels={departamento:"Departamento",municipio:"Ciudad o Municipio",vereda:"Vereda"};
    const inp=E("input","inp"); inp.placeholder=labels[k]; inp.oninput=()=>{A[k]=inp.value;inp.classList.remove("miss")}; inp.dataset.key=k;
    b1.appendChild(qBox(++qn,labels[k]+":",inp));
  });
  root.appendChild(b1);

  // LIKERT BLOQUES
  let cur=null;
  LIK.forEach(sec=>{
    if(sec.blk){ cur=E("div","blk"); cur.appendChild(E("div","blk-h",`${leafH()} ${sec.blk}`)); root.appendChild(cur);
      cur.appendChild(E("p",null,'<span style="color:var(--muted);font-weight:600;font-size:.86rem">Evalúa de 1 a 5 qué tan identificado/a te sientes con cada afirmación.</span>')); }
    if(sec.dim) cur.appendChild(E("div","dim",sec.dim));
    sec.items.forEach(([k,t])=>{ cur.appendChild(qBox(++qn,t,scale(k))); });
  });
}

function allKeys(){
  const dem=["sexo","edad","rango_edad","nivel_educativo","departamento","municipio","vereda"];
  const lk=[]; LIK.forEach(s=>s.items.forEach(([k])=>lk.push(k)));
  return dem.concat(lk);
}
async function send(){
  const err=$("#err");
  // validar
  let missing=null;
  for(const k of allKeys()){
    const v=A[k];
    if(v===undefined||v===null||v===""){ if(!missing) missing=k; }
  }
  if(missing){
    err.textContent="Falta responder algunas preguntas. Revisa las marcadas en rojo.";
    err.classList.add("show");
    document.querySelectorAll('[data-key]').forEach(el=>{ const k=el.dataset.key; if(A[k]===undefined||A[k]===null||A[k]==="") el.classList.add("miss"); });
    const f=document.querySelector(`[data-key="${missing}"]`); if(f) f.scrollIntoView({behavior:"smooth",block:"center"});
    return;
  }
  err.classList.remove("show");
  const btn=$("#btn-send"); btn.disabled=true; btn.textContent="Enviando…";
  const payload={}; allKeys().forEach(k=>payload[k]=A[k]); if(A.sexo==="Otro") payload.sexo_otro=A.sexo_otro||"";
  try{
    const r=await fetch(`${URL}/rest/v1/${TABLE}`,{method:"POST",
      headers:{apikey:KEY,Authorization:"Bearer "+KEY,"Content-Type":"application/json",Prefer:"return=minimal"},
      body:JSON.stringify(payload)});
    if(!r.ok){ throw new Error("HTTP "+r.status+" "+(await r.text()).slice(0,120)); }
    $("#form").style.display="none"; document.getElementById("done").style.display="block"; window.scrollTo({top:0});
  }catch(e){ err.textContent="No se pudo enviar: "+(e.message||e); err.classList.add("show"); btn.disabled=false; btn.textContent="Enviar diagnóstico →"; }
}
build();
$("#btn-send").onclick=send;
