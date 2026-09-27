/* ============================================================
   DOM UI
   ============================================================ */
const $=id=>document.getElementById(id);
let started=false;
const LOG_TAG={sys:'[ระบบ]',warn:'[ระบบ]',exp:'[EXP]',drop:'[ไอเทม]',say:''};
function logMsg(txt,cls){ const p=document.createElement('p'); p.className=cls||'sys'; p.textContent=txt; p.dataset.tag=LOG_TAG[p.className]??''; const L=$('log'); L.appendChild(p); while(L.children.length>60) L.firstChild.remove(); L.scrollTop=L.scrollHeight; }
let toastT; function toast(txt){ const t=$('toast'); t.textContent=txt; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2400); }
function refreshBars(){
  const d=derived(); P.hp=Math.min(P.hp,d.maxHP); P.sp=Math.min(P.sp,d.maxSP);
  $('hpFill').style.width=(100*P.hp/d.maxHP)+'%'; $('hpText').textContent=`${P.hp} / ${d.maxHP}`; $('hpBar').classList.toggle('low',P.hp/d.maxHP<.25);
  $('spFill').style.width=(100*P.sp/d.maxSP)+'%'; $('spText').textContent=`${P.sp} / ${d.maxSP}`;
}
function skillSlotHTML(i,withKey){
  const id=P.skillbar[i], sk=id&&SKILLS[id]; const key=['Q','E','R'][i];
  if(!sk) return {sig:'none'+i, html:`<span class="k">${key}</span><b>—</b>`, off:true, empty:true, col:'#5a6070', title:'ช่องสกิลว่าง ผูกสกิลได้ในหน้าสกิล (K)'};
  const lv=skLv(id), cost=lv?sk.sp(lv):0;
  return { sig:id+lv, html:`<span class="k">${key}</span><img alt="" src="${SKICON[id]}"><span class="spc">${lv?'SP '+cost:'ยังไม่เรียน'}</span>`, off:!lv||P.sp<cost, col:ELEM_COL[sk.elem]||'#8f7d61', title:`${sk.name} Lv ${lv} (SP ${cost})` };
}
function refreshSkillSlots(){
  if(!S) return; const now=S.time.now, cd=now<(hero.skillReadyAt||0)||!!hero.cast;
  document.querySelectorAll('[data-sk]').forEach(el=>{ const i=+el.dataset.sk; const s=skillSlotHTML(i,true); el.classList.toggle('empty',!!s.empty);
    if(el.dataset.sig!==s.sig){ el.innerHTML=s.html; el.dataset.sig=s.sig; el.style.setProperty('--sk',s.col); el.title=s.title; el.setAttribute('aria-label',s.title); }
    el.classList.toggle('off',s.off); el.classList.toggle('cd',cd&&!s.off); });
}
function refreshUI(){
  refreshBars();
  const d=derived(), J=JOBS[P.job];
  $('pName').textContent=P.name; $('pJob').textContent=P.job; if(hero.label) hero.label.setText(P.name);
  $('solTop').textContent=P.sol>=10000?(P.sol/1000).toFixed(1)+'K':P.sol.toLocaleString();
  { const dd=derived(); $('pPow').textContent=Math.floor(dd.satk+dd.weapon.atk+dd.matkMax+dd.hardDef*5+dd.softDef*2+dd.maxHP/10+dd.flee+dd.hit+dd.crit*5).toLocaleString(); }
  $('rbDot').classList.toggle('hidden',!(P.points>0||P.skillPts>0));
  questCheck(); renderQuest();
  $('bLv').textContent=P.lv; $('jLv').textContent=P.jlv; $('sol').textContent=P.sol.toLocaleString(); $('sol2').textContent=P.sol.toLocaleString();
  const badge=(id,v)=>{ const b=$(id); b.textContent=v; b.classList.toggle('hidden',!v); };
  badge('bdgStat',P.points>0?'+'+P.points:''); badge('bdgSkill',P.skillPts>0?'+'+P.skillPts:'');
  const invN=Object.values(P.inv).reduce((a,b)=>a+b,0); badge('bdgBag',invN?String(invN):'');
  drawAvatar();
  const be=P.lv>=BASE_CAP?100:100*P.exp/baseNeed(P.lv), je=P.jlv>=J.cap?100:100*P.jexp/J.table[P.jlv-1];
  $('expFill').style.width=be+'%'; $('expPct').textContent=be.toFixed(1)+'%'; $('jexpFill').style.width=je+'%'; $('jexpPct').textContent=je.toFixed(1)+'%';
  // status
  const rows=$('statRows'); rows.innerHTML='';
  [['str','STR'],['agi','AGI'],['vit','VIT'],['int','INT'],['dex','DEX'],['luk','LUK']].forEach(([k,lab])=>{
    const v=P.stats[k], c=statCost(v), bn=d.eff[k]-v, bonus=bn?` <small>+${bn}</small>`:'';
    const r=document.createElement('div'); r.className='statrow';
    r.innerHTML=`<b>${lab}</b><span class="v">${v}${bonus}</span><span class="c">ใช้ ${c} แต้ม</span><button aria-label="เพิ่ม ${lab}" ${P.points<c||v>=99?'disabled':''}>+</button>`;
    r.querySelector('button').onclick=()=>{ if(P.points>=c&&v<99){ P.points-=c; P.stats[k]++; persist(); refreshUI(); } };
    rows.appendChild(r);
  });
  $('statPts').textContent=P.points;
  $('derived').innerHTML=[['ATK',`${d.satk} + ${d.weapon.atk}${d.mastery?' + '+d.mastery:''}`],['MATK',`${d.matkMin}–${d.matkMax}`],['HIT',d.hit],['FLEE',`${d.flee} + ${d.pd}`],['CRIT',d.crit+'%'],['DEF',`${d.hardDef} + ${d.softDef}`],['ดีเลย์ตี',d.delay+'ms'],['MDEF',`${d.hardMdef} + ${d.softMdef}`],['ระยะตี',d.range+' ช่อง'],['อาชีพ',P.job]]
    .map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('');
  const Wp=d.weapon; $('equipText').innerHTML=`อาวุธ ${Wp.name} (ATK ${Wp.atk}, ${Wp.kind}${Wp.matk?`, MATK +${Wp.matk}%`:''})<br>ดูและเปลี่ยนอุปกรณ์ทั้งหมดได้ที่หน้าอุปกรณ์ (U)`;
  // skills
  if(!$('skillWin').classList.contains('hidden')) renderSkillWin();
  // inventory
  renderBag();
  if(!$('equipWin').classList.contains('hidden')) renderEquipWin();
  // hotbar
  document.querySelectorAll('[data-slot]').forEach(el=>{ const i=+el.dataset.slot, id=P.hotbar[i]; el.classList.add('item');
    if(!id||!ITEMS[id]){ el.classList.add('dim'); el.title='ช่องว่าง ตั้งได้จากกระเป๋า (I)'; el.innerHTML=`<span class="k">${i+1}</span>`; return; }
    const n=P.inv[id]||0; el.classList.toggle('dim',!n); el.title=`${ITEMS[id].name} — ${ITEMS[id].desc} (เหลือ ${n})`;
    el.innerHTML=`<span class="k">${i+1}</span><img alt="${ITEMS[id].name}" src="${ICONS[id]}"><span class="n">${n}</span><span class="nm">${ITEMS[id].name.replace(' Potion','').replace(' Wing','')}</span>`; });
  refreshSkillSlots(); refreshBotUI();
}
function refreshBotUI(){
  const B=P.bot;
  $('botToggle').textContent=B.on?'หยุดบอท':'เริ่มบอท'; $('botToggle').classList.toggle('on',B.on);
  $('tool-bot').classList.toggle('on',B.on); $('botBtn2').classList.toggle('on',B.on); $('botSt').textContent=B.on?'ON':'OFF'; $('bdgBot').classList.toggle('hidden',!B.on);
  $('botPill').classList.toggle('hidden',!B.on);
  $('bMode').value=B.mode; $('bSpMin').value=String(B.spMin); $('bStyle').value=B.style; $('bNoSp').value=B.noSp; $('bKite').value=B.kite?'1':'0';
  $('bSkillOpts').classList.toggle('hidden',B.style!=='skill'); $('bSpRow').classList.toggle('hidden',B.style!=='mixed'); $('bSkill').closest('label').classList.toggle('hidden',B.style==='melee'); $('bLoot').value=B.loot; $('bRoam').value=B.roam; $('bPotion').value=String(B.potion); $('bRest').value=String(B.rest); $('bWing').value=B.wing?'1':'0'; $('bRevive').value=B.revive?'1':'0'; $('bFlyIdle').value=String(B.flyIdle); $('bFlyHp').value=String(B.flyHp); $('bFlyN').textContent=P.inv.flywing||0;
  const tg=$('bTargets'); if(!tg.dataset.built){ tg.dataset.built='1'; Object.entries(MONSTERS).forEach(([k,m])=>{ const l=document.createElement('label'); l.innerHTML=`<span>ล่า ${m.name} (Lv ${m.lv})${m.boss?' · บอส':''}</span><input type="checkbox" data-mk="${k}">`; tg.appendChild(l); l.querySelector('input').onchange=e=>{ P.bot.targets[k]=e.target.checked; persist(); }; }); }
  tg.querySelectorAll('input').forEach(i=>i.checked=!!(B.targets[i.dataset.mk]??!MONSTERS[i.dataset.mk].boss));
  const sel=$('bSkill'); const learned=Object.keys(SKILLS).filter(id=>{ const s=SKILLS[id]; return s.type!=='passive'&&s.type!=='self'&&skLv(id)>0; });
  const sig=learned.join(','); if(sel.dataset.sig!==sig){ sel.dataset.sig=sig; sel.innerHTML='<option value="auto">เลือกอัตโนมัติ (ตามธาตุศัตรู)</option><option value="none">ไม่ใช้สกิล</option>'+learned.map(id=>`<option value="${id}">${SKILLS[id].name}</option>`).join(''); }
  sel.value=[...sel.options].some(o=>o.value===B.skill)?B.skill:'auto';
}
function toggleWin(id){ const w=$(id); w.classList.toggle('hidden'); if(id==='skillWin'&&!w.classList.contains('hidden')){ skStage=null; renderSkillWin(); } if(id==='mapWin'&&!w.classList.contains('hidden')) drawBigMap(); if(id==='equipWin'&&!w.classList.contains('hidden')) renderEquipWin(); if(id==='invWin'&&!w.classList.contains('hidden')) requestAnimationFrame(renderBag); }
function closeWin(id){ $(id).classList.add('hidden'); }
function openDialog(name,text,opts,closable=true){
  $('dlgName').firstChild.nodeValue=name+' '; $('dlgText').textContent=text; const o=$('dlgOpts'); o.innerHTML='';
  opts.forEach(([lab,fn],i)=>{ const b=document.createElement('button'); b.className=i?'btn ghost':'btn'; b.textContent=lab; b.onclick=fn; o.appendChild(b); });
  $('dialog').querySelector('[data-close]').classList.toggle('hidden',!closable);
  $('dialog').classList.remove('hidden');
}
function openNpc(){
  emote(npc,'!');
  const opts=[
    ['ฟื้นฟู HP/SP',()=>{ const d=derived(); P.hp=d.maxHP; P.sp=d.maxSP; sfx('heal'); floatText(hero.pos.x,hero.pos.y-68,'FULL','heal'); refreshUI(); closeWin('dialog'); }],
    ['ขายของดรอปทั้งหมด',()=>{ let sum=0,cnt=0; Object.keys(P.inv).forEach(id=>{ if(ITEMS[id].type==='etc'){ sum+=ITEMS[id].sell*P.inv[id]; cnt+=P.inv[id]; delete P.inv[id]; } });
      if(!cnt){ $('dlgText').textContent='ยังไม่มีของดรอปให้ขายเลย ลองไปล่า Jellop ดูสิ'; return; }
      P.sol+=sum; sfx('pickup'); logMsg(`ขายของ ${cnt} ชิ้น ได้ ${sum.toLocaleString()} Sol`,'drop'); persist(); refreshUI(); $('dlgText').textContent=`รับซื้อ ${cnt} ชิ้น เป็นเงิน ${sum.toLocaleString()} Sol ขอบคุณที่อุดหนุน`; }],
  ];
  opts.push(['บริการวาร์ป',()=>openWarp()]);
  opts.push(['คลังเก็บของ',()=>openStorage()]);
  opts.push(['ซื้อของ',()=>openShop()]);
  opts.push(['บันทึกจุดเกิดที่นี่',()=>{ P.save={map:P.map,x:npc.tx+1,y:npc.ty+1}; persist(); sfx('heal'); $('dlgText').textContent=`บันทึกจุดเกิดที่ ${MAP.name} แล้ว ถ้าหมดสติหรือใช้ Butterfly Wing จะกลับมาที่นี่`; }]);
  if(P.job==='Novice') opts.push(['เปลี่ยนอาชีพ',()=>{
    if(!canJobChange()){ $('dlgText').textContent=`ต้องมี Job Lv 10 และ Basic Skill Lv 9 ก่อน (ตอนนี้ Job Lv ${P.jlv}, Basic Skill Lv ${skLv('basic')})`; return; }
    openDialog('ผู้ดูแลการเดินทาง','เลือกเส้นทางของคุณ ในเกมจริงจะต้องผ่านเควสต์ของแต่ละสมาคมก่อน',[
      ['Swordman',()=>jobChange('Swordman')],['Archer',()=>jobChange('Archer')],['Mage',()=>jobChange('Mage')],['ยังไม่เปลี่ยน',()=>closeWin('dialog')] ]); }]);
  opts.push(['รีเซ็ตสเตตัส/สกิล',()=>openDialog('ผู้ดูแลการเดินทาง','บริการรีเซ็ตฟรีเฉพาะช่วงทดสอบต้นแบบ',[
    ['รีเซ็ตสเตตัส',()=>{ resetStats(); $('dlgText').textContent=`คืนแต้มสเตตัสแล้ว ตอนนี้มี ${P.points} แต้ม กด C เพื่อลงใหม่`; }],
    ['รีเซ็ตสกิลอาชีพปัจจุบัน',()=>{ const b=resetSkills(); $('dlgText').textContent=`คืนแต้มสกิล ${b} แต้ม กด K เพื่อลงใหม่`; }],
    ['ปิด',()=>closeWin('dialog')] ])]);
  opts.push(['ปิด',()=>closeWin('dialog')]);
  openDialog('ผู้ดูแลการเดินทาง','ยินดีต้อนรับสู่ทุ่ง Everhaven นักผจญภัย วันนี้ให้ช่วยอะไรดี',opts);
}

