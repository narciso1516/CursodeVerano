(()=>{
const worlds=[
 {name:'Primeros pasos',icon:'🌱',skill:'Reconocer palabras e imágenes'},
 {name:'Armo palabras',icon:'🧩',skill:'Separar y ordenar sílabas'},
 {name:'Completo palabras',icon:'✏️',skill:'Completar y distinguir palabras'},
 {name:'Leo y relaciono',icon:'🧠',skill:'Relacionar palabras y significado'},
 {name:'Reto explorador',icon:'🏆',skill:'Resolver palabras con menos ayuda'}
];
const Q=(w,type,word,prompt,data,answer,skill)=>({w,type,word,prompt,data,answer,skill});
const questions=[
Q(0,'picture','sol','¿Qué dibujo muestra un sol?',['🌙','☀️','🐟'],1,'Reconoce palabras frecuentes'),
Q(0,'picture','pan','¿Qué dibujo corresponde a “pan”?',['🍞','🍎','🥛'],0,'Relaciona palabra e imagen'),
Q(0,'choice','casa','Toca la palabra que dice CASA.',['cama','casa','masa'],1,'Distingue palabras parecidas'),
Q(0,'picture','gato','¿Dónde está el gato?',['🐶','🐱','🐰'],1,'Relaciona palabra e imagen'),
Q(0,'choice','mesa','Encuentra la palabra MESA.',['mesa','masa','misa'],0,'Reconoce palabras frecuentes'),
Q(0,'picture','mano','¿Qué dibujo corresponde a “mano”?',['👂','✋','👁️'],1,'Relaciona palabra e imagen'),
Q(0,'choice','luna','Toca la palabra LUNA.',['luna','lupa','lana'],0,'Distingue palabras parecidas'),
Q(0,'picture','pato','¿Qué dibujo muestra un pato?',['🐥','🦆','🐸'],1,'Relaciona palabra e imagen'),
Q(0,'syllables','perro','¿Cuántas partes escuchas al decir PE-RRO?',[1,2,3,4],1,'Cuenta sílabas sencillas'),
Q(0,'syllables','niña','¿Cuántas sílabas tiene NI-ÑA?',[1,2,3,4],1,'Cuenta sílabas sencillas'),

Q(1,'sort','pelota','Ordena las partes para formar PELOTA.',['lo','ta','pe'],['pe','lo','ta'],'Ordena sílabas'),
Q(1,'sort','camino','Ordena las partes para formar CAMINO.',['no','ca','mi'],['ca','mi','no'],'Ordena sílabas'),
Q(1,'sort','ventana','Construye VENTANA.',['ta','ven','na'],['ven','ta','na'],'Construye palabras'),
Q(1,'sort','zapato','Ordena ZA-PA-TO.',['to','za','pa'],['za','pa','to'],'Ordena sílabas'),
Q(1,'sort','conejo','Construye CONEJO.',['jo','co','ne'],['co','ne','jo'],'Construye palabras'),
Q(1,'fill','amigo','Completa: a - ___ - go','mi','mi','Completa sílabas faltantes'),
Q(1,'fill','camisa','Completa: ca - ___ - sa','mi','mi','Completa sílabas faltantes'),
Q(1,'choice','abuela','¿Cuál palabra está escrita correctamente?',['abuela','abuella','avuela'],0,'Distingue escritura correcta'),
Q(1,'sort','pájaro','Ordena las sílabas de PÁJARO.',['ro','pá','ja'],['pá','ja','ro'],'Ordena sílabas'),
Q(1,'fill','cuaderno','Completa: cua - ___ - no','der','der','Completa palabras de tres sílabas'),

Q(2,'choice','escuela','¿Cuál está escrita correctamente?',['escula','escuela','escuella'],1,'Distingue palabras parecidas'),
Q(2,'fill','jardín','Completa: jar - ___','dín','dín','Completa palabra'),
Q(2,'choice','dibujo','Encuentra DIBUJO.',['dibujo','dibugo','divujo'],0,'Reconoce escritura correcta'),
Q(2,'sort','colores','Ordena CO-LO-RES.',['res','co','lo'],['co','lo','res'],'Ordena sílabas'),
Q(2,'fill','mochila','Completa: mo - ___ - la','chi','chi','Completa sílabas faltantes'),
Q(2,'choice','lápiz','¿Cuál palabra dice LÁPIZ?',['lapis','lápiz','lápis'],1,'Observa letras y escritura'),
Q(2,'sort','familia','Construye FA-MI-LIA.',['lia','fa','mi'],['fa','mi','lia'],'Construye palabras'),
Q(2,'choice','ventana','¿Cuál palabra es VENTANA?',['ventana','vendana','ventanna'],0,'Distingue palabras parecidas'),
Q(2,'fill','maestra','Completa: ma - ___ - tra','es','es','Completa palabra'),
Q(2,'choice','juguete','¿Cuál está bien escrita?',['juguete','jugüete','juggete'],0,'Distingue escritura correcta'),

Q(3,'sort','mariposa','Construye MA-RI-PO-SA.',['po','sa','ma','ri'],['ma','ri','po','sa'],'Construye palabras largas'),
Q(3,'sort','bicicleta','Ordena BI-CI-CLE-TA.',['ta','bi','cle','ci'],['bi','ci','cle','ta'],'Ordena palabras de cuatro sílabas'),
Q(3,'picture','elefante','¿Qué dibujo corresponde a ELEFANTE?',['🦒','🐘','🐎'],1,'Relaciona palabra e imagen'),
Q(3,'choice','desayuno','Encuentra DESAYUNO.',['desayuno','desalluno','desayunno'],0,'Reconoce palabra larga'),
Q(3,'fill','amarillo','Completa: a - ma - ___ - llo','ri','ri','Completa palabra larga'),
Q(3,'choice','pregunta','¿Cuál está escrita correctamente?',['pregunta','pregumta','pregunnta'],0,'Distingue escritura correcta'),
Q(3,'sort','respuesta','Construye RES-PUES-TA.',['ta','res','pues'],['res','pues','ta'],'Ordena sílabas complejas'),
Q(3,'choice','historia','Toca la palabra HISTORIA.',['historia','hitoria','istoria'],0,'Reconoce palabra en forma escrita'),
Q(3,'context','biblioteca','Lee: “Ana fue a la ___ para buscar un libro.”',['bicicleta','biblioteca','ventana'],1,'Usa palabras en contexto'),
Q(3,'context','teléfono','Lee: “Mi mamá contestó el ___.”',['teléfono','elefante','cuaderno'],0,'Comprende palabra dentro de una oración'),

Q(4,'sort','computadora','Ordena COM-PU-TA-DO-RA.',['do','com','ra','ta','pu'],['com','pu','ta','do','ra'],'Construye palabra de cinco sílabas'),
Q(4,'choice','dinosaurio','Encuentra DINOSAURIO.',['dinosaurio','dinosario','dinosaurió'],0,'Reconoce palabra larga'),
Q(4,'sort','cocodrilo','Construye CO-CO-DRI-LO.',['dri','co','lo','co'],['co','co','dri','lo'],'Ordena palabra larga'),
Q(4,'fill','primavera','Completa: pri - ma - ___ - ra','ve','ve','Completa palabra larga'),
Q(4,'choice','fotografía','¿Cuál palabra está escrita correctamente?',['fotografia','fotografía','fotogrráfia'],1,'Observa escritura de palabras complejas'),
Q(4,'context','naturaleza','Lee: “Los árboles y las flores forman parte de la ___.”',['naturaleza','computadora','camisa'],0,'Comprende vocabulario en contexto'),
Q(4,'sort','explorador','Construye EX-PLO-RA-DOR.',['dor','ex','ra','plo'],['ex','plo','ra','dor'],'Construye palabra con grupo consonántico'),
Q(4,'choice','imaginación','Encuentra IMAGINACIÓN.',['imaginación','imajinación','imaginazión'],0,'Distingue palabra compleja'),
Q(4,'context','aventura','Lee: “Encontrar el tesoro fue una gran ___.”',['aventura','ventana','respuesta'],0,'Comprende palabra en contexto'),
Q(4,'sort','descubrimiento','Reto final: construye DES-CU-BRI-MIEN-TO.',['mien','des','to','bri','cu'],['des','cu','bri','mien','to'],'Construye una palabra muy larga')
];

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={name:'',index:0,points:0,medals:[],continued:false,startedAt:null,results:questions.map(()=>({solved:false,attempts:0,wrong:0,hints:0,clicks:{},history:[]}))};
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function start(){const name=$('#studentName').value.trim();if(!name){showStartError('Escribe tu nombre para comenzar.');return}state.name=name;state.startedAt=Date.now();$('#startScreen').classList.add('hidden');$('#gameScreen').classList.remove('hidden');render();}
function showStartError(msg){const f=$('#startError');f.textContent=msg;f.classList.add('show')}
$('#startBtn').addEventListener('click',start);$('#studentName').addEventListener('keydown',e=>{if(e.key==='Enter')start()});

function worldFor(i){return questions[i]?.w??4}
function buildWorlds(){const cw=worldFor(state.index);$('#worlds').innerHTML=worlds.map((w,i)=>`<div class="world ${i<cw?'done':i===cw?'current':'locked'}"><div><div class="icon">${w.icon}</div><div>${w.name}</div></div></div>`).join('')}
function render(){const q=questions[state.index];if(!q){showReport();return}buildWorlds();$('#pointsHud').textContent=state.points;$('#medalsHud').textContent=state.medals.length;$('#challengeHud').textContent=`${state.index+1}/50`;$('#progressText').textContent=`Reto ${state.index+1} de 50${state.index>=20?' · Extra':''}`;$('#worldText').textContent=`${worlds[q.w].icon} ${worlds[q.w].name}`;$('#progressBar').style.width=`${(state.index/50)*100}%`;
 const card=$('#challengeCard');card.classList.remove('next-in');void card.offsetWidth;card.classList.add('next-in');card.innerHTML=`<div class="challenge-head"><div><div class="eyebrow">${worlds[q.w].icon} ${esc(q.skill)}</div><h2>${titleFor(q)}</h2></div><div class="level">${levelFor(state.index)}</div></div><div class="word-focus">${esc(q.word)}</div><div class="prompt">${esc(q.prompt)}</div><div id="activity"></div><div class="footer-actions"><button id="prevBtn" class="btn ghost">← Anterior</button><button id="hintBtn" class="btn yellow">💡 Pista</button><button id="nextBtn" class="btn orange" disabled>Siguiente →</button></div><div id="feedback" class="feedback"></div><div class="mini-note">Tus intentos se guardan para mostrar cuánto aprendiste.</div>`;
 bindActivity(q);const r=state.results[state.index];if(r.solved)unlockSolved(q);$('#prevBtn').disabled=state.index===0;$('#prevBtn').onclick=()=>{if(state.index>0){state.index--;render()}};$('#hintBtn').onclick=()=>hint(q);$('#nextBtn').onclick=next;window.scrollTo({top:0,behavior:'smooth'});}
function titleFor(q){return q.type==='picture'?'Mira y elige':q.type==='sort'?'Construye la palabra':q.type==='fill'?'Completa la palabra':q.type==='syllables'?'Cuenta las sílabas':q.type==='context'?'Lee y piensa':'Encuentra la correcta'}
function levelFor(i){if(i<10)return'🌱 Muy fácil';if(i<20)return'⭐ Fácil';if(i<30)return'🧠 Intermedio';if(i<40)return'🚀 Más reto';return'🏆 Reto final'}
function recordClick(label){const r=state.results[state.index];r.clicks[label]=(r.clicks[label]||0)+1;r.history.push(label)}
function bindActivity(q){const a=$('#activity');if(q.type==='choice'||q.type==='picture'||q.type==='context'||q.type==='syllables'){
 const cls=q.type==='picture'?'emoji-grid':'options';a.innerHTML=`<div class="${cls}">${q.data.map((o,i)=>`<button class="option ${q.type==='picture'?'emoji-option':''}" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;a.querySelectorAll('.option').forEach(b=>b.onclick=()=>attemptOption(q,b));
 }else if(q.type==='sort'){
 a.innerHTML=`<div class="chips" id="pool">${q.data.map((s,i)=>`<button class="chip" data-id="${i}" data-value="${esc(s)}">${esc(s)}</button>`).join('')}</div><div class="build-zone" id="build"><span class="muted">Toca las sílabas en orden…</span></div><div style="text-align:center;margin-top:12px"><button id="checkBuild" class="btn primary">✅ Comprobar</button> <button id="resetBuild" class="btn ghost">↺ Borrar</button></div>`;const chosen=[];a.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>{if(ch.classList.contains('used'))return;recordClick(ch.dataset.value);chosen.push(ch.dataset.value);ch.classList.add('used');renderBuild(chosen)});$('#resetBuild').onclick=()=>{chosen.splice(0);a.querySelectorAll('.chip').forEach(c=>c.classList.remove('used'));renderBuild(chosen)};$('#checkBuild').onclick=()=>checkConstruct(q,chosen);
 }else if(q.type==='fill'){
 a.innerHTML=`<div class="blank-wrap"><input id="blankInput" autocomplete="off" placeholder="Escribe lo que falta"><button id="checkFill" class="btn primary">✅ Comprobar</button></div>`;$('#checkFill').onclick=()=>{const v=$('#blankInput').value.trim().toLowerCase();recordClick(v||'(vacío)');checkText(q,v)};$('#blankInput').addEventListener('keydown',e=>{if(e.key==='Enter')$('#checkFill').click()});
 }}
function renderBuild(chosen){const b=$('#build');b.innerHTML=chosen.length?chosen.map(x=>`<span class="chip">${esc(x)}</span>`).join(''):'<span class="mini-note">Toca las sílabas en orden…</span>'}
function attemptOption(q,b){if(state.results[state.index].solved)return;const i=+b.dataset.i;recordClick(String(q.data[i]));const r=state.results[state.index];r.attempts++;if(i===q.answer){solve(q,b)}else{r.wrong++;b.classList.add('wrong');shake();feedback('try',wrongMessage(r.wrong));setTimeout(()=>b.classList.remove('wrong'),450)}}
function checkConstruct(q,chosen){const r=state.results[state.index];r.attempts++;recordClick('Comprobar: '+chosen.join('-'));const ok=JSON.stringify(chosen.map(x=>x.toLowerCase()))===JSON.stringify(q.answer.map(x=>x.toLowerCase()));if(ok)solve(q);else{r.wrong++;shake();feedback('try',wrongMessage(r.wrong))}}
function checkText(q,v){const r=state.results[state.index];r.attempts++;if(v===String(q.answer).toLowerCase())solve(q);else{r.wrong++;shake();feedback('try',wrongMessage(r.wrong))}}
function wrongMessage(n){if(n===1)return'🤔 Casi. Mira con calma y vuelve a intentarlo.';if(n===2)return'💡 Vas bien. Puedes usar una pista o probar otra vez.';return'🌟 Sigue intentando. Cada intento te ayuda a aprender.'}
function hint(q){const r=state.results[state.index];r.hints++;let msg='Mira otra vez las letras y dilo despacio.';if(q.type==='sort')msg='Di la palabra despacio y piensa qué parte escuchas primero.';if(q.type==='fill')msg=`La parte que falta tiene ${String(q.answer).length} letras.`;if(q.type==='picture')msg='Lee la palabra y piensa qué dibujo representa.';if(q.type==='context')msg='Lee toda la oración y busca la palabra que tenga sentido.';feedback('hint','💡 '+msg)}
function solve(q,b){const r=state.results[state.index];if(r.solved)return;r.solved=true;const gained=r.wrong===0&&r.hints===0?10:r.wrong<=1?8:6;state.points+=gained;if(b)b.classList.add('correct');celebrate();feedback('good',`🎉 ¡Muy bien! +${gained} puntos. Ya puedes avanzar.`);unlockSolved(q);const last=!questions[state.index+1]||questions[state.index+1].w!==q.w;if(last)awardMedal(q.w);$('#pointsHud').textContent=state.points;$('#medalsHud').textContent=state.medals.length;}
function unlockSolved(){document.querySelectorAll('#activity button').forEach(b=>{if(!['resetBuild'].includes(b.id))b.disabled=true});$('#nextBtn').disabled=false;$('#hintBtn').disabled=true}
function next(){if(!state.results[state.index].solved)return;if(state.index===19&&!state.continued){$('#milestone').classList.remove('hidden');return}state.index++;render()}
$('#continueBtn').onclick=()=>{state.continued=true;$('#milestone').classList.add('hidden');state.index=20;showToast('🚀 ¡Vamos! Los retos ahora serán un poquito más difíciles.');render()};$('#finish20Btn').onclick=()=>{$('#milestone').classList.add('hidden');showReport(20)};
function feedback(kind,msg){const f=$('#feedback');f.className=`feedback show ${kind}`;f.innerHTML=msg}
function shake(){const c=$('#challengeCard');c.classList.add('shake');setTimeout(()=>c.classList.remove('shake'),260)}
function celebrate(){const m=$('#mascot');m.classList.add('pop');setTimeout(()=>m.classList.remove('pop'),450)}
function awardMedal(w){const name=worlds[w].name;if(state.medals.includes(name))return;state.medals.push(name);showToast(`🏅 ¡Ganaste la medalla: ${name}!`)}
function showToast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1700)}
function statusFor(indices){const solved=indices.filter(i=>state.results[i].solved);if(!solved.length)return'—';const first=solved.filter(i=>state.results[i].wrong===0&&state.results[i].hints===0).length/solved.length;const avg=solved.reduce((s,i)=>s+state.results[i].wrong,0)/solved.length;if(first>=.7&&avg<=.5)return'✅ Ya lo hace con seguridad';if(first>=.4&&avg<=1.5)return'🟡 Está aprendiendo y mejorando';return'🔵 Conviene practicar un poco más'}
function showReport(limit){const completed=typeof limit==='number'?limit:state.results.filter(r=>r.solved).length;$('#gameScreen').classList.add('hidden');$('#reportScreen').classList.remove('hidden');const elapsed=Math.max(1,Math.round((Date.now()-state.startedAt)/60000));const totalWrong=state.results.slice(0,completed).reduce((s,r)=>s+r.wrong,0);const firstTry=state.results.slice(0,completed).filter(r=>r.solved&&r.wrong===0&&r.hints===0).length;const skillRows=worlds.map((w,wi)=>{const inds=questions.map((q,i)=>q.w===wi&&i<completed?i:-1).filter(i=>i>=0);if(!inds.length)return'';return `<div class="skill-card"><b>${w.icon} ${esc(w.skill)}</b><br>${statusFor(inds)}</div>`}).join('');const detail=questions.slice(0,completed).map((q,i)=>{const r=state.results[i];const clicks=Object.entries(r.clicks).map(([k,v])=>`${esc(k)} ×${v}`).join(', ')||'—';return `<tr><td>${i+1}. ${esc(q.word)}</td><td>${r.attempts}</td><td>${r.wrong}</td><td>${r.hints}</td><td>${clicks}</td></tr>`}).join('');const reached50=completed===50;$('#reportScreen').innerHTML=`<div class="eyebrow">Reporte individual de aprendizaje</div><h2>${esc(state.name)} · ${reached50?'¡Expedición completa!':'Meta de 20 retos completada'}</h2><p>${reached50?'Completó los 50 retos, incluidos los 30 retos extra.':'Completó los 20 retos principales. Los retos 21–50 eran opcionales.'}</p><div class="report-grid"><div class="stat"><b>${state.points}</b>puntos</div><div class="stat"><b>${completed}</b>retos</div><div class="stat"><b>${firstTry}</b>al primer intento</div><div class="stat"><b>${totalWrong}</b>errores corregidos</div></div><h3>📚 Lo que observamos</h3>${skillRows}<h3>🔎 Detalle de intentos</h3><div style="overflow:auto"><table><thead><tr><th>Reto</th><th>Intentos</th><th>Errores</th><th>Pistas</th><th>Toques / respuestas</th></tr></thead><tbody>${detail}</tbody></table></div><p><b>Cómo leerlo:</b> un error no significa que el alumno “no sabe”. El reporte muestra cuánta ayuda y cuántos intentos necesitó antes de resolver cada palabra.</p><div class="report-actions"><button class="btn primary" onclick="window.print()">🖨️ Imprimir reporte</button>${completed===20?'<button id="continueReport" class="btn orange">🚀 Seguir con los retos extra</button>':''}<button id="restartBtn" class="btn ghost">🔄 Volver a empezar</button></div>`;if(completed===20)$('#continueReport').onclick=()=>{state.continued=true;$('#reportScreen').classList.add('hidden');$('#gameScreen').classList.remove('hidden');state.index=20;render()};$('#restartBtn').onclick=()=>location.reload();window.scrollTo({top:0,behavior:'smooth'});}
})();
