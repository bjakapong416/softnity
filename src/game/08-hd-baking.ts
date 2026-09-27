/* ---------- HD character sprites: 3D models pre-rendered into sprite sheets (like classic RO) ---------- */
const HD={ on:true, K:3, sheets:{}, M:null, ready:false };
const HERO_SCALE=.86; // leaves headroom inside the 48x64 frame for tall headgear
const heroScale=j=>(j==='Novice'||j==='Swordman')?.8:HERO_SCALE; // Novice v2 has taller proportions
const HD_KEYS=new Set();
async function initHD(){
  if(P.hd===false){ HD.on=false; return; }
  try{ const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'); HD.M=SoftnityModels(THREE); HD.ready=true; }
  catch(e){ console.warn('HD sprites unavailable, using pixel art',e); HD.on=false; }
}
const hairHex=i=>{ const h=HAIRS[i||0]; return [parseInt(h[0].slice(1),16),parseInt(h[1].slice(1),16)]; };
const LOOK={ styles:[['spiky','ผมชี้'],['short','สั้นเรียบ'],['bob','บ๊อบ'],['long','ยาวตรง'],['ponytail','หางม้า'],['twintail','แกละคู่'],['bun','มวยผม']],
  eyes:[[0x2a4f9a,'น้ำเงิน'],[0x3a8a4a,'เขียว'],[0x7a4a2a,'น้ำตาล'],[0x8a3aa8,'ม่วง'],[0xc0392b,'แดง'],[0xd4a020,'ทอง']],
  skins:[[0xffdcc2,'ขาวอมชมพู'],[0xf5caa0,'ขาวเหลือง'],[0xe0a878,'สองสี'],[0xb97a52,'แทน'],[0x8a5a3a,'เข้ม']], bodies:[['m','ชาย'],['f','หญิง']] };
const defLook=()=>({ style:'spiky', eye:0, skin:0, body:'m' });
const lookOf=L=>{ L=Object.assign(defLook(),L||{}); return { style:L.style, eye:LOOK.eyes[L.eye][0], skin:LOOK.skins[L.skin][0], body:L.body }; };
const lookSig=L=>{ L=Object.assign(defLook(),L||{}); return `${L.style}.${L.eye}.${L.skin}.${L.body}`; };
const HERO8=new Set();
function bakeHeroHD(job,hair,look){ look=look||P.look; const key=`hero-${job}-${hair||0}-${lookSig(look)}`; if(HD.sheets[key]) return HD.sheets[key];
  const M=HD.M, m=M.makeHero(job,hairHex(hair),undefined,undefined,lookOf(look)); return HD.sheets[key]=M.bake8(m,{ w:48, h:64, k:HD.K, scale:heroScale(job) }); }
function addHero8(s,key,sheet){ const src=document.createElement('canvas'); src.width=sheet.canvas.width; src.height=sheet.canvas.height; src.getContext('2d').drawImage(sheet.canvas,0,0);
  if(s.textures.exists(key)) s.textures.remove(key); s.textures.addAtlas(key,src,sheet.json); s.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
  Object.entries(sheet.json.animations).forEach(([n,a])=>{ const k=`${key}-${n}`; if(s.anims.exists(k)) s.anims.remove(k); s.anims.create({ key:k, frames:a.frames.map(f=>({ key, frame:f })), frameRate:a.frameRate, repeat:a.repeat }); });
  HD_KEYS.add(key); HERO8.add(key); }
function ensureHeroTex(job){ if(!HDW()||!S) return; const key='hero-'+job; if(HERO8.has(key)) return; addHero8(S,key,bakeHeroHD(job,P.hair)); }
const MOB_HD={ jellop:{make:'makeJellop',w:36,h:32,f:[['idle',0],['hurt',0]]}, moth:{make:'makeMoth',w:32,h:32,f:[['idle',.2],['idle',.7]]},
  bunny:{make:'makeBunny',w:32,h:32,f:[['idle',0],['idle',.25]]}, thornling:{make:'makeThornling',w:32,h:32,f:[['idle',.2],['idle',.7]]},
  boarling:{make:'makeBoarling',w:42,h:32,f:[['idle',0],['idle',.5]]}, kingjellop:{make:'makeKingJellop',w:64,h:56,f:[['idle',0],['hurt',0]]} };
function bakeMobHD(key){ if(HD.sheets[key]) return HD.sheets[key]; const c=MOB_HD[key], M=HD.M;
  return HD.sheets[key]=M.bake(M[c.make](),{ dirs:[-Math.PI/2+.6], frames:c.f.map(([st,ph])=>({state:st,ph})), w:c.w, h:c.h, k:HD.K, fit:true }); }
const HD_IMG={};
const HDW=()=>HD.on&&HD.ready;
const PROP_HD={ rock:{m:'makeRock',w:32,h:24}, tuft:{m:'makeTuft',w:14,h:12}, reed:{m:'makeReed',w:14,h:24}, wheat:{m:'makeWheat',w:14,h:24}, hay:{m:'makeHay',w:40,h:32}, lily:{m:'makeLily',w:18,h:10},
  flower0:{m:'makeFlower',a:[0xffffff],w:12,h:14}, flower1:{m:'makeFlower',a:[0xffd84a],w:12,h:14}, flower2:{m:'makeFlower',a:[0xff8fb3],w:12,h:14}, flower3:{m:'makeFlower',a:[0x8ec5ff],w:12,h:14} };
const TREE_HD={ canopy:'green', canopyBloom:'bloom', canopyAut:'autumn', canopyGold:'gold' };
const NPC_HD={
  'npc':{ job:'Novice', hair:[0x3b3752,0x26233a], over:{ top:0x4f8a5b, sleeve:0x4f8a5b, pants:0xe8e0cc, belt:0xd9b75e, beret:0xc8493f, weapon:'none', nostrap:true } },
  'npc-smith':{ job:'Novice', hair:[0x3a3432,0x221e1c], look:{ style:'short', skin:0xb97a52 }, over:{ top:0x6b4a2e, sleeve:0xd9c9a8, pants:0x4a3a2c, apron:0x5a3b22, band:0xc8342c, weapon:'none', nostrap:true } },
  'npc-merchant':{ job:'Novice', hair:[0x7a4e2a,0x5a3818], over:{ top:0x3d6fb5, sleeve:0xf4efe2, pants:0x5a4636, beret:0x2f5a8a, weapon:'none', nostrap:true } },
  'npc-inn':{ job:'Mage', hair:[0xe8c170,0xc49a48], look:{ style:'bun', body:'f' }, over:{ top:0xf4efe2, sleeve:0xc8493f, pants:0xc8493f, boot:0x6b4424, belt:0xc8493f, weapon:'none', cape:null, circlet:null, apron:0xffffff } },
  'npc-guard':{ job:'Swordman', hair:[0x4a3a2c,0x2e2218], over:{ beret:0x8f9aa8 } },
  'npc-mS':{ job:'Swordman', hair:[0xb9b9c0,0x8a8a94] }, 'npc-mA':{ job:'Archer', hair:[0xe8c170,0xc49a48], look:{ style:'ponytail', body:'f', eye:0x3a8a4a } }, 'npc-mM':{ job:'Mage', hair:[0xe8e8f0,0xb9b9c8], look:{ style:'long', body:'f', eye:0x8a3aa8 } },
  'npc-priest':{ job:'Mage', hair:[0xe8c170,0xc49a48], look:{ style:'long', body:'f' }, over:{ top:0xf4efe2, sleeve:0xf4efe2, pants:0xe8e0cc, cape:0xe8c170, boot:0x8a7a60, weapon:'none' } },
  'npc-clerk':{ job:'Novice', hair:[0x8a3a2a,0x6a2818], look:{ style:'bob', body:'f' }, over:{ top:0x2f5a8a, sleeve:0xf4efe2, pants:0x2a3a5a, beret:0x2f5a8a, belt:0xe2b44a, weapon:'none', nostrap:true } },
  'npc-buyer':{ job:'Novice', hair:[0x3a3432,0x221e1c], over:{ top:0x8a5a2b, sleeve:0xe8dcc0, pants:0x5a4636, band:0xe2b44a, weapon:'none', nostrap:true } },
  'npc-knight':{ job:'Swordman', hair:[0xe8c170,0xc49a48], look:{ style:'short' }, over:{ cape:0x2f5a8a, beret:0xc7d0da } },
  'npc-folkA':{ job:'Novice', walker:true, hair:[0x5a3818,0x3a2410], over:{ top:0xc9a06a, sleeve:0xc9a06a, pants:0x5a6a86, weapon:'none', nostrap:true } },
  'npc-folkB':{ job:'Mage', walker:true, hair:[0x2a2a2a,0x141414], look:{ style:'twintail', body:'f' }, over:{ top:0x9fb3c8, sleeve:0xf4efe2, pants:0x8a5a6a, weapon:'none', cape:null, circlet:null } },
};
const ARCH_HD={ castle:['castle',{},448,330,0], cathedral:['cathedral',{},240,250,0], 'tower-mage':['tower',{ r:.8, h:3.4, wall:0x8f7ec0, roof:0x3b2a6a, roofS:0x2d2150, trim:0xe8c170 },100,190,0],
  belltower:['belltower',{},96,196,.15], fountain:['fountain',{},112,92,.2], stall:['stall',{ col:0xe2524a, goods:[0xff8a3d,0xe2524a,0x8fd46b,0xffd84a,0xb98cff] },76,66,.25],
  stall2:['stall',{ col:0x4f8fe6, goods:[0xe2b44a,0x9aa7b3,0x8a5a2b,0xb98cff] },76,66,.25], stall3:['stall',{ col:0x5d9e46, goods:[0xff8a3d,0xffd84a,0xe2524a,0x8fd46b,0xffb6d0] },76,66,.25],
  lamp:['lamp',{},18,60,.3], bench:['bench',{},44,24,.3], planter:['planter',{},36,26,.3], board:['board',{},46,54,.3], crates:['crates',{},40,34,.4], statue:['statue',{},52,92,.3], hedge:['hedge',{},34,28,.3],
  wall:['wall',{},32,46,0], mill:['mill',{},64,104,.2], blades:['blades',{},112,112,0], barn:['barn',{},104,92,.25], scarecrow:['scarecrow',{},30,46,.3], ruin:['ruin',{},30,56,.3], sign:['sign',{},26,34,.4], fence:['fence',{},32,18,0], rail:['rail',{},32,12,0] };
const hexN=c=>parseInt(String(c).replace('#',''),16);
function bakeArchHD(){
  const M=HD.M; const done=k=>!!HD.sheets[k];
  Object.entries(ARCH_HD).forEach(([k,[kind,o,w,h,yaw]])=>{ if(done(k)) return; HD.sheets[k]=M.bake(M.makeProp(kind,o),{ dirs:[yaw], frames:[{state:'idle',ph:0}], w, h, k:HD.K, fit:true, pose:()=>{} }); });
  BUILDINGS.forEach(b=>{ if(!b.o||done(b.tex)) return; const sk=Object.keys(SIGNS).find(n=>SIGNS[n]===b.o.sign);
    HD.sheets[b.tex]=M.bake(M.makeProp('house',{ w:b.w, wall:hexN(b.o.wall), roof:hexN(b.o.roof), roofS:hexN(b.o.roofS), beam:hexN(b.o.beam), door:hexN(b.o.door), chimney:b.o.chimney, sign:sk }),{ dirs:[0], frames:[{state:'idle',ph:0}], w:b.w*32, h:140, k:HD.K, fit:true, pose:()=>{} }); });
}
function hdTry(s,key){ if(!(s.textures.addCanvas&&HDW()&&HD.sheets[key])) return false; if(s.textures.exists(key)) return true;
  const src=HD.sheets[key].canvas, cv=document.createElement('canvas'); cv.width=src.width; cv.height=src.height; cv.getContext('2d').drawImage(src,0,0);
  s.textures.addCanvas(key,cv); s.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR); HD_IMG[key]=1/HD.K; return true; }
