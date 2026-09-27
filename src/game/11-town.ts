/* ============================================================
   Town: Everhaven (GDD 7.1)
   ============================================================ */
Object.assign(HERO_OUTFIT,{
  smith:{ top:'#6b4a2e', topS:'#4e341e', topD:'#3a2616', sleeve:'#d9c9a8', belt:'#3a2616', buckle:'#9aa7b3', pants:'#4a3a2c', pantsS:'#3a2c20', boots:'#3a2616', bootsS:'#24180e', band:'#c8342c', hairOverride:['#3a3432','#221e1c','#5a5452','#7a7472'], weapon:'none' },
  merchant:{ top:'#3d6fb5', topS:'#2c528a', topD:'#1e3a66', sleeve:'#f4efe2', belt:'#7a4a22', buckle:'#e2b44a', pants:'#5a4636', pantsS:'#46362a', boots:'#6b4424', bootsS:'#4a2f1a', beret:'#2f5a8a', beretS:'#1e3a66', hairOverride:['#7a4e2a','#5a3818','#9a6a3c','#c08a5a'], weapon:'none' },
  inn:{ top:'#f4efe2', topS:'#d9d0bc', topD:'#b8ae98', sleeve:'#c8493f', belt:'#c8493f', buckle:'#e2b44a', pants:'#c8493f', pantsS:'#a0382f', boots:'#6b4424', bootsS:'#4a2f1a', robe:true, trim:'#c8493f', hairOverride:['#e8c170','#c49a48','#f5dc98','#fff0c0'], weapon:'none' },
  guard:Object.assign({},HERO_OUTFIT.Swordman,{ beret:'#8f9aa8', beretS:'#5f6a78', hairOverride:['#4a3a2c','#2e2218','#6b5240','#8a6a50'] }),
  mS:Object.assign({},HERO_OUTFIT.Swordman,{ hairOverride:['#b9b9c0','#8a8a94','#dcdce4','#ffffff'] }),
  mA:Object.assign({},HERO_OUTFIT.Archer,{ hairOverride:['#e8c170','#c49a48','#f5dc98','#fff0c0'] }),
  mM:Object.assign({},HERO_OUTFIT.Mage,{ hairOverride:['#e8e8f0','#b9b9c8','#ffffff','#ffffff'] }),
  folkA:{ top:'#c9a06a', topS:'#a8804a', topD:'#86603a', sleeve:'#c9a06a', belt:'#6b4424', buckle:'#e2b44a', pants:'#5a6a86', pantsS:'#46546c', boots:'#5a3b22', bootsS:'#3e2816', hairOverride:['#5a3818','#3a2410','#7a4e2a','#9a6a3c'], weapon:'none' },
  folkB:{ top:'#9fb3c8', topS:'#7d91a8', topD:'#5f7388', sleeve:'#f4efe2', belt:'#8a5a2b', buckle:'#e2b44a', pants:'#8a5a6a', pantsS:'#6e4454', boots:'#6b4424', bootsS:'#4a2f1a', robe:true, trim:'#f4efe2', hairOverride:['#2a2a2a','#141414','#4a4a4a','#6a6a6a'], weapon:'none' },
});
const TOWN_STATIC=['smith','merchant','inn','guard','mS','mA','mM'];
const TOWN_WALKERS=['folkA','folkB'];

