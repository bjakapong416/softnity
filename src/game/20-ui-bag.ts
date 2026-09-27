/* ---------- bag v2: categories, filters, sort, grid/list, detail, discard ---------- */
const BAG={ cat:'all', sel:null, view:'grid', q:'all', lv:'all', stat:'all', sort:'new', search:'' };
const TYPE_TH={use:'ของใช้',equip:'อุปกรณ์สวมใส่',etc:'ของดรอป'};
const BAG_CATS=[['all','ทั้งหมด','All',null],['use','ของใช้','Consumable','redpot'],['equip','อุปกรณ์','Equipment','shortsword'],['etc','ของดรอป','Etc.','jelly'],['rare','ของหายาก','Rare','crown']];
const itemRar=id=>{ const it=ITEMS[id]; return it.r||(it.rare?'r':'c'); };
function itemWeight(id){ const it=ITEMS[id]; if(it.w!=null) return it.w;
  if(it.type==='equip') return {weapon:60,armor:80,head:20,shield:60,garment:20,shoes:30,acc:5}[it.slot]||20;
  return {redpot:7,orangepot:10,apple:2,flywing:5,bwing:5,royaljelly:10,tusk:4,fur:2,thorn:2}[id]||1; }
function weightNow(){ let w=0; Object.entries(P.inv).forEach(([id,n])=>{ if(ITEMS[id]) w+=itemWeight(id)*n; }); equipList().forEach(it=>{ const id=Object.keys(ITEMS).find(k=>ITEMS[k]===it); if(id) w+=itemWeight(id); }); return w; }
function weightMax(){ return 2000+derived().eff.str*30; }
function weightPct(){ return 100*weightNow()/weightMax(); }
function bagItems(){
  const s=BAG.search.trim().toLowerCase(), order={use:0,equip:1,etc:2};
  let ids=Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k]);
  ids=ids.filter(id=>{ const it=ITEMS[id];
    if(BAG.cat==='rare'){ if(!['r','e'].includes(itemRar(id))) return false; } else if(BAG.cat!=='all'&&it.type!==BAG.cat) return false;
    if(s&&!it.name.toLowerCase().includes(s)&&!(it.desc||'').toLowerCase().includes(s)) return false;
    if(BAG.q!=='all'&&itemRar(id)!==BAG.q) return false;
    if(BAG.lv!=='all'){ const ok=it.type!=='equip'||!canEquip(id); if(BAG.lv==='ok'&&!ok) return false; if(BAG.lv==='no'&&(it.type!=='equip'||ok)) return false; }
    if(BAG.stat!=='all'){ if(it.type!=='equip') return false; if(BAG.stat==='stats'){ if(!it.stats) return false; } else if(!it[BAG.stat]) return false; }
    return true; });
  const rr={c:0,u:1,r:2,e:3};
  const by={ new:(a,b)=>((P.invSeq||{})[b]||0)-((P.invSeq||{})[a]||0), type:(a,b)=>(order[ITEMS[a].type]-order[ITEMS[b].type])||ITEMS[a].name.localeCompare(ITEMS[b].name),
    name:(a,b)=>ITEMS[a].name.localeCompare(ITEMS[b].name), qty:(a,b)=>P.inv[b]-P.inv[a], rare:(a,b)=>rr[itemRar(b)]-rr[itemRar(a)], price:(a,b)=>ITEMS[b].sell-ITEMS[a].sell };
  return ids.sort((a,b)=>by[BAG.sort](a,b)||by.type(a,b));
}
function renderBag(){
  if(!$('invCats').children.length){ $('invCats').innerHTML=BAG_CATS.map(([k,th,en,ic])=>`<button class="ic-b" data-cat="${k}">${ic?`<img alt="" src="${ICONS[ic]}">`:'<img alt="" src="'+(UIICON.bag||'')+'">'}<span><b>${th}</b><small>${en}</small></span><span class="cn" data-cn="${k}"></span></button>`).join(''); }
  $('invCats').querySelectorAll('.ic-b').forEach(b=>b.classList.toggle('on',b.dataset.cat===BAG.cat));
  const all=Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k]);
  $('invCats').querySelectorAll('[data-cn]').forEach(el=>{ const k=el.dataset.cn; el.textContent=(k==='all'?all.length:k==='rare'?all.filter(id=>['r','e'].includes(itemRar(id))).length:all.filter(id=>ITEMS[id].type===k).length)+' ชนิด'; });
  const ids=bagItems(); if(BAG.sel&&!P.inv[BAG.sel]) BAG.sel=null; if(!BAG.sel&&ids.length) BAG.sel=ids[0];
  const g=$('bagGrid');
  if(BAG.view==='grid'){
    g.className='bag-grid'; const cols=Math.max(5,Math.floor((g.clientWidth||600)/70)); const cells=Math.max(cols*5,Math.ceil(ids.length/cols)*cols);
    let html=''; for(let i=0;i<cells;i++){ const id=ids[i]; if(!id){ html+='<span class="bt empty"></span>'; continue; } const it=ITEMS[id], hk=P.hotbar.indexOf(id);
      html+=`<button class="bt r-${itemRar(id)} ${id===BAG.sel?'sel':''}" data-bid="${id}" title="${it.name}"><img alt="" src="${ICONS[id]}">${P.inv[id]>1||it.type!=='equip'?`<span class="q">${P.inv[id]}</span>`:''}${hk>=0?`<span class="hk">${hk+1}</span>`:''}</button>`; }
    g.innerHTML=html;
  } else {
    g.className='bag-grid bag-list';
    g.innerHTML=ids.length?ids.map(id=>{ const it=ITEMS[id], rc=RARITY[itemRar(id)]; return `<button class="bl ${id===BAG.sel?'sel':''}" data-bid="${id}"><img alt="" src="${ICONS[id]}"><span><b style="color:${itemRar(id)==='c'?'#1c2a52':rc[1]==='#e8eeff'?'#1c2a52':({u:'#1f8a3a',r:'#2c55b0',e:'#8a3ab0'})[itemRar(id)]}">${it.name}</b><small>${TYPE_TH[it.type]}${it.type==='equip'?` · ${equipReq(it)}`:''}</small></span><span class="num">×${P.inv[id]}</span><span class="num w">${itemWeight(id)*P.inv[id]} wt</span><span class="num pr">${it.sell.toLocaleString()} Sol</span></button>`; }).join(''):'<p style="color:#5a6a8e;margin:8px">ไม่พบไอเทมที่ตรงกับตัวกรอง</p>';
  }
  const d=$('bagDetail');
  if(!BAG.sel){ d.innerHTML='<p class="none">ยังไม่มีไอเทมในหมวดนี้ ลองล่ามอนสเตอร์หรือซื้อที่ร้านในเมือง</p>'; }
  else { const id=BAG.sel, it=ITEMS[id], eq=it.type==='equip', why=eq?canEquip(id):'', rk=itemRar(id), rc={c:'#8a96b0',u:'#2fa860',r:'#2c6fd6',e:'#9a4ad0'}[rk];
    d.innerHTML=`<div class="top"><div class="bd-ic"><img alt="" src="${ICONS[id]}"></div><div><b class="nm">${it.name}</b><small>${TYPE_TH[it.type]} · มี ${P.inv[id]} ชิ้น</small><span class="rar" style="background:${rc}">${RARITY[rk][0]}</span></div></div>
      <p>${it.desc||'-'}</p>${eq?`<p class="req ${why?'bad':''}">${equipReq(it)}${why?`<br>${why}`:''}</p>`:''}
      <p class="none">น้ำหนัก ${itemWeight(id)} ต่อชิ้น · ขายได้ ${it.sell.toLocaleString()} Sol</p>
      <div class="bd-act">${it.type==='use'?`<button class="btn" data-bact="use">ใช้</button></div><div class="bd-act"><span class="hkl">ปุ่มลัด</span>${[0,1,2,3].map(i=>`<button class="hkb ${P.hotbar[i]===id?'on':''}" data-bhk="${i}">${i+1}</button>`).join('')}`:eq?`<button class="btn" data-bact="equip" ${why?'disabled':''}>สวม</button>`:''}</div>`; }
  const wn=weightNow(), wm=weightMax(), wp=100*wn/wm; $('invWeight').textContent=`${wn.toLocaleString()} / ${wm.toLocaleString()}`;
  $('wtPill').classList.toggle('warn',wp>50&&wp<=90); $('wtPill').classList.toggle('bad',wp>90);
  $('bagSol').textContent=P.sol.toLocaleString();
  $('bagCount').textContent=`${all.length} ชนิด · ${all.reduce((a,k)=>a+P.inv[k],0).toLocaleString()} ชิ้น`;
  $('invDrop').disabled=!BAG.sel;
  if(UIICON.bag&&!$('invBagIc').src) $('invBagIc').src=UIICON.bag;
}
function wireBag(){
  const w=$('invWin');
  w.addEventListener('click',e=>{
    const c=e.target.closest('[data-cat]'); if(c){ BAG.cat=c.dataset.cat; BAG.sel=null; renderBag(); return; }
    const v=e.target.closest('[data-view]'); if(v){ BAG.view=v.dataset.view; w.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('on',x===v)); renderBag(); return; }
    const t=e.target.closest('[data-bid]'); if(t){ BAG.sel=t.dataset.bid; renderBag(); return; }
    const a=e.target.closest('[data-bact]'); if(a&&BAG.sel){ if(a.dataset.bact==='use') useItem(BAG.sel); else equipItem(BAG.sel); return; }
    const h=e.target.closest('[data-bhk]'); if(h&&BAG.sel){ const i=+h.dataset.bhk; P.hotbar=P.hotbar.map(x=>x===BAG.sel?null:x); P.hotbar[i]=BAG.sel; persist(); refreshUI(); toast(`ตั้ง ${ITEMS[BAG.sel].name} เป็นปุ่มลัด ${i+1}`); }
  });
  w.addEventListener('dblclick',e=>{ const t=e.target.closest('[data-bid]'); if(!t) return; const it=ITEMS[t.dataset.bid]; if(it.type==='use') useItem(t.dataset.bid); else if(it.type==='equip') equipItem(t.dataset.bid); });
  $('invSearch').addEventListener('input',e=>{ BAG.search=e.target.value; BAG.sel=null; renderBag(); });
  $('invSearch').addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key==='Escape') e.target.blur(); e.stopPropagation(); });
  [['invLv','lv'],['invQ','q'],['invStat','stat'],['invSort','sort']].forEach(([id,k])=>$(id).onchange=e=>{ BAG[k]=e.target.value; BAG.sel=null; e.target.blur(); renderBag(); });
  $('invSortBtn').onclick=()=>{ BAG.sort='type'; $('invSort').value='type'; renderBag(); toast('จัดเรียงตามประเภทแล้ว'); };
  $('invDrop').onclick=()=>{ const id=BAG.sel; if(!id) return; const it=ITEMS[id], n=P.inv[id];
    openDialog('ทิ้งไอเทม',`ต้องการทิ้ง ${it.name} หรือไม่ (มี ${n} ชิ้น) ไอเทมที่ทิ้งจะหายไปถาวร`,[
      ['ทิ้ง 1 ชิ้น',()=>{ takeInv(id); logMsg(`ทิ้ง ${it.name} 1 ชิ้น`,'sys'); persist(); refreshUI(); closeWin('dialog'); }],
      ...(n>1?[[`ทิ้งทั้งหมด ${n} ชิ้น`,()=>{ delete P.inv[id]; logMsg(`ทิ้ง ${it.name} ${n} ชิ้น`,'sys'); persist(); refreshUI(); closeWin('dialog'); }]]:[]),
      ['ยกเลิก',()=>closeWin('dialog')]]); };
  window.addEventListener('resize',()=>{ if(!w.classList.contains('hidden')) renderBag(); });
}

