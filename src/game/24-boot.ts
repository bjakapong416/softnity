/* ============================================================
   Boot → Title → Character → World
   ============================================================ */
const artCache={};
function mockScene(){ return { textures:{ exists:k=>!!artCache[k], createCanvas:(k,w,h)=>{ const cv=document.createElement('canvas'); cv.width=w; cv.height=h; artCache[k]=cv; const ctx=cv.getContext('2d'); ctx.imageSmoothingEnabled=false; return { getContext:()=>ctx, refresh(){}, add(){}, getSourceImage:()=>cv }; } }, anims:{ create(){}, exists:()=>true } }; }
const art=k=>artCache[k]?artCache[k].toDataURL():'';
function heroSheetObj(job,hair,withGear,look){ return (HD.on&&HD.ready)?(withGear?bakeHeroGear(job,hair):bakeHeroHD(job,hair,look)):null; }
function heroSheet(job,hair,withGear,look){ if(HD.on&&HD.ready) return (withGear?bakeHeroGear(job,hair):bakeHeroHD(job,hair,look)).canvas.toDataURL();
  const cv=document.createElement('canvas'); cv.width=48*27; cv.height=64; const c=cv.getContext('2d'); c.imageSmoothingEnabled=false;
  for(let i=0;i<27;i++) drawHero2(c,Math.floor(i/9),i%9,i*48,job,hair); outline(c,48*27,64,'#2a1a14'); return cv.toDataURL(); }
const BOOT_TIPS=['นั่งพักด้วยปุ่ม Z จะฟื้น HP/SP เร็วขึ้น 4 เท่า','King Jellop ปรากฏที่สะพานหินใน Everhaven Fields 02','ฝากของไว้ที่คลังสินค้าข้างโรงเตี๊ยมในเมืองหลวงได้','รับพรที่โบสถ์ ทุกสเตตัส +2 นาน 10 นาที','Fly Wing พาวาร์ปไปจุดสุ่มในแมพเดียวกัน','เปลี่ยนอาชีพได้ที่สมาคมในเมืองหลวงเมื่อถึง Job Lv 10'];
let bootTipT=null;
function bootProgress(p,msg){ $('bootBar').style.width=p+'%'; $('bootPct').textContent=Math.round(p)+'%'; if(msg) $('bootMsg').textContent=msg; }
function showBoot(msg){ const b=$('boot'); b.classList.remove('hidden','fade'); bootProgress(0,msg);
  const tip=()=>{ const t=$('bootTip'); t.textContent='💡 '+BOOT_TIPS[irnd(0,BOOT_TIPS.length-1)]; t.style.animation='none'; void t.offsetWidth; t.style.animation=''; }; tip(); clearInterval(bootTipT); bootTipT=setInterval(tip,3500); }