function drawHouse(c,Wd,Hd,o){
  const r=(x,y,w,h,col)=>px(c,x,y,col,w,h), cx=Wd/2;
  // stone base
  r(8,Hd-26,Wd-16,24,'#a9a296'); for(let y=Hd-26;y<Hd-2;y+=6){ r(8,y,Wd-16,1,'#827b70'); for(let x=8+((y/6)%2?8:0);x<Wd-8;x+=16) r(x,y,1,6,'#827b70'); } r(8,Hd-26,Wd-16,2,'#c2bbaf');
  // walls with timber frame
  r(12,Hd-72,Wd-24,46,o.wall); r(Wd-30,Hd-72,18,46,o.wallS);
  [12,Wd*0.32|0,Wd*0.68|0,Wd-16].forEach(x=>r(x,Hd-72,4,46,o.beam)); r(12,Hd-72,Wd-24,4,o.beam); r(12,Hd-50,Wd-24,3,o.beam);
  // roof
  const top=8, bot=Hd-68;
  for(let y=top;y<bot;y++){ const t=(y-top)/(bot-top), w=Math.round(24+t*(Wd-24)); r(cx-w/2,y,w,1,(y-top)%7===0?o.roofS:o.roof); }
  for(let y=top+4;y<bot;y+=7){ const t=(y-top)/(bot-top), w=Math.round(24+t*(Wd-24)); for(let x=cx-w/2+((y/7)%2?4:0);x<cx+w/2;x+=9) r(x,y,1,6,o.roofS); }
  r(cx-12,top,24,3,o.roofL); r(0,bot-2,Wd,4,o.roofS);
  if(o.chimney){ r(Wd-44,top+6,14,26,'#8f887c'); r(Wd-46,top+4,18,4,'#6f695f'); }
  // windows
  const win=(x,y)=>{ r(x-2,y-2,22,24,o.beam); r(x,y,18,20,'#9fd0f0'); r(x,y,18,6,'#cfeaff'); r(x+8,y,2,20,o.beam); r(x,y+9,18,2,o.beam); r(x-3,y+22,24,4,'#7a4a22'); [x,x+6,x+12,x+17].forEach((fx,i)=>r(fx,y+19,4,3,['#ff8fb8','#ffd84a','#ff6b5e','#8ec5ff'][i])); };
  win(24,Hd-64); win(Wd-44,Hd-64);
  // door
  r(cx-13,Hd-50,26,48,o.beam); r(cx-10,Hd-46,20,44,o.door); r(cx-1,Hd-46,2,44,'#3a2616'); r(cx+5,Hd-24,3,3,'#e2b44a'); r(cx-12,Hd-52,24,4,o.roofS);
  // hanging sign
  if(o.sign){ r(cx+16,Hd-78,22,2,'#3a2616'); r(cx+18,Hd-76,1,4,'#3a2616'); r(cx+34,Hd-76,1,4,'#3a2616'); r(cx+15,Hd-72,24,20,'#e8d4a0'); r(cx+15,Hd-72,24,2,'#b8986a'); r(cx+15,Hd-54,24,2,'#8a6a3a'); o.sign(c,cx+17,Hd-69); }
  outline(c,Wd,Hd,'#2a1a10');
}
const SIGNS={
  sword:(c,x,y)=>{ px(c,x+9,y,'#9aa7b3',3,11); px(c,x+10,y,'#ffffff',1,10); px(c,x+5,y+11,'#e2b44a',11,2); px(c,x+9,y+13,'#7a4a22',3,3); },
  shield:(c,x,y)=>{ disc(c,x+10,y+7,7,'#4f7ab5',7); disc(c,x+10,y+7,4,'#e2b44a',4); disc(c,x+10,y+7,2,'#4f7ab5',2); },
  potion:(c,x,y)=>{ px(c,x+8,y,'#b07a3c',4,2); px(c,x+9,y+2,'#e9e2d8',2,3); disc(c,x+10,y+10,6,'#d33c3c',5); px(c,x+7,y+7,'#ff9a8a',2,3); },
  bed:(c,x,y)=>{ px(c,x+1,y+6,'#8a5a2b',18,8); px(c,x+2,y+3,'#f4efe2',6,4); px(c,x+7,y+4,'#c8493f',11,5); px(c,x+1,y+13,'#5e3d22',2,3); px(c,x+17,y+13,'#5e3d22',2,3); },
  bow:(c,x,y)=>{ [[5,1],[4,3],[3,6],[3,9],[4,12],[5,14]].forEach(([dx,dy])=>px(c,x+dx,y+dy,'#8a5a2b',2,2)); px(c,x+7,y+2,'#f4efe2',1,13); px(c,x+4,y+8,'#d9c9a0',14,1); px(c,x+17,y+7,'#9aa7b3',2,3); },
  crossed:(c,x,y)=>{ for(let i=0;i<14;i++){ px(c,x+3+i,y+1+i,'#9aa7b3',2,1); px(c,x+17-i,y+1+i,'#9aa7b3',2,1); } px(c,x+2,y+13,'#e2b44a',4,2); px(c,x+15,y+13,'#e2b44a',4,2); },
};
function genTownTextures(s){
  if(s.textures.exists('cobble')) return;
  canvasTex(s,'cobble',32,32,c=>{ px(c,0,0,'#8a8378',32,32);
    for(let row=0;row<4;row++){ const off=row%2?5:0; for(let x=-off;x<32;x+=11){ const col=['#aaa397','#b3ac9f','#a0998c','#bbb4a7'][irnd(0,3)]; px(c,x+1,row*8+1,col,9,6); px(c,x+1,row*8+1,'#c9c2b5',9,1); px(c,x+1,row*8+6,'#8f887c',9,1); } } });
  canvasTex(s,'plaza',32,32,c=>{ px(c,0,0,'#b8a98c',32,32); [[0,0],[16,0],[0,16],[16,16]].forEach(([x,y],i)=>{ px(c,x+1,y+1,['#e2d6ba','#d9ccb0','#d4c6a8','#e8dcc2'][i],14,14); px(c,x+1,y+1,'#efe6d0',14,1); }); });
  BUILDINGS.forEach(b=>{ if(b.o&&!s.textures.exists(b.tex)) hdTry(s,b.tex)||canvasTex(s,b.tex,b.w*32,140,c=>drawHouse(c,b.w*32,140,b.o)); });
  hdTry(s,'tower-mage')||canvasTex(s,'tower-mage',100,190,c=>{ const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
    r(18,60,64,126,'#8f7ec0'); r(62,60,20,126,'#6b5a9a'); for(let y=66;y<186;y+=10){ r(18,y,64,1,'#6b5a9a'); } r(14,176,72,12,'#a9a296');
    for(let y=4;y<64;y++){ const w=Math.round(8+(y-4)*1.5); r(50-w/2,y,w,1,y%6?'#3b2a6a':'#2d2150'); } r(46,0,8,6,'#e8c170');
    [[34,80],[34,120]].forEach(([x,y])=>{ r(x,y,30,22,'#2d2150'); r(x+3,y+3,24,16,'#ffd27a'); r(x+14,y+3,2,16,'#2d2150'); }); r(38,150,24,36,'#3b2a6a'); r(40,154,20,32,'#5a4190'); r(58,170,3,3,'#e8c170');
    r(24,62,52,4,'#e8c170'); outline(c,100,190,'#1c1438'); });
  hdTry(s,'belltower')||canvasTex(s,'belltower',96,196,c=>{ const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
    r(16,70,64,122,'#b3ac9f'); r(60,70,20,122,'#8f887c'); for(let y=76;y<192;y+=9){ r(16,y,64,1,'#8f887c'); for(let x=16+((y/9)%2?10:0);x<80;x+=20) r(x,y,1,9,'#8f887c'); }
    r(22,48,52,26,'#6b4424'); r(30,52,36,22,'#1c1a2a'); disc(c,48,64,9,'#e2b44a',8); r(46,70,4,4,'#b8862a'); r(12,44,72,6,'#8a5a2b');
    for(let y=4;y<46;y++){ const w=Math.round(10+(y-4)*1.7); r(48-w/2,y,w,1,y%6?'#4f6fa8':'#34507e'); } r(45,0,6,6,'#e2b44a');
    r(36,150,24,42,'#5a3b1e'); r(38,154,20,38,'#7a4e2a'); r(34,96,28,28,'#f4efe2'); disc(c,48,110,11,'#ffffff'); disc(c,48,110,10,'#f4efe2'); r(47,102,2,9,'#1c1a2a'); r(48,109,6,2,'#1c1a2a');
    outline(c,96,196,'#2a1a10'); });
  hdTry(s,'fountain')||canvasTex(s,'fountain',112,92,c=>{ const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
    disc(c,56,66,52,'#9a9388',22); disc(c,56,64,48,'#c2bbaf',19); disc(c,56,64,42,'#4ba6d6',15); disc(c,52,60,30,'#6fc0e8',9); for(let i=0;i<16;i++) r(irnd(20,90),irnd(54,74),3,1,'#d9f5ff');
    r(48,24,16,42,'#b3ac9f'); r(58,24,6,42,'#8f887c'); disc(c,56,26,14,'#c2bbaf',6); disc(c,56,24,12,'#6fc0e8',4);
    disc(c,56,12,9,'#f593b7',8); disc(c,53,9,3,'#ffc0d6'); r(52,11,2,3,'#3a1f2a'); r(59,11,2,3,'#3a1f2a'); r(55,1,2,4,'#4f9a3c');
    outline(c,112,92,'#3a3530'); });
  hdTry(s,'stall')||canvasTex(s,'stall',76,66,c=>{ const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
    r(8,36,60,26,'#8a5a2b'); r(8,36,60,3,'#b8844e'); r(10,62,6,4,'#5a3b1e'); r(60,62,6,4,'#5a3b1e'); r(10,12,4,26,'#6b4424'); r(62,12,4,26,'#6b4424');
    for(let x=2;x<74;x+=8){ r(x,4,8,16,((x/8)|0)%2?'#f4efe2':'#e2524a'); } r(2,18,72,3,'#b8342c'); for(let x=2;x<74;x+=8) disc(c,x+4,21,4,((x/8)|0)%2?'#f4efe2':'#e2524a',2);
    [[14,'#ff8a3d'],[24,'#e2524a'],[34,'#8fd46b'],[44,'#ffd84a'],[54,'#b98cff']].forEach(([x,col])=>{ disc(c,x+3,32,4,col); r(x+1,29,2,2,'#ffffff'); });
    outline(c,76,66,'#2a1a10'); });
  hdTry(s,'lamp')||canvasTex(s,'lamp',18,60,c=>{ px(c,8,14,'#2a2a34',3,44); px(c,5,56,'#2a2a34',9,4); px(c,3,4,'#2a2a34',13,3); px(c,4,7,'#ffe9a0',11,9); px(c,5,8,'#fff8d8',4,4); px(c,3,16,'#2a2a34',13,2); px(c,7,0,'#2a2a34',5,4); outline(c,18,60,'#10101a'); });
  canvasTex(s,'lampglow',64,64,c=>{ const g=c.createRadialGradient(32,32,2,32,32,31); g.addColorStop(0,'rgba(255,230,150,.55)'); g.addColorStop(1,'rgba(255,230,150,0)'); c.fillStyle=g; c.fillRect(0,0,64,64); });
  hdTry(s,'bench')||canvasTex(s,'bench',44,24,c=>{ px(c,2,4,'#8a5a2b',40,4); px(c,2,12,'#9a6a3c',40,5); px(c,2,12,'#b8844e',40,1); px(c,5,17,'#3a2616',3,7); px(c,36,17,'#3a2616',3,7); px(c,5,8,'#3a2616',2,4); px(c,37,8,'#3a2616',2,4); outline(c,44,24,'#2a1a10'); });
  hdTry(s,'planter')||canvasTex(s,'planter',36,26,c=>{ px(c,2,12,'#8a5a2b',32,12); px(c,2,12,'#b8844e',32,2); px(c,6,14,'#6b4424',1,10); px(c,29,14,'#6b4424',1,10); for(let i=0;i<9;i++){ const x=4+i*3.4|0; px(c,x,6+(i%2)*2,'#4f9a3c',2,6); disc(c,x+1,5+(i%2)*2,2,['#ff8fb8','#ffd84a','#ffffff','#b98cff'][i%4]); } outline(c,36,26,'#2a1a10'); });
  hdTry(s,'wall')||canvasTex(s,'wall',32,46,c=>{ px(c,0,10,'#9a9388',32,36); for(let y=10;y<46;y+=8){ px(c,0,y,'#77706a',32,1); for(let x=(y/8)%2?8:0;x<32;x+=16) px(c,x,y,'#77706a',1,8); } px(c,0,10,'#b3ac9f',32,2); px(c,0,0,'#9a9388',10,12); px(c,16,0,'#9a9388',10,12); px(c,0,0,'#b3ac9f',10,2); px(c,16,0,'#b3ac9f',10,2); outline(c,32,46,'#3a3530'); });
  sheetTex(s,'cat',22,16,2,(c,i,ox)=>{ const r=(x,y,w,h,col)=>px(c,ox+x,y,col,w,h); disc(c,ox+10,10,8,'#f0a04a',5); r(4,6,5,6,'#f0a04a'); r(3,3,2,3,'#f0a04a'); r(7,3,2,3,'#f0a04a'); r(4,8,1,1,'#2a1a10'); r(7,8,1,1,'#2a1a10'); r(9,6,6,1,'#d9822b'); r(11,9,6,1,'#d9822b');
    if(i===0){ r(17,6,3,2,'#f0a04a'); r(19,3,2,4,'#f0a04a'); } else { r(17,10,5,2,'#f0a04a'); } },'#5a3010');
  sheetTex(s,'pigeon',14,12,2,(c,i,ox)=>{ const r=(x,y,w,h,col)=>px(c,ox+x,y,col,w,h); disc(c,ox+7,8,5,'#9aa0b0',3); r(3,3,4,4,'#9aa0b0'); r(3,4,1,1,'#1a1a1a'); r(1,5,2,1,'#e2b44a'); r(5,6,3,2,'#6fb6a0'); r(11,7,3,2,'#6f7686');
    if(i===1){ r(6,2,6,3,'#b9c0cc'); } r(6,11,1,1,'#e2524a'); r(9,11,1,1,'#e2524a'); },'#3a3f4a');
  TOWN_STATIC.forEach(k=>hdOr(s,'npc-'+k,48,64,2,(c,i,ox)=>drawHero2(c,0,i,ox,k),'#2a1a14'));
  TOWN_WALKERS.forEach(k=>hdOr(s,'npc-'+k,48,64,27,(c,i,ox)=>drawHero2(c,Math.floor(i/9),i%9,ox,k),'#2a1a14'));
  TOWN_STATIC.forEach(k=>s.anims.create({key:'npc-'+k+'-idle',frames:[0,0,1].map(i=>({key:'npc-'+k,frame:i})),frameRate:2,repeat:-1}));
  TOWN_WALKERS.forEach(k=>{ const key='npc-'+k; ['down','up','side'].forEach((d,di)=>{ const f=i=>({key,frame:di*9+i});
    s.anims.create({key:`${key}-${d}-idle`,frames:[f(0),f(0),f(1)],frameRate:2.5,repeat:-1}); s.anims.create({key:`${key}-${d}-walk`,frames:[2,3,4,5].map(f),frameRate:7,repeat:-1}); }); });
  s.anims.create({key:'cat-idle',frames:[0,0,0,1].map(i=>({key:'cat',frame:i})),frameRate:2,repeat:-1});
  s.anims.create({key:'pigeon-idle',frames:[0,0,1].map(i=>({key:'pigeon',frame:i})),frameRate:3,repeat:-1});
}
const townNpcs=[], walkers=[], critters=[];
const FOLK_LINES=['ปราสาทนั่นสวยใช่ไหมล่ะ ได้ยินว่าพระราชาชอบกินเยลลี่','คลังสินค้าข้างโรงเตี๊ยมฝากของได้นะ','ไปรับพรที่โบสถ์ก่อนออกล่า จะสู้ง่ายขึ้น','ได้ยินว่า King Jellop อยู่ริมสะพานหินที่ Fields 02','ร้านอาวุธทางตะวันออกเฉียงเหนือมีดาบดี ๆ นะ','นั่งพักที่ม้านั่งแล้วฟื้นเร็วขึ้นนะ... ล้อเล่น นั่งตรงไหนก็เหมือนกัน','หอระฆังจะตีบอกเวลาทุกต้นชั่วโมง','ถ้าหลงทาง ใช้ Fly Wing หรือ Butterfly Wing สิ','ทุ่งข้าวสาลีทางตะวันออกสวยมากช่วงนี้','โรงเตี๊ยมทางใต้มีเตียงนุ่ม ๆ นะ'];
const BUILDINGS=[
  {tex:'bld-weapon', x:54,y:38,w:5, o:{wall:'#f0e2c0',wallS:'#d4c29a',beam:'#6b4424',roof:'#4f6fa8',roofS:'#34507e',roofL:'#7a96cc',door:'#8a5a2b',sign:SIGNS.sword,chimney:true}},
  {tex:'bld-armor', x:62,y:38,w:5, o:{wall:'#f0e2c0',wallS:'#d4c29a',beam:'#6b4424',roof:'#5d8a4a',roofS:'#436a34',roofL:'#86b86a',door:'#8a5a2b',sign:SIGNS.shield}},
  {tex:'bld-tool', x:70,y:38,w:5, o:{wall:'#f4e8d0',wallS:'#d8c8a8',beam:'#7a4a22',roof:'#b54a35',roofS:'#8e3526',roofL:'#d8664a',door:'#6b4424',sign:SIGNS.potion,chimney:true}},
  {tex:'bld-inn', x:56,y:50,w:6, o:{wall:'#ecdcb8',wallS:'#d0bc94',beam:'#5a3b1e',roof:'#8a5a2b',roofS:'#6b4424',roofL:'#b8844e',door:'#5a3b1e',sign:SIGNS.bed,chimney:true}},
  {tex:'bld-storage', x:66,y:50,w:6, o:{wall:'#e2d6be',wallS:'#c6b898',beam:'#4a3a2c',roof:'#6b5a4a',roofS:'#4e4034',roofL:'#8f7c68',door:'#4a3a2c',sign:SIGNS.crate}},
  {tex:'bld-guildS', x:14,y:24,w:5, o:{wall:'#d9d2c4',wallS:'#b9b0a0',beam:'#4a3a2c',roof:'#8e2d26',roofS:'#6a1f1a',roofL:'#b8463c',door:'#4a3a2c',sign:SIGNS.crossed}},
  {tex:'bld-guildA', x:23,y:24,w:5, o:{wall:'#e8dcc0',wallS:'#ccbc98',beam:'#5a3b1e',roof:'#3f7a33',roofS:'#2e5a24',roofL:'#62a452',door:'#6b4424',sign:SIGNS.bow}},
  {tex:'bld-home1', x:10,y:54,w:4, o:{wall:'#f4e8d0',wallS:'#d8c8a8',beam:'#7a4a22',roof:'#c9864a',roofS:'#a0663a',roofL:'#e8a868',door:'#8a5a2b',chimney:true}},
  {tex:'bld-home2', x:20,y:55,w:4, o:{wall:'#efe6d6',wallS:'#d2c6b0',beam:'#5a4a6a',roof:'#6b5a9a',roofS:'#4e4078',roofL:'#8f7ec0',door:'#5a4a6a'}},
  {tex:'bld-home3', x:30,y:54,w:4, o:{wall:'#f6eee0',wallS:'#dcd0bc',beam:'#6b4424',roof:'#4f8a8a',roofS:'#366a6a',roofL:'#72b0b0',door:'#6b4424',chimney:true}},
  {tex:'bld-home1', x:50,y:56,w:4}, {tex:'bld-home3', x:74,y:56,w:4},
  {tex:'bld-home2', x:12,y:72,w:4}, {tex:'bld-home3', x:24,y:74,w:4}, {tex:'bld-home1', x:56,y:72,w:4}, {tex:'bld-home2', x:68,y:74,w:4},
];
SIGNS.crate=(c,x,y)=>{ px(c,x+3,y+3,'#b8844e',14,12); px(c,x+3,y+3,'#8a5a2b',14,2); px(c,x+3,y+9,'#8a5a2b',14,1); px(c,x+9,y+3,'#8a5a2b',2,12); };
Object.assign(HERO_OUTFIT,{
  priest:{ top:'#f4efe2', topS:'#d9d0bc', topD:'#b8ae98', sleeve:'#f4efe2', belt:'#e8c170', buckle:'#4f8fe6', pants:'#e8e0cc', pantsS:'#cfc5ad', boots:'#8a7a60', bootsS:'#6a5a44', robe:true, trim:'#e8c170', circlet:'#e8c170', gem:'#4f8fe6', hairOverride:['#e8c170','#c49a48','#f5dc98','#fff0c0'], weapon:'none' },
  clerk:{ top:'#2f5a8a', topS:'#1e3a66', topD:'#142a4a', sleeve:'#f4efe2', belt:'#e2b44a', buckle:'#e2b44a', pants:'#2a3a5a', pantsS:'#1c2a44', boots:'#3a2616', bootsS:'#24180e', beret:'#2f5a8a', beretS:'#1e3a66', hairOverride:['#8a3a2a','#6a2818','#b8543a','#d87a5a'], weapon:'none' },
  buyer:{ top:'#8a5a2b', topS:'#6b4424', topD:'#4a2f1a', sleeve:'#e8dcc0', belt:'#3a2616', buckle:'#e2b44a', pants:'#5a4636', pantsS:'#46362a', boots:'#3a2616', bootsS:'#24180e', band:'#e2b44a', hairOverride:['#3a3432','#221e1c','#5a5452','#7a7472'], weapon:'none' },
  knight:Object.assign({},HERO_OUTFIT.Swordman,{ cape:'#2f5a8a', capeS:'#1e3a66', beret:'#c7d0da', beretS:'#8f9aa8', hairOverride:['#e8c170','#c49a48','#f5dc98','#fff0c0'] }),
});
TOWN_STATIC.push('priest','clerk','buyer','knight');
function genCapitalTextures(s){
  if(s.textures.exists('castle')) return;
  hdTry(s,'castle')||canvasTex(s,'castle',448,330,c=>{ const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
    const stone=(x,y,w,h,base,dark,light)=>{ r(x,y,w,h,base); for(let yy=y;yy<y+h;yy+=10){ r(x,yy,w,1,dark); for(let xx=x+((yy/10)%2?12:0);xx<x+w;xx+=24) r(xx,yy,1,10,dark); } r(x,y,w,2,light); };
    const crenel=(x,y,w,col,colL)=>{ for(let xx=x;xx<x+w-8;xx+=16){ r(xx,y-10,10,10,col); r(xx,y-10,10,2,colL); } };
    const cone=(cx,top,bot,w0,w1,col,colS)=>{ for(let y=top;y<bot;y++){ const w=Math.round(w0+(w1-w0)*(y-top)/(bot-top)); r(cx-w/2,y,w,1,(y-top)%6?col:colS); } };
    const flag=(x,y,col)=>{ r(x,y,2,22,'#3a2616'); r(x+2,y,16,10,col); r(x+2,y+8,16,2,'#00000033'); };
    // keep
    stone(120,70,208,150,'#c9c2b5','#9a9388','#e2dccf'); crenel(120,70,208,'#c9c2b5','#e2dccf');
    cone(224,6,70,10,120,'#4f6fa8','#34507e'); flag(222,-14+14,'#e2524a');
    [[150,110],[200,110],[250,110],[284,110],[150,160],[284,160]].forEach(([x,y])=>{ r(x,y,18,28,'#2a2a34'); r(x+2,y+2,14,24,'#ffd27a'); r(x+8,y+2,2,24,'#2a2a34'); r(x,y-4,18,4,'#9a9388'); });
    disc(c,224,124,20,'#9a9388'); disc(c,224,124,17,'#6fb6ff'); [[-8,-8,'#e2524a'],[8,-8,'#ffd84a'],[-8,8,'#8fd46b'],[8,8,'#b98cff']].forEach(([dx,dy,col])=>disc(c,224+dx,124+dy,6,col)); r(222,106,4,36,'#9a9388'); r(206,122,36,4,'#9a9388');
    // side towers
    [[40,'#c2bbaf'],[408,'#c2bbaf']].forEach(([cx])=>{ stone(cx-38,80,76,250,'#bdb6a9','#908a7e','#d9d3c6'); cone(cx,14,84,8,96,'#4f6fa8','#34507e'); flag(cx-2,-6+10,'#e2b44a');
      [[cx-10,120],[cx-10,180],[cx-10,240]].forEach(([x,y])=>{ r(x,y,20,26,'#2a2a34'); r(x+3,y+3,14,20,'#ffd27a'); }); });
    // curtain wall + gate
    stone(78,200,292,130,'#c9c2b5','#9a9388','#e2dccf'); crenel(78,200,292,'#c9c2b5','#e2dccf');
    r(190,236,68,94,'#6f695f'); for(let y=236;y<250;y++){ const w=Math.round(68*Math.sqrt(1-((250-y)/14)**2)); r(224-w/2,y-14,w,1,'#6f695f'); }
    r(198,244,52,86,'#1c1a2a'); for(let x=200;x<250;x+=8) r(x,244,2,60,'#5a5452'); for(let y=250;y<304;y+=10) r(198,y,52,2,'#5a5452');
    [[110,'#c8342c'],[322,'#c8342c'],[150,'#2f5a8a'],[282,'#2f5a8a']].forEach(([x,col])=>{ r(x,212,20,56,col); r(x,212,20,4,'#e2b44a'); r(x+6,230,8,10,'#e2b44a'); for(let i=0;i<3;i++) r(x+i*7,268,6,6,col); });
    outline(c,448,330,'#2a2620'); });
  hdTry(s,'cathedral')||canvasTex(s,'cathedral',240,250,c=>{ const r=(x,y,w,h,col)=>px(c,x,y,col,w,h);
    r(40,100,160,146,'#e8e2d6'); r(160,100,40,146,'#cfc8ba'); for(let y=106;y<246;y+=12){ r(40,y,160,1,'#c2bbaf'); }
    for(let y=40;y<104;y++){ const w=Math.round(20+(y-40)*2.6); r(120-w/2,y,w,1,(y%6)?'#4f6fa8':'#34507e'); }
    [[20,'#d9d3c6'],[196,'#d9d3c6']].forEach(([x])=>{ r(x,70,34,176,'#d9d3c6'); r(x+24,70,10,176,'#bdb6a9'); for(let y=0;y<70;y++){ const w=Math.round(2+y*0.5); r(x+17-w/2,y,w,1,(y%5)?'#4f6fa8':'#34507e'); } r(x+15,-2,4,8,'#e2b44a'); r(x+11,2,12,3,'#e2b44a'); });
    disc(c,120,136,26,'#b8a98c'); disc(c,120,136,23,'#2f5a8a'); for(let a=0;a<12;a++){ const t=a/12*Math.PI*2; disc(c,120+Math.cos(t)*14,136+Math.sin(t)*14,5,['#e2524a','#ffd84a','#8fd46b','#6fb6ff'][a%4]); } disc(c,120,136,7,'#fff4c0');
    r(96,176,48,70,'#6b4424'); for(let y=176;y<190;y++){ const w=Math.round(48*Math.sqrt(1-((190-y)/14)**2)); r(120-w/2,y-14,w,1,'#6b4424'); } r(119,176,2,70,'#3a2616'); r(128,212,4,4,'#e2b44a'); r(112,212,4,4,'#e2b44a');
    [[54,150],[164,150]].forEach(([x,y])=>{ r(x,y,22,50,'#2f5a8a'); r(x+2,y+2,18,46,'#6fb6ff'); r(x+10,y+2,2,46,'#2f5a8a'); r(x+2,y+22,18,2,'#2f5a8a'); disc(c,x+11,y,11,'#2f5a8a',8); disc(c,x+11,y+1,9,'#ffd84a',6); });
    r(117,20,6,26,'#e2b44a'); r(110,28,20,5,'#e2b44a');
    outline(c,240,250,'#2a2620'); });
  hdTry(s,'statue')||canvasTex(s,'statue',52,92,c=>{ const r=(x,y,w,h,col)=>px(c,x,y,col,w,h); r(6,64,40,26,'#9a9388'); r(6,64,40,3,'#c2bbaf'); r(10,58,32,8,'#b3ac9f');
    disc(c,26,16,8,'#c9c2b5'); r(18,24,16,24,'#c9c2b5'); r(14,26,6,18,'#b3ac9f'); r(32,20,4,30,'#b3ac9f'); r(34,2,3,24,'#dcd6ca'); r(29,22,12,3,'#b3ac9f'); r(20,48,5,12,'#b3ac9f'); r(28,48,5,12,'#b3ac9f'); r(14,72,24,10,'#e2b44a'); r(16,74,20,6,'#b8862a');
    outline(c,52,92,'#3a3530'); });
  hdTry(s,'hedge')||canvasTex(s,'hedge',34,28,c=>{ disc(c,17,16,16,'#3f8f47',11); disc(c,14,13,12,'#52a557',8); for(let i=0;i<14;i++) px(c,irnd(4,30),irnd(6,24),i%2?'#6cc15a':'#2f7a3c',2,2); outline(c,34,28,'#1e4a25'); });
  hdTry(s,'board')||canvasTex(s,'board',46,54,c=>{ px(c,8,20,'#5a3b1e',4,34); px(c,34,20,'#5a3b1e',4,34); px(c,2,4,'#8a5a2b',42,24); px(c,4,6,'#e8d4a0',38,20); [[7,9],[20,8],[29,12],[9,17]].forEach(([x,y],i)=>{ px(c,x,y,['#fff6e0','#ffe0e0','#e0f0ff','#fff6e0'][i],10,8); px(c,x+2,y+2,'#8a7a60',6,1); px(c,x+2,y+4,'#8a7a60',5,1); px(c,x+4,y,'#e2524a',2,2); }); outline(c,46,54,'#2a1a10'); });
  hdTry(s,'crates')||canvasTex(s,'crates',40,34,c=>{ [[2,12,20],[18,14,18],[10,0,16]].forEach(([x,y,w])=>{ px(c,x,y,'#b8844e',w,w-2); px(c,x,y,'#8a5a2b',w,2); px(c,x,y+w-4,'#8a5a2b',w,2); px(c,x+w/2-1,y,'#8a5a2b',2,w-2); }); outline(c,40,34,'#2a1a10'); });
  hdTry(s,'stall2')||sheetTex(s,'stall2',76,66,1,(c,i,ox)=>{ const r=(x,y,w,h,col)=>px(c,ox+x,y,col,w,h); r(8,36,60,26,'#8a5a2b'); r(8,36,60,3,'#b8844e'); r(10,12,4,26,'#6b4424'); r(62,12,4,26,'#6b4424');
    for(let x=2;x<74;x+=8){ r(x,4,8,16,((x/8)|0)%2?'#f4efe2':'#4f8fe6'); } r(2,18,72,3,'#2c55b0'); [[14,'#e2b44a'],[26,'#9aa7b3'],[38,'#8a5a2b'],[50,'#b98cff']].forEach(([x,col])=>r(x,28,8,8,col)); },'#2a1a10');
  hdTry(s,'stall3')||sheetTex(s,'stall3',76,66,1,(c,i,ox)=>{ const r=(x,y,w,h,col)=>px(c,ox+x,y,col,w,h); r(8,36,60,26,'#8a5a2b'); r(8,36,60,3,'#b8844e'); r(10,12,4,26,'#6b4424'); r(62,12,4,26,'#6b4424');
    for(let x=2;x<74;x+=8){ r(x,4,8,16,((x/8)|0)%2?'#f4efe2':'#5d9e46'); } r(2,18,72,3,'#3f7a33'); [[14,'#ff8a3d'],[24,'#ffd84a'],[34,'#e2524a'],[44,'#8fd46b'],[54,'#ffb6d0']].forEach(([x,col])=>disc(c,ox+x+3,32,4,col)); },'#2a1a10');
}
function buildTownGrid(M){
  srng=mulberry32(M.seed);
  for(let y=0;y<H;y++){ grid[y]=[]; for(let x=0;x<W;x++) grid[y][x]={t:'grass',b:false,v:sr(0,2)}; }
  for(let x=0;x<W;x++){ pathRow[x]=41; for(let y=40;y<=43;y++) grid[y][x].t='cobble'; }
  for(let y=16;y<H-1;y++) for(let x=38;x<=42;x++) grid[y][x].t='cobble';
  for(let y=-10;y<=10;y++)for(let x=-10;x<=10;x++) if(x*x+y*y<=90) grid[42+y][40+x].t='plaza';
  for(let y=16;y<=21;y++) for(let x=32;x<=48;x++) grid[y][x].t='plaza'; // castle courtyard
  // canal with three stone bridges
  for(let x=1;x<W-1;x++) for(let y=60;y<=62;y++){ const br=(x>=38&&x<=42)||(x>=19&&x<=21)||(x>=59&&x<=61); grid[y][x].t=br?'sbridge':'water'; grid[y][x].b=!br; }
  [[20,56,59],[60,56,59],[20,63,66],[60,63,66]].forEach(([x,y0,y1])=>{ for(let y=y0;y<=y1;y++) for(let dx=-1;dx<=1;dx++) grid[y][x+dx].t='cobble'; });
  // paved lanes from each door to the avenue (done before the ground is rendered)
  BUILDINGS.concat([{x:60,y:26},{x:31,y:22}]).forEach(b=>{ if(b.y<40){ for(let y=b.y+1;y<40;y++){ const g=grid[y][b.x]; if(g.t==='grass') g.t='cobble'; } }
    else if(b.y<60){ for(let y=b.y+1;y<=b.y+2;y++){ const g=grid[y]&&grid[y][b.x]; if(g&&g.t==='grass') g.t='cobble'; } } });
}
function buildTown(sc,addTree){
  const put=(key,cx,by,w,h,tt='bld')=>{ for(let y=by-h+1;y<=by;y++)for(let x=cx-Math.floor(w/2);x<=cx+Math.floor((w-1)/2);x++){ if(grid[y]&&grid[y][x]){ grid[y][x].b=true; if(tt) grid[y][x].t=tt; } } if(w>=2) archShadow(sc,cx*T+16,by*T+26,w*T); return sc.add.image(cx*T+16,by*T+31,key).setOrigin(.5,1).setDepth(by*T+31); };
  // castle & courtyard
  put('castle',40,15,14,4); [[35,19],[45,19]].forEach(([x,y])=>put('statue',x,y,1,1,null));
  for(let x=30;x<=50;x+=2){ if(x>=36&&x<=44) continue; put('hedge',x,22,1,1,null); }
  // fountain with sparkles
  const fx=40, fy=43; put('fountain',fx,fy,3,2,null);
  sc.time.addEvent({delay:140,loop:true,callback:()=>{ const s=sc.add.image(fx*T+16+rnd(-10,10),fy*T-20,'spark').setDepth(fy*T+32).setTint(0xbfeaff).setBlendMode(Phaser.BlendModes.ADD);
    sc.tweens.add({targets:s,x:s.x+rnd(-26,26),y:s.y+rnd(18,34),alpha:0,duration:rnd(600,900),ease:'Quad.In',onComplete:()=>s.destroy()}); }});
  BUILDINGS.forEach(b=>put(b.tex,b.x,b.y,b.w,3));
  put('cathedral',60,26,7,3); put('tower-mage',31,22,3,3); put('belltower',48,31,3,3);
  // cathedral garden
  for(let x=52;x<=68;x+=2){ if(Math.abs(x-60)<=1) continue; put('hedge',x,30,1,1,null); } for(let i=0;i<40;i++){ const x=sr(52,68),y=sr(27,29); if(free(x,y)){ const fy=y*T+irnd(8,30); const f=sc.add.image(x*T+irnd(4,28),fy,'flower'+irnd(0,3)).setOrigin(.5,1).setDepth(fy); f.ph=Math.random()*6.28; swayers.push(f); } }
  // market street (west of the plaza)
  const stalls=['stall','stall2','stall3']; let si=0;
  for(let x=13;x<=29;x+=4){ put(stalls[si++%3],x,38,2,1,null); put(stalls[si++%3],x,46,2,1,null); }
  put('board',46,37,1,1,null).setInteractive({useHandCursor:true}).setData('kind','board');
  put('crates',71,51,1,1,null); put('crates',61,51,1,1,null);
  [[33,36],[47,48],[33,48],[26,62],[54,64]].forEach(([x,y])=>{ if(!grid[y][x].b) sc.add.image(x*T+16,y*T+26,'bench').setOrigin(.5,1).setDepth(y*T+26); });
  // lamps along both avenues
  const lamp=(x,y)=>{ if(grid[y][x].b||grid[y][x].t==='water') return; grid[y][x].b=true; sc.add.image(x*T+16,y*T+31,'lamp').setOrigin(.5,1).setDepth(y*T+31); sc.add.image(x*T+16,y*T-18,'lampglow').setDepth(49000).setBlendMode(Phaser.BlendModes.ADD).setAlpha(.55); };
  for(let x=4;x<W-3;x+=7){ if(Math.abs(x-40)>11){ lamp(x,39); lamp(x,44); } }
  for(let y=24;y<H-3;y+=7){ if(Math.abs(y-42)>11&&(y<58||y>64)){ lamp(37,y); lamp(43,y); } }
  for(let i=0;i<24;i++){ const x=sr(3,W-4), y=sr(3,H-4); if(!grid[y][x].b&&grid[y][x].t==='grass'&&Math.abs(x-40)>4&&Math.abs(y-41.5)>4){ grid[y][x].b=true; sc.add.image(x*T+16,y*T+28,'planter').setOrigin(.5,1).setDepth(y*T+28); } }
  // bridge railings over the canal
  [[19,21],[38,42],[59,61]].forEach(([x0,x1])=>{ for(let y=60;y<=62;y++){ [x0-1,x1+1].forEach(x=>sc.add.image(x*T+16,y*T+32,'rail').setOrigin(.5,1).setDepth(y*T+32).setScale(.35*hsOf('rail'),1.4*hsOf('rail'))); } });
  // city wall with gates
  for(let x=0;x<W;x++)for(let y=0;y<H;y++){ const edge=x===0||y===0||x===W-1||y===H-1; if(!edge) continue; if((x===0||x===W-1)&&y>=39&&y<=44) continue; if(y===H-1&&x>=37&&x<=43) continue;
    grid[y][x].b=true; grid[y][x].t='bld'; sc.add.image(x*T+16,y*T+32,'wall').setOrigin(.5,1).setDepth(y*T+32); }
  for(let x=37;x<=43;x++){ grid[H-2][x].b=true; } // south gate closed for now
  // parks: trees & flowers in quiet areas
  for(let i=0;i<140;i++){ const x=sr(2,W-3), y=sr(2,H-3); if(grid[y][x].t!=='grass'||Math.abs(x-40)<=4||Math.abs(y-41.5)<=4) continue; if(y>=63||x<8||x>72||y<10) addTree(x,y); else if(Math.random()<.25) addTree(x,y); }
  for(let i=0;i<260;i++){ const x=sr(2,W-3),y=sr(2,H-3); if(!free(x,y)) continue; const fy=y*T+irnd(8,30); const f=sc.add.image(x*T+irnd(4,28),fy,i%4===0?'tuft':'flower'+irnd(0,3)).setOrigin(.5,1).setDepth(fy); f.ph=Math.random()*6.28; swayers.push(f); }
  // NPCs
  const shopFor=(kind)=>()=>openShopKind(kind);
  makeTownNpc('smith',54,39,'ช่างตีเหล็ก Brann',shopFor('weapon'));
  makeTownNpc('merchant',62,39,'พ่อค้าชุดเกราะ Oda',shopFor('armor'));
  makeTownNpc('merchant',70,39,'ร้านของใช้ Mimi',shopFor('tool'));
  makeTownNpc('inn',56,51,'เจ้าของโรงเตี๊ยม Rosa',openInn);
  makeTownNpc('clerk',66,52,'เจ้าหน้าที่คลังสินค้า Lena',()=>openStorage());
  makeTownNpc('priest',62,28,'นักบวช Seraphine',openChurch);
  makeTownNpc('buyer',21,43,'พ่อค้ารับซื้อ Tomas',openBuyer);
  makeTownNpc('mS',14,25,'ปรมาจารย์ดาบ Garrick',()=>guildTalk('Swordman'));
  makeTownNpc('mA',23,25,'หัวหน้าพรานป่า Lyra',()=>guildTalk('Archer'));
  makeTownNpc('mM',31,23,'จอมเวท Elowen',()=>guildTalk('Mage'));
  const say=(name,line)=>()=>npcSay(townNpcs.find(n=>n.name===name).ent,line);
  makeTownNpc('knight',37,17,'อัศวินหลวง Cedric',say('อัศวินหลวง Cedric','ปราสาท Everhaven ยังไม่เปิดให้ประชาชนเข้า เมื่อเจ้าแข็งแกร่งพอ พระราชาอาจเรียกพบ'));
  makeTownNpc('guard',43,17,'ทหารองครักษ์',say('ทหารองครักษ์','หยุดตรงนั้น! ที่นี่เขตพระราชวัง'));
  makeTownNpc('guard',W-3,39,'ทหารยามประตูตะวันออก',say('ทหารยามประตูตะวันออก','ประตูนี้ไปทุ่ง Everhaven ระวังตัวด้วย'));
  makeTownNpc('guard',2,39,'ทหารยามท่าเรือ',say('ทหารยามท่าเรือ','ทางไปท่าเรือยังปิดซ่อมอยู่ เร็ว ๆ นี้จะเปิด'));
  makeTownNpc('guard',36,H-3,'ทหารยามประตูใต้',say('ทหารยามประตูใต้','ถนนสายใต้ยังไม่ปลอดภัย รอประกาศจากปราสาท'));
  for(let i=0;i<12;i++){ let x,y; for(let k=0;k<60;k++){ x=sr(4,W-5); y=sr(4,H-5); const g=grid[y][x]; if(!g.b&&(g.t==='cobble'||g.t==='plaza')) break; } makeWalker('npc-'+TOWN_WALKERS[i%2],x,y); }
  [[53,39],[65,52],[9,55],[45,40],[29,47]].forEach(([x,y])=>{ if(grid[y][x].b) return; const c=sc.add.sprite(x*T+irnd(8,24),y*T+28,'cat').setOrigin(.5,1).setDepth(y*T+28).play({key:'cat-idle',startFrame:irnd(0,1)}); c.setFlipX(Math.random()<.5); critters.push({spr:c,kind:'cat'}); });
  for(let i=0;i<10;i++){ const x=36*T+rnd(0,8*T), y=34*T+rnd(0,3*T); const b=sc.add.sprite(x,y,'pigeon').setDepth(y).play({key:'pigeon-idle',startFrame:irnd(0,1)}); b.setFlipX(Math.random()<.5); critters.push({spr:b,kind:'bird',home:[x,y],away:false}); }
}
/* ---------- city services: storage, church blessing, buyer, notice board ---------- */
const STORE_MAX=100;
let storeSel=null, storeSide='bag';
function openStorage(){ closeWin('dialog'); $('storeWin').classList.remove('hidden'); renderStorage(); }
function renderStorage(){
  P.storage=P.storage||{};
  const cell=(id,n,side)=>`<button class="bt r-${itemRar(id)} ${storeSel===id&&storeSide===side?'sel':''}" data-sid="${id}" data-side="${side}" title="${ITEMS[id].name}"><img alt="" src="${ICONS[id]}"><span class="q">${n}</span></button>`;
  const fill=(arr)=>{ const n=Math.max(25,Math.ceil(arr.length/5)*5); let h=arr.join(''); for(let i=arr.length;i<n;i++) h+='<span class="bt empty"></span>'; return h; };
  const bag=Object.keys(P.inv).filter(k=>P.inv[k]>0&&ITEMS[k]).map(id=>cell(id,P.inv[id],'bag'));
  const st=Object.keys(P.storage).filter(k=>P.storage[k]>0&&ITEMS[k]).map(id=>cell(id,P.storage[id],'store'));
  $('stBag').innerHTML=fill(bag); $('stStore').innerHTML=fill(st);
  $('stCount').textContent=`${st.length} / ${STORE_MAX} ชนิด`;
  const d=$('stAct');
  if(!storeSel){ d.innerHTML='<span class="none">แตะไอเทมในกระเป๋าเพื่อฝาก หรือแตะไอเทมในคลังเพื่อถอน</span>'; return; }
  const it=ITEMS[storeSel], n=storeSide==='bag'?(P.inv[storeSel]||0):(P.storage[storeSel]||0), verb=storeSide==='bag'?'ฝาก':'ถอน';
  d.innerHTML=`<img alt="" src="${ICONS[storeSel]}"><b>${it.name}</b><small>${storeSide==='bag'?'ในกระเป๋า':'ในคลัง'} ${n} ชิ้น</small><span class="sp"></span>
    <button class="btn" data-mv="1">${verb} 1</button>${n>=10?`<button class="btn" data-mv="10">${verb} 10</button>`:''}<button class="btn" data-mv="all">${verb}ทั้งหมด</button>`;
}
function storeMove(q){
  const from=storeSide==='bag'?P.inv:P.storage, to=storeSide==='bag'?P.storage:P.inv, id=storeSel; if(!id||!from[id]) return;
  if(storeSide==='bag'&&!P.storage[id]&&Object.keys(P.storage).filter(k=>P.storage[k]>0).length>=STORE_MAX){ toast('คลังเต็มแล้ว'); return; }
  if(storeSide==='store'){ const n0=q==='all'?from[id]:Math.min(q,from[id]); if(weightNow()+itemWeight(id)*n0>weightMax()){ toast('กระเป๋าหนักเกินไป'); return; } }
  const n=q==='all'?from[id]:Math.min(q,from[id]); from[id]-=n; if(from[id]<=0) delete from[id];
  if(storeSide==='store') addInv(id,n); else to[id]=(to[id]||0)+n;
  sfx('pickup'); logMsg(`${storeSide==='bag'?'ฝาก':'ถอน'} ${ITEMS[id].name} ${n} ชิ้น`,'drop'); if(!from[id]) storeSel=null; persist(); refreshUI(); renderStorage();
}
function wireStorage(){
  const w=$('storeWin');
  w.addEventListener('click',e=>{ const b=e.target.closest('[data-sid]'); if(b){ storeSel=b.dataset.sid; storeSide=b.dataset.side; renderStorage(); return; }
    const m=e.target.closest('[data-mv]'); if(m) storeMove(m.dataset.mv==='all'?'all':+m.dataset.mv); });
  w.addEventListener('dblclick',e=>{ const b=e.target.closest('[data-sid]'); if(!b) return; storeSel=b.dataset.sid; storeSide=b.dataset.side; storeMove('all'); });
}
function buffActive(){ return P.buff&&P.buff.until>Date.now(); }
function openChurch(){
  const cost=P.job==='Novice'?0:100;
  openDialog('นักบวช Seraphine',`ขอให้แสงศักดิ์สิทธิ์คุ้มครองเจ้า รับพรทุกสเตตัส +2 เป็นเวลา 10 นาที ${cost?`(บริจาค ${cost} Sol)`:'(ฟรีสำหรับนักผจญภัยมือใหม่)'}`,[
    ['รับพร',()=>{ if(P.sol<cost){ $('dlgText').textContent='ไม่เป็นไร กลับมาเมื่อพร้อมนะ'; return; } P.sol-=cost; P.buff={name:'พรแห่งแสง',amt:2,until:Date.now()+10*60*1000};
      sfx('level'); fxBurst(hero,0xfff3b0,1.6,true); logMsg('ได้รับพรแห่งแสง ทุกสเตตัส +2 (10 นาที)','sys'); persist(); refreshUI(); closeWin('dialog'); }],
    ['ฟื้นฟู HP/SP',()=>{ const d=derived(); P.hp=d.maxHP; P.sp=d.maxSP; sfx('heal'); floatText(hero.pos.x,hero.pos.y-68,'FULL','heal'); refreshUI(); closeWin('dialog'); }],
    ['ปิด',()=>closeWin('dialog')]]);
}
function openBuyer(){
  const sellWhere=(pred,label)=>()=>{ let sum=0,cnt=0; Object.keys(P.inv).forEach(id=>{ const it=ITEMS[id]; if(it&&pred(id,it)){ sum+=it.sell*P.inv[id]; cnt+=P.inv[id]; delete P.inv[id]; } });
    if(!cnt){ $('dlgText').textContent=`ไม่มี${label}ให้ขาย`; return; } P.sol+=sum; sfx('pickup'); logMsg(`ขาย${label} ${cnt} ชิ้น ได้ ${sum.toLocaleString()} Sol`,'drop'); persist(); refreshUI(); $('dlgText').textContent=`รับซื้อ ${cnt} ชิ้น เป็นเงิน ${sum.toLocaleString()} Sol`; };
  openDialog('พ่อค้ารับซื้อ Tomas','ข้ารับซื้อทุกอย่าง ราคายุติธรรม!',[
    ['ขายของดรอปทั้งหมด',sellWhere((id,it)=>it.type==='etc','ของดรอป')],
    ['ขายอุปกรณ์ระดับธรรมดา',sellWhere((id,it)=>it.type==='equip'&&it.r==='c'&&!STARTER_IDS.includes(id),'อุปกรณ์ระดับธรรมดา')],
    ['ปิด',()=>closeWin('dialog')]]);
}
const STARTER_IDS=['shortsword','shortbow','woodstaff','cottonshirt'];
function openBoard(){
  openDialog('กระดานประกาศเมืองหลวง','• King Jellop ปรากฏที่สะพานหิน Fields 02 ทุก 1.5–2 นาที\n• ร้านค้าย่านตะวันออก: อาวุธ ชุดเกราะ ของใช้\n• คลังสินค้าอยู่ข้างโรงเตี๊ยม ฝากของได้ 100 ชนิด\n• นักบวชที่โบสถ์ให้พรทุกสเตตัส +2 เป็นเวลา 10 นาที\n• ประกาศ: ท่าเรือและถนนสายใต้จะเปิดเร็ว ๆ นี้',[['ปิด',()=>closeWin('dialog')]]);
}

