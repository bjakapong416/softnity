/* ============================================================
   Pixel-art texture generation
   ============================================================ */
function hex(c){ return c; }
function outline(ctx,w,h,col){
  const img=ctx.getImageData(0,0,w,h), d=img.data, out=new Uint8ClampedArray(d);
  const [r,g,b]=[parseInt(col.slice(1,3),16),parseInt(col.slice(3,5),16),parseInt(col.slice(5,7),16)];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4; if(d[i+3]>0) continue;
    const n=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const X=x+dx,Y=y+dy; return X>=0&&Y>=0&&X<w&&Y<h&&d[(Y*w+X)*4+3]>200;});
    if(n){ out[i]=r;out[i+1]=g;out[i+2]=b;out[i+3]=255; }
  }
  img.data.set(out); ctx.putImageData(img,0,0);
}
function canvasTex(scene,key,w,h,fn){
  const t=scene.textures.createCanvas(key,w,h); const c=t.getContext(); c.imageSmoothingEnabled=false; fn(c); t.refresh(); if(t.setFilter&&window.Phaser) t.setFilter(Phaser.Textures.FilterMode.NEAREST); return t;
}
function sheetTex(scene,key,fw,fh,n,fn,outlineCol){
  const t=scene.textures.createCanvas(key,fw*n,fh); const c=t.getContext(); c.imageSmoothingEnabled=false;
  for(let i=0;i<n;i++){ fn(c,i,i*fw); }
  if(outlineCol) outline(c,fw*n,fh,outlineCol);
  for(let i=0;i<n;i++) t.add(i,0,i*fw,0,fw,fh);
  t.refresh(); if(t.setFilter&&window.Phaser) t.setFilter(Phaser.Textures.FilterMode.NEAREST); return t;
}
const px=(c,x,y,col,w=1,h=1)=>{ c.fillStyle=col; c.fillRect(x,y,w,h); };
function disc(c,cx,cy,r,col,ry){ ry=ry||r; c.fillStyle=col;
  for(let y=-ry;y<=ry;y++)for(let x=-r;x<=r;x++) if((x*x)/(r*r)+(y*y)/(ry*ry)<=1) c.fillRect(Math.round(cx+x),Math.round(cy+y),1,1); }

