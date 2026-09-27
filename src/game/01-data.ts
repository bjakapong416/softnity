/* ---------- game data (from GDD) ---------- */
const baseNeed = L => L===1 ? 60 : Math.round(60*Math.pow(L,2.35)*Math.pow(1.036,L)/10)*10;
const NOVICE_JOB = [170,660,1490,2640,4130,5940,8090,10570,13380];
const CLASS1_JOB = [12310,25350,39160,53790,69250,85590,102850,121070,140290,160560,181910,204400,228080,252990,279200,306740,335690,366100,398030,431550,466730,503620,542310,582860,625360,669890,716520,765350,816470,869960,925930,984470,1045690,1109700,1176610,1246530,1319590,1395910,1475630,1558870,1645770,1736490,1831170,1929970,2033050,2140570,2252720,2369670,2491610];
const BASE_CAP = 60;
const WKIND = {
  fist:{ kind:'มือเปล่า', delay:500, range:1, size:{S:1,M:1,L:1} },
  sword:{ kind:'ดาบมือเดียว', delay:700, range:1, size:{S:1,M:.75,L:.75} },
  bow:{ kind:'ธนู (สองมือ)', delay:800, range:9, ranged:true, twoHand:true, size:{S:1,M:1,L:.75} },
  staff:{ kind:'ไม้เท้า', delay:900, range:1, size:{S:1,M:1,L:1} },
};
const STARTER = { Novice:'shortsword', Swordman:'shortsword', Archer:'shortbow', Mage:'woodstaff' };
const SLOTS = [['head','หมวก'],['armor','ชุดเกราะ'],['garment','ผ้าคลุม'],['acc1','เครื่องประดับ'],['weapon','อาวุธ'],['shield','โล่'],['shoes','รองเท้า'],['acc2','เครื่องประดับ']];
const RARITY = { c:['ธรรมดา','#e8eeff'], u:['ดี','#7dff9a'], r:['หายาก','#6fb6ff'], e:['ระดับบอส','#e0a8ff'] };
const NS=['Novice','Swordman'];
const EQUIP = {
  shortsword:{ name:'Short Sword', slot:'weapon', kind:'sword', atk:25, jobs:NS, lv:1, r:'c', sell:50, icon:['sword','#dfe7ee','#e2b44a'] },
  gelblade:{ name:'Gel Blade', slot:'weapon', kind:'sword', atk:48, stats:{agi:2}, jobs:NS, lv:8, r:'r', sell:900, icon:['sword','#ffa8c8','#f0bd3f'] },
  longsword:{ name:'Long Sword', slot:'weapon', kind:'sword', atk:60, jobs:['Swordman'], lv:12, r:'u', sell:1200, icon:['sword','#cfe0f0','#8a5a2b'] },
  shortbow:{ name:'Short Bow', slot:'weapon', kind:'bow', atk:30, jobs:['Archer'], lv:1, r:'c', sell:200, icon:['bow','#8a5a2b','#f4efe2'] },
  compbow:{ name:'Composite Bow', slot:'weapon', kind:'bow', atk:62, stats:{dex:1}, jobs:['Archer'], lv:12, r:'u', sell:1500, icon:['bow','#5a3b1e','#f0bd3f'] },
  woodstaff:{ name:'Wooden Staff', slot:'weapon', kind:'staff', atk:15, matk:15, jobs:['Mage'], lv:1, r:'c', sell:150, icon:['staff','#ff8a3d','#8a5a2b'] },
  arcwand:{ name:'Arc Wand', slot:'weapon', kind:'staff', atk:25, matk:25, stats:{int:1}, jobs:['Mage'], lv:10, r:'u', sell:1400, icon:['staff','#7de0ff','#5e4491'] },
  cottonshirt:{ name:'Cotton Shirt', slot:'armor', def:1, lv:1, r:'c', sell:5, icon:['armor','#ece0bd','#cbb788'] },
  leatherjacket:{ name:'Leather Jacket', slot:'armor', def:3, lv:1, r:'c', sell:100, icon:['armor','#a26c3e','#7a4e2a'] },
  chainmail:{ name:'Chain Mail', slot:'armor', def:8, jobs:['Swordman'], lv:12, r:'u', sell:1600, icon:['armor','#b9c3ce','#7d8894'] },
  huntervest:{ name:'Hunter Vest', slot:'armor', def:5, stats:{dex:1}, jobs:['Archer'], lv:10, r:'u', sell:1100, icon:['armor','#72b35a','#4a7a3a'] },
  magerobe:{ name:'Mage Robe', slot:'armor', def:4, mdef:3, stats:{int:1}, jobs:['Mage'], lv:10, r:'u', sell:1100, icon:['robe','#7b5bb5','#5a4190'] },
  crown:{ name:'Jellop Crown', slot:'head', def:2, hp:30, stats:{luk:2}, lv:1, r:'r', sell:2500, hat:'hat-crown' },
  bunnyband:{ name:'Bunny Band', slot:'head', def:1, stats:{agi:1}, lv:1, r:'u', sell:600, hat:'hat-bunny', icon:['band','#fbf5e8','#f7a8b8'] },
  thorncirclet:{ name:'Thorn Circlet', slot:'head', def:1, mdef:2, stats:{int:1}, lv:1, r:'u', sell:700, hat:'hat-thorn', icon:['circlet','#4f9a3c','#f1e6b8'] },
  boarhelm:{ name:'Boar Helm', slot:'head', def:3, stats:{vit:1}, lv:8, r:'u', sell:900, hat:'hat-boar', icon:['helm','#8a5a32','#fff6e0'] },
  strawhat:{ name:'Straw Hat', slot:'head', def:1, stats:{vit:1}, lv:1, r:'c', sell:150, hat:'hat-straw', icon:['straw','#e8c170','#c8342c'] },
  kingcrown:{ name:"King's Crown", slot:'head', def:4, hp:60, stats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1}, lv:10, r:'e', sell:8000, hat:'hat-king', icon:['kcrown','#f0bd3f','#e2524a'] },
  guard:{ name:'Guard', slot:'shield', def:3, lv:1, r:'c', sell:250, icon:['shield','#a26c3e','#d9dee4'] },
  buckler:{ name:'Buckler', slot:'shield', def:5, hp:20, lv:8, r:'u', sell:1000, icon:['shield','#9fb3c8','#e2b44a'] },
  hood:{ name:'Hood', slot:'garment', def:1, lv:1, r:'c', sell:60, icon:['cloak','#8a7a60','#6b5a44'] },
  muffler:{ name:'Muffler', slot:'garment', def:2, flee:3, lv:1, r:'u', sell:700, icon:['cloak','#e2524a','#a82c24'] },
  sandals:{ name:'Sandals', slot:'shoes', def:1, lv:1, r:'c', sell:80, icon:['boots','#c9a06a','#8a5a2b'] },
  boots:{ name:'Boots', slot:'shoes', def:2, hp:25, lv:8, r:'u', sell:900, icon:['boots','#6b4424','#3a281b'] },
  clip:{ name:'Clip', slot:'acc', sp:10, lv:1, r:'u', sell:800, icon:['ring','#3d7bf0','#cfd8e0'] },
  brooch:{ name:'Brooch', slot:'acc', stats:{agi:1}, flee:2, lv:1, r:'u', sell:800, icon:['ring','#7dff9a','#e2b44a'] },
  glove:{ name:'Glove', slot:'acc', stats:{dex:1}, hit:3, lv:1, r:'u', sell:800, icon:['glove','#d9ccb4','#8a5a2b'] },
  jellyring:{ name:'Jelly Ring', slot:'acc', stats:{str:2}, hp:20, lv:5, r:'r', sell:2200, icon:['ring','#ff8fb8','#f0bd3f'] },
};
function equipDesc(it){
  const p=[]; if(it.atk) p.push(`ATK ${it.atk}`); if(it.matk) p.push(`MATK +${it.matk}%`); if(it.def) p.push(`DEF ${it.def}`); if(it.mdef) p.push(`MDEF ${it.mdef}`);
  Object.entries(it.stats||{}).forEach(([k,v])=>p.push(`${k.toUpperCase()} +${v}`)); if(it.hp) p.push(`MaxHP +${it.hp}`); if(it.sp) p.push(`MaxSP +${it.sp}`);
  if(it.hit) p.push(`HIT +${it.hit}`); if(it.flee) p.push(`FLEE +${it.flee}`);
  return p.join(' · ');
}
function equipReq(it){ return `Lv ${it.lv||1}${it.jobs?` · ${it.jobs.join('/')}`:' · ทุกอาชีพ'}${it.kind?` · ${WKIND[it.kind].kind}`:''}`; }
const JOBS = {
  Novice:{ hpA:0, spB:1, cap:10, table:NOVICE_JOB, weapon:'sword' },
  Swordman:{ hpA:.7, spB:2, cap:50, table:CLASS1_JOB, weapon:'sword' },
  Archer:{ hpA:.5, spB:2, cap:50, table:CLASS1_JOB, weapon:'bow' },
  Mage:{ hpA:.3, spB:6, cap:50, table:CLASS1_JOB, weapon:'staff' },
};
const ELEM = { // attacker -> defender (GDD 4.5)
  Neutral:{Neutral:1,Water:1,Earth:1,Fire:1,Wind:1},
  Water:{Neutral:1,Water:.25,Earth:1,Fire:1.5,Wind:.5},
  Earth:{Neutral:1,Water:1,Earth:.25,Fire:.5,Wind:1.5},
  Fire:{Neutral:1,Water:.5,Earth:1.5,Fire:.25,Wind:1},
  Wind:{Neutral:1,Water:1.5,Earth:.5,Fire:1,Wind:.25},
};
const elemMod=(a,d)=>(ELEM[a]||ELEM.Neutral)[d]??1;
const ELEM_COL={ Neutral:'#9c8a70', Fire:'#e0643a', Water:'#3f8fd6', Wind:'#c9a21e', Earth:'#8a6a3a', Heal:'#4fae5a' };
const SKILLS = {
  basic:{ name:'Basic Skill', job:'Novice', max:9, type:'passive', desc:lv=>`Lv${lv}: ${lv>=9?'เปลี่ยนอาชีพได้':lv>=3?'นั่งพักได้':'Lv3 นั่งพักได้, Lv9 เปลี่ยนอาชีพได้'}` },
  firstaid:{ name:'First Aid', short:'Aid', job:'Novice', max:1, free:true, type:'self', elem:'Heal', sp:()=>3, delay:()=>800, desc:()=>'ฟื้น HP 5 หน่วย' },
  swordmastery:{ name:'Sword Mastery', job:'Swordman', max:10, type:'passive', desc:lv=>`ATK +${4*lv} เมื่อใช้ดาบมือเดียว` },
  hprecovery:{ name:'Increase HP Recovery', job:'Swordman', max:10, type:'passive', desc:lv=>`ฟื้น HP เพิ่ม ${5*lv} ต่อรอบ` },
  bash:{ name:'Bash', short:'Bash', job:'Swordman', max:10, type:'target', kind:'phys', elem:'Neutral', range:()=>1,
    sp:lv=>lv<=5?8:15, delay:()=>500, pct:lv=>100+30*lv, hitBonus:lv=>5*lv, desc:lv=>`ตีแรง ${100+30*lv}% HIT +${5*lv}%` },
  magnum:{ name:'Magnum Break', short:'Magnum', job:'Swordman', max:10, type:'selfaoe', kind:'phys', elem:'Fire', radius:2,
    sp:()=>30, delay:()=>2000, pct:lv=>100+20*lv, hitBonus:lv=>10*lv, knock:2, desc:lv=>`ระเบิดไฟรอบตัว 5×5 แรง ${100+20*lv}% ผลักถอย 2 ช่อง` },
  owleye:{ name:"Owl's Eye", job:'Archer', max:10, type:'passive', desc:lv=>`DEX +${lv}` },
  vulture:{ name:"Vulture's Eye", job:'Archer', max:10, type:'passive', desc:lv=>`ระยะยิง +${lv} ช่อง HIT +${lv}` },
  dstrafe:{ name:'Double Strafe', short:'Double', job:'Archer', max:10, type:'target', kind:'phys', elem:'Neutral', range:'weapon',
    sp:()=>12, delay:()=>400, pct:lv=>100+10*lv, hits:2, desc:lv=>`ยิง 2 ดอก ดอกละ ${100+10*lv}%` },
  ashower:{ name:'Arrow Shower', short:'Shower', job:'Archer', max:10, type:'targetaoe', kind:'phys', elem:'Neutral', range:'weapon', radius:1,
    sp:()=>15, delay:()=>800, pct:lv=>75+5*lv, knock:2, desc:lv=>`ฝนลูกธนูพื้นที่ 3×3 แรง ${75+5*lv}% ผลักถอย` },
  firebolt:{ name:'Fire Bolt', short:'Fire', job:'Mage', max:10, type:'target', kind:'magic', elem:'Fire', range:()=>9,
    sp:lv=>10+2*lv, cast:lv=>300*lv, delay:lv=>350+50*lv, pct:()=>100, hits:lv=>lv, desc:lv=>`ลูกไฟ ${lv} ลูก ร่าย ${(0.3*lv).toFixed(1)} วิ` },
  coldbolt:{ name:'Cold Bolt', short:'Cold', job:'Mage', max:10, type:'target', kind:'magic', elem:'Water', range:()=>9,
    sp:lv=>10+2*lv, cast:lv=>300*lv, delay:lv=>350+50*lv, pct:()=>100, hits:lv=>lv, desc:lv=>`ลูกน้ำแข็ง ${lv} ลูก แรงกับ Fire` },
  lightning:{ name:'Lightning Bolt', short:'Thunder', job:'Mage', max:10, type:'target', kind:'magic', elem:'Wind', range:()=>9,
    sp:lv=>10+2*lv, cast:lv=>300*lv, delay:lv=>350+50*lv, pct:()=>100, hits:lv=>lv, desc:lv=>`สายฟ้า ${lv} ครั้ง แรงกับ Water (Jellop)` },
  napalm:{ name:'Napalm Beat', short:'Napalm', job:'Mage', max:10, type:'targetaoe', kind:'magic', elem:'Neutral', range:()=>9, radius:1,
    sp:lv=>9+lv, cast:()=>500, delay:()=>500, pct:lv=>70+10*lv, desc:lv=>`คลื่นเวทพื้นที่ 3×3 แรง ${70+10*lv}%` },
  sprecovery:{ name:'Increase SP Recovery', job:'Mage', max:10, type:'passive', desc:lv=>`ฟื้น SP เพิ่ม ${3*lv} ต่อรอบ` },
};
const JOB_SKILLS = { Novice:['basic','firstaid'], Swordman:['bash','magnum','swordmastery','hprecovery'], Archer:['dstrafe','ashower','owleye','vulture'], Mage:['lightning','firebolt','coldbolt','napalm','sprecovery'] };
const DEFAULT_BAR = { Novice:['firstaid',null,null], Swordman:['bash','magnum','firstaid'], Archer:['dstrafe','ashower','firstaid'], Mage:['lightning','napalm','firebolt'] };
const ITEMS = {
  redpot:{ name:'Red Potion', type:'use', heal:[45,65], sell:25, price:50, desc:'ฟื้น HP 45–65' },
  flywing:{ name:'Fly Wing', type:'use', fly:true, sell:30, price:60, desc:'วาร์ปไปจุดสุ่มในแมพเดียวกัน' },
  apple:{ name:'Apple', type:'use', heal:[16,16], sell:7, desc:'ฟื้น HP 16' },
  bwing:{ name:'Butterfly Wing', type:'use', warp:true, sell:150, price:300, desc:'กลับจุดเกิด' },
  jelly:{ name:'Jelly Gel', type:'etc', sell:3, desc:'ของดรอป ขายได้' },
  mucus:{ name:'Sticky Mucus', type:'etc', sell:12, desc:'ของดรอป ขายได้' },
  dust:{ name:'Moth Dust', type:'etc', sell:9, desc:'ของดรอป ขายได้' },
  orangepot:{ name:'Orange Potion', type:'use', heal:[105,145], sell:100, price:200, desc:'ฟื้น HP 105–145' },
  royaljelly:{ name:'Royal Jelly', type:'use', heal:[300,300], rare:true, sell:400, desc:'ฟื้น HP 300 (ของหายากจาก King Jellop)' },
  fur:{ name:'Bunny Fur', type:'etc', sell:15, desc:'ของดรอป ขายได้' },
  thorn:{ name:'Sharp Thorn', type:'etc', sell:22, desc:'ของดรอป ขายได้' },
  tusk:{ name:'Boar Tusk', type:'etc', sell:40, desc:'ของดรอป ขายได้' },
};
Object.entries(EQUIP).forEach(([id,e])=>{ ITEMS[id]=Object.assign({type:'equip',desc:''},e); ITEMS[id].desc=equipDesc(ITEMS[id]); });
const MONSTERS = {
  jellop:{ name:'Jellop', lv:2, hp:70, atk:[6,9], hardDef:0, softDef:1, hardMdef:0, softMdef:1, hit:8, flee:3, size:'M', elem:'Water', delay:1500, speed:700,
    exp:20, jexp:15, looter:true, hurtFrame:true, mm:'#ff8fb8', drops:[['jelly',7000],['apple',1000],['mucus',500],['redpot',300],['crown',5]] },
  moth:{ name:'Fluttermoth', lv:4, hp:140, atk:[10,13], hardDef:2, softDef:2, hardMdef:0, softMdef:2, hit:12, flee:14, size:'S', elem:'Wind', delay:1300, speed:560,
    exp:70, jexp:50, fly:true, mm:'#b99af0', drops:[['dust',6000],['apple',800],['redpot',400],['bwing',150]] },
};
  // ----- Everhaven Fields 02 (GDD section 8.3, zone 1) -----
