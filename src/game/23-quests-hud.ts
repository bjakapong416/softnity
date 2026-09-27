/* ---------- main quest chain ---------- */
const QUESTS=[
  {title:'ก้าวแรกของนักผจญภัย', desc:'ล่า Jellop', type:'kill', key:'jellop', need:10, reward:{sol:300,items:{redpot:5}}},
  {title:'รากฐานของนักสู้', desc:'ลง Basic Skill ถึง Lv 3 (กด K)', type:'skill', key:'basic', need:3, reward:{sol:200,items:{flywing:5}}},
  {title:'พร้อมรบ', desc:'สวมอุปกรณ์ให้ครบ 3 ชิ้น (กด U)', type:'equip', need:3, reward:{sol:300,items:{orangepot:3}}},
  {title:'ผีเสื้อยามราตรี', desc:'ล่า Fluttermoth', type:'kill', key:'moth', need:10, reward:{sol:500,items:{bwing:2}}},
  {title:'สู่ทุ่งทองคำ', desc:'เดินทางไป Everhaven Fields 02', type:'map', key:'f02', need:1, reward:{sol:500,items:{flywing:10}}},
  {title:'ทางแยกของโชคชะตา', desc:'ถึง Job Lv 10', type:'joblv', need:10, reward:{sol:800,items:{orangepot:5}}},
  {title:'เลือกเส้นทาง', desc:'เปลี่ยนอาชีพที่สมาคมในเมืองหลวง', type:'job', need:1, reward:{sol:1000,items:{bwing:3}}},
  {title:'ราชาแห่งเยลลี่', desc:'ปราบ King Jellop ที่สะพานหิน', type:'kill', key:'kingjellop', need:1, reward:{sol:5000,items:{royaljelly:3}}},
];
function questNow(){ P.quest=P.quest||{i:0,prog:0}; return QUESTS[P.quest.i]||null; }
function questEvent(type,key){ const q=questNow(); if(!q||q.type!==type||(q.key&&q.key!==key)) return; P.quest.prog=Math.min(q.need,(P.quest.prog||0)+1); if(P.quest.prog>=q.need) questDone(); else renderQuest(); }
function questCheck(){ const q=questNow(); if(!q) return; let v=null;
  if(q.type==='skill') v=skLv(q.key); else if(q.type==='equip') v=equipList().length; else if(q.type==='joblv') v=P.job==='Novice'?P.jlv:10; else if(q.type==='job') v=P.job==='Novice'?0:1; else if(q.type==='map') v=P.map===q.key?1:0;
  if(v!==null){ P.quest.prog=Math.min(q.need,v); if(v>=q.need) questDone(); } }
function questDone(){ const q=questNow(); if(!q||questDone.busy) return; questDone.busy=true;
  P.sol+=q.reward.sol||0; Object.entries(q.reward.items||{}).forEach(([id,n])=>addInv(id,n));
  const rw=[`${(q.reward.sol||0).toLocaleString()} Sol`].concat(Object.entries(q.reward.items||{}).map(([id,n])=>`${ITEMS[id].name} ×${n}`)).join(', ');
  sfx('level'); toast(`เควสต์สำเร็จ: ${q.title}`); logMsg(`เควสต์สำเร็จ "${q.title}" ได้รับ ${rw}`,'sys'); announce(`<b>${P.name}</b> ทำเควสต์ <em>${q.title}</em> สำเร็จ!`); gain(`Sol +${q.reward.sol}`,'s');
  P.quest={i:P.quest.i+1,prog:0}; persist(); questDone.busy=false; setTimeout(()=>{ questCheck(); refreshUI(); },50); }
function renderQuest(){ const q=questNow(), card=$('qtCard');
  if(!q){ $('qtTitle').textContent='เควสต์หลักครบแล้ว'; $('qtDesc').textContent='รอเนื้อเรื่องบทถัดไป'; card.classList.add('done'); return; }
  $('qtTitle').textContent=q.title; $('qtDesc').textContent=`${q.desc} (${P.quest.prog||0}/${q.need})`; card.classList.remove('done'); }
