/* ---------- skill icons (own pixel art) ---------- */
const SKICON={};
function drawSkillIcon(c,id){
  const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
  const L=(x0,y0,x1,y1,col,w=2)=>{ const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1; for(let i=0;i<=n;i++) r(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),w,w,col); };
  const diamond=(cx,cy,hw,hh,col)=>{ for(let y=-hh;y<=hh;y++){ const w=Math.round(hw*(1-Math.abs(y)/hh)); if(w>0) r(cx-w,cy+y,w*2,1,col); } };
  const arrow=(x0,y0,x1,y1)=>{ L(x0,y0,x1,y1,'#8a5a2b',2); const dx=Math.sign(x1-x0), dy=Math.sign(y1-y0); r(x1-1,y1-1,4,4,'#cfd8e0'); r(x1+dx,y1+dy,2,2,'#ffffff'); r(x0-dx*2,y0-dy*2,3,3,'#f4efe2'); };
  switch(id){
    case 'firebolt': L(27,3,15,15,'#ffc04d',4); L(24,2,13,13,'#ff7a2a',3); L(29,7,17,17,'#ff7a2a',3); disc(c,12,20,9,'#c9361a'); disc(c,11,19,7,'#ff7a2a'); disc(c,10,18,5,'#ffc04d'); disc(c,9,17,2,'#fff6d0'); break;
    case 'coldbolt': diamond(16,16,9,14,'#4fa8e8'); diamond(16,15,6,11,'#9fe3ff'); diamond(15,13,2,6,'#ffffff'); diamond(6,24,2,4,'#9fe3ff'); diamond(26,8,2,4,'#9fe3ff'); break;
    case 'lightning': [[21,2,12,15],[12,15,21,15],[21,15,11,30]].forEach(a=>L(a[0],a[1],a[2],a[3],'#e0a51c',5)); [[21,2,12,15],[12,15,21,15],[21,15,11,30]].forEach(a=>L(a[0]+1,a[1]+1,a[2]+1,a[3],'#fff38a',3)); r(16,14,3,3,'#ffffff'); break;
    case 'napalm': disc(c,16,16,13,'#3b1d6e'); disc(c,16,16,10,'#7a4ad0'); disc(c,16,16,6,'#b98cff'); disc(c,15,15,3,'#f1e6ff'); [[4,6],[27,9],[6,26],[26,25]].forEach(([x,y])=>r(x,y,2,2,'#e2d2ff')); break;
    case 'bash': L(5,27,22,10,'#dfe7ee',3); L(6,28,23,11,'#9aa7b3',1); L(19,6,27,14,'#e2b44a',2); L(23,10,28,5,'#7a4a22',3); [[8,4],[4,10],[12,10],[8,14]].forEach(([x,y])=>L(8,9,x,y,'#ffd35a',2)); r(7,8,3,3,'#ffffff'); break;
    case 'magnum': disc(c,16,20,14,'#c9361a',9); disc(c,16,20,11,'#ff7a2a',7); disc(c,16,20,7,'#ffc04d',4); disc(c,16,20,3,'#fff6d0',2); [4,10,16,22,28].forEach((x,i)=>{ const h=6+(i%2?4:8); for(let k=0;k<h;k++) r(x-Math.floor((h-k)/4),12-k+ (i%2?2:0),Math.max(1,Math.floor((h-k)/2)),1,k<2?'#ffc04d':'#ff7a2a'); }); break;
    case 'dstrafe': arrow(4,22,24,2); arrow(8,29,28,9); break;
    case 'ashower': [7,16,25].forEach((x,i)=>arrow(x,3+i%2*3,x,22+i%2*3)); r(3,28,26,2,'#b98a4c'); break;
    case 'owleye': disc(c,16,16,14,'#f4efe2',9); disc(c,16,16,7,'#3f8f47'); disc(c,16,16,4,'#111111'); r(12,12,3,3,'#ffffff'); r(3,6,8,2,'#5a3b1e'); r(21,6,8,2,'#5a3b1e'); break;
    case 'vulture': disc(c,16,16,12,'#f4efe2',8); disc(c,16,16,6,'#c9a21e'); disc(c,16,16,3,'#111111'); r(1,15,9,2,'#e2524a'); r(22,15,9,2,'#e2524a'); r(15,1,2,9,'#e2524a'); r(15,22,2,9,'#e2524a'); r(13,13,2,2,'#ffffff'); break;
    case 'swordmastery': r(14,2,4,20,'#dfe7ee'); r(17,2,1,20,'#9aa7b3'); r(15,1,2,1,'#ffffff'); r(8,21,16,3,'#e2b44a'); r(14,24,4,5,'#7a4a22'); disc(c,16,30,2,'#e2b44a'); [[5,6],[26,9],[6,15],[25,17]].forEach(([x,y])=>{ r(x,y-1,1,3,'#ffe98a'); r(x-1,y,3,1,'#ffe98a'); }); break;
    case 'hprecovery': disc(c,10,12,7,'#e2524a'); disc(c,22,12,7,'#e2524a'); for(let y=12;y<28;y++){ const w=Math.round(15*(1-(y-12)/16)); r(16-w,y,w*2,1,'#e2524a'); } r(8,8,3,3,'#ffb0a8'); r(14,10,4,12,'#ffffff'); r(10,14,12,4,'#ffffff'); break;
    case 'sprecovery': for(let y=3;y<16;y++){ const w=Math.round(9*(y-3)/13); r(16-w,y,w*2+1,1,'#3d7bf0'); } disc(c,16,20,10,'#3d7bf0'); r(11,15,3,5,'#9fc4ff'); r(15,13,3,12,'#ffffff'); r(11,17,11,4,'#ffffff'); break;
    case 'basic': r(4,7,24,19,'#8a5a2b'); r(6,8,10,16,'#f4efe2'); r(16,8,10,16,'#e8dfc8'); r(15,7,2,19,'#5a3b1e'); [11,14,17,20].forEach(y=>{ r(8,y,6,1,'#9c8a70'); r(18,y,6,1,'#9c8a70'); }); r(22,2,2,6,'#e2524a'); break;
    case 'firstaid': r(5,6,22,20,'#ffffff'); r(5,6,22,3,'#e8e0cc'); r(13,10,6,14,'#e2524a'); r(9,14,14,6,'#e2524a'); r(12,3,8,3,'#9c8a70'); break;
  }
}
function buildSkillIcons(){
  Object.keys(SKILLS).forEach(id=>{ const cv=document.createElement('canvas'); cv.width=32; cv.height=32; const c=cv.getContext('2d'); c.imageSmoothingEnabled=false; drawSkillIcon(c,id); outline(c,32,32,'#1c1a2a'); SKICON[id]=cv.toDataURL(); });
}
buildSkillIcons();

