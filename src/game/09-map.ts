/* ============================================================
   Map
   ============================================================ */
const grid = []; // {t:'grass'|'path'|'water'|'bridge', b:bool}
const blocked=(x,y)=> x<0||y<0||x>=W||y>=H||grid[y][x].b;
const pathRow=[];
function buildGrid(M){
  srng=mulberry32(M.seed);
  for(let y=0;y<H;y++){ grid[y]=[]; for(let x=0;x<W;x++) grid[y][x]={t:'grass',b:false,v:sr(0,2)}; }
  let py=30; for(let x=0;x<W;x++){ pathRow[x]=py; grid[py][x].t='path'; grid[py+1][x].t='path'; if(x>3&&x<W-4&&srng()<.16) py=clamp(py+(srng()<.5?-1:1),26,33); }
  const bt=M.stoneBridge?'sbridge':'bridge', R_=M.river, half=Math.floor(R_.w/2); let cx=R_.cx;
  for(let y=0;y<H;y++){ for(let d=-half;d<=R_.w-1-half;d++){ const g=grid[y][cx+d]; if(g.t==='path'){ g.t=bt; } else { g.t='water'; g.b=true; } } if(srng()<.22) cx=clamp(cx+(srng()<.5?-1:1),R_.min,R_.max); }
  if(M.stoneBridge){ // widen the landmark bridge to 4 rows
    for(let x=0;x<W;x++){ if(grid[pathRow[x]][x].t!=='sbridge') continue; [pathRow[x]-1,pathRow[x]+2].forEach(y=>{ const g=grid[y][x]; if(g.t==='water'){ g.t='sbridge'; g.b=false; } }); }
  }
  (M.ponds||[]).forEach(([px_,py_,rx,ry])=>{ for(let y=-ry;y<=ry;y++)for(let x=-rx;x<=rx;x++){ if((x*x)/(rx*rx)+(y*y)/(ry*ry)<=1){ const g=grid[py_+y]&&grid[py_+y][px_+x]; if(g&&g.t==='grass'){ g.t='water'; g.b=true; } } } });
}
function nearPath(x,y,d){ for(let k=-d;k<=d;k++){ const X=x+k; if(X<0||X>=W) continue; if(Math.abs(pathRow[X]-y)<=d||Math.abs(pathRow[X]+1-y)<=d) return true; } return false; }
function free(x,y){ return x>=0&&y>=0&&x<W&&y<H && grid[y][x].t==='grass' && !grid[y][x].b; }


