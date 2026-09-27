/* ============================================================
   Bot
   ============================================================ */
const bot={ next:0, pauseUntil:0, ignore:new Map(), resting:false, wp:null, anchor:null, potionAt:0, state:'', kiteAt:0, kiteUntil:0, meleeFallback:false, lastSeen:0, flyAt:0, noFlyWarned:false };
function botNoMelee(){ return P.bot.on && P.bot.style==='skill' && !bot.meleeFallback && !!botSkill(); }
function pauseBot(){ if(P.bot.on&&S&&started){ setBot(false); toast('หยุดบอทแล้ว เพราะมีการควบคุมเอง'); } }
function setBot(on){
  if(!started) return; P.bot.on=on; bot.pauseUntil=0; bot.resting=false; bot.wp=null;
  bot.meleeFallback=false; bot.kiteUntil=0; bot.lastSeen=S?S.time.now:0; bot.noFlyWarned=false;
  if(on){ bot.anchor=[hero.tx,hero.ty]; logMsg('เริ่มบอทอัตโนมัติ','sys'); emote(hero,'!'); setBotState('กำลังเริ่ม'); }
  else { logMsg('หยุดบอท','sys'); standUp(); target=null; pending=null; }
  persist(); refreshBotUI();
}
function setBotState(s){ if(bot.state!==s){ bot.state=s; $('botPillText').textContent='บอท: '+s; } }
function botSkill(){
  const B=P.bot; if(B.skill==='none') return null;
  if(B.skill!=='auto') return skLv(B.skill)>0?B.skill:null;
  const list=JOB_SKILLS[P.job].filter(id=>{ const s=SKILLS[id]; return s.type!=='passive'&&s.type!=='self'&&skLv(id)>0; });
  if(!list.length) return null;
  if(target){ list.sort((a,b)=>elemMod(SKILLS[b].elem,target.def.elem)-elemMod(SKILLS[a].elem,target.def.elem)); }
  return list[0];
}
function botThink(t){
  if(t<bot.next) return; bot.next=t+180;
  const B=P.bot;
  if(t<bot.pauseUntil){ $('botPill').classList.add('paused'); setBotState('พักชั่วคราว (ควบคุมเอง)'); return; } $('botPill').classList.remove('paused');
  if(hero.dead||hero.cast||pendingSkill) return;
  if(MAP.town){ setBotState('ในเมืองไม่มีมอนสเตอร์ ออกไปที่ทุ่งก่อน'); return; }
  const d=derived(), hp=100*P.hp/d.maxHP, sp=100*P.sp/d.maxSP;
  const aggro=mobs.filter(m=>!m.dead&&m.aggro&&cheb(m,hero)<=10);
  const hasPot=!!(P.inv.redpot||P.inv.orangepot||P.inv.apple);
  if(B.flyHp>0 && hp<B.flyHp && aggro.length && t>bot.flyAt){
    if(P.inv.flywing){ useItem('flywing'); bot.flyAt=t+1500; bot.lastSeen=t; target=null; pending=null; bot.resting=true; logMsg(`HP ต่ำกว่า ${B.flyHp}% ใช้ Fly Wing หนี`,'warn'); setBotState('หนีด้วย Fly Wing'); return; }
    else if(!bot.noFlyWarned){ bot.noFlyWarned=true; logMsg('Fly Wing หมด ใช้หนีไม่ได้','warn'); } }
  if(B.wing && hp<15 && P.inv.bwing && !(B.potion>0&&hasPot)){ useItem('bwing'); setBotState('หนีกลับจุดเกิด'); bot.resting=true; return; }
  if(B.potion>0 && hp<B.potion && t>bot.potionAt && hasPot){ useItem(P.inv.redpot?'redpot':P.inv.orangepot?'orangepot':'apple'); bot.potionAt=t+700; }
  if(bot.resting){
    if(aggro.length){ bot.resting=false; standUp(); }
    else if(hp>=95 && (sp>=70||d.maxSP<20)){ bot.resting=false; standUp(); }
    else { bot.lastSeen=t; if(!hero.moving){ hero.path=[]; if(!hero.sitting && skLv('basic')>=3) toggleSit(true); } setBotState(skLv('basic')>=3?'นั่งพักฟื้น HP/SP':'ยืนพักฟื้น HP'); return; }
  }
  if(!aggro.length && B.rest>0 && hp<B.rest && (!target||target.dead)){ bot.resting=true; target=null; pending=null; if(hero.moving) hero.path=[]; return; }
  if(target&&!target.dead){ bot.lastSeen=t;
    const id=B.style==='melee'?null:botSkill(), sk=id&&SKILLS[id], lv=id?skLv(id):0, cost=id?sk.sp(lv):0;
    const aoeOk=()=>sk.type!=='selfaoe'||cheb(target,hero)<=2;
    if(!id){ setBotState(`ตีธรรมดาใส่ ${target.def.name}`); return; }
    if(B.style==='skill'){
      if(bot.meleeFallback && P.sp>=Math.max(cost*2,d.maxSP*.5)){ bot.meleeFallback=false; }
      if(B.kite && !bot.meleeFallback && !target.def.immobile && cheb(target,hero)<=1 && t>=bot.kiteAt){
        const dx=Math.sign(hero.tx-target.tx)||(Math.random()<.5?1:-1), dy=Math.sign(hero.ty-target.ty)||(Math.random()<.5?1:-1); let path=null;
        for(const k of [4,3,2]){ const x=clamp(hero.tx+dx*k,2,W-3), y=clamp(hero.ty+dy*k,2,H-3); path=findPath(hero.tx,hero.ty,x,y,0,1500); if(path&&path.length) break; }
        if(path&&path.length){ path=path.slice(0,5); walk(hero,path); bot.kiteAt=t+2200; bot.kiteUntil=t+path.length*170; setBotState(`ถอยห่างจาก ${target.def.name}`); return; }
      }
      if(!bot.meleeFallback && P.sp>=cost){ if(t>=(hero.skillReadyAt||0)&&t>=bot.kiteUntil&&aoeOk()) useSkill(id,true); setBotState(`${sk.kind==='magic'?'ร่ายเวท':'ใช้สกิล'}ใส่ ${target.def.name}`); return; }
      if(!bot.meleeFallback && B.noSp==='rest' && !aggro.length){ target=null; pending=null; bot.resting=true; if(hero.moving) hero.path=[]; setBotState('SP ไม่พอ นั่งพักฟื้น SP'); return; }
      if(!bot.meleeFallback){ bot.meleeFallback=true; logMsg('SP ไม่พอ บอทตีธรรมดาไปก่อนจนกว่า SP จะฟื้น','sys'); }
      setBotState(`ตีธรรมดาใส่ ${target.def.name} (รอ SP)`); return;
    }
    if(sp>=B.spMin && P.sp>=cost && t>=(hero.skillReadyAt||0) && aoeOk()) useSkill(id,true);
    setBotState(`ต่อสู้กับ ${target.def.name}`); return;
  }
  if(pending&&pending.type==='item'&&items.includes(pending.it)){ return; }
  if(B.loot!=='none' && !aggro.length){
    let best=null,bd=1e9; items.forEach(it=>{ if(B.loot==='useful'&&!(ITEMS[it.id].type==='use'||ITEMS[it.id].type==='equip'||ITEMS[it.id].rare)) return; if((bot.ignore.get(it)||0)>t) return; const dd=Math.hypot(it.tx-hero.tx,it.ty-hero.ty); if(dd<bd&&dd<=10){ bd=dd; best=it; } });
    if(best){ if(goPickupSafe(best)) setBotState(`เก็บ ${ITEMS[best.id].name}`); else bot.ignore.set(best,t+8000); return; }
  }
  const pool = aggro.length ? aggro : (B.mode==='all' ? mobs.filter(m=>!m.dead&&(B.targets[m.key]??!m.def.boss)&&dist(m,hero)<=14&&(bot.ignore.get(m)||0)<=t) : []);
  if(pool.length){ bot.lastSeen=t; pool.sort((a,b)=>(dist(a,hero)-(a.aggro?5:0))-(dist(b,hero)-(b.aggro?5:0))); setTarget(pool[0]); bot.wp=null; setBotState(`เข้าโจมตี ${pool[0].def.name}`); return; }
  if(B.flyIdle>0 && t-bot.lastSeen>B.flyIdle*1000 && t>bot.flyAt){
    if(P.inv.flywing){ useItem('flywing'); bot.flyAt=t+1500; bot.lastSeen=t; setBotState('ไม่เจอมอนสเตอร์ ใช้ Fly Wing หาจุดใหม่'); logMsg(`ไม่เจอมอนสเตอร์ ${B.flyIdle} วินาที ใช้ Fly Wing`,'sys'); return; }
    else if(!bot.noFlyWarned){ bot.noFlyWarned=true; logMsg('Fly Wing หมด บอทจะเดินหาแทน','warn'); } }
  if(!hero.moving || !bot.wp){
    for(let i=0;i<6;i++){ let x,y; if(B.roam==='map'){ x=irnd(3,W-4); y=irnd(3,H-4); } else { const a=bot.anchor||[hero.tx,hero.ty]; x=a[0]+irnd(-12,12); y=a[1]+irnd(-12,12); }
      if(blocked(x,y)||Math.hypot(x-hero.tx,y-hero.ty)<6) continue; const p=findPath(hero.tx,hero.ty,x,y,0,9000); if(p&&p.length){ bot.wp=[x,y]; walk(hero,p,()=>{ bot.wp=null; }); break; } }
    setBotState(B.roam==='map'?'วิ่งสำรวจทั่วแมพ':'เดินวนหามอนสเตอร์');
  }
}