/* minimap */
let mmBase;
function buildMinimapBase(){
  mmBase=document.createElement('canvas'); mmBase.width=W*2; mmBase.height=H*2; const c=mmBase.getContext('2d');
  if(window.__CM){ c.imageSmoothingEnabled=true; c.drawImage(window.__CM.img,0,0,W*2,H*2); return; }
  const HV=MAP.theme==='harvest', col={grass:HV?'#cdb05a':'#79c05a',path:HV?'#b8905e':'#d7bb82',water:'#4fa8d6',bridge:'#a8743f',sbridge:'#a9a296',cobble:'#b9b1a3',plaza:'#dccfb2',bld:'#8a4a3a'};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ const g=grid[y][x]; c.fillStyle=g.b&&g.t==='grass'?(HV?'#b8641e':'#2f7a3c'):col[g.t]; c.fillRect(x*2,y*2,2,2); }
}
function drawMinimap(){
  const c=$('minimap').getContext('2d'), k=120/W; c.imageSmoothingEnabled=false; c.clearRect(0,0,120,120); c.drawImage(mmBase,0,0,120,120);
  const dot=(x,y,sz,col)=>{ c.fillStyle=col; c.fillRect(x*k+k/2-sz/2,y*k+k/2-sz/2,sz,sz); };
  mobs.forEach(m=>{ if(!m.dead) dot(m.tx,m.ty,m.def.boss?6:2,m.def.mm||'#ff8fb8'); });
  items.forEach(it=>dot(it.tx,it.ty,1,'#fff6a0'));
  dot(npc.tx,npc.ty,4,'#ffe066'); townNpcs.forEach(n=>dot(n.ent.tx,n.ent.ty,3,'#ffe066'));
  PORTALS.forEach(pt=>{ c.fillStyle='#39e0ff'; c.beginPath(); c.arc(pt.tx*k+k/2,(pt.ty+1)*k,3.2,0,Math.PI*2); c.fill(); });
  if(P.bot.on&&bot.wp){ c.strokeStyle='#c9ff9a'; c.strokeRect(bot.wp[0]*k-1.5,bot.wp[1]*k-1.5,4,4); }
  const v=S.cameras.main.worldView; c.strokeStyle='rgba(255,255,255,.7)'; c.lineWidth=1; c.strokeRect(v.x/T*k+.5,v.y/T*k+.5,v.width/T*k,v.height/T*k);
  dot(hero.tx,hero.ty,4,'#ffffff'); dot(hero.tx,hero.ty,2,'#e2524a');
}