const hsOf=k=>HD_IMG[k]||1;
function archShadow(sc,x,y,wpx){ if(!HDW()) return; sc.add.image(x,y,'shadow').setScale(wpx/22*1.1,Math.max(2,wpx/60)).setAlpha(.45).setDepth(1); }
function bakeWorldHD(){ bakeArchHD();
  const M=HD.M;
  Object.entries(PROP_HD).forEach(([k,c])=>{ if(!HD.sheets[k]) HD.sheets[k]=M.bake(M[c.m](...(c.a||[])),{ dirs:[.45], frames:[{state:'idle',ph:0}], w:c.w, h:c.h, k:HD.K, fit:true, pose:()=>{} }); });
  Object.entries(TREE_HD).forEach(([k,kind])=>{ if(HD.sheets[k]) return; const L=M.bakeLayers(M.makeTree(kind),{ w:96, h:128, k:HD.K, yaw:.5 }); HD.sheets[k]={ canvas:L.crown, fw:L.crown.width, fh:L.crown.height }; if(!HD.sheets.trunk) HD.sheets.trunk={ canvas:L.trunk, fw:L.trunk.width, fh:L.trunk.height }; });
  Object.entries(NPC_HD).forEach(([k,c])=>{ if(HD.sheets[k]) return; const m=M.makeHero(c.job,c.hair,c.over,undefined,c.look);
    HD.sheets[k]=c.walker?M.bake(m,{ dirs:[0,Math.PI,Math.PI/2], frames:M.HERO_FRAMES, w:48, h:64, k:HD.K, scale:HERO_SCALE }):M.bake(m,{ dirs:[0], frames:[{state:'idle',ph:0},{state:'idle',ph:.5}], w:48, h:64, k:HD.K, scale:HERO_SCALE }); });
}
function hdTexOr(s,key,w,h,fn){
  const hsh=(s.textures.addCanvas&&HDW())?HD.sheets[key]:null;
  if(hsh){ const cv=document.createElement('canvas'); cv.width=hsh.canvas.width; cv.height=hsh.canvas.height; cv.getContext('2d').drawImage(hsh.canvas,0,0); s.textures.addCanvas(key,cv); s.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR); HD_IMG[key]=1/HD.K; return; }
  return canvasTex(s,key,w,h,fn);
}
async function bakeAllHD(progress){ if(!HD.on||!HD.ready) return; const jobs=['Novice','Swordman','Archer','Mage'], mobs=Object.keys(MOB_HD); let n=0; const tot=jobs.length+mobs.length;
  for(const j of jobs){ if(j===P.job) bakeHeroHD(j,P.hair); progress&&progress(++n/tot); await new Promise(r=>setTimeout(r,0)); }
  for(const k of mobs){ bakeMobHD(k); progress&&progress(++n/tot); await new Promise(r=>setTimeout(r,0)); }
  bakeWorldHD(); }
