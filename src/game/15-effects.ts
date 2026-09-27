/* ---------- effects ---------- */
function shout(txt){
  if(hero.shoutTxt) hero.shoutTxt.destroy();
  const o=S.add.text(hero.pos.x,hero.pos.y-80,txt.replace('!!',' !!'),{fontFamily:'Chakra Petch',fontSize:'11px',color:'#ffffff',backgroundColor:'rgba(40,44,56,0.88)',padding:{x:6,y:2},resolution:TXT_RES}).setOrigin(.5,1).setDepth(62500);
  hero.shoutTxt=o; const ev=S.time.addEvent({delay:16,loop:true,callback:()=>o.setPosition(hero.pos.x,hero.pos.y-80)});
  S.tweens.add({targets:o,alpha:0,delay:1100,duration:300,onComplete:()=>{ ev.remove(); if(hero.shoutTxt===o) hero.shoutTxt=null; o.destroy(); }});
}
function fxSlash(m){
  const g=S.add.graphics({x:m.pos.x,y:m.pos.y-16}).setDepth(62000);
  g.lineStyle(4,0xffffff,1).beginPath().arc(0,0,15,-2.5,-.3).strokePath(); g.lineStyle(2,0xfff0a0,1).beginPath().arc(0,0,11,-2.4,-.4).strokePath();
  S.tweens.add({targets:g,scale:1.5,alpha:0,duration:220,onComplete:()=>g.destroy()});
}
function fxBurst(e,color,tiles,sparks){
  const g=S.add.graphics({x:e.pos.x,y:e.pos.y-8}).setDepth(61800);
  const R=tiles*T; g.fillStyle(color,.32).fillEllipse(0,0,R*2,R*1.1); g.lineStyle(3,color,1).strokeEllipse(0,0,R*2,R*1.1);
  g.setScale(.15); S.tweens.add({targets:g,scale:1,alpha:{from:1,to:0},duration:420,ease:'Quad.Out',onComplete:()=>g.destroy()});
  if(sparks) for(let i=0;i<10;i++){ const s=S.add.image(e.pos.x,e.pos.y-10,'spark').setDepth(61900).setTint(color); const an=Math.random()*Math.PI*2;
    S.tweens.add({targets:s,x:e.pos.x+Math.cos(an)*R,y:e.pos.y-10+Math.sin(an)*R*.55,alpha:0,duration:rnd(300,500),onComplete:()=>s.destroy()}); }
}
function fxArrow(from,to,onHit){
  const x0=from.pos.x, y0=from.pos.y-(from.isHero?36:26), x1=to.pos.x, y1=to.pos.y-(to.def&&to.def.fly?24:14);
  const a=S.add.image(x0,y0,'arrow').setDepth(62000).setRotation(Math.atan2(y1-y0,x1-x0));
  S.tweens.add({targets:a,x:x1,y:y1,duration:Math.max(80,Math.hypot(x1-x0,y1-y0)/0.75),onComplete:()=>{ a.destroy(); onHit&&onHit(); }});
}
function fxArrowRain(cx,cy){
  sfx('arrow');
  for(let i=0;i<12;i++){ const x=cx*T+16+rnd(-40,40), y=cy*T+22+rnd(-26,26);
    const a=S.add.image(x+30,y-160,'arrow').setDepth(62000).setRotation(Math.atan2(160,-30));
    S.tweens.add({targets:a,x,y,delay:i*22,duration:200,onComplete:()=>{ a.destroy(); }}); }
}
function fxBolt(m,elem,onHit){
  const x=m.pos.x, y=m.pos.y-(m.def.fly?24:14);
  if(elem==='Wind'){
    const g=S.add.graphics().setDepth(62000); const pts=[[x+rnd(-8,8),y-180]]; for(let i=1;i<7;i++) pts.push([x+rnd(-12,12),y-180+i*28]); pts.push([x,y]);
    g.lineStyle(5,0xfff08a,.6); g.strokePoints(pts.map(p=>({x:p[0],y:p[1]}))); g.lineStyle(2,0xffffff,1); g.strokePoints(pts.map(p=>({x:p[0],y:p[1]})));
    S.tweens.add({targets:g,alpha:0,duration:160,onComplete:()=>g.destroy()}); fxBurst(m,0xfff08a,.6); onHit&&onHit(); return;
  }
  const tint=elem==='Fire'?0xff7a2a:0x9fe3ff;
  const o=S.add.image(x+rnd(-14,14),y-160,'orb').setDepth(62000).setTint(tint).setScale(elem==='Fire'?1.1:.8);
  S.tweens.add({targets:o,x,y,duration:170,ease:'Quad.In',onComplete:()=>{ o.destroy(); fxBurst(m,tint,.6); onHit&&onHit(); }});
}
function floatText(x,y,txt,kind){
  const st={dmg:['#ffffff',14],crit:['#ffd84a',18],hurt:['#ff6b5e',14],miss:['#d6e4ff',12],heal:['#8dff9f',14],magic:['#e4d2ff',15],sp:['#9cc8ff',13]}[kind]||['#fff',14];
  const o=S.add.text(x,y,txt,{fontFamily:'Silkscreen, Chakra Petch',fontSize:st[1]+'px',color:st[0],stroke:'#1d130a',strokeThickness:4,resolution:TXT_RES}).setOrigin(.5).setDepth(62000);
  const vx=rnd(-18,18), s={t:0}; if(kind==='crit') o.setScale(1.3);
  S.tweens.add({targets:s,t:1,duration:kind==='heal'?900:760,onUpdate:()=>{ o.x=x+vx*s.t; o.y=y-Math.sin(Math.min(s.t*1.6,1)*Math.PI*.5)*26+Math.max(0,s.t-.62)*40; o.setAlpha(s.t>.7?1-(s.t-.7)/.3:1); },onComplete:()=>o.destroy()});
}
function emote(e,glyph){
  const c=S.add.container(e.pos.x,e.pos.y-56).setDepth(62000);
  const g=S.add.graphics(); g.fillStyle(0x2a1a0c,1).fillRoundedRect(-13,-12,26,21,6); g.fillStyle(0xfffbef,1).fillRoundedRect(-12,-11,24,19,5); g.fillTriangle(-3,7,3,7,0,12);
  const col={'♥':'#e2524a','!':'#e2524a','?':'#4f8fe6','♪':'#8a5bd6','…':'#6f573b','★':'#e0a51c'}[glyph]||'#3a2816';
  const tx=S.add.text(0,-1,glyph,{fontFamily:'Chakra Petch',fontSize:'14px',color:col,fontStyle:'bold',resolution:TXT_RES}).setOrigin(.5);
  c.add([g,tx]); c.setScale(.2);
  S.tweens.add({targets:c,scale:1,duration:200,ease:'Back.Out'});
  const oy=()=>e.spr.displayHeight+8+(e.def&&e.def.fly?12:0);
  const follow=S.time.addEvent({delay:16,loop:true,callback:()=>c.setPosition(e.pos.x,e.pos.y-oy())});
  S.time.delayedCall(2400,()=>{ follow.remove(); S.tweens.add({targets:c,alpha:0,duration:200,onComplete:()=>c.destroy()}); });
}
function sayBubble(txt){
  if(hero.bubble) hero.bubble.destroy();
  const b=S.add.text(hero.pos.x,hero.pos.y-70,txt,{fontFamily:'Chakra Petch',fontSize:'11px',color:'#3a2816',backgroundColor:'#fffbef',padding:{x:5,y:3},resolution:TXT_RES,wordWrap:{width:150},align:'center'}).setOrigin(.5,1).setDepth(62000);
  hero.bubble=b; const ev=S.time.addEvent({delay:16,loop:true,callback:()=>b.setPosition(hero.pos.x,hero.pos.y-70)});
  S.time.delayedCall(4000,()=>{ ev.remove(); if(hero.bubble===b) hero.bubble=null; b.destroy(); });
}
function spawnLeaf(){
  const cam=S.cameras.main.worldView; const vis=canopies.filter(c=>c.x>cam.x-40&&c.x<cam.right+40&&c.y>cam.y&&c.y<cam.bottom+80); if(!vis.length) return;
  const c=vis[irnd(0,vis.length-1)], th=MAP.theme==='harvest', bloom=c.texture.key==='canopyBloom';
  const l=S.add.image(c.x+rnd(-26,26),c.y-rnd(20,50),bloom?'petal':'leaf').setDepth(50500+c.y)
    .setTint(bloom?[0xffb6d0,0xff8fb8,0xfff0f6][irnd(0,2)]:th?[0xd9822b,0xf0a83a,0xc9a02b,0xa4521e][irnd(0,3)]:[0x6cc152,0x9ad65f,0xe0b84a][irnd(0,2)]);
  const ph=Math.random()*6, o={t:0}, x0=l.x, y0=l.y, fall=rnd(60,70);
  S.tweens.add({targets:o,t:1,duration:rnd(2600,3600),onUpdate:()=>{ l.x=x0+Math.sin(o.t*8+ph)*10+o.t*14; l.y=y0+o.t*fall; l.angle=Math.sin(o.t*10+ph)*50; l.setAlpha(o.t>.75?(1-o.t)*4:1); },onComplete:()=>l.destroy()});
}
function showHover(txt,e){ S.hover.setText(txt).setVisible(true); S.hover.ent=e; }
function hideHover(){ if(S&&S.hover){ S.hover.setVisible(false); S.hover.ent=null; } }
function levelFx(job){
  const x=hero.pos.x, y=hero.pos.y;
  const p=S.add.image(x,y+4,'pillar').setOrigin(.5,1).setDepth(58000).setAlpha(0).setScale(.4,1).setTint(job?0xb8f58a:0xfff0a8).setBlendMode(Phaser.BlendModes.ADD);
  S.tweens.add({targets:p,alpha:1,scaleX:1,duration:220,yoyo:true,hold:500,onComplete:()=>p.destroy()});
  const tx=S.add.text(x,y-60,job?'JOB LV UP':'LEVEL UP',{fontFamily:'Silkscreen',fontSize:'16px',color:job?'#c9ff9a':'#fff3a6',stroke:'#3a2410',strokeThickness:4,resolution:TXT_RES}).setOrigin(.5).setDepth(62000);
  S.tweens.add({targets:tx,y:y-84,alpha:{from:1,to:0},duration:1500,ease:'Quad.In',onComplete:()=>tx.destroy()});
  sfx(job?'job':'level');
}
function jobFx(job){
  const x=hero.pos.x, y=hero.pos.y; S.cameras.main.flash(400,255,255,240);
  const p=S.add.image(x,y+6,'pillar').setOrigin(.5,1).setDepth(58000).setAlpha(0).setScale(.6,1.6).setBlendMode(Phaser.BlendModes.ADD);
  S.tweens.add({targets:p,alpha:1,scaleX:1.6,duration:300,yoyo:true,hold:1200,onComplete:()=>p.destroy()});
  fxBurst(hero,0xfff0a8,3,true);
  const tx=S.add.text(x,y-70,job.toUpperCase(),{fontFamily:'Silkscreen',fontSize:'22px',color:'#fff3a6',stroke:'#3a2410',strokeThickness:5,resolution:TXT_RES}).setOrigin(.5).setDepth(62000).setScale(.3);
  S.tweens.add({targets:tx,scale:1,duration:400,ease:'Back.Out'}); S.tweens.add({targets:tx,alpha:0,y:y-96,delay:1800,duration:700,onComplete:()=>tx.destroy()});
  sfx('jobchange'); emote(hero,'★');
}

