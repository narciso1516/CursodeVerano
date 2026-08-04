export default async function handler(req, res) {
  try {
    const source = "https://raw.githubusercontent.com/narciso1516/CursodeVerano/ba2c320c54fe80425a5651f4ae0f976260a46250/Plataforma_Oraciones_Guiadas_por_Grado.html";
    const r = await fetch(source, { cache: "no-store" });
    if (!r.ok) return res.status(502).send("No se pudo cargar la plataforma.");

    let html = await r.text();

    // The UI is served by Vercel, so use a same-origin backend path.
    html = html.replace(
      'const API_ENDPOINT="/api/revisar-oracion"; // Conecta aquí tu backend seguro.',
      'const API_ENDPOINT="/api/revisar-oracion";'
    );
    html = html.replace(
      'const API_ENDPOINT=window.DICTADO_BACKEND_URL || "https://TU-BACKEND.vercel.app/api/revisar-oracion";',
      'const API_ENDPOINT="/api/revisar-oracion";'
    );
    html = html.replace(
      'const API_ENDPOINT=window.DICTADO_BACKEND_URL || "https://cursode-verano.vercel.app/api/revisar-oracion";',
      'const API_ENDPOINT="/api/revisar-oracion";'
    );

    // Replace the old multipart demo request with the live JSON/image-data request
    // expected by /api/revisar-oracion.
    const oldVerify = `async function verifyWithAI(){
 attempts++;
 $("verify").disabled=true;$("status").textContent="✨ Revisando tu oración...";
 const it=lessons[idx], target=focusOf(it.x);
 try{
   const fd=new FormData();
   fd.append("image",file);
   fd.append("grade",String(grade));
   fd.append("target_word",target);
   fd.append("rule",ruleFor(it,target).replace(/<[^>]+>/g,""));
   const res=await fetch(API_ENDPOINT,{method:"POST",body:fd});
   if(!res.ok)throw new Error("backend unavailable");
   const data=await res.json();
   showFeedback(data, target);
 }catch(err){
   demoFeedback(target);
 }
}`;

    const newVerify = `async function imageFileToDataURL(file){
 const bitmap=await createImageBitmap(file);
 const maxSide=1600;
 const scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));
 const w=Math.max(1,Math.round(bitmap.width*scale));
 const h=Math.max(1,Math.round(bitmap.height*scale));
 const c=document.createElement("canvas");
 c.width=w;c.height=h;
 const cx=c.getContext("2d",{alpha:false});
 cx.fillStyle="#ffffff";cx.fillRect(0,0,w,h);
 cx.drawImage(bitmap,0,0,w,h);
 if(bitmap.close)bitmap.close();
 return c.toDataURL("image/jpeg",0.84);
}
async function verifyWithAI(){
 attempts++;
 $("verify").disabled=true;
 $("status").textContent="✨ Revisando tu oración con IA...";
 const it=lessons[idx], target=focusOf(it.x);
 try{
   const imageData=await imageFileToDataURL(file);
   const payload={
     image_data_url:imageData,
     grade:Number(grade),
     target_word:target,
     rule:ruleFor(it,target).replace(/<[^>]+>/g,""),
     example:exampleFor(it,target).replace(/<[^>]+>/g,"")
   };
   const res=await fetch(API_ENDPOINT,{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body:JSON.stringify(payload)
   });
   const data=await res.json().catch(()=>({}));
   if(!res.ok)throw new Error(data.error||"No fue posible revisar la fotografía.");
   showFeedback(data,target);
 }catch(err){
   $("feedback").className="feedback bad";
   $("feedback").innerHTML="<h3>⚠️ No pudimos revisar la foto</h3><div>"+esc(err.message||"Error de conexión")+"</div>";
   $("status").textContent="Intenta de nuevo con la misma foto o toma otra.";
   $("verify").disabled=false;
   $("next").disabled=true;
 }
}`;

    html = html.replace(oldVerify, newVerify);

    // Never silently fall back to a fake/demo success state.
    html = html.replace(
      `function demoFeedback(target){
 $("feedback").className="feedback warn";
 $("feedback").innerHTML="<h3>🧪 Modo demostración</h3><div>La foto quedó preparada, pero este archivo todavía no tiene conectado el backend de visión que puede leer la escritura manuscrita. Cuando se conecte, revisará si usaste <b>"+esc(target)+"</b>, mayúscula, puntuación, ortografía, sentido y concordancia.</div>";
 $("verify").disabled=false;$("next").disabled=false;
 results.push({word:target,attempts,correct:null,issues:["Modo demostración: revisión visual no conectada"]});
}`,
      `function demoFeedback(target){
 $("feedback").className="feedback bad";
 $("feedback").innerHTML="<h3>⚠️ Revisión no disponible</h3><div>No se pudo conectar con el servicio de revisión. Intenta nuevamente.</div>";
 $("verify").disabled=false;$("next").disabled=true;
}`
    );

    html = html.replace(
      '<div class="aiNote"><b>Importante:</b> este HTML está listo para conectarse a un servicio de IA con visión. En GitHub Pages no debes guardar una clave de API dentro del archivo. Si no hay backend conectado, la página entra en modo demostración y te muestra el flujo, pero no puede leer de forma fiable la escritura manuscrita.</div>',
      '<div class="aiNote"><b>🔐 Revisión segura:</b> la fotografía se procesa mediante un backend protegido para revisar únicamente la oración. La clave de OpenAI no está dentro de esta página.</div>'
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    return res.status(200).send(html);
  } catch (e) {
    console.error("app-oraciones", e?.message || e);
    return res.status(500).send("No se pudo abrir la plataforma.");
  }
}
