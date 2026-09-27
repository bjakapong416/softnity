/* ---------- hero sprites v2: 48x64 chibi, distinct outfit per job ---------- */
const HB = { skin:'#f9d9bd', skinS:'#ecb994', skinD:'#d49a74', hair:'#d8683a', hairD:'#a4472a', hairL:'#f59a5e', hairLL:'#ffc48a',
  eye:'#3a6fc0', eyeD:'#1c2f5e', eyeL:'#9cc4ff', lash:'#2a1810', blush:'#ff9e9e', mouth:'#b85a4a' };
const HERO_OUTFIT = {
  Novice:{ top:'#f1e6c8', topS:'#d4c29a', topD:'#a8946a', sleeve:'#f1e6c8', belt:'#7a4a22', buckle:'#e2b44a', pants:'#6b5240', pantsS:'#54402f', boots:'#6b4424', bootsS:'#4a2f1a', strap:'#9a6a3c', weapon:'sword' },
  Swordman:{ top:'#c7d0da', topS:'#8f9aa8', topD:'#5f6a78', topL:'#eef3f8', sleeve:'#3a3f55', belt:'#5a3b1e', buckle:'#e2b44a', pants:'#3a3f55', pantsS:'#2a2e40', boots:'#9aa5b2', bootsS:'#646f7d',
    pauldron:'#dfe6ee', pauldronS:'#8f9aa8', trim:'#e2b44a', cape:'#c8342c', capeS:'#8e1f1a', weapon:'sword' },
  Archer:{ top:'#5d9e46', topS:'#437a33', topD:'#2e5a24', topL:'#86c46a', sleeve:'#f4efe2', belt:'#7a4a22', buckle:'#e2b44a', pants:'#4a7a36', pantsS:'#365c28', boots:'#7a4e2a', bootsS:'#54341a',
    bracer:'#8a5a2b', quiver:'#8a5a2b', quiverS:'#5e3d22', feather:'#f4efe2', band:'#e2b44a', weapon:'bow' },
  Mage:{ top:'#6a4aa8', topS:'#4e3585', topD:'#35235e', topL:'#8f70d0', sleeve:'#6a4aa8', belt:'#e8c170', buckle:'#ff8a3d', pants:'#4e3585', pantsS:'#35235e', boots:'#3b2a6a', bootsS:'#241a44',
    trim:'#e8c170', cape:'#2d2150', capeS:'#1c1438', collar:'#3b2a6a', robe:true, circlet:'#e8c170', gem:'#ff8a3d', weapon:'staff', orb:'#ff9a4d' },
  npc:{ top:'#4f8a5b', topS:'#3c6c46', topD:'#2a4f32', sleeve:'#4f8a5b', belt:'#d9b75e', buckle:'#e2b44a', pants:'#e8e0cc', pantsS:'#cfc5ad', boots:'#5b3d23', bootsS:'#3e2816',
    beret:'#c8493f', beretS:'#8e2d26', hairOverride:['#3b3752','#26233a','#58537a','#7a74a0'], weapon:'none' },
};
const HAIRS=[['#d8683a','#a4472a','#f59a5e','#ffc48a'],['#7a4e2a','#5a3818','#9a6a3c','#c08a5a'],['#3a3432','#221e1c','#5a5452','#8a8482'],['#e8c170','#c49a48','#f5dc98','#fff0c0'],['#f28ab0','#c85a88','#ffb6d0','#ffe0ec'],['#5b8fd8','#3a64b0','#8fb6ff','#cfe0ff'],['#d8dce8','#a8aebc','#f0f2f8','#ffffff']];
const HAIR_NAMES=['ส้มแดง','น้ำตาล','ดำ','ทอง','ชมพู','ฟ้า','เงิน'];
function drawHero2(c,dirIdx,fi,ox,job,hairIdx){
  const O=HERO_OUTFIT[job], dir=['down','up','side'][dirIdx];
  const hairC=O.hairOverride||HAIRS[hairIdx??((typeof P!=='undefined'&&P.hair)||0)];
  const r=(x,y,w,h,col)=>{ if(w>0&&h>0) px(c,ox+x,y,col,w,h); };
  const E=(cx,cy,rx,ry,col)=>{ for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++) if((x*x)/(rx*rx)+(y*y)/(ry*ry)<=1) px(c,ox+Math.round(cx+x),Math.round(cy+y),col); };
  const L=(x0,y0,x1,y1,col,w=2)=>{ const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1; for(let i=0;i<=n;i++) r(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),w,w,col); };
  let bob=fi===1?1:0, lift=[0,0], sw=0; if(fi===3){ lift=[3,0]; bob=-1; sw=1; } if(fi===5){ lift=[0,3]; bob=-1; sw=-1; }
  const sit=fi===8, atk0=fi===6, atk1=fi===7, Y=(sit?7:0)+bob;
  // ---------- back layers (cape / quiver) ----------
  const back=()=>{
    if(O.cape){ if(dir==='up'){ r(13,31+Y,22,sit?16:24,O.cape); r(13,31+Y,4,sit?16:24,O.capeS); r(31,31+Y,4,sit?16:24,O.capeS); r(14,(sit?46:54)+Y,20,2,O.capeS); }
      else if(dir==='side'){ r(12,31+Y,8,sit?14:22,O.cape); r(12,31+Y,3,sit?14:22,O.capeS); }
      else { r(13,34+Y,3,sit?12:19,O.capeS); r(32,34+Y,3,sit?12:19,O.capeS); } }
    if(O.quiver){ if(dir==='up'){ r(27,26+Y,6,20,O.quiver); r(27,26+Y,2,20,O.quiverS); [28,30,32].forEach((x,i)=>{ r(x,20+Y+i,1,6,'#6e4a26'); r(x-1,19+Y+i,3,2,O.feather); }); }
      else if(dir==='side'){ r(13,27+Y,5,17,O.quiver); r(13,27+Y,2,17,O.quiverS); [13,15,17].forEach((x,i)=>r(x,23+Y+i,2,4,O.feather)); }
      else { [32,34].forEach((x,i)=>r(x,24+Y+i,2,4,O.feather)); } }
  };
  back();
  // ---------- legs ----------
  if(sit){ r(14,52+Y-3,20,5,O.pants); r(14,55+Y-3,20,1,O.pantsS); r(11,56,7,5,O.boots); r(30,56,7,5,O.boots); r(11,60,7,1,O.bootsS); r(30,60,7,1,O.bootsS); }
  else if(dir==='side'){ const a=fi===3?3:fi===5?-3:0;
    r(20-a,49,5,8-(a>0?2:0),O.pantsS); r(19-a,56-(a>0?2:0),8,6,O.bootsS);
    r(24+a,49,5,8-(a<0?2:0),O.pants); r(23+a,56-(a<0?2:0),9,6,O.boots); r(23+a,61-(a<0?2:0),9,1,O.bootsS); }
  else { r(18,49,5,8-lift[0],O.pants); r(17,56-lift[0],7,6,O.boots); r(17,61-lift[0],7,1,O.bootsS);
    r(26,49,5,8-lift[1],O.pantsS); r(25,56-lift[1],7,6,O.boots); r(25,61-lift[1],7,1,O.bootsS); r(22,49,1,6,O.pantsS); }
  // ---------- torso ----------
  const tx0=dir==='side'?17:15, tw=dir==='side'?15:18;
  if(O.robe&&!sit){ // long robe
    for(let y=31;y<58;y++){ const grow=Math.floor((y-31)/5); r(tx0-grow,y+Y,tw+grow*2,1,y>52?O.topS:O.top); }
    r(tx0-5,56+Y,tw+10,2,O.trim); if(dir!=='up'){ r(23,34+Y,2,22,O.trim); } r(tx0+tw-4,33+Y,4,22,O.topS);
  } else if(O.robe&&sit){ r(tx0-3,31+Y,tw+6,20,O.top); r(tx0-3,49+Y,tw+6,2,O.trim); }
  else { r(tx0,31+Y,tw,17,O.top); r(tx0+tw-4,31+Y,4,17,O.topS); r(tx0,46+Y,tw,2,O.topD); }
  if(O.topL&&dir!=='up'&&!O.robe) r(tx0+2,33+Y,3,9,O.topL);
  // belt
  if(!O.robe){ r(tx0,43+Y,tw,3,O.belt); if(dir!=='up') r(23,43+Y,3,3,O.buckle); }
  else r(tx0-1,42+Y,tw+2,2,O.belt);
  // job details
  if(job==='Novice'&&dir==='down'){ L(16,32+Y,30,44+Y,O.strap,1); r(29,43+Y,5,5,O.strap); r(22,31+Y,4,3,O.topS); }
  if(job==='Swordman'){ if(dir==='down'){ r(19,33+Y,10,9,O.topL); r(23,33+Y,2,10,O.trim); } }
  if(job==='Archer'&&dir==='down'){ r(21,31+Y,6,6,O.sleeve); L(16,32+Y,31,42+Y,'#6e4a26',1); }
  if(O.collar&&dir!=='up'){ r(15,29+Y,18,4,O.collar); r(23,31+Y,2,2,O.gem); }
  if(job==='npc'){ r(18,34+Y,12,1,O.topD); r(21,36+Y,6,6,'#e8e0cc'); }
  // ---------- arms + weapon ----------
  const wp=O.weapon, blade='#e4ebf2', bladeS='#9aa7b3', hilt='#7a4a22', wood='#8a5a2b', woodD='#5e3d22', str='#f4efe2';
  const hand=(x,y)=>{ r(x,y,4,4,HB.skin); r(x,y+3,4,1,HB.skinS); };
  const arm=(x,y,h,col)=>{ r(x,y,4,h,col); r(x+3,y,1,h,O.topS); if(O.bracer) r(x,y+h-4,4,3,O.bracer); };
  const W_=(pose)=>{ const y=Y;
    if(wp==='sword'){ if(pose==='sa0'){ r(13,10+y,3,18,blade); r(16,10+y,1,18,bladeS); r(11,28+y,7,2,O.trim||'#e2b44a'); r(13,30+y,3,4,hilt); }
      else if(pose==='sa1'){ r(33,40+y,13,3,blade); r(33,43+y,13,1,bladeS); r(31,37+y,2,8,O.trim||'#e2b44a'); }
      else if(pose==='si'){ r(25+sw,47+y,3,12,blade); r(28+sw,47+y,1,11,bladeS); r(23+sw,46+y,7,2,O.trim||'#e2b44a'); }
      else if(pose==='fa0'){ r(36,8+y,3,18,blade); r(39,8+y,1,18,bladeS); r(33,26+y,9,2,O.trim||'#e2b44a'); }
      else if(pose==='fa1'){ r(35,48+y,3,13,blade); r(38,48+y,1,12,bladeS); r(32,46+y,9,2,O.trim||'#e2b44a'); }
      else { r(35,47+y,3,11,blade); r(38,47+y,1,10,bladeS); r(33,45+y,8,2,O.trim||'#e2b44a'); } }
    else if(wp==='bow'){
      const bowV=(x,y0,h)=>{ r(x,y0,3,3,woodD); r(x+1,y0+3,3,h-6,wood); r(x,y0+h-3,3,3,woodD); r(x-1,y0+3,1,h-6,str); };
      if(pose==='sa0'){ bowV(36,24+y,24); L(35,27+y,28,36+y,str,1); L(28,36+y,35,45+y,str,1); r(24,36+y,18,1,'#d9c9a0'); r(42,35+y,3,3,'#cfd8e0'); }
      else if(pose==='sa1'){ bowV(36,24+y,24); }
      else if(pose==='si'){ bowV(27+sw,34+y,20); }
      else if(pose==='fa0'||pose==='fa1'){ r(12,42+y,24,3,wood); r(10,44+y,3,3,woodD); r(35,44+y,3,3,woodD); r(12,46+y,24,1,str); if(pose==='fa0') r(23,32+y,1,14,'#d9c9a0'); }
      else bowV(36,34+y,20); }
    else if(wp==='staff'){
      const orb=(x,yy)=>{ E(x,yy,3,3,O.orb||'#ff9a4d'); r(x-1,yy-2,2,2,'#fff4d0'); };
      if(pose==='sa0'){ L(19,40+y,29,8+y,wood,3); orb(30,6+y); }
      else if(pose==='sa1'){ L(28,42+y,45,36+y,wood,3); orb(44,34+y); }
      else if(pose==='si'){ r(27+sw,20+y,3,40,wood); r(29+sw,20+y,1,40,woodD); orb(28+sw,17+y); }
      else if(pose==='fa0'){ L(34,38+y,40,6+y,wood,3); orb(40,4+y); }
      else if(pose==='fa1'){ L(34,44+y,44,60+y,wood,3); orb(44,59+y); }
      else { r(36,20+y,3,40,wood); r(38,20+y,1,40,woodD); orb(37,17+y); } }
  };
  if(dir==='side'){
    if(atk0){ W_('sa0'); arm(18,30+Y,8,O.sleeve); hand(17,28+Y); }
    else if(atk1){ r(26,36+Y,9,4,O.sleeve); hand(33,37+Y); W_('sa1'); }
    else { arm(22+sw,33+Y,12,O.sleeve); hand(22+sw,44+Y); W_('si'); }
  } else {
    const aL=dir==='down'?sw:-sw, aR=-aL;
    arm(11,33+Y+aL,11,O.sleeve); hand(11,43+Y+aL);
    if(dir==='up'&&wp!=='none'){ W_('fi'); }
    if(atk0){ arm(33,26+Y,8,O.sleeve); hand(33,24+Y); W_('fa0'); }
    else if(atk1){ arm(33,36+Y,8,O.sleeve); hand(33,43+Y); W_('fa1'); }
    else { arm(33,33+Y+aR,11,O.sleeve); hand(33,43+Y+aR); if(dir!=='up') W_('fi'); }
  }
  if(O.pauldron){ const pl=(x)=>{ E(x,33+Y,5,4,O.pauldronS); E(x,32+Y,5,3,O.pauldron); r(x-4,35+Y,9,1,O.trim); };
    if(dir==='side'){ pl(24); } else { pl(14); pl(34); } }
  // ---------- head ----------
  const hx=dir==='side'?25:24, hy=18+Y;
  E(hx,hy,12,12,HB.skin); r(hx-10,hy+6,20,4,HB.skin); E(hx,hy+9,9,3,HB.skinS);
  const [H1,H2,H3,H4]=hairC;
  if(dir==='up'){
    E(hx,hy-2,14,13,H1); r(hx-13,hy+2,26,11,H1); [[-10,-13],[-4,-16],[3,-16],[9,-13]].forEach(([dx,dy])=>r(hx+dx,hy+dy,4,3,H1)); L(hx+1,hy-15,hx+5,hy-21,H1,2); E(hx,hy+10,12,4,H2); L(hx-6,hy-10,hx-9,hy+8,H2,1); L(hx+5,hy-10,hx+8,hy+8,H2,1); L(hx,hy-12,hx,hy+10,H2,1);
    E(hx-4,hy-8,5,3,H3); r(hx-6,hy-10,4,2,H4);
  } else if(dir==='down'){
    E(hx,hy-4,14,11,H1); r(hx-14,hy-4,4,18,H1); r(hx+10,hy-4,4,18,H1); r(hx-14,hy+10,4,4,H2); r(hx+10,hy+10,4,4,H2);
    [[-11,0],[-6,2],[-1,1],[4,2],[8,0]].forEach(([dx,dd])=>{ r(hx+dx,hy-2,5,4+dd,H1); r(hx+dx+1,hy+2+dd,3,2,H1); r(hx+dx+2,hy+4+dd,1,1,H2); });
    r(hx-13,hy-2,26,1,H2);
    [[-10,-13],[-4,-16],[3,-16],[9,-13]].forEach(([dx,dy])=>{ r(hx+dx,hy+dy,4,3,H1); r(hx+dx+1,hy+dy-1,2,1,H1); });
    L(hx+1,hy-15,hx+5,hy-21,H1,2); r(hx+5,hy-22,2,2,H1);
    E(hx-3,hy-9,9,2,H3); r(hx-9,hy-8,4,1,H3); r(hx-6,hy-10,3,1,H4); r(hx+2,hy-10,3,1,H4); L(hx-8,hy-6,hx-10,hy+0,H2,1); L(hx+7,hy-6,hx+9,hy+0,H2,1);
    // eyes
    const eye=(x)=>{ r(x,hy+1,5,1,HB.lash); r(x-1,hy+1,1,1,HB.lash); r(x,hy+2,5,6,HB.eye); r(x,hy+2,5,2,HB.eyeD); r(x+1,hy+4,3,3,HB.eyeD); r(x+1,hy+6,3,1,HB.eyeL); r(x,hy+3,2,2,'#ffffff'); r(x+3,hy+6,1,1,'#ffffff'); };
    eye(hx-8); eye(hx+3); r(hx-10,hy+9,4,2,HB.blush); r(hx+6,hy+9,4,2,HB.blush); r(hx-1,hy+10,2,1,HB.mouth); r(hx-2,hy+9,1,1,HB.mouth); r(hx+1,hy+9,1,1,HB.mouth);
  } else {
    E(hx-2,hy-4,14,11,H1); r(hx-15,hy-4,12,20,H1); r(hx-15,hy+12,8,4,H2); r(hx+9,hy-4,4,8,H1);
    [[2,1],[6,3],[9,0]].forEach(([dx,dd])=>{ r(hx+dx-1,hy-2,4,4+dd,H1); r(hx+dx,hy+2+dd,2,2,H1); });
    r(hx-6,hy+2,4,5,HB.skinS); r(hx-5,hy+3,2,3,HB.skinD);
    [[-12,-12],[-6,-15],[1,-15],[7,-12]].forEach(([dx,dy])=>{ r(hx+dx,hy+dy,4,3,H1); });
    L(hx-1,hy-14,hx+3,hy-20,H1,2); r(hx+3,hy-21,2,2,H1);
    E(hx-5,hy-9,8,2,H3); r(hx-9,hy-10,3,1,H4); L(hx-12,hy-6,hx-12,hy+12,H2,1); L(hx-8,hy-2,hx-9,hy+14,H2,1);
    const x=hx+4; r(x,hy+1,5,1,HB.lash); r(x+5,hy,1,1,HB.lash); r(x,hy+2,4,6,HB.eye); r(x,hy+2,4,2,HB.eyeD); r(x+1,hy+4,3,3,HB.eyeD); r(x+1,hy+6,2,1,HB.eyeL); r(x,hy+3,2,2,'#ffffff');
    r(hx+7,hy+9,4,2,HB.blush); r(hx+11,hy+7,1,2,HB.skinS); r(hx+8,hy+10,2,1,HB.mouth);
  }
  if(O.circlet&&dir!=='up'){ r(hx-11,hy-5,22,2,O.circlet); r(hx-1,hy-6,3,3,O.gem); }
  if(O.band&&dir!=='up'){ r(hx-12,hy-6,24,2,O.band); }
  if(O.beret){ E(hx-1,hy-11,14,5,O.beret); r(hx-14,hy-9,27,4,O.beret); r(hx-14,hy-6,27,1,O.beretS); r(hx+1,hy-17,3,2,O.beretS); }
}