function drawGrass(c,v){
  px(c,0,0,'#78bf58',32,32);
  const cols=['#6aaf4b','#86cc63','#6fb551','#8fd46b'];
  for(let i=0;i<46;i++) px(c,irnd(0,31),irnd(0,31),cols[irnd(0,3)]);
  for(let i=0;i<5+v*2;i++){ const x=irnd(1,30),y=irnd(2,30); px(c,x,y-2,'#5ea343',1,3); px(c,x+1,y-1,'#5ea343'); }
}
function drawPath(c){
  px(c,0,0,'#d9bd84',32,32);
  for(let i=0;i<40;i++) px(c,irnd(0,31),irnd(0,31),['#c9a96c','#e6cf9d','#cdb07a'][irnd(0,2)]);
  for(let i=0;i<4;i++){ const x=irnd(2,28),y=irnd(2,28); px(c,x,y,'#b8975e',2,2); px(c,x,y,'#e9d6aa'); }
}
function drawWater(c,f,ox){
  px(c,ox,0,'#4ba6d6',32,32);
  for(let y=0;y<32;y+=2) if((y/2)%3===0) px(c,ox,y,'#449bcb',32,1);
  const rows=[5,14,23,30];
  rows.forEach((y,k)=>{ const s=(f*5+k*9)%32; px(c,ox+((s)%32),y,'#a6e3f7',5,1); px(c,ox+((s+14)%28),y-1,'#d9f5ff',2,1); });
}
function drawBridge(c){
  px(c,0,0,'#a8743f',32,32);
  for(let x=0;x<32;x+=6){ px(c,x,0,'#6e4a26',1,32); px(c,x+2,irnd(3,26),'#8f5f31',1,3); }
  px(c,0,0,'#5a3b1e',32,2); px(c,0,30,'#5a3b1e',32,2);
}
function drawHero(c,dirIdx,fi,ox,pal){
  // frames: 0 idle0 1 idle1 2-5 walk 6 atk0 7 atk1 8 sit
  const P_=pal, dir=['down','up','side'][dirIdx];
  const r=(x,y,w,h,col)=>px(c,ox+x,y,col,w,h);
  let bob = (fi===1)?1:0, lL=0, lR=0, sw=0;
  if(fi===3){ lL=2; bob=-1; sw=1; } if(fi===5){ lR=2; bob=-1; sw=-1; }
  const sit = fi===8; const by = sit?5:0; // body drop
  // legs
  if(!sit){
    if(dir==='side'){
      const a=(fi===3?2:fi===5?-2:0);
      r(13-a,38,3,6-(a>0?1:0),P_.pants); r(12-a,44-(a>0?1:0),5,2,P_.shoe);
      r(17+a,38,3,6-(a<0?1:0),P_.pantsS); r(17+a,44-(a<0?1:0),5,2,P_.shoe);
    } else {
      r(12,38,3,6-lL,P_.pants); r(11,44-lL,5,2,P_.shoe);
      r(17,38,3,6-lR,P_.pantsS); r(16,44-lR,5,2,P_.shoe);
    }
  } else {
    r(9,42,14,3,P_.pants); r(8,44,5,2,P_.shoe); r(19,44,5,2,P_.shoe);
  }
  const Y=by+bob;
  // body
  r(10,27+Y,12,11,P_.cloth); r(19,27+Y,3,11,P_.clothS); r(10,35+Y,12,2,P_.belt); r(15,35+Y,2,2,'#e2b44a');
  if(dir!=='up') r(14,27+Y,4,2,P_.clothS);
  // arms + weapon
  const wp=P_.weapon||'none', atk0=fi===6, atk1=fi===7;
  const blade='#dfe7ee', bladeS='#9aa7b3', hilt='#7a4a22', wood='#8a5a2b', woodD='#5e3d22', str_='#f4efe2', orb=P_.orb||'#b56cff';
  const line=(x0,y0,x1,y1,col,w=2)=>{ const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0)); for(let i=0;i<=n;i++){ r(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),w,w,col); } };
  const drawW=(pose)=>{ // pose: side-idle|side-a0|side-a1|front-idle|front-a0|front-a1 ; ay = arm swing offset
    const Yp=Y;
    if(wp==='sword'){
      if(pose==='side-a0'){ r(10,12+Yp,2,12,blade); r(12,12+Yp,1,12,bladeS); r(9,24+Yp,5,1,hilt); }
      else if(pose==='side-a1'){ r(24,30+Yp,7,2,blade); r(24,32+Yp,7,1,bladeS); r(23,28+Yp,1,5,hilt); }
      else if(pose==='side-idle'){ r(16+sw,37+Yp,2,6,blade); r(18+sw,37+Yp,1,6,bladeS); r(15+sw,36+Yp,4,1,hilt); }
      else if(pose==='front-a0'){ r(24,9+Yp,2,12,blade); r(26,9+Yp,1,12,bladeS); r(22,21+Yp,6,1,hilt); }
      else if(pose==='front-a1'){ r(23,36+Yp,2,9,blade); r(25,37+Yp,1,8,bladeS); r(21,35+Yp,6,1,hilt); }
      else { r(23,37+Yp+aR,2,7,blade); r(25,37+Yp+aR,1,6,bladeS); r(21,36+Yp+aR,5,1,hilt); }
    } else if(wp==='bow'){
      if(pose==='side-a0'){ r(24,20+Yp,2,2,woodD); r(25,22+Yp,2,16,wood); r(24,38+Yp,2,2,woodD); line(24,21+Yp,19,30+Yp,str_,1); line(19,30+Yp,24,39+Yp,str_,1); r(17,30+Yp,12,1,'#d9c9a0'); r(29,29+Yp,2,3,'#9aa7b3'); }
      else if(pose==='side-a1'){ r(24,20+Yp,2,2,woodD); r(25,22+Yp,2,16,wood); r(24,38+Yp,2,2,woodD); r(24,22+Yp,1,16,str_); }
      else if(pose==='side-idle'){ r(18+sw,26+Yp,2,2,woodD); r(19+sw,28+Yp,2,11,wood); r(18+sw,39+Yp,2,2,woodD); r(17+sw,28+Yp,1,11,str_); }
      else if(pose==='front-a0'||pose==='front-a1'){ r(8,31+Yp,2,2,woodD); r(10,29+Yp,12,2,wood); r(22,31+Yp,2,2,woodD); r(10,32+Yp,12,1,str_); if(pose==='front-a0') r(15,23+Yp,1,10,'#d9c9a0'); }
      else { r(23,26+Yp+aR,2,2,woodD); r(24,28+Yp+aR,2,11,wood); r(23,39+Yp+aR,2,2,woodD); r(22,28+Yp+aR,1,11,str_); }
    } else if(wp==='staff'){
      if(pose==='side-a0'){ line(13,26+Yp,20,6+Yp,wood); r(19,2+Yp,4,4,orb); r(20,3+Yp,1,1,'#fff'); }
      else if(pose==='side-a1'){ line(18,31+Yp,30,27+Yp,wood); r(28,24+Yp,4,4,orb); }
      else if(pose==='side-idle'){ r(18+sw,16+Yp,2,28,wood); r(17+sw,12+Yp,4,4,orb); r(18+sw,13+Yp,1,1,'#fff'); }
      else if(pose==='front-a0'){ line(22,26+Yp,27,5+Yp,wood); r(26,1+Yp,4,4,orb); r(27,2+Yp,1,1,'#fff'); }
      else if(pose==='front-a1'){ line(22,33+Yp,29,44+Yp,wood); r(27,43+Yp,4,4,orb); }
      else { r(24,16+Yp+aR,2,28,wood); r(23,12+Yp+aR,4,4,orb); r(24,13+Yp+aR,1,1,'#fff'); }
    }
  };
  let aR=0;
  if(dir==='side'){
    if(atk0){ r(11,24+Y,3,6,P_.skin); drawW('side-a0'); }
    else if(atk1){ r(18,29+Y,6,3,P_.skin); drawW('side-a1'); }
    else { r(15+sw,28+Y,3,8,P_.skinS); r(15+sw,35+Y,3,2,P_.skin); drawW('side-idle'); }
  } else {
    const aL=(dir==='down'?sw:-sw); aR=-aL;
    r(7,28+Y+aL,3,7,P_.cloth); r(7,35+Y+aL,3,2,P_.skin);
    if(atk0){ r(22,21+Y,3,7,P_.skin); drawW('front-a0'); }
    else if(atk1){ r(22,30+Y,3,6,P_.skin); drawW('front-a1'); }
    else { r(22,28+Y+aR,3,7,P_.cloth); r(22,35+Y+aR,3,2,P_.skin); drawW('front-idle'); }
  }
  if(P_.robe && !sit){ r(10,36+Y,12,6,P_.cloth); r(19,36+Y,3,6,P_.clothS); r(10,41+Y,12,1,P_.clothS); }
  if(P_.pauldron){ r(7,26+Y,4,3,P_.pauldron); r(21,26+Y,4,3,P_.pauldron); }
  // head
  const hx = dir==='side'?8:7, hy=6+Y;
  r(hx+2,hy,14,20,P_.skin); r(hx,hy+2,18,16,P_.skin); r(hx+1,hy+1,16,18,P_.skin);
  r(hx+1,hy+16,16,3,P_.skinS);
  // hair
  const H1=P_.hair, H2=P_.hairD, H3=P_.hairL;
  if(dir==='up'){
    r(hx,hy-1,18,20,H1); r(hx+2,hy-2,14,2,H1); r(hx+1,hy+16,16,3,H2); r(hx+5,hy+1,6,1,H3); r(hx+4,hy+2,2,6,H3);
  } else if(dir==='down'){
    r(hx,hy-1,18,9,H1); r(hx+2,hy-2,14,2,H1); r(hx-1,hy+3,3,14,H1); r(hx+16,hy+3,3,14,H1);
    [0,3,7,10,14].forEach(x=>r(hx+1+x,hy+8,3,2,H1)); r(hx+5,hy+8,2,3,H1); r(hx+12,hy+8,2,3,H1);
    r(hx-1,hy+13,3,4,H2); r(hx+16,hy+13,3,4,H2); r(hx+5,hy,7,1,H3); r(hx+3,hy+1,2,3,H3);
    // face
    r(hx+4,hy+11,2,4,P_.eye); r(hx+12,hy+11,2,4,P_.eye); px(c,ox+hx+4,hy+11,'#ffffff'); px(c,ox+hx+12,hy+11,'#ffffff');
    r(hx+2,hy+16,2,1,'#f29a86'); r(hx+14,hy+16,2,1,'#f29a86'); r(hx+8,hy+17,2,1,'#c0705a');
  } else {
    r(hx-1,hy-1,17,9,H1); r(hx+1,hy-2,13,2,H1); r(hx-2,hy+2,9,15,H1); r(hx-1,hy+16,6,3,H2);
    [8,12].forEach(x=>r(hx+x,hy+8,3,2,H1)); r(hx+15,hy+2,2,5,H1); r(hx+3,hy,7,1,H3);
    r(hx+12,hy+11,2,4,P_.eye); px(c,ox+hx+12,hy+11,'#ffffff'); r(hx+14,hy+16,2,1,'#f29a86'); r(hx+15,hy+17,1,1,'#c0705a');
  }
  if(P_.hood){ r(hx-1,hy-3,19,5,P_.hood); r(hx+1,hy-5,15,2,P_.hood); r(hx+6,hy-7,5,2,P_.hood); r(hx+7,hy-9,3,2,P_.hood); }
  if(P_.band){ r(hx,hy+4,18,2,P_.band); }
  if(P_.hat){ // npc beret
    r(hx-1,hy-3,19,4,P_.hat); r(hx+2,hy-4,13,1,P_.hat); r(hx+7,hy-5,3,1,P_.hatD);
  }
}
const BASE_PAL = { skin:'#f7d3b1', skinS:'#e5b58f', hair:'#cf6330', hairD:'#9a4220', hairL:'#ec8a4e', eye:'#2b1d14', shoe:'#3a281b' };
const JOB_PAL = {
  Novice:  Object.assign({}, BASE_PAL, { cloth:'#ece0bd', clothS:'#cbb788', belt:'#8a5a2b', pants:'#5c4838', pantsS:'#4d3c2e', weapon:'sword' }),
  Swordman:Object.assign({}, BASE_PAL, { cloth:'#9fb3c8', clothS:'#6f8398', belt:'#5a3b1e', pants:'#40434f', pantsS:'#33353f', pauldron:'#d9dee4', band:'#c8493f', weapon:'sword' }),
  Archer:  Object.assign({}, BASE_PAL, { cloth:'#72b35a', clothS:'#528a3f', belt:'#7a4a22', pants:'#6b5236', pantsS:'#57412a', band:'#f0bd3f', weapon:'bow' }),
  Mage:    Object.assign({}, BASE_PAL, { cloth:'#7b5bb5', clothS:'#5a4190', belt:'#e2b44a', pants:'#5a4190', pantsS:'#48337a', robe:true, weapon:'staff', orb:'#ff8a3d' }),
};
const NPC_PAL = { skin:'#f2cda8', skinS:'#dcaf86', hair:'#39354f', hairD:'#26233a', hairL:'#58537a',
  cloth:'#4f8a5b', clothS:'#3c6c46', belt:'#d9b75e', pants:'#e8e0cc', pantsS:'#cfc5ad', shoe:'#5b3d23', eye:'#2b1d14', hat:'#c8493f', hatD:'#8e2d26', weapon:'none' };

