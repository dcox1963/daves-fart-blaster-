const SOURCES={
  classic:'https://bigsoundbank.com/UPLOAD/mp3/0241.mp3',
  wet:'https://bigsoundbank.com/UPLOAD/mp3/1031.mp3',
  pig1:'https://bigsoundbank.com/UPLOAD/mp3/1691.mp3',
  pig2:'https://bigsoundbank.com/UPLOAD/mp3/1692.mp3',
  pig3:'https://bigsoundbank.com/UPLOAD/mp3/1693.mp3',
  pony1:'https://bigsoundbank.com/UPLOAD/mp3/1854.mp3',
  pony2:'https://bigsoundbank.com/UPLOAD/mp3/1855.mp3',
  farts:'https://bigsoundbank.com/UPLOAD/mp3/0866.mp3'
};

const PRESETS={
  classic:{src:'classic',rate:1.00},
  wet:{src:'wet',rate:1.00},
  ripper:{src:'pig1',rate:1.00},
  thunder:{src:'pony1',rate:1.00},
  kt:{src:'pig2',rate:1.00},
  toxic:{src:'pig3',rate:1.00},
  monster:{src:'pony2',rate:1.00},
  dave:{src:'farts',rate:0.92}
};
const TYPES=Object.keys(PRESETS);
let active=[];

function volume(){return Math.max(.1,Math.min(1,Number(document.getElementById('volume')?.value||1)));}
function makeAudio(type){
  const p=PRESETS[type]||PRESETS.classic;
  const a=new Audio(SOURCES[p.src]);
  a.preload='auto';
  a.playsInline=true;
  a.volume=volume();
  a.playbackRate=p.rate;
  a.preservesPitch=false;
  a.webkitPreservesPitch=false;
  a.addEventListener('ended',()=>active=active.filter(x=>x!==a),{once:true});
  a.addEventListener('error',()=>{
    const s=document.getElementById('audioStatus');
    if(s)s.textContent='Sound could not load — check internet and reload Safari.';
  },{once:true});
  return a;
}

async function playOne(type){
  const a=makeAudio(type);
  active.push(a);
  await a.play();
}

async function playFart(type='classic'){
  try{
    if(type==='mix'){
      // The Mix is intentionally layered from two very different recordings.
      await Promise.all([playOne('wet'),new Promise(r=>setTimeout(r,115)).then(()=>playOne('ripper'))]);
    }else if(type==='dave'){
      // Dave's Stank Butt gets the long, nasty recording at full output.
      await playOne('dave');
    }else{
      await playOne(type);
    }
    const s=document.getElementById('audioStatus');
    if(s)s.textContent='MAX OUTPUT • recorded audio';
  }catch(e){
    const s=document.getElementById('audioStatus');
    if(s)s.textContent='Tap again in Safari to allow audio.';
  }
}
function stopAll(){active.forEach(a=>{try{a.pause();a.currentTime=0}catch{}});active=[];}

document.querySelectorAll('.fart').forEach(b=>b.addEventListener('click',()=>playFart(b.dataset.fart)));
document.getElementById('randomBtn').onclick=()=>playFart(TYPES[Math.floor(Math.random()*TYPES.length)]);
document.getElementById('testBtn').onclick=()=>playFart('dave');
document.getElementById('stopBtn').onclick=stopAll;
document.getElementById('count').oninput=e=>document.getElementById('countLabel').textContent=e.target.value;
document.getElementById('rapidBtn').onclick=()=>{
  stopAll();
  const n=Number(document.getElementById('count').value||7);
  for(let i=0;i<n;i++)setTimeout(()=>playFart(TYPES[Math.floor(Math.random()*TYPES.length)]),i*420);
};

const volumeEl=document.getElementById('volume'),volumeLabel=document.getElementById('volumeLabel');
function updateVolumeLabel(){const v=volume();volumeLabel.textContent=v>=.99?'MAX BLAST':Math.round(v*100)+'%';active.forEach(a=>a.volume=v);}
volumeEl.addEventListener('input',updateVolumeLabel);updateVolumeLabel();

if('serviceWorker'in navigator){
  navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
  if('caches'in window)caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).catch(()=>{});
}
