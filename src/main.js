import {
  calculate as calc,
  flowToSI as qSI,
  lengthToMeters as len,
  rotationToRps as rotRPS,
  validateInputs as validate,
  viscosityToSI as muSI,
} from './calculations.js';

(() => {
const $=id=>document.getElementById(id);let state=null,raf=null,scenarios=[],scenarioSeq=0;
// Presentación con DOS cifras significativas; ningún cálculo se redondea internamente.
// Se usa redondeo decimal convencional de visualización mediante toPrecision(2).
function sigParts(x){
 x=Number(x);
 if(!Number.isFinite(x))return null;
 if(x===0)return {zero:true};
 const rounded=Number(x.toPrecision(2));
 const exponent=Math.floor(Math.log10(Math.abs(rounded)));
 const mantissa=(rounded/Math.pow(10,exponent)).toFixed(1);
 return {rounded,exponent,mantissa};
}
function formatSig(x,html=false,forceScientific=false){
 const p=sigParts(x);if(!p)return "—";if(p.zero)return "0,0";
 if(forceScientific||Math.abs(p.rounded)>=10000||Math.abs(p.rounded)<0.01){
   return p.mantissa.replace(".",",")+" × 10"+(html?"<sup>"+p.exponent+"</sup>":"^"+p.exponent);
 }
 const digits=Math.max(0,1-p.exponent);
 return p.rounded.toLocaleString("es-CO",{minimumFractionDigits:digits,maximumFractionDigits:digits});
}
function sNum(x){return formatSig(x,false,true)}
function sciHTML(x){return formatSig(x,true,true)}
function dec(x){return formatSig(x,false,false)}
function getInputs(){
 const r1=len($("r1").value,$("r1u").value),r2=len($("r2").value,$("r2u").value),L=len($("L").value,$("Lu").value);
 const dp=len($("dp").value,$("dpu").value),rhoP=Number($("rhoP").value),rho=Number($("rhoL").value),mu=muSI($("mu").value,$("muu").value),g=Number($("g").value);
 const Nraw=Number($("N").value),Nu=$("Nu").value,rps=rotRPS(Nraw,Nu),omega=2*Math.PI*rps,criterion=$("criterion").value;
 const rIni=criterion==="conservative"?r1:criterion==="cut"?(r1+r2)/2:len($("rA").value,$("rAu").value);
 return{r1,r2,L,dp,rhoP,rho,mu,g,Nraw,Nu,rps,omega,criterion,rIni}
}


function criterionName(c){return c==="conservative"?"trayectoria completa r₁→r₂ (McCabe 29.78 / Geankoplis 14.4-11)":c==="cut"?"diámetro de corte, r inicial=(r₁+r₂)/2 (McCabe 29.79 / Geankoplis 14.4-12)":"radio inicial personalizado"}
function flowEquationContent(r){
 const generic1=`<div class="eq">q = <span class="frac"><span class="top">ω<sup>2</sup>(ρ<sub>p</sub>−ρ)D<sub>p</sub><sup>2</sup>V</span><span class="bottom">18 μ ln(r<sub>2</sub>/r<sub>A</sub>)</span></span></div>`;
 const generic2=`<div class="eq">q = <span class="frac"><span class="top">π b (r<sub>2</sub><sup>2</sup>−r<sub>1</sub><sup>2</sup>) ω<sup>2</sup>(ρ<sub>p</sub>−ρ)D<sub>p</sub><sup>2</sup></span><span class="bottom">18 μ ln(r<sub>2</sub>/r<sub>A</sub>)</span></span></div>`;
 let intro='',eq3='',eq4='',note='';
 if(r.criterion==='conservative'){
  intro='<b>Segunda vía: expresión directa de capacidad (Geankoplis, trayectoria completa).</b> Se obtiene sustituyendo el tiempo integrado de Stokes en q = V/t. En este planteamiento r<sub>A</sub> = r<sub>1</sub>.';
  eq3=`<div class="eq">r<sub>A</sub> = r<sub>1</sub> &nbsp;&nbsp;⇒&nbsp;&nbsp; q = <span class="frac"><span class="top">π b (r<sub>2</sub><sup>2</sup>−r<sub>1</sub><sup>2</sup>) ω<sup>2</sup>(ρ<sub>p</sub>−ρ)D<sub>p</sub><sup>2</sup></span><span class="bottom">18 μ ln(r<sub>2</sub>/r<sub>1</sub>)</span></span></div>`;
  eq4='<div class="eq">ln(r<sub>2</sub>/r<sub>A</sub>) = ln(r<sub>2</sub>/r<sub>1</sub>)</div>';
  note='<b>Advertencia de lectura:</b> el argumento de ln debe ser adimensional. La fórmula reproducida en la imagen contiene caracteres que parecen indicar una suma de un radio con el logaritmo; esa lectura no es dimensionalmente válida. Se muestra aquí la expresión derivada de la integración de Stokes. Para la trayectoria completa, r<sub>A</sub> = r<sub>1</sub>.';
 } else if(r.criterion==='cut'){
  intro='<b>Segunda vía: expresión directa de capacidad (Geankoplis, criterio de radio medio).</b> Se obtiene sustituyendo el tiempo integrado de Stokes en q = V/t. En este criterio representativo, r<sub>A</sub> = (r<sub>1</sub>+r<sub>2</sub>)/2.';
  eq3=`<div class="eq">r<sub>A</sub> = <span class="frac"><span class="top">r<sub>1</sub>+r<sub>2</sub></span><span class="bottom">2</span></span> &nbsp;&nbsp;⇒&nbsp;&nbsp; q = <span class="frac"><span class="top">π b (r<sub>2</sub><sup>2</sup>−r<sub>1</sub><sup>2</sup>) ω<sup>2</sup>(ρ<sub>p</sub>−ρ)D<sub>p</sub><sup>2</sup></span><span class="bottom">18 μ ln[r<sub>2</sub> / ((r<sub>1</sub>+r<sub>2</sub>)/2)]</span></span></div>`;
  eq4=`<div class="eq">q = <span class="frac"><span class="top">π b (r<sub>2</sub><sup>2</sup>−r<sub>1</sub><sup>2</sup>) ω<sup>2</sup>(ρ<sub>p</sub>−ρ)D<sub>p</sub><sup>2</sup></span><span class="bottom">18 μ ln[2r<sub>2</sub>/(r<sub>1</sub>+r<sub>2</sub>)]</span></span></div>`;
  note='<b>Advertencia de lectura:</b> el argumento de ln debe ser adimensional. Se muestra aquí la expresión derivada de la integración de Stokes. Para el criterio de radio medio, se sustituye r<sub>A</sub> = (r<sub>1</sub>+r<sub>2</sub>)/2, de modo que el término logarítmico puede escribirse como ln[2r<sub>2</sub>/(r<sub>1</sub>+r<sub>2</sub>)] (forma usual de Geankoplis para el corte ideal).';
 } else {
  intro='<b>Segunda vía: expresión directa de capacidad (radio inicial personalizado).</b> Se obtiene sustituyendo el tiempo integrado de Stokes en q = V/t. En este caso se conserva r<sub>A</sub> como radio inicial elegido por el usuario.';
  eq3=`<div class="eq">r<sub>A</sub> = ${sciHTML(r.rIni,2)} m &nbsp;&nbsp;⇒&nbsp;&nbsp; q = <span class="frac"><span class="top">π b (r<sub>2</sub><sup>2</sup>−r<sub>1</sub><sup>2</sup>) ω<sup>2</sup>(ρ<sub>p</sub>−ρ)D<sub>p</sub><sup>2</sup></span><span class="bottom">18 μ ln(r<sub>2</sub>/r<sub>A</sub>)</span></span></div>`;
  eq4=`<div class="eq">ln(r<sub>2</sub>/r<sub>A</sub>) = ln(${sciHTML(r.r2,2)} / ${sciHTML(r.rIni,2)})</div>`;
  note='<b>Advertencia de lectura:</b> el argumento de ln debe ser adimensional. Se muestra aquí la expresión derivada de la integración de Stokes, con el radio inicial personalizado que el usuario defina.';
 }
 return {intro,generic1,generic2,eq3,eq4,note};
}
function update(){
 const x=getInputs(),errs=validate(x);$("validation").innerHTML=errs.length?`<div class="callout bad"><b>Revise los datos:</b><br>${errs.join("<br>")}</div>`:"";if(errs.length){state=null;["deltaRho","omega","vol","u2","tSet","qCap","Re","ac2","Gfactor","uavg","ug","rIni","regimeBox"].forEach(id=>$(id).textContent="—"); return}
 const r=calc(x);state=r;
 $("deltaRho").innerHTML=`${dec(r.dRho,3)} kg/m³`;$("omega").innerHTML=`${dec(r.omega,5)} rad/s`;$("vol").innerHTML=`${sciHTML(r.V,5)} m³`;
 $("u2").innerHTML=`${sciHTML(r.u2,5)} m/s`;$("tSet").innerHTML=`${dec(r.t,2)} s<br><span class="small">${dec(r.t/3600,4)} h</span>`;
 $("qCap").innerHTML=`${sciHTML(r.qCap,5)} m³/s<br><span class="small">${dec(r.qCap*3.6e6,4)} L/h</span>`;
 $("Re").innerHTML=sciHTML(r.Re,4);$("ac2").innerHTML=`${dec(r.ac2,5)} m/s²`;$("Gfactor").innerHTML=`${dec(r.G,5)} g`;
 $("uavg").innerHTML=`${sciHTML(r.uavg,5)} m/s`;$("ug").innerHTML=`${sciHTML(r.ug,5)} m/s`;$("rIni").innerHTML=`${dec(r.rIni*1000,5)} mm`;
 let cls="ok",label="Stokes: aproximación razonable";if(r.Re>=0.1&&r.Re<1){cls="warn";label="Aproximación de Stokes: comprobar error de arrastre"}if(r.Re>=1){cls="bad";label="Stokes no recomendable: utilizar correlación de arrastre"}
 $("regimeBox").innerHTML=`<div class="callout ${cls}"><b>${label}</b>. Reₚ = ${sciHTML(r.Re,4)}.</div>`;
 $("stepDensity").textContent=`Δρ = ${dec(r.rhoP,4)} − ${dec(r.rho,4)} kg/m³`;$("resDensity").textContent=`Δρ = ${dec(r.dRho,4)} kg/m³`;
 let conv=r.Nu==="rph"?`${dec(r.Nraw,4)} rev/h ÷ 3600 = ${dec(r.rps,7)} rev/s`:r.Nu==="rpm"?`${dec(r.Nraw,4)} rev/min ÷ 60 = ${dec(r.rps,7)} rev/s`:`${dec(r.rps,7)} rev/s`;
 $("stepOmega").textContent=`N = ${conv}\nω = 2π(${dec(r.rps,7)})`;$("resOmega").textContent=`ω = ${dec(r.omega,7)} rad/s`;
 $("stepVelocity").textContent=`u(r₂) = [(${sNum(r.dp,5)})² (${dec(r.omega,5)})² (${dec(r.dRho,4)}) (${sNum(r.r2,5)})] / [18(${dec(r.mu,6)})]`;$("resVelocity").textContent=`u(r₂) = ${sNum(r.u2,6)} m/s`;
 $("stepTime").textContent=`t = [18(${dec(r.mu,6)}) / ((${sNum(r.dp,5)})² (${dec(r.omega,5)})² (${dec(r.dRho,4)}))] · ln(${sNum(r.r2,5)} / ${sNum(r.rIni,5)})\nCriterio: ${criterionName(r.criterion)}`;$("resTime").textContent=`t = ${dec(r.t,4)} s = ${dec(r.t/3600,5)} h`;
 $("stepVolume").textContent=`V = π(${dec(r.L,6)})[(${sNum(r.r2,5)})² − (${sNum(r.r1,5)})²]`;$("resVolume").textContent=`V = ${sNum(r.V,6)} m³`;
 const flowEq=flowEquationContent(r);
 $("flowDirectIntro").innerHTML=flowEq.intro;
 $("flowDirectEq1").innerHTML=flowEq.generic1;
 $("flowDirectEq2").innerHTML=flowEq.generic2;
 $("flowDirectEq3").innerHTML=flowEq.eq3;
 $("flowDirectEq4").innerHTML=flowEq.eq4;
 $("flowDirectNote").innerHTML=flowEq.note;
 $("stepFlow").textContent=`q = ${sNum(r.V,6)} m³ / ${dec(r.t,4)} s`;$("resFlow").textContent=`q = ${sNum(r.qCap,6)} m³/s = ${dec(r.qCap*3.6e6,5)} L/h`;
 $("stepFlowDirect").textContent=`q = [(${sNum(r.omega,2)})² × (${sNum(r.dRho,2)}) × (${sNum(r.dp,2)})² × (${sNum(r.V,2)})] / [18 × (${sNum(r.mu,2)}) × ln(${sNum(r.r2,2)}/${sNum(r.rIni,2)})]
Los valores mostrados están redondeados a dos cifras significativas; el cálculo utiliza los datos originales completos.`;
 $("resFlowDirect").textContent=`q directo = ${sNum(r.qDirect,2)} m³/s = ${sNum(r.qDirect*3.6e6,2)} L/h`;
 const relDiff=Math.abs(r.qDirect-r.qCap)/r.qCap;
 $("flowCheck").className=`callout ${relDiff<1e-10?"ok":"warn"}`;
 $("flowCheck").textContent=relDiff<1e-10?"Comprobación: q = V/t y q por la ecuación directa coinciden (sin redondear los valores intermedios).":"Advertencia: las dos vías no coincidieron numéricamente. Revise los parámetros.";
 $("stepRe").textContent=`Reₚ = (${dec(r.rho,4)})(${sNum(r.u2,5)})(${sNum(r.dp,5)}) / (${dec(r.mu,6)})`;$("resRe").textContent=`Reₚ = ${sNum(r.Re,6)} → ${label}`;
 updateDiagram();drawVelocity();evaluateOperatingFlow(false);refreshScenarios()
}
function updateDiagram(){if(!state)return;const map=r=>270+70+(r-state.r1)/(state.r2-state.r1)*65,x=Math.max(340,Math.min(405,map(state.rIni)));$("startMark").setAttribute("cx",x);$("particle").setAttribute("cx",x);$("pathText").textContent=`${criterionName(state.criterion)} | r inicial = ${dec(state.rIni*1000,4)} mm`;$("animText").textContent="Presione “Animar trayectoria”"}
function animate(){if(!state)return;if(raf!==null)cancelAnimationFrame(raf);const map=r=>270+70+(r-state.r1)/(state.r2-state.r1)*65,dur=Number($("animDuration").value)||5000,start=performance.now();function f(now){const p=Math.min(1,(now-start)/dur),tp=p*state.t,r=Math.min(state.r2,state.rIni*Math.exp(state.K*tp));$("particle").setAttribute("cx",map(r));$("animText").textContent=`Tiempo físico representado: ${dec(tp,0)} s / ${dec(state.t,0)} s`;if(p<1)raf=requestAnimationFrame(f);else {raf=null;$("animText").textContent=`La partícula alcanza r₂ en ${dec(state.t,2)} s`;} }raf=requestAnimationFrame(f)}
function svgEl(n,a={},txt=""){const e=document.createElementNS("http://www.w3.org/2000/svg",n);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));if(txt)e.textContent=txt;return e}
function clear(id){const e=$(id);while(e.firstChild)e.removeChild(e.firstChild);return e}
function axisLabel(svg,text,x,y,rotate=false){svg.appendChild(svgEl("text",{x,y,"text-anchor":"middle",fill:"#334155","font-size":"12","font-weight":"700",transform:rotate?`rotate(-90 ${x} ${y})`:""},text))}
function drawVelocity(){if(!state)return;const svg=clear("velocityChart"),W=620,H=330,m={l:88,r:20,t:35,b:60},iw=W-m.l-m.r,ih=H-m.t-m.b,max=state.u2*1.12;
 svg.appendChild(svgEl("text",{x:W/2,y:20,"text-anchor":"middle",fill:"#172033","font-size":"14","font-weight":"800"},"Perfil de velocidad radial"));
 for(let i=0;i<=4;i++){const y=m.t+ih*i/4;svg.appendChild(svgEl("line",{x1:m.l,y1:y,x2:W-m.r,y2:y,stroke:"#e2e8f0"}));svg.appendChild(svgEl("text",{x:m.l-9,y:y+4,"text-anchor":"end",fill:"#64748b","font-size":"10"},sNum(max*(1-i/4),1)))}
 svg.appendChild(svgEl("line",{x1:m.l,y1:m.t,x2:m.l,y2:H-m.b,stroke:"#334155"}));svg.appendChild(svgEl("line",{x1:m.l,y1:H-m.b,x2:W-m.r,y2:H-m.b,stroke:"#334155"}));
 let pts=[];for(let i=0;i<=40;i++){const rr=state.r1+(state.r2-state.r1)*i/40,u=state.K*rr,x=m.l+(rr-state.r1)/(state.r2-state.r1)*iw,y=m.t+(1-u/max)*ih;pts.push(`${x},${y}`)}svg.appendChild(svgEl("polyline",{points:pts.join(" "),fill:"none",stroke:"#1d4ed8","stroke-width":"4"}));
 [state.r1,state.rIni,state.r2].forEach((rr,i)=>{const x=m.l+(rr-state.r1)/(state.r2-state.r1)*iw,y=m.t+(1-state.K*rr/max)*ih;svg.appendChild(svgEl("circle",{cx:x,cy:y,r:5,fill:i===1?"#7c3aed":"#1d4ed8"}));svg.appendChild(svgEl("text",{x,y:H-m.b+20,"text-anchor":"middle",fill:"#475569","font-size":"10"},i===0?"r₁":i===1?"r inicial":"r₂"))});
 axisLabel(svg,"Radio, r [m]",W/2,H-12);axisLabel(svg,"Velocidad radial, uₜ [m/s]",18,H/2,true)
}
function evaluateOperatingFlow(show=true){
 if(!state)return;const q=qSI($("Qop").value,$("Qopu").value);
 if(!Number.isFinite(q)||q<0){$("separationBox").className="callout bad";$("separationBox").textContent="Ingrese un caudal válido mayor o igual a cero.";return}if(!(q>0)){$("tRes").value="No evaluado";$("rExit").value="No evaluado";$("separationBox").className="callout info";$("separationBox").innerHTML="Ingrese qop solo si desea evaluar una condición real de operación. No afecta el cálculo básico.";return}
 const tr=state.V/q,sep=tr>=state.t,rB=sep?state.r2:state.rIni*Math.exp(state.K*tr);
 $("tRes").value=`${dec(tr,3)} s`;$("rExit").value=`${dec(Math.min(rB,state.r2)*1000,4)} mm`;
 $("separationBox").className=`callout ${sep?"ok":"bad"}`;$("separationBox").innerHTML=sep?`<b>Captura prevista para esta partícula, bajo el modelo ideal.</b> qop = ${sciHTML(q,4)} m³/s ≤ q límite = ${sciHTML(state.qCap,4)} m³/s. La partícula dispone de tiempo suficiente para alcanzar r₂.`:`<b>No alcanza la pared bajo el modelo ideal.</b> qop = ${sciHTML(q,4)} m³/s > q límite = ${sciHTML(state.qCap,4)} m³/s. El tiempo de residencia es menor que el tiempo requerido.`
}
function solveUnknown(){if(!state)return;const Q=qSI($("Qtarget").value,$("Qtargetu").value);if(!(Q>0)){$("unknownResult").value="qobj debe ser > 0";return}
 const x=state,d=x.dRho,A=Math.PI*x.L*(x.r2*x.r2-x.r1*x.r1),ln=Math.log(x.r2/x.rIni),u=$("unknown").value;let val,unit,formula,extra="";
 if(u==="dp"){val=Math.sqrt(18*x.mu*Q*ln/(A*d*x.omega*x.omega));unit="m";formula="Dpc = √[18 μ qobj ln(r₂/rinicial) / {πb Δρ ω²(r₂²−r₁²)}]";extra=` = ${dec(val*1e6,3)} µm`}
 if(u==="mu"){val=A*d*x.dp*x.dp*x.omega*x.omega/(18*Q*ln);unit="Pa·s";formula="μ = πb Δρ Dp² ω²(r₂²−r₁²) / [18 qobj ln(r₂/rinicial)]";extra=` = ${dec(val*1000,3)} cP`}
 if(u==="N"){const om=Math.sqrt(18*x.mu*Q*ln/(A*d*x.dp*x.dp));val=om/(2*Math.PI)*60;unit="rpm";formula="ω = √[18 μ qobj ln(r₂/rinicial) / {πb Δρ Dp²(r₂²−r₁²)}]";extra=` = ${dec(val/60,4)} rev/s`}
 if(u==="rhoP"){val=x.rho+18*x.mu*Q*ln/(A*x.dp*x.dp*x.omega*x.omega);unit="kg/m³";formula="ρp = ρ + 18 μ qobj ln(r₂/rinicial) / [πb Dp² ω²(r₂²−r₁²)]"}
 if(u==="L"){val=18*x.mu*Q*ln/(Math.PI*d*x.dp*x.dp*x.omega*x.omega*(x.r2*x.r2-x.r1*x.r1));unit="m";formula="b = 18 μ qobj ln(r₂/rinicial) / [π Δρ Dp² ω²(r₂²−r₁²)]";extra=` = ${dec(val*1000,3)} mm`}
 if(!Number.isFinite(val)||val<=0){$("unknownResult").value="Sin solución física";$("inverseSteps").textContent="La solución no es válida para los datos actuales.";return}
  const trial={...x};if(u==="dp")trial.dp=val;if(u==="mu")trial.mu=val;if(u==="N")trial.omega=val/60*2*Math.PI;if(u==="rhoP")trial.rhoP=val;if(u==="L")trial.L=val;
  const check=calc(trial);const physicalNote=check.Re<0.1?"Stokes plausible (Reₚ < 0,1).":check.Re<1?"Cautela: Reₚ ≥ 0,1; Stokes puede perder precisión.":"Advertencia: Reₚ ≥ 1; este resultado exige un modelo de arrastre distinto.";
  $("unknownResult").value=`${sNum(val,6)} ${unit}`;$("inverseSteps").innerHTML=`<b>Capacidad objetivo:</b> ${sciHTML(Q,5)} m³/s<br><b>Criterio:</b> ${criterionName(x.criterion)}; r inicial = ${dec(x.rIni*1000,5)} mm.<br><br><b>Despeje:</b> ${formula}<br><b>Resultado:</b> ${sNum(val,6)} ${unit}${extra}<br><b>Verificación:</b> Reₚ = ${sciHTML(check.Re,4)}; ${physicalNote}<br>Campo relativo en pared = ${dec(check.G,2)} g. Resultado ideal, sujeto a condiciones del equipo.`
}