function hdSheetFor(key){ if(!HD.on||!HD.ready) return null; return key.startsWith('hero-')?HD.sheets[`${key}-${P.hair||0}-${lookSig(P.look)}`]:HD.sheets[key]; }
function hdOr(s,key,fw,fh,n,draw,out){
  const h=s.textures.addSpriteSheet?hdSheetFor(key):null;
  if(h&&h.eight){ addHero8(s,key,h); return; }
  if(h){ let src=h.canvas; if(key.startsWith('hero-')){ src=document.createElement('canvas'); src.width=h.canvas.width; src.height=h.canvas.height; src.getContext('2d').drawImage(h.canvas,0,0); }
    s.textures.addSpriteSheet(key,src,{ frameWidth:h.fw, frameHeight:h.fh }); s.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR); HD_KEYS.add(key); if(MONSTERS[key]) MONSTERS[key].faceLeft=true; return; }
  sheetTex(s,key,fw,fh,n,draw,out);
}
const heroK=()=>HD_KEYS.has(heroTex())?HD.K:1;
/* ---------- worn equipment changes the hero model (weapon, shield, garment, armor) ---------- */
function gearOf(){ const e=P.equip||{}; return { weapon:e.weapon||null, shield:e.shield||null, garment:e.garment||null, armor:e.armor||null }; }
const gearSig=()=>{ const g=gearOf(); return [g.weapon||'-',g.shield||'-',g.garment||'-',g.armor||'-'].join('.'); };
function bakeHeroGear(job,hair){ const key=`heroG-${job}-${hair||0}-${lookSig(P.look)}-${gearSig()}`; if(HD.sheets[key]) return HD.sheets[key];
  const m=HD.M.makeHero(job,hairHex(hair),null,gearOf(),lookOf(P.look)); return HD.sheets[key]=HD.M.bake8(m,{ w:48, h:64, k:HD.K, scale:heroScale(job) }); }