function makeTownNpc(k,x,y,name,onTalk){
  grid[y][x].b=true; const e=makeEnt('npc-'+k,x,y); e.spr.play('npc-'+k+'-idle');
  const ref={ent:e,name,onTalk}; e.spr.setInteractive({useHandCursor:true}).setData('kind','npc2').setData('ref',ref);
  ref.label=nameTag(name,'#ffe9a6'); townNpcs.push(ref); return ref;
}
function makeWalker(tex,x,y){ const e=makeEnt(tex,x,y); Object.assign(e,{speed:430,tex,next:0}); e.spr.setInteractive({useHandCursor:true}).setData('kind','folk').setData('ref',e); walkers.push(e); }
function npcSay(ent,txt){
  if(ent.bubble) ent.bubble.destroy();
  const b=S.add.text(ent.pos.x,ent.pos.y-70,txt,{fontFamily:'Chakra Petch',fontSize:'11px',color:'#3a2816',backgroundColor:'#fffbef',padding:{x:5,y:3},resolution:TXT_RES,wordWrap:{width:170},align:'center'}).setOrigin(.5,1).setDepth(62000);
  ent.bubble=b; const ev=S.time.addEvent({delay:16,loop:true,callback:()=>b.setPosition(ent.pos.x,ent.pos.y-70)});
  S.time.delayedCall(4200,()=>{ ev.remove(); if(ent.bubble===b) ent.bubble=null; b.destroy(); });
}
function updateTown(t){
  if(!MAP.town) return;
  townNpcs.forEach(n=>{ syncEnt(n.ent,0); n.label.setPosition(n.ent.spr.x,n.ent.spr.y+4); });
  walkers.forEach(w=>{
    if(!w.moving&&t>w.next){ w.next=t+rnd(1500,5000); for(let i=0;i<6;i++){ const x=w.tx+irnd(-9,9), y=w.ty+irnd(-9,9); if(blocked(x,y)) continue; const g=grid[y][x]; if(g.t!=='cobble'&&g.t!=='plaza') continue; const p=findPath(w.tx,w.ty,x,y,0,700); if(p&&p.length){ walk(w,p); break; } } }
    syncEnt(w,0); const f=w.facing, dir=f.dx!==0?'side':(f.dy<0?'up':'down'); w.spr.setFlipX(f.dx<0); w.spr.play(`${w.tex}-${dir}-${w.moving?'walk':'idle'}`,true); });
  critters.forEach(c=>{ if(c.kind!=='bird') return; const s=c.spr;
    if(!c.away&&Math.hypot(hero.pos.x-s.x,hero.pos.y-s.y)<70){ c.away=true; s.stop(); s.setFrame(1); const dx=rnd(-1,1)>0?1:-1;
      S.tweens.add({targets:s,x:s.x+dx*rnd(120,220),y:s.y-rnd(160,240),alpha:0,duration:900,ease:'Quad.In',onComplete:()=>{ S.time.delayedCall(rnd(5000,9000),()=>{ s.setPosition(c.home[0],c.home[1]-60); s.play('pigeon-idle'); S.tweens.add({targets:s,y:c.home[1],alpha:1,duration:700,onComplete:()=>c.away=false}); }); }}); } });
}
function openInn(){
  const cost=P.job==='Novice'?0:50;
  openDialog('เจ้าของโรงเตี๊ยม Rosa',`พักผ่อนสักคืนไหม ฟื้นฟู HP/SP เต็ม ${cost?`ราคา ${cost} Sol`:'ฟรีสำหรับนักผจญภัยมือใหม่'}`,[
    ['พักผ่อน',()=>{ if(P.sol<cost){ $('dlgText').textContent='เงินไม่พอนะจ๊ะ'; return; } P.sol-=cost; const d=derived(); P.hp=d.maxHP; P.sp=d.maxSP; S.cameras.main.fadeOut(300,10,16,34); S.time.delayedCall(700,()=>S.cameras.main.fadeIn(500,10,16,34)); sfx('heal'); refreshUI(); persist(); closeWin('dialog'); logMsg('พักผ่อนที่โรงเตี๊ยม ฟื้นฟู HP/SP เต็ม','sys'); }],
    ['ไม่เป็นไร',()=>closeWin('dialog')]]);
}
function guildTalk(job){
  const master={Swordman:'ปรมาจารย์ดาบ Garrick',Archer:'หัวหน้าพรานป่า Lyra',Mage:'จอมเวท Elowen'}[job];
  if(P.job===job){ openDialog(master,`ฝึกฝนต่อไป ${P.name} เมื่อถึง Job Lv 40 กลับมาหาข้า จะมีเส้นทางคลาส 2 รอเจ้าอยู่`,[['รับทราบ',()=>closeWin('dialog')]]); return; }
  if(P.job!=='Novice'){ openDialog(master,`เจ้าเลือกเส้นทาง ${P.job} ไปแล้ว ขอให้โชคดี`,[['ขอบคุณ',()=>closeWin('dialog')]]); return; }
  if(!canJobChange()){ openDialog(master,`อยากเป็น ${job} งั้นหรือ ต้องมี Job Lv 10 และ Basic Skill Lv 9 ก่อน (ตอนนี้ Job Lv ${P.jlv}, Basic Skill Lv ${skLv('basic')})`,[['รับทราบ',()=>closeWin('dialog')]]); return; }
  openDialog(master,`เจ้าพร้อมแล้วที่จะเป็น ${job} หรือไม่`,[['พร้อมแล้ว',()=>jobChange(job)],['ขอคิดดูก่อน',()=>closeWin('dialog')]]);
}

