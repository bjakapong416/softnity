/* ============================================================
   Monsters
   ============================================================ */
function randomSpot(){
  const ent=[[3,pathRow[3]],[W-4,pathRow[W-4]],[npc?npc.tx:5,npc?npc.ty:30]];
  for(let i=0;i<400;i++){ const x=irnd(3,W-4), y=irnd(3,H-4); if(blocked(x,y)) continue; if(ent.some(([a,b])=>Math.hypot(x-a,y-b)<9)) continue; return [x,y]; } return [30,20];
}
function spawnMob(key,def,at,summoned){
  const [x,y]=at||randomSpot();
  const m=makeEnt(key,x,y); Object.assign(m,{key,def,hp:def.hp,home:[x,y],speed:def.speed||300,ph:Math.random()*6,sc:1,loot:[],nextThink:0,aggro:false,dead:false,summoned:!!summoned,sumDone:{}});
  if(def.fly) m.spr.play({key:'moth-fly',startFrame:irnd(0,1)}); else if(def.anim) m.spr.play({key:def.anim,startFrame:irnd(0,1)});
  m.spr.setInteractive({useHandCursor:true}).setData('kind','mob').setData('ent',m);
  m.bar=S.add.graphics().setDepth(59000);
  if(!def.boss) m.nameTxt=S.add.text(0,0,def.name,{fontFamily:'Chakra Petch',fontSize:'9px',color:'#ffffff',stroke:'#1a1426',strokeThickness:3,resolution:TXT_RES}).setOrigin(.5,0).setDepth(59100);
  if(def.boss){ m.aura=S.add.image(x,y,'ring').setDepth(1.5).setTint(0xffd35a).setScale(2.4,2.2);
    m.label=S.add.text(0,0,`★ ${def.name} Lv ${def.lv}`,{fontFamily:'Chakra Petch',fontSize:'11px',fontStyle:'bold',color:'#ffe38a',stroke:'#3a2410',strokeThickness:3,resolution:TXT_RES}).setOrigin(.5,1).setDepth(59600); }
  mobs.push(m); return m;
}
function mobShot(m,onHit){
  const x0=m.pos.x,y0=m.pos.y-16,x1=hero.pos.x,y1=hero.pos.y-30;
  const o=S.add.image(x0,y0,'arrow').setDepth(62000).setTint(0x8ee06a).setRotation(Math.atan2(y1-y0,x1-x0));
  S.tweens.add({targets:o,x:x1,y:y1,duration:Math.max(120,Math.hypot(x1-x0,y1-y0)/0.5),onComplete:()=>{ o.destroy(); onHit(); }});
}
function summonMinions(m){
  const s=m.def.summon; emote(m,'!'); toast(`${m.def.name} เรียกลูกน้องออกมา!`); logMsg(`${m.def.name} เรียก ${MONSTERS[s.key].name} ออกมา ${s.n} ตัว`,'warn');
  for(let i=0;i<s.n;i++){ for(let k=0;k<12;k++){ const x=m.tx+irnd(-2,2), y=m.ty+irnd(-2,2); if(blocked(x,y)) continue;
    const mm=spawnMob(s.key,MONSTERS[s.key],[x,y],true); mm.aggro=true; mm.sc=.3; S.tweens.add({targets:mm,sc:1,duration:300,ease:'Back.Out'}); break; } }
}
function updateMob(m,t){
  if(m.dead) return; const def=m.def;
  if(!m.aggro && def.aggressive && !MAP.starter && !hero.dead && cheb(m,hero)<=6){ m.aggro=true; m.path=[]; emote(m,'!'); }
  if(m.aggro){
    const dd=cheb(m,hero), rng=def.range||1;
    if(hero.dead||dd>13||(def.immobile&&dd>rng+3)){ m.aggro=false; return; }
    if(def.summon) def.summon.at.forEach((th,i)=>{ if(!m.sumDone[i]&&m.hp<def.hp*th){ m.sumDone[i]=true; summonMinions(m); } });
    if(def.coward && m.hp<def.hp*.2 && dd<=3){ if(!m.moving){ const fx=clamp(m.tx+Math.sign(m.tx-hero.tx||1)*4,2,W-3), fy=clamp(m.ty+Math.sign(m.ty-hero.ty||1)*4,2,H-3);
        const p=findPath(m.tx,m.ty,fx,fy,0,800); if(p){ walk(m,p.slice(0,4)); if(!m.fled){ m.fled=true; emote(m,'…'); } } } return; }
    if(dd<=rng){ if(!m.moving){ m.path=[]; face(m,hero.tx,hero.ty); if(t>=(m.nextAtk||0)){ m.nextAtk=t+def.delay;
        if(rng>1&&dd>1) mobShot(m,()=>{ if(!m.dead&&cheb(m,hero)<=rng+1) hurtHero(m); });
        else { lunge(m); S.time.delayedCall(140,()=>{ if(!m.dead&&cheb(m,hero)<=Math.max(1,rng)) hurtHero(m); }); } } } }
    else if(!def.immobile && !m.moving){ const p=findPath(m.tx,m.ty,hero.tx,hero.ty,1,2500); if(p) walk(m,p.slice(0,2)); else m.aggro=false; }
    return;
  }
  if(def.immobile) return;
  if(m.moving||t<m.nextThink) return;
  m.nextThink=t+rnd(1800,4800);
  if(m.def.looter && Math.random()<.6){
    const it=items.find(i=>Math.max(Math.abs(i.tx-m.tx),Math.abs(i.ty-m.ty))<=5 && !i.claimed);
    if(it){ const p=findPath(m.tx,m.ty,it.tx,it.ty,0,1500); if(p){ it.claimed=m; walk(m,p,()=>{ if(items.includes(it)&&m.tx===it.tx&&m.ty===it.ty&&!m.dead){ removeItem(it); m.loot.push(it.id); emote(m,'♪'); } it.claimed=null; }); return; } }
  }
  if(Math.random()<.35) return;
  for(let i=0;i<8;i++){ const x=m.home[0]+irnd(-5,5), y=m.home[1]+irnd(-5,5); if(!blocked(x,y)){ const p=findPath(m.tx,m.ty,x,y,0,800); if(p&&p.length<=8){ walk(m,p); return; } } }
}
function lunge(m){ const dx=(hero.pos.x-m.pos.x)*.18, dy=(hero.pos.y-m.pos.y)*.18; S.tweens.add({targets:m.pos,x:m.pos.x+dx,y:m.pos.y+dy,duration:90,yoyo:true}); }
function killMob(m){
  m.dead=true; m.path=[]; m.bar.clear(); if(m.nameTxt) m.nameTxt.setVisible(false); m.shadow.setVisible(false); if(target===m) target=null; if(pendingSkill&&pendingSkill.tgt===m) pendingSkill=null;
  m.spr.disableInteractive(); sfx('pop'); S.tweens.killTweensOf(m.pos);
  S.tweens.add({targets:m.spr,alpha:0,scaleY:.2,scaleX:1.4,duration:380,onComplete:()=>m.spr.setVisible(false)});
  if(m.label) m.label.setVisible(false); if(m.aura) m.aura.setVisible(false);
  gainExp(m.def); questEvent('kill',m.key);
  m.def.drops.forEach(([id,rate])=>{ if(Math.random()*10000<rate) dropItem(id,m); });
  m.loot.forEach(id=>dropItem(id,m)); m.loot=[];
  if(m.summoned){ S.time.delayedCall(420,()=>{ if(m.nameTxt) m.nameTxt.destroy(); m.spr.destroy(); m.shadow.destroy(); m.bar.destroy(); const i=mobs.indexOf(m); if(i>=0) mobs.splice(i,1); }); return; }
  const rs=m.def.respawn||RESPAWN_MS;
  if(m.def.boss) announce(`<b>${P.name}</b> ปราบ <em>${m.def.name}</em> สำเร็จ!`);
  if(m.def.boss){ S.cameras.main.shake(250,.008); logMsg(`ปราบ ${m.def.name} สำเร็จ! จะกลับมาอีกใน ${Math.round(rs[0]/1000)}–${Math.round(rs[1]/1000)} วินาที`,'sys'); toast(`ปราบ ${m.def.name} สำเร็จ!`); }
  S.time.delayedCall(irnd(rs[0],rs[1]),()=>respawnMob(m));
}
function respawnMob(m){
  const [x,y]=m.def.boss?nearFree(m.home[0],m.home[1]):randomSpot(); S.tweens.killTweensOf(m.pos);
  Object.assign(m,{tx:x,ty:y,home:m.def.boss?m.home:[x,y],hp:m.def.hp,dead:false,aggro:false,moving:false,path:[],sumDone:{},fled:false}); m.pos.x=x*T+16; m.pos.y=y*T+27;
  m.spr.setVisible(true).setAlpha(0).clearTint().setFrame(0).setInteractive({useHandCursor:true}); m.shadow.setVisible(true);
  if(m.label) m.label.setVisible(true); if(m.aura) m.aura.setVisible(true);
  if(m.def.boss) announce(`<em>${m.def.name}</em> ปรากฏตัวที่สะพานหิน ${MAP.name}!`);
  if(m.def.boss){ logMsg(`${m.def.name} ปรากฏตัวอีกครั้งที่ริมสะพานหิน!`,'warn'); toast(`${m.def.name} ปรากฏตัวแล้ว!`); }
  if(m.def.fly) m.spr.play({key:'moth-fly',startFrame:irnd(0,1)}); else if(m.def.anim) m.spr.play({key:m.def.anim,startFrame:irnd(0,1)});
  S.tweens.add({targets:m.spr,alpha:1,duration:500}); m.sc=.3; S.tweens.add({targets:m,sc:1,duration:400,ease:'Back.Out'});
}
function drawMobBar(m){ m.bar.clear(); if(m.hp>=m.def.hp) return; const w=m.def.boss?56:26,x=m.pos.x-w/2,y=m.pos.y+3;
  m.bar.fillStyle(0x2a1a0c,1).fillRect(x-1,y-1,w+2,5); m.bar.fillStyle(0xe2524a,1).fillRect(x,y,Math.max(1,w*m.hp/m.def.hp),3); }
function drawHeroBars(t){ const g=hero.bars, d=derived(), w=28, x=hero.pos.x-w/2, y=hero.pos.y+3; g.clear();
  g.fillStyle(0x1d130a,1).fillRect(x-1,y-1,w+2,8);
  const hr=P.hp/d.maxHP; g.fillStyle(hr<.25?0xff8a3d:0x57d15b,1).fillRect(x,y,Math.max(0,w*hr),3);
  g.fillStyle(0x4f8fe6,1).fillRect(x,y+3,Math.max(0,w*P.sp/d.maxSP),3);
  if(hero.cast){ const c=hero.cast, pr=clamp((t-c.start)/(c.until-c.start),0,1), cy=hero.pos.y-74; g.fillStyle(0x1d130a,1).fillRect(x-1,cy-1,w+2,5); g.fillStyle(0xf0bd3f,1).fillRect(x,cy,w*pr,3); } }

