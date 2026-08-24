const BASE='https://raw.githubusercontent.com/zapscribbles/barry-farts/main/Project/assets/audio/';
const SOURCES={
  classic:BASE+'fart1.wav',
  wet:BASE+'fart3.wav',
  ripper:BASE+'fart5.wav',
  thunder:BASE+'fart9.wav',
  kt:BASE+'fart2.wav',
  toxic:BASE+'fart7.wav',
  mixA:BASE+'fart4.wav',
  mixB:BASE+'fart8.wav',
  dave:BASE+'fart_big.wav'
};
const TYPES=['classic','wet','ripper','thunder','kt','toxic','mix','dave'];
let active=[];
function volume(){return Math.max(.1,Math.min(1,Number(document.getElementById('volume')?.value||1)));}
function makeAudio(url){
  const a=new Audio(url); a.preload='auto'; a.playsInline=true; a.volume=volume(); a.playbackRate=1;
  a.preservesPitch=true; a.webkitPreservesPitch=true;
  a.addEventListener('ended',()=>active=active.filter(x=>x!==a),{once:true});
  a.addEventListener('error',()=>{const s=document.getElementById('audioStatus');if(s)s.textContent='WAV failed to load — reload Safari and try again.';},{once:true});
  return a;
}
async function playUrl(url){const a=makeAudio(url);active.push(a);await a.play();}
async function playFart(type='classic'){
  stopAll();
  try{
    if(type==='mix'){
      await playUrl(SOURCES.mixA);
      setTimeout(()=>playUrl(SOURCES.mixB).catch(()=>{}),260);
    } else await playUrl(SOURCES[type]||SOURCES.classic);
    const s=document.getElementById('audioStatus'); if(s)s.textContent='MAX OUTPUT • natural-pitch WAV';
  }catch(e){const s=document.getElementById('audioStatus');if(s)s.textContent='Tap the sound again in Safari to allow audio.';}
}
function stopAll(){active.forEach(a=>{try{a.pause();a.currentTime=0}catch{}});active=[];}
document.querySelectorAll('.fart').forEach(b=>b.addEventListener('click',()=>playFart(b.dataset.fart)));
document.getElementById('randomBtn').onclick=()=>playFart(TYPES[Math.floor(Math.random()*TYPES.length)]);
document.getElementById('stopBtn').onclick=stopAll;
document.getElementById('count').oninput=e=>document.getElementById('countLabel').textContent=e.target.value;
document.getElementById('rapidBtn').onclick=()=>{stopAll();const n=Number(document.getElementById('count').value||7);for(let i=0;i<n;i++)setTimeout(()=>playFart(TYPES[Math.floor(Math.random()*TYPES.length)]),i*520);};
const volumeEl=document.getElementById('volume'),volumeLabel=document.getElementById('volumeLabel');
function updateVolumeLabel(){const v=volume();volumeLabel.textContent=v>=.99?'MAX BLAST':Math.round(v*100)+'%';active.forEach(a=>a.volume=v);}
volumeEl.addEventListener('input',updateVolumeLabel);updateVolumeLabel();
if('serviceWorker'in navigator){navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});if('caches'in window)caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});}