/* ---------- skill tree window ---------- */
let skStage=null, skSel=null, skDragMoved=false;
function skStageInit(){ skStage=Object.assign({},P.skills); }
function skPtsLeft(){ let used=0; for(const id in skStage) used+=(skStage[id]||0)-(P.skills[id]||0); return P.skillPts-used; }
function skDirty(){ return !!skStage && Object.keys(SKILLS).some(id=>(skStage[id]||0)!==(P.skills[id]||0)); }
function skillList(){ const ids=[...JOB_SKILLS[P.job]]; if(P.job!=='Novice') ids.push(...JOB_SKILLS.Novice); return ids; }
function skillDetail(id,lv){
  const sk=SKILLS[id]; if(sk.type==='passive'||sk.type==='self') return sk.desc(lv);
  const d=derived(), parts=[];
  const hits=typeof sk.hits==='function'?sk.hits(lv):sk.hits;
  if(sk.pct) parts.push(`${sk.pct(lv)}% ${sk.kind==='magic'?'MATK':'ATK'}${hits>1?` × ${hits} ครั้ง`:''}`);
  if(sk.elem&&sk.elem!=='Neutral') parts.push(`ธาตุ ${sk.elem}`);
  if(sk.cast){ const base=sk.cast(lv)/1000, eff=base*Math.max(0,1-d.dex/150); parts.push(`ร่าย ${eff.toFixed(2)} วิ (ลดตาม DEX จาก ${base.toFixed(1)} วิ)`); } else parts.push('ใช้ได้ทันที');
  parts.push(sk.range==='weapon'?`ระยะ ${d.range} ช่อง (ตามอาวุธ, ภายในจอ)`:sk.range?`ระยะ ${sk.range(lv)} ช่อง (ภายในจอ)`:'รอบตัว');
  if(sk.radius) parts.push(`พื้นที่ ${sk.radius*2+1}×${sk.radius*2+1}`); if(sk.knock) parts.push(`ผลักถอย ${sk.knock} ช่อง`); if(sk.hitBonus) parts.push(`HIT +${sk.hitBonus(lv)}%`);
  parts.push(`SP ${sk.sp(lv)}`); parts.push(`ดีเลย์หลังใช้ ${(sk.delay(lv)/1000).toFixed(1)} วิ`);
  return parts.join(' · ');
}
function renderSkillWin(){
  if(!skStage) skStageInit();
  const ids=skillList(); if(!skSel||!ids.includes(skSel)) skSel=ids.find(id=>SKILLS[id].type!=='passive')||ids[0];
  const left=skPtsLeft();
  const card=id=>{ const sk=SKILLS[id], lv=skStage[id]||0, base=P.skills[id]||0;
    const canAdd=!sk.free&&sk.job===P.job&&lv<sk.max&&left>0, canSub=lv>base;
    return `<div class="skc ${id===skSel?'sel':''} ${lv?'':'nl'} ${lv!==base?'staged':''}" data-id="${id}">
      <div class="nm" title="${sk.name}">${sk.name}</div><div class="icb" data-drag="${id}"><img alt="" src="${SKICON[id]}"></div>
      <div class="ctl"><button data-sub="${id}" ${canSub?'':'disabled'} aria-label="ลดเลเวล ${sk.name}">−</button><span>${lv} / ${sk.max}</span><button data-add="${id}" ${canAdd?'':'disabled'} aria-label="เพิ่มเลเวล ${sk.name}">+</button></div>
      <div class="tag">${lv?`เรียนแล้ว · Lv.${lv}`:'ยังไม่เรียน'}${sk.job!==P.job?` · ${sk.job}`:''}</div></div>`; };
  $('skActive').innerHTML=ids.filter(id=>SKILLS[id].type!=='passive').map(card).join('');
  $('skPassive').innerHTML=ids.filter(id=>SKILLS[id].type==='passive').map(card).join('');
  const sk=SKILLS[skSel], lv=skStage[skSel]||0, show=Math.max(1,lv);
  $('skDetail').innerHTML=`<div class="big"><img alt="" src="${SKICON[skSel]}"></div><div>
    <h3>${sk.name} · Lv.${lv}${lv?'':' <small style="font-size:13px;color:#8a7a60">(ตัวอย่าง Lv.1)</small>'}</h3>
    <p>${skillDetail(skSel,show)}</p>
    ${lv&&lv<sk.max?`<p class="next">เลเวลถัดไป: ${skillDetail(skSel,lv+1)}</p>`:''}
    <div class="hint">${sk.type==='passive'?'สกิลติดตัว ทำงานอัตโนมัติเมื่อเรียนแล้ว':'ลากไอคอนสกิลที่เรียนแล้วไปวางที่ช่อง Q E R ด้านล่างหรือวงล้อขวาล่าง · บนมือถือแตะค้างแล้วลาก หรือเลือกสกิลแล้วแตะช่อง'}</div></div>`;
  $('skBind').innerHTML='ช่องลัดสกิล '+[0,1,2].map(i=>{ const id=P.skillbar[i]; return `<button class="bz" data-bind="${i}" aria-label="ผูกกับปุ่ม ${'QER'[i]}"><span class="k">${'QER'[i]}</span>${id?`<img alt="" src="${SKICON[id]}">`:''}</button>`; }).join('')+' <small>แตะช่องเพื่อผูกสกิลที่เลือก</small>';
  $('skPts').textContent=left; $('skJob').textContent=P.job;
  const dirty=skDirty(); $('skApply').disabled=!dirty; $('skApply').classList.toggle('pulse',dirty); $('skReset').disabled=!dirty;
}
function bindSkill(id,slot){
  const sk=SKILLS[id]; if(!sk||sk.type==='passive'){ toast('สกิลติดตัวไม่ต้องผูกปุ่ม'); return; }
  if(!(P.skills[id]>0)){ toast('เรียนสกิลแล้วกดยืนยันก่อนผูกปุ่ม'); return; }
  P.skillbar=P.skillbar.map(x=>x===id?null:x); P.skillbar[slot]=id; persist(); refreshSkillSlots(); renderSkillWin(); sfx('pickup'); toast(`ผูก ${sk.name} กับปุ่ม ${'QER'[slot]} แล้ว`);
}
function wireSkillWin(){
  const win=$('skillWin');
  win.addEventListener('click',e=>{
    if(skDragMoved) return;
    const a=e.target.closest('[data-add]'), sb=e.target.closest('[data-sub]'), bz=e.target.closest('[data-bind]'), c=e.target.closest('.skc');
    if(a){ const id=a.dataset.add; if(skPtsLeft()>0){ skStage[id]=(skStage[id]||0)+1; skSel=id; sfx('pop'); } renderSkillWin(); return; }
    if(sb){ const id=sb.dataset.sub; if((skStage[id]||0)>(P.skills[id]||0)) skStage[id]--; skSel=id; renderSkillWin(); return; }
    if(bz){ bindSkill(skSel,+bz.dataset.bind); return; }
    if(c){ skSel=c.dataset.id; renderSkillWin(); }
  });
  $('skApply').onclick=()=>{ if(!skDirty()) return; const left=skPtsLeft(); P.skills=Object.assign({},skStage); P.skillPts=left; skStage=null; persist(); refreshUI(); renderSkillWin(); sfx('job'); toast('อัปสกิลเรียบร้อย'); };
  $('skReset').onclick=()=>{ skStage=null; renderSkillWin(); };
  // drag & drop learned active skills onto Q/E/R
  let drag=null;
  const zoneAt=(x,y)=>{ const el=document.elementFromPoint(x,y); return el&&el.closest('[data-bind],#wheel [data-sk]'); };
  const hot=z=>document.querySelectorAll('.hot').forEach(el=>el.classList.toggle('hot',el===z));
  win.addEventListener('pointerdown',e=>{ const d=e.target.closest('[data-drag]'); if(!d) return; drag={id:d.dataset.drag,x:e.clientX,y:e.clientY,ghost:null}; });
  window.addEventListener('pointermove',e=>{ if(!drag) return;
    if(!drag.ghost){ if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8) return; const sk=SKILLS[drag.id];
      if(sk.type==='passive'||!(P.skills[drag.id]>0)){ drag=null; return; }
      drag.ghost=document.createElement('img'); drag.ghost.className='skdrag'; drag.ghost.src=SKICON[drag.id]; document.body.appendChild(drag.ghost); skDragMoved=true; }
    drag.ghost.style.left=e.clientX+'px'; drag.ghost.style.top=e.clientY+'px'; const z=zoneAt(e.clientX,e.clientY); hot(z); if(!z) document.querySelectorAll('.hot').forEach(el=>el.classList.remove('hot')); });
  const end=e=>{ if(!drag) return; if(drag.ghost){ const z=zoneAt(e.clientX,e.clientY); if(z) bindSkill(drag.id,+(z.dataset.bind??z.dataset.sk)); drag.ghost.remove(); document.querySelectorAll('.hot').forEach(el=>el.classList.remove('hot')); setTimeout(()=>{ skDragMoved=false; },0); } drag=null; };
  window.addEventListener('pointerup',end); window.addEventListener('pointercancel',end);
}