function openQuest(){ const q=questNow(); if(!q){ openDialog('เควสต์หลัก','ทำเควสต์หลักครบทุกบทแล้ว ยอดเยี่ยมมาก!',[['ปิด',()=>closeWin('dialog')]]); return; }
  const rw=[`${(q.reward.sol||0).toLocaleString()} Sol`].concat(Object.entries(q.reward.items||{}).map(([id,n])=>`${ITEMS[id].name} ×${n}`)).join(', ');
  openDialog(`เควสต์หลัก ${P.quest.i+1}/${QUESTS.length}: ${q.title}`,`${q.desc}\nความคืบหน้า ${P.quest.prog||0}/${q.need}\nรางวัล: ${rw}`,[['ปิด',()=>closeWin('dialog')]]); }

/* ---------- DPS meter, gain feed, ticker, guide ---------- */
const dmgLog=[];
function trackDps(dmg){ dmgLog.push([Date.now(),dmg]); }
function updateDps(){ const now=Date.now(); while(dmgLog.length&&now-dmgLog[0][0]>5000) dmgLog.shift(); const el=$('dps');
  if(!dmgLog.length){ el.classList.add('hidden'); return; } const span=Math.max(1,(now-dmgLog[0][0])/1000); el.textContent=`ดาเมจต่อวินาที: ${Math.round(dmgLog.reduce((a,d)=>a+d[1],0)/Math.max(span,1)).toLocaleString()}`; el.classList.remove('hidden'); }
function gain(txt,cls){ const f=$('gainFeed'), el=document.createElement('div'); el.className='gf '+(cls||''); el.textContent=txt; f.appendChild(el); while(f.children.length>6) f.firstChild.remove(); setTimeout(()=>el.remove(),2700); }
const tickQ=[]; let tickBusy=false;
function announce(html){ tickQ.push(html); if(!tickBusy) nextTick(); }
function nextTick(){ const t=$('ticker'); if(!tickQ.length){ tickBusy=false; t.classList.remove('show'); return; } tickBusy=true;
  const el=$('tickerText'); el.innerHTML=tickQ.shift(); el.style.animation='none'; void el.offsetWidth; el.style.animation=''; t.classList.add('show'); setTimeout(nextTick,14000); }
let guideMuteUntil=0, guideAt=0;
function updateGuide(){
  const g=$('guide'); if(!started||Date.now()<guideMuteUntil) { g.classList.add('hidden'); return; }
  if(!$('guideImg').src&&S&&S.textures.exists('jellop')){ const src=S.textures.get('jellop').getSourceImage(), cv=document.createElement('canvas'); cv.width=36; cv.height=32; cv.getContext('2d').drawImage(src,0,0,36,32,0,0,36,32); $('guideImg').src=cv.toDataURL(); }
  if(Date.now()<guideAt) return; guideAt=Date.now()+15000;
  const q=questNow(), tips=[];
  if(P.points>0) tips.push(`มีแต้มสเตตัส ${P.points} แต้ม กด C เพื่อลงนะ~`);
  if(P.skillPts>0) tips.push(`มีแต้มสกิล ${P.skillPts} แต้ม กด K แล้วอย่าลืมกดยืนยัน~`);
  if(canJobChange()) tips.push('Job Lv 10 แล้ว! ไปเปลี่ยนอาชีพที่สมาคมในเมืองหลวงกัน~');
  if(q) tips.push(`เควสต์ตอนนี้: ${q.desc} (${P.quest.prog||0}/${q.need})`);
  if(MAP.town) tips.push('ไปรับพรที่โบสถ์ก่อนออกล่า จะสู้ง่ายขึ้นนะ~');
  if(!P.bot.on&&!MAP.town) tips.push('กด B เพื่อเปิดออโต้ให้ตัวละครล่าเองได้~');
  if(!tips.length){ g.classList.add('hidden'); return; }
  $('guideText').textContent=tips[irnd(0,tips.length-1)]; g.classList.remove('hidden');
}

