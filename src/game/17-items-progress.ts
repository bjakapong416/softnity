/* ---------- items ---------- */
function dropItem(id,m){
  const tx=clamp(m.tx+irnd(-1,1),0,W-1), ty=clamp(m.ty+irnd(-1,1),0,H-1); const ok=!blocked(tx,ty);
  const it={id,tx:ok?tx:m.tx,ty:ok?ty:m.ty}; const sx=m.pos.x, sy=m.pos.y-10, ex=it.tx*T+16+irnd(-6,6), ey=it.ty*T+22+irnd(-4,4);
  it.spr=S.add.image(sx,sy,'item-'+id).setOrigin(.5,1).setDepth(3).setInteractive({useHandCursor:true}).setData('kind','item').setData('ent',it);
  const IT=ITEMS[id]; if(IT.type==='equip'&&IT.r!=='c'){ const col=Phaser.Display.Color.HexStringToColor(RARITY[IT.r][1]).color;
    it.glow=S.add.image(ex,ey+2,'pillar').setOrigin(.5,1).setDepth(2.9).setScale(.35,.3).setTint(col).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);
    S.tweens.add({targets:it.glow,alpha:{from:.25,to:.8},duration:700,yoyo:true,repeat:-1,delay:480});
    if(IT.r!=='u'){ logMsg(`ดรอป ${IT.name} (${RARITY[IT.r][0]})!`,'drop'); announce(`<b>${P.name}</b> ได้รับ <em>${IT.name}</em> จาก ${m.def.name}!`); } }
  const o={t:0}; S.tweens.add({targets:o,t:1,duration:480,ease:'Quad.Out',onUpdate:()=>{ if(!it.spr.active) return; it.spr.x=sx+(ex-sx)*o.t; it.spr.y=sy+(ey-sy)*o.t-Math.sin(o.t*Math.PI)*26; }});
  items.push(it);
  if(items.length>80){ removeItem(items[0]); }
}
function removeItem(it){ const i=items.indexOf(it); if(i>=0) items.splice(i,1); it.spr.destroy(); if(it.glow) it.glow.destroy(); if(S.hover&&S.hover.ent===it) hideHover(); }
function pickup(it){ gain(`${ITEMS[it.id].name} +1`,'i'); if(weightNow()+itemWeight(it.id)>weightMax()){ toast('กระเป๋าหนักเกินไป เก็บไม่ได้'); return; } removeItem(it); addInv(it.id); sfx('pickup'); lootToast(it.id); logMsg(`เก็บ ${ITEMS[it.id].name} 1 ชิ้น`,'drop'); const IT=ITEMS[it.id]; if(IT.type==='equip'&&IT.r!=='c') toast(`ได้รับ${RARITY[IT.r][0]==='ดี'?'อุปกรณ์':'อุปกรณ์'+RARITY[IT.r][0]} ${IT.name}! เปิดกระเป๋า (I) เพื่อสวม`); refreshUI(); }
function goPickupSafe(it){ standUp(); target=null; const p=findPath(hero.tx,hero.ty,it.tx,it.ty,1); if(!p) return false; pending={type:'item',it}; walk(hero,p); return true; }
function useItem(id){
  if(hero.dead||!P.inv[id]) return; const it=ITEMS[id]; if(it.type!=='use') return;
  const d=derived();
  if(it.heal){ if(P.hp>=d.maxHP){ toast('HP เต็มแล้ว'); return; } const v=irnd(it.heal[0],it.heal[1]); P.hp=Math.min(d.maxHP,P.hp+v); floatText(hero.pos.x,hero.pos.y-68,'+'+v,'heal'); sfx('heal'); }
  if(it.warp){ logMsg('กลับสู่จุดเกิดด้วย Butterfly Wing','sys'); S.time.delayedCall(0,warpToSave); }
  if(it.fly){ const [x,y]=randomSpot(); fxBurst(hero,0xdfe8ff,1,true); warpTo(x,y); mobs.forEach(m=>{ if(m.aggro&&cheb(m,hero)>8) m.aggro=false; }); bot.wp=null; standUp(); }
  P.inv[id]--; if(P.inv[id]<=0) delete P.inv[id]; refreshUI();
}

