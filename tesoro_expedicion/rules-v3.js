// Ajustes de interfaz y cierre para la mecánica de deuda v3.
// La lógica base mantiene: error 1=-2, error 2=-4, error 3=-6; el reto continúa hasta acertar.

updateToken = function(){
  document.querySelectorAll('.cell').forEach(c=>{
    c.classList.remove('current');
    c.querySelector('.token')?.remove();
  });
  const visualPos=Math.max(1,Math.min(40,state.pos));
  const cell=document.querySelector(`.cell[data-n="${visualPos}"]`);
  if(cell){
    cell.classList.add('current');
    const token=document.createElement('div');
    token.className='token';
    token.textContent=state.avatar;
    cell.appendChild(token);
  }
  const debt=Math.max(0,1-state.pos);
  $('#posLabel').textContent=visualPos;
  if($('#debtLabel')) $('#debtLabel').textContent=debt?`−${debt}`:'0';
  $('#scoreLabel').textContent=state.score;
  $('#streakLabel').textContent=state.streak;
  $('#progressBar').style.width=`${Math.max(2,visualPos/40*100)}%`;
  updateWorld();
  save();
};

finish = function(){
  state.finished=true;
  state.pos=40;
  $('#gameScreen').classList.remove('active');
  $('#resultScreen').classList.add('active');
  const mp=state.memoryAsked?Math.round(state.memoryCorrect/state.memoryAsked*100):0;
  $('#finalScore').textContent=state.score;
  $('#finalCorrect').textContent=`${state.correct}/${state.answered}`;
  $('#finalMemory').textContent=mp+'%';
  $('#finalStreak').textContent=state.bestStreak;
  if($('#finalErrors')) $('#finalErrors').textContent=state.wrong||0;
  $('#resultMessage').textContent=`${state.name}, llegaste al tesoro después de resolver ${state.usedQuestions.length} preguntas distintas. Tuviste ${state.wrong||0} errores y aun así recuperaste el camino.`;
  $('#secretCode').textContent=code();
  save();
};

// Refresca los nuevos indicadores cuando la página termina de cargar.
if(state && state.name && !state.finished){
  updateToken();
  prepareNext();
}
