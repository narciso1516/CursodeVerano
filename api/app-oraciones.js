export default async function handler(req, res) {
  try {
    const source = "https://raw.githubusercontent.com/narciso1516/CursodeVerano/ba2c320c54fe80425a5651f4ae0f976260a46250/Plataforma_Oraciones_Guiadas_por_Grado.html";
    const r = await fetch(source, { cache: "no-store" });
    if (!r.ok) return res.status(502).send("No se pudo cargar la plataforma.");
    let html = await r.text();
    html = html.replace(
      'const API_ENDPOINT="/api/revisar-oracion"; // Conecta aquí tu backend seguro.',
      'const API_ENDPOINT="https://cursode-verano.vercel.app/api/revisar-oracion";'
    );
    html = html.replace(
      'const API_ENDPOINT=window.DICTADO_BACKEND_URL || "https://TU-BACKEND.vercel.app/api/revisar-oracion";',
      'const API_ENDPOINT="https://cursode-verano.vercel.app/api/revisar-oracion";'
    );
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(html);
  } catch (e) {
    return res.status(500).send("No se pudo abrir la plataforma.");
  }
}