function drawJellop(c,f,ox){
  const cx=ox+18, cy=21, rx=14, ry=11;
  for(let y=cy-ry;y<=30;y++)for(let x=cx-rx;x<=cx+rx;x++){
    const nx=(x-cx)/rx, ny=(y-cy)/ry; if(nx*nx+ny*ny>1) continue;
    let col='#f593b7'; if(-nx*.6-ny*.8>.35) col='#ffc0d6'; if(ny>.55||nx>.72) col='#df6a98';
    px(c,x,y,col);
  }
  px(c,cx-8,cy-6,'#fff4f9',3,2); px(c,cx-9,cy-4,'#fff4f9',1,2);
  px(c,cx,cy-13,'#4f9a3c',1,4); px(c,cx-3,cy-12,'#6cc152',3,2); px(c,cx+1,cy-14,'#6cc152',3,2);
  if(f===0){ px(c,cx-5,cy-1,'#3a1f2a',2,4); px(c,cx+4,cy-1,'#3a1f2a',2,4); px(c,cx-5,cy-1,'#fff'); px(c,cx+4,cy-1,'#fff');
    px(c,cx-1,cy+4,'#9b3d60',1,1); px(c,cx+1,cy+4,'#9b3d60',1,1); px(c,cx,cy+5,'#9b3d60'); }
  else { [[0,0],[1,1],[0,2]].forEach(([a,b])=>{px(c,cx-6+a,cy-1+b,'#3a1f2a',2,1); px(c,cx+5-a,cy-1+b,'#3a1f2a',2,1);}); px(c,cx-1,cy+4,'#9b3d60',3,2); }
  px(c,cx-10,cy+3,'#ff7ea6',3,1); px(c,cx+8,cy+3,'#ff7ea6',3,1);
}
function drawMoth(c,f,ox){
  const cx=ox+16;
  const wing=(x,y,rx,ry)=>{ disc(c,x,y,rx,'#9c82d6',ry); disc(c,x,y,rx-1,'#cdb7f2',Math.max(1,ry-1)); disc(c,x,y,2,'#f3d36b',Math.min(2,ry-1)); };
  if(f===0){ wing(cx-8,10,7,6); wing(cx+8,10,7,6); wing(cx-7,20,5,4); wing(cx+7,20,5,4); }
  else { wing(cx-9,15,7,4); wing(cx+9,15,7,4); wing(cx-6,23,4,3); wing(cx+6,23,4,3); }
  disc(c,cx,18,3,'#5b3f7a',7); px(c,cx-2,15,'#3e2958',5,1); px(c,cx-2,19,'#3e2958',5,1); px(c,cx-2,23,'#3e2958',5,1);
  disc(c,cx,9,3,'#6d4d90'); px(c,cx-2,8,'#fff'); px(c,cx+2,8,'#fff');
  px(c,cx-2,5,'#3e2958',1,2); px(c,cx-3,3,'#3e2958',1,2); px(c,cx-4,1,'#f3d36b',2,2);
  px(c,cx+2,5,'#3e2958',1,2); px(c,cx+3,3,'#3e2958',1,2); px(c,cx+3,1,'#f3d36b',2,2);
}
function drawEquipIcon(c,ic){
  const [shape,c1,c2]=ic, r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
  const L=(x0,y0,x1,y1,col,w=1)=>{ const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1; for(let i=0;i<=n;i++) r(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),w,w,col); };
  switch(shape){
    case 'sword': L(3,12,12,3,c1,2); L(4,12,13,3,'#ffffff',1); L(2,9,6,13,c2,2); L(1,14,3,12,'#7a4a22',2); break;
    case 'bow': [[4,2],[3,4],[2,6],[2,9],[3,11],[4,13]].forEach(([x,y])=>r(x,y,2,2,c1)); L(5,2,5,14,c2,1); r(4,7,9,1,'#d9c9a0'); r(12,6,2,3,'#9aa7b3'); break;
    case 'staff': L(3,14,11,5,c2,2); disc(c,12,4,3,c1); r(11,3,1,1,'#ffffff'); break;
    case 'armor': r(3,4,10,10,c1); r(1,4,3,4,c1); r(12,4,3,4,c1); r(6,3,4,2,c2); r(10,5,2,9,c2); r(3,11,10,1,c2); break;
    case 'robe': r(4,3,8,12,c1); r(2,4,3,5,c1); r(11,4,3,5,c1); r(7,3,2,12,'#e2b44a'); r(10,5,2,10,c2); break;
    case 'shield': disc(c,8,8,6,c1,7); disc(c,8,8,4,c2,5); disc(c,8,8,2,c1,2); break;
    case 'cloak': r(5,2,6,3,c2); for(let y=4;y<15;y++){ const w=3+Math.floor((y-4)/2); r(8-w,y,w*2,1,c1); } r(7,5,2,9,c2); break;
    case 'boots': r(4,3,5,8,c1); r(4,10,9,4,c1); r(4,13,9,1,c2); r(5,4,1,6,c2); break;
    case 'ring': for(let a=0;a<16;a++){ const t=a/16*Math.PI*2; r(Math.round(8+Math.cos(t)*5),Math.round(9+Math.sin(t)*4),1,1,c2); } disc(c,8,4,2,c1); r(7,3,1,1,'#ffffff'); break;
    case 'glove': r(4,6,8,8,c1); [4,6,8,10].forEach(x=>r(x,2,2,5,c1)); r(11,7,3,3,c1); r(4,12,8,2,c2); break;
    case 'band': r(2,10,12,2,c2); r(3,1,3,9,c1); r(10,1,3,9,c1); r(4,3,1,6,c2); r(11,3,1,6,c2); break;
    case 'circlet': r(2,8,12,3,c1); [[3,5],[7,4],[11,5]].forEach(([x,y])=>r(x,y,2,3,c2)); r(6,9,4,1,'#86d073'); break;
    case 'helm': disc(c,8,9,6,c1,5); r(2,9,12,3,c1); r(4,11,2,3,c2); r(10,11,2,3,c2); r(5,6,6,1,'#a26c3e'); break;
    case 'straw': c.fillStyle=c1; c.beginPath(); c.ellipse(8,11,7.5,3,0,0,6.3); c.fill(); r(4,5,8,6,c1); r(5,4,6,1,c1); r(4,8,8,2,c2); r(2,11,12,1,'#b89040'); break;
    case 'kcrown': r(2,7,12,6,c1); [[2,3],[6,2],[10,3]].forEach(([x,y])=>r(x,y,4,5,c1)); r(7,9,2,2,c2); r(3,9,2,2,'#4f8fe6'); r(11,9,2,2,'#4f8fe6'); r(2,12,12,1,'#b8862a'); break;
  }
}
function drawItemIcon(c,id){
  const IT=ITEMS[id]; if(IT&&IT.icon){ drawEquipIcon(c,IT.icon); return; }
  const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
  switch(id){
    case 'redpot': r(6,1,4,2,'#b07a3c'); r(7,3,2,2,'#e9e2d8'); r(4,5,8,9,'#d33c3c'); r(5,4,6,11,'#d33c3c'); r(5,6,2,4,'#ff9a8a'); r(4,13,8,1,'#9c2525'); break;
    case 'apple': disc(c,8,9,6,'#d8322f',5); r(5,6,2,3,'#ff8a7a'); r(8,2,1,3,'#6b4423'); r(9,2,3,2,'#63b543'); break;
    case 'flywing': disc(c,6,8,5,'#dfe8f2',4); disc(c,10,10,4,'#ffffff',3); r(4,6,3,1,'#b9c6d6'); r(5,9,4,1,'#b9c6d6'); r(7,8,1,6,'#8f9aa6'); r(11,12,3,1,'#c9d4e0'); break;
    case 'bwing': disc(c,6,7,5,'#79b7ff',4); disc(c,10,10,4,'#a8d2ff',3); r(7,8,1,6,'#3d5f99'); r(5,5,2,2,'#e6f3ff'); break;
    case 'jelly': disc(c,8,10,5,'#f593b7',4); r(7,3,2,3,'#f593b7'); r(6,5,4,2,'#f593b7'); r(6,8,2,2,'#fff'); break;
    case 'mucus': disc(c,8,10,6,'#8fd46b',4); r(4,9,2,2,'#d7f7c0'); r(10,12,3,1,'#5ea343'); break;
    case 'dust': disc(c,8,10,5,'#8a6bc4',5); r(6,3,4,3,'#b89be8'); r(5,5,6,1,'#5b3f7a'); r(6,8,2,2,'#e7dcff'); break;
    case 'orangepot': r(6,1,4,2,'#b07a3c'); r(7,3,2,2,'#e9e2d8'); r(4,5,8,9,'#f08a2a'); r(5,4,6,11,'#f08a2a'); r(5,6,2,4,'#ffd0a0'); r(4,13,8,1,'#b0561a'); break;
    case 'royaljelly': r(5,5,6,2,'#b07a3c'); r(4,7,8,8,'#f0bd3f'); r(5,8,2,4,'#fff3b0'); r(4,14,8,1,'#b8862a'); r(5,2,6,2,'#e2524a'); r(6,1,1,1,'#e2524a'); r(9,1,1,1,'#e2524a'); break;
    case 'fur': disc(c,8,10,6,'#efe4cf',4); r(4,7,3,2,'#ffffff'); r(9,12,4,1,'#d0c2a8'); r(11,6,2,2,'#ffffff'); break;
    case 'thorn': r(7,3,2,11,'#3f8f47'); r(8,1,1,2,'#f1e6b8'); r(4,6,3,1,'#f1e6b8'); r(9,9,3,1,'#f1e6b8'); r(4,12,3,1,'#f1e6b8'); r(6,13,4,2,'#2f7a3c'); break;
    case 'tusk': r(3,12,3,2,'#fff6e0'); r(5,10,3,2,'#fff6e0'); r(7,7,3,3,'#fff6e0'); r(9,4,2,3,'#fff6e0'); r(10,2,1,2,'#e8dcc0'); r(3,13,3,1,'#c9b894'); break;
    case 'crown': r(3,8,10,5,'#f0bd3f'); r(3,5,2,3,'#f0bd3f'); r(7,4,2,4,'#f0bd3f'); r(11,5,2,3,'#f0bd3f'); r(7,9,2,2,'#f593b7'); r(3,12,10,1,'#b8862a'); break;
  }
}