/* controls */
function toggleSit(fromBot){
  if(hero.dead||hero.moving||(target&&!fromBot)) return;
  if(!hero.sitting && skLv('basic')<3){ if(fromBot!==true) toast('ต้องมี Basic Skill Lv 3 ถึงจะนั่งพักได้ (กด K)'); return; }
  hero.sitting=!hero.sitting; $('sitBtn').classList.toggle('on',hero.sitting);
  if(hero.sitting&&fromBot!==true) logMsg('นั่งพัก ฟื้น HP/SP เร็วขึ้น 4 เท่า (ถี่ขึ้น 2 เท่า และได้มากขึ้น 2 เท่า)','sys');
}
function attackNearest(){
  if(!started||hero.dead) return; if(target&&!target.dead) return;
  const m=nearestMob(12); if(m) setTarget(m); else toast('ไม่มีมอนสเตอร์ในระยะ');
}
function pickNearest(){
  if(!started||hero.dead) return; let best=null,bd=1e9;
  items.forEach(it=>{ const d=Math.max(Math.abs(it.tx-hero.tx),Math.abs(it.ty-hero.ty)); if(d<bd){bd=d;best=it;} });
  if(best&&bd<=6) goPickup(best); else toast('ไม่มีไอเทมใกล้ตัว');
}
function wireJoystick(){
  const pad=$('joy'), knob=pad.querySelector('.knob'); let id=null;
  const upd=e=>{ const r=pad.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2, max=r.width/2-18;
    let vx=e.clientX-cx, vy=e.clientY-cy; const mag=Math.hypot(vx,vy); if(mag>max){ vx*=max/mag; vy*=max/mag; }
    knob.style.transform=`translate(${vx}px,${vy}px)`;
    if(mag<max*.3){ joy.dx=0; joy.dy=0; return; }
    const sec=Math.round(Math.atan2(vy,vx)/(Math.PI/4)); const ndx=Math.round(Math.cos(sec*Math.PI/4)), ndy=Math.round(Math.sin(sec*Math.PI/4));
    if(!joy.dx&&!joy.dy) manualMove(); joy.dx=ndx; joy.dy=ndy; };
  const end=()=>{ id=null; joy.dx=0; joy.dy=0; knob.style.transform=''; pad.classList.remove('on'); };
  pad.addEventListener('pointerdown',e=>{ e.preventDefault(); id=e.pointerId; pad.setPointerCapture(id); pad.classList.add('on'); upd(e); });
  pad.addEventListener('pointermove',e=>{ if(e.pointerId===id) upd(e); });
  pad.addEventListener('pointerup',end); pad.addEventListener('pointercancel',end); pad.addEventListener('lostpointercapture',end);
  $('atkBtn').onclick=attackNearest; $('pickBtn').onclick=pickNearest; $('botBtn2').onclick=()=>setBot(!P.bot.on);
}
function wireUI(){
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{ toggleWin(b.dataset.open); closeWin('menuPop'); });
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeWin(b.dataset.close));
  document.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{ const id=P.hotbar[+b.dataset.slot]; if(id) useItem(id); else { $('invWin').classList.remove('hidden'); toast('เลือกไอเทมในกระเป๋า แล้วกดปุ่มลัดเพื่อตั้งค่า'); } });
  document.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>useSkill(P.skillbar[+b.dataset.sk]));
  $('sitBtn').onclick=()=>toggleSit();
  const em=$('emoteMenu'); EMOTES.forEach(g=>{ const b=document.createElement('button'); b.textContent=g; b.onclick=()=>{ emote(hero,g); em.classList.add('hidden'); }; em.appendChild(b); });
  $('emoteBtn').onclick=()=>em.classList.toggle('hidden');
  $('menuBtn').onclick=()=>$('menuPop').classList.toggle('hidden');
  $('botToggle').onclick=()=>setBot(!P.bot.on);
  $('botPill').onclick=()=>setBot(false);
  const bind=(id,fn)=>{ $(id).onchange=e=>{ fn(e.target.value); persist(); e.target.blur(); }; };
  bind('bStyle',v=>{ P.bot.style=v; bot.meleeFallback=false; refreshBotUI(); }); bind('bNoSp',v=>P.bot.noSp=v); bind('bKite',v=>P.bot.kite=v==='1');
  bind('bMode',v=>P.bot.mode=v); bind('bSkill',v=>P.bot.skill=v); bind('bSpMin',v=>P.bot.spMin=+v); bind('bLoot',v=>P.bot.loot=v);
  bind('bRoam',v=>{ P.bot.roam=v; bot.anchor=[hero.tx,hero.ty]; bot.wp=null; }); bind('bPotion',v=>P.bot.potion=+v); bind('bRest',v=>P.bot.rest=+v);
  bind('bFlyIdle',v=>P.bot.flyIdle=+v); bind('bFlyHp',v=>P.bot.flyHp=+v);
  bind('bWing',v=>P.bot.wing=v==='1'); bind('bRevive',v=>P.bot.revive=v==='1');
  $('nameInput').value=P.name; $('nameInput').onchange=e=>{ P.name=(e.target.value.trim()||'นักผจญภัย').slice(0,16); persist(); refreshUI(); e.target.blur(); };
  $('nameInput').addEventListener('keydown',e=>{ if(e.key==='Enter') e.target.blur(); });
  $('rateSel').value=String(P.rate); $('rateSel').onchange=e=>{ P.rate=+e.target.value; persist(); e.target.blur(); logMsg(`ตั้งอัตรา EXP เป็น ×${P.rate}`,'sys'); };
  $('soundSel').value=P.sound?'1':'0'; $('soundSel').onchange=e=>{ P.sound=e.target.value==='1'; persist(); e.target.blur(); };
  { const loc=()=>{ try{ return JSON.parse(localStorage.getItem('softnity-custom')||'{}'); }catch(e){ return {}; } };
    const list=()=>{ const k=Object.keys(CUSTOM); $('cusList').textContent=k.length?'ใช้อยู่: '+k.join(', '):'ยังไม่มี'; }; list();
    const read=(f,asUrl)=>new Promise((ok,no)=>{ const r=new FileReader(); r.onload=()=>ok(r.result); r.onerror=no; asUrl?r.readAsDataURL(f):r.readAsText(f); });
    $('cusSave').onclick=async()=>{ const pf=$('cusPng').files[0], jf=$('cusJson').files[0]; if(!pf||!jf){ toast('เลือกไฟล์ PNG และ JSON ก่อน'); return; }
      try{ const png=await read(pf,true), json=await read(jf,false); const j=JSON.parse(json); if(!j.frames){ toast('ไฟล์ JSON ไม่ใช่ sprite sheet'); return; }
        const o=loc(); o[$('cusSlot').value]={ png, json }; localStorage.setItem('softnity-custom',JSON.stringify(o)); toast('บันทึกแล้ว กำลังโหลดเกมใหม่'); setTimeout(()=>location.reload(),700); }
      catch(e){ toast(e&&e.name==='QuotaExceededError'?'ไฟล์ใหญ่เกินพื้นที่เบราว์เซอร์ ลองลดขนาดช่องใน Importer':'อ่านไฟล์ไม่สำเร็จ'); } };
    $('mapList').textContent=CUSTOM_MAPS.town?`ใช้อยู่: เมืองหลวง (${CUSTOM_MAPS.town.json.cols}×${CUSTOM_MAPS.town.json.rows} ช่อง)`:'ใช้เมืองเดิม';
    $('mapSave').onclick=async()=>{ const pf=$('mapPng').files[0], jf=$('mapJson').files[0]; if(!pf||!jf){ toast('เลือกภาพแผนที่และ JSON ก่อน'); return; }
      try{ const png=await read(pf,true), json=await read(jf,false); const j=JSON.parse(json); if(!j.grid){ toast('ไฟล์ JSON ไม่ใช่แผนที่'); return; }
        localStorage.setItem('softnity-maps',JSON.stringify({ town:{ png, json } })); toast('บันทึกแผนที่แล้ว กำลังโหลดใหม่'); setTimeout(()=>location.reload(),700); }
      catch(e){ toast(e&&e.name==='QuotaExceededError'?'ภาพใหญ่เกินพื้นที่เบราว์เซอร์ ใช้ทาง GitHub แทน':'อ่านไฟล์ไม่สำเร็จ'); } };
    $('mapClear').onclick=()=>{ localStorage.removeItem('softnity-maps'); toast('กลับไปใช้เมืองเดิม กำลังโหลดใหม่'); setTimeout(()=>location.reload(),700); };
    $('cusClear').onclick=()=>{ localStorage.removeItem('softnity-custom'); toast('ล้างแล้ว กำลังโหลดเกมใหม่'); setTimeout(()=>location.reload(),700); }; }
  $('uiSel').value=P.ui===4?'4':'5'; $('uiSel').onchange=e=>{ P.ui=+e.target.value; persist(); document.body.classList.toggle('ui5',P.ui!==4); e.target.blur(); };
  $('hdSel').value=P.hd===false?'0':'1'; $('hdSel').onchange=e=>{ P.hd=e.target.value==='1'; persist(); toast('กำลังโหลดใหม่เพื่อเปลี่ยนกราฟิก'); setTimeout(()=>location.reload(),600); };
  $('devJobBtn').onclick=devJob10;
  $('resetBtn').onclick=()=>{ if(!confirm('ลบความคืบหน้าและเริ่มตัวละครใหม่?')) return; try{ localStorage.removeItem(SAVE_KEY); localStorage.removeItem('softnity-proto-v1'); }catch(e){} location.reload(); };
  document.querySelectorAll('.win h2, .win .skh, .win .inv-head').forEach(h=>{ const w=h.parentElement; let sx,sy,ox,oy,drag=false;
    h.addEventListener('pointerdown',e=>{ if(e.target.closest('button')) return; drag=true; const r=w.getBoundingClientRect(); w.style.transform='none'; w.style.left=r.left+'px'; w.style.top=r.top+'px'; w.style.right='auto'; w.style.bottom='auto';
      sx=e.clientX; sy=e.clientY; ox=r.left; oy=r.top; h.setPointerCapture(e.pointerId); });
    h.addEventListener('pointermove',e=>{ if(!drag) return; w.style.left=clamp(ox+e.clientX-sx,0,innerWidth-60)+'px'; w.style.top=clamp(oy+e.clientY-sy,0,innerHeight-30)+'px'; });
    h.addEventListener('pointerup',()=>drag=false); });
  const ci=$('chatInput');
  ci.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const v=ci.value.trim(); if(v){ if(v==='/sit'){ toggleSit(); } else if(v==='/bot'){ setBot(!P.bot.on); } else if(v.startsWith('/')){ const g=EMOTES[['/lv','/!','/?','/music','/...','/star'].indexOf(v)]; if(g) emote(hero,g); else logMsg('คำสั่งที่ใช้ได้ /sit /bot /lv /! /? /music','sys'); } else { logMsg(`${P.name}: ${v}`,'say'); sayBubble(v); } } ci.value=''; ci.blur(); e.stopPropagation(); } if(e.key==='Escape'){ ci.blur(); } });
  window.addEventListener('keydown',e=>{
    if(!started) return; const ae=document.activeElement; if(ae===ci||ae.tagName==='INPUT'||ae.tagName==='SELECT') return;
    const k=keyOf(e);
    if(MOVE_KEYS[k]){ e.preventDefault(); if(!keys[k]){ keys[k]=true; manualMove(); } return; }
    if(e.repeat) return;
    if(k===' '){ e.preventDefault(); attackNearest(); return; }
    if(k==='q'||k==='e'||k==='r'){ useSkill(P.skillbar['qer'.indexOf(k)]); return; }
    if(k==='f'){ pickNearest(); return; }
    if(k==='enter'){ ci.focus(); e.preventDefault(); }
    else if(k==='m') toggleWin('mapWin');
    else if(k==='u') toggleWin('equipWin');
    else if(k==='c') toggleWin('statusWin'); else if(k==='i') toggleWin('invWin'); else if(k==='k') toggleWin('skillWin');
    else if(k==='b') setBot(!P.bot.on); else if(k==='g') $('emoteMenu').classList.toggle('hidden');
    else if(k==='insert'||k==='z') toggleSit();
    else if(k==='1'||k==='2'||k==='3'||k==='4'){ const id=P.hotbar[+k-1]; if(id) useItem(id); }
    else if(k==='escape'){ ['statusWin','invWin','skillWin','botWin','settingsWin','emoteMenu','menuPop','mapWin','equipWin','storeWin'].forEach(closeWin); if(!hero.dead) closeWin('dialog'); }
  });
  window.addEventListener('keyup',e=>{ const k=keyOf(e); if(MOVE_KEYS[k]) keys[k]=false; });
  // hotkeys need keyboard focus on the game page
  const fh=document.createElement('div'); fh.id='focusHint'; fh.className='live hidden'; fh.textContent='คลิกที่เกม 1 ครั้งเพื่อใช้ปุ่มลัดคีย์บอร์ด'; $('ui').appendChild(fh);
  fh.onclick=()=>{ fh.classList.add('hidden'); window.focus(); };
  window.addEventListener('blur',()=>{ if(started&&!matchMedia('(pointer:coarse)').matches) fh.classList.remove('hidden'); });
  window.addEventListener('focus',()=>fh.classList.add('hidden'));
  window.addEventListener('pointerdown',()=>fh.classList.add('hidden'),true);
  window.addEventListener('blur',()=>{ for(const k in keys) keys[k]=false; });
  ci.addEventListener('focus',()=>{ for(const k in keys) keys[k]=false; });
  wireJoystick(); wireHud(); wireSkillWin(); buildUiIcons(); wireBag(); wireStorage();
  $('equipWin').addEventListener('click',e=>{ const b=e.target.closest('[data-uneq]'); if(b) unequip(b.dataset.uneq); });
  if(matchMedia('(pointer:coarse)').matches) ci.placeholder='แตะเพื่อพิมพ์คุย';
  window.addEventListener('beforeunload',persist);
  $('startBtn').onclick=()=>{ document.body.classList.toggle('ui5',P.ui!==4);
    try{ AC.ctx=AC.ctx||new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
    started=true;
    logMsg(`ยินดีต้อนรับสู่ ${MAP.name}`,'sys');
    logMsg(matchMedia('(pointer:coarse)').matches?'แตะปุ่มบอทเพื่อให้ตัวละครล่าเอง ตั้งค่าบอทได้ในเมนู':'กด B เพื่อเปิดบอท ตั้งค่าบอทได้ที่ปุ่มบอทด้านล่าง','sys');
    if(P.skillPts>0) logMsg(`มีแต้มสกิล ${P.skillPts} แต้ม กด K เพื่อลง Basic Skill`,'sys');
    emote(hero,'★'); refreshUI(); announce(`ยินดีต้อนรับสู่ <b>Softnity</b> — ${MAP.name}`);
  };
}