/* ---------- progression ---------- */
function gainExp(def){
  const pen=(P.lv-def.lv>10)?.5:1, rate=SERVER_RATE*P.rate, b=Math.round(def.exp*rate*pen), j=Math.round(def.jexp*rate*pen), J=JOBS[P.job];
  logMsg(`ได้รับ Base EXP ${b} และ Job EXP ${j}`,'exp'); gain(`EXP Base +${b.toLocaleString()}`); gain(`EXP Job +${j.toLocaleString()}`,'j');
  if(P.lv<BASE_CAP){ P.exp+=b; while(P.lv<BASE_CAP && P.exp>=baseNeed(P.lv)){ P.exp-=baseNeed(P.lv); P.lv++; const pts=Math.floor(P.lv/5)+3; P.points+=pts; levelFx(false);
      const d=derived(); P.hp=d.maxHP; P.sp=d.maxSP; logMsg(`Base Level ${P.lv}! ได้แต้มสเตตัส ${pts} แต้ม`,'sys'); } if(P.lv>=BASE_CAP) P.exp=0; }
  if(P.jlv<J.cap){ P.jexp+=j; while(P.jlv<J.cap && P.jexp>=J.table[P.jlv-1]){ P.jexp-=J.table[P.jlv-1]; P.jlv++; P.skillPts++; levelFx(true); logMsg(`Job Level ${P.jlv}! ได้แต้มสกิล 1 แต้ม`,'sys');
      if(P.job==='Novice'&&P.jlv===10){ toast('Job Lv 10 แล้ว ลง Basic Skill ให้ครบ 9 แล้วไปหาผู้ดูแลการเดินทาง'); }
      if(P.job!=='Novice'&&P.jlv===40){ logMsg('Job Lv 40 แล้ว เปลี่ยนเป็นคลาส 2 ได้ในเฟสถัดไป','sys'); } }
    if(P.jlv>=J.cap) P.jexp=0; }
  persist(); refreshUI();
}
// Regeneration: normal HP every 6s / SP every 8s. Sitting halves the interval AND doubles the amount (x4 overall).
function regenTick(){
  if(hero.dead||!hero.pos) return; const sit=!!hero.sitting; if(weightPct()>50) return; // overweight: no natural regen
  hero.rh=(hero.rh||0)+500; hero.rs=(hero.rs||0)+500;
  if(hero.rh>=(sit?3000:6000)){ hero.rh=0; regen('hp'); }
  if(hero.rs>=(sit?4000:8000)){ hero.rs=0; regen('sp'); }
}
function regen(kind){
  if(hero.dead) return; const d=derived(), s=d.eff, m=hero.sitting?2:1;
  if(kind==='hp'&&P.hp<d.maxHP){ const lv=skLv('hprecovery'), before=P.hp; P.hp=Math.min(d.maxHP,P.hp+(Math.max(1,Math.floor(d.maxHP/200))+Math.floor(s.vit/5)+(lv?5*lv+Math.floor(d.maxHP*.002*lv):0))*m);
    if(hero.sitting&&P.hp>before) floatText(hero.pos.x-10,hero.pos.y-66,'+'+(P.hp-before),'heal'); }
  if(kind==='sp'&&P.sp<d.maxSP){ const lv=skLv('sprecovery'), before=P.sp; P.sp=Math.min(d.maxSP,P.sp+(1+Math.floor(d.maxSP/100)+Math.floor(s.int/6)+(lv?3*lv+Math.floor(d.maxSP*.002*lv):0))*m);
    if(hero.sitting&&P.sp>before) floatText(hero.pos.x+12,hero.pos.y-60,'+'+(P.sp-before),'sp'); }
  refreshBars();
}
function canJobChange(){ return P.job==='Novice' && P.jlv>=10 && skLv('basic')>=9; }
function jobChange(job){
  P.job=job; P.jlv=1; P.jexp=0; P.skillbar=DEFAULT_BAR[job].slice(); skStage=null; fixEquipForJob();
  P.bot.style = job==='Mage' ? 'skill' : 'mixed';
  hero.spr.setTexture(heroTex(),0); if(!customKey()) hero.spr.setScale(HD_KEYS.has(heroTex())?1/HD.K:1); fitHeroScale(); applyHeroGear(); const d=derived(); P.hp=d.maxHP; P.sp=d.maxSP;
  closeWin('dialog'); jobFx(job); announce(`<b>${P.name}</b> เปลี่ยนอาชีพเป็น <em>${job}</em> แล้ว!`); logMsg(`เปลี่ยนอาชีพเป็น ${job} แล้ว! กด K เพื่อลงแต้มสกิลเมื่อ Job Lv เพิ่ม`,'sys');
  persist(); refreshUI();
}
function resetStats(){ let pts=48; for(let L=2;L<=P.lv;L++) pts+=Math.floor(L/5)+3; P.stats={str:1,agi:1,vit:1,int:1,dex:1,luk:1}; P.points=pts; const d=derived(); P.hp=Math.min(P.hp,d.maxHP); P.sp=Math.min(P.sp,d.maxSP); persist(); refreshUI(); }
function resetSkills(){ let back=0; Object.keys(P.skills).forEach(id=>{ const sk=SKILLS[id]; if(!sk||sk.free) return; if(sk.job===P.job){ back+=P.skills[id]; P.skills[id]=0; } }); P.skillPts+=back; skStage=null; persist(); refreshUI(); return back; }
function devJob10(){ if(P.job!=='Novice'){ toast('ใช้ได้เฉพาะ Novice'); return; } const add=Math.max(0,10-P.jlv); P.jlv=10; P.jexp=0; P.skillPts+=add; skStage=null; persist(); refreshUI(); toast(`ข้ามไป Job Lv 10 แล้ว (+${add} แต้มสกิล)`); }

