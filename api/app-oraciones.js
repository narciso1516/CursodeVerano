export default async function handler(req, res) {
  try {
    const source = "https://raw.githubusercontent.com/narciso1516/CursodeVerano/ba2c320c54fe80425a5651f4ae0f976260a46250/Plataforma_Oraciones_Guiadas_por_Grado.html";
    const r = await fetch(source, { cache: "no-store" });
    if (!r.ok) return res.status(502).send("No se pudo cargar la plataforma.");

    let html = await r.text();

    // Esta versión es 100% pedagógica: el alumno trabaja en su libreta.
    // Se elimina la comprobación por fotografía/IA y se conserva teoría,
    // ejemplo, guía para formular la oración y avance al siguiente reto.
    html = html.replace(/<div class="step cameraCard">[\s\S]*?<\/div>\s*<div class="actions">/, `<div class="step mission" id="writeReminder">
      <div class="st">✍️ Ahora tú</div>
      <div class="txt"><b>Escribe tu oración completa en tu libreta.</b> Usa la palabra del reto, comienza con mayúscula, separa bien las palabras y termina con el signo de puntuación adecuado.</div>
      <div class="practiceBanner"><div class="emoji">🧠</div><div><strong>Antes de continuar</strong><br>Lee tu oración una vez y pregúntate: ¿se entiende lo que quiero decir?</div></div>
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