function checkPortal(t){
  if(hero.dead||t<portalCd||transitioning) return;
  const pt=PORTALS.find(p=>hero.tx===p.tx&&(hero.ty===p.ty||hero.ty===p.ty+1)); if(!pt) return;
  portalCd=t+2500; hero.path=[]; target=null; pending=null;
  if(pt.to && !P.bot.on){ changeMap(pt.to,pt.side==='east'?'west':'east'); return; }
  sfx('warp'); const back=[hero.tx+pt.back*2,hero.ty];
  S.time.delayedCall(260,()=>{ const p=findPath(hero.tx,hero.ty,back[0],back[1]); if(p) walk(hero,p); });
  if(P.bot.on){ toast(pt.to?'บอทไม่ข้ามแมพเอง ปิดบอทก่อนเข้าประตูวาร์ป':`${pt.name} ยังไม่เปิดในต้นแบบ บอทกลับเข้าแมพ`); bot.wp=null; return; }
  openDialog('ประตูวาร์ป',`ประตูนี้ไปยัง ${pt.name} (${pt.lv}) แมพนี้ยังไม่เปิดในต้นแบบ จะเปิดในอัปเดตถัดไป`,[['รับทราบ',()=>closeWin('dialog')]]);
}

/* equipped headgear as a paper-doll layer: a 3D-baked sheet whose frames match the hero sheet 1:1 */
const HG_MODELS=['strawhat','crown','kingcrown','bunnyband','thorncirclet','boarhelm'];
function ensureHG(job,id){ const L=Object.assign(defLook(),P.look||{}), key=`hg-${job}-${id}-${L.style}-${L.body}`; if(!HDW()||!HG_MODELS.includes(id)) return null;
  if(!HD.sheets[key]) HD.sheets[key]=HD.M.bakeHeadgear8(job,id,{ w:48, h:64, k:HD.K, scale:heroScale(job) },lookOf(P.look));
  if(S&&S.textures&&!S.textures.exists(key)){ const r=HD.sheets[key]; S.textures.addAtlas(key,r.canvas,r.json); S.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR); }
  return key; }
