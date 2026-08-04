export default async function handler(req, res) {
  try {
    const source = "https://raw.githubusercontent.com/narciso1516/CursodeVerano/ba2c320c54fe80425a5651f4ae0f976260a46250/Plataforma_Oraciones_Guiadas_por_Grado.html";
    const r = await fetch(source, { cache: "no-store" });
    if (!r.ok) return res.status(502).send("No se pudo cargar la plataforma.");

    let html = await r.text();

    // Ejemplos contextualizados: el modelo debe ser una oración real y comprensible,
    // no una frase artificial sobre "usar la palabra".
    html = html.replace(
      'if(item.t==="oración") return item.x;',
      `if(k==="cansado") return "Luis llegó <span class='exampleWord'>cansado</span> a casa porque estuvo trabajando todo el día.";\n if(item.t==="oración") return item.x;`
    );

    // Evitar ejemplos genéricos que no aportan significado real.
    html = html.replace(
      'if(grade<=2)return "El dibujo muestra la palabra "+w+" en una situación cotidiana.";',
      'if(grade<=2)return "En casa podemos encontrar "+w+" durante nuestras actividades de todos los días.";'
    );
    html = html.replace(
      'if(grade<=4)return "Durante la clase usamos "+w+" para explicar una idea.";',
      'if(grade<=4)return "Ayer hablamos de "+w+" porque apareció en una situación que vivimos o estudiamos.";'
    );
    html = html.replace(
      'return "En nuestro proyecto empleamos "+w+" para comunicar una idea con precisión.";',
      'return "Comprendimos mejor "+w+" cuando la relacionamos con una situación real y explicamos por qué era importante.";'
    );

    // Guía especial para "cansado": primero ve un ejemplo natural y luego inventa otro distinto.
    html = html.replace(
      'const specific={',
      `const specific={\n  "cansado":{\n   1:["¿Quién puede estar cansado y por qué?",["cansado","porque"],"Escribe <b>quién + cómo está</b>."],\n   2:["¿Cuándo puede una persona estar cansada?",["cansado","después"],"Cuenta <b>quién + qué hizo + cómo terminó</b>."],\n   3:["Inventa una situación en la que alguien termine cansado.",["cansado","porque"],"Escribe una causa sencilla: <b>qué ocurrió + por qué quedó cansado</b>."],\n   4:["Piensa en otra persona y otra situación. ¿Por qué terminó cansada?",["cansado","porque"],"No copies el ejemplo. Cambia la persona, la actividad o el lugar."],\n   5:["Explica una situación cotidiana en la que alguien pueda terminar cansado.",["cansado","debido a"],"Relaciona la situación con una causa concreta."],\n   6:["Describe una causa y una consecuencia usando la palabra cansado.",["cansado","porque"],"Construye una oración clara con una relación lógica entre las ideas."]\n  },`
    );

    // Reforzar que el ejemplo sirve como modelo, no para copiarse.
    html = html.replace(
      '<div class="txt"><b>Observa cómo se usa la palabra dentro de una oración completa:</b></div>',
      '<div class="txt"><b>Lee este ejemplo real y fíjate en cómo la palabra tiene sentido dentro de la situación:</b></div>'
    );
    html = html.replace(
      '<span>No respondas con una sola palabra. La respuesta debe ser una oración completa que tenga sentido.</span>',
      '<span>No copies el ejemplo. Inventa una situación diferente y escribe una oración completa que tenga sentido.</span>'
    );

    // Esta versión es 100% pedagógica: el alumno trabaja en su libreta.
    // Se elimina la comprobación por fotografía/IA y se conserva teoría,
    // ejemplo, guía para formular la oración y avance al siguiente reto.
    html = html.replace(/<div class="step cameraCard">[\s\S]*?<\/div>\s*<div class="actions">/, `<div class="step mission" id="writeReminder">
      <div class="st">✍️ Ahora tú</div>
      <div class="txt"><b>Escribe tu oración completa en tu libreta.</b> Usa la palabra del reto, comienza con mayúscula, separa bien las palabras y termina con el signo de puntuación adecuado.</div>
      <div class="practiceBanner"><div class="emoji">🧠</div><div><strong>Antes de continuar</strong><br>Lee tu oración una vez y pregúntate: ¿se entiende lo que quiero decir? ¿Es diferente al ejemplo?</div></div>
    </div>
    <div class="actions">`);

    // Quitar botones/controles de cámara que pudieran quedar en variantes del HTML.
    html = html.replace(/<button[^>]*id="verify"[\s\S]*?<\/button>/g, "");
    html = html.replace(/<button[^>]*id="photoBtn"[\s\S]*?<\/button>/g, "");
    html = html.replace(/<input[^>]*id="photo"[^>]*>/g, "");
    html = html.replace(/<img[^>]*id="preview"[^>]*>/g, "");
    html = html.replace(/<div[^>]*id="feedback"[\s\S]*?<\/div>/g, "");
    html = html.replace(/<div[^>]*class="aiNote"[\s\S]*?<\/div>/g, "");

    // El siguiente reto ya no depende de una revisión de imagen.
    html = html.replace(/id="next" disabled/g, 'id="next"');
    html = html.replace(/\$\("next"\)\.disabled=true;/g, '$(' + '"next"' + ').disabled=false;');

    // Si el HTML original habilitaba el botón solo después de una foto,
    // forzamos su disponibilidad al renderizar cada reto.
    html = html.replace(/function renderLesson\(\)\{/,
      'function renderLesson(){ setTimeout(()=>{const n=document.getElementById("next");if(n)n.disabled=false;},0);');

    // Mensajes finales: entregar las oraciones hechas en la libreta.
    html = html.replace(/sube una foto[^<.]*(?:\.|<)/gi, 'entrega tus oraciones escritas en la libreta.<');
    html = html.replace(/manda una foto[^<.]*(?:\.|<)/gi, 'entrega tus oraciones escritas en la libreta.<');
    html = html.replace(/fotograf[ií]a[^<.]*(?:\.|<)/gi, 'actividad escrita.<');

    // Ocultar cualquier resto visual relacionado con cámara/verificación.
    html += `<style>
      .cameraCard,.cameraZone,#preview,#verify,#photoBtn,#feedback,.aiNote{display:none!important}
      #writeReminder{display:block!important}
      #next{opacity:1!important;pointer-events:auto!important}
    </style>
    <script>
      document.addEventListener('DOMContentLoaded',()=>{
        const clean=()=>{
          const n=document.getElementById('next'); if(n)n.disabled=false;
          document.querySelectorAll('.cameraCard,.cameraZone,#preview,#verify,#photoBtn,#feedback,.aiNote').forEach(e=>e.remove());
        };
        clean(); new MutationObserver(clean).observe(document.body,{childList:true,subtree:true});
      });
    </script>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    return res.status(200).send(html);
  } catch (e) {
    console.error("app-oraciones", e?.message || e);
    return res.status(500).send("No se pudo abrir la plataforma.");
  }
}
