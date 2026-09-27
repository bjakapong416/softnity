/* ---------- pixel-art menu icons ---------- */
const UIICON={};
function drawUiIcon(c,key){
  const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
  const L=(x0,y0,x1,y1,col,w=2)=>{ const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1; for(let i=0;i<=n;i++) r(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),w,w,col); };
  switch(key){
    case 'skill': // spellbook
      r(6,5,20,23,'#23386e'); r(7,6,18,21,'#3d5aa8'); r(24,7,3,20,'#f4efe2'); r(24,7,3,1,'#c9bfa8'); r(24,12,3,1,'#c9bfa8'); r(24,17,3,1,'#c9bfa8'); r(24,22,3,1,'#c9bfa8');
      [[7,6],[21,6],[7,23],[21,23]].forEach(([x,y])=>r(x,y,4,4,'#e8c170')); disc(c,15,16,5,'#e8c170'); disc(c,15,16,3,'#7de0ff'); r(14,14,2,2,'#ffffff'); r(9,9,2,12,'#5b78c8'); break;
    case 'equip': // chestplate
      r(8,7,16,19,'#9aa7b3'); r(4,7,6,7,'#b9c3ce'); r(22,7,6,7,'#b9c3ce'); r(12,5,8,4,'#6f7b87'); r(15,8,2,17,'#e8c170'); r(8,7,16,2,'#e8c170');
      r(9,10,5,10,'#cfd8e0'); r(18,10,3,14,'#7d8894'); r(8,24,16,3,'#6f7b87'); r(11,13,2,2,'#ffffff'); break;
    case 'bag': // backpack
      r(7,10,18,18,'#8a5a32'); r(8,11,16,16,'#a26c3e'); r(6,8,20,8,'#7a4e2a'); r(7,9,18,6,'#b27a46'); r(10,4,12,6,'#5a3b1e'); r(12,5,8,3,'#1c1a2a');
      r(14,13,4,5,'#e8c170'); r(15,14,2,3,'#8a6a2a'); r(9,19,14,6,'#93603a'); r(9,19,14,1,'#c08652'); r(4,12,3,12,'#5a3b1e'); r(25,12,3,12,'#5a3b1e'); break;
    case 'map': // folded map with pin
      r(3,8,9,20,'#f0dca0'); r(12,6,9,20,'#e6cc88'); r(21,8,8,20,'#f0dca0'); r(12,6,1,20,'#b89a5a'); r(21,8,1,20,'#b89a5a');
      disc(c,8,15,3,'#6cae4c'); r(14,16,6,3,'#4fa8d6'); disc(c,25,21,3,'#6cae4c'); L(6,24,26,13,'#c0392b',1); r(24,2,2,11,'#5a3b1e'); r(26,2,6,5,'#e2524a'); r(26,3,4,1,'#ff8a7a'); break;
    case 'bot': // robot head
      r(15,2,2,5,'#6f7b87'); disc(c,16,2,2,'#7de0ff'); r(6,8,20,17,'#4a5d93'); r(7,9,18,15,'#6f86c8'); r(8,10,16,2,'#9fb3e8');
      r(9,13,14,7,'#16224a'); r(11,15,3,3,'#7de0ff'); r(18,15,3,3,'#7de0ff'); r(12,15,1,1,'#ffffff'); r(19,15,1,1,'#ffffff'); r(3,13,3,6,'#6f7b87'); r(26,13,3,6,'#6f7b87');
      r(11,21,10,2,'#9fb3e8'); r(9,25,14,4,'#3b4a78'); r(11,26,10,2,'#e8c170'); break;
    case 'gear':
      for(let a=0;a<8;a++){ const t=a/8*Math.PI*2; r(Math.round(16+Math.cos(t)*11)-2,Math.round(16+Math.sin(t)*11)-2,5,5,'#8f9aa6'); }
      disc(c,16,16,10,'#b9c3ce'); disc(c,16,16,8,'#cfd8e0'); disc(c,16,16,4,'#6f7b87'); disc(c,16,16,2,'#16224a'); r(11,10,3,2,'#ffffff'); break;
    case 'menu': [8,15,22].forEach(y=>r(5,y,22,4,'#ffffff')); break;
    case 'grid': [[4,4,'#e2524a'],[17,4,'#4f8fe6'],[4,17,'#e8c170'],[17,17,'#5fb86a']].forEach(([x,y,col])=>{ r(x,y,11,11,col); r(x+1,y+1,9,3,'rgba(255,255,255,.45)'); }); break;
    case 'scroll': r(6,6,20,20,'#f4e6c0'); r(4,4,24,4,'#c9a060'); r(4,24,24,4,'#c9a060'); [11,15,19].forEach(y=>r(9,y,14,2,'#8a6a3a')); r(22,20,5,5,'#e2524a'); break;
    case 'sword': // crossed swords
      L(5,5,24,24,'#dfe7ee',3); L(6,5,25,24,'#9aa7b3',1); L(27,5,8,24,'#dfe7ee',3); L(26,5,7,24,'#ffffff',1);
      L(20,26,27,19,'#e8c170',2); L(5,19,12,26,'#e8c170',2); r(24,25,5,5,'#7a4a22'); r(3,25,5,5,'#7a4a22'); r(26,27,3,3,'#e8c170'); r(3,27,3,3,'#e8c170'); break;
    case 'hand':
      r(9,14,14,12,'#f2cda8'); [9,12,15,18].forEach((x,i)=>r(x,5+(i===0?3:i===3?2:0),3,11,'#f2cda8')); r(21,15,5,4,'#f2cda8'); r(9,25,14,3,'#dcaf86'); r(10,6,1,8,'#fff0dc'); break;
  }
}
function buildUiIcons(){
  ['skill','equip','bag','map','bot','gear','menu','sword','hand','grid','scroll'].forEach(k=>{ const cv=document.createElement('canvas'); cv.width=32; cv.height=32; const c=cv.getContext('2d'); c.imageSmoothingEnabled=false; drawUiIcon(c,k); if(k!=='menu') outline(c,32,32,'#141024'); UIICON[k]=cv.toDataURL(); });
  const map={statusWin:null,skillWin:'skill',equipWin:'equip',invWin:'bag',mapWin:'map',botWin:'bot',settingsWin:'gear'};
  document.querySelectorAll('.tb[data-open]').forEach(b=>{ const k=map[b.dataset.open]; if(k) b.querySelector('.ic').innerHTML=`<img alt="" src="${UIICON[k]}">`; });
  $('menuBtn').innerHTML=`<img alt="" src="${UIICON.menu}">`;
  $('atkBtn').querySelector('svg').outerHTML=`<img class="pxi" alt="" src="${UIICON.sword}">`;
  $('botBtn2').querySelector('svg').outerHTML=`<img class="pxi" alt="" src="${UIICON.bot}">`;
  $('pickBtn').querySelector('svg').outerHTML=`<img class="pxi" alt="" src="${UIICON.hand}">`;
  $('rbMenuImg').src=UIICON.grid; $('qtIc').src=UIICON.scroll;
}
function drawStatusIcon(){ // hero head as the Status icon (follows job + headgear)
  const cv=document.createElement('canvas'); cv.width=32; cv.height=32; const c=cv.getContext('2d'); c.imageSmoothingEnabled=false;
  const src=S.textures.get(heroTex()).getSourceImage(), k=heroK(), F=customFrame(); if(F){ const sz=F.charH*.42, top=F.base-F.charH; c.imageSmoothingEnabled=!F.nearest; c.drawImage(F.src,F.x+F.w/2-sz/2,F.y+top-4,sz,sz,0,0,32,32); } else if(k>1){ c.imageSmoothingEnabled=true; c.drawImage(src,8*k,13*k,32*k,32*k,0,0,32,32); c.imageSmoothingEnabled=false; } else c.drawImage(src,8,1,32,32,0,1,32,32);
  const hid=P.equip&&P.equip.head, hat=hid&&ITEMS[hid].hat, hgk=hid&&k>1?ensureHG(P.job,hid):null;
  if(hgk){ c.imageSmoothingEnabled=true; c.drawImage(HD.sheets[hgk].canvas,8*k,13*k,32*k,32*k,0,0,32,32); c.imageSmoothingEnabled=false; }
  else if(hat){ const hs=S.textures.get(hat).getSourceImage(); c.drawImage(hs,16-hs.width/2,Math.max(0,10-hs.height)); }
  outline(c,32,32,'#141024'); const url=cv.toDataURL();
  document.querySelectorAll('.tb[data-open="statusWin"] .ic').forEach(el=>el.innerHTML=`<img alt="" src="${url}">`); $('rbChar').src=url;
}

