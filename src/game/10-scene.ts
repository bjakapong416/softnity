/* ============================================================
   Scene
   ============================================================ */
let S; // scene
const hero = {}; const mobs=[]; const items=[]; const canopies=[]; const swayers=[]; const flies=[]; const clouds=[];
const PORTALS=[]; let portalCd=0;
let npc, blades, target=null, ring, clickMarker, pending=null, pendingSkill=null, castGfx, bracket;
/* ---------- custom 2D sprite sheets (from Sprite Importer) ---------- */
const CUSTOM={};
async function loadCustomSprites(){
  const add=async(key,png,json)=>{ try{ const j=typeof json==='string'?JSON.parse(json):json; if(!j||!j.frames) return; const im=new Image(); im.src=png; await im.decode(); CUSTOM[key]={ img:im, json:j }; }catch(e){ console.warn('custom sprite',key,e); } };
  try{ const loc=JSON.parse(localStorage.getItem('softnity-custom')||'{}'); for(const [k,v] of Object.entries(loc)) await add(k,v.png,v.json); }catch(e){}
  try{ const r=await fetch('sprites/manifest.json',{ cache:'no-store' }); if(r.ok){ const m=await r.json(); for(const [k,v] of Object.entries(m)){ if(CUSTOM[k]) continue; const jr=await fetch(v.json,{ cache:'no-store' }); if(jr.ok) await add(k,v.png,await jr.json()); } } }catch(e){}
}
/* ---------- custom painted maps (from Map Importer) ---------- */
const CUSTOM_MAPS={};
async function loadCustomMaps(){
  const add=async(key,png,json)=>{ try{ const j=typeof json==='string'?JSON.parse(json):json; if(!j||!j.grid) return; const im=new Image(); im.src=png; await im.decode(); CUSTOM_MAPS[key]={ img:im, json:j }; }catch(e){ console.warn('custom map',key,e); } };
  try{ const loc=JSON.parse(localStorage.getItem('softnity-maps')||'{}'); for(const [k,v] of Object.entries(loc)) await add(k,v.png,v.json); }catch(e){}
  try{ const r=await fetch('maps/manifest.json',{ cache:'no-store' }); if(r.ok){ const m=await r.json(); for(const [k,v] of Object.entries(m)){ if(CUSTOM_MAPS[k]) continue; const jr=await fetch(v.json,{ cache:'no-store' }); if(jr.ok) await add(k,v.png,await jr.json()); } } }catch(e){}
}
function buildCustomGrid(J){
  for(let y=0;y<H;y++){ grid[y]=[]; const row=J.grid[y]||''; for(let x=0;x<W;x++){ const ok=row[x]==='1'; grid[y][x]={ t:ok?'plaza':'bld', b:!ok, v:0 }; } }
  for(let x=0;x<W;x++) pathRow[x]=Math.min(H-2,Math.max(1,(J.spawn||[0,Math.floor(H/2)])[1]));
}
const CUSTOM_NPCS={ smith:['smith','ช่างตีเหล็ก Brann',()=>openShopKind('weapon')], armor:['merchant','พ่อค้าชุดเกราะ Oda',()=>openShopKind('armor')], tool:['merchant','ร้านของใช้ Mimi',()=>openShopKind('tool')],
  inn:['inn','เจ้าของโรงเตี๊ยม Rosa',()=>openInn()], storage:['clerk','เจ้าหน้าที่คลังสินค้า Lena',()=>openStorage()], priest:['priest','นักบวช Seraphine',()=>openChurch()], buyer:['buyer','พ่อค้ารับซื้อ Tomas',()=>openBuyer()],
  guildS:['mS','ปรมาจารย์ดาบ Garrick',()=>guildTalk('Swordman')], guildA:['mA','หัวหน้าพรานป่า Lyra',()=>guildTalk('Archer')], guildM:['mM','จอมเวท Elowen',()=>guildTalk('Mage')],
  knight:['knight','อัศวินหลวง Cedric',null], guard:['guard','ทหารยาม',null] };
function buildCustomTown(sc,J){
  Object.entries(J.npcs||{}).forEach(([id,pos])=>{ const d=CUSTOM_NPCS[id]; if(!d||!pos) return; const [x,y]=pos; if(!grid[y]||!grid[y][x]) return;
    const ref=makeTownNpc(d[0],x,y,d[1],d[2]||(()=>npcSay(ref.ent,'ขอให้โชคดีในการผจญภัย!'))); });
  for(let i=0;i<8;i++){ for(let k=0;k<80;k++){ const x=irnd(1,W-2), y=irnd(1,H-2); if(!blocked(x,y)){ makeWalker('npc-'+TOWN_WALKERS[i%2],x,y); break; } } }
}
function customKey(){ const b=(P.look&&P.look.body)||'m', k=`${P.job}-${b}`; return CUSTOM[k]?k:(CUSTOM[P.job]?P.job:null); }
const heroTex=()=>{ const ck=customKey(); return ck?'cust-'+ck:'hero-'+P.job; };
const DIR8=f=>({'0,1':'S','1,1':'SE','1,0':'E','1,-1':'NE','0,-1':'N','-1,-1':'NW','-1,0':'W','-1,1':'SW'})[Math.sign(f.dx)+','+Math.sign(f.dy)]||'S';
function playHero(st){ const tex=heroTex();
  if(HERO8.has(tex)){ const A={ idle:'idle', walk:'walk', atk:'attack', cast:'attack', sit:'sit' }[st]||'idle', key=`${tex}-${A}_${DIR8(hero.facing)}`;
    hero.spr.setFlipX(false); if(S.anims.exists(key)) hero.spr.play(key,st!=='atk'); return; }
  if(tex.startsWith('cust-')){ const A={ idle:'stand', walk:'walk', atk:'attack', cast:'attack', sit:'stand' }[st]||'stand', d=DIR8(hero.facing);
    let key=`${tex}-${A}_${d}`; if(!S.anims.exists(key)) key=`${tex}-stand_${d}`; if(!S.anims.exists(key)) key=`${tex}-stand_S`;
    hero.spr.setFlipX(false); if(S.anims.exists(key)) hero.spr.play(key,st!=='atk'); return; }
  hero.spr.setFlipX(hero.facing.dx<0); hero.spr.play(`${tex}-${heroDir()}-${st}`,st!=='atk'); }
function fitHeroScale(){ const ck=customKey(); if(!ck||!hero.spr) return; const m=CUSTOM[ck].json.meta||{}; const sc=58/(m.charH||140); hero.spr.setScale(sc); hero.bs=sc; }
function customFrame(){ const ck=customKey(); if(!ck||!S) return null; const tex='cust-'+ck, fr=S.textures.getFrame(tex,'stand_S_0')||S.textures.getFrame(tex,Object.keys(CUSTOM[ck].json.frames)[0]); const m=CUSTOM[ck].json.meta||{};
  return fr?{ src:S.textures.get(tex).getSourceImage(), x:fr.cutX, y:fr.cutY, w:fr.cutWidth, h:fr.cutHeight, charH:m.charH||140, base:m.baseline||fr.cutHeight-4, nearest:m.filter==='nearest' }:null; }

