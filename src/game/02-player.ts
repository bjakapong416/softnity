/* ---------- player state ---------- */
const SAVE_KEY = 'softnity-proto-v2';
function freshBot(){ return { on:false, mode:'all', targets:{jellop:true,moth:true}, skill:'auto', spMin:30, style:'mixed', noSp:'rest', kite:true, flyIdle:10, flyHp:25, loot:'all', roam:'map', potion:50, rest:30, wing:true, revive:true }; }
function freshPlayer(){
  return { name:'นักผจญภัย', map:'town', job:'Novice', lv:1, jlv:1, exp:0, jexp:0,
    stats:{str:5,agi:5,vit:5,int:1,dex:5,luk:1}, points:16, gift1:true, skillPts:0, skills:{basic:0,firstaid:1},
    hp:null, sp:null, sol:0, inv:{redpot:5,bwing:1,flywing:10}, rate:1, sound:true, hotbar:['redpot','orangepot','flywing','bwing'],
    skillbar:['firstaid',null,null], bot:freshBot(), equip:{weapon:'shortsword',armor:'cottonshirt'} };
}
let P = freshPlayer(); let hadSave=false;
try{
  const s = localStorage.getItem(SAVE_KEY) || localStorage.getItem('softnity-proto-v1');
  if(s){ hadSave=true; const o=JSON.parse(s); P = Object.assign(freshPlayer(), o); P.bot=Object.assign(freshBot(), o.bot||{}); P.bot.on=false;
    P.skills=Object.assign({basic:0,firstaid:1}, o.skills||{}); if(!JOBS[P.job]) P.job='Novice';
    if(!o.equip){ P.equip={weapon:STARTER[P.job],armor:'cottonshirt'}; }
    if(!o.gift1){ P.inv.flywing=(P.inv.flywing||0)+10; P.gift1=true; }
    if(!P.hotbar||P.hotbar.length<4) P.hotbar=['redpot','orangepot','flywing','bwing']; }
}catch(e){}
function persist(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(P)); }catch(e){} }

const statCost = x => Math.floor((x-1)/10)+2;
const skLv = id => P.skills[id]||0;
function equipList(){ return Object.values(P.equip||{}).filter(Boolean).map(id=>ITEMS[id]).filter(Boolean); }
function equipBonus(){
  const b={atk:0,def:0,mdef:0,hp:0,sp:0,hit:0,flee:0,crit:0,stats:{str:0,agi:0,vit:0,int:0,dex:0,luk:0}};
  equipList().forEach(it=>{ ['def','mdef','hp','sp','hit','flee','crit'].forEach(k=>b[k]+=it[k]||0); if(it.slot!=='weapon') b.atk+=it.atk||0; Object.entries(it.stats||{}).forEach(([k,v])=>b.stats[k]+=v); });
  return b;
}
function weapon(){ const id=P.equip&&P.equip.weapon, it=id&&ITEMS[id]; const key=it?it.kind:'fist';
  return Object.assign({key,name:it?it.name:'มือเปล่า',atk:it?it.atk:0,matk:it?(it.matk||0):0},WKIND[key]); }
