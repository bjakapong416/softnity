/* ---------- painted, smooth ground (replaces pixel tiles in HD mode) ---------- */
function paintGround(HV){
  const cw=W*T, ch=H*T, cv=document.createElement('canvas'); cv.width=cw; cv.height=ch; const c=cv.getContext('2d');
  const PAL=HV?{ g:[214,184,98], gd:'rgba(150,115,40,.55)', gl:'rgba(250,230,150,.55)', path:[184,144,94], sand:[214,190,130] }
             :{ g:[121,192,90], gd:'rgba(60,120,45,.55)', gl:'rgba(185,235,130,.5)', path:[217,187,132], sand:[226,206,150] };
  const col={ path:PAL.path, cobble:[179,172,160], plaza:[226,214,186], bridge:[168,116,63], sbridge:[169,162,150], water:PAL.sand };
  // 1) one pixel per tile, then smooth upscale -> soft blended borders
  const lo=document.createElement('canvas'); lo.width=W; lo.height=H; const lx=lo.getContext('2d'), id=lx.createImageData(W,H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ const t=grid[y][x].t, k=(y*W+x)*4; let v=(t==='grass'||t==='bld')?PAL.g:(col[t]||PAL.g); const j=(t==='grass'||t==='bld')?(fbmN(x*.35,y*.35)-.5)*28:0;
    id.data[k]=v[0]+j; id.data[k+1]=v[1]+j; id.data[k+2]=v[2]+j*.6; id.data[k+3]=255; }
  lx.putImageData(id,0,0); c.imageSmoothingEnabled=true; c.imageSmoothingQuality='high'; c.drawImage(lo,0,0,cw,ch);
  // 2) broad light/dark patches
  const nz=document.createElement('canvas'); nz.width=Math.ceil(W/2); nz.height=Math.ceil(H/2); const nx=nz.getContext('2d'), nd=nx.createImageData(nz.width,nz.height);
  for(let i=0;i<nz.width*nz.height;i++){ const v=Math.random()*255; nd.data[i*4]=nd.data[i*4+1]=nd.data[i*4+2]=v; nd.data[i*4+3]=255; } nx.putImageData(nd,0,0);
  c.globalAlpha=.22; c.globalCompositeOperation='soft-light'; c.drawImage(nz,0,0,cw,ch); c.globalCompositeOperation='source-over'; c.globalAlpha=1;
  const tAt=(px_,py_)=>{ const tx=Math.floor(px_/T), ty=Math.floor(py_/T); return (grid[ty]&&grid[ty][tx])?grid[ty][tx].t:''; };
  // 3) brush strokes of grass
  c.lineCap='round'; c.lineWidth=1.4;
  for(let i=0;i<W*H*9;i++){ const x=Math.random()*cw, y=Math.random()*ch, t=tAt(x,y); if(t!=='grass'&&t!=='bld') continue; const l=rnd(4,9), a=rnd(-.5,.5);
    c.strokeStyle=Math.random()<.55?PAL.gd:PAL.gl; c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+Math.sin(a)*l*.5+1,y-l*.6,x+Math.sin(a)*l,y-l); c.stroke(); }
  // 4) pebbles on dirt paths
  for(let i=0;i<W*H*2;i++){ const x=Math.random()*cw, y=Math.random()*ch; if(tAt(x,y)!=='path') continue; c.fillStyle=Math.random()<.5?'rgba(120,90,55,.35)':'rgba(255,245,220,.45)'; c.beginPath(); c.ellipse(x,y,rnd(1,2.6),rnd(.8,1.8),rnd(0,3),0,6.3); c.fill(); }
  // 5) paved stones, bridges
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ const t=grid[y][x].t, X=x*T, Y=y*T;
    if(t==='cobble'){ for(let r=0;r<3;r++){ const off=(r%2)*6; for(let q=-1;q<3;q++){ const sx=X+off+q*12, sy=Y+r*10.7; const v=rnd(-14,14); c.fillStyle=`rgb(${176+v},${169+v},${156+v})`; c.beginPath(); c.roundRect(sx+1,sy+1,10.5,9,3.5); c.fill(); c.strokeStyle='rgba(90,84,76,.45)'; c.lineWidth=1; c.stroke(); } } }
    else if(t==='plaza'){ for(let q=0;q<4;q++){ const v=rnd(-10,10); c.fillStyle=`rgb(${228+v},${216+v},${190+v})`; c.beginPath(); c.roundRect(X+(q%2)*16+1,Y+(q>>1)*16+1,14,14,3); c.fill(); c.strokeStyle='rgba(170,150,120,.5)'; c.stroke(); } }
    else if(t==='bridge'){ for(let q=0;q<4;q++){ const v=rnd(-12,12); c.fillStyle=`rgb(${160+v},${108+v},${60+v})`; c.fillRect(X+q*8+.5,Y,7,T); c.fillStyle='rgba(255,220,170,.25)'; c.fillRect(X+q*8+.5,Y,7,2); } }
    else if(t==='sbridge'){ for(let r=0;r<2;r++) for(let q=0;q<2;q++){ const v=rnd(-12,12); c.fillStyle=`rgb(${168+v},${161+v},${150+v})`; c.beginPath(); c.roundRect(X+q*16+(r?8:0)-(r&&q?16:0)+1,Y+r*16+1,14,14,3); c.fill(); c.strokeStyle='rgba(100,95,88,.5)'; c.stroke(); } } }
  // 5b) grand plaza: concentric rings of stones around the fountain (capital)
  if(MAP.town){ const cx0=40.5*T, cy0=43*T; c.save(); c.beginPath(); for(let y=0;y<H;y++)for(let x=0;x<W;x++) if(grid[y][x].t==='plaza') c.rect(x*T,y*T,T,T); c.clip();
    c.fillStyle='#b3a386'; c.fillRect(0,0,cw,ch); c.lineCap='butt';
    for(let r=12,ring=0;r<30*T;r+=12.5,ring++){ const n=Math.max(8,Math.round(2*Math.PI*r/18)), da=2*Math.PI/n, off=(ring%2)*da/2;
      for(let i=0;i<n;i++){ const a0=off+i*da, v=rnd(-11,11); c.strokeStyle=`rgb(${228+v},${216+v},${192+v})`; c.lineWidth=10.2; c.beginPath(); c.arc(cx0,cy0,r,a0+.03,a0+da-.03); c.stroke();
        c.strokeStyle='rgba(255,255,255,.28)'; c.lineWidth=2; c.beginPath(); c.arc(cx0,cy0,r-3.5,a0+.06,a0+da-.06); c.stroke(); } }
    c.restore(); }
  // 6) water: soft rounded shoreline, lighter shallows, foam
  const water=[]; for(let y=0;y<H;y++)for(let x=0;x<W;x++) if(grid[y][x].t==='water') water.push([x,y]);
  const deep=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>grid[y+b]&&grid[y+b][x+a]&&(grid[y+b][x+a].t==='water'||grid[y+b][x+a].t==='bridge'||grid[y+b][x+a].t==='sbridge'));
  // soft layered water: blurred masks give smooth shorelines instead of scalloped circles
  const layer=(r,col,blur,onlyDeep)=>{ const m=document.createElement('canvas'); m.width=cw; m.height=ch; const mx=m.getContext('2d'); mx.fillStyle='#fff';
    water.forEach(([x,y])=>{ if(onlyDeep&&!deep(x,y)) return; mx.beginPath(); mx.arc(x*T+16,y*T+16,T*r,0,6.3); mx.fill(); });
    mx.globalCompositeOperation='source-in'; mx.fillStyle=col; mx.fillRect(0,0,cw,ch); c.save(); c.filter=`blur(${blur}px)`; c.drawImage(m,0,0); c.restore(); };
  if(water.length){ layer(1.0,HV?'#cdb77e':'#d8c392',7); layer(.8,'rgba(255,255,255,.75)',4); layer(.72,'#62c0e8',3); layer(.62,'#3f9fd6',9,true); layer(.4,'#2f8cc4',12,true);
    c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=1.3; c.lineCap='round'; for(let i=0;i<water.length*1.5;i++){ const [x,y]=water[irnd(0,water.length-1)]; if(!deep(x,y)) continue; const sx=x*T+rnd(0,20), sy=y*T+rnd(4,28); c.beginPath(); c.moveTo(sx,sy); c.quadraticCurveTo(sx+6,sy-2,sx+12,sy); c.stroke(); } }
  // repaint bridges over the water
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ if(grid[y][x].t!=='sbridge') continue; const X=x*T, Y=y*T; c.save(); c.beginPath(); c.rect(X,Y,T,T); c.clip(); c.fillStyle='#8f887c'; c.fillRect(X,Y,T,T);
    for(let r=0;r<2;r++) for(let q=-1;q<3;q++){ const v=rnd(-12,12); c.fillStyle=`rgb(${172+v},${165+v},${152+v})`; c.beginPath(); c.roundRect(X+q*16+(r?8:0)+1,Y+r*16+1,14,14,3.5); c.fill(); c.fillStyle='rgba(255,255,255,.18)'; c.fillRect(X+q*16+(r?8:0)+3,Y+r*16+2,10,2); } c.restore();
    c.fillStyle='rgba(40,36,30,.45)'; if(!grid[y-1]||grid[y-1][x].t!=='sbridge') c.fillRect(X,Y-2,T,3); if(!grid[y+1]||grid[y+1][x].t!=='sbridge') c.fillRect(X,Y+T-1,T,3); }
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ const t=grid[y][x].t, X=x*T, Y=y*T; if(t!=='bridge') continue; for(let q=0;q<4;q++){ const v=rnd(-12,12); c.fillStyle=`rgb(${160+v},${108+v},${60+v})`; c.fillRect(X+q*8+.5,Y-1,7,T+2); } c.fillStyle='rgba(60,35,15,.55)'; if(!grid[y-1]||grid[y-1][x].t!=='bridge') c.fillRect(X,Y-2,T,3); if(!grid[y+1]||grid[y+1][x].t!=='bridge') c.fillRect(X,Y+T-1,T,3); }
  return cv;
}
function fbmN(x,y){ const h=(a,b)=>{ const s=Math.sin(a*127.1+b*311.7)*43758.5453; return s-Math.floor(s); }; const n=(x,y)=>{ const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=h(xi,yi),b=h(xi+1,yi),c=h(xi,yi+1),d=h(xi+1,yi+1); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; };
  return n(x,y)*.6+n(x*2.1,y*2.1)*.3+n(x*4.3,y*4.3)*.1; }

