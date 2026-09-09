const STYLE_ID = "dpl-ballistics-original-style";

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `*{box-sizing:border-box}
.ballistics-module{margin:0;min-height:100%;font-family:Arial,sans-serif;background:#f4f6fb;color:#202536}
.ballistics-module{overflow-x:hidden}
.ballistics-module .page{width:100%;min-height:0;padding:clamp(12px,2vw,24px)}
.ballistics-module h1{margin:0 0 16px;font-size:clamp(22px,3vw,30px)}
.ballistics-module .lab-layout{display:grid;grid-template-columns:330px minmax(0,1fr);gap:18px;width:100%;min-width:0}
.ballistics-module .panel,.ballistics-module .ballistics-module .graph-card{background:#fff;border:1px solid #e3e7f0;border-radius:18px;box-shadow:0 8px 25px rgba(30,40,70,.07)}
.ballistics-module .panel{padding:20px}
.ballistics-module .panel h2{margin:0 0 18px;font-size:19px}
.ballistics-module .control{margin-bottom:18px}
.ballistics-module .control-head{display:flex;justify-content:space-between;gap:10px;margin-bottom:7px;font-size:14px;font-weight:600}
.ballistics-module .value{color:#5964df}
.ballistics-module input[type=range]{display:block;width:100%;height:24px;accent-color:#5964df}
.ballistics-module input[type=number]{display:block;width:100%;padding:10px;border:1px solid #d7dce8;border-radius:9px;font-size:15px;background:#fff;color:#202536}
.ballistics-module .buttons{display:grid;gap:9px;margin-top:22px}
.ballistics-module button{width:100%;border:0;border-radius:10px;padding:12px 14px;font-size:14px;font-weight:600;cursor:pointer;background:#5964df;color:#fff}
.ballistics-module button.secondary{background:#eef0ff;color:#4d56c8}
.ballistics-module .status{margin-top:9px;font-size:13px;color:#697086}
.ballistics-module .graph-card{padding:14px;display:flex;flex-direction:column;min-width:0;overflow:hidden}
.ballistics-module .canvas-wrap{position:relative;width:100%;height:clamp(420px,70vh,720px);min-height:420px;border-radius:13px;background:#fbfcff;overflow:hidden}
.ballistics-module canvas{display:block;width:100%;height:100%}
.ballistics-module .formulas{margin-top:12px;padding:14px 16px;border-radius:12px;background:#f7f8fc;border:1px solid #e7e9f1;line-height:1.7;font-size:14px;overflow-x:auto}
.ballistics-module .formulas b{font-size:15px}
@media(max-width:900px){
.ballistics-module .lab-layout{grid-template-columns:1fr}
.ballistics-module .panel{order:1}
.ballistics-module .graph-card{order:2}
.ballistics-module .canvas-wrap{height:min(68vh,600px);min-height:420px}
}
@media(max-width:600px){
.ballistics-module .page{padding:10px}
.ballistics-module h1{margin-bottom:10px}
.ballistics-module .lab-layout{gap:10px}
.ballistics-module .panel{padding:15px;border-radius:14px}
.ballistics-module .graph-card{padding:8px;border-radius:14px}
.ballistics-module .panel h2{font-size:17px;margin-bottom:14px}
.ballistics-module .control{margin-bottom:14px}
.ballistics-module .canvas-wrap{height:62vh;min-height:380px;border-radius:10px}
.ballistics-module .formulas{font-size:12px;padding:11px}
}`;
  document.head.appendChild(style);
}

