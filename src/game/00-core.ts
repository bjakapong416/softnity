
"use strict";
/* ============================================================
   Softnity – phase 1 prototype (v2: skills, job change, bot)
   Formulas follow the Softnity GDD (sections 3–6, 8).
   ============================================================ */
const T = 32; let W = 60, H = 60;
const DPR = Math.min(2, window.devicePixelRatio||1); // render at device pixels, capped for performance
const TXT_RES = Math.max(3, Math.ceil(2*DPR));
const DIRS8 = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const rnd = (a,b)=>a+Math.random()*(b-a);
const irnd = (a,b)=>Math.floor(rnd(a,b+1));
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let srng = mulberry32(20260926);
const sr = (a,b)=>a+Math.floor(srng()*(b-a+1));

