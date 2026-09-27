/* ---------- hero ---------- */
function heroDir(){ const f=hero.facing; return f.dx!==0?'side':(f.dy<0?'up':'down'); }
function face(e,tx,ty){ const dx=Math.sign(tx-e.tx), dy=Math.sign(ty-e.ty); if(dx||dy) e.facing={dx,dy}; }
function groundClick(wx,wy){
  const tx=Math.floor(wx/T), ty=Math.floor(wy/T); if(tx<0||ty<0||tx>=W||ty>=H) return;
  standUp(); cancelCast(); target=null; pending=null; pendingSkill=null;
  const p=findPath(hero.tx,hero.ty,tx,ty,0,6000); if(!p) return;
  const last=p.length?p[p.length-1]:[hero.tx,hero.ty];
  clickMarker.setVisible(true).setPosition(last[0]*T+16,last[1]*T+26).setScale(.4).setAlpha(1);
  S.tweens.add({targets:clickMarker,scale:1,alpha:0,duration:450});
  walk(hero,p);
}
function setTarget(m){ if(!m||m.dead) return; standUp(); pending=null; target=m; hero.chaseKey=null; }
function goPickup(it){ standUp(); target=null; pending={type:'item',it}; const p=findPath(hero.tx,hero.ty,it.tx,it.ty,1); walk(hero,p||[]); }
function goTalk(ref){ standUp(); target=null; pendingSkill=null; pending={type:'talk',ref}; const p=findPath(hero.tx,hero.ty,ref.ent.tx,ref.ent.ty,1); walk(hero,p||[]); }
function goNpc(){ standUp(); target=null; pendingSkill=null; pending={type:'npc'}; const p=findPath(hero.tx,hero.ty,npc.tx,npc.ty,1); walk(hero,p||[]); }
function standUp(){ if(hero.sitting){ hero.sitting=false; $('sitBtn').classList.remove('on'); } }
function chaseTo(m,range,t){
  const k=m.tx+','+m.ty+','+range;
  if(!hero.moving || hero.chaseKey!==k){ hero.chaseKey=k; const p=findPath(hero.tx,hero.ty,m.tx,m.ty,range); if(p) walk(hero,p); else { bot.ignore.set(m,t+8000); return false; } }
  return true;
}
function updateHero(t){
  if(hero.dead){ hero.spr.anims.stop(); return; }
  if(!hero.moving && !hero.cast){ const [hx,hy]=heldDir(); if(hx||hy){ target=null; pending=null; pendingSkill=null; standUp(); const n=nextHeldTile(); if(n) walk(hero,[n]); } }
  // casting
  if(hero.cast){
    if(t>=hero.cast.until){ const c=hero.cast; hero.cast=null; executeSkill(c.id,c.lv,c.tgt); }
    else { playHero('cast'); return; }
  }
  // queued skill
  if(pendingSkill){
    const ps=pendingSkill, sk=SKILLS[ps.id];
    if(ps.self){ if(!hero.moving){ pendingSkill=null; beginSkill(ps,t); } }
    else if(ps.tgt.dead){ pendingSkill=null; }
    else { const rng=skillRange(sk,ps.lv);
      if(canHit(ps.tgt,rng)){ if(!hero.moving){ face(hero,ps.tgt.tx,ps.tgt.ty); pendingSkill=null; beginSkill(ps,t); } else hero.path=[]; }
      else if(!chaseTo(ps.tgt,chaseRange(ps.tgt,rng),t)) pendingSkill=null; }
  }
  else if(target && botNoMelee()){
    if(target.dead) target=null;
    else { const sid=botSkill(), rng=skillRange(SKILLS[sid],skLv(sid));
      if(t<bot.kiteUntil){ /* retreating */ }
      else if(canHit(target,rng)){ if(hero.moving) hero.path=[]; else face(hero,target.tx,target.ty); }
      else if(!chaseTo(target,chaseRange(target,rng),t)) target=null; }
  }
  else if(target){
    const d=derived();
    if(target.dead){ target=null; }
    else if(canHit(target,d.range)){
      if(!hero.moving){ hero.path=[]; face(hero,target.tx,target.ty);
        if(t>=(hero.nextAtk||0)){ hero.nextAtk=t+d.delay; hero.atkUntil=t+230; playHero('atk');
          const m=target; if(d.weapon.ranged){ sfx('arrow'); fxArrow(hero,m,()=>physAttack(m,{canCrit:true})); } else S.time.delayedCall(110,()=>physAttack(m,{canCrit:true})); } }
      else hero.path=[];
    } else if(!chaseTo(target,chaseRange(target,d.range),t)) target=null;
  }
  if(pending && !hero.moving){
    if(pending.type==='item'){ const it=pending.it; if(items.includes(it) && Math.max(Math.abs(hero.tx-it.tx),Math.abs(hero.ty-it.ty))<=1) pickup(it); pending=null; }
    else if(pending.type==='npc'){ if(cheb(hero,npc)<=1){ face(hero,npc.tx,npc.ty); openNpc(); } pending=null; }
    else if(pending.type==='talk'){ const ref=pending.ref; pending=null; if(cheb(hero,ref.ent)<=1){ face(hero,ref.ent.tx,ref.ent.ty); emote(ref.ent,'!'); ref.onTalk(); } }
  }
  if(t<(hero.atkUntil||0)) return;
  const st=hero.moving?'walk':hero.sitting?'sit':'idle';
  playHero(st);
}

