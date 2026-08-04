export default async function handler(req, res) {
  try {
    const source = "https://raw.githubusercontent.com/narciso1516/CursodeVerano/ba2c320c54fe80425a5651f4ae0f976260a46250/Plataforma_Oraciones_Guiadas_por_Grado.html";
    const r = await fetch(source, { cache: "no-store" });
    if (!r.ok) return res.status(502).send("No se pudo cargar la plataforma.");

    let html = await r.text();

    // ------------------------------------------------------------------
    // EJEMPLOS PEDAGÓGICOS REVISADOS POR GRADO
    // Cada palabra del banco tiene un ejemplo concreto, cotidiano y
    // comprensible para la edad. Ya no existen ejemplos genéricos del tipo
    // "usamos X para explicar una idea".
    // ------------------------------------------------------------------
    const exampleFunction = String.raw`function exampleFor(item,f){
 const k=f.toLowerCase();
 if(item.t==="Oración" || item.t==="oración") return item.x;
 const w="<span class='exampleWord'>"+esc(f)+"</span>";
 const E={
  1:{
   "mesa":"Mi vaso está sobre la [w].",
   "gato":"El [w] duerme en mi cama.",
   "luna":"La [w] brilla de noche.",
   "pato":"El [w] nada en el agua.",
   "mano":"Levanto la [w] para participar.",
   "sopa":"Mi mamá prepara [w] caliente.",
   "dedo":"Me lastimé un [w] jugando.",
   "pelota":"La [w] cayó debajo de la silla.",
   "niña":"La [w] juega con su muñeca.",
   "leche":"Tomo [w] en el desayuno."
  },
  2:{
   "ventana":"Abrí la [w] para que entrara aire.",
   "zapato":"Mi [w] quedó debajo de la cama.",
   "jirafa":"La [w] come hojas de los árboles.",
   "queso":"Puse [w] en mi sándwich.",
   "huevo":"Mi mamá cocinó un [w] para desayunar.",
   "lluvia":"La [w] mojó las plantas del patio.",
   "perro":"Mi [w] corre cuando llego a casa.",
   "corazón":"Mi [w] late rápido cuando corro.",
   "guitarra":"Mi primo toca la [w] en casa.",
   "hormiga":"Una [w] cargaba una hoja pequeña."
  },
  3:{
   "ventana":"Cerré la [w] porque empezó a llover.",
   "zapato":"Encontré mi [w] junto a la puerta.",
   "jirafa":"La [w] alcanza las hojas más altas del árbol.",
   "hormiga":"La [w] llevó comida hasta su hormiguero.",
   "lluvia":"Después de la [w], salimos a jugar al patio.",
   "guitarra":"Ana practica la [w] después de hacer su tarea.",
   "corazón":"Mi [w] late más fuerte después de correr.",
   "árbol":"El [w] del patio nos da sombra.",
   "queso":"Mi papá preparó quesadillas con [w].",
   "guerra":"La [w] causa miedo y tristeza en muchas familias.",
   "cielo":"El [w] se puso oscuro antes de la tormenta.",
   "viaje":"Durante el [w], vimos montañas y ríos."
  },
  4:{
   "biblioteca":"Fui a la [w] para buscar un libro de animales.",
   "vegetación":"La [w] creció mucho después de varios días de lluvia.",
   "jirafa":"La [w] usa su cuello largo para alcanzar las hojas altas.",
   "geografía":"En [w] aprendimos dónde están los continentes.",
   "héroe":"El bombero fue un [w] porque ayudó a salvar a una familia.",
   "lluvioso":"Fue un día [w], así que llevamos paraguas a la escuela.",
   "carretera":"Viajamos por la [w] para visitar a mis abuelos.",
   "rápido":"El conejo corrió [w] para esconderse entre los árboles.",
   "química":"En [w] aprendimos que algunas sustancias pueden mezclarse.",
   "guitarra":"Mi hermana ensaya con la [w] para el festival escolar.",
   "excursión":"En la [w] al museo vimos fósiles de dinosaurios.",
   "ambiente":"Cuidamos el [w] cuando no tiramos basura en la calle.",
   "invierno":"En [w] hace más frío y usamos ropa abrigadora.",
   "también":"Mi hermana [w] quiere participar en el concurso."
  },
  5:{
   "investigación":"Nuestra [w] nos ayudó a descubrir por qué una planta creció más que otra.",
   "responsabilidad":"Hacer mi tarea a tiempo es una [w] que tengo como estudiante.",
   "geografía":"En [w] estudiamos cómo son los lugares donde viven las personas.",
   "científico":"El [w] anotó lo que observó durante el experimento.",
   "hábito":"Leer veinte minutos al día puede convertirse en un buen [w].",
   "convivencia":"Escuchar y respetar a los demás mejora la [w] en el salón.",
   "exposición":"Nuestro equipo preparó una [w] sobre el cuidado del agua.",
   "ambiente":"Separar la basura ayuda a cuidar el [w].",
   "subrayar":"Voy a [w] las ideas más importantes del texto.",
   "conclusión":"En la [w] escribimos lo que aprendimos después del experimento.",
   "democracia":"En una [w], las personas pueden participar en las decisiones de su comunidad.",
   "extraordinario":"Ver nacer a las tortugas en la playa fue algo [w]."
  },
  6:{
   "argumentación":"Una buena [w] explica una idea y la apoya con razones.",
   "hipótesis":"Nuestra [w] decía que la planta crecería más si recibía suficiente luz.",
   "consecuencia":"Una [w] de contaminar el río es que los animales pueden enfermar.",
   "biodiversidad":"México tiene una gran [w] porque posee muchas especies de plantas y animales.",
   "sostenibilidad":"La [w] busca que usemos los recursos sin acabarlos para las futuras generaciones.",
   "tecnología":"La [w] nos permite comunicarnos, investigar y resolver algunos problemas.",
   "geográfico":"Un mapa [w] muestra lugares como montañas, ríos, estados y ciudades.",
   "extraordinario":"El telescopio permitió observar un fenómeno [w] en el cielo.",
   "responsabilidad":"Compartir información verdadera en internet es una [w].",
   "convivencia":"La [w] mejora cuando escuchamos opiniones diferentes con respeto.",
   "investigación":"Una [w] necesita preguntas, información y evidencias para llegar a una conclusión.",
   "conclusión":"La [w] resume lo que muestran los datos y responde la pregunta inicial."
  }
 };
 const sentence=E[grade]?.[k];
 if(sentence) return sentence.replace("[w]",w);
 // Respaldo seguro: no muestra frases artificiales. Si alguna palabra nueva
 // entra al banco en el futuro, usa una oración simple según el grado.
 if(grade<=2) return "Escribe una oración corta y clara con "+w+" sobre algo que conozcas.";
 if(grade<=4) return "Piensa en una situación de tu casa, escuela o comunidad donde aparezca "+w+".";
 return "Relaciona "+w+" con una situación real y explica la idea con claridad.";
}

function sentenceGuide`;

    html = html.replace(/function exampleFor\(item,f\)\{[\s\S]*?\n\}\n\nfunction sentenceGuide/, exampleFunction);

    // Mejorar algunos modelos completos de oración para que sean naturales,
    // cercanos y progresivos por grado.
    const sentenceReplacements = [
      ["Aunque estaba cansado, terminó su tarea.", "Luis llegó cansado a casa porque trabajó todo el día."],
      ["El cielo estaba completamente gris.", "El cielo estaba gris porque se acercaba una tormenta."],
      ["Los estudiantes organizaron cuidadosamente sus materiales.", "Los estudiantes organizaron sus materiales antes de comenzar la actividad."],
      ["La tecnología facilita algunas tareas escolares.", "La tecnología nos ayuda a buscar información y preparar algunas tareas escolares."],
      ["La naturaleza cambia cuando varían las estaciones.", "La naturaleza cambia con las estaciones: algunas plantas florecen y otras pierden sus hojas."],
      ["La energía renovable puede disminuir algunos efectos ambientales.", "La energía solar puede producir electricidad sin quemar combustibles."],
      ["Los argumentos deben apoyarse en evidencias verificables.", "Una opinión es más sólida cuando la apoyamos con datos o ejemplos que podemos comprobar."],
      ["La evidencia apoya una afirmación cuando puede comprobarse.", "Una fotografía puede ser evidencia si ayuda a comprobar lo que ocurrió."],
      ["El respeto favorece una convivencia democrática y saludable.", "El respeto mejora la convivencia porque permite escuchar y aceptar ideas diferentes."]
    ];
    for (const [from,to] of sentenceReplacements) html = html.split(from).join(to);

    // En la sección del ejemplo dejamos explícito que debe comprenderlo, no copiarlo.
    html = html.replace(
      '<div class="txt"><b>Observa cómo se usa la palabra dentro de una oración completa:</b></div>',
      '<div class="txt"><b>Lee este ejemplo. La oración cuenta una situación que puedes imaginar y entender:</b></div>'
    );
    html = html.replace(
      '<span>No respondas con una sola palabra. La respuesta debe ser una oración completa que tenga sentido.</span>',
      '<span>No copies el ejemplo. Inventa otra situación y escribe una oración completa que tenga sentido.</span>'
    );

    // Guías especiales para palabras que necesitan contexto adicional.
    html = html.replace(
      'const specific={',
      `const specific={
  "guerra":{
   3:["Piensa en lo que puede pasar durante una guerra. ¿Cómo afecta a las personas?",["guerra","familias"],"Escribe una idea sencilla sobre una consecuencia de la guerra."]
  },
  "cansado":{
   1:["¿Quién puede estar cansado?",["cansado","papá"],"Escribe <b>quién + cómo está</b>."],
   2:["¿Por qué alguien puede estar cansado?",["cansado","porque"],"Cuenta <b>quién + qué hizo</b>."],
   3:["Inventa una situación en la que alguien termine cansado.",["cansado","porque"],"Explica una causa sencilla."],
   4:["¿Por qué una persona podría llegar cansada a casa?",["cansado","porque"],"Cambia la persona y la actividad del ejemplo."],
   5:["Explica una situación cotidiana en la que alguien termine cansado.",["cansado","debido a"],"Relaciona la situación con una causa concreta."],
   6:["Describe una causa y una consecuencia usando cansado.",["cansado","porque"],"Relaciona las dos ideas con claridad."]
  },`
    );

    // ------------------------------------------------------------------
    // VERSIÓN SIN FOTOGRAFÍA / IA: todo se trabaja en la libreta.
    // ------------------------------------------------------------------
    html = html.replace('📚 PRIMARIA • ESCRIBE • FOTOGRAFÍA • CORRIGE','📚 PRIMARIA • COMPRENDE • ESCRIBE • PRACTICA');
    html = html.replace('Escribe, Fotografía y Aprende 🦉','Comprende, Escribe y Aprende 🦉');
    html = html.replace('Aprende la regla, crea tu propia oración en la libreta, toma una foto y recibe una revisión antes de continuar.','Aprende la regla, observa un ejemplo claro y crea una oración diferente en tu libreta.');
    html = html.replace(/📓 <b>Todo se escribe en tu libreta\.<\/b>[\s\S]*?<\/div>/,
      '📓 <b>Todo se escribe en tu libreta.</b> Lee la explicación y el ejemplo; después inventa una oración diferente y continúa al siguiente reto.</div>');

    html = html.replace(/<section class="step cameraCard">[\s\S]*?<\/section>/, `<section class="step mission" id="writeReminder">
      <div class="st">✍️ Paso 4 • Escribe y revisa</div>
      <div class="txt"><b>Escribe tu oración completa en tu libreta.</b> Usa la palabra del reto, comienza con mayúscula y termina con el signo de puntuación adecuado.</div>
      <div class="practiceBanner"><div class="emoji">🧠</div><div><strong>Antes de continuar</strong><br>Lee tu oración y comprueba: ¿se entiende?, ¿usa bien la palabra?, ¿es diferente al ejemplo?</div></div>
    </section>`);

    html = html.replace(/id="next" disabled/g, 'id="next"');
    html = html.replace(/\$\("next"\)\.disabled=true;/g, '$("next").disabled=false;');

    // El JS original todavía intenta acceder a controles de cámara durante render().
    // Creamos elementos neutros ocultos para conservar compatibilidad sin mostrar nada.
    html += `<style>
      .cameraCard,.cameraZone,#preview,#verify,#retake,#photo,#feedback,.aiNote,#status{display:none!important}
      #writeReminder{display:block!important}
      #next{opacity:1!important;pointer-events:auto!important}
    </style>
    <script>
      document.addEventListener('DOMContentLoaded',()=>{
        const ids=['preview','verify','retake','photo','feedback','status'];
        for(const id of ids){
          if(!document.getElementById(id)){
            const el=id==='photo'?document.createElement('input'):id==='preview'?document.createElement('img'):id==='verify'||id==='retake'?document.createElement('button'):document.createElement('div');
            el.id=id; el.style.display='none'; document.body.appendChild(el);
          }
        }
        const enable=()=>{const n=document.getElementById('next');if(n)n.disabled=false;};
        enable();
        new MutationObserver(enable).observe(document.body,{childList:true,subtree:true});
      });
    </script>`;

    // Simplificar reporte final de la versión sin verificación automática.
    html = html.replace('✅ Correctas al primer intento','📓 Oraciones realizadas');
    html = html.replace('✏️ Corregidas','🔊 Veces que escuchaste de nuevo');

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    return res.status(200).send(html);
  } catch (e) {
    console.error("app-oraciones", e?.message || e);
    return res.status(500).send("No se pudo abrir la plataforma.");
  }
}