export function mountExperiment(root) {
  ensureStyles();
  root.innerHTML = `<div class="ballistics-module"><div class="page">
<h1>Physics Lab — Движение тела</h1>
<div class="lab-layout">
<aside class="panel">
<h2>Параметры</h2>

<div class="control">
<div class="control-head"><span>x₀, м</span></div>
<input id="x0" type="number" value="0" step="0.1">
</div>

<div class="control">
<div class="control-head"><span>y₀, м</span></div>
<input id="y0" type="number" value="0" step="0.1">
</div>

<div class="control">
<div class="control-head"><span>v₀, м/с</span><span class="value" id="v0Val">10</span></div>
<input id="v0" type="range" min="0" max="30" step="0.1" value="10">
</div>

<div class="control">
<div class="control-head"><span>α — угол v₀</span><span class="value" id="alphaVal">45°</span></div>
<input id="alpha" type="range" min="0" max="360" step="1" value="45">
</div>

<div class="control">
<div class="control-head"><span>g, м/с²</span><span class="value" id="gVal">9.8</span></div>
<input id="g" type="range" min="0" max="20" step="0.1" value="9.8">
</div>

<div class="control">
<div class="control-head"><span>β — направление g</span><span class="value" id="betaVal">270°</span></div>
<input id="beta" type="range" min="0" max="360" step="1" value="270">
</div>

<div class="buttons">
<button id="startBtn">▶ Запустить</button>
<button id="motionResetBtn" class="secondary">Сброс движения</button>
<button id="settingsResetBtn" class="secondary">Сброс настроек</button>
</div>

<div class="status" id="status">t = 0.00 с</div>
</aside>

<main class="graph-card">
<div class="canvas-wrap" id="canvasWrap">
<canvas id="canvas"></canvas>
</div>

<div class="formulas">
<b>Уравнения движения</b><br>
a⃗ = g⃗<br>
v⃗(t) = v⃗₀ + g⃗t<br>
r⃗(t) = r⃗₀ + v⃗₀t + ½g⃗t²<br>
vₓ = v₀ cos α + g cos β · t<br>
vᵧ = v₀ sin α + g sin β · t<br>
x = x₀ + v₀ cos α · t + ½g cos β · t²<br>
y = y₀ + v₀ sin α · t + ½g sin β · t²
</div>
</main>
</div>
</div></div>`;

"use strict";
const byId = id => root.querySelector("#" + id);

const canvas=byId("canvas");
const ctx=canvas.getContext("2d");
const wrap=byId("canvasWrap");

const E={
x0:byId("x0"),
y0:byId("y0"),
v0:byId("v0"),
alpha:byId("alpha"),
g:byId("g"),
beta:byId("beta"),
v0Val:byId("v0Val"),
alphaVal:byId("alphaVal"),
gVal:byId("gVal"),
betaVal:byId("betaVal"),
status:byId("status"),
start:byId("startBtn")
};

let time=0;
let running=false;
let lastFrame=0;
let trajectory=[];
let groundTime=0;
let view=null;
let rafId=0;
let disposed=false;

function getParams(){
return{
x0:Number(E.x0.value)||0,
y0:Number(E.y0.value)||0,
v0:Number(E.v0.value)||0,
alpha:Number(E.alpha.value)*Math.PI/180,
g:Number(E.g.value)||0,
beta:Number(E.beta.value)*Math.PI/180
};
}

function position(t){
const p=getParams();
return{
x:p.x0+p.v0*Math.cos(p.alpha)*t+0.5*p.g*Math.cos(p.beta)*t*t,
y:p.y0+p.v0*Math.sin(p.alpha)*t+0.5*p.g*Math.sin(p.beta)*t*t
};
}

function velocity(t){
const p=getParams();
return{
x:p.v0*Math.cos(p.alpha)+p.g*Math.cos(p.beta)*t,
y:p.v0*Math.sin(p.alpha)+p.g*Math.sin(p.beta)*t
};
}

function timeToGround(){
const p=getParams();
const A=.5*p.g*Math.sin(p.beta);
const B=p.v0*Math.sin(p.alpha);
const C=p.y0;

if(Math.abs(A)<1e-10){
if(Math.abs(B)<1e-10)return Infinity;
const t=-C/B;
return t>1e-6?t:Infinity;
}

const D=B*B-4*A*C;
if(D<0)return Infinity;

const s=Math.sqrt(D);
const r1=(-B-s)/(2*A);
const r2=(-B+s)/(2*A);
const roots=[r1,r2].filter(x=>x>1e-6).sort((a,b)=>a-b);
return roots.length?roots[0]:Infinity;
}

function niceStep(raw){
if(!Number.isFinite(raw)||raw<=0)return 1;
const power=Math.pow(10,Math.floor(Math.log10(raw)));
const n=raw/power;
return(n<=1?1:n<=2?2:n<=5?5:10)*power;
}

function calculateTrajectory(){
groundTime=timeToGround();
const end=Math.min(groundTime===Infinity?8:groundTime,30);
const n=360;
trajectory=[];
for(let i=0;i<=n;i++)trajectory.push(position(end*i/n));
updateView();
}

function updateView(){
const w=Math.max(1,wrap.clientWidth);
const h=Math.max(1,wrap.clientHeight);
const p=getParams();
const pts=trajectory.length?trajectory:[position(0)];

let minX=Math.min(...pts.map(q=>q.x),p.x0);
let maxX=Math.max(...pts.map(q=>q.x),p.x0);
let minY=Math.min(...pts.map(q=>q.y),p.y0,0);
let maxY=Math.max(...pts.map(q=>q.y),p.y0,0);

const dx=Math.max(maxX-minX,1);
const dy=Math.max(maxY-minY,1);

minX-=Math.max(dx*.08,1.2);
maxX+=Math.max(dx*.08,1.2);
maxY+=Math.max(dy*.12,1.5);
minY=Math.min(minY,-Math.max(Math.min(dy*.1,2.5),1.2));

const aspect=w/h;
let rx=maxX-minX;
let ry=maxY-minY;

if(rx/ry<aspect)maxX=minX+ry*aspect;
else minY=maxY-rx/aspect;

view={minX,maxX,minY,maxY,w,h};
}

function sx(x){
return(x-view.minX)/(view.maxX-view.minX)*view.w;
}

function sy(y){
return view.h-(y-view.minY)/(view.maxY-view.minY)*view.h;
}

function fmt(v){
if(Math.abs(v)<1e-9)return"0";
if(Math.abs(v)>=100)return v.toFixed(0);
if(Math.abs(v)>=10)return v.toFixed(1).replace(".0","");
return v.toFixed(2).replace(/0+$/,"").replace(/\.$/,"");
}

function drawGrid(){
const xStep=niceStep((view.maxX-view.minX)/9);
const yStep=niceStep((view.maxY-view.minY)/8);

ctx.save();
ctx.lineWidth=1;
ctx.strokeStyle="#e9ecf3";
ctx.fillStyle="#73798b";
ctx.font="12px Arial";

for(let x=Math.ceil(view.minX/xStep)*xStep;x<=view.maxX+1e-9;x+=xStep){
const X=sx(x);
ctx.beginPath();ctx.moveTo(X,0);ctx.lineTo(X,view.h);ctx.stroke();
if(Math.abs(x)>1e-9){
ctx.textAlign="center";ctx.textBaseline="top";
const y0=sy(0);
ctx.fillText(fmt(x),X,Math.max(2,Math.min(view.h-15,y0+7)));
}
}

for(let y=Math.ceil(view.minY/yStep)*yStep;y<=view.maxY+1e-9;y+=yStep){
const Y=sy(y);
ctx.beginPath();ctx.moveTo(0,Y);ctx.lineTo(view.w,Y);ctx.stroke();
if(Math.abs(y)>1e-9){
ctx.textAlign="right";ctx.textBaseline="middle";
const x0=sx(0);
ctx.fillText(fmt(y),Math.max(28,x0-8),Y);
}
}

ctx.strokeStyle="#555b6e";
ctx.lineWidth=1.5;

if(view.minY<=0&&view.maxY>=0){
const Y=sy(0);
ctx.beginPath();ctx.moveTo(0,Y);ctx.lineTo(view.w,Y);ctx.stroke();
}

if(view.minX<=0&&view.maxX>=0){
const X=sx(0);
ctx.beginPath();ctx.moveTo(X,0);ctx.lineTo(X,view.h);ctx.stroke();
}

ctx.fillStyle="#4d5364";
ctx.font="bold 13px Arial";
ctx.textAlign="right";
ctx.textBaseline="bottom";
ctx.fillText("x, м",view.w-12,Math.max(14,sy(0)-8));

ctx.textAlign="left";
ctx.textBaseline="top";
ctx.fillText("y, м",Math.max(8,sx(0)+8),8);
ctx.restore();
}

function drawArrow(x1,y1,x2,y2,head=9){
const angle=Math.atan2(y2-y1,x2-x1);
ctx.beginPath();
ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
ctx.beginPath();
ctx.moveTo(x2,y2);
ctx.lineTo(x2-head*Math.cos(angle-.45),y2-head*Math.sin(angle-.45));
ctx.lineTo(x2-head*Math.cos(angle+.45),y2-head*Math.sin(angle+.45));
ctx.closePath();ctx.fill();
}

function drawTrajectory(){
if(trajectory.length<2)return;
ctx.save();
ctx.beginPath();
ctx.moveTo(sx(trajectory[0].x),sy(trajectory[0].y));
for(let i=1;i<trajectory.length;i++){
ctx.lineTo(sx(trajectory[i].x),sy(trajectory[i].y));
}
ctx.strokeStyle="#5964df";
ctx.lineWidth=3;
ctx.lineCap="round";
ctx.lineJoin="round";
ctx.stroke();
ctx.restore();
}

function drawVectors(){
const p=getParams();
const q=position(0);
const X=sx(q.x);
const Y=sy(q.y);
const L=Math.max(40,Math.min(80,wrap.clientWidth*.08));

ctx.save();
ctx.strokeStyle="#e08a3e";
ctx.fillStyle="#e08a3e";
ctx.lineWidth=2.5;
drawArrow(X,Y,X+L*Math.cos(p.alpha),Y-L*Math.sin(p.alpha));
ctx.font="bold 13px Arial";
ctx.fillText("v₀",X+L*Math.cos(p.alpha)+7,Y-L*Math.sin(p.alpha)-7);
ctx.restore();

ctx.save();
ctx.strokeStyle="#4e9b70";
ctx.fillStyle="#4e9b70";
ctx.lineWidth=2.5;
const gx=X+30,gy=Y+30;
drawArrow(gx,gy,gx+50*Math.cos(p.beta),gy-50*Math.sin(p.beta));
ctx.font="bold 13px Arial";
ctx.fillText("g⃗",gx+50*Math.cos(p.beta)+7,gy-50*Math.sin(p.beta)-7);
ctx.restore();
}

function drawBodyAndVelocity(){
const end=groundTime===Infinity?8:groundTime;
const ct=Math.min(time,end);
const q=position(ct);
const X=sx(q.x);
const Y=sy(q.y);

ctx.save();
ctx.beginPath();
ctx.arc(X,Y,8,0,Math.PI*2);
ctx.fillStyle="#5964df";
ctx.fill();
ctx.lineWidth=3;
ctx.strokeStyle="#fff";
ctx.stroke();
ctx.restore();

const v=velocity(ct);
const mag=Math.hypot(v.x,v.y);
if(mag>1e-8){
ctx.save();
ctx.strokeStyle="#b35c9e";
ctx.fillStyle="#b35c9e";
ctx.lineWidth=2;
drawArrow(X,Y,X+48*v.x/mag,Y-48*v.y/mag,8);
ctx.font="bold 12px Arial";
ctx.fillText("v",X+48*v.x/mag+6,Y-48*v.y/mag-6);
ctx.restore();
}
}

function drawStart(){
const p=getParams();
const X=sx(p.x0),Y=sy(p.y0);
ctx.save();
ctx.beginPath();ctx.arc(X,Y,4,0,Math.PI*2);
ctx.fillStyle="#303544";ctx.fill();
ctx.font="12px Arial";ctx.fillStyle="#50576a";
ctx.fillText("r₀",X+8,Y-8);
ctx.restore();
}

function draw(){
const w=wrap.clientWidth,h=wrap.clientHeight;
if(!w||!h)return;
ctx.clearRect(0,0,w,h);
if(!view)return;
drawGrid();
drawTrajectory();
drawStart();
drawVectors();
drawBodyAndVelocity();

const end=groundTime===Infinity?8:groundTime;
E.status.textContent=`t = ${Math.min(time,end).toFixed(2)} с`;
}

function resizeCanvas(){
const rect=wrap.getBoundingClientRect();
const dpr=Math.max(1,Math.min(window.devicePixelRatio||1,2));
const w=Math.max(1,Math.floor(rect.width));
const h=Math.max(1,Math.floor(rect.height));

canvas.width=Math.floor(w*dpr);
canvas.height=Math.floor(h*dpr);
canvas.style.width=w+"px";
canvas.style.height=h+"px";
ctx.setTransform(dpr,0,0,dpr,0,0);

calculateTrajectory();
draw();
}

function animate(now){
if(!running)return;
if(!lastFrame)lastFrame=now;

const dt=Math.min((now-lastFrame)/1000,.04);
lastFrame=now;
time+=dt;

const end=groundTime===Infinity?8:groundTime;

if(time>=end){
time=end;
running=false;
E.start.textContent="▶ Запустить";
}

draw();

if(running&&!disposed)rafId=rafId=requestAnimationFrame(animate);
}

function start(){
if(running){
running=false;
E.start.textContent="▶ Запустить";
return;
}

calculateTrajectory();

const end=groundTime===Infinity?8:groundTime;
if(time>=end-1e-5)time=0;

running=true;
lastFrame=0;
E.start.textContent="⏸ Пауза";
requestAnimationFrame(animate);
}

function updateLabels(){
E.v0Val.textContent=(+E.v0.value).toFixed(1).replace(".0","");
E.alphaVal.textContent=E.alpha.value+"°";
E.gVal.textContent=(+E.g.value).toFixed(1);
E.betaVal.textContent=E.beta.value+"°";
}

[E.x0,E.y0,E.v0,E.alpha,E.g,E.beta].forEach(el=>{
el.addEventListener("input",()=>{
if(el===E.v0||el===E.alpha||el===E.g||el===E.beta)updateLabels();
if(!running){
time=0;
calculateTrajectory();
draw();
}
});
});

E.start.addEventListener("click",start);

byId("motionResetBtn").addEventListener("click",()=>{
running=false;time=0;lastFrame=0;
E.start.textContent="▶ Запустить";
calculateTrajectory();draw();
});

byId("settingsResetBtn").addEventListener("click",()=>{
running=false;time=0;lastFrame=0;
E.x0.value=0;E.y0.value=0;E.v0.value=10;
E.alpha.value=45;E.g.value=9.8;E.beta.value=270;
updateLabels();
E.start.textContent="▶ Запустить";
calculateTrajectory();draw();
});

let resizeObserver=null;
const onResize=()=>resizeCanvas();
const onOrientation=()=>setTimeout(resizeCanvas,150);

if(window.ResizeObserver){
resizeObserver=new ResizeObserver(()=>resizeCanvas());
resizeObserver.observe(wrap);
}else{
window.addEventListener("resize",onResize);
}

window.addEventListener("orientationchange",onOrientation);

updateLabels();
setTimeout(resizeCanvas,50);

  return function cleanup() {
    disposed = true;
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    resizeObserver?.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onOrientation);
  };
}