Object.assign(MONSTERS,{
  bunny:{ name:'Burrow Bunny', lv:6, hp:240, atk:[12,16], hardDef:3, softDef:3, hardMdef:0, softMdef:3, hit:16, flee:22, size:'S', elem:'Earth', delay:1200, speed:520,
    exp:140, jexp:100, coward:true, faceLeft:true, anim:'bunny-hop', mm:'#fff3d6', drops:[['fur',5500],['apple',1500],['redpot',500],['bwing',100]] },
  thornling:{ name:'Thornling', lv:10, hp:550, atk:[20,26], hardDef:10, softDef:6, hardMdef:5, softMdef:4, hit:24, flee:5, size:'S', elem:'Earth', delay:1600, speed:0,
    immobile:true, range:4, exp:340, jexp:250, anim:'thorn-sway', mm:'#6ed35a', drops:[['thorn',5000],['apple',900],['redpot',600],['orangepot',150]] },
  boarling:{ name:'Boarling', lv:13, hp:850, atk:[30,38], hardDef:8, softDef:8, hardMdef:0, softMdef:5, hit:32, flee:24, size:'M', elem:'Earth', delay:1400, speed:460,
    aggressive:true, faceLeft:true, anim:'boar-walk', exp:530, jexp:400, mm:'#d08a4a', drops:[['tusk',4500],['redpot',800],['orangepot',300],['apple',800]] },
  kingjellop:{ name:'King Jellop', lv:15, hp:8700, atk:[45,60], hardDef:10, softDef:10, hardMdef:10, softMdef:8, hit:40, flee:15, size:'L', elem:'Water', delay:1700, speed:780,
    boss:true, hurtFrame:true, exp:6860, jexp:5140, respawn:[90000,120000], summon:{key:'jellop',n:3,at:[.7,.4]}, mm:'#ffd35a',
    drops:[['royaljelly',6000],['crown',2500],['orangepot',10000],['redpot',10000],['jelly',10000],['bwing',3000]] },
});
MONSTERS.moth.drops.push(['flywing',1500]); MONSTERS.bunny.drops.push(['flywing',800]); MONSTERS.jellop.drops.push(['flywing',300]);
[['jellop',[['sandals',150],['leatherjacket',80],['guard',40]]],['moth',[['hood',200],['clip',30]]],
 ['bunny',[['strawhat',300],['bunnyband',120],['muffler',100],['brooch',40],['huntervest',40],['compbow',15]]],
 ['thornling',[['thorncirclet',120],['arcwand',40],['magerobe',50],['glove',40]]],
 ['boarling',[['boarhelm',100],['boots',100],['buckler',60],['longsword',30],['chainmail',30]]],
 ['kingjellop',[['kingcrown',800],['jellyring',1500],['gelblade',2000]]]].forEach(([k,list])=>MONSTERS[k].drops.push(...list));
