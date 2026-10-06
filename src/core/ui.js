const ASSETS='assets/';


const img=(f,cls,alt='')=>`<img src="${ASSETS}${f}" class="${cls}" alt="${alt}" onerror="this.remove()">`;


const scene=(bg,inner='')=>`<div class="scene">${img(bg,'bg')}<div class="shade"></div><div class="dust"></div>${inner}</div>`;


const portrait=f=>img(f,'portrait');


/* regionBg/regionName retired in Milestone 1 with the legacy mile-gated road loop.
   Future world/region logic will live in sim/world.js. */


function fatTier(f){return f>=75?'Exhausted':f>=40?'Tired':'Rested'}


function maxFatigue(){let m=g.pfat,n='YOU';g.crew.forEach(c=>{if(c.hp>0&&c.fatigue>m){m=c.fatigue;n=c.name}});return{m:m,n:n}}


function notify(s){let t=$('#toast');t.textContent=s;t.style.display='block';setTimeout(()=>t.style.display='none',2400)}

function log(s){g.log.unshift('DAY '+g.day+': '+s);g.log=g.log.slice(0,35)}

function screen(s){app.innerHTML=s;window.scrollTo(0,0);if(typeof paintKeyedLayers==='function'){try{paintKeyedLayers()}catch(e){}}}

function stat(k,v){return `<div class="stat">${k}<b>${v}</b></div>`}

function hud(){const f=maxFatigue(),tier=fatTier(f.m);const cmark=c=>(c.injury!=='healthy'?' ['+c.injury.toUpperCase()+']':'')+(c.hp<=0?' [OUT]':'');return `<div class="row"><span class="tag">DAY ${g.day}</span><span class="tag">${g.miles} / 780 MI</span></div><div class="bar"><span style="width:${Math.min(100,g.miles/780*100)}%"></span></div><div class="stats">${stat('FUEL',g.fuel.toFixed(1))}${stat('FOOD'+(g.food<=4?' · LOW':''),g.food)}${stat('WATER'+(g.water<=4?' · LOW':''),g.water)}${stat('PARTS',g.parts)}${stat('MEDS',g.meds)}${stat('TRUCK'+(g.hp<30?' · LIMP':''),g.hp+'%')}</div><div class="bar"><span style="width:${f.m}%;background:${f.m>=75?'#dc8c78':f.m>=40?'#e8c96a':'#b8d68a'}"></span></div><p class="muted">FATIGUE ${f.m} · ${escapeHtml(f.n)} (${tier})${g.rationing?' · RATIONING':''}</p><p class="muted">${escapeHtml(g.name)} · HP ${g.health}${g.injury!=='healthy'?' ['+g.injury.toUpperCase()+']':''} · ${escapeHtml(cars[g.car].name)} · ${g.crew.filter(c=>c.hp>0).length+(g.health>0?1:0)} survivors${g.crew.map(c=>' · '+escapeHtml(c.name)+cmark(c)).join('')}</p>`}