/* Escenarios multivariables */
function mainScenarioData(name="Caso principal"){const x=getInputs();return{name,mu:x.mu*1000,rhoP:x.rhoP,rho:x.rho,dp:x.dp*1e6,N:x.Nraw,Nu:x.Nu,Qop:0}}
function addScenario(data=null){scenarioSeq++;scenarios.push({id:scenarioSeq,...(data||mainScenarioData(`Escenario ${scenarioSeq}`))});renderScenarioEditor();refreshScenarios()}
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}
function renderScenarioEditor(){
 const ed=$("scenarioEditor");ed.innerHTML=scenarios.map(s=>`<div class="scenario-card" data-id="${s.id}">
 <div class="scenario-top"><input class="sc-name" value="${escapeHTML(s.name)}"><button class="dangerBtn no-print sc-remove" data-id="${s.id}">Eliminar</button></div>
 <div class="scenario-grid">
  <div><label>μ [cP]</label><input class="sc-mu" type="number" value="${s.mu}" step="any"></div>
  <div><label>ρp [kg/m³]</label><input class="sc-rhop" type="number" value="${s.rhoP}" step="any"></div>
  <div><label>ρ líquido [kg/m³]</label><input class="sc-rho" type="number" value="${s.rho}" step="any"></div>
  <div><label>Dp [µm]</label><input class="sc-dp" type="number" value="${s.dp}" step="any"></div>
  <div><label>N</label><input class="sc-N" type="number" value="${s.N}" step="any"></div>
  <div><label>Unidad N</label><select class="sc-Nu"><option value="rph"${s.Nu==="rph"?" selected":""}>rph</option><option value="rpm"${s.Nu==="rpm"?" selected":""}>rpm</option><option value="rps"${s.Nu==="rps"?" selected":""}>rps</option></select></div>
  <div><label>qop opcional [L/h]</label><input class="sc-qop" type="number" value="${s.Qop||0}" step="any"></div>
 </div></div>`).join("");
 ed.querySelectorAll(".sc-remove").forEach(b=>b.onclick=()=>{scenarios=scenarios.filter(s=>s.id!==Number(b.dataset.id));renderScenarioEditor();refreshScenarios()});
}
function readScenarioCards(){
 const base=getInputs(),arr=[];
 document.querySelectorAll(".scenario-card").forEach(card=>{
  const name=card.querySelector(".sc-name").value||"Escenario",mu=Number(card.querySelector(".sc-mu").value)/1000,rhoP=Number(card.querySelector(".sc-rhop").value),rho=Number(card.querySelector(".sc-rho").value),dp=Number(card.querySelector(".sc-dp").value)/1e6,Nraw=Number(card.querySelector(".sc-N").value),Nu=card.querySelector(".sc-Nu").value,rps=rotRPS(Nraw,Nu),omega=2*Math.PI*rps,Qop=Number(card.querySelector(".sc-qop").value)/1000/3600;
  const x={...base,name,mu,rhoP,rho,dp,Nraw,Nu,rps,omega};if(validate(x).length===0&&Number.isFinite(Qop)&&Qop>=0){const r=calc(x);arr.push({...r,name,Qop})}else{arr.push({...x,name,invalid:true,Qop})}
 });return arr
}
function refreshScenarios(){if(!state||!scenarios.length)return;const arr=readScenarioCards();$("cmpBody").innerHTML=arr.map(r=>{if(r.invalid)return `<tr><td><b>${escapeHTML(r.name)}</b></td><td colspan="13" style="text-align:left;color:#b91c1c">Datos inválidos: revise densidades, tamaño, viscosidad, velocidad, radios o caudal.</td></tr>`;const ratio=r.Qop>0?r.Qop/r.qCap:NaN,sep=r.Qop>0?(ratio<=1?"Sí":"No"):"—";return`<tr><td><b>${escapeHTML(r.name)}</b></td><td>${dec(r.mu*1000,2)}</td><td>${dec(r.rhoP,1)}</td><td>${dec(r.rho,1)}</td><td>${dec(r.dp*1e6,2)}</td><td>${dec(r.Nraw,2)} ${r.Nu}</td><td>${dec(r.dRho,2)}</td><td>${dec(r.t,2)}</td><td>${sNum(r.u2,3)}</td><td>${dec(r.qCap*3.6e6,4)}</td><td>${sNum(r.Re,2)}</td><td>${dec(r.G,3)} g</td><td>${isFinite(ratio)?dec(ratio,3):"—"}</td><td>${sep}</td></tr>`}).join("");drawScenarioChart("flowChart",arr.filter(r=>!r.invalid),"flow");drawScenarioChart("timeChart",arr.filter(r=>!r.invalid),"time")}
function drawScenarioChart(id,arr,type){
 const svg=clear(id),W=620,H=340,m={l:88,r:20,t:42,b:70},iw=W-m.l-m.r,ih=H-m.t-m.b;
 if(!arr.length)return;const vals=type==="flow"?arr.flatMap(r=>[r.qCap*3.6e6,r.Qop>0?r.Qop*3.6e6:0]):arr.map(r=>r.t),max=Math.max(...vals)*1.16||1,title=type==="flow"?"Capacidad de clarificación por escenario":"Tiempo de precipitación por escenario",ylab=type==="flow"?"Caudal volumétrico, q [L/h]":"Tiempo de precipitación, t [s]";
 svg.appendChild(svgEl("text",{x:W/2,y:20,"text-anchor":"middle",fill:"#172033","font-size":"14","font-weight":"800"},title));
 for(let i=0;i<=4;i++){const y=m.t+ih*i/4;svg.appendChild(svgEl("line",{x1:m.l,y1:y,x2:W-m.r,y2:y,stroke:"#e2e8f0"}));svg.appendChild(svgEl("text",{x:m.l-9,y:y+4,"text-anchor":"end",fill:"#64748b","font-size":"10"},type==="flow"?dec(max*(1-i/4),3):dec(max*(1-i/4),0)))}
 const gw=iw/arr.length,bw=Math.min(54,gw*.28);
 arr.forEach((r,i)=>{const center=m.l+gw*(i+.5),v=type==="flow"?r.qCap*3.6e6:r.t,bh=v/max*ih;svg.appendChild(svgEl("rect",{x:center-bw/2,y:m.t+ih-bh,width:bw,height:bh,rx:5,fill:type==="flow"?"#059669":"#1d4ed8"}));if(type==="flow"&&r.Qop>0){const qo=r.Qop*3.6e6,bho=qo/max*ih;svg.appendChild(svgEl("rect",{x:center+bw*.65,y:m.t+ih-bho,width:bw*.55,height:bho,rx:4,fill:"#d97706"}))}svg.appendChild(svgEl("text",{x:center,y:H-m.b+20,"text-anchor":"middle",fill:"#334155","font-size":"10"},r.name.length>13?r.name.slice(0,12)+"…":r.name))});
 axisLabel(svg,"Escenario",W/2,H-12);axisLabel(svg,ylab,18,H/2,true)
}
function restore(){
 if(raf!==null){cancelAnimationFrame(raf);raf=null;}$("Qopu").value="m3s";$("Qtarget").value="2.3681e-9";$("Qtargetu").value="m3s";$("unknown").value="dp";$("animDuration").value="5000";
 $("r1").value=3.52;$("r1u").value="mm";$("r2").value=6.58;$("r2u").value="mm";$("L").value=185;$("Lu").value="mm";$("dp").value=.0885;$("dpu").value="mm";$("rhoP").value=1256;$("rhoL").value=968;$("mu").value=1820;$("muu").value="cP";$("g").value=9.81;$("N").value=12900;$("Nu").value="rph";$("criterion").value="conservative";$("customRABox").classList.add("hidden");$("Qop").value=0;scenarios=[{id:1,name:"Fluido A",mu:1820,rhoP:1256,rho:968,dp:88.5,N:12900,Nu:"rph",Qop:0},{id:2,name:"Fluido B",mu:750,rhoP:1256,rho:968,dp:88.5,N:12900,Nu:"rph",Qop:0},{id:3,name:"Fluido C",mu:425,rhoP:1256,rho:968,dp:88.5,N:12900,Nu:"rph",Qop:0}];scenarioSeq=3;renderScenarioEditor();update()
}
$("criterion").addEventListener("change",()=>{$("customRABox").classList.toggle("hidden",$("criterion").value!=="custom");update()});
["r1","r2","L","dp","rhoP","rhoL","mu","g","N","rA","r1u","r2u","Lu","dpu","muu","Nu","rAu"].forEach(id=>$(id).addEventListener("change",update));
$("printBtn").onclick=()=>window.print();$("calcBtn").onclick=update;$("animateBtn").onclick=animate;$("sampleBtn").onclick=restore;$("evalFlowBtn").onclick=()=>evaluateOperatingFlow(true);$("solveBtn").onclick=solveUnknown;$("compareBtn").onclick=refreshScenarios;
$("addScenarioBtn").onclick=()=>addScenario();$("copyMainBtn").onclick=()=>addScenario(mainScenarioData(`Copia ${scenarioSeq+1}`));
scenarios=[{id:++scenarioSeq,name:"Fluido A",mu:1820,rhoP:1256,rho:968,dp:88.5,N:12900,Nu:"rph",Qop:0},{id:++scenarioSeq,name:"Fluido B",mu:750,rhoP:1256,rho:968,dp:88.5,N:12900,Nu:"rph",Qop:0},{id:++scenarioSeq,name:"Fluido C",mu:425,rhoP:1256,rho:968,dp:88.5,N:12900,Nu:"rph",Qop:0}];
renderScenarioEditor();update()
})();
