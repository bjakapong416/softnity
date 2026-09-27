/* ============================================================
   Softnity 3D models + sprite baker (shared by the game and Sprite Studio)
   All models are original, built from primitives.
   ============================================================ */
function SoftnityModels(THREE){
  const toonTex=(()=>{ const d=new Uint8Array([95,95,95,255,175,175,175,255,255,255,255,255]); const t=new THREE.DataTexture(d,3,1); t.minFilter=t.magFilter=THREE.NearestFilter; t.needsUpdate=true; return t; })();
  const cache={};
  const toon=(c,o={})=>{ const k='t'+c+(o.side||''); return cache[k]||(cache[k]=new THREE.MeshToonMaterial(Object.assign({ color:c, gradientMap:toonTex },o))); };
  const std=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({ color:c, roughness:.6 },o));
  const flat=c=>{ const k='f'+c; return cache[k]||(cache[k]=new THREE.MeshStandardMaterial({ color:c, roughness:.85, flatShading:true })); };
  const inkMat=new THREE.MeshBasicMaterial({ color:0x2a1a14, side:THREE.BackSide });
  const ink=(m,k=1.06)=>{ const o=new THREE.Mesh(m.geometry,inkMat); o.scale.setScalar(k); o.userData.ink=true; m.add(o); return m; };
  const mk=(parent,geo,mat,x,y,z,ol)=>{ const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); if(ol) ink(m,ol); parent.add(m); return m; };
  const SKIN=0xffdcc2;
  const OUTFIT={
    Novice:{ top:0xf3e7c6, pants:0x6b5240, boot:0x5a3b22, belt:0x7a4a22, sleeve:0xf3e7c6, weapon:'sword' },
    Swordman:{ top:0xc9d2dc, pants:0x3a3f55, boot:0x9aa5b2, belt:0x5a3b1e, sleeve:0x3a3f55, weapon:'longsword', armor:true, cape:0xc8342c },
    Archer:{ top:0x5d9e46, pants:0x4a7a36, boot:0x7a4e2a, belt:0x7a4a22, sleeve:0xf4efe2, weapon:'bow', quiver:true, band:0xe2b44a },
    Mage:{ top:0x6a4aa8, pants:0x4e3585, boot:0x3b2a6a, belt:0xe8c170, sleeve:0x6a4aa8, weapon:'staff', robe:true, cape:0x2d2150, circlet:0xe8c170 },
  };
  /* equipment looks (paper-doll): every item the hero can wear changes the model */
  const DEFAULT_WP={ Novice:'shortsword', Swordman:'shortsword', Archer:'shortbow', Mage:'woodstaff' };
  const WEAPON_LOOK={
    shortsword:{ kind:'sword', len:.85, w:.06, blade:0xe6eef6, guard:0xe2b44a, grip:0x5a3b1e },
    gelblade:{ kind:'sword', len:.95, w:.08, blade:0xff9fc8, guard:0xf0bd3f, grip:0xc8487a, jelly:true },
    longsword:{ kind:'sword', len:1.15, w:.08, blade:0xdfe8f2, guard:0x5a6a86, grip:0x2f4f8a, pommel:0x9fb3c8 },
    shortbow:{ kind:'bow', col:0x8a5a2b },
    compbow:{ kind:'bow', col:0x3f2a1a, tips:0xf0bd3f, recurve:true },
    woodstaff:{ kind:'staff', shaft:0x8a5a2b, orb:0xffa04d, glow:0xff7a20, ring:0xe8c170 },
    arcwand:{ kind:'staff', shaft:0x5e4491, orb:0x7de0ff, glow:0x2fb8ff, ring:0xe8c170, crystal:true },
  };
  const ARMOR_LOOK={ leatherjacket:{ top:0xa26c3e, sleeve:0x8a5a32 }, chainmail:{ top:0xb3bcc6, sleeve:0x5f6a78, armor:true }, huntervest:{ top:0x72b35a, sleeve:0xf4efe2 }, magerobe:{ top:0x7b5bb5, sleeve:0x7b5bb5, robe:true } };
  /* appearance options for character creation */
  const HAIR_STYLES=['spiky','short','bob','long','ponytail','twintail','bun'];
  function makeHair(head,style,hairM,hairD,ribbon){
    // shared cap
    mk(head,new THREE.SphereGeometry(.5,32,20,0,Math.PI*2,0,Math.PI*.55),hairM,0,.05,-.02,1.03);
    const back=mk(head,new THREE.SphereGeometry(.49,24,16),hairM,0,-.05,-.12,1.03); back.scale.set(1,1,.9);
    const tie=toon(ribbon||0xe2524a);
    const bangsSoft=()=>{ for(let i=0;i<6;i++){ const b=mk(head,new THREE.SphereGeometry(.12,12,8),i%2?hairD:hairM,-.3+i*.12,.2,.37,0); b.scale.set(1,1.3,.55); b.rotation.z=(i-2.5)*.1; } };
    if(style==='spiky'||!style){
      for(let i=0;i<5;i++){ const c=mk(head,new THREE.ConeGeometry(.13,.34,8),i%2?hairD:hairM,-.3+i*.15,.18,.36,0); c.rotation.x=2.4; c.rotation.z=(i-2)*.12; }
      const ah=mk(head,new THREE.ConeGeometry(.07,.36,8),hairM,.05,.58,0,0); ah.rotation.z=-.5;
      [-.38,.38].forEach(x=>{ const l=mk(head,new THREE.CapsuleGeometry(.1,.3,4,8),hairM,x,-.2,.08,0); l.rotation.z=x>0?-.15:.15; }); }
    else if(style==='short'){ bangsSoft(); [-.4,.4].forEach(x=>{ const l=mk(head,new THREE.SphereGeometry(.13,12,10),hairM,x,-.08,.05,0); l.scale.set(.7,1.2,1); }); }
    else if(style==='bob'){ const bob=mk(head,new THREE.SphereGeometry(.53,28,18,0,Math.PI*2,0,Math.PI*.78),hairM,0,.02,-.06,1.03); bob.scale.set(1.02,1.05,.98);
      mk(head,new THREE.BoxGeometry(.66,.16,.12),hairM,0,.22,.36,0); [-.3,.3].forEach(x=>mk(head,new THREE.BoxGeometry(.16,.5,.2),hairM,x*1.28,-.18,.2,0)); }
    else if(style==='long'){ bangsSoft(); const lb=mk(head,new THREE.CapsuleGeometry(.36,.5,6,16),hairM,0,-.55,-.24,1.03); lb.scale.set(1.1,1,.55);
      [-1,1].forEach(sd=>{ const st=mk(head,new THREE.CapsuleGeometry(.1,.62,4,10),hairM,sd*.38,-.42,.1,1.05); st.rotation.z=sd*.08; }); }
    else if(style==='ponytail'){ bangsSoft(); const pt=new THREE.Group(); pt.position.set(0,.18,-.46); pt.rotation.x=.35; head.add(pt);
      mk(pt,new THREE.SphereGeometry(.08,10,8),tie,0,0,0,0); const t1=mk(pt,new THREE.CapsuleGeometry(.14,.5,6,12),hairM,0,-.35,-.1,1.05); t1.rotation.x=.3; mk(pt,new THREE.ConeGeometry(.12,.25,8),hairD,0,-.75,-.2,0).rotation.x=Math.PI+.3; }
    else if(style==='twintail'){ bangsSoft(); [-1,1].forEach(sd=>{ const tw=new THREE.Group(); tw.position.set(sd*.42,.16,-.14); tw.rotation.z=sd*.1; head.add(tw);
      mk(tw,new THREE.SphereGeometry(.08,10,8),tie,0,0,0,0); const t1=mk(tw,new THREE.CapsuleGeometry(.13,.55,6,12),hairM,sd*.06,-.4,-.04,1.05); t1.rotation.z=sd*.1; mk(tw,new THREE.ConeGeometry(.1,.22,8),hairD,sd*.1,-.84,-.04,0).rotation.z=Math.PI+sd*.1; }); }
    else if(style==='bun'){ bangsSoft(); mk(head,new THREE.SphereGeometry(.2,16,12),hairM,0,.5,-.26,1.05); mk(head,new THREE.TorusGeometry(.17,.035,6,20),tie,0,.44,-.24,0).rotation.x=1.2;
      [-.4,.4].forEach(x=>{ const l=mk(head,new THREE.CapsuleGeometry(.07,.28,4,8),hairM,x,-.22,.12,0); l.rotation.z=x>0?-.1:.1; }); }
  }
  function buildFace(head,LK,hairD){
    const eyeM=toon(LK.eye), white=new THREE.MeshBasicMaterial({ color:0xffffff }), ek=LK.body==='f'?1.1:1;
    [-.16,.16].forEach(x=>{ const e=mk(head,new THREE.SphereGeometry(.085*ek,16,12),eyeM,x,-.02,.4,0); e.scale.set(.8,1.25,.5); mk(head,new THREE.SphereGeometry(.028,8,6),white,x-.02,.03,.44,0);
      const bl=mk(head,new THREE.CircleGeometry(.06,12),new THREE.MeshBasicMaterial({ color:0xff9e9e, transparent:true, opacity:.7 }),x*1.35,-.14,.41,0); bl.scale.y=.55;
      if(LK.body==='f'){ const la=mk(head,new THREE.BoxGeometry(.12,.025,.02),toon(0x2a1810),x,.1,.42,0); la.rotation.z=x>0?-.25:.25; mk(head,new THREE.BoxGeometry(.03,.05,.02),toon(0x2a1810),x+(x>0?.07:-.07),.07,.41,0).rotation.z=x>0?-.8:.8; }
      else { const br=mk(head,new THREE.BoxGeometry(.12,.03,.02),hairD,x,.13,.43,0); br.rotation.z=x>0?.12:-.12; } });
    const mouth=mk(head,new THREE.TorusGeometry(.04,.01,6,12,Math.PI),toon(0x8a3a3a),0,-.14,.44,0); mouth.rotation.z=Math.PI;
  }
  function buildGear(WL,gear,body,armL,armR,P){
    const wp=new THREE.Group(); let bowString=null; const wkind=WL?WL.kind:'none';
    if(WL&&WL.kind==='sword'){ const L=WL.len; wp.position.set(0,P.hand,.06); armR.add(wp);
      const bm=WL.jelly?new THREE.MeshPhysicalMaterial({ color:WL.blade, roughness:.2, clearcoat:1, transmission:0, sheen:.5 }):std(WL.blade,{ metalness:.35, roughness:.25 });
      mk(wp,new THREE.BoxGeometry(WL.w,L,.025),bm,0,.08+L/2,0,WL.jelly?1.12:0); mk(wp,new THREE.ConeGeometry(WL.w*.72,.12,4),bm,0,.14+L,0,0).rotation.y=Math.PI/4;
      mk(wp,new THREE.BoxGeometry(WL.w*4.5,.06,.09),std(WL.guard,{ metalness:.35, roughness:.3 }),0,.08,0,0);
      mk(wp,new THREE.CylinderGeometry(.035,.035,.2,8),toon(WL.grip),0,-.04,0,0);
      if(WL.pommel) mk(wp,new THREE.SphereGeometry(.045,10,8),std(WL.pommel,{ metalness:.7, roughness:.3 }),0,-.16,0,0);
      if(WL.jelly) for(let i=0;i<3;i++) mk(wp,new THREE.SphereGeometry(.03,8,6),toon(0xffd0e4),.05,.3+i*.25,.02,0);
      wp.rotation.x=.25; }
    else if(WL&&WL.kind==='staff'){ wp.position.set(0,P.hand,.04); armR.add(wp); mk(wp,new THREE.CylinderGeometry(.035,.04,1.5,8),toon(WL.shaft),0,.35,0,1.1);
      const orb=WL.crystal? mk(wp,new THREE.OctahedronGeometry(.14,0),std(WL.orb,{ emissive:WL.glow, emissiveIntensity:1.3, roughness:.2 }),0,1.18,0,1.08)
                          : mk(wp,new THREE.SphereGeometry(.12,16,12),std(WL.orb,{ emissive:WL.glow, emissiveIntensity:1.2 }),0,1.15,0,1.06);
      mk(wp,new THREE.TorusGeometry(.15,.02,6,16),toon(WL.ring),0,1.15,0,0); if(WL.crystal){ [-1,1].forEach(sd=>{ const w=mk(wp,new THREE.ConeGeometry(.04,.22,5),toon(WL.ring),sd*.16,1.05,0,0); w.rotation.z=sd*.7; }); } wp.userData.orb=orb; }
    else if(WL&&WL.kind==='bow'){ wp.position.set(0,P.hand+.02,.08); armL.add(wp); const arc=new THREE.Mesh(new THREE.TorusGeometry(.5,.035,6,24,Math.PI*1.1),toon(WL.col)); arc.rotation.z=Math.PI/2-Math.PI*.55; ink(arc,1.12); wp.add(arc);
      if(WL.recurve) [-1,1].forEach(sd=>{ const t=mk(wp,new THREE.TorusGeometry(.1,.03,6,10,Math.PI*.8),toon(WL.tips),0,sd*.49,0,0); t.rotation.z=sd>0?-.2:Math.PI+.2; });
      if(WL.tips) mk(wp,new THREE.BoxGeometry(.08,.14,.08),toon(WL.tips),-.5,0,0,0);
      const sg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(Math.cos(-.55*Math.PI+Math.PI/2)*.5,Math.sin(-.55*Math.PI+Math.PI/2)*.5,0),new THREE.Vector3(-.02,0,0),new THREE.Vector3(Math.cos(.55*Math.PI+Math.PI/2)*.5,Math.sin(.55*Math.PI+Math.PI/2)*.5,0)]);
      bowString=new THREE.Line(sg,new THREE.LineBasicMaterial({ color:0xf4efe2 })); wp.add(bowString); wp.rotation.y=Math.PI/2; }
    // shield on the left forearm
    if(gear&&gear.shield){ const sh=new THREE.Group(); sh.position.set(-.1,P.hand+.12,.1); sh.rotation.set(0,-1.05,0); armL.add(sh);
      if(gear.shield==='guard'){ mk(sh,new THREE.CylinderGeometry(.3,.3,.05,24),toon(0xa26c3e),0,0,0,1.06).rotation.x=Math.PI/2; for(let i=-1;i<=1;i++) mk(sh,new THREE.BoxGeometry(.02,.56,.055),toon(0x7a4e2a),i*.15,0,0,0);
        mk(sh,new THREE.TorusGeometry(.3,.03,6,28),std(0xd0d8e0,{ metalness:.3, roughness:.35 }),0,0,0,0); mk(sh,new THREE.SphereGeometry(.07,12,8),std(0xe6eaee,{ metalness:.3, roughness:.35 }),0,0,.04,0); }
      else { mk(sh,new THREE.CylinderGeometry(.24,.24,.05,24),std(0xc3d0de,{ metalness:.3, roughness:.35 }),0,0,0,1.06).rotation.x=Math.PI/2; mk(sh,new THREE.TorusGeometry(.24,.03,6,28),std(0xf0c85a,{ metalness:.3, roughness:.35 }),0,0,0,0);
        mk(sh,new THREE.SphereGeometry(.08,12,8),std(0xf6d06a,{ metalness:.3, roughness:.35 }),0,0,.04,0); } }
    const gG=new THREE.Group(); gG.position.y=P.neck; body.add(gG);
    // garment on the back / neck
    if(gear&&gear.garment==='hood'){ const g2=new THREE.Group(); g2.position.set(0,1.3,-.26); gG.add(g2);
      const cg=new THREE.PlaneGeometry(.8,1.05,1,6); cg.translate(0,-.52,0); const p2=cg.attributes.position; for(let i=0;i<p2.count;i++){ const y=p2.getY(i); p2.setZ(i,-Math.pow(Math.max(0,-y),1.5)*.14); } cg.computeVertexNormals();
      g2.add(new THREE.Mesh(cg,toon(0x8a7a60,{ side:THREE.DoubleSide }))); const hood=mk(gG,new THREE.SphereGeometry(.3,18,12,0,Math.PI*2,0,Math.PI*.6),toon(0x7a6a50),0,1.36,-.3,1.05); hood.rotation.x=-1.9;
      mk(gG,new THREE.TorusGeometry(.3,.05,6,20),toon(0x6b5a44),0,1.3,-.02,0).rotation.x=Math.PI/2; }
    else if(gear&&gear.garment==='muffler'){ mk(gG,new THREE.TorusGeometry(.33,.085,8,24),toon(0xe2524a),0,1.2,.02,1.08).rotation.x=Math.PI/2+.12; mk(gG,new THREE.BoxGeometry(.16,.3,.05),toon(0xe2524a),.16,1.02,.3,1.1).rotation.z=-.25;
      [-1,1].forEach(sd=>{ const tail=mk(gG,new THREE.BoxGeometry(.14,.5,.04),toon(sd>0?0xe2524a:0xc8403a),sd*.08,.98,-.32,1.1); tail.rotation.set(.35,0,sd*.12); }); }
    return { wp, bowString, wkind };
  }
  /* Novice v2: taller "sprite-era" proportions (head about 1/3.5 of height) and a layered beginner-adventurer outfit */
  function makeNovice(hair,gear,LK,WL){
    const C={ shirt:0xf1e6c8, shirtS:0xd9c9a4, vest:0x8a5a32, strap:0x5a3b1e, pants:0x7a5a42, boot:0x5a3b22, cuff:0x8a6a4a, belt:0x6b4424, gold:0xe2b44a, scarf:0xc8643a, glove:0x6b4424, pack:0xc9b08a, packD:0xa89068, roll:0x6a8a5a };
    if(gear&&gear.armor==='leatherjacket'){ C.vest=0x5a3b22; C.shirt=0xe8d8b4; C.studs=true; }
    const root=new THREE.Group(), body=new THREE.Group(); root.add(body);
    const t=c=>toon(c), skin=toon(LK.skin), hairM=toon(hair[0]), hairD=toon(hair[1]), fem=LK.body==='f';
    // legs (hip at .8)
    const legL=new THREE.Group(), legR=new THREE.Group(); legL.position.set(-.13,.8,0); legR.position.set(.13,.8,0); body.add(legL,legR);
    [legL,legR].forEach(l=>{ mk(l,new THREE.CapsuleGeometry(.105,.36,4,10),t(fem?C.shirt:C.pants),0,-.26,0,1.07);
      mk(l,new THREE.CylinderGeometry(.13,.12,.34,12),t(C.boot),0,-.6,.01,1.07); mk(l,new THREE.TorusGeometry(.13,.035,6,14),t(C.cuff),0,-.44,.01,0).rotation.x=Math.PI/2;
      mk(l,new THREE.BoxGeometry(.2,.08,.32),t(0x3a2616),0,-.77,.05,1.08); for(let i=0;i<3;i++) mk(l,new THREE.BoxGeometry(.1,.015,.02),t(C.cuff),0,-.54-i*.07,.125,0); });
    mk(body,new THREE.CylinderGeometry(.26,.24,.2,14),t(C.pants),0,.82,0,1.05);
    if(fem){ mk(body,new THREE.CylinderGeometry(.3,.44,.3,18,1,true),toon(C.shirtS,{ side:THREE.DoubleSide }),0,.7,0,1.04);
      mk(body,new THREE.CylinderGeometry(.3,.4,.22,18,1,true,-.4,Math.PI*1.75),toon(C.vest,{ side:THREE.DoubleSide }),0,.76,0,1.04); }
    // torso: shirt, vest, straps, scarf, belt, pouch
    mk(body,new THREE.CylinderGeometry(.24,.28,.64,16),t(C.shirt),0,1.14,0,1.05);
    [-1,1].forEach(sd=>{ const v=mk(body,new THREE.BoxGeometry(.2,.52,.06),t(C.vest),sd*.13,1.11,.22,1.06); v.rotation.y=sd*.3; v.rotation.z=-sd*.06;
      if(C.studs) for(let i=0;i<3;i++) mk(body,new THREE.SphereGeometry(.018,6,4),std(0xd0d8e0,{ metalness:.4, roughness:.3 }),sd*.13,1.24-i*.12,.26,0);
      const st=mk(body,new THREE.BoxGeometry(.05,.72,.035),t(C.strap),sd*.05,1.1,.27,0); st.rotation.z=sd*.52; });
    mk(body,new THREE.BoxGeometry(.5,.56,.06),t(C.vest),0,1.12,-.22,1.05);
    mk(body,new THREE.TorusGeometry(.04,.015,6,12),t(C.gold),0,1.1,.3,0);
    mk(body,new THREE.TorusGeometry(.15,.045,8,18),t(C.scarf),0,1.46,.02,1.08).rotation.x=Math.PI/2+.15;
    mk(body,new THREE.ConeGeometry(.08,.18,4),t(C.scarf),0,1.36,.2,1.08).rotation.x=Math.PI+.4;
    mk(body,new THREE.CylinderGeometry(.295,.295,.08,16),t(C.belt),0,.86,0,1.04);
    mk(body,new THREE.BoxGeometry(.1,.09,.04),t(C.gold),0,.86,.3,0);
    const pouch=new THREE.Group(); pouch.position.set(.25,.8,.14); pouch.rotation.y=.9; body.add(pouch); mk(pouch,new THREE.BoxGeometry(.14,.14,.09),t(0x9a6a3c),0,0,0,1.08); mk(pouch,new THREE.BoxGeometry(.15,.06,.1),t(C.strap),0,.06,.005,0);
    // backpack + bedroll
    const pk=new THREE.Group(); pk.position.set(0,1.14,-.34); body.add(pk);
    mk(pk,new THREE.BoxGeometry(.44,.46,.2),t(C.pack),0,0,0,1.05); mk(pk,new THREE.BoxGeometry(.46,.16,.22),t(C.packD),0,.18,.005,0);
    [-1,1].forEach(sd=>mk(pk,new THREE.BoxGeometry(.05,.44,.03),t(C.strap),sd*.14,-.02,.11,0)); mk(pk,new THREE.BoxGeometry(.06,.06,.03),t(C.gold),0,.12,.12,0);
    const roll=mk(pk,new THREE.CylinderGeometry(.1,.1,.52,12),t(C.roll),0,.33,-.02,1.06); roll.rotation.z=Math.PI/2; [-1,1].forEach(sd=>mk(pk,new THREE.TorusGeometry(.105,.018,6,12),t(C.strap),sd*.15,.33,-.02,0).rotation.y=Math.PI/2);
    // arms (shoulder at 1.4, hand at -.56)
    const armL=new THREE.Group(), armR=new THREE.Group(); armL.position.set(-.34,1.4,0); armR.position.set(.34,1.4,0); body.add(armL,armR);
    [armL,armR].forEach(a=>{ mk(a,new THREE.CapsuleGeometry(.085,.26,4,10),t(C.shirt),0,-.19,0,1.07); mk(a,new THREE.TorusGeometry(.09,.03,6,14),t(C.shirtS),0,-.36,0,0).rotation.x=Math.PI/2;
      mk(a,new THREE.CapsuleGeometry(.068,.1,4,8),skin,0,-.45,0,1.07); mk(a,new THREE.SphereGeometry(.088,12,10),t(C.glove),0,-.56,0,1.07);
      const pd=mk(a,new THREE.SphereGeometry(.12,12,8,0,Math.PI*2,0,Math.PI/2),t(C.vest),0,0,0,1.05); pd.scale.y=.7; });
    mk(body,new THREE.CylinderGeometry(.085,.09,.12,10),skin,0,1.52,0,0);
    const { wp, bowString, wkind }=buildGear(WL,gear,body,armL,armR,{ hand:-.56, neck:.24 });
    // head (smaller than chibi classes)
    const head=new THREE.Group(); head.position.set(0,1.84,0); head.scale.setScalar(.78); body.add(head);
    mk(head,new THREE.SphereGeometry(.46,32,24),skin,0,0,0,1.04); makeHair(head,LK.style,hairM,hairD,LK.ribbon); buildFace(head,LK,hairD);
    root.userData={ body, legL, legR, armL, armR, head, wp, cape:null, bowString, job:'Novice', weapon:wkind, sitDrop:-.5, v:2 };
    return root;
  }
  function makeHero(job='Novice', hair=[0xf07a52,0xc4502e], over, gear, look){
    const O=Object.assign({},OUTFIT[job]||OUTFIT.Novice,over||{});
    const LK=Object.assign({ style:'spiky', eye:0x2a4f9a, skin:SKIN, body:'m', ribbon:0xe2524a },look||{});
    if(job==='Novice'&&!over){ const W0=gear?(gear.weapon?WEAPON_LOOK[gear.weapon]:null):WEAPON_LOOK.shortsword; return makeNovice(hair,gear,LK,W0); }
    if(gear&&gear.armor&&ARMOR_LOOK[gear.armor]) Object.assign(O,ARMOR_LOOK[gear.armor]);
    if(gear&&gear.garment&&O.cape) O.cape=null; // the worn garment replaces the job cape
    const WL=gear? (gear.weapon?WEAPON_LOOK[gear.weapon]:null) : (O.weapon==='none'?null:WEAPON_LOOK[DEFAULT_WP[job]]||null);
    const root=new THREE.Group(), body=new THREE.Group(); root.add(body);
    const skin=toon(LK.skin), top=toon(O.top), pants=toon(O.pants), boot=toon(O.boot), sleeve=toon(O.sleeve), hairM=toon(hair[0]), hairD=toon(hair[1]);
    const legL=new THREE.Group(), legR=new THREE.Group(); legL.position.set(-.16,.62,0); legR.position.set(.16,.62,0); body.add(legL,legR);
    [legL,legR].forEach(l=>{ mk(l,new THREE.CapsuleGeometry(.11,.3,4,10),pants,0,-.24,0,1.07); mk(l,new THREE.BoxGeometry(.24,.18,.34),boot,0,-.52,.04,1.1); });
    if(O.robe){ mk(body,new THREE.CylinderGeometry(.3,.5,1.0,18),top,0,.72,0,1.04); mk(body,new THREE.CylinderGeometry(.505,.505,.06,18),toon(0xe8c170),0,.24,0,0); mk(body,new THREE.BoxGeometry(.08,.8,.04),toon(0xe8c170),0,.72,.36,0); }
    else mk(body,new THREE.CylinderGeometry(.3,.38,.62,16),top,0,.92,0,1.05);
    mk(body,new THREE.CylinderGeometry(.385,.385,.09,16),toon(O.belt),0,.72,0,0);
    if(LK.body==='f'&&!O.robe){ mk(body,new THREE.CylinderGeometry(.38,.5,.3,18,1,true),toon(O.top,{ side:THREE.DoubleSide }),0,.56,0,1.04); }
    mk(body,new THREE.BoxGeometry(.1,.1,.04),toon(0xe2b44a),0,.72,.38,0);
    if(job==='Novice'&&!O.nostrap){ const st=mk(body,new THREE.BoxGeometry(.07,.78,.05),toon(0x9a6a3c),0,.95,.3,0); st.rotation.z=.75; }
    if(job==='Archer'){ mk(body,new THREE.BoxGeometry(.22,.24,.05),toon(0xf4efe2),0,1.1,.31,0); }
    if(O.armor){ mk(body,new THREE.SphereGeometry(.34,18,12,0,Math.PI*2,0,Math.PI*.55),std(0xdfe6ee,{ metalness:.6, roughness:.3 }),0,.98,.02,1.04);
      mk(body,new THREE.BoxGeometry(.06,.5,.05),toon(0xe2b44a),0,.95,.33,0); }
    // cape
    let cape=null; if(O.cape){ cape=new THREE.Group(); cape.position.set(0,1.22,-.28); body.add(cape);
      const cg=new THREE.PlaneGeometry(.72,O.robe?1.1:.95,1,6); cg.translate(0,-(O.robe?.55:.47),0); const p=cg.attributes.position; for(let i=0;i<p.count;i++){ const y=p.getY(i); p.setZ(i,-Math.pow(Math.max(0,-y),1.6)*.12); } cg.computeVertexNormals();
      const cm=new THREE.Mesh(cg,toon(O.cape,{ side:THREE.DoubleSide })); cape.add(cm); }
    // quiver
    if(O.quiver){ const q=new THREE.Group(); q.position.set(.12,1.05,-.34); q.rotation.z=-.35; body.add(q); mk(q,new THREE.CylinderGeometry(.1,.09,.62,10),toon(0x8a5a2b),0,0,0,1.06);
      for(let i=0;i<3;i++){ mk(q,new THREE.CylinderGeometry(.012,.012,.3,4),toon(0x6e4a26),-.04+i*.04,.42,0,0); mk(q,new THREE.ConeGeometry(.04,.1,4),toon(0xf4efe2),-.04+i*.04,.6,0,0); } }
    const armL=new THREE.Group(), armR=new THREE.Group(); armL.position.set(-.4,1.14,0); armR.position.set(.4,1.14,0); body.add(armL,armR);
    [armL,armR].forEach(a=>{ mk(a,new THREE.CapsuleGeometry(.09,.3,4,10),sleeve,0,-.2,0,1.07); mk(a,new THREE.SphereGeometry(.1,12,10),skin,0,-.44,0,1.07);
      if(O.armor){ const pd=mk(a,new THREE.SphereGeometry(.18,14,10),std(0xdfe6ee,{ metalness:.55, roughness:.3 }),0,.02,0,1.05); pd.scale.y=.8; mk(a,new THREE.TorusGeometry(.16,.025,6,16),toon(0xe2b44a),0,-.06,0,0).rotation.x=Math.PI/2; }
      if(job==='Archer') mk(a,new THREE.CylinderGeometry(.1,.1,.14,10),toon(0x8a5a2b),0,-.32,0,0); });
    const { wp, bowString, wkind }=buildGear(WL,gear,body,armL,armR,{ hand:-.46, neck:0 });
    // head
    const head=new THREE.Group(); head.position.set(0,1.62,0); body.add(head);
    mk(head,new THREE.SphereGeometry(.46,32,24),skin,0,0,0,1.04);
    makeHair(head,LK.style,hairM,hairD,LK.ribbon);
    buildFace(head,LK,hairD);
    if(O.beret){ const br=new THREE.Group(); br.position.set(-.04,.36,-.02); br.rotation.z=.18; head.add(br); const bm=mk(br,new THREE.SphereGeometry(.44,24,12),toon(O.beret),0,0,0,1.04); bm.scale.set(1.1,.42,1.1); mk(br,new THREE.CylinderGeometry(.03,.03,.1,6),toon(O.beret),0,.2,0,0); }
    if(O.apron){ mk(body,new THREE.BoxGeometry(.5,.62,.05),toon(O.apron),0,.72,.37,0); }
    if(O.band){ const b=mk(head,new THREE.TorusGeometry(.47,.035,6,32),toon(O.band),0,.12,0,0); b.rotation.x=Math.PI/2-.25; }
    if(O.circlet){ const c=mk(head,new THREE.TorusGeometry(.475,.03,6,32),std(O.circlet,{ metalness:.6, roughness:.3 }),0,.14,0,0); c.rotation.x=Math.PI/2-.3; mk(head,new THREE.OctahedronGeometry(.06,0),std(0xff8a3d,{ emissive:0xff6010, emissiveIntensity:.8 }),0,.2,.46,0); }
    if(O.armor){ // headband-like steel circlet for a knightly look
      const c=mk(head,new THREE.TorusGeometry(.475,.035,6,32),std(0xdfe6ee,{ metalness:.6, roughness:.3 }),0,.12,0,0); c.rotation.x=Math.PI/2-.25; }
    root.userData={ body, legL, legR, armL, armR, head, wp, cape, bowString, job, weapon:wkind };
    return root;
  }
  function poseHero(m, state, ph){
    const U=m.userData, TAU=Math.PI*2;
    U.legL.rotation.set(0,0,0); U.legR.rotation.set(0,0,0); U.armL.rotation.set(0,0,0); U.armR.rotation.set(0,0,0);
    U.body.position.set(0,0,0); U.body.rotation.set(0,0,0); U.head.rotation.set(0,0,0); if(U.cape) U.cape.rotation.set(.08,0,0);
    if(U.weapon==='bow') U.wp.rotation.set(0,Math.PI/2,0);
    if(state==='idle'){ U.body.position.y=Math.sin(ph*TAU)*.02; U.armL.rotation.z=.06+Math.sin(ph*TAU)*.03; U.armR.rotation.z=-.06-Math.sin(ph*TAU)*.03; U.head.rotation.z=Math.sin(ph*TAU)*.03; }
    else if(state==='walk'){ const w=Math.sin(ph*TAU); U.legL.rotation.x=w*.7; U.legR.rotation.x=-w*.7; U.armL.rotation.x=-w*.6; U.armR.rotation.x=w*.6; U.body.position.y=Math.abs(Math.sin(ph*TAU))*.07; if(U.cape) U.cape.rotation.x=.25+Math.abs(w)*.15; }
    else if(state==='attack'){
      if(U.weapon==='bow'){ const k=Math.min(1,ph/.6); U.armL.rotation.x=-1.5; U.armL.rotation.z=.1; U.armR.rotation.x=-1.4+ (ph<.6?k*.2:0); U.armR.rotation.y=ph<.6?-.4-k*.5:-.2; U.body.rotation.y=.25; }
      else if(U.weapon==='staff'){ const k=ph<.45?ph/.45:1-(ph-.45)/.55; U.armR.rotation.x=-1.2-k*1.4; U.armL.rotation.x=-.6*k; U.body.position.y=k*.04; }
      else { if(ph<.4){ const k=ph/.4; U.armR.rotation.x=-2.6*k; U.body.rotation.y=-.2*k; } else { const k=(ph-.4)/.6; U.armR.rotation.x=-2.6+3.3*Math.min(1,k*1.4); U.armR.rotation.z=-.2; U.body.rotation.y=-.2+.45*k; U.body.rotation.x=.12*k; } }
    }
    else if(state==='sit'){ U.body.position.y=U.sitDrop||-.36; U.legL.rotation.x=-1.45; U.legR.rotation.x=-1.45; U.armL.rotation.x=-.3; U.armR.rotation.x=-.3; U.armL.rotation.z=.2; U.armR.rotation.z=-.2; }
  }
  /* ---------- monsters ---------- */
  function jellyMat(c,sheen){ return new THREE.MeshPhysicalMaterial({ color:c, roughness:.22, clearcoat:1, clearcoatRoughness:.15, sheen:.6, sheenColor:new THREE.Color(sheen) }); }
  function makeJellop(color=0xff8fb8){
    const g=new THREE.Group(), body=new THREE.Group(); g.add(body);
    const b=new THREE.Mesh(new THREE.SphereGeometry(.62,32,24),jellyMat(color,0xffd0e0)); b.scale.set(1,.82,1); b.position.y=.5; ink(b,1.04); body.add(b);
    const eye=toon(0x2a1a24), white=new THREE.MeshBasicMaterial({ color:0xffffff });
    [-.2,.2].forEach(x=>{ const e=mk(body,new THREE.SphereGeometry(.07,12,10),eye,x,.58,.55); e.scale.set(1,1.4,.5); mk(body,new THREE.SphereGeometry(.022,8,6),white,x-.015,.62,.585);
      const bl=mk(body,new THREE.CircleGeometry(.07,12),new THREE.MeshBasicMaterial({ color:0xff5f8f, transparent:true, opacity:.55 }),x*1.55,.46,.52); bl.scale.y=.55; });
    const sm=mk(body,new THREE.TorusGeometry(.06,.014,6,12,Math.PI),toon(0x8a2a4a),0,.47,.58); sm.rotation.z=Math.PI;
    mk(body,new THREE.CylinderGeometry(.025,.03,.2,6),toon(0x4f9a3c),0,1.05,0);
    [-1,1].forEach(s=>{ const lf=mk(body,new THREE.SphereGeometry(.14,12,8),toon(0x6cc152),s*.13,1.15,0); lf.scale.set(1.3,.35,.7); lf.rotation.z=s*.5; });
    g.userData={ body, kind:'jellop' }; return g;
  }
  function makeKingJellop(){
    const g=makeJellop(0xf07aa8); const b=g.userData.body; b.scale.setScalar(1);
    const crown=new THREE.Group(); crown.position.set(0,1.0,0); b.add(crown);
    const gold=std(0xf0bd3f,{ metalness:.7, roughness:.25 });
    mk(crown,new THREE.CylinderGeometry(.3,.34,.22,16,1,true),gold,0,0,0,1.06);
    for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; mk(crown,new THREE.ConeGeometry(.07,.2,6),gold,Math.sin(a)*.3,.2,Math.cos(a)*.3,0); mk(crown,new THREE.SphereGeometry(.035,8,6),gold,Math.sin(a)*.3,.31,Math.cos(a)*.3,0); }
    [0,2.1,4.2].forEach((a,i)=>mk(crown,new THREE.SphereGeometry(.05,10,8),std([0xe2524a,0x4f8fe6,0xe2524a][i],{ roughness:.2 }),Math.sin(a)*.34,.0,Math.cos(a)*.34,0));
    b.children.filter(c=>c.geometry&&c.geometry.type==='CylinderGeometry'&&c.position.y>1).forEach(c=>c.visible=false);
    b.children.filter(c=>c.geometry&&c.geometry.type==='SphereGeometry'&&c.position.y>1.1).forEach(c=>c.visible=false);
    g.userData.kind='kingjellop'; return g;
  }
  function makeMoth(){
    const g=new THREE.Group(), body=new THREE.Group(); g.add(body);
    const b=mk(body,new THREE.CapsuleGeometry(.14,.4,6,12),toon(0x5a3f86),0,.8,0,1.1); b.rotation.x=Math.PI/2;
    mk(body,new THREE.SphereGeometry(.17,16,12),toon(0x6e52a0),0,.85,.3,1.08);
    [-.07,.07].forEach(x=>{ mk(body,new THREE.SphereGeometry(.04,8,6),toon(0xffe07a),x,.9,.45,0); const an=mk(body,new THREE.CylinderGeometry(.01,.01,.3,4),toon(0x3a2a55),x*2,1.05,.35,0); an.rotation.x=-.6; an.rotation.z=x*4; });
    const wingMat=new THREE.MeshStandardMaterial({ color:0xc9b0ff, roughness:.4, transparent:true, opacity:.9, side:THREE.DoubleSide, emissive:0x3a2a6a, emissiveIntensity:.25 });
    const wings=[];
    [-1,1].forEach(s=>{ const piv=new THREE.Group(); piv.position.set(0,.85,0); body.add(piv);
      const w=new THREE.Mesh(new THREE.CircleGeometry(.55,24),wingMat); w.position.set(s*.55,0,.05); w.rotation.x=-Math.PI/2; piv.add(w);
      const w2=new THREE.Mesh(new THREE.CircleGeometry(.36,20),wingMat); w2.position.set(s*.42,0,-.4); w2.rotation.x=-Math.PI/2; piv.add(w2);
      const dot=new THREE.Mesh(new THREE.CircleGeometry(.16,16),new THREE.MeshBasicMaterial({ color:0xffe07a, side:THREE.DoubleSide })); dot.position.set(s*.6,.01,.05); dot.rotation.x=-Math.PI/2; piv.add(dot);
      wings.push([piv,s]); });
    g.userData={ body, wings, kind:'moth' }; return g;
  }
  function makeBunny(){
    const g=new THREE.Group(), body=new THREE.Group(); g.add(body);
    const fur=toon(0xfbf3e4), furD=toon(0xe9dcc4), pink=toon(0xf7a8b8);
    const b=mk(body,new THREE.SphereGeometry(.42,24,18),fur,0,.42,-.05,1.05); b.scale.set(1,.9,1.1);
    mk(body,new THREE.SphereGeometry(.33,24,18),fur,0,.78,.25,1.05);
    const ears=new THREE.Group(); ears.position.set(0,1.02,.2); body.add(ears);
    [-1,1].forEach(s=>{ const e=mk(ears,new THREE.CapsuleGeometry(.075,.42,4,10),fur,s*.12,.25,0,1.08); e.rotation.z=-s*.18; e.rotation.x=-.2; const inn=mk(ears,new THREE.CapsuleGeometry(.04,.34,4,8),pink,s*.125,.26,.05,0); inn.rotation.copy(e.rotation); });
    [-.13,.13].forEach(x=>{ const e=mk(body,new THREE.SphereGeometry(.055,12,10),toon(0x2b1d14),x,.82,.54); e.scale.set(.8,1.2,.5); mk(body,new THREE.SphereGeometry(.018,8,6),new THREE.MeshBasicMaterial({ color:0xffffff }),x-.012,.85,.56); });
    mk(body,new THREE.SphereGeometry(.035,8,6),toon(0xf28aa0),0,.74,.57);
    mk(body,new THREE.SphereGeometry(.12,12,10),toon(0xffffff),0,.4,-.5,1.1);
    [-.16,.16].forEach(x=>{ const f=mk(body,new THREE.SphereGeometry(.1,10,8),furD,x,.06,.18,1.1); f.scale.set(1,.6,1.5); });
    g.userData={ body, ears, kind:'bunny' }; return g;
  }
  function makeThornling(){
    const g=new THREE.Group(), body=new THREE.Group(); g.add(body);
    const soil=mk(g,new THREE.SphereGeometry(.45,18,10,0,Math.PI*2,0,Math.PI/2),flat(0x7a5230),0,0,0,1.04); soil.scale.y=.45;
    mk(body,new THREE.CylinderGeometry(.08,.11,.6,8),toon(0x4f9a3c),0,.4,0,1.1);
    const bulb=mk(body,new THREE.SphereGeometry(.36,20,16),toon(0x2f7a3c),0,.9,0,1.05);
    for(let i=0;i<10;i++){ const a=i/10*Math.PI*2, y=i%2?.12:-.05; const t=mk(body,new THREE.ConeGeometry(.05,.18,6),toon(0xf1e6b8),Math.sin(a)*.35,.9+y,Math.cos(a)*.35,0); t.lookAt(new THREE.Vector3(Math.sin(a)*2,.9+y*4,Math.cos(a)*2)); t.rotateX(Math.PI/2); }
    const top=mk(body,new THREE.ConeGeometry(.06,.22,6),toon(0xf1e6b8),0,1.3,0,0);
    [-1,1].forEach(s=>{ const lf=mk(body,new THREE.SphereGeometry(.16,12,8),toon(0x6cc152),s*.25,.42,0,1.08); lf.scale.set(1.4,.3,.7); lf.rotation.z=s*.4; });
    [-.12,.12].forEach(x=>{ const e=mk(body,new THREE.BoxGeometry(.08,.07,.03),toon(0x141414),x,.92,.34); e.rotation.z=x>0?.35:-.35; });
    g.userData={ body, kind:'thornling' }; return g;
  }
  function makeBoarling(){
    const g=new THREE.Group(), body=new THREE.Group(); g.add(body);
    const fur=toon(0x9a6438), furD=toon(0x6b4424);
    const b=mk(body,new THREE.SphereGeometry(.5,24,18),fur,0,.62,0,1.05); b.scale.set(.85,.8,1.25);
    for(let i=0;i<6;i++){ const sp=mk(body,new THREE.ConeGeometry(.07,.22,6),furD,0,1.02-Math.abs(i-2.5)*.02,.35-i*.14,0); sp.rotation.x=-.4; }
    mk(body,new THREE.SphereGeometry(.3,20,16),toon(0xa8703e),0,.68,.62,1.05);
    const sn=mk(body,new THREE.CylinderGeometry(.13,.15,.18,14),toon(0xe0a88a),0,.6,.9,1.08); sn.rotation.x=Math.PI/2;
    [-.05,.05].forEach(x=>mk(body,new THREE.SphereGeometry(.025,6,6),toon(0x5a3b1e),x,.6,1.0));
    [-1,1].forEach(s=>{ const t=mk(body,new THREE.ConeGeometry(.04,.2,6),toon(0xfff6e0),s*.14,.5,.9,1.1); t.rotation.x=-.8; t.rotation.z=s*.3;
      const ear=mk(body,new THREE.ConeGeometry(.08,.16,6),furD,s*.2,.96,.55,1.1); ear.rotation.z=-s*.4;
      mk(body,new THREE.SphereGeometry(.045,8,6),toon(0xff4a3a),s*.14,.78,.84); });
    const legs=[]; [[-.22,.35],[.22,.35],[-.22,-.35],[.22,-.35]].forEach(([x,z],i)=>{ const L=new THREE.Group(); L.position.set(x,.42,z); body.add(L); mk(L,new THREE.CylinderGeometry(.08,.07,.36,8),furD,0,-.2,0,1.1); legs.push([L,i]); });
    const tail=mk(body,new THREE.CylinderGeometry(.02,.02,.2,4),furD,0,.75,-.62,0); tail.rotation.x=-.6;
    g.userData={ body, legs, kind:'boarling' }; return g;
  }
  function makeScorpion(){
    const g=new THREE.Group(), body=new THREE.Group(); g.add(body);
    const shell=toon(0xe39a5c), dark=toon(0xb8683a), pur=toon(0x9b6ad8), belly=toon(0xf2c08a);
    const th=mk(body,new THREE.SphereGeometry(.34,18,14),shell,0,.34,.1,1.06); th.scale.set(1,.5,1.25);
    for(let i=0;i<3;i++){ const a=mk(body,new THREE.SphereGeometry(.28-i*.04,14,10),i%2?dark:shell,0,.33,-.28-i*.26,1.06); a.scale.set(1,.55,.9); }
    const tail=new THREE.Group(); tail.position.set(0,.38,-.95); body.add(tail); let py=0,pz=0;
    for(let i=0;i<5;i++){ const ang=-.2+i*.55; py+=Math.sin(ang)*.26; pz+=Math.cos(ang)*-.2+(i>2?.24:0); mk(tail,new THREE.SphereGeometry(.13-i*.012,12,10),i%2?dark:shell,0,py,pz,1.08); }
    mk(tail,new THREE.SphereGeometry(.14,12,10),pur,0,py+.12,pz+.2,1.08); const st=mk(tail,new THREE.ConeGeometry(.06,.34,8),pur,0,py+.08,pz+.42); st.rotation.x=Math.PI/2+.6;
    const hd=mk(body,new THREE.SphereGeometry(.2,14,10),shell,0,.36,.52,1.07); hd.scale.set(1.1,.6,1);
    [-.08,.08].forEach(x=>mk(body,new THREE.SphereGeometry(.035,8,6),toon(0x1a1014),x,.45,.66));
    const claws=[]; [-1,1].forEach(s=>{ const arm=new THREE.Group(); arm.position.set(s*.26,.34,.5); body.add(arm); claws.push([arm,s]);
      const u=mk(arm,new THREE.CapsuleGeometry(.06,.34,4,8),dark,s*.14,0,.16,1.1); u.rotation.x=Math.PI/2; u.rotation.z=s*.6;
      const p1=mk(arm,new THREE.SphereGeometry(.14,12,10),shell,s*.3,0,.42,1.07); p1.scale.set(.8,.6,1.3);
      const f1=mk(arm,new THREE.ConeGeometry(.06,.26,8),shell,s*.25,0,.62); f1.rotation.x=Math.PI/2; const f2=mk(arm,new THREE.ConeGeometry(.05,.22,8),belly,s*.36,0,.6); f2.rotation.x=Math.PI/2; });
    const legs=[]; [-1,1].forEach(s=>{ for(let i=0;i<3;i++){ const L=new THREE.Group(); L.position.set(s*.28,.3,.12-i*.2); body.add(L); legs.push([L,s,i]); const a=mk(L,new THREE.CylinderGeometry(.03,.025,.42,6),dark,s*.16,-.05,0); a.rotation.z=s*1.05; } });
    g.userData={ body, tail, claws, legs, kind:'scorpion' }; return g;
  }
  function makeGolem(boss){
    const g=new THREE.Group(), body=new THREE.Group(); g.add(body);
    const st=flat(0xc98f68), stD=flat(0x9a6446), band=flat(0x7a4a34);
    const barrel=(r,h,y,parent,mat)=>{ const m=mk(parent,new THREE.CylinderGeometry(r,r*1.06,h,10),mat||st,0,y,0,1.04); [-h/2+.06,h/2-.06].forEach(o=>mk(parent,new THREE.CylinderGeometry(r*1.08,r*1.08,.1,10),band,0,y+o,0)); return m; };
    const legs=[]; [-1,1].forEach(s=>{ const L=new THREE.Group(); L.position.set(s*.42,.9,0); body.add(L); legs.push([L,s]); barrel(.28,.5,-.3,L); barrel(.34,.46,-.72,L,stD); });
    barrel(.72,.9,1.45,body); barrel(.62,.5,2.1,body,stD);
    mk(body,new THREE.BoxGeometry(.62,.46,.56),st,0,2.42,.22,1.05);
    [-.14,.14].forEach(x=>mk(body,new THREE.BoxGeometry(.1,.06,.04),std(0xffd27a,{ emissive:0xffa030, emissiveIntensity:2.2 }),x,2.45,.51));
    for(let i=0;i<4;i++){ const sp=mk(body,new THREE.ConeGeometry(.12,.35,5),stD,-.3+i*.2,2.75,-.05); sp.rotation.x=-.3; }
    const arms=[]; [-1,1].forEach(s=>{ const A=new THREE.Group(); A.position.set(s*.9,2.05,0); body.add(A); arms.push([A,s]); mk(A,new THREE.SphereGeometry(.38,12,10),stD,0,0,0,1.05); barrel(.26,.5,-.45,A); barrel(.3,.55,-1.0,A,stD); mk(A,new THREE.DodecahedronGeometry(.36,0),st,0,-1.45,0,1.05); });
    if(boss) mk(body,new THREE.OctahedronGeometry(.22,0),std(0xfff0a0,{ emissive:0xffb020, emissiveIntensity:2 }),0,1.55,.74);
    g.userData={ body, legs, arms, kind:boss?'sentinel':'golem' }; return g;
  }
  function poseMob(m, state, ph){
    const U=m.userData, TAU=Math.PI*2, k=U.kind; if(!U.body) return;
    U.body.position.set(0,0,0); U.body.scale.set(1,1,1); U.body.rotation.set(0,0,0);
    if(k==='jellop'||k==='kingjellop'){ const hop=state==='hurt'?0:Math.max(0,Math.sin(ph*TAU)); if(state==='hurt'){ U.body.scale.set(1.14,.8,1.14); } else { U.body.position.y=hop*.3; const sq=1-hop*.12; U.body.scale.set(1+(1-sq)*.8,hop>.02?1/sq:.92,1+(1-sq)*.8); } }
    else if(k==='moth'){ U.body.position.y=Math.sin(ph*TAU)*.08; U.wings.forEach(([p,s])=>p.rotation.z=s*Math.sin(ph*TAU)*.75); }
    else if(k==='bunny'){ const hop=Math.max(0,Math.sin(ph*TAU)); U.body.position.y=hop*.28; U.body.scale.set(1-hop*.06,1+hop*.1,1-hop*.06); U.ears.rotation.x=-hop*.5; }
    else if(k==='thornling'){ U.body.rotation.z=Math.sin(ph*TAU)*.12; U.body.rotation.x=Math.cos(ph*TAU)*.05; if(state==='attack') U.body.rotation.x=-.25*Math.sin(ph*Math.PI); }
    else if(k==='boarling'){ const w=Math.sin(ph*TAU); U.legs.forEach(([L,i])=>L.rotation.x=(i===0||i===3?w:-w)*.55); U.body.position.y=Math.abs(w)*.04; }
    else if(k==='scorpion'){ U.legs.forEach(([L,s,i])=>L.rotation.x=Math.sin(ph*TAU+i*2+(s>0?1.5:0))*.5); U.tail.rotation.x=Math.sin(ph*TAU)*.12-(state==='attack'?Math.sin(ph*Math.PI)*.6:0); U.claws.forEach(([a,s])=>a.rotation.y=s*(.1+Math.sin(ph*TAU)*.14)); }
    else if(k==='golem'||k==='sentinel'){ const w=Math.sin(ph*TAU); U.legs.forEach(([L,s])=>L.rotation.x=(s>0?w:-w)*.35); U.arms.forEach(([A,s])=>A.rotation.x=state==='attack'?-Math.sin(ph*Math.PI)*1.6:(s>0?-w:w)*.3); U.body.position.y=Math.abs(w)*.06; }
  }
  /* ---------- headgear (paper-doll layer, attached to the head group) ---------- */
  function makeHeadgear(id){
    const g=new THREE.Group(), gold=std(0xf0bd3f,{ metalness:.7, roughness:.25 });
    if(id==='strawhat'){ const straw=toon(0xe8c170), strawD=toon(0xc9a04a);
      const top=new THREE.Group(); top.position.set(0,.1,-.04); top.rotation.x=-.2; g.add(top);
      mk(top,new THREE.CylinderGeometry(.66,.68,.035,40),straw,0,.3,0,1.03);
      for(let i=0;i<3;i++) mk(top,new THREE.TorusGeometry(.5+i*.06,.007,4,40),strawD,0,.32,0,0).rotation.x=Math.PI/2;
      mk(top,new THREE.CylinderGeometry(.32,.4,.3,28),straw,0,.46,0,1.04); mk(top,new THREE.SphereGeometry(.32,24,10,0,Math.PI*2,0,Math.PI/2),straw,0,.6,0,0).scale.y=.35;
      mk(top,new THREE.CylinderGeometry(.405,.41,.08,28),toon(0xc8342c),0,.36,0,0); }
    else if(id==='crown'){ mk(g,new THREE.CylinderGeometry(.2,.22,.14,14,1,true),gold,0,.58,0,1.08); for(let i=0;i<4;i++){ const a=i/4*Math.PI*2+.4; mk(g,new THREE.ConeGeometry(.05,.14,6),gold,Math.sin(a)*.2,.71,Math.cos(a)*.2,0); }
      mk(g,new THREE.SphereGeometry(.05,10,8),std(0xff8fb8,{ roughness:.2 }),0,.58,.22,0); }
    else if(id==='kingcrown'){ mk(g,new THREE.CylinderGeometry(.34,.37,.22,18,1,true),gold,0,.56,0,1.06); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; mk(g,new THREE.ConeGeometry(.07,.2,6),gold,Math.sin(a)*.34,.76,Math.cos(a)*.34,0); mk(g,new THREE.SphereGeometry(.04,8,6),gold,Math.sin(a)*.34,.87,Math.cos(a)*.34,0); }
      [[0,0xe2524a],[1.1,0x4f8fe6],[-1.1,0x4f8fe6]].forEach(([a,c])=>mk(g,new THREE.SphereGeometry(.055,10,8),std(c,{ roughness:.15 }),Math.sin(a)*.37,.56,Math.cos(a)*.37,0)); }
    else if(id==='bunnyband'){ const b=mk(g,new THREE.TorusGeometry(.47,.03,6,32,Math.PI),toon(0xf7a8b8),0,.12,0,0); b.rotation.set(0,Math.PI/2,Math.PI/2-.35);
      [-1,1].forEach(sd=>{ const e=mk(g,new THREE.CapsuleGeometry(.08,.46,4,10),toon(0xfbf5e8),sd*.2,.82,-.02,1.08); e.rotation.z=-sd*.18; const inn=mk(g,new THREE.CapsuleGeometry(.04,.36,4,8),toon(0xf7a8b8),sd*.205,.83,.045,0); inn.rotation.z=-sd*.18; }); }
    else if(id==='thorncirclet'){ const t=mk(g,new THREE.TorusGeometry(.48,.045,6,32),toon(0x4f9a3c),0,.14,0,0); t.rotation.x=Math.PI/2-.25;
      for(let i=0;i<9;i++){ const a=i/9*Math.PI*2; const c=mk(g,new THREE.ConeGeometry(.035,.14,5),toon(0xf1e6b8),Math.sin(a)*.48,.2+Math.cos(a)*.1,Math.cos(a)*.48,0); c.rotation.set(-Math.cos(a)*.4,0,Math.sin(a)*.4); } }
    else if(id==='boarhelm'){ const helm=mk(g,new THREE.SphereGeometry(.52,28,14,0,Math.PI*2,0,Math.PI*.5),toon(0x8a5a32),0,.05,-.02,1.04);
      mk(g,new THREE.TorusGeometry(.52,.04,6,32),toon(0x6b4424),0,.05,-.02,0).rotation.x=Math.PI/2;
      for(let i=0;i<5;i++){ const sp=mk(g,new THREE.ConeGeometry(.06,.2,6),toon(0x4a2f1a),0,.56-Math.abs(i-2)*.03,.25-i*.14,0); sp.rotation.x=-.5; }
      [-1,1].forEach(sd=>{ const t=mk(g,new THREE.ConeGeometry(.045,.24,6),toon(0xfff6e0),sd*.46,.02,.18,1.1); t.rotation.set(-.3,0,sd*.9); }); }
    else return null;
    g.userData.headgear=id; return g;
  }
  function attachHeadgear(hero,id){ const hg=makeHeadgear(id); if(hg){ hero.userData.head.add(hg); hero.userData.hg=hg; } return hg; }
  /** bake only the headgear, occluded by the (invisible) body so it layers correctly over the body sprite */
  function bakeHeadgearLayer(job,id,opt,look){ const m=makeHero(job,undefined,undefined,undefined,look), hg=attachHeadgear(m,id); if(!hg) return null;
    const depthOnly=new THREE.MeshBasicMaterial({ colorWrite:false }); const inHat=o=>{ for(let p=o;p;p=p.parent) if(p===hg) return true; return false; };
    m.traverse(o=>{ if(!(o.isMesh||o.isLine)) return; if(inHat(o)) o.renderOrder=2; else { o.material=depthOnly; o.renderOrder=-2; } });
    return bake(m,opt); }

  /* ---------- town & field architecture (baked into HD sprites) ---------- */
  function shingleRoofGable(W,D,H,col,colD){ const g=new THREE.Group(); const sh=new THREE.Shape(); sh.moveTo(-W/2-.25,0); sh.lineTo(0,H); sh.lineTo(W/2+.25,0); sh.lineTo(-W/2-.25,0);
    const r=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{ depth:D+.5, bevelEnabled:false }),toon(col)); r.position.z=-D/2-.25; ink(r,1.02); g.add(r);
    for(let i=1;i<7;i++){ const y=i*H/7, w=(W+.5)*(1-y/H); const st=new THREE.Mesh(new THREE.BoxGeometry(w,.05,D+.52),toon(colD)); st.position.y=y; g.add(st); } return g; }
  function coneRoof(r,h,col,colD,rings=6){ const g=new THREE.Group(); const c=new THREE.Mesh(new THREE.ConeGeometry(r,h,20),toon(col)); c.position.y=h/2; ink(c,1.03); g.add(c);
    for(let i=1;i<rings;i++){ const t=i/rings, rr=r*(1-t)+.01; const ring=new THREE.Mesh(new THREE.TorusGeometry(rr,.035,5,24),toon(colD)); ring.rotation.x=Math.PI/2; ring.position.y=h*t; g.add(ring); }
    const tip=new THREE.Mesh(new THREE.ConeGeometry(.06,.5,8),std(0x9aa0a8,{ metalness:.3, roughness:.4 })); tip.position.y=h+.2; g.add(tip); return g; }
  function signIcon(kind){ const g=new THREE.Group(); const m=c=>toon(c);
    if(kind==='sword'){ mk(g,new THREE.BoxGeometry(.05,.34,.02),m(0xdfe7ee),0,.04,0); mk(g,new THREE.BoxGeometry(.18,.04,.03),m(0xe2b44a),0,-.1,0); }
    else if(kind==='shield'){ mk(g,new THREE.CylinderGeometry(.13,.13,.03,16),m(0x4f7ab5),0,0,0).rotation.x=Math.PI/2; mk(g,new THREE.CylinderGeometry(.06,.06,.035,12),m(0xe2b44a),0,0,.01).rotation.x=Math.PI/2; }
    else if(kind==='potion'){ mk(g,new THREE.SphereGeometry(.1,12,10),m(0xd33c3c),0,-.04,0); mk(g,new THREE.CylinderGeometry(.03,.03,.1,8),m(0xe9e2d8),0,.1,0); }
    else if(kind==='bed'){ mk(g,new THREE.BoxGeometry(.3,.1,.03),m(0xc8493f),0,-.03,0); mk(g,new THREE.BoxGeometry(.1,.08,.035),m(0xf4efe2),-.1,.05,0); }
    else if(kind==='bow'){ mk(g,new THREE.TorusGeometry(.14,.02,5,16,Math.PI),m(0x8a5a2b),0,0,0).rotation.z=-Math.PI/2; mk(g,new THREE.BoxGeometry(.3,.015,.02),m(0xd9c9a0),.02,0,0); }
    else if(kind==='crossed'){ [-1,1].forEach(sd=>{ const b=mk(g,new THREE.BoxGeometry(.04,.36,.02),m(0xdfe7ee),0,0,0); b.rotation.z=sd*.7; }); }
    else if(kind==='crate'){ mk(g,new THREE.BoxGeometry(.2,.18,.03),m(0xb8844e),0,0,0); }
    return g; }
  function makeHouse(o){
    const g=new THREE.Group(), W=o.w*1.0, D=2.0, WH=1.55;
    mk(g,new THREE.BoxGeometry(W+.2,.4,D+.2),flat(0xa9a296),0,.2,0,1.02);
    mk(g,new THREE.BoxGeometry(W,WH,D),toon(o.wall),0,.4+WH/2,0,1.02);
    const beam=toon(o.beam); [-W/2+.06,-W/6,W/6,W/2-.06].forEach(x=>mk(g,new THREE.BoxGeometry(.1,WH,.06),beam,x,.4+WH/2,D/2+.03)); mk(g,new THREE.BoxGeometry(W,.1,.06),beam,0,.4+WH*.62,D/2+.03); mk(g,new THREE.BoxGeometry(W,.1,.06),beam,0,.4+WH-.05,D/2+.03);
    const roof=shingleRoofGable(W,D,1.25,o.roof,o.roofS); roof.position.y=.4+WH; g.add(roof);
    const door=new THREE.Group(); door.position.set(0,.4,D/2+.04); g.add(door); mk(door,new THREE.BoxGeometry(.62,1.0,.06),toon(o.door),0,.5,0); mk(door,new THREE.CylinderGeometry(.31,.31,.06,16,1,false,0,Math.PI),toon(o.door),0,1.0,0).rotation.x=Math.PI/2; mk(door,new THREE.SphereGeometry(.04,8,6),toon(0xe2b44a),.2,.5,.04);
    [-1,1].forEach(sd=>{ const x=sd*W*.3; mk(g,new THREE.BoxGeometry(.5,.5,.05),std(0xffe6a0,{ emissive:0xffc860, emissiveIntensity:.5 }),x,.4+WH*.42,D/2+.04); mk(g,new THREE.BoxGeometry(.56,.06,.07),beam,x,.4+WH*.42,D/2+.06); mk(g,new THREE.BoxGeometry(.06,.56,.07),beam,x,.4+WH*.42,D/2+.06);
      mk(g,new THREE.BoxGeometry(.6,.12,.2),toon(0x8a5a2b),x,.4+WH*.2,D/2+.12); for(let i=0;i<4;i++) mk(g,new THREE.SphereGeometry(.06,8,6),toon([0xff8fb8,0xffd84a,0xff6b5e,0x8ec5ff][i]),x-.2+i*.13,.4+WH*.27,D/2+.16); });
    if(o.chimney) mk(g,new THREE.BoxGeometry(.32,.9,.32),flat(0x9a9388),W*.28,.4+WH+.8,-.3,1.04);
    if(o.sign){ const sg=new THREE.Group(); sg.position.set(W*.18+.5,.4+WH*.85,D/2+.35); g.add(sg); mk(sg,new THREE.BoxGeometry(.5,.04,.04),beam,-.1,.28,0); mk(sg,new THREE.BoxGeometry(.44,.36,.05),toon(0xe8d4a0),0,0,0,1.08); const ic=signIcon(o.sign); ic.position.z=.04; sg.add(ic); }
    return g; }
  function makeProp(kind,o={}){
    const g=new THREE.Group(), stone=flat(0xc2bbaf), stoneD=flat(0x9a9388), wood=toon(0x8a5a2b), woodD=toon(0x5e3d22), iron=std(0x2a2a34,{ roughness:.5 });
    if(kind==='house') return makeHouse(o);
    if(kind==='tower'){ mk(g,new THREE.CylinderGeometry(o.r,o.r*1.05,o.h,18),toon(o.wall),0,o.h/2,0,1.03); for(let i=0;i<3;i++) mk(g,new THREE.BoxGeometry(.28,.42,.05),std(0xffd27a,{ emissive:0xffb040, emissiveIntensity:.6 }),0,o.h*(.3+i*.22),o.r-.01);
      mk(g,new THREE.TorusGeometry(o.r*1.02,.06,6,24),toon(o.trim||0xe8c170),0,o.h,0).rotation.x=Math.PI/2; const cr=coneRoof(o.r*1.35,o.h*.55,o.roof,o.roofS); cr.position.y=o.h; g.add(cr);
      mk(g,new THREE.BoxGeometry(.5,.8,.06),toon(0x5a3b1e),0,.4,o.r); return g; }
    if(kind==='castle'){ const wallC=toon(0xd6cfc2), wallS=toon(0xb8b0a2);
      mk(g,new THREE.BoxGeometry(7.4,2.2,1.4),wallC,0,1.1,.9,1.02); for(let i=0;i<12;i++) mk(g,new THREE.BoxGeometry(.4,.35,1.42),wallC,-3.4+i*.62,2.35,.9);
      mk(g,new THREE.BoxGeometry(1.5,1.7,.1),toon(0x1c1a2a),0,.85,1.62); mk(g,new THREE.CylinderGeometry(.75,.75,.1,16,1,false,0,Math.PI),toon(0x1c1a2a),0,1.7,1.62).rotation.x=Math.PI/2;
      for(let i=0;i<6;i++) mk(g,new THREE.BoxGeometry(.05,1.6,.05),iron,-.6+i*.24,.85,1.66);
      mk(g,new THREE.BoxGeometry(3.6,3.8,2.4),wallS,0,1.9,-.9,1.02); const kr=coneRoof(1.9,2.2,0xe0823a,0xb8602a,7); kr.position.set(0,3.8,-.9); g.add(kr);
      [0,1].forEach(i=>mk(g,new THREE.BoxGeometry(.4,.7,.06),std(0xffd27a,{ emissive:0xffb040, emissiveIntensity:.6 }),-.8+i*1.6,2.8,.33));
      mk(g,new THREE.CylinderGeometry(.45,.45,.06,20),std(0x6fb6ff,{ emissive:0x2060a0, emissiveIntensity:.4 }),0,3.0,.34).rotation.x=Math.PI/2;
      [-3.6,3.6].forEach(x=>{ mk(g,new THREE.CylinderGeometry(.9,.95,4.2,18),wallC,x,2.1,.5,1.03); for(let i=0;i<3;i++) mk(g,new THREE.BoxGeometry(.3,.5,.05),std(0xffd27a,{ emissive:0xffb040, emissiveIntensity:.6 }),x,1.2+i*1.1,1.44); const tr=coneRoof(1.2,2.2,0xe0823a,0xb8602a,7); tr.position.set(x,4.2,.5); g.add(tr); });
      [[-2,0xc8342c],[-1.2,0x2f5a8a],[1.2,0x2f5a8a],[2,0xc8342c]].forEach(([x,c])=>{ mk(g,new THREE.BoxGeometry(.45,1.2,.03),toon(c),x,1.3,1.62); mk(g,new THREE.BoxGeometry(.45,.1,.04),toon(0xe2b44a),x,1.9,1.63); });
      return g; }
    if(kind==='cathedral'){ const w=toon(0xefe9dd), ws=toon(0xd9d2c4);
      mk(g,new THREE.BoxGeometry(3.2,2.6,3.4),w,0,1.3,0,1.02); const r=shingleRoofGable(3.2,3.4,1.7,0x4f6fa8,0x34507e); r.position.y=2.6; g.add(r);
      mk(g,new THREE.CylinderGeometry(.55,.55,.08,24),std(0x2f5a8a),0,2.0,1.72).rotation.x=Math.PI/2; for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; mk(g,new THREE.SphereGeometry(.12,8,6),toon([0xe2524a,0xffd84a,0x8fd46b,0x6fb6ff][i%4]),Math.cos(a)*.34,2.0+Math.sin(a)*.34,1.76); } mk(g,new THREE.SphereGeometry(.14,10,8),toon(0xfff4c0),0,2.0,1.77);
      mk(g,new THREE.BoxGeometry(.9,1.3,.08),toon(0x6b4424),0,.65,1.72); mk(g,new THREE.CylinderGeometry(.45,.45,.08,16,1,false,0,Math.PI),toon(0x6b4424),0,1.3,1.72).rotation.x=Math.PI/2;
      [-1,1].forEach(sd=>{ mk(g,new THREE.BoxGeometry(.9,3.6,.9),ws,sd*1.9,1.8,.9,1.02); const sp=coneRoof(.7,2.2,0x4f6fa8,0x34507e,6); sp.position.set(sd*1.9,3.6,.9); g.add(sp); mk(g,new THREE.BoxGeometry(.3,.6,.05),std(0x6fb6ff,{ emissive:0x2060a0, emissiveIntensity:.3 }),sd*1.9,2.4,1.37); });
      const cr=new THREE.Group(); cr.position.set(0,4.5,1.2); g.add(cr); mk(cr,new THREE.BoxGeometry(.08,.6,.08),toon(0xe2b44a),0,0,0); mk(cr,new THREE.BoxGeometry(.36,.08,.08),toon(0xe2b44a),0,.1,0); return g; }
    if(kind==='belltower'){ mk(g,new THREE.BoxGeometry(1.2,3.2,1.2),stone,0,1.6,0,1.02); mk(g,new THREE.BoxGeometry(1.3,.15,1.3),stoneD,0,3.2,0);
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([x,z])=>mk(g,new THREE.BoxGeometry(.16,.9,.16),stoneD,x*.55,3.7,z*.55)); mk(g,new THREE.CylinderGeometry(.08,.28,.45,12),std(0xe2b44a,{ metalness:.35, roughness:.3 }),0,3.7,0);
      const r=coneRoof(1.0,1.2,0x4f6fa8,0x34507e,4); r.position.y=4.15; g.add(r); mk(g,new THREE.CylinderGeometry(.34,.34,.06,20),toon(0xf4efe2),0,2.4,.62).rotation.x=Math.PI/2; mk(g,new THREE.BoxGeometry(.04,.26,.03),toon(0x1c1a2a),0,2.48,.66); mk(g,new THREE.BoxGeometry(.18,.04,.03),toon(0x1c1a2a),.06,2.4,.66);
      mk(g,new THREE.BoxGeometry(.5,.8,.06),toon(0x5a3b1e),0,.4,.61); return g; }
    if(kind==='fountain'){ mk(g,new THREE.CylinderGeometry(1.5,1.6,.5,32),stone,0,.25,0,1.02); mk(g,new THREE.CylinderGeometry(1.35,1.35,.06,32),std(0x4fb6e6,{ emissive:0x10406a, emissiveIntensity:.3, roughness:.1 }),0,.46,0);
      mk(g,new THREE.CylinderGeometry(.25,.32,1.1,16),stone,0,.95,0,1.03); mk(g,new THREE.CylinderGeometry(.6,.3,.2,24),stone,0,1.5,0,1.03); mk(g,new THREE.CylinderGeometry(.52,.52,.04,24),std(0x6fc6ee,{ roughness:.1 }),0,1.6,0);
      const j=makeJellop(0xf593b7); j.scale.setScalar(.55); j.position.y=1.6; g.add(j); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; mk(g,new THREE.SphereGeometry(.05,6,6),toon(0xd9f5ff),Math.cos(a)*.7,1.2,Math.sin(a)*.7); } return g; }
    if(kind==='stall'){ mk(g,new THREE.BoxGeometry(1.8,.8,.8),wood,0,.4,.2,1.03); mk(g,new THREE.BoxGeometry(1.84,.06,.84),toon(0xb8844e),0,.82,.2);
      [[-.85,-.2],[.85,-.2],[-.85,.55],[.85,.55]].forEach(([x,z])=>mk(g,new THREE.BoxGeometry(.08,1.7,.08),woodD,x,.85,z));
      for(let i=0;i<8;i++){ const st=mk(g,new THREE.BoxGeometry(.25,.05,1.2),toon(i%2?0xf4efe2:o.col),-.88+i*.25,1.78,.25); st.rotation.x=.25; }
      for(let i=0;i<6;i++) mk(g,new THREE.SphereGeometry(.09,10,8),toon(o.goods[i%o.goods.length]),-.6+i*.24,.93,.25); return g; }
    if(kind==='lamp'){ mk(g,new THREE.CylinderGeometry(.06,.09,2.4,8),iron,0,1.2,0,1.1); mk(g,new THREE.BoxGeometry(.3,.36,.3),std(0xffe9a0,{ emissive:0xffd070, emissiveIntensity:1.4 }),0,2.55,0,1.08); mk(g,new THREE.ConeGeometry(.26,.2,4),iron,0,2.83,0).rotation.y=Math.PI/4;
      if(o.banner){ mk(g,new THREE.BoxGeometry(.4,.04,.04),iron,.2,2.1,0); mk(g,new THREE.BoxGeometry(.3,.62,.03),toon(o.banner),.3,1.75,0,1.08); } return g; }
    if(kind==='bench'){ for(let i=0;i<3;i++) mk(g,new THREE.BoxGeometry(1.4,.06,.14),wood,0,.42,-.15+i*.15,1.05); mk(g,new THREE.BoxGeometry(1.4,.3,.06),wood,0,.66,-.24,1.05); [-.6,.6].forEach(x=>{ mk(g,new THREE.BoxGeometry(.08,.42,.4),iron,x,.21,0); }); return g; }
    if(kind==='planter'){ mk(g,new THREE.BoxGeometry(1.0,.4,.5),wood,0,.2,0,1.05); for(let i=0;i<7;i++){ mk(g,new THREE.SphereGeometry(.1,8,6),toon(0x4f9a3c),-.4+i*.13,.45,0); mk(g,new THREE.SphereGeometry(.07,8,6),toon([0xff8fb8,0xffd84a,0xffffff,0xb98cff][i%4]),-.4+i*.13,.56,.05); } return g; }
    if(kind==='board'){ [-1,1].forEach(sd=>mk(g,new THREE.BoxGeometry(.1,1.5,.1),woodD,sd*.5,.75,0)); mk(g,new THREE.BoxGeometry(1.3,.8,.08),wood,0,1.1,0,1.05); for(let i=0;i<4;i++) mk(g,new THREE.BoxGeometry(.28,.3,.02),toon([0xfff6e0,0xffe0e0,0xe0f0ff,0xfff6e0][i]),-.4+i*.27,1.1+(i%2)*.1,.05); return g; }
    if(kind==='crates'){ [[-.3,0,0,.5],[.3,0,.05,.45],[0,.48,0,.4]].forEach(([x,y,z,s])=>{ mk(g,new THREE.BoxGeometry(s,s,s),toon(0xb8844e),x,y+s/2,z,1.05); mk(g,new THREE.BoxGeometry(s+.01,.05,s+.01),toon(0x8a5a2b),x,y+s*.8,z); }); return g; }
    if(kind==='statue'){ mk(g,new THREE.BoxGeometry(.9,.8,.9),stoneD,0,.4,0,1.03); mk(g,new THREE.BoxGeometry(.6,.14,.02),toon(0xe2b44a),0,.45,.46); const st=toon(0xcfc8bc);
      mk(g,new THREE.CapsuleGeometry(.2,.5,4,10),st,0,1.3,0,1.05); mk(g,new THREE.SphereGeometry(.2,14,10),st,0,1.85,0,1.05); mk(g,new THREE.BoxGeometry(.06,1.0,.03),st,.28,1.6,.1); mk(g,new THREE.BoxGeometry(.24,.05,.05),st,.28,1.15,.1);
      [-1,1].forEach(sd=>mk(g,new THREE.CapsuleGeometry(.08,.4,4,8),st,sd*.1,.95,0)); return g; }
    if(kind==='hedge'){ [[0,.3,0,.36],[.22,.26,.1,.26],[-.22,.26,-.05,.26],[0,.5,-.05,.24]].forEach(([x,y,z,r],i)=>mk(g,new THREE.IcosahedronGeometry(r,1),flat([0x3f8f47,0x52a557,0x468c4a][i%3]),x,y,z,1.03)); return g; }
    if(kind==='wall'){ mk(g,new THREE.BoxGeometry(1,1.2,.8),stone,0,.6,0,1.02); [-.3,.3].forEach(x=>mk(g,new THREE.BoxGeometry(.3,.3,.8),stone,x,1.35,0)); mk(g,new THREE.BoxGeometry(1.01,.05,.81),stoneD,0,.8,0); return g; }
    if(kind==='mill'){ mk(g,new THREE.CylinderGeometry(.6,.9,2.6,12),toon(0xefe6d6),0,1.3,0,1.03); const r=coneRoof(.8,.9,0xb54a35,0x8e3526,4); r.position.y=2.6; g.add(r); mk(g,new THREE.BoxGeometry(.4,.7,.06),toon(0x6b4424),0,.35,.8); mk(g,new THREE.BoxGeometry(.3,.3,.05),std(0xffe6a0,{ emissive:0xffc860, emissiveIntensity:.5 }),0,1.7,.66); return g; }
    if(kind==='blades'){ for(let i=0;i<4;i++){ const a=new THREE.Group(); a.rotation.z=i*Math.PI/2+.4; g.add(a); mk(a,new THREE.BoxGeometry(.08,1.9,.05),woodD,0,.95,0); mk(a,new THREE.BoxGeometry(.4,1.4,.02),toon(0xf1e6c8),.24,1.1,.02,1.04);
        for(let k=0;k<5;k++) mk(a,new THREE.BoxGeometry(.42,.02,.03),woodD,.24,.45+k*.3,.03); } mk(g,new THREE.SphereGeometry(.12,10,8),toon(0x6e4a26),0,0,.05); return g; }
    if(kind==='barn'){ mk(g,new THREE.BoxGeometry(2.6,1.5,1.8),toon(0xa63e2c),0,.75,0,1.02); for(let i=0;i<8;i++) mk(g,new THREE.BoxGeometry(.03,1.5,.02),toon(0x7a2a1e),-1.2+i*.34,.75,.91);
      const r=shingleRoofGable(2.6,1.8,1.1,0x5a3b1e,0x3e2816); r.position.y=1.5; g.add(r); mk(g,new THREE.BoxGeometry(.9,1.1,.05),toon(0xf4efe2),0,.55,.92); [-1,1].forEach(sd=>{ const x=mk(g,new THREE.BoxGeometry(.06,1.3,.04),toon(0xa63e2c),0,.55,.95); x.rotation.z=sd*.68; }); return g; }
    if(kind==='scarecrow'){ mk(g,new THREE.BoxGeometry(.08,1.6,.08),woodD,0,.8,0); mk(g,new THREE.BoxGeometry(1.1,.08,.08),woodD,0,1.25,0); mk(g,new THREE.CylinderGeometry(.24,.3,.55,10),toon(0x4f7ab5),0,1.1,0,1.05);
      mk(g,new THREE.SphereGeometry(.2,12,10),toon(0xe6cc88),0,1.55,0,1.05); const hat=mk(g,new THREE.CylinderGeometry(.34,.34,.03,16),toon(0xc9a040),0,1.7,0,1.05); mk(g,new THREE.CylinderGeometry(.15,.18,.2,12),toon(0xc9a040),0,1.8,0); [-1,1].forEach(sd=>mk(g,new THREE.ConeGeometry(.06,.2,6),toon(0xe6c24a),sd*.58,1.2,0).rotation.z=sd*Math.PI/2); return g; }
    if(kind==='ruin'){ mk(g,new THREE.BoxGeometry(.8,.25,.8),stoneD,0,.12,0,1.03); mk(g,new THREE.CylinderGeometry(.28,.3,1.5,10),stone,0,1.0,0,1.03); for(let i=0;i<5;i++) mk(g,new THREE.BoxGeometry(.18,.2,.18),stone,Math.cos(i)*.15,1.8,Math.sin(i)*.15).rotation.set(i,i,0); for(let i=0;i<6;i++) mk(g,new THREE.SphereGeometry(.07,6,4),toon(0x6cae4c),Math.cos(i*2)*.29,.5+i*.15,Math.sin(i*2)*.29); return g; }
    if(kind==='sign'){ mk(g,new THREE.BoxGeometry(.08,1.1,.08),woodD,0,.55,0); const b=mk(g,new THREE.BoxGeometry(.7,.24,.05),wood,.15,.9,0,1.06); mk(g,new THREE.ConeGeometry(.14,.18,3),wood,.55,.9,0).rotation.z=-Math.PI/2; return g; }
    if(kind==='fence'){ [-.45,.45].forEach(x=>mk(g,new THREE.BoxGeometry(.1,.6,.1),woodD,x,.3,0)); [.2,.42].forEach(y=>mk(g,new THREE.BoxGeometry(1,.07,.06),wood,0,y,0)); return g; }
    if(kind==='rail'){ mk(g,new THREE.BoxGeometry(1,.3,.25),stone,0,.15,0,1.03); return g; }
    return g; }
  /* ---------- world props ---------- */
  function makeTree(kind){
    const g=new THREE.Group(), trunk=new THREE.Group(), crown=new THREE.Group(); g.add(trunk,crown);
    const tm=flat(0x8a5a32); const t=mk(trunk,new THREE.CylinderGeometry(.24,.36,1.9,8),tm,0,.95,0,1.05);
    [[.3,.3],[-.25,.5]].forEach(([x,r])=>{ const br=mk(trunk,new THREE.CylinderGeometry(.08,.12,.8,6),tm,x,1.5,0,0); br.rotation.z=-x*2; });
    const pal={ green:[0x4f9a3c,0x62ad48,0x3f8a34], bloom:[0x5aa648,0x6cb652,0x4f9a3c], autumn:[0xe08a2c,0xf0a83a,0xc86a22], gold:[0xc9a02b,0xe6c24a,0xb08a1e] }[kind]||[0x4f9a3c,0x62ad48,0x3f8a34];
    [[0,2.6,0,1.3],[.85,2.3,.3,.95],[-.8,2.35,-.2,1.0],[.1,3.3,-.1,.9],[-.2,2.2,.85,.85],[.3,2.4,-.8,.8]].forEach(([x,y,z,r],i)=>{ const m=mk(crown,new THREE.IcosahedronGeometry(r,1),flat(pal[i%3]),x,y,z,1.03); m.rotation.set(i,i*2,0); });
    if(kind==='bloom'){ for(let i=0;i<34;i++){ const a=i*2.4, b=.2+(i%7)*.18; mk(crown,new THREE.IcosahedronGeometry(.12,0),std(i%3?0xffb6d0:0xfff0f6,{ roughness:.6 }),Math.cos(a)*1.25*Math.sin(b),2.6+Math.cos(b)*1.15,Math.sin(a)*1.25*Math.sin(b)); } }
    g.userData={ layers:{ trunk, crown }, kind:'tree' }; return g;
  }
  function makeRock(){ const g=new THREE.Group(); const m=mk(g,new THREE.DodecahedronGeometry(.6,0),flat(0x9aa0a8),0,.28,0,1.05); m.scale.set(1.2,.7,1); m.rotation.y=.6; const s=mk(g,new THREE.DodecahedronGeometry(.3,0),flat(0xb4bac0),.55,.15,.2,1.08); s.scale.set(1,.7,1); g.userData={kind:'rock'}; return g; }
  function makeFlower(col){ const g=new THREE.Group(); [[0,0],[.12,.08],[-.1,.1]].forEach(([x,z],i)=>{ mk(g,new THREE.CylinderGeometry(.012,.012,.32-i*.06,4),toon(0x4f9a3c),x,.16-i*.03,z);
      const hd=new THREE.Group(); hd.position.set(x,.33-i*.06,z); g.add(hd); for(let p=0;p<5;p++){ const a=p/5*Math.PI*2; mk(hd,new THREE.SphereGeometry(.045,8,6),toon(col),Math.cos(a)*.05,0,Math.sin(a)*.05); } mk(hd,new THREE.SphereGeometry(.03,8,6),toon(0xffd84a),0,.01,0); });
    [-1,1].forEach(s=>{ const l=mk(g,new THREE.SphereGeometry(.06,8,6),toon(0x5fae4a),s*.07,.06,0); l.scale.set(1.6,.4,.8); }); g.userData={kind:'flower'}; return g; }
  function makeTuft(col=0x5ea343){ const g=new THREE.Group(); for(let i=0;i<7;i++){ const b=mk(g,new THREE.ConeGeometry(.035,.34+(i%3)*.08,4),toon(i%2?col:0x8fd46b),(i-3)*.05,.17,(i%2)*.04); b.rotation.z=(i-3)*.14; } g.userData={kind:'tuft'}; return g; }
  function makeReed(){ const g=new THREE.Group(); for(let i=0;i<4;i++){ const x=(i-1.5)*.08; const s=mk(g,new THREE.CylinderGeometry(.012,.015,.7-(i%2)*.15,4),toon(0x5e8f3a),x,.33,0); s.rotation.z=(i-1.5)*.1;
      if(i%2===0){ const c=mk(g,new THREE.CapsuleGeometry(.03,.1,3,6),toon(0x7a4a22),x+(i-1.5)*.03,.62,0); } } g.userData={kind:'reed'}; return g; }
  function makeWheat(){ const g=new THREE.Group(); for(let i=0;i<5;i++){ const x=(i-2)*.07; const s=mk(g,new THREE.CylinderGeometry(.01,.012,.6,4),toon(0xc9a040),x,.3,(i%2)*.04); s.rotation.z=(i-2)*.08;
      const h=mk(g,new THREE.CapsuleGeometry(.035,.12,3,6),toon(0xf0cf6a),x+(i-2)*.025,.64,(i%2)*.04); h.rotation.z=(i-2)*.1+.2; } g.userData={kind:'wheat'}; return g; }
  function makeHay(){ const g=new THREE.Group(); const h=mk(g,new THREE.SphereGeometry(.7,16,12,0,Math.PI*2,0,Math.PI/2),flat(0xe0bc55),0,0,0,1.04); h.scale.set(1.1,1.15,1.1);
    for(let i=0;i<14;i++){ const a=i*1.3; const st=mk(g,new THREE.CylinderGeometry(.012,.012,.3,3),toon(0xf5dc88),Math.cos(a)*.6,.2+(i%4)*.12,Math.sin(a)*.6); st.rotation.set(i,i*2,1); } g.userData={kind:'hay'}; return g; }
  function makeLily(){ const g=new THREE.Group(); const l=mk(g,new THREE.CircleGeometry(.4,20,.3,5.9),std(0x5fae4a),0,.02,0); l.rotation.x=-Math.PI/2; mk(g,new THREE.SphereGeometry(.09,10,8),toon(0xffb6d0),.12,.07,.05); g.userData={kind:'lily'}; return g; }
  /** bake several layers of one model with identical framing (e.g. tree trunk + crown) */
  function bakeLayers(model,{w,h,k=3,yaw=0}){
    const r=renderer(), sc=stage(); sc.add(model); const wu=w/32, hu=h/32, cam=cameraFor(wu,hu); model.rotation.y=yaw;
    fitModel(model,cam,[()=>{}],wu,hu,.08); r.setSize(w*k,h*k,false); const out={};
    const L=model.userData.layers; Object.keys(L).forEach(name=>{ Object.keys(L).forEach(n2=>L[n2].visible=(n2===name)); r.render(sc,cam); const c=document.createElement('canvas'); c.width=w*k; c.height=h*k; c.getContext('2d').drawImage(r.domElement,0,0); out[name]=c; });
    Object.keys(L).forEach(n2=>L[n2].visible=true); sc.remove(model); return out;
  }
  /* ---------- baker ---------- */
  let R=null;
  function renderer(){ if(!R){ R=new THREE.WebGLRenderer({ antialias:true, alpha:true, preserveDrawingBuffer:true }); R.setPixelRatio(1); R.outputColorSpace=THREE.SRGBColorSpace; R.toneMapping=THREE.ACESFilmicToneMapping; R.toneMappingExposure=1.08; R.setClearColor(0x000000,0); } return R; }
  function stage(){ const sc=new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xf2f7ff,0x8a7055,1.25)); const key=new THREE.DirectionalLight(0xfff2de,2.1); key.position.set(-2.5,4,3.5); sc.add(key); const rim=new THREE.DirectionalLight(0xbfe0ff,.9); rim.position.set(2,2.5,-3); sc.add(rim); return sc; }
  const ELEV=40*Math.PI/180;
  function cameraFor(wu,hu,feet=.08){ const c=new THREE.OrthographicCamera(-wu/2,wu/2,hu-feet,-feet,.1,50); c.position.set(0,Math.sin(ELEV)*20,Math.cos(ElEV_fix())*20); c.lookAt(0,0,0); c.updateProjectionMatrix(); return c; }
  function ElEV_fix(){ return ELEV; }
  // fit a model into a frame: uniform scale + vertical lift so every pose stays inside (vertex-accurate, view space)
  function fitModel(model,cam,poses,wu,hu,feet){ const v=new THREE.Vector3(); let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
    model.scale.setScalar(1); model.position.y=0; cam.updateMatrixWorld(true);
    poses.forEach(fn=>{ fn(); model.updateMatrixWorld(true);
      model.traverse(m=>{ if(!m.isMesh||m.userData.ink||!m.visible) return; const pa=m.geometry.attributes.position, st=Math.max(1,Math.floor(pa.count/300));
        for(let i=0;i<pa.count;i+=st){ v.fromBufferAttribute(pa,i).applyMatrix4(m.matrixWorld).applyMatrix4(cam.matrixWorldInverse); x0=Math.min(x0,v.x); x1=Math.max(x1,v.x); y0=Math.min(y0,v.y); y1=Math.max(y1,v.y); } }); });
    const pad=(y1-y0)*.05; y0-=pad; y1+=pad; x0-=pad; x1+=pad;
    const sc=Math.min((wu*.94)/(2*Math.max(Math.abs(x0),Math.abs(x1))),(hu*.92)/(y1-y0)); model.scale.setScalar(sc);
    const want=-feet+hu*.03, dyView=want-y0*sc; model.position.y=dyView/Math.cos(ELEV); return sc; }
  /** bake frames: dirs = array of yaw angles, frames = [{state,ph}], size = {w,h} world px, k = supersample */
  function bake(model, {dirs, frames, w, h, k=3, fit=false, pose}){
    const r=renderer(), sc=stage(); sc.add(model); const wu=w/32, hu=h/32, cam=cameraFor(wu,hu);
    const P=pose||((m,s,p)=>m.userData.body&&m.userData.legL?poseHero(m,s,p):poseMob(m,s,p));
    let s=1; if(fit){ model.rotation.y=dirs[0]; s=fitModel(model,cam,frames.map(f=>()=>P(model,f.state,f.ph)),wu,hu,.08); }
    else if(arguments[1].scale){ s=arguments[1].scale; model.scale.setScalar(s); }
    const W=w*k, H=h*k; r.setSize(W,H,false);
    const sheet=document.createElement('canvas'); sheet.width=W*frames.length*dirs.length; sheet.height=H; const ctx=sheet.getContext('2d');
    let i=0; dirs.forEach(yaw=>{ model.rotation.y=yaw; frames.forEach(f=>{ P(model,f.state,f.ph); r.render(sc,cam); ctx.drawImage(r.domElement,i*W,0); i++; }); });
    sc.remove(model); return { canvas:sheet, fw:W, fh:H, count:i, scale:s };
  }
  const HERO_FRAMES=[{state:'idle',ph:0},{state:'idle',ph:.5},{state:'walk',ph:0},{state:'walk',ph:.25},{state:'walk',ph:.5},{state:'walk',ph:.75},{state:'attack',ph:.3},{state:'attack',ph:.85},{state:'sit',ph:0}];
  return { THREE, makeProp, HAIR_STYLES, WEAPON_LOOK, ARMOR_LOOK, makeHeadgear, attachHeadgear, bakeHeadgearLayer, makeHero, poseHero, makeTree, makeRock, makeFlower, makeTuft, makeReed, makeWheat, makeHay, makeLily, bakeLayers, makeJellop, makeKingJellop, makeMoth, makeBunny, makeThornling, makeBoarling, makeScorpion, makeGolem, poseMob, bake, HERO_FRAMES, OUTFIT };
}

