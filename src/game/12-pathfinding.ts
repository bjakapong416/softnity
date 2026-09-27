/* ---------- pathfinding (A* with binary heap) ---------- */
function hpush(h,f,i){ h.push([f,i]); let k=h.length-1; while(k>0){ const p=(k-1)>>1; if(h[p][0]<=h[k][0]) break; const tmp=h[p]; h[p]=h[k]; h[k]=tmp; k=p; } }
function hpop(h){ const top=h[0], last=h.pop(); if(h.length){ h[0]=last; let k=0; for(;;){ const l=2*k+1, r=l+1; let m=k; if(l<h.length&&h[l][0]<h[m][0]) m=l; if(r<h.length&&h[r][0]<h[m][0]) m=r; if(m===k) break; const tmp=h[m]; h[m]=h[k]; h[k]=tmp; k=m; } } return top; }
function findPath(sx,sy,gx,gy,range,maxIt){
  range=range||0; maxIt=maxIt||5000;
  if(!range && blocked(gx,gy)){ let best=null,bd=1e9; for(const [dx,dy] of DIRS8){ const x=gx+dx,y=gy+dy; if(!blocked(x,y)){ const d=Math.hypot(x-sx,y-sy); if(d<bd){bd=d;best=[x,y];} } } if(!best) return null; gx=best[0]; gy=best[1]; }
  const N=W*H, g=new Float32Array(N).fill(1e9), came=new Int32Array(N).fill(-1), closed=new Uint8Array(N), sk=sy*W+sx;
  const goal=(x,y)=> range ? Math.max(Math.abs(x-gx),Math.abs(y-gy))<=range : (x===gx&&y===gy);
  const heap=[]; g[sk]=0; hpush(heap,0,sk); let it=0;
  while(heap.length && it++<maxIt){
    const [,ck]=hpop(heap); if(closed[ck]) continue; closed[ck]=1;
    const cx=ck%W, cy=(ck/W)|0;
    if(goal(cx,cy)){ const p=[]; let k=ck; while(k!==sk){ p.push([k%W,(k/W)|0]); k=came[k]; } return p.reverse(); }
    for(const [dx,dy] of DIRS8){ const nx=cx+dx, ny=cy+dy; if(blocked(nx,ny)) continue; if(dx&&dy&&(blocked(cx+dx,cy)||blocked(cx,cy+dy))) continue;
      const nk=ny*W+nx; if(closed[nk]) continue; const ng=g[ck]+(dx&&dy?1.414:1);
      if(ng<g[nk]){ g[nk]=ng; came[nk]=ck; const hx=Math.abs(nx-gx),hy=Math.abs(ny-gy); hpush(heap,ng+Math.max(hx,hy)+.414*Math.min(hx,hy),nk); } }
  }
  return null;
}
/* physical key codes, so hotkeys work with any keyboard layout (e.g. Thai Kedmanee) */
const CODE_KEY={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',ArrowUp:'arrowup',ArrowDown:'arrowdown',ArrowLeft:'arrowleft',ArrowRight:'arrowright',Space:' ',
  KeyQ:'q',KeyE:'e',KeyR:'r',KeyF:'f',KeyC:'c',KeyI:'i',KeyK:'k',KeyB:'b',KeyG:'g',KeyM:'m',KeyZ:'z',KeyU:'u',Insert:'insert',
  Digit1:'1',Digit2:'2',Digit3:'3',Digit4:'4',Numpad1:'1',Numpad2:'2',Numpad3:'3',Numpad4:'4',Escape:'escape',Enter:'enter',NumpadEnter:'enter'};
const keyOf=e=>CODE_KEY[e.code]||(e.key||'').toLowerCase();
/* held-direction input: WASD / arrows / virtual joystick */
const keys={}; const joy={dx:0,dy:0};
const MOVE_KEYS={w:[0,-1],a:[-1,0],s:[0,1],d:[1,0],arrowup:[0,-1],arrowleft:[-1,0],arrowdown:[0,1],arrowright:[1,0]};
function heldDir(){ let dx=0,dy=0; for(const k in MOVE_KEYS){ if(keys[k]){ dx+=MOVE_KEYS[k][0]; dy+=MOVE_KEYS[k][1]; } }
  dx=Math.sign(dx); dy=Math.sign(dy); if(!dx&&!dy){ dx=joy.dx; dy=joy.dy; } return [dx,dy]; }
function nextHeldTile(){
  if(hero.dead||!started||hero.cast) return null; const [dx,dy]=heldDir(); if(!dx&&!dy) return null;
  const tries=(dx&&dy)?[[dx,dy],[dx,0],[0,dy]]:[[dx,dy]];
  for(const [a,b] of tries){ const nx=hero.tx+a, ny=hero.ty+b; if(blocked(nx,ny)) continue;
    if(a&&b&&(blocked(hero.tx+a,hero.ty)||blocked(hero.tx,hero.ty+b))) continue; return [nx,ny]; }
  hero.facing={dx,dy}; return null;
}
function manualMove(){ pauseBot(); target=null; pending=null; pendingSkill=null; cancelCast(); standUp(); if(hero.moving) hero.path=[]; }
function walk(e,path,onDone){ e.path=path||[]; e.onDone=onDone||null; if(!e.moving) step(e); }
function step(e){
  if(e.dead) { e.moving=false; return; }
  if(!e.path.length && e.feed){ const n=e.feed(); if(n) e.path.push(n); }
  if(!e.path.length){ e.moving=false; const cb=e.onDone; e.onDone=null; if(cb) cb(); return; }
  const [nx,ny]=e.path.shift(); const dx=nx-e.tx, dy=ny-e.ty;
  e.facing={dx:Math.sign(dx),dy:Math.sign(dy)}; e.tx=nx; e.ty=ny; e.moving=true;
  S.tweens.add({targets:e.pos,x:nx*T+16,y:ny*T+27,duration:e.speed*(dx&&dy?1.41:1),onComplete:()=>step(e)});
}
const cheb=(a,b)=>Math.max(Math.abs(a.tx-b.tx),Math.abs(a.ty-b.ty));
/* ranged attacks and spells only fire at targets the player can actually see */
function viewHalf(){ const v=S.cameras.main.worldView; return [Math.max(2,Math.floor(v.width/2/T)-1), Math.max(2,Math.floor(v.height/2/T)-1)]; }
function inView(m){ const v=S.cameras.main.worldView, pad=20; return m.pos.x>v.x+pad && m.pos.x<v.right-pad && m.pos.y-20>v.y+pad && m.pos.y<v.bottom-pad; }
function canHit(m,rng){ return cheb(hero,m)<=rng && (rng<=1 || inView(m)); }
function chaseRange(m,rng){ if(rng<=1) return rng; const [hx,hy]=viewHalf(); let r=Math.max(1,Math.min(rng,hx,hy)); if(cheb(hero,m)<=r && !inView(m)) r=Math.max(1,cheb(hero,m)-2); return r; }
const dist=(a,b)=>Math.hypot(a.tx-b.tx,a.ty-b.ty);

