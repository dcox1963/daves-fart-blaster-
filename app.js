const SOURCES={
  real3:'https://bigsoundbank.com/UPLOAD/mp3/0241.mp3',
  real4:'https://bigsoundbank.com/UPLOAD/mp3/1031.mp3',
  designed1:'https://bigsoundbank.com/UPLOAD/mp3/0111.mp3',
  designed2:'https://bigsoundbank.com/UPLOAD/mp3/0240.mp3'
};

const PRESETS={
  classic:['real3',1.00], wet:['real4',0.88], squeak:['designed1',1.28], thunder:['real4',0.72],
  bubble:['real4',0.92], tiny:['real3',1.24], rip:['real3',1.08], monster:['real4',0.68],
  shart:['real4',0.78], diarrhea:['real4',0.64], mudslide:['real4',0.74], gurgler:['real4',0.84],
  cheeks:['designed1',1.12], sick:['real4',0.60], machinegun:['designed2',1.10], surprise:['real3',0.86]
};
const TYPES=Object.keys(PRESETS);
let active=[];

function volume(){return Math.max(.1,Math.min(1,Number(document.getElementById('volume')?.value||1)));}
function makeAudio(type){
  const [key,rate]=PRESETS[type]||PRESETS.classic;
  const a=new Audio(SOURCES[key]);
  a.preload='auto';
  a.playsInline=true;
  a.volume=volume();
  a.playbackRate=rate;
  a.preservesPitch=false;
  a.webkitPreservesPitch=false;
  a.addEventListener('ended',()=>active=active.filter(x=>x!==a),{once:true});
  a.addEventListener('error',()=>{
    const s=document.getElementById('audioStatus');
    if(s)s.textContent='Sound could not load — check internet and reload Safari.';
  },{once:true});
  return a;
}

async function playFart(type='classic'){
  try{
    const a=makeAudio(type);
    active.push(a);
    await a.play();
    const s=document.getElementById('audioStatus');
    if(s)s.textContent='Playing real recorded audio';
  }catch(e){
    const s=document.getElementById('audioStatus');
    if(s)s.textContent='Tap again in Safari to allow audio.';
  }
}
function stopAll(){active.forEach(a=>{try{a.pause();a.currentTime=0}catch{}});active=[];}

document.querySelectorAll('.fart').forEach(b=>b.addEventListener('click',()=>playFart(b.dataset.fart)));
document.getElementById('randomBtn').onclick=()=>playFart(TYPES[Math.floor(Math.random()*TYPES.length)]);
document.getElementById('testBtn').onclick=()=>playFart('classic');
document.getElementById('stopBtn').onclick=stopAll;
document.getElementById('count').oninput=e=>document.getElementById('countLabel').textContent=e.target.value;
document.getElementById('rapidBtn').onclick=()=>{
  stopAll();
  const n=Number(document.getElementById('count').value||7);
  for(let i=0;i<n;i++)setTimeout(()=>playFart(TYPES[Math.floor(Math.random()*TYPES.length)]),i*320);
};

const volumeEl=document.getElementById('volume'),volumeLabel=document.getElementById('volumeLabel');
function updateVolumeLabel(){const v=volume();volumeLabel.textContent=v>=.99?'MAX BLAST':Math.round(v*100)+'%';active.forEach(a=>a.volume=v);}
volumeEl.addEventListener('input',updateVolumeLabel);updateVolumeLabel();

if('serviceWorker'in navigator){
  navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
  if('caches'in window)caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
}