function updateHat(){
  const id=P.equip&&P.equip.head, it=id&&ITEMS[id], h=hero.hat; if(!h) return;
  if(customKey()){ h.setVisible(false); if(hero.hg) hero.hg.setVisible(false); return; }
  const hk=it&&!hero.dead&&heroK()>1?ensureHG(P.job,id):null;
  if(hk){ h.setVisible(false); if(!hero.hg) hero.hg=S.add.sprite(0,0,hk,'idle_S_0').setOrigin(.5,1); if(hero.hg.texture.key!==hk) hero.hg.setTexture(hk,'idle_S_0');
    const f=hero.spr.frame&&hero.spr.frame.name!=null?hero.spr.frame.name:0;
    hero.hg.setVisible(hero.spr.visible).setPosition(hero.spr.x,hero.spr.y).setScale(hero.spr.scaleX,hero.spr.scaleY).setFlipX(hero.spr.flipX).setFrame(f).setDepth(hero.spr.depth+.5).setAlpha(hero.spr.alpha).setRotation(hero.spr.rotation); return; }
  if(hero.hg) hero.hg.setVisible(false);
  if(!it||!it.hat||hero.dead){ h.setVisible(false); return; }
  if(h.texture.key!==it.hat) h.setTexture(it.hat);
  const fr=hero.spr.frame&&hero.spr.frame.name!=null?(+hero.spr.frame.name)%9:0, bob={1:1,3:-1,5:-1,8:7}[fr]||0;
  const side=hero.facing.dx!==0, flip=hero.spr.flipX;
  h.setVisible(true).setScale(1.5).setFlipX(flip).setPosition(hero.spr.x+(side?(flip?-1:1):0), hero.spr.y-(heroK()>1?45:54)+bob).setDepth(hero.spr.depth+.5);
}