function hideBoot(){ const b=$('boot'); b.classList.add('fade'); clearInterval(bootTipT); setTimeout(()=>b.classList.add('hidden'),650); }
function buildTitle(){
  const s=mockScene(); try{ generateTextures(s); genTownTextures(s); genCapitalTextures(s); }catch(e){ console.warn('title art',e); }
  $('tsCastle').src=art('castle');
  // clouds
  $('tsClouds').innerHTML=[[8,1.2,80,-10],[18,.8,65,-40],[4,1.5,110,-70],[26,1,90,-20],[14,.7,55,-5]].map(([y,sc,d,dl])=>`<div class="ts-cloud" style="--y:${y}%;--s:${sc};--d:${d}s;--delay:${dl}s"></div>`).join('');
  // trees (trunk + canopy composite)
  const tree=(key)=>{ const cv=document.createElement('canvas'); cv.width=84; cv.height=104; const c=cv.getContext('2d'); c.drawImage(artCache.trunk,26,70); c.drawImage(artCache[key],0,0); return cv.toDataURL(); };
  const tr=[tree('canopyBloom'),tree('canopy'),tree('canopyAut')];
  $('tsTrees').innerHTML=[[2,14,3.2,0],[20,18,2.4,1],[74,17,2.6,0],[86,12,3.4,1],[64,22,1.8,2],[30,23,1.6,1]].map(([l,b,sc,k])=>`<img src="${tr[k]}" alt="" style="left:${l}%;bottom:${b}%;width:${84*sc}px">`).join('');
  // flowers
  const fl=[0,1,2,3].map(i=>art('flower'+i)).concat([art('tuft')]);
  let fh=''; for(let i=0;i<46;i++){ fh+=`<img src="${fl[i%5]}" alt="" style="left:${rnd(0,98)}%;bottom:${rnd(0,16)}%;width:${i%5===4?42:27}px;animation-delay:${rnd(-3,0)}s">`; } $('tsFlowers').innerHTML=fh;
  // jellops (our own mascot) hopping
  const jc=document.createElement('canvas'); jc.width=36; jc.height=32; const jx=jc.getContext('2d'); jx.drawImage(artCache.jellop,0,0,36,32,0,0,36,32); const jl=jc.toDataURL();
  $('tsJellops').innerHTML=[[16,7,3],[24,4,2.4],[70,6,3.2],[79,3,2.6],[58,2,2]].map(([l,b,sc],i)=>`<img src="${jl}" alt="" style="left:${l}%;bottom:${b}%;width:${36*sc}px;animation-duration:${(.9+i*.12).toFixed(2)}s;animation-delay:-${i*.3}s">`).join('');
  // moth flying across
  const mc=[0,1].map(f=>{ const cv=document.createElement('canvas'); cv.width=32; cv.height=32; cv.getContext('2d').drawImage(artCache.moth,f*32,0,32,32,0,0,32,32); return cv.toDataURL(); });
  let mf=0; setInterval(()=>{ mf^=1; $('tsMoth').src=mc[mf]; },130); $('tsMoth').src=mc[0];
  // petals
  let ph=''; for(let i=0;i<28;i++) ph+=`<i class="pt" style="left:${rnd(0,100)}%;animation-duration:${rnd(9,16).toFixed(1)}s;animation-delay:-${rnd(0,16).toFixed(1)}s;background:${['#ffc0d6','#ffe0ec','#ff9fc0'][i%3]}"></i>`; $('tsPetals').innerHTML=ph;
  // hero walking across the meadow
  const hs=heroSheet(P.job||'Novice',P.hair||0,hadSave), he=$('tsHero'); he.style.backgroundImage=`url(${hs})`; he.style.backgroundSize=`${48*27*3}px 192px`;
  const hso=heroSheetObj(P.job||'Novice',P.hair||0,hadSave);
  let hf=0; setInterval(()=>{ if(hso&&hso.eight){ const k=(he.clientWidth||144)/hso.fw, fr=hso.json.frames[`walk_E_${hf%8}`].frame; he.style.backgroundSize=`${hso.canvas.width*k}px ${hso.canvas.height*k}px`; he.style.backgroundPosition=`-${fr.x*k}px -${fr.y*k}px`; hf++; return; }
    hf=(hf+1)%4; he.style.backgroundPosition=`-${(18+2+hf)*(he.clientWidth||144)}px 0`; },90);
  // wiring
  $('soundBtn').textContent='เสียง: '+(P.sound?'เปิด':'ปิด');
  $('soundBtn').onclick=()=>{ P.sound=!P.sound; persist(); $('soundBtn').textContent='เสียง: '+(P.sound?'เปิด':'ปิด'); };
  const modal=(t,html)=>{ $('tsmT').textContent=t; $('tsmB').innerHTML=html; $('tsModal').classList.remove('hidden'); };
  $('tsmOk').onclick=()=>$('tsModal').classList.add('hidden');
  $('noticeBtn').onclick=()=>modal('ประกาศ','<ul><li>เปิดเมืองหลวง Everhaven พร้อมปราสาท โบสถ์ คลังสินค้า</li><li>เควสต์หลัก 8 บท รับรางวัล Sol และไอเทม</li><li>อัตรา EXP ×20 ช่วงทดสอบ</li><li>เร็ว ๆ นี้: Whisperwood, ท่าเรือ Everhaven</li></ul>');
  $('howBtn').onclick=()=>modal('วิธีเล่น',$('howTo').innerHTML);
  $('srvBtn').onclick=()=>modal('เลือกเซิร์ฟเวอร์','<p>● <b>Everhaven</b> (ออฟไลน์ในเบราว์เซอร์) — แนะนำ</p><p style="opacity:.6">● Whisperwood — เปิดในเฟส 2 Multiplayer</p>');
  $('enterBtn').onclick=()=>{ try{ AC.ctx=AC.ctx||new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} sfx('pop'); openCharSel(); };
}
/* character select / create */
const CS={ dir:0, hair:0, sheet:'', frame:0, timer:null, mode:'create' };
const CS_DIRS=[[0,false],[2,false],[1,false],[2,true]]; // down, right, up, left (pixel sheets)
const CS8=['S','SE','E','NE','N','NW','W','SW'];
function csRender(){
  const job=CS.mode==='select'?P.job:'Novice', hair=CS.mode==='select'?(P.hair||0):CS.hair;
  CS.obj=heroSheetObj(job,hair,CS.mode==='select',CS.mode==='select'?P.look:CS.look); CS.sheet=CS.obj?CS.obj.canvas.toDataURL():heroSheet(job,hair,CS.mode==='select',CS.mode==='select'?P.look:CS.look); const el=$('csSprite'); el.style.backgroundImage=`url(${CS.sheet})`; el.style.backgroundSize=CS.obj&&CS.obj.eight?`${CS.obj.canvas.width}px ${CS.obj.canvas.height}px`:`${48*27*3}px 192px`;
  const f=$('csForm');
  if(CS.mode==='create'){
    $('csTitle').textContent='สร้างตัวละคร'; $('csDel').classList.add('hidden'); $('csStart').textContent='สร้างและเริ่มผจญภัย';
    const L=CS.look, hex=n=>'#'+n.toString(16).padStart(6,'0'), opt=(k,v,label,on)=>`<button class="cs-opt ${on?'on':''}" data-${k}="${v}">${label}</button>`;
    f.innerHTML=`<label for="csName">ชื่อตัวละคร (2–16 ตัวอักษร)</label><input id="csName" maxlength="16" value="${CS.name??(P.name||'นักผจญภัย')}" autocomplete="off">
      <div class="cs-grid">
        <div><label>รูปร่าง</label><div class="cs-row">${LOOK.bodies.map(([v,n])=>opt('body',v,n,L.body===v)).join('')}</div></div>
        <div><label>ทรงผม</label><div class="cs-row">${LOOK.styles.map(([v,n])=>opt('style',v,n,L.style===v)).join('')}</div></div>
        <div><label>สีผม</label><div class="cs-sw">${HAIRS.map((h,i)=>`<button data-hair="${i}" class="${i===CS.hair?'on':''}" style="background:linear-gradient(135deg,${h[3]},${h[0]} 50%,${h[1]})" title="${HAIR_NAMES[i]}" aria-label="สีผม${HAIR_NAMES[i]}"></button>`).join('')}</div></div>
        <div><label>สีตา</label><div class="cs-sw">${LOOK.eyes.map(([c,n],i)=>`<button data-eye="${i}" class="${i===L.eye?'on':''}" style="background:radial-gradient(circle at 40% 35%,#fff 0 12%,${hex(c)} 14%)" title="${n}" aria-label="สีตา${n}"></button>`).join('')}</div></div>
        <div><label>สีผิว</label><div class="cs-sw">${LOOK.skins.map(([c,n],i)=>`<button data-skin="${i}" class="${i===L.skin?'on':''}" style="background:${hex(c)}" title="${n}" aria-label="สีผิว${n}"></button>`).join('')}</div></div>
      </div>
      <div class="cs-row" style="margin-top:8px"><button class="cs-opt" id="csRand">🎲 สุ่มหน้าตา</button></div>
      <div class="cs-note">ทุกคนเริ่มเป็น <b>Novice</b> ที่เมืองหลวง Everhaven ชุดจะเปลี่ยนตามอาชีพและไอเทมที่สวม</div>`;
    const re=()=>{ CS.name=$('csName').value; csRender(); };
    f.querySelectorAll('[data-hair]').forEach(b=>b.onclick=()=>{ CS.hair=+b.dataset.hair; re(); });
    f.querySelectorAll('[data-eye]').forEach(b=>b.onclick=()=>{ L.eye=+b.dataset.eye; re(); });
    f.querySelectorAll('[data-skin]').forEach(b=>b.onclick=()=>{ L.skin=+b.dataset.skin; re(); });
    f.querySelectorAll('[data-style]').forEach(b=>b.onclick=()=>{ L.style=b.dataset.style; re(); });
    f.querySelectorAll('[data-body]').forEach(b=>b.onclick=()=>{ L.body=b.dataset.body; re(); });
    $('csRand').onclick=()=>{ CS.hair=irnd(0,HAIRS.length-1); Object.assign(L,{ style:LOOK.styles[irnd(0,LOOK.styles.length-1)][0], eye:irnd(0,LOOK.eyes.length-1), skin:irnd(0,LOOK.skins.length-1), body:Math.random()<.5?'m':'f' }); re(); };
    $('csName').addEventListener('keydown',e=>e.stopPropagation());
  } else {
    $('csTitle').textContent='เลือกตัวละคร'; $('csDel').classList.remove('hidden'); $('csStart').textContent='เริ่มผจญภัย';
    f.innerHTML=`<dl class="cs-card"><dt>ชื่อ</dt><dd>${P.name}</dd><dt>อาชีพ</dt><dd>${P.job}</dd><dt>Base / Job</dt><dd>Lv ${P.lv} / Job ${P.jlv}</dd><dt>ตำแหน่ง</dt><dd>${(MAPS[P.map]||MAPS.town).name}</dd><dt>เงิน</dt><dd>${P.sol.toLocaleString()} Sol</dd><dt>เควสต์หลัก</dt><dd>${Math.min((P.quest&&P.quest.i)||0,QUESTS.length)}/${QUESTS.length} บท</dd></dl>
      <div class="cs-note">ข้อมูลตัวละครเก็บไว้ในเบราว์เซอร์นี้ ลบแล้วกู้คืนไม่ได้</div>`;
  }
}
function csAnimate(){ clearInterval(CS.timer); CS.timer=setInterval(()=>{ const el0=$('csSprite'); if(CS.obj&&CS.obj.eight){ CS.frame=(CS.frame+1)%8; const fr=CS.obj.json.frames[`walk_${CS8[CS.dir%8]}_${CS.frame}`].frame; el0.style.backgroundPosition=`-${fr.x}px -${fr.y}px`; el0.style.transform='none'; return; } CS.frame=(CS.frame+1)%4; const [di,flip]=CS_DIRS[CS.dir]; const el=$('csSprite'); el.style.backgroundPosition=`-${(di*9+2+CS.frame)*144}px 0`; el.style.transform=flip?'scaleX(-1)':'none'; },130); }
function openCharSel(){ CS.mode=hadSave?'select':'create'; CS.hair=P.hair||0; CS.look=Object.assign(defLook(),P.look||{}); CS.name=undefined; $('tsPanel').classList.add('hidden'); $('charSel').classList.remove('hidden'); csRender(); csAnimate(); }
function wireCharSel(){
  $('csRotL').onclick=()=>{ CS.dir=CS.obj&&CS.obj.eight?(CS.dir+7)%8:(CS.dir+3)%4; }; $('csRotR').onclick=()=>{ CS.dir=CS.obj&&CS.obj.eight?(CS.dir+1)%8:(CS.dir+1)%4; };
  $('csBack').onclick=()=>{ clearInterval(CS.timer); $('charSel').classList.add('hidden'); $('tsPanel').classList.remove('hidden'); };
  $('csDel').onclick=()=>{ if(!confirm(`ลบตัวละคร ${P.name} ถาวร?`)) return; try{ localStorage.removeItem(SAVE_KEY); localStorage.removeItem('softnity-proto-v1'); }catch(e){} P=freshPlayer(); hadSave=false; CS.mode='create'; CS.hair=0; CS.look=defLook(); CS.name=undefined; csRender(); };
  $('csStart').onclick=()=>{
    if(CS.mode==='create'){ const nm=($('csName').value||'').trim(); if(nm.length<2){ $('csName').focus(); $('csName').style.borderColor='#e5484d'; return; } P=freshPlayer(); P.name=nm.slice(0,16); P.hair=CS.hair; P.look=Object.assign({},CS.look); hadSave=true; persist(); }
    try{ AC.ctx=AC.ctx||new (window.AudioContext||window.webkitAudioContext)(); }catch(e){}
    sfx('jobchange'); clearInterval(CS.timer); $('charSel').classList.add('hidden'); $('title').classList.add('hidden');
    showBoot('กำลังเข้าสู่โลก'); let p=0; const t=setInterval(()=>{ p=Math.min(92,p+rnd(4,12)); bootProgress(p); },120); window.__bootT=t;
    bakeAllHD().then(()=>setTimeout(bootGame,150));
  };
}
function onGameReady(){ clearInterval(window.__bootT); bootProgress(100,'พร้อมแล้ว'); setTimeout(()=>{ hideBoot(); $('startBtn').onclick(); },350); }
function bootGame(){
  const host=$('game');
  if(HDW()&&!Phaser.__hdImg){ Phaser.__hdImg=true; const F=Phaser.GameObjects.GameObjectFactory.prototype, _img=F.image; F.image=function(x,y,key,frame){ const o=_img.call(this,x,y,key,frame); if(HD_IMG[key]) o.setScale(HD_IMG[key]); return o; }; }
  const game=new Phaser.Game({ type:Phaser.AUTO, parent:'game', pixelArt:!HDW(), roundPixels:!HDW(), antialias:true, backgroundColor:'#2f6b33',
    scale:{ mode:Phaser.Scale.NONE, width:Math.round(host.clientWidth*DPR), height:Math.round(host.clientHeight*DPR), zoom:1/DPR }, scene:[Field] });
  const onResize=()=>{ if(!game.canvas||!game.isBooted) return; game.scale.resize(Math.round(host.clientWidth*DPR),Math.round(host.clientHeight*DPR)); game.scale.setZoom(1/DPR); };
  window.addEventListener('resize',onResize); if(window.visualViewport) visualViewport.addEventListener('resize',onResize);
}
async function boot(){
  // twinkling stars
  let st=''; for(let i=0;i<70;i++) st+=`<span style="left:${rnd(0,100)}%;top:${rnd(0,100)}%;animation-delay:-${rnd(0,3).toFixed(1)}s;opacity:${rnd(.3,1).toFixed(2)}"></span>`; $('btStars').innerHTML=st;
  showBoot('กำลังโหลดทรัพยากร'); let p=0; const t=setInterval(()=>{ p=Math.min(70,p+rnd(3,9)); bootProgress(p); },110);
  const t0=Date.now();
  try{ await Promise.race([Promise.all([document.fonts.load('16px "Chakra Petch"'),document.fonts.load('16px Silkscreen'),document.fonts.load('700 16px Cinzel')]), new Promise(r=>setTimeout(r,2500))]); }catch(e){}
  bootProgress(70,'กำลังโหลดตัวละครจากไฟล์'); await loadCustomSprites(); await loadCustomMaps();
  bootProgress(74,'กำลังโหลดโมเดล 3D'); await initHD(); await bakeAllHD(p=>bootProgress(74+p*20,'กำลังเรนเดอร์ตัวละคร HD'));
  bootProgress(96,'กำลังวาดโลก Everhaven'); wireUI(); wireCharSel(); buildTitle();
  if(HD.on&&HD.ready){ $('tsHero').style.imageRendering='auto'; $('csSprite').style.imageRendering='auto'; }
  await new Promise(r=>setTimeout(r,Math.max(0,1600-(Date.now()-t0))));
  clearInterval(t); bootProgress(100,'พร้อมแล้ว');
  setTimeout(()=>{ hideBoot(); $('title').classList.remove('hidden'); },400);
}
if(window.Phaser) boot(); else { document.getElementById('bootMsg').textContent='โหลดเอนจินเกมไม่สำเร็จ ลองรีเฟรชหน้านี้'; }