const SHOPS={ tool:{title:'ร้านของใช้',goods:[['redpot',10],['orangepot',10],['flywing',10],['bwing',1]]},
  weapon:{title:'ร้านอาวุธของ Brann',goods:[['shortsword',1],['shortbow',1],['woodstaff',1],['longsword',1],['compbow',1],['arcwand',1]]},
  armor:{title:'ร้านชุดเกราะของ Oda',goods:[['strawhat',1],['leatherjacket',1],['hood',1],['sandals',1],['guard',1],['boots',1],['buckler',1]]} };
Object.entries({shortsword:100,shortbow:400,woodstaff:300,longsword:5000,compbow:6000,arcwand:5500,leatherjacket:500,hood:300,sandals:400,guard:600,boots:3500,buckler:4000,strawhat:300}).forEach(([id,pr])=>ITEMS[id].price=pr);
function openShop(){ openShopKind('tool',openNpc); }
const WARP_FEE={ town:50, f01:80, f02:150 };
function openWarp(){
  const free=P.job==='Novice';
  const opts=Object.keys(WARP_FEE).filter(id=>id!==P.map).map(id=>{ const M=MAPS[id], fee=free?0:WARP_FEE[id];
    return [`${M.name} (${M.lv})${fee?` · ${fee} Sol`:' · ฟรี'}`,()=>{ if(P.sol<fee){ $('dlgText').textContent=`เงินไม่พอ ต้องใช้ ${fee} Sol`; return; }
      P.sol-=fee; closeWin('dialog'); logMsg(`วาร์ปไป ${M.name}${fee?` (-${fee} Sol)`:''}`,'sys'); changeMap(id,'keeper'); }]; });
  opts.push(['กลับ',()=>openNpc()]);
  openDialog('ผู้ดูแลการเดินทาง',`จะไปที่ไหนดี${free?' (Novice วาร์ปฟรี)':''}`,opts);
}
function openShopKind(kind,back){
  const sh=SHOPS[kind], goods=sh.goods;
  const opts=goods.map(([id,n])=>{ const it=ITEMS[id]; return [`${it.name}${n>1?` ×${n}`:''}${it.jobs?` · ${it.jobs.join('/')}`:''}${it.lv>1?` · Lv ${it.lv}`:''} (${(it.price*n).toLocaleString()} Sol)`,()=>{
    const cost=ITEMS[id].price*n; if(P.sol<cost){ $('dlgText').textContent=`เงินไม่พอ ต้องใช้ ${cost.toLocaleString()} Sol (มี ${P.sol.toLocaleString()} Sol) ลองขายของดรอปก่อน`; return; }
    P.sol-=cost; addInv(id,n); sfx('pickup'); logMsg(`ซื้อ ${ITEMS[id].name} ${n} ชิ้น (-${cost.toLocaleString()} Sol)`,'drop'); persist(); refreshUI();
    $('dlgText').textContent=`ซื้อ ${ITEMS[id].name} ${n} ชิ้นแล้ว เหลือเงิน ${P.sol.toLocaleString()} Sol${it.type==='equip'?' เปิดกระเป๋าเพื่อสวม':''}`; }]; });
  opts.push(back?['กลับ',back]:['ปิด',()=>closeWin('dialog')]);
  openDialog(sh.title,`เลือกซื้อได้เลย ตอนนี้มีเงิน ${P.sol.toLocaleString()} Sol`,opts);
}