let appliedGear='';
function applyHeroGear(){
  if(!HDW()||!S||!S.textures) return; const key=heroTex(); if(!HD_KEYS.has(key)) return;
  const sig=key+'|'+gearSig()+'|'+(P.hair||0)+'|'+lookSig(P.look); if(sig===appliedGear) return; appliedGear=sig;
  const r=bakeHeroGear(P.job,P.hair), tex=S.textures.get(key), src=tex.getSourceImage(), c=src.getContext('2d');
  c.clearRect(0,0,src.width,src.height); c.drawImage(r.canvas,0,0); tex.source[0].update();
  const av=$('avatar'); if(av) av.dataset.sig=''; }
function generateTextures(s){
  if(s.textures.exists('grass0')) return;
  for(let v=0;v<3;v++) canvasTex(s,'grass'+v,32,32,c=>drawGrass(c,v));
  canvasTex(s,'path',32,32,drawPath);
  canvasTex(s,'bridge',32,32,drawBridge);
  sheetTex(s,'water',32,32,3,(c,i,ox)=>drawWater(c,i,ox));
  if(s.textures.addAtlas) Object.entries(CUSTOM).forEach(([k,c])=>{ const key='cust-'+k; if(s.textures.exists(key)) return; s.textures.addAtlas(key,c.img,c.json);
    s.textures.get(key).setFilter(c.json.meta&&c.json.meta.filter==='nearest'?Phaser.Textures.FilterMode.NEAREST:Phaser.Textures.FilterMode.LINEAR);
    Object.entries(c.json.animations||{}).forEach(([n,a])=>{ if(!s.anims.exists(`${key}-${n}`)) s.anims.create({ key:`${key}-${n}`, frames:a.frames.map(f=>({ key, frame:f })), frameRate:a.frameRate||8, repeat:a.repeat??-1 }); }); });
  Object.keys(JOB_PAL).forEach(j=>hdOr(s,'hero-'+j,48,64,27,(c,i,ox)=>drawHero2(c,Math.floor(i/9),i%9,ox,j),'#2a1a14'));
  hdOr(s,'npc',48,64,2,(c,i,ox)=>drawHero2(c,0,i,ox,'npc'),'#2a1a14');
  hdOr(s,'jellop',36,32,2,(c,i,ox)=>drawJellop(c,i,ox),'#7a2f4f');
  hdOr(s,'moth',32,32,2,(c,i,ox)=>drawMoth(c,i,ox),'#3a2550');
  hdOr(s,'bunny',32,32,2,(c,i,ox)=>drawBunny(c,i,ox),'#5a4a36');
  hdOr(s,'thornling',32,32,2,(c,i,ox)=>drawThorn(c,i,ox),'#1d3f1f');
  hdOr(s,'boarling',42,32,2,(c,i,ox)=>drawBoar(c,i,ox),'#2e1c0e');
  hdOr(s,'kingjellop',64,56,2,(c,i,ox)=>drawKingJellop(c,i,ox),'#6e1f45');
  // headgear overlays (drawn over the hero's head)
  canvasTex(s,'hat-crown',20,12,c=>{ px(c,3,5,'#f0bd3f',14,6); [[3,1],[8,0],[13,1]].forEach(([x,y])=>px(c,x,y,'#f0bd3f',4,5)); px(c,8,6,'#ff8fb8',4,3); px(c,3,10,'#b8862a',14,1); outline(c,20,12,'#5a3b10'); });
  canvasTex(s,'hat-bunny',26,20,c=>{ px(c,2,15,'#f7a8b8',22,3); px(c,5,1,'#fbf5e8',4,15); px(c,17,1,'#fbf5e8',4,15); px(c,6,3,'#f7a8b8',2,11); px(c,18,3,'#f7a8b8',2,11); outline(c,26,20,'#6b5a44'); });
  canvasTex(s,'hat-thorn',24,10,c=>{ px(c,2,4,'#4f9a3c',20,4); [[3,1],[8,0],[13,0],[18,1]].forEach(([x,y])=>px(c,x,y,'#f1e6b8',2,4)); px(c,4,5,'#86d073',16,1); outline(c,24,10,'#1d3f1f'); });
  canvasTex(s,'hat-boar',26,16,c=>{ disc(c,13,9,11,'#8a5a32',6); px(c,2,9,'#7a4e2a',22,5); px(c,3,12,'#fff6e0',2,4); px(c,21,12,'#fff6e0',2,4); px(c,7,4,'#a26c3e',12,2); for(let i=0;i<6;i++) px(c,6+i*3,1+(i%2),'#4a2f1a',2,3); outline(c,26,16,'#2e1c0e'); });
  canvasTex(s,'hat-straw',30,14,c=>{ c.fillStyle='#e8c170'; c.beginPath(); c.ellipse(15,10,14,3.5,0,0,6.3); c.fill(); px(c,8,2,'#e8c170',14,8); px(c,9,1,'#f0d488',12,1); px(c,8,7,'#c8342c',14,2); px(c,2,10,'#c9a04a',26,1); outline(c,30,14,'#6b4a1a'); });
  canvasTex(s,'hat-king',26,14,c=>{ px(c,3,6,'#f0bd3f',20,7); [[3,1],[9,0],[15,0],[20,1]].forEach(([x,y])=>px(c,x,y,'#f0bd3f',4,6)); px(c,11,8,'#e2524a',4,3); px(c,5,8,'#4f8fe6',3,3); px(c,18,8,'#4f8fe6',3,3); px(c,3,12,'#b8862a',20,1); outline(c,26,14,'#5a3b10'); });
  canvasTex(s,'sbridge',32,32,c=>{ px(c,0,0,'#a9a296',32,32); for(let r=0;r<4;r++){ const off=r%2?8:0; px(c,0,r*8,'#827b70',32,1); for(let x=off;x<32;x+=16) px(c,x,r*8,'#827b70',1,8); }
    for(let i=0;i<14;i++) px(c,irnd(0,31),irnd(0,31),['#bdb6aa','#958e83'][irnd(0,1)],2,1); });
  hdTry(s,'rail')||canvasTex(s,'rail',32,12,c=>{ px(c,0,2,'#9a9388',32,8); px(c,0,2,'#c2bbaf',32,2); px(c,0,9,'#6f695f',32,1); px(c,2,0,'#b0a99d',6,10); px(c,24,0,'#b0a99d',6,10); outline(c,32,12,'#3f3a33'); });
  hdTry(s,'ruin')||canvasTex(s,'ruin',30,56,c=>{ px(c,2,46,'#8f887c',26,8); px(c,2,46,'#b3ac9f',26,2); px(c,6,14,'#a9a296',18,32); px(c,8,14,'#c2bbaf',3,32); px(c,14,14,'#8f887c',1,32); px(c,19,14,'#8f887c',1,32);
    [[6,14],[9,11],[12,13],[15,9],[18,12],[21,10]].forEach(([x,y])=>px(c,x,y,'#a9a296',3,14-y+2)); for(let i=0;i<10;i++) px(c,irnd(6,22),irnd(18,50),'#6cae4c',irnd(2,4),2); outline(c,30,56,'#3f3a33'); });
  hdTexOr(s,'reed',14,22,c=>{ [[2,6],[5,2],[8,4],[11,8]].forEach(([x,y])=>{ px(c,x,y,'#5e8f3a',1,22-y); px(c,x+1,y+3,'#86b85a',1,19-y); }); px(c,4,1,'#7a4a22',2,5); px(c,9,3,'#7a4a22',2,5); });
  hdTexOr(s,'lily',16,9,c=>{ disc(c,8,4,7,'#4f9a3c',4); disc(c,7,3,5,'#6cc152',3); px(c,8,4,'#4ba6d6',4,1); });
  hdTexOr(s,'trunk',32,34,c=>{ px(c,12,0,'#7b5230',8,28); px(c,17,0,'#5e3d22',3,28); px(c,13,4,'#9a6a40',1,18);
    px(c,9,26,'#7b5230',14,4); px(c,7,29,'#6a4528',5,3); px(c,20,29,'#6a4528',5,3); px(c,14,31,'#6a4528',4,3); });
  const canopy=(key,pal,extra)=>hdTexOr(s,key,84,74,c=>{
    const blobs=[[42,40,30,26],[24,44,17,15],[60,44,17,15],[42,24,21,17],[30,28,14,12],[55,28,14,12]];
    blobs.forEach(([x,y,r1,r2])=>disc(c,x,y,r1,pal[0],r2));
    blobs.forEach(([x,y,r1,r2])=>disc(c,x-2,y-3,r1-4,pal[1],r2-4));
    [[36,20,12,9],[24,36,8,7],[52,24,8,6],[40,40,10,8]].forEach(([x,y,r1,r2])=>disc(c,x-2,y-2,r1,pal[2],r2));
    for(let i=0;i<40;i++){ const x=irnd(14,70),y=irnd(8,60); const d=((x-42)/32)**2+((y-38)/30)**2; if(d<.8) px(c,x,y,d<.35?pal[3]:pal[4],2,1); }
    if(extra) extra(c);
    outline(c,84,74,pal[5]);
  });
  canopy('canopy',['#2f7a3c','#439a4a','#5cb45a','#87d073','#2a6b35','#1e4a25']);
  canopy('canopyBloom',['#2f7a3c','#439a4a','#5cb45a','#87d073','#2a6b35','#1e4a25'],c=>{ for(let i=0;i<34;i++){ const x=irnd(14,70),y=irnd(8,62); const d=((x-42)/32)**2+((y-38)/30)**2; if(d<.85){ px(c,x,y,['#ffb6d0','#ff8fb8','#fff0f6'][irnd(0,2)],2,2); } } });
  canopy('canopyAut',['#a4521e','#d9822b','#f0a83a','#ffd27a','#8a3f16','#4a2410']);
  canopy('canopyGold',['#9a7a1e','#c9a02b','#e6c24a','#fff0a0','#7a5e14','#3f300a']);
  for(let v=0;v<3;v++) canvasTex(s,'gold'+v,32,32,c=>{ px(c,0,0,'#cdb05a',32,32); const cols=['#bfa24c','#dcc26e','#c6a852','#e8d488'];
    for(let i=0;i<50;i++) px(c,irnd(0,31),irnd(0,31),cols[irnd(0,3)]); for(let i=0;i<6+v*2;i++){ const x=irnd(1,30),y=irnd(2,30); px(c,x,y-2,'#a88a36',1,3); px(c,x+1,y-1,'#a88a36'); } });
  canvasTex(s,'path2',32,32,c=>{ px(c,0,0,'#b8905e',32,32); for(let i=0;i<44;i++) px(c,irnd(0,31),irnd(0,31),['#a57e4f','#c9a270','#ad8656'][irnd(0,2)]); for(let i=0;i<3;i++){ const x=irnd(2,28),y=irnd(2,28); px(c,x,y,'#8f6c40',2,2); } });
  hdTexOr(s,'wheat',14,22,c=>{ [[2,6],[5,3],[8,5],[11,4]].forEach(([x,y])=>{ px(c,x,y+4,'#b8953c',1,22-y-4); px(c,x-1,y,'#e6c24a',3,5); px(c,x,y+1,'#fff0a0',1,2); }); });
  hdTexOr(s,'hay',40,32,c=>{ for(let y=4;y<30;y++){ const w=Math.round(18*Math.sqrt(1-((y-30)/26)**2)); px(c,20-w,y,y%3?'#e0bc55':'#c9a040',w*2,1); } for(let i=0;i<18;i++) px(c,irnd(6,33),irnd(8,28),'#f5dc88',irnd(2,4),1); px(c,4,28,'#a88a36',32,2); outline(c,40,32,'#6b5220'); });
  hdTry(s,'fence')||canvasTex(s,'fence',32,18,c=>{ px(c,0,5,'#9a6a3c',32,3); px(c,0,11,'#9a6a3c',32,3); px(c,0,5,'#b8844e',32,1); px(c,3,1,'#7a4e2a',4,17); px(c,25,1,'#7a4e2a',4,17); px(c,3,1,'#9a6a3c',4,1); px(c,25,1,'#9a6a3c',4,1); outline(c,32,18,'#3a2410'); });
  hdTry(s,'barn')||canvasTex(s,'barn',104,92,c=>{
    px(c,10,40,'#9a3a2a',84,50); for(let x=10;x<94;x+=7) px(c,x,40,'#7a2a1e',1,50); px(c,10,40,'#b8503a',84,2);
    for(let y=0;y<30;y++){ const w=Math.round(46*(y/30)); px(c,52-w,12+y,y%4?'#5a3b1e':'#4a2f1a',w*2,1); }
    px(c,60,14,'#2a1c10',18,20); px(c,64,20,'#cdb05a',10,3); // roof hole
    px(c,40,62,'#3a2410',24,28); px(c,40,62,'#5a3b1e',24,2); px(c,51,62,'#2a1c10',2,28); px(c,40,75,'#6b4424',24,2);
    px(c,20,50,'#f4efe2',12,10); px(c,21,51,'#2a1c10',10,8); px(c,76,50,'#f4efe2',12,10); px(c,77,51,'#2a1c10',10,8);
    for(let i=0;i<12;i++) px(c,irnd(12,90),irnd(80,88),'#6cae4c',irnd(2,5),2); px(c,84,30,'#6b4424',6,12);
    outline(c,104,92,'#2a1408'); });
  hdTry(s,'scarecrow')||canvasTex(s,'scarecrow',30,46,c=>{ px(c,14,14,'#7a4e2a',3,32); px(c,4,20,'#7a4e2a',22,3); px(c,8,18,'#4f7ab5',14,14); px(c,9,19,'#6b94d0',3,12); px(c,8,28,'#8a5a2b',14,2);
    disc(c,15,10,6,'#e6cc88',5); px(c,12,8,'#2a1c10',2,2); px(c,17,8,'#2a1c10',2,2); px(c,13,12,'#7a4a22',5,1); px(c,6,4,'#c9a040',19,3); px(c,10,0,'#c9a040',11,5);
    [[3,21],[25,21]].forEach(([x,y])=>px(c,x,y,'#e6c24a',3,4)); outline(c,30,46,'#2a1c10'); });
  canvasTex(s,'petal',5,4,c=>{ px(c,1,0,'#fff',3,1); px(c,0,1,'#fff',5,2); px(c,2,3,'#fff',1,1); });
  hdTexOr(s,'rock',32,24,c=>{ disc(c,16,14,13,'#8b9197',9); disc(c,14,12,10,'#a9afb4',6); px(c,9,8,'#d3d8dc',4,2); px(c,20,18,'#6f757b',6,2); outline(c,32,24,'#4b5055'); });
  ['#ffffff','#ffd84a','#ff8fb3','#8ec5ff'].forEach((pc,i)=>hdTexOr(s,'flower'+i,9,13,c=>{
    px(c,4,6,'#4f9a3c',1,7); px(c,5,9,'#63b543',2,1); px(c,2,10,'#63b543',2,1);
    px(c,3,1,pc,3,1); px(c,2,2,pc,5,3); px(c,3,5,pc,3,1); px(c,4,3,'#f3a92b');
  }));
  hdTexOr(s,'tuft',14,10,c=>{ [[2,4],[4,1],[6,3],[8,0],[10,2],[12,5]].forEach(([x,y])=>px(c,x,y,x%4?'#5ea343':'#8fd46b',1,10-y)); });
  canvasTex(s,'shadow',22,8,c=>{ c.fillStyle='rgba(20,40,10,.28)'; for(let y=0;y<8;y++)for(let x=0;x<22;x++) if(((x-10.5)/11)**2+((y-3.5)/4)**2<=1) c.fillRect(x,y,1,1); });
  canvasTex(s,'ring',30,12,c=>{ for(let y=0;y<12;y++)for(let x=0;x<30;x++){ const d=((x-14.5)/15)**2+((y-5.5)/6)**2; if(d<=1&&d>.55) px(c,x,y,'#ff5a4a'); } });
  canvasTex(s,'marker',22,10,c=>{ for(let y=0;y<10;y++)for(let x=0;x<22;x++){ const d=((x-10.5)/11)**2+((y-4.5)/5)**2; if(d<=1&&d>.5) px(c,x,y,'#fff6c8'); } });
  canvasTex(s,'leaf',5,4,c=>{ px(c,1,0,'#fff',3,1); px(c,0,1,'#fff',5,2); px(c,1,3,'#fff',2,1); });
  sheetTex(s,'fly',8,6,2,(c,i,ox)=>{ const col=['#fffbe8','#ffe27a'][0]; if(i===0){ px(c,ox,0,col,3,4); px(c,ox+5,0,col,3,4);} else { px(c,ox+1,2,col,2,3); px(c,ox+5,2,col,2,3);} px(c,ox+3,1,'#5c4838',2,5); });
  canvasTex(s,'pillar',40,160,c=>{ for(let y=0;y<160;y++){ const a=(y/160)*.9; for(let x=0;x<40;x++){ const e=1-Math.abs(x-19.5)/20; c.fillStyle=`rgba(255,244,190,${(a*e*e).toFixed(3)})`; c.fillRect(x,y,1,1);} } });
  canvasTex(s,'cloud',260,140,c=>{ const g=c.createRadialGradient(130,70,10,130,70,125); g.addColorStop(0,'rgba(0,0,0,1)'); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.scale(1,.55); c.beginPath(); c.arc(130,127,125,0,Math.PI*2); c.fill(); });
  hdTry(s,'sign')||canvasTex(s,'sign',26,34,c=>{ px(c,11,12,'#7b5230',4,22); px(c,1,4,'#b98449',24,10); px(c,1,4,'#8e5f30',24,1); px(c,1,13,'#8e5f30',24,1); px(c,20,6,'#6e4a26',3,6); px(c,5,8,'#6e4a26',12,1); outline(c,26,34,'#3a2616'); });
  hdTry(s,'mill')||canvasTex(s,'mill',64,104,c=>{
    for(let y=40;y<104;y++){ const hw=14+Math.floor((y-40)/7); px(c,32-hw,y,y%8<1?'#9b8f7f':'#c9bda8',hw*2,1); }
    for(let i=0;i<24;i++) px(c,irnd(18,46),irnd(44,100),'#b3a790',3,2);
    for(let y=14;y<44;y++){ const hw=10+Math.floor((y-14)/6); px(c,32-hw,y,'#a8743f',hw*2,1); } px(c,22,30,'#8a5a2b',20,1);
    for(let y=0;y<16;y++){ const hw=2+Math.floor(y*0.85); px(c,32-hw,y,y%3?'#b54a35':'#8e3526',hw*2,1); }
    px(c,26,84,'#5a3b1e',12,20); px(c,27,85,'#7b5230',10,19); px(c,35,94,'#e2b44a');
    px(c,28,56,'#39302a',8,9); px(c,29,57,'#ffe7a0',6,7); px(c,31,57,'#39302a',1,7); px(c,29,60,'#39302a',6,1);
    outline(c,64,104,'#3a2616');
  });
  hdTry(s,'blades')||canvasTex(s,'blades',112,112,c=>{
    const C=56; const arm=(ang)=>{ for(let d=6;d<54;d++){ const x=C+Math.cos(ang)*d, y=C+Math.sin(ang)*d; px(c,Math.round(x),Math.round(y),'#5a3b1e',2,2);
      if(d>14){ const nx=-Math.sin(ang), ny=Math.cos(ang); for(let w=2;w<12;w++){ const X=Math.round(x+nx*w),Y=Math.round(y+ny*w); px(c,X,Y,(d%8<1||w===11)?'#8a5a2b':'#f1e6c8'); } } } };
    [0,Math.PI/2,Math.PI,Math.PI*1.5].forEach(arm); disc(c,C,C,5,'#6e4a26'); disc(c,C,C,2,'#e2b44a');
  });
  canvasTex(s,'arrow',16,4,c=>{ px(c,0,1,'#f4efe2',3,2); px(c,3,1,'#8a5a2b',10,1); px(c,3,2,'#6e4a26',10,1); px(c,13,0,'#cfd8e0',3,4); px(c,15,1,'#9aa7b3',1,2); });
  canvasTex(s,'orb',12,12,c=>{ disc(c,6,6,5,'#ffffff'); disc(c,6,6,3,'#ffffff'); });
  canvasTex(s,'portal',64,28,c=>{ const g=c.createRadialGradient(32,14,2,32,14,31); g.addColorStop(0,'rgba(220,250,255,.95)'); g.addColorStop(.35,'rgba(90,200,255,.7)'); g.addColorStop(.75,'rgba(40,110,230,.35)'); g.addColorStop(1,'rgba(20,60,200,0)'); c.fillStyle=g; c.save(); c.scale(1,.44); c.beginPath(); c.arc(32,32,31,0,Math.PI*2); c.fill(); c.restore(); });
  canvasTex(s,'portalRing',56,56,c=>{ for(let i=0;i<40;i++){ const a=i/40*Math.PI*2, r=18+6*Math.sin(i*1.7); c.fillStyle=i%3?'rgba(150,235,255,.9)':'rgba(255,255,255,.95)'; c.fillRect(28+Math.cos(a)*r-1,28+Math.sin(a)*r*.42-1,2,2); } });
  canvasTex(s,'spark',4,4,c=>{ px(c,1,0,'#fff',2,4); px(c,0,1,'#fff',4,2); });
  // item icons (16px) + data URLs for the DOM
  window.ICONS={};
  Object.keys(ITEMS).forEach(id=>{ const t=canvasTex(s,'item-'+id,16,16,c=>{ drawItemIcon(c,id); outline(c,16,16,'#2f1d10'); }); ICONS[id]=t.getSourceImage().toDataURL(); });
}