function effStats(){ const b=equipBonus().stats, s=P.stats, f=(P.buff&&P.buff.until>Date.now())?P.buff.amt:0; return {str:s.str+b.str+f,agi:s.agi+b.agi+f,vit:s.vit+b.vit+f,int:s.int+b.int+f,dex:s.dex+b.dex+skLv('owleye')+f,luk:s.luk+b.luk+f}; }
function derived(){
  const s=effStats(), lv=P.lv, J=JOBS[P.job], Wp=weapon(), B=equipBonus(), dex=s.dex;
  const statusAtk = Wp.ranged
    ? dex+Math.floor(dex/10)**2+Math.floor(s.str/5)+Math.floor(s.luk/5)
    : s.str+Math.floor(s.str/10)**2+Math.floor(dex/5)+Math.floor(s.luk/5);
  const mm=1+(Wp.matk||0)/100;
  return {
    maxHP: Math.floor((35+5*lv+J.hpA*(lv*(lv+1)/2-1))*(1+s.vit/100))+B.hp,
    maxSP: Math.floor((10+J.spB*lv)*(1+s.int/100))+B.sp,
    dex, satk: statusAtk+B.atk, weapon:Wp, eff:s,
    mastery: Wp.key==='sword' ? 4*skLv('swordmastery') : 0,
    matkMin: Math.floor((s.int+Math.floor(s.int/7)**2)*mm), matkMax: Math.floor((s.int+Math.floor(s.int/5)**2)*mm),
    hit: lv+dex+(Wp.ranged?skLv('vulture'):0)+B.hit, flee: lv+s.agi+B.flee, crit: 1+Math.floor(s.luk*.3)+B.crit, pd: 1+Math.floor(s.luk/10),
    softDef: s.vit, hardDef: B.def, softMdef: s.int, hardMdef: B.mdef,
    range: Wp.range+(Wp.ranged?skLv('vulture'):0),
    delay: Math.max(200, Math.round(Wp.delay*(1-(4*s.agi+dex)/1000)))
  };
}
function addInv(id,n=1){ P.inv[id]=(P.inv[id]||0)+n; P.invSeq=P.invSeq||{}; P.seq=(P.seq||0)+1; P.invSeq[id]=P.seq; }
function takeInv(id){ if(P.inv[id]){ P.inv[id]--; if(P.inv[id]<=0) delete P.inv[id]; } }
function canEquip(id){ const it=ITEMS[id]; if(!it||it.type!=='equip') return 'ไม่ใช่อุปกรณ์สวมใส่';
  if(P.lv<(it.lv||1)) return `ต้องมี Base Lv ${it.lv} ขึ้นไป`; if(it.jobs&&!it.jobs.includes(P.job)) return `ใช้ได้เฉพาะ ${it.jobs.join(', ')}`;
  if(it.slot==='shield'&&weapon().twoHand) return 'ถืออาวุธสองมืออยู่ ใส่โล่ไม่ได้'; return ''; }
function afterEquipChange(){ const d=derived(); P.hp=Math.min(P.hp,d.maxHP); P.sp=Math.min(P.sp,d.maxSP); applyHeroGear(); persist(); refreshUI(); }
function equipItem(id){
  const why=canEquip(id); if(why){ toast(why); return; } const it=ITEMS[id]; if(!P.inv[id]) return;
  let slot=it.slot; if(slot==='acc') slot=!P.equip.acc1?'acc1':!P.equip.acc2?'acc2':'acc1';
  takeInv(id); if(P.equip[slot]) addInv(P.equip[slot]); P.equip[slot]=id;
  if(slot==='weapon'&&WKIND[it.kind].twoHand&&P.equip.shield){ addInv(P.equip.shield); P.equip.shield=null; logMsg('ถอดโล่ออกเพราะใช้อาวุธสองมือ','sys'); }
  sfx('pickup'); logMsg(`สวม ${it.name}`,'sys'); afterEquipChange();
}
function unequip(slot){ const id=P.equip[slot]; if(!id) return; addInv(id); P.equip[slot]=null; sfx('pop'); logMsg(`ถอด ${ITEMS[id].name}`,'sys'); afterEquipChange(); }
function fixEquipForJob(){
  Object.keys(P.equip).forEach(sl=>{ const id=P.equip[sl]; if(!id) return; const it=ITEMS[id]; if(it.jobs&&!it.jobs.includes(P.job)){ addInv(id); P.equip[sl]=null; } });
  if(!P.equip.weapon){ P.equip.weapon=STARTER[P.job]; logMsg(`ได้รับ ${ITEMS[STARTER[P.job]].name} สำหรับอาชีพใหม่`,'drop'); }
  if(weapon().twoHand&&P.equip.shield){ addInv(P.equip.shield); P.equip.shield=null; }
}