/* ---------- damage ---------- */
function aggroMob(m){ if(!m.aggro){ m.aggro=true; m.path=[]; } }
function physAttack(m,o={}){
  if(m.dead||hero.dead) return; if(weightPct()>90){ floatText(hero.pos.x,hero.pos.y-80,'หนักเกินไป','miss'); return; } const d=derived(); aggroMob(m);
  const crit=o.canCrit && Math.random()*100<d.crit;
  if(!crit){ const hit=clamp(80+d.hit-m.def.flee+(o.hitBonus||0),5,95); if(Math.random()*100>=hit){ floatText(m.pos.x,m.pos.y-(m.def.fly?42:30),'Miss','miss'); sfx('miss'); return; } }
  const rmin=Math.min(.8+d.dex*.0025,1.05);
  let dmg=(d.satk+d.weapon.atk*rnd(rmin,1.05)+d.mastery)*d.weapon.size[m.def.size]*(o.pct||100)/100*elemMod(o.elem||'Neutral',m.def.elem);
  dmg = crit ? dmg*1.4 : dmg*(1-m.def.hardDef/100)-m.def.softDef;
  dealDamage(m,Math.max(1,Math.round(dmg)),crit?'crit':'dmg',o.sound,o.combo);
}
function magicAttack(m,o){
  if(m.dead||hero.dead) return; const d=derived(); aggroMob(m);
  let dmg=rnd(d.matkMin,d.matkMax+.99)*(o.pct||100)/100*elemMod(o.elem||'Neutral',m.def.elem)*(1-m.def.hardMdef/100)-m.def.softMdef;
  dealDamage(m,Math.max(1,Math.floor(dmg)),'magic',o.sound,o.combo);
}
function dealDamage(m,dmg,kind,snd,combo){
  trackDps(dmg);
  if(combo){ combo.total+=dmg; combo.hits++; }
  m.hp-=dmg; floatText(m.pos.x,m.pos.y-(m.def.fly?42:30),String(dmg),kind); sfx(snd||(kind==='crit'?'crit':'hit'));
  m.spr.setTintFill(0xffffff); S.time.delayedCall(70,()=>{ if(!m.dead) m.spr.clearTint(); });
  if(m.def.hurtFrame){ m.spr.setFrame(1); S.time.delayedCall(260,()=>{ if(!m.dead) m.spr.setFrame(0); }); }
  if(m.hp<=0) killMob(m);
}
function hurtHero(m){
  if(hero.dead) return; const d=derived();
  if(Math.random()*100<d.pd){ floatText(hero.pos.x,hero.pos.y-68,'Lucky','miss'); return; }
  const hit=clamp(80+m.def.hit-d.flee,5,95); if(Math.random()*100>=hit){ floatText(hero.pos.x,hero.pos.y-68,'Miss','miss'); sfx('miss'); return; }
  let dmg=irnd(m.def.atk[0],m.def.atk[1])*(1-d.hardDef/100)-d.softDef; dmg=Math.max(1,Math.round(dmg));
  P.hp=Math.max(0,P.hp-dmg); floatText(hero.pos.x,hero.pos.y-68,String(dmg),'hurt'); sfx('hurt'); standUp();
  try{ if(navigator.vibrate) navigator.vibrate(25); }catch(_){}
  if(hero.cast){ cancelCast(); floatText(hero.pos.x,hero.pos.y-82,'ร่ายถูกขัด','miss'); }
  hero.spr.setTintFill(0xff7777); S.time.delayedCall(80,()=>hero.spr.clearTint());
  if(!target && !hero.moving && !pending && !pendingSkill) setTarget(m);
  if(P.hp<=0) heroDie();
  refreshBars();
}
function heroDie(){
  hero.dead=true; hero.path=[]; target=null; pending=null; pendingSkill=null; cancelCast(); sfx('die');
  hero.spr.setAngle(-90).setTint(0x9a9a9a); hero.spr.setFrame(0);
  mobs.forEach(m=>{ m.aggro=false; });
  const loss = P.job==='Novice' ? 0 : Math.floor(baseNeed(P.lv)*.01);
  if(loss){ P.exp=Math.max(0,P.exp-loss); logMsg(`คุณหมดสติ เสีย Base EXP ${loss} (1%)`,'warn'); } else logMsg('คุณหมดสติ Novice ไม่เสีย EXP เมื่อตาย','warn');
  refreshUI();
  if(P.bot.on && P.bot.revive){ setBotState('หมดสติ กำลังกลับจุดเกิด'); S.time.delayedCall(2500,()=>{ if(hero.dead) respawn(); }); return; }
  openDialog('ผู้ดูแลการเดินทาง','คุณหมดสติกลางทุ่ง จะกลับไปยังจุดเกิดหรือไม่',[['กลับจุดเกิด',respawn]], false);
}
function respawn(){
  closeWin('dialog'); hero.dead=false; hero.spr.setAngle(0).clearTint();
  const d=derived(); P.hp=Math.floor(d.maxHP/2); refreshUI(); warpToSave();
}
function warpTo(x,y){ S.tweens.killTweensOf(hero.pos); hero.path=[]; hero.moving=false; hero.tx=x; hero.ty=y; hero.pos.x=x*T+16; hero.pos.y=y*T+27; target=null; pending=null; pendingSkill=null; cancelCast();
  S.cameras.main.flash(250,255,250,230); sfx('warp'); }