function drawBunny(c,f,ox){ const cx=ox+16, by=f?27:29;
  disc(c,cx+1,by-7,9,'#e9ddc6',7); disc(c,cx+2,by-7,7,'#fbf5e8',5);
  disc(c,cx-5,by-13,6,'#e9ddc6',5); disc(c,cx-5,by-13,4,'#fbf5e8',4);
  px(c,cx-9,by-26-f,'#e9ddc6',3,12); px(c,cx-8,by-24-f,'#f7a8b8',1,9); px(c,cx-4,by-27-f,'#e9ddc6',3,13); px(c,cx-3,by-25-f,'#f7a8b8',1,10);
  px(c,cx-8,by-15,'#2b1d14',2,3); px(c,cx-8,by-15,'#ffffff'); px(c,cx-11,by-11,'#f28aa0',2,1); px(c,cx-7,by-11,'#ffb6c4',2,1);
  disc(c,cx+10,by-9,2,'#ffffff'); px(c,cx-5,by-1,'#d9ccb4',4,2); px(c,cx+3,by-1,'#d9ccb4',4,2);
}
function drawThorn(c,f,ox){ const cx=ox+16, s=f?1:0;
  disc(c,cx,29,10,'#6b4a2b',3); disc(c,cx,28,8,'#8a6440',2);
  px(c,cx-2+s,13,'#3f8f47',5,15); px(c,cx+s,13,'#6cc152',1,15);
  disc(c,cx-7+s,21,5,'#6cc152',2); disc(c,cx+7+s,18,5,'#6cc152',2);
  disc(c,cx+s,10,8,'#2f7a3c',7); disc(c,cx-1+s,9,6,'#4fa24c',5); px(c,cx-4+s,5,'#86d073',3,2);
  [[-10,9],[9,9],[-1,1],[-7,3],[6,3],[-9,14],[8,14]].forEach(([dx,dy])=>px(c,cx+dx+s,dy,'#f1e6b8',2,2));
  px(c,cx-4+s,9,'#1a1a1a',2,3); px(c,cx+2+s,9,'#1a1a1a',2,3); px(c,cx-5+s,7,'#1a1a1a',3,1); px(c,cx+2+s,7,'#1a1a1a',3,1); px(c,cx-1+s,13,'#1a1a1a',3,1);
}
function drawBoar(c,f,ox){ const cx=ox+21, a=f?1:0;
  [[-10,a],[-5,-a],[5,a],[10,-a]].forEach(([dx,o])=>px(c,cx+dx,24+o,'#4a2f1a',3,6-o));
  disc(c,cx+1,18,14,'#7a4e2a',8); disc(c,cx,16,12,'#a26c3e',6); px(c,cx-6,12,'#c08652',10,2);
  for(let i=0;i<9;i++) px(c,cx-5+i*2,8+(i%2),'#4a2f1a',2,4);
  disc(c,cx-13,19,7,'#93603a',6); disc(c,cx-19,21,3,'#e0a88a',3); px(c,cx-21,20,'#5a3b1e'); px(c,cx-19,20,'#5a3b1e');
  px(c,cx-17,24,'#fff6e0',2,3); px(c,cx-17,23,'#fff6e0',1,1); px(c,cx-14,16,'#1a1a1a',2,2); px(c,cx-14,16,'#ff5a4a');
  px(c,cx-11,10,'#6b4424',3,5); px(c,cx+15,13,'#4a2f1a',2,2); px(c,cx+17,11,'#4a2f1a',1,2);
}
function drawKingJellop(c,f,ox){
  const cx=ox+32, cy=36, rx=26, ry=19;
  for(let y=cy-ry;y<=54;y++)for(let x=cx-rx;x<=cx+rx;x++){ const nx=(x-cx)/rx, ny=(y-cy)/ry; if(nx*nx+ny*ny>1) continue;
    let col='#f07aa8'; if(-nx*.6-ny*.8>.35) col='#ffb3cf'; if(ny>.55||nx>.72) col='#d2568a'; px(c,x,y,col); }
  px(c,cx-15,cy-11,'#fff4f9',5,3); px(c,cx-17,cy-8,'#fff4f9',2,3);
  // crown
  px(c,cx-11,cy-24,'#f0bd3f',22,7); [[-11,-29],[-3,-31],[5,-29]].forEach(([dx,dy])=>px(c,cx+dx,cy+dy,'#f0bd3f',5,6)); px(c,cx+11,cy-28,'#f0bd3f',1,1);
  px(c,cx-11,cy-18,'#b8862a',22,1); px(c,cx-2,cy-22,'#4f8fe6',4,3); px(c,cx-9,cy-22,'#e2524a',3,3); px(c,cx+6,cy-22,'#e2524a',3,3);
  if(f===0){ px(c,cx-10,cy-2,'#3a1f2a',4,6); px(c,cx+7,cy-2,'#3a1f2a',4,6); px(c,cx-10,cy-2,'#fff',2,2); px(c,cx+7,cy-2,'#fff',2,2);
    px(c,cx-12,cy-6,'#3a1f2a',6,1); px(c,cx+6,cy-6,'#3a1f2a',6,1); px(c,cx-3,cy+7,'#9b3d60',7,2); }
  else { [[0,0],[1,1],[2,2],[1,3],[0,4]].forEach(([a,b])=>{ px(c,cx-11+a,cy-2+b,'#3a1f2a',2,1); px(c,cx+10-a,cy-2+b,'#3a1f2a',2,1); }); px(c,cx-3,cy+6,'#9b3d60',7,3); }
  px(c,cx-19,cy+4,'#ff7ea6',5,2); px(c,cx+15,cy+4,'#ff7ea6',5,2);
}
