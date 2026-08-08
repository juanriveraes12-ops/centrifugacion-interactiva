import { CONSTANTS as C, calculate, rotation } from './calculations.js';

(() => {
  const $ = id => document.getElementById(id);
  let animationCriterion = "conservative";
  let raf = null;

  function currentMuCp(){
    return $("viscosity").value === "custom"
      ? Math.max(0.001, Number($("customMu").value) || 1000)
      : Number($("viscosity").value);
  }

  function currentRotation(){
    const unit = $("rotUnit").value;
    return { unit, ...rotation(C.rotationValue, unit) };
  }

  function calc(muCp, criterion, rot = currentRotation()){
    return calculate(muCp, criterion, rot);
  }

  function sci(x, digits=4){
    if(x === 0) return "0";
    const e = Math.floor(Math.log10(Math.abs(x)));
    const m = x / Math.pow(10,e);
    return `${m.toFixed(digits).replace(".",",")} × 10<sup>${e}</sup>`;
  }

  function plainSci(x, digits=4){
    if(x === 0) return "0";
    const e = Math.floor(Math.log10(Math.abs(x)));
    const m = x / Math.pow(10,e);
    return `${m.toFixed(digits).replace(".",",")} × 10^${e}`;
  }

  function decimal(x, digits=2){
    return x.toLocaleString("es-CO",{maximumFractionDigits:digits,minimumFractionDigits:digits});
  }

  function update(){
    if(raf) cancelAnimationFrame(raf);
    const muCp = currentMuCp();
    const rot = currentRotation();
    const cons = calc(muCp,"conservative",rot);
    const cut = calc(muCp,"cut",rot);

    $("selectedText").textContent = `Viscosidad seleccionada: ${decimal(muCp, muCp%1 ? 2 : 0)} cP`;
    $("tCons").innerHTML = `${decimal(cons.t,2)} s <span class="note">(${decimal(cons.t/3600,3)} h)</span>`;
    $("tCut").innerHTML = `${decimal(cut.t,2)} s <span class="note">(${decimal(cut.t/3600,3)} h)</span>`;
    $("uAvgCons").innerHTML = `${sci(cons.uAvg)} m/s`;
    $("uAvgCut").innerHTML = `${sci(cut.uAvg)} m/s`;
    $("qCons").innerHTML = `${sci(cons.Q)} m³/s`;
    $("qCut").innerHTML = `${sci(cut.Q)} m³/s`;
    $("uWall").innerHTML = `${sci(cons.uWall)} m/s`;

    $("stepMu").textContent =
      `μ = ${decimal(muCp,2)} cP × 10⁻³ = ${decimal(cons.mu,6)} Pa·s`;
    $("stepOmega").textContent =
      rot.unit === "rph"
        ? `N = 12 900/3600 = ${decimal(rot.rps,5)} rev/s;  ω = 2πN = ${decimal(rot.omega,5)} rad/s`
        : `N = 12 900/60 = ${decimal(rot.rps,5)} rev/s;  ω = 2πN = ${decimal(rot.omega,5)} rad/s`;
    $("stepK").textContent =
      `K = dₚ²Δρω²/(18μ) = ${plainSci(cons.K,5)} s⁻¹`;
    $("stepU").textContent =
      `u(r₂) = Kr₂ = (${plainSci(cons.K,5)})(${plainSci(C.r2,3)}) = ${plainSci(cons.uWall,5)} m/s`;
    $("stepT").textContent =
      `Conservador: t = ln(r₂/r₁)/K = ${decimal(cons.t,2)} s\n`+
      `Diámetro de corte: t = ln(r₂/rₘ)/K = ${decimal(cut.t,2)} s`;
    $("stepQ").textContent =
      `Conservador: Q = V/t = ${plainSci(cons.Q,5)} m³/s\n`+
      `Diámetro de corte: Q = V/t = ${plainSci(cut.Q,5)} m³/s`;

    const ratio = cut.Q/cons.Q;
    $("interpretation").innerHTML =
      `Para <b>${decimal(muCp,0)} cP</b>, el criterio de diámetro de corte reduce el tiempo desde `+
      `<b>${decimal(cons.t,1)} s</b> hasta <b>${decimal(cut.t,1)} s</b> y permite un caudal `+
      `<b>${decimal(ratio,3)} veces mayor</b>. La velocidad local en r₂ no cambia porque depende de K y r₂, no del radio de partida.`;

    $("rotationWarning").innerHTML = rot.unit === "rph"
      ? `Se usa el dato literal: <b>12 900 rph = 215 rpm</b>. Esta velocidad genera aceleraciones centrífugas y caudales relativamente bajos.`
      : `Escenario alternativo: <b>12 900 rpm</b>. Frente a 12 900 rph, ω es 60 veces mayor; u y Q aumentan 3600 veces y t disminuye 3600 veces.`;

    resetParticle();
    drawVelocityChart(muCp,rot);
    drawFlowChart(rot);
    buildTable(rot);
  }

  function resetParticle(){
    const ri = animationCriterion === "conservative" ? C.r1 : C.rm;
    const x = radialToX(ri);
    $("particle").setAttribute("cx",x);
    $("startMark").setAttribute("cx",x);
    $("criterionLabel").textContent = animationCriterion === "conservative"
      ? "Inicio: radio interno r₁"
      : "Inicio: radio medio rₘ (diámetro de corte)";
    $("animStatus").textContent = "Seleccione “Animar partícula”";
  }

  function radialToX(r){
    const innerPx=71, outerPx=132;
    const px = innerPx + (r-C.r1)/(C.r2-C.r1)*(outerPx-innerPx);
    return 260 + px;
  }

  function animate(){
    if(raf) cancelAnimationFrame(raf);
    const muCp=currentMuCp();
    const result=calc(muCp,animationCriterion);
    const ri=result.ri;
    const tReal=result.t;
    const duration=5500;
    const start=performance.now();

    function frame(now){
      const p=Math.min(1,(now-start)/duration);
      const physicalT=p*tReal;
      const r=ri*Math.exp(result.K*physicalT);
      $("particle").setAttribute("cx",radialToX(Math.min(r,C.r2)));
      $("animStatus").textContent =
        `Tiempo físico representado: ${decimal(physicalT,0)} s de ${decimal(tReal,0)} s`;
      if(p<1) raf=requestAnimationFrame(frame);
      else $("animStatus").textContent=`La partícula alcanzó r₂ en ${decimal(tReal,2)} s`;
    }
    raf=requestAnimationFrame(frame);
  }

  function svgEl(name, attrs={}, text=""){
    const el=document.createElementNS("http://www.w3.org/2000/svg",name);
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
    if(text) el.textContent=text;
    return el;
  }

  function clearSvg(id){
    const el=$(id); while(el.firstChild) el.removeChild(el.firstChild); return el;
  }

  function drawVelocityChart(muCp,rot){
    const svg=clearSvg("velocityChart");
    const W=580,H=310,m={l:72,r:22,t:24,b:54};
    const innerW=W-m.l-m.r, innerH=H-m.t-m.b;
    const result=calc(muCp,"conservative",rot);
    const maxU=result.uWall*1.12;

    svg.appendChild(svgEl("rect",{x:0,y:0,width:W,height:H,fill:"#fff"}));
    for(let i=0;i<=4;i++){
      const y=m.t+innerH*i/4;
      svg.appendChild(svgEl("line",{x1:m.l,y1:y,x2:W-m.r,y2:y,stroke:"#e2e8f0"}));
      const val=maxU*(1-i/4);
      svg.appendChild(svgEl("text",{x:m.l-10,y:y+4,"text-anchor":"end",fill:"#64748b","font-size":"11"},plainSci(val,1)));
    }
    svg.appendChild(svgEl("line",{x1:m.l,y1:m.t,x2:m.l,y2:H-m.b,stroke:"#334155"}));
    svg.appendChild(svgEl("line",{x1:m.l,y1:H-m.b,x2:W-m.r,y2:H-m.b,stroke:"#334155"}));

    const pts=[];
    for(let i=0;i<=30;i++){
      const r=C.r1+(C.r2-C.r1)*i/30;
      const u=result.K*r;
      const x=m.l+(r-C.r1)/(C.r2-C.r1)*innerW;
      const y=m.t+(1-u/maxU)*innerH;
      pts.push(`${x},${y}`);
    }
    svg.appendChild(svgEl("polyline",{points:pts.join(" "),fill:"none",stroke:"#2563eb","stroke-width":"4"}));

    [C.r1,C.rm,C.r2].forEach((r,i)=>{
      const x=m.l+(r-C.r1)/(C.r2-C.r1)*innerW;
      svg.appendChild(svgEl("line",{x1:x,y1:H-m.b,x2:x,y2:H-m.b+6,stroke:"#334155"}));
      svg.appendChild(svgEl("text",{x,y:H-m.b+22,"text-anchor":"middle",fill:"#475569","font-size":"11"},
        i===0?"r₁ 3,52":i===1?"rₘ 5,05":"r₂ 6,58"));
    });
    svg.appendChild(svgEl("text",{x:W/2,y:H-10,"text-anchor":"middle",fill:"#334155","font-size":"12","font-weight":"700"},"Radio, mm"));
    const yLabel=svgEl("text",{x:15,y:H/2,fill:"#334155","font-size":"12","font-weight":"700",transform:`rotate(-90 15 ${H/2})`},"Velocidad, m/s");
    svg.appendChild(yLabel);
  }

  function drawFlowChart(rot){
    const svg=clearSvg("flowChart");
    const W=580,H=310,m={l:64,r:18,t:26,b:62};
    const mus=[1820,750,425];
    const vals=[];
    mus.forEach(mu=>{
      vals.push(calc(mu,"conservative",rot).Q);
      vals.push(calc(mu,"cut",rot).Q);
    });
    const max=Math.max(...vals)*1.16;
    const innerW=W-m.l-m.r,innerH=H-m.t-m.b;
    svg.appendChild(svgEl("rect",{x:0,y:0,width:W,height:H,fill:"#fff"}));
    for(let i=0;i<=4;i++){
      const y=m.t+innerH*i/4;
      svg.appendChild(svgEl("line",{x1:m.l,y1:y,x2:W-m.r,y2:y,stroke:"#e2e8f0"}));
      svg.appendChild(svgEl("text",{x:m.l-8,y:y+4,"text-anchor":"end",fill:"#64748b","font-size":"10"},
        plainSci(max*(1-i/4),1)));
    }
    const groupW=innerW/3,barW=groupW*.26;
    mus.forEach((mu,idx)=>{
      const q1=calc(mu,"conservative",rot).Q;
      const q2=calc(mu,"cut",rot).Q;
      const center=m.l+groupW*(idx+.5);
      [[q1,-barW*.62,"#2563eb"],[q2,barW*.62,"#059669"]].forEach(([q,off,color])=>{
        const bh=q/max*innerH;
        svg.appendChild(svgEl("rect",{x:center+off-barW/2,y:m.t+innerH-bh,width:barW,height:bh,rx:5,fill:color}));
      });
      svg.appendChild(svgEl("text",{x:center,y:H-m.b+22,"text-anchor":"middle",fill:"#334155","font-size":"12","font-weight":"700"},`${mu} cP`));
    });
    svg.appendChild(svgEl("rect",{x:150,y:8,width:12,height:12,rx:2,fill:"#2563eb"}));
    svg.appendChild(svgEl("text",{x:168,y:18,fill:"#475569","font-size":"11"},"Conservador"));
    svg.appendChild(svgEl("rect",{x:280,y:8,width:12,height:12,rx:2,fill:"#059669"}));
    svg.appendChild(svgEl("text",{x:298,y:18,fill:"#475569","font-size":"11"},"Diámetro de corte"));
    svg.appendChild(svgEl("text",{x:W/2,y:H-11,"text-anchor":"middle",fill:"#334155","font-size":"12","font-weight":"700"},"Viscosidad"));
  }

  function buildTable(rot){
    const body=$("comparisonBody");
    body.innerHTML="";
    [1820,750,425].forEach(mu=>{
      [["Conservador","conservative"],["Diámetro de corte","cut"]].forEach(([label,key])=>{
        const r=calc(mu,key,rot);
        const tr=document.createElement("tr");
        tr.innerHTML=`<td><b>${mu} cP</b></td>
          <td><span class="pill">${label}</span></td>
          <td>${decimal(r.t,2)}</td>
          <td>${plainSci(r.uAvg,4)}</td>
          <td>${plainSci(r.uWall,4)}</td>
          <td>${plainSci(r.Q,4)}</td>`;
        body.appendChild(tr);
      });
    });
  }

  $("viscosity").addEventListener("change",()=>{
    $("customMu").disabled=$("viscosity").value!=="custom";
    update();
  });
  $("customMu").addEventListener("input",update);
  $("rotUnit").addEventListener("change",update);
  $("printBtn").addEventListener("click",() => window.print());
  $("animateBtn").addEventListener("click",animate);
  $("toggleCriterion").addEventListener("click",()=>{
    animationCriterion=animationCriterion==="conservative"?"cut":"conservative";
    $("toggleCriterion").textContent=animationCriterion==="conservative"
      ?"Criterio animado: conservador"
      :"Criterio animado: diámetro de corte";
    resetParticle();
  });
  $("resetBtn").addEventListener("click",()=>{
    $("viscosity").value="1820";
    $("customMu").value="1000";
    $("customMu").disabled=true;
    $("rotUnit").value="rph";
    animationCriterion="conservative";
    $("toggleCriterion").textContent="Criterio animado: conservador";
    update();
  });

  update();
})();