const RESPAWN_MS=[3000,5000];
const SERVER_RATE=20; // prototype server rate: Base & Job EXP x20
const MAPS={
  town:{ town:true, w:80, h:80, theme:'spring', starter:true, name:'เมืองหลวง Everhaven', lv:'เมืองหลัก', seed:4242, spawns:{}, flowers:0, clusters:0, trees:0, rocks:0, tint:0xffffff, start:[44,45], keeper:[45,37],
    portals:{ west:{to:null,name:'ท่าเรือ Everhaven',lv:'เร็ว ๆ นี้'}, east:{to:'f01',name:'Everhaven Fields 01',lv:'Lv 1–8'} } },
  f01:{ theme:'spring', starter:true, name:'Everhaven Fields 01', lv:'Lv 1–8', seed:20260926, river:{cx:45,w:3,min:41,max:49}, ponds:[[20,46,4,3]], windmill:true,
    spawns:{jellop:22,moth:12}, flowers:560, clusters:14, trees:26, rocks:22, tint:0xffffff,
    portals:{ west:{to:'town',name:'เมืองหลวง Everhaven',lv:'เมืองหลัก'}, east:{to:'f02',name:'Everhaven Fields 02',lv:'Lv 8–15'} } },
  f02:{ theme:'harvest', starter:true, name:'Everhaven Fields 02', lv:'Lv 8–15', seed:880215, river:{cx:31,w:5,min:28,max:34}, ponds:[[12,49,3,2],[46,11,7,5]], stoneBridge:true, ruins:true, reeds:true,
    spawns:{jellop:8,bunny:12,thornling:9,boarling:9}, boss:'kingjellop', flowers:90, clusters:18, trees:34, rocks:30, tint:0xffffff,
    portals:{ west:{to:'f01',name:'Everhaven Fields 01',lv:'Lv 1–8'}, east:{to:null,name:'Whisperwood 01',lv:'Lv 16–23'} } },
};
let MAP=MAPS.f01;
const EMOTES = ['♥','!','?','♪','…','★'];