function resetWorld(){
  townNpcs.length=0; walkers.length=0; critters.length=0;
  mobs.length=0; items.length=0; canopies.length=0; swayers.length=0; flies.length=0; clouds.length=0; PORTALS.length=0;
  for(const k in hero) delete hero[k];
  target=null; pending=null; pendingSkill=null; blades=null; transitioning=false;
  bot.wp=null; bot.ignore.clear(); bot.resting=false; bot.anchor=null;
}
let transitioning=false;
function changeMap(id,arrive){
  if(transitioning||!MAPS[id]) return; transitioning=true; P.map=id; P.arrive=arrive; persist(); sfx('warp');
  S.cameras.main.fadeOut(280,10,16,34); S.time.delayedCall(300,()=>S.scene.restart());
}
function warpToSave(){ if(!P.save||P.save.map===P.map){ const sv=P.save||{x:hero.tx,y:hero.ty}; warpTo(sv.x,sv.y); } else changeMap(P.save.map,'save'); }
function nearFree(x,y){ if(!blocked(x,y)) return [x,y]; for(let r=1;r<6;r++) for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){ if(!blocked(x+dx,y+dy)) return [x+dx,y+dy]; } return [x,y]; }
class Field extends Phaser.Scene{
  constructor(){ super('field'); }
  create(){
    S=this; resetWorld();
    if(!MAPS[P.map]) P.map='f01'; MAP=MAPS[P.map];
    const CM=(MAP.town&&CUSTOM_MAPS.town)||null; window.__CM=CM;
    W=CM?CM.json.cols:(MAP.w||60); H=CM?CM.json.rows:(MAP.h||60);
    generateTextures(this); createAnims(this); genTownTextures(this); genCapitalTextures(this); if(CM) buildCustomGrid(CM.json); else if(MAP.town) buildTownGrid(MAP); else buildGrid(MAP);
    this.cameras.main.setBackgroundColor('#2f6b33');
    // ground
    const HV=MAP.theme==='harvest', gk=HV?'gold':'grass';
    if(CM){ if(this.textures.exists('mapCustom')) this.textures.remove('mapCustom'); this.textures.addImage('mapCustom',CM.img); this.textures.get('mapCustom').setFilter(Phaser.Textures.FilterMode.LINEAR);
      this.add.image(0,0,'mapCustom').setOrigin(0).setDepth(0).setScale(T/(CM.json.tilePx||16)); }
    else if(HDW()){ if(this.textures.exists('groundHD')) this.textures.remove('groundHD'); this.textures.addCanvas('groundHD',paintGround(HV)); this.add.image(0,0,'groundHD').setOrigin(0).setDepth(0);
      this.time.addEvent({delay:260,loop:true,callback:()=>{ for(let i=0;i<6;i++){ const x=irnd(0,W-1), y=irnd(0,H-1); if(grid[y][x].t!=='water') continue; const sp=this.add.image(x*T+irnd(4,28),y*T+irnd(4,28),'spark').setDepth(.7).setTint(0xffffff).setAlpha(0).setScale(.7).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({targets:sp,alpha:.9,duration:500,yoyo:true,onComplete:()=>sp.destroy()}); break; } }}); }
    const rt=(HDW()||CM)?null:this.add.renderTexture(0,0,W*T,H*T).setOrigin(0).setDepth(0);
    if(rt){ rt.beginDraw();
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){ const g=grid[y][x]; const k=(g.t==='grass'||g.t==='bld')?gk+g.v:g.t==='water'?gk+'0':(g.t==='path'&&HV?'path2':g.t); rt.batchDraw(k,x*T,y*T); }
    rt.endDraw(); if(MAP.tint!==0xffffff) rt.setTint(MAP.tint); }
    const shore=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){ if(grid[y][x].t!=='water') continue;
      if(!HDW()) this.add.sprite(x*T,y*T,'water',irnd(0,2)).setOrigin(0).setDepth(.5).play({key:'water',startFrame:irnd(0,2)});
      if(MAP.reeds&&srng()<.05) this.add.image(x*T+irnd(4,28),y*T+irnd(6,26),'lily').setDepth(.6);
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ const X=x+dx,Y=y+dy; if(X<0||Y<0||X>=W||Y>=H||grid[Y][X].t==='water') return;
        if(grid[Y][X].t==='grass'||grid[Y][X].t==='path'){ const fx=dx===1?X*T:dx===-1?X*T+29:X*T, fy=dy===1?Y*T:dy===-1?Y*T+29:Y*T; shore.push([fx,fy,dx?3:32,dy?3:32]); } });
    }
    if(!HDW()&&!CM){ const g=this.add.graphics().setDepth(.4); g.fillStyle(HV?0x9c8a3a:0x5b9a45,1); shore.forEach(r=>g.fillRect(r[0],r[1],r[2],r[3])); }
    // stone bridge parapets
    if(MAP.stoneBridge){ for(let x=0;x<W;x++){ let top=-1,bot=-1; for(let y=0;y<H;y++){ if(grid[y][x].t==='sbridge'){ if(top<0) top=y; bot=y; } }
      if(top<0) continue; this.add.image(x*T+16,top*T,'rail').setOrigin(.5,1).setDepth(top*T); this.add.image(x*T+16,(bot+1)*T+10,'rail').setOrigin(.5,1).setDepth((bot+1)*T+10); } }
    // reserve landmark tiles before trees
    const mx=8,my=21; if(MAP.windmill) for(let y=my-2;y<=my;y++)for(let x=mx-1;x<=mx+1;x++) grid[y][x].b=true;
    const sx=2,sy=pathRow[2]-1; if(!CM) grid[sy][sx].b=true;
    const kp=CM?((CM.json.npcs&&CM.json.npcs.keeper)||[CM.json.spawn[0]+1,CM.json.spawn[1]-1]):null;
    const nx=kp?kp[0]:MAP.keeper?MAP.keeper[0]:5, ny=kp?kp[1]:MAP.keeper?MAP.keeper[1]:pathRow[5]-2; grid[ny][nx].b=true;
    const ex=W-4, ey=pathRow[W-4]-1; if(!CM) grid[ey][ex].b=true;
    // ruins around the stone bridge
    if(MAP.ruins){ const bx=MAP.river.cx; let placed=0; for(let i=0;i<60&&placed<7;i++){ const x=bx+irnd(-9,9), y=pathRow[bx]+irnd(-7,8); if(!free(x,y)||nearPath(x,y,1)) continue;
      grid[y][x].b=true; this.add.image(x*T+16,y*T+30,'ruin').setOrigin(.5,1).setDepth(y*T+30).setFlipX(Math.random()<.5); placed++; } }
    // border forest + scattered trees
    const addTree=(x,y)=>{ if(!free(x,y)) return; grid[y][x].b=true; const fy=y*T+30;
      const hdT=!!HD_IMG.trunk; this.add.image(x*T+16,fy+(hdT?3:0),'trunk').setOrigin(.5,1).setDepth(fy);
      const ck=HV?(Math.random()<.55?'canopyAut':Math.random()<.6?'canopyGold':'canopy'):(Math.random()<.32?'canopyBloom':'canopy');
      const cp=this.add.image(x*T+16+(hdT?0:irnd(-2,2)),hdT?fy+3:fy-18,ck).setOrigin(.5,1).setDepth(50000+fy); cp.ay=fy-18; if(hdT&&Math.random()<.5) cp.setFlipX(true); canopies.push(cp); };
    if(CM){ buildCustomTown(this,CM.json); } else if(MAP.town){ buildTown(this,addTree); } else {
    // abandoned farm (Fields 02 harvest theme): barn, fenced field, haystacks, scarecrows
    if(HV){ const put=(key,x,y,w=1,h=1)=>{ for(let yy=y-h+1;yy<=y;yy++)for(let xx=x-Math.floor(w/2);xx<=x+Math.floor((w-1)/2);xx++) if(grid[yy]&&grid[yy][xx]) grid[yy][xx].b=true; const im=this.add.image(x*T+16,y*T+30,key).setOrigin(.5,1).setDepth(y*T+30); return im; };
      const fx0=7, fx1=20, fy0=14, fy1=21;
      put('barn',13,11,3,2);
      for(let x=fx0;x<=fx1;x++){ if(x===13||x===14) continue; if(free(x,fy0)) put('fence',x,fy0); if(free(x,fy1)) put('fence',x,fy1); }
      for(let y=fy0+1;y<fy1;y++){ [fx0,fx1].forEach(x=>{ if(y===17||!free(x,y)) return; put('fence',x,y).setScale(.4*hsOf('fence'),hsOf('fence')).setAngle(0); }); }
      [[10,17],[17,19]].forEach(([x,y])=>{ if(free(x,y)) put('scarecrow',x,y); });
      for(let i=0;i<9;i++){ const x=sr(6,W-7), y=sr(5,H-6); if(free(x,y)&&!nearPath(x,y,1)) put('hay',x,y); }
      for(let y=fy0+1;y<fy1;y++)for(let x=fx0+1;x<fx1;x++){ if(!free(x,y)) continue; for(let k=0;k<3;k++){ const wy=y*T+irnd(10,30); const w=this.add.image(x*T+irnd(4,28),wy,'wheat').setOrigin(.5,1).setDepth(wy); w.ph=Math.random()*6.28; swayers.push(w); } }
    }
    for(let x=0;x<W;x++)for(let y=0;y<H;y++){ const edge=x<2||y<2||x>=W-2||y>=H-2; if(!edge) continue;
      if((x<2||x>=W-2) && Math.abs(y-pathRow[x<2?0:W-1]-0.5)<2.5) continue; if(srng()<.8) addTree(x,y); }
    for(let i=0;i<MAP.clusters;i++){ const cx=sr(6,W-7), cy=sr(5,H-6); if(nearPath(cx,cy,2)) continue; for(let k=0;k<sr(3,7);k++){ const x=cx+sr(-3,3),y=cy+sr(-3,3); if(!nearPath(x,y,1)&&Math.hypot(x-5,y-30)>6) addTree(x,y); } }
    for(let i=0;i<MAP.trees;i++){ const x=sr(4,W-5),y=sr(4,H-5); if(!nearPath(x,y,1)&&Math.hypot(x-5,y-30)>6) addTree(x,y); }
    for(let i=0;i<MAP.rocks;i++){ const x=sr(3,W-4),y=sr(3,H-4); if(free(x,y)&&!nearPath(x,y,0)&&Math.hypot(x-5,y-30)>5){ grid[y][x].b=true; this.add.image(x*T+16,y*T+28,'rock').setOrigin(.5,1).setDepth(y*T+28); } }
    // windmill landmark (Fields 01)
    if(MAP.windmill){ this.add.image(mx*T+16,my*T+31,'mill').setOrigin(.5,1).setDepth(my*T+31); blades=this.add.image(mx*T+16,my*T+31-84,'blades').setDepth(my*T+32); }
    // flowers, tufts, reeds
    if(HV) for(let i=0;i<380;i++){ const x=sr(2,W-3),y=sr(2,H-3); if(!free(x,y)) continue; const fy=y*T+irnd(8,30); const w=this.add.image(x*T+irnd(4,28),fy,'wheat').setOrigin(.5,1).setDepth(fy); w.ph=Math.random()*6.28; swayers.push(w); }
    for(let i=0;i<MAP.flowers;i++){ const x=sr(2,W-3),y=sr(2,H-3); if(!free(x,y)) continue; const fy=y*T+irnd(8,30);
      const f=this.add.image(x*T+irnd(4,28),fy,i%5===0?'tuft':'flower'+irnd(0,3)).setOrigin(.5,1).setDepth(fy); f.ph=Math.random()*6.28; swayers.push(f); }
    if(MAP.reeds) for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){ if(!free(x,y)) continue; if(![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>grid[y+b][x+a].t==='water')) continue; if(Math.random()>.45) continue;
      const fy=y*T+irnd(14,30); const r=this.add.image(x*T+irnd(6,26),fy,'reed').setOrigin(.5,1).setDepth(fy); r.ph=Math.random()*6.28; swayers.push(r); }
    }
    // signposts + portals
    if(!CM){ const sign=this.add.image(sx*T+16,sy*T+30,'sign').setOrigin(.5,1).setDepth(sy*T+30).setInteractive({useHandCursor:true}); sign.setData('kind','sign');
    const sign2=this.add.image(ex*T+16,ey*T+30,'sign').setOrigin(.5,1).setDepth(ey*T+30).setFlipX(true).setInteractive({useHandCursor:true}); sign2.setData('kind','sign2');
    [['west',1],['east',W-2]].forEach(([side,tx])=>{ const d=MAP.portals[side]; PORTALS.push(Object.assign({tx,ty:pathRow[tx],side,back:side==='west'?1:-1},d)); }); }
    else (CM.json.exits||[]).forEach(e=>{ const to=e.to||'f01', M2=MAPS[to]; PORTALS.push({ tx:e.x, ty:e.y-1, side:'east', back:e.x<W/2?1:-1, to:M2?to:null, name:M2?M2.name:'ทางออก', lv:M2?M2.lv:'' }); });
    PORTALS.forEach(pt=>{ const x=pt.tx*T+16, y=(pt.ty+1)*T;
      pt.glow=this.add.image(x,y,'portal').setDepth(2.4).setAlpha(pt.to?.95:.55);
      pt.ring=this.add.image(x,y,'portalRing').setDepth(2.5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(pt.to?1:.5);
      pt.lab=this.add.text(x,y-40,`${pt.back>0?'◀ ':''}${pt.name}${pt.back<0?' ▶':''}`+(pt.to?`\n${pt.lv}`:'\n(ยังไม่เปิด)'),{fontFamily:'Chakra Petch',fontSize:'10px',color:pt.to?'#bff4ff':'#c9d2e6',stroke:'#0a1830',strokeThickness:3,align:'center',resolution:TXT_RES}).setOrigin(.5).setDepth(59600);
      this.time.addEvent({delay:pt.to?160:400,loop:true,callback:()=>{ const s=this.add.image(x+rnd(-18,18),y+rnd(-4,6),'spark').setDepth(59000).setTint(0x8fe9ff).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({targets:s,y:s.y-rnd(26,44),alpha:0,duration:rnd(700,1100),onComplete:()=>s.destroy()}); }}); });
    npc=makeEnt('npc',nx,ny); npc.spr.play('npc-idle'); npc.spr.setInteractive({useHandCursor:true}).setData('kind','npc');
    npc.label=nameTag('ผู้ดูแลการเดินทาง','#ffe9a6');
    if(!P.save) P.save={map:P.map,x:nx+1,y:ny+1};
    // hero spawn point
    let spawn=MAP.start||[8,pathRow[8]];
    if(P.arrive==='west') spawn=[3,pathRow[3]]; else if(P.arrive==='east') spawn=[W-4,pathRow[W-4]]; else if(P.arrive==='save'&&P.save.map===P.map) spawn=[P.save.x,P.save.y]; else if(P.arrive==='keeper') spawn=[nx+1,ny+1];
    if(CM){ spawn=(P.arrive==='save'&&P.save.map===P.map)?[P.save.x,P.save.y]:(P.arrive==='keeper'?[nx+1,ny+1]:CM.json.spawn.slice());
      if(P.arrive==='east'||P.arrive==='west'){ const e=(CM.json.exits||[]).find(q=>(q.to||'f01')==='f01')||(CM.json.exits||[])[0]; if(e){ const dx=Math.sign(CM.json.spawn[0]-e.x), dy=Math.sign(CM.json.spawn[1]-e.y); spawn=[e.x+dx*2,e.y+dy*2]; } } }
    spawn=nearFree(spawn[0],spawn[1]); const arrived=P.arrive; P.arrive=null; portalCd=this.time.now+1500;
    Object.assign(hero, makeEnt(heroTex(),spawn[0],spawn[1])); hero.shadow.setScale(1.35,1.2); hero.speed=150; hero.isHero=true; hero.feed=nextHeldTile;
    hero.label=nameTag(P.name,'#ffffff'); applyHeroGear(); fitHeroScale();
    hero.hat=this.add.image(0,0,'hat-crown').setOrigin(.5,1).setVisible(false);
    hero.bars=this.add.graphics().setDepth(59000);
    hero.hpTxt=this.add.text(0,0,'',{fontFamily:'Silkscreen, monospace',fontSize:'8px',color:'#e8eeff',stroke:'#0a1026',strokeThickness:3,resolution:TXT_RES}).setOrigin(.5,0).setDepth(59400);
    bracket=this.add.graphics().setDepth(59800);
    castGfx=this.add.graphics().setDepth(2.2);
    // monsters
    Object.entries(MAP.spawns).forEach(([k,n])=>{ for(let i=0;i<n;i++) spawnMob(k,MONSTERS[k]); });
    if(MAP.boss){ const bx=MAP.river.cx+5, by=pathRow[MAP.river.cx]+5; const b=spawnMob(MAP.boss,MONSTERS[MAP.boss],nearFree(bx,by)); b.home=[b.tx,b.ty]; }
    // decor
    ring=this.add.image(0,0,'ring').setDepth(2).setVisible(false);
    clickMarker=this.add.image(0,0,'marker').setDepth(2).setVisible(false);
    if(HV){ this.add.rectangle(0,0,4000,4000,0xffa040,.07).setOrigin(0).setScrollFactor(0).setDepth(49700); }
    else { this.add.rectangle(0,0,4000,4000,0xffe0f0,.035).setOrigin(0).setScrollFactor(0).setDepth(49700); }
    for(let i=0;i<(HV?6:16);i++){ const f=this.add.sprite(rnd(200,W*T-200),rnd(200,H*T-200),'fly').setDepth(49000).play({key:'fly',startFrame:irnd(0,1)});
      f.setTint([0xffffff,0xffe27a,0xbfe3ff][i%3]); f.v={x:rnd(-20,20),y:rnd(-12,12)}; f.ph=Math.random()*6; flies.push(f); }
    for(let i=0;i<4;i++){ const c=this.add.image(rnd(0,W*T),rnd(0,H*T),'cloud').setDepth(49500).setAlpha(.11).setScale(rnd(1.4,2.2)); clouds.push(c); }
    this.time.addEvent({delay:650,loop:true,callback:spawnLeaf});
    // camera
    const cam=this.cameras.main; cam.setBounds(0,0,W*T,H*T); cam.startFollow(hero.spr,true,.14,.14); cam.setRoundPixels(!HDW()); cam.fadeIn(350,10,16,34);
    const fitZoom=()=>{ const cw=this.scale.width/DPR, ch=this.scale.height/DPR, w=Math.min(cw,ch*1.8); cam.setZoom(Math.max(1,Math.round((w<700?1.5:2)*DPR))); }; fitZoom(); this.scale.on('resize',fitZoom);
    this.events.once('shutdown',()=>this.scale.off('resize',fitZoom));
    // input
    this.input.on('pointerdown',(p,over)=>{ if(over.length||!started||hero.dead) return; pauseBot(); groundClick(p.worldX,p.worldY); });
    this.input.on('gameobjectdown',(p,obj)=>{ if(!started||hero.dead) return; const k=obj.getData('kind');
      if(k==='mob') setTarget(obj.getData('ent')); else if(k==='item') goPickup(obj.getData('ent')); else if(k==='npc'){ pauseBot(); goNpc(); }
      else if(k==='npc2'){ pauseBot(); goTalk(obj.getData('ref')); }
      else if(k==='board'){ openBoard(); }
      else if(k==='folk'){ const e=obj.getData('ref'); npcSay(e,FOLK_LINES[irnd(0,FOLK_LINES.length-1)]); }
      else if(k==='sign'){ const d=MAP.portals.west; toast(`◀ ${d.name} (${d.lv})${d.to?'':' ยังไม่เปิด'}: เดินตามถนนไปทางซ้ายสุดแมพ`); }
      else if(k==='sign2'){ const d=MAP.portals.east; toast(`${d.name} (${d.lv}) ▶${d.to?'':' ยังไม่เปิด'}: เดินตามถนนไปทางขวาสุดแมพ`); } });
    this.input.on('gameobjectover',(p,obj)=>{ const k=obj.getData('kind'); if(k==='mob'){ const e=obj.getData('ent'); showHover(e.def.name+'  Lv '+e.def.lv, e); } else if(k==='item'){ showHover(ITEMS[obj.getData('ent').id].name, obj.getData('ent')); } });
    this.input.on('gameobjectout',()=>hideHover());
    this.hover=this.add.text(0,0,'',{fontFamily:'Chakra Petch',fontSize:'11px',color:'#fff',stroke:'#2a1a0c',strokeThickness:3,resolution:TXT_RES}).setOrigin(.5,1).setDepth(61000).setVisible(false);
    // timers
    this.time.addEvent({delay:500,loop:true,callback:regenTick});
    this.time.addEvent({delay:10000,loop:true,callback:persist});
    this.time.addEvent({delay:250,loop:true,callback:()=>{ refreshBars(); drawMinimap(); refreshSkillSlots(); hudTick(); }});
    buildMinimapBase();
    document.querySelectorAll('.mapname').forEach(el=>el.textContent=MAP.name);
    $('mapWin').querySelector('h2').firstChild.nodeValue=MAP.name+' ';
    const d=derived(); if(P.hp==null||P.hp>d.maxHP) P.hp=d.maxHP; if(P.sp==null||P.sp>d.maxSP) P.sp=d.maxSP;
    refreshUI();
    if(started) setTimeout(()=>{ questCheck(); refreshUI(); },100);
    if(started){ logMsg(`เข้าสู่ ${MAP.name} (${MAP.lv})`,'sys'); toast(`${MAP.name} · ${MAP.lv}`); if(MAP.town) sfx('bell'); }
    if(MAP.boss&&started) S.time.delayedCall(900,()=>logMsg(`${MONSTERS[MAP.boss].name} (บอส Lv ${MONSTERS[MAP.boss].lv}) อยู่ริมสะพานหิน ระวังตัว!`,'warn'));
    if(P.bot.on) bot.anchor=[hero.tx,hero.ty];
    if(!started) onGameReady();
  }
  update(time,dt){
    const t=time;
    if(P.bot.on&&started) botThink(t);
    updateHero(t);
    mobs.forEach(m=>updateMob(m,t));
    syncEnt(hero, 0); syncEnt(npc,0); updateHat(); updateTown(time);
    hero.hpTxt.setPosition(hero.spr.x,hero.spr.y+11); hero.label.setPosition(hero.spr.x,hero.spr.y+24); npc.label.setPosition(npc.spr.x,npc.spr.y+4);
    drawHeroBars(t);
    mobs.forEach(m=>{
      if(m.dead) return;
      let off=0, sx=1, sy=1;
      if(m.def.fly){ off=12+Math.sin(t*.004+m.ph)*3; }
      else { if(m.moving) off=Math.abs(Math.sin(t*.013+m.ph))*6; sx=1-.05*Math.sin(t*.006+m.ph); sy=1+.07*Math.sin(t*.006+m.ph); }
      m.spr.setPosition(m.pos.x,m.pos.y-off).setScale(sx*m.sc*m.bs,sy*m.sc*m.bs).setDepth(m.pos.y);
      if(m.def.immobile){ sx=1; sy=1; } if(m.def.boss){ sx=1-.03*Math.sin(t*.004+m.ph); sy=1+.04*Math.sin(t*.004+m.ph); m.spr.setScale(sx*m.sc*m.bs,sy*m.sc*m.bs); }
      if(m.facing.dx) m.spr.setFlipX(m.def.faceLeft?m.facing.dx>0:m.facing.dx<0);
      m.shadow.setPosition(m.pos.x,m.pos.y-2).setScale(m.def.fly?.7:m.def.boss?2.4:m.key==='boarling'?1.4:1);
      if(m.aura){ m.aura.setPosition(m.pos.x,m.pos.y-2).setAlpha(.5+.3*Math.sin(t*.006)); }
      if(m.label){ m.label.setPosition(m.spr.x,m.spr.y-m.spr.displayHeight-4); }
      drawMobBar(m); if(m.nameTxt) m.nameTxt.setPosition(m.pos.x,m.pos.y+(m.hp<m.def.hp?8:3)).setVisible(true);
    });
    drawBracket(t);
    if(blades) blades.angle += dt*.02;
    swayers.forEach(f=>{ f.angle=Math.sin(t*.0022+f.ph)*6; });
    const hx=hero.pos.x, hy=hero.pos.y;
    canopies.forEach(c=>{ const cy=c.ay??c.y; const inside=Math.abs(hx-c.x)<(c.ay!==undefined&&HD_IMG.trunk?44:36)&&hy<cy+18&&hy>cy-66; const a=inside?.45:1; if(c.alpha!==a) c.setAlpha(Phaser.Math.Linear(c.alpha,a,.25)); });
    flies.forEach(f=>{ f.x+=f.v.x*dt/1000+Math.sin(t*.003+f.ph)*.3; f.y+=f.v.y*dt/1000+Math.cos(t*.004+f.ph)*.35; if(Math.random()<.01){ f.v.x=rnd(-22,22); f.v.y=rnd(-14,14);} f.x=clamp(f.x,80,W*T-80); f.y=clamp(f.y,80,H*T-80); });
    clouds.forEach(c=>{ c.x+=dt*.012; c.y+=dt*.003; if(c.x>W*T+300){ c.x=-300; c.y=rnd(0,H*T); } });
    if(this.hover.visible && this.hover.ent){ const e=this.hover.ent; const sp=e.spr; this.hover.setPosition(sp.x, sp.y-(e.def?sp.displayHeight+2:18)); }
    drawCast(t);
    PORTALS.forEach(pt=>{ pt.ring.rotation+=dt*.003; pt.glow.setScale(1+.06*Math.sin(t*.005)); });
    checkPortal(t);
  }
}

function makeEnt(tex,tx,ty){
  const pos={x:tx*T+16,y:ty*T+27};
  const shadow=S.add.image(pos.x,pos.y-2,'shadow').setDepth(1);
  const spr=S.add.sprite(pos.x,pos.y,tex,HERO8.has(tex)?'idle_S_0':0).setOrigin(.5,1).setDepth(pos.y); const bs=HD_KEYS.has(tex)?1/HD.K:1; spr.setScale(bs);
  return {tx,ty,pos,spr,shadow,path:[],moving:false,facing:{dx:0,dy:1},speed:300,bs};
}
function syncEnt(e,off){ e.spr.setPosition(e.pos.x,e.pos.y-off).setDepth(e.pos.y); e.shadow.setPosition(e.pos.x,e.pos.y-2); }
function nameTag(txt,col){ return S.add.text(0,0,txt,{fontFamily:'Chakra Petch',fontSize:'10px',color:col,stroke:'#1d130a',strokeThickness:3,resolution:TXT_RES}).setOrigin(.5,0).setDepth(59500); }

