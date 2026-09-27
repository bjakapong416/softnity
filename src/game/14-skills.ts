/* ============================================================
   Skills
   ============================================================ */
function skillRange(sk,lv){ return sk.range==='weapon' ? derived().range : sk.range ? sk.range(lv) : 0; }
function nearestMob(maxD){
  let best=null,bd=1e9; mobs.forEach(m=>{ if(m.dead) return; const d=dist(m,hero)-(m.aggro?4:0); if(d<bd&&dist(m,hero)<=maxD){ bd=d; best=m; } }); return best;
}
function useSkill(id,fromBot){
  if(!started||hero.dead||!id) return false; const sk=SKILLS[id]; if(!sk||sk.type==='passive') return false;
  const lv=skLv(id); if(!lv){ if(!fromBot) toast(`ยังไม่ได้เรียน ${sk.name} (กด K เพื่อลงแต้ม)`); return false; }
  const now=S.time.now; if(hero.cast||pendingSkill||now<(hero.skillReadyAt||0)) return false;
  if(P.sp<sk.sp(lv)){ if(!fromBot) toast('SP ไม่พอ'); return false; }
  standUp();
  if(sk.type==='self'||sk.type==='selfaoe'){ pendingSkill={id,lv,self:true}; return true; }
  const tgt=(target&&!target.dead)?target:nearestMob(12); if(!tgt){ if(!fromBot) toast('ไม่มีเป้าหมายในระยะ'); return false; }
  target=tgt; pendingSkill={id,lv,tgt}; hero.chaseKey=null; return true;
}
function beginSkill(ps,t){
  const sk=SKILLS[ps.id]; if(P.sp<sk.sp(ps.lv)){ toast('SP ไม่พอ'); return; }
  shout(sk.name+'!!');
  const ct=sk.cast ? sk.cast(ps.lv)*Math.max(0,1-derived().dex/150) : 0;
  if(ct>40){ hero.cast={id:ps.id,lv:ps.lv,tgt:ps.tgt,start:t,until:t+ct}; hero.path=[]; sfx('cast'); }
  else executeSkill(ps.id,ps.lv,ps.tgt);
}
function cancelCast(){ if(hero.cast) hero.cast=null; if(castGfx) castGfx.clear(); }
function executeSkill(id,lv,tgt){
  const sk=SKILLS[id], now=S.time.now; if(hero.dead) return;
  if(sk.type==='target' && (!tgt||tgt.dead)) return;
  const cost=sk.sp(lv); if(P.sp<cost){ toast('SP ไม่พอ'); return; } P.sp-=cost;
  hero.skillReadyAt=now+sk.delay(lv); hero.nextAtk=Math.max(hero.nextAtk||0,now+350); hero.atkUntil=now+260;
  playHero('atk');
  const inArea=(cx,cy,r)=>mobs.filter(m=>!m.dead&&Math.max(Math.abs(m.tx-cx),Math.abs(m.ty-cy))<=r);
  switch(id){
    case 'firstaid': { const d=derived(); P.hp=Math.min(d.maxHP,P.hp+5); floatText(hero.pos.x,hero.pos.y-68,'+5','heal'); sfx('heal'); fxBurst(hero,0x7dff9a,.7); break; }
    case 'bash': fxSlash(tgt); S.cameras.main.shake(90,.004); physAttack(tgt,{pct:sk.pct(lv),hitBonus:sk.hitBonus(lv),sound:'bash'}); break;
    case 'magnum': sfx('boom'); fxBurst(hero,0xff7a2a,2.6,true); S.cameras.main.shake(140,.006);
      inArea(hero.tx,hero.ty,2).forEach(m=>{ physAttack(m,{pct:sk.pct(lv),elem:'Fire',hitBonus:sk.hitBonus(lv),sound:'fire'}); if(!m.dead) knockback(m,hero,2); }); break;
    case 'dstrafe': { const cb={total:0,hits:0,tgt}; for(let i=0;i<2;i++) S.time.delayedCall(i*110,()=>{ if(tgt.dead) return; sfx('arrow'); fxArrow(hero,tgt,()=>physAttack(tgt,{pct:sk.pct(lv),combo:cb})); }); S.time.delayedCall(700,()=>showCombo(cb)); break; }
    case 'ashower': { const cx=tgt.tx, cy=tgt.ty; fxArrowRain(cx,cy); S.time.delayedCall(280,()=>inArea(cx,cy,1).forEach(m=>{ physAttack(m,{pct:sk.pct(lv)}); if(!m.dead) knockback(m,{tx:cx,ty:cy},2); })); break; }
    case 'firebolt': case 'coldbolt': case 'lightning':
      { const cb={total:0,hits:0,tgt}; const n=sk.hits(lv);
      for(let i=0;i<n;i++) S.time.delayedCall(i*150,()=>{ if(tgt.dead) return; fxBolt(tgt,sk.elem,()=>magicAttack(tgt,{pct:100,elem:sk.elem,sound:sk.elem==='Fire'?'fire':sk.elem==='Water'?'ice':'zap',combo:cb})); });
      S.time.delayedCall(n*150+260,()=>showCombo(cb)); break; }
    case 'napalm': { const cx=tgt.tx, cy=tgt.ty; fxBurst(tgt,0xb98cff,1.6,true); inArea(cx,cy,1).forEach(m=>magicAttack(m,{pct:sk.pct(lv),elem:'Neutral'})); break; }
  }
  refreshBars();
}
function knockback(m,from,n){
  let dx=Math.sign(m.tx-from.tx), dy=Math.sign(m.ty-from.ty); if(!dx&&!dy){ dx=hero.facing.dx; dy=hero.facing.dy||1; }
  let x=m.tx,y=m.ty; for(let i=0;i<n;i++){ if(blocked(x+dx,y+dy)) break; x+=dx; y+=dy; }
  if(x===m.tx&&y===m.ty) return;
  S.tweens.killTweensOf(m.pos); m.path=[]; m.moving=false; m.tx=x; m.ty=y;
  S.tweens.add({targets:m.pos,x:x*T+16,y:y*T+27,duration:150,ease:'Quad.Out'});
}
function drawCast(t){
  castGfx.clear(); if(!hero.cast) return; const sk=SKILLS[hero.cast.id];
  const col=Phaser.Display.Color.HexStringToColor(ELEM_COL[sk.elem]||'#b98cff').color, x=hero.pos.x, y=hero.pos.y-3, a=t*.004;
  castGfx.lineStyle(2,col,.9).strokeEllipse(x,y,44,20); castGfx.lineStyle(1,0xffffff,.7).strokeEllipse(x,y,32,14);
  for(let i=0;i<6;i++){ const an=a+i*Math.PI/3; castGfx.fillStyle(col,1).fillRect(x+Math.cos(an)*19-1,y+Math.sin(an)*8.5-1,3,3); }
}

