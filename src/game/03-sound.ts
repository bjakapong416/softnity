/* ---------- sound ---------- */
const AC = { ctx:null };
function sfx(name){
  if(!P.sound || !AC.ctx) return;
  const c=AC.ctx, t=c.currentTime;
  const tone=(f1,f2,dur,type='square',vol=.05,delay=0)=>{
    const o=c.createOscillator(), g=c.createGain(); o.type=type;
    o.frequency.setValueAtTime(f1,t+delay); o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+delay+dur);
    g.gain.setValueAtTime(vol,t+delay); g.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);
    o.connect(g).connect(c.destination); o.start(t+delay); o.stop(t+delay+dur+.02);
  };
  switch(name){
    case 'hit': tone(240,90,.08,'square',.045); break;
    case 'crit': tone(620,130,.16,'sawtooth',.05); tone(900,300,.1,'square',.03,.03); break;
    case 'miss': tone(700,980,.06,'triangle',.03); break;
    case 'hurt': tone(170,70,.12,'square',.05); break;
    case 'pickup': tone(880,1320,.08,'triangle',.05); break;
    case 'level': [523,659,784,1047,1319].forEach((f,i)=>tone(f,f*1.01,.2,'triangle',.06,i*.08)); break;
    case 'job': [392,523,659,784].forEach((f,i)=>tone(f,f,.16,'square',.035,i*.07)); break;
    case 'die': tone(330,55,.4,'sawtooth',.05); break;
    case 'pop': tone(420,820,.07,'sine',.05); break;
    case 'heal': tone(660,990,.15,'sine',.05); break;
    case 'warp': tone(300,1500,.35,'sine',.05); break;
    case 'cast': tone(500,900,.25,'sine',.03); break;
    case 'bash': tone(160,60,.18,'sawtooth',.07); tone(1200,300,.08,'square',.03); break;
    case 'boom': tone(120,40,.35,'sawtooth',.08); tone(300,80,.25,'square',.04,.02); break;
    case 'arrow': tone(1400,500,.07,'triangle',.035); break;
    case 'fire': tone(260,120,.18,'sawtooth',.04); break;
    case 'ice': tone(1800,900,.12,'triangle',.04); break;
    case 'zap': tone(900,120,.12,'square',.05); break;
    case 'bell': [0,.9].forEach(d=>{ tone(784,780,1.4,'sine',.06,d); tone(1568,1560,.9,'sine',.025,d); }); break;
    case 'jobchange': [262,330,392,523,659,784,1047].forEach((f,i)=>tone(f,f,.22,'triangle',.06,i*.09)); break;
  }
}