function createAnims(s){
  if(s.anims.exists('water')) return;
  const dirs=['down','up','side'];
  s.anims.create({key:'bunny-hop',frames:[0,0,1].map(i=>({key:'bunny',frame:i})),frameRate:4,repeat:-1});
  s.anims.create({key:'thorn-sway',frames:[0,1].map(i=>({key:'thornling',frame:i})),frameRate:2,repeat:-1});
  s.anims.create({key:'boar-walk',frames:[0,1].map(i=>({key:'boarling',frame:i})),frameRate:5,repeat:-1});
  Object.keys(JOB_PAL).forEach(j=>{ const key='hero-'+j;
    dirs.forEach((d,di)=>{
      const f=i=>({key,frame:di*9+i});
      s.anims.create({key:`${key}-${d}-idle`,frames:[f(0),f(0),f(1)],frameRate:2.5,repeat:-1});
      s.anims.create({key:`${key}-${d}-walk`,frames:[2,3,4,5].map(f),frameRate:9,repeat:-1});
      s.anims.create({key:`${key}-${d}-atk`,frames:[f(6),f(7),f(7)],frameRate:14,repeat:0});
      s.anims.create({key:`${key}-${d}-cast`,frames:[f(6)],frameRate:1,repeat:-1});
      s.anims.create({key:`${key}-${d}-sit`,frames:[f(8)],frameRate:1,repeat:-1});
    });
  });
  s.anims.create({key:'npc-idle',frames:[{key:'npc',frame:0},{key:'npc',frame:0},{key:'npc',frame:1}],frameRate:2,repeat:-1});
  s.anims.create({key:'water',frames:[0,1,2].map(i=>({key:'water',frame:i})),frameRate:3,repeat:-1});
  s.anims.create({key:'moth-fly',frames:[0,1].map(i=>({key:'moth',frame:i})),frameRate:8,repeat:-1});
  s.anims.create({key:'fly',frames:[0,1].map(i=>({key:'fly',frame:i})),frameRate:7,repeat:-1});
}

