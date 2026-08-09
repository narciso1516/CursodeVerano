(()=>{
  const synth=window.speechSynthesis;
  let currentWord='';

  function speakWord(word){
    if(!word)return;
    if(!('speechSynthesis' in window)){
      alert('Este dispositivo no permite escuchar la palabra. Puedes pedir ayuda a tu maestro.');
      return;
    }
    try{
      synth.cancel();
      const utter=new SpeechSynthesisUtterance(word);
      utter.lang='es-MX';
      utter.rate=0.72;
      utter.pitch=1;
      utter.volume=1;
      const voices=synth.getVoices();
      const voice=voices.find(v=>/^es-MX/i.test(v.lang))||voices.find(v=>/^es/i.test(v.lang));
      if(voice)utter.voice=voice;
      utter.onstart=()=>{
        const b=document.getElementById('listenWordBtn');
        if(b){b.textContent='🔊 Escuchando…';b.classList.add('listening');}
      };
      utter.onend=utter.onerror=()=>{
        const b=document.getElementById('listenWordBtn');
        if(b){b.textContent='🔊 Escuchar otra vez';b.classList.remove('listening');}
      };
      synth.speak(utter);
    }catch(e){
      console.error('No se pudo reproducir la palabra:',e);
      alert('No pude reproducir el audio. Inténtalo otra vez.');
    }
  }

  function isWritingChoice(card){
    const title=card.querySelector('h2')?.textContent.trim();
    return title==='Encuentra la correcta';
  }

  function enhance(){
    const card=document.getElementById('challengeCard');
    if(!card||!isWritingChoice(card))return;
    const focus=card.querySelector('.word-focus');
    if(!focus||focus.dataset.audioReady==='1')return;
    const word=focus.textContent.trim();
    if(!word)return;
    currentWord=word;
    focus.dataset.audioReady='1';
    focus.innerHTML='<button type="button" id="listenWordBtn" class="listen-word-btn" aria-label="Escuchar palabra">🔊 Escuchar palabra</button><div class="listen-help">Escucha con atención y elige cómo se escribe.</div>';
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#listenWordBtn');
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    speakWord(currentWord);
  },true);

  const observer=new MutationObserver(()=>enhance());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',enhance);
  window.addEventListener('pageshow',enhance);

  if(synth&&'onvoiceschanged' in synth){
    synth.onvoiceschanged=()=>synth.getVoices();
  }
})();