/* ---------- HUD extras ---------- */
function drawAvatar(){
  if(!S) return; const hid=P.equip&&P.equip.head, sig=P.job+(hid||'')+(HDW()?gearSig():''); const cv=$('avatar'); if(cv.dataset.sig===sig) return; cv.dataset.sig=sig;
  const src=S.textures.get(heroTex()).getSourceImage(), c=cv.getContext('2d'); c.imageSmoothingEnabled=false; c.clearRect(0,0,32,32);
  { const k=heroK(); if(k>1){ cv.width=cv.height=96; c.imageSmoothingEnabled=true; c.drawImage(src,8*k,13*k,32*k,32*k,0,0,96,96); cv.style.imageRendering='auto'; } else if(customFrame()){ const F=customFrame(), sz=F.charH*.42, top=F.base-F.charH; cv.width=cv.height=96; c.imageSmoothingEnabled=!F.nearest; c.drawImage(F.src,F.x+F.w/2-sz/2,F.y+top-4,sz,sz,0,0,96,96); cv.style.imageRendering=F.nearest?'pixelated':'auto'; } else c.drawImage(src,8,2,32,32,0,1,32,32); } drawStatusIcon();
  const hat=hid&&ITEMS[hid].hat, hgk=hid&&heroK()>1?ensureHG(P.job,hid):null;
  if(hgk){ const k=heroK(); c.imageSmoothingEnabled=true; c.drawImage(HD.sheets[hgk].canvas,8*k,13*k,32*k,32*k,0,0,cv.width,cv.height); }
  else if(hat){ const hs=S.textures.get(hat).getSourceImage(), f=cv.width/32; c.imageSmoothingEnabled=false; c.drawImage(hs,(16-hs.width/2)*f,Math.max(-4,9-hs.height)*f,hs.width*f,hs.height*f); }
  drawDoll();
}
function rarityCol(id){ const it=ITEMS[id]; return it&&it.r?RARITY[it.r][1]:null; }
function drawDoll(){
  const cv=$('eqDoll'); if(!cv||!S) return; const c=cv.getContext('2d'); c.imageSmoothingEnabled=false; c.clearRect(0,0,cv.width,cv.height);
  const src=S.textures.get(heroTex()).getSourceImage(), k=heroK(), F=customFrame(); if(F){ cv.width=144; cv.height=192; c.imageSmoothingEnabled=!F.nearest; const sc=Math.min(144/F.w,192/F.h); c.drawImage(F.src,F.x,F.y,F.w,F.h,(144-F.w*sc)/2,192-F.h*sc,F.w*sc,F.h*sc); cv.style.imageRendering=F.nearest?'pixelated':'auto'; return; }
  if(k>1){ cv.width=144; cv.height=192; c.imageSmoothingEnabled=true; c.drawImage(src,0,0,144,192,0,0,144,192); cv.style.imageRendering='auto'; c.scale(3,3); c.imageSmoothingEnabled=false; } else c.drawImage(src,0,0,48,64,0,0,48,64);
  const hid=P.equip&&P.equip.head, hat=hid&&ITEMS[hid].hat, hgk=hid&&k>1?ensureHG(P.job,hid):null;
  if(hgk){ c.setTransform(1,0,0,1,0,0); c.imageSmoothingEnabled=true; c.drawImage(HD.sheets[hgk].canvas,0,0,144,192,0,0,144,192); }
  else if(hat){ const hs=S.textures.get(hat).getSourceImage(); c.drawImage(hs,24-hs.width*.75,10-hs.height*1.5,hs.width*1.5,hs.height*1.5); }
}
function renderEquipWin(){
  const cell=([slot,label])=>{ const id=P.equip[slot], it=id&&ITEMS[id];
    return `<button class="eqs ${it?'has':''}" data-uneq="${slot}" title="${it?`${it.name} — ${it.desc} (แตะเพื่อถอด)`:label}">
      <span class="eic">${it?`<img alt="" src="${ICONS[id]}">`:''}</span><span class="etx"><small>${label}</small><b style="color:${it?RARITY[it.r][1]:'#7d8cb5'}">${it?it.name:'ว่าง'}</b></span></button>`; };
  $('eqL').innerHTML=SLOTS.slice(0,4).map(cell).join(''); $('eqR').innerHTML=SLOTS.slice(4).map(cell).join('');
  const d=derived(), B=equipBonus(); const st=Object.entries(B.stats).filter(([,v])=>v).map(([k,v])=>`${k.toUpperCase()} +${v}`).join(' · ');
  $('eqSum').innerHTML=`<span>ATK <b>${d.weapon.atk+B.atk}</b></span><span>MATK <b>+${d.weapon.matk}%</b></span><span>DEF <b>${B.def}</b></span><span>MDEF <b>${B.mdef}</b></span>${B.hp?`<span>MaxHP <b>+${B.hp}</b></span>`:''}${B.sp?`<span>MaxSP <b>+${B.sp}</b></span>`:''}${st?`<span class="full">${st}</span>`:''}`;
  drawDoll();
}
function lootToast(id){
  const f=$('lootFeed'), el=document.createElement('div'); el.className='loot'; const rc=rarityCol(id);
  el.innerHTML=`<img alt="" src="${ICONS[id]}"><span>${rc&&ITEMS[id].r!=='c'?`<b style="color:${ITEMS[id].r==='u'?'#1f8a3a':ITEMS[id].r==='r'?'#2c55b0':'#8a3ab0'}">${ITEMS[id].name}</b>`:ITEMS[id].name} ×1 ได้รับแล้ว</span>`; f.appendChild(el);
  while(f.children.length>3) f.firstChild.remove();
  setTimeout(()=>{ el.classList.add('out'); setTimeout(()=>el.remove(),380); },1800);
}
function showCombo(cb){
  if(!cb||cb.hits<2||!cb.total) return; const m=cb.tgt;
  const o=S.add.text(m.pos.x,m.pos.y-(m.def.fly?70:58),`TOTAL ${cb.total.toLocaleString()} · ${cb.hits} HIT`,{fontFamily:'Silkscreen, monospace',fontSize:'13px',color:'#ffd35a',stroke:'#3a2410',strokeThickness:4,resolution:TXT_RES}).setOrigin(.5).setDepth(62600).setScale(.4);
  S.tweens.add({targets:o,scale:1,duration:220,ease:'Back.Out'}); S.tweens.add({targets:o,y:o.y-16,alpha:0,delay:900,duration:450,onComplete:()=>o.destroy()});
}
function drawBracket(t){
  bracket.clear(); if(!target||target.dead) return; const sp=target.spr;
  const w=Math.max(30,sp.displayWidth)+8, h=Math.max(28,sp.displayHeight)+8, x0=sp.x-w/2, y0=sp.y-h+4, x1=sp.x+w/2, y1=sp.y+4, L=8;
  const a=.65+.35*Math.sin(t*.008); bracket.lineStyle(2,0xf0bd3f,a);
  [[x0,y0,1,1],[x1,y0,-1,1],[x0,y1,1,-1],[x1,y1,-1,-1]].forEach(([x,y,sx,sy])=>{ bracket.beginPath(); bracket.moveTo(x,y+sy*L); bracket.lineTo(x,y); bracket.lineTo(x+sx*L,y); bracket.strokePath(); });
}
function hudTick(){
  updateDps(); updateGuide();
  { const al=$('autoLabel'); const on=P.bot.on; al.classList.toggle('on',on); al.textContent=on?('ออโต้กำลังทำงาน'+'.'.repeat(1+Math.floor(Date.now()/400)%3)):'Space โจมตี · Q E R สกิล · 1–4 ไอเทม'; }
  const d=derived(); hero.hpTxt.setText(`${P.hp}/${d.maxHP}`);
  $('coords').textContent=`${hero.tx}, ${hero.ty}`;
  const now=new Date(); $('sbTime').textContent=now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  $('sbFps').textContent=Math.round(S.game.loop.actualFps); $('sbMob').textContent=mobs.filter(m=>!m.dead).length;
  if(!$('mapWin').classList.contains('hidden')) drawBigMap();
  { const bf=$('buffs'); if(P.buff&&P.buff.until>Date.now()){ const ms=P.buff.until-Date.now(), m=Math.floor(ms/60000), sc=Math.floor(ms/1000)%60; bf.innerHTML=`<span class="buff">✦ ${P.buff.name} +${P.buff.amt} · ${m}:${String(sc).padStart(2,'0')}</span>`; }
    else if(bf.innerHTML){ bf.innerHTML=''; if(P.buff){ P.buff=null; logMsg('พรแห่งแสงหมดเวลาแล้ว','sys'); refreshUI(); } } }
  if(MAP.town){ const h=now.getHours(); if(window.__bellHour===undefined) window.__bellHour=h; if(h!==window.__bellHour&&now.getMinutes()===0){ window.__bellHour=h; sfx('bell'); logMsg(`หอระฆังตีบอกเวลา ${h}:00 น.`,'sys'); } }
}
function drawBigMap(){
  const cv=$('bigMap'), c=cv.getContext('2d'), k=cv.width/W; c.imageSmoothingEnabled=false; c.drawImage(mmBase,0,0,cv.width,cv.height);
  mobs.forEach(m=>{ if(m.dead) return; c.fillStyle=m.def.mm||'#ff8fb8'; if(m.def.boss){ c.beginPath(); c.arc(m.tx*k+k/2,m.ty*k+k/2,k*1.4,0,Math.PI*2); c.fill(); c.strokeStyle='#3a2410'; c.lineWidth=2; c.stroke(); } else c.fillRect(m.tx*k+1,m.ty*k+1,k-2,k-2); });
  items.forEach(it=>{ c.fillStyle='#fff6a0'; c.fillRect(it.tx*k+2,it.ty*k+2,k-4,k-4); });
  c.fillStyle='#ffe066'; c.fillRect(npc.tx*k-2,npc.ty*k-2,k+4,k+4); townNpcs.forEach(n=>c.fillRect(n.ent.tx*k-1,n.ent.ty*k-1,k+2,k+2));
  PORTALS.forEach(pt=>{ const x=pt.tx*k+k/2, y=(pt.ty+1)*k; c.fillStyle='#39e0ff'; c.beginPath(); c.arc(x,y,k*1.3,0,Math.PI*2); c.fill();
    c.font='bold 12px "Chakra Petch", sans-serif'; c.textAlign=pt.back>0?'left':'right'; c.lineWidth=3; c.strokeStyle='#0a1830'; const lab=(pt.back>0?'◀ ':'')+pt.name.replace('Everhaven ','')+(pt.back<0?' ▶':'')+(pt.to?'':' (ปิด)'); const lx=pt.back>0?x+k*1.6:x-k*1.6;
    c.strokeText(lab,lx,y-k*1.6); c.fillStyle='#bff4ff'; c.fillText(lab,lx,y-k*1.6); });
  if(bot.wp&&P.bot.on){ c.strokeStyle='#9fff8a'; c.lineWidth=2; c.strokeRect(bot.wp[0]*k-2,bot.wp[1]*k-2,k+4,k+4); }
  const v=S.cameras.main.worldView; c.strokeStyle='rgba(255,255,255,.8)'; c.lineWidth=1.5; c.strokeRect(v.x/T*k,v.y/T*k,v.width/T*k,v.height/T*k);
  c.fillStyle='#fff'; c.beginPath(); c.arc(hero.tx*k+k/2,hero.ty*k+k/2,k*.9,0,Math.PI*2); c.fill(); c.fillStyle='#e5484d'; c.beginPath(); c.arc(hero.tx*k+k/2,hero.ty*k+k/2,k*.55,0,Math.PI*2); c.fill();
}
function wireHud(){
  // action wheel layout (arc around the attack button)
  // skill bar is laid out with CSS (no radial placement)
  $('rbMenu').onclick=()=>$('menuPop').classList.toggle('hidden');
  document.querySelectorAll('[data-cur]').forEach(b=>b.onclick=()=>toast(b.dataset.cur==='gem'?'ร้านคริสตัลยังไม่เปิดในต้นแบบ':'หาเงินได้จากการขายของดรอปให้พ่อค้า หรือทำเควสต์'));
  $('qtCard').onclick=openQuest;
  $('guide').onclick=()=>{ $('guide').classList.add('hidden'); guideMuteUntil=Date.now()+90000; };
  // chat
  document.querySelectorAll('#chatTabs .tab').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#chatTabs .tab').forEach(x=>x.classList.toggle('on',x===b)); $('log').dataset.f=b.dataset.f; $('log').scrollTop=1e6; });
  let fs=12.5; const setFs=v=>{ fs=clamp(v,10.5,16); document.documentElement.style.setProperty('--chat-fs',fs+'px'); };
  $('fsDown').onclick=()=>setFs(fs-1); $('fsUp').onclick=()=>setFs(fs+1);
  $('sendBtn').onclick=()=>{ const ci=$('chatInput'); ci.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); };
  // minimap + big map
  $('mapExpand').onclick=()=>{ $('mapWin').classList.remove('hidden'); drawBigMap(); };
  $('mapMin').onclick=()=>{ const mb=$('mapbox'); mb.classList.toggle('mini'); $('mapMin').innerHTML=mb.classList.contains('mini')?'<svg class="i"><use href="#i-map"/></svg>':'<svg class="i"><use href="#i-min"/></svg>'; };
  $('bigMap').addEventListener('click',e=>{ if(!started||hero.dead) return; const r=e.target.getBoundingClientRect(); const tx=Math.floor((e.clientX-r.left)/r.width*W), ty=Math.floor((e.clientY-r.top)/r.height*H);
    pauseBot(); standUp(); cancelCast(); target=null; pending=null; pendingSkill=null;
    const p=findPath(hero.tx,hero.ty,tx,ty,0,12000); if(p){ walk(hero,p); toast(`เดินไปยังพิกัด ${tx}, ${ty}`); } else toast('ไปยังจุดนั้นไม่ได้'); });
}

/* boot */
