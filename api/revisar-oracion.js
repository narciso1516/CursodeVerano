const ALLOWED_ORIGIN = "https://narciso1516.github.io";
const OPENAI_URL = "https://api.openai.com/v1/responses";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
}

function extractText(response) {
  for (const item of response.output || []) {
    if (item.type !== "message") continue;
    for (const part of item.content || []) {
      if (part.type === "output_text" && typeof part.text === "string") return part.text;
    }
  }
  return "";
}

function parseJsonLoose(text) {
  const clean = String(text || "").trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try { return JSON.parse(clean); } catch {}
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start >= 0 && end > start) return JSON.parse(clean.slice(start, end + 1));
  throw new Error("La IA no devolvió un resultado estructurado.");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido." });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "El backend no tiene configurada OPENAI_API_KEY." });
  }

  const origin = req.headers.origin;
  if (origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: "Origen no permitido." });
  }

  const { image_data_url, grade, target_word, rule, example } = req.body || {};

  if (!Number.isInteger(Number(grade)) || Number(grade) < 1 || Number(grade) > 6) {
    return res.status(400).json({ error: "Grado inválido." });
  }
  if (typeof target_word !== "string" || target_word.length < 1 || target_word.length > 80) {
    return res.status(400).json({ error: "Palabra objetivo inválida." });
  }
  if (typeof image_data_url !== "string" || !/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(image_data_url) || image_data_url.length > 8000000) {
    return res.status(400).json({ error: "Imagen inválida o demasiado grande." });
  }

  const prompt = `Eres un docente de primaria experto en alfabetización, ortografía y redacción.\nAnaliza UNA fotografía de una oración manuscrita por un alumno de ${grade}.º de primaria en México.\n\nPALABRA OBJETIVO: "${target_word}"\nREGLA EXPLICADA AL ALUMNO: ${String(rule || "").slice(0,1200)}\nEJEMPLO MOSTRADO: ${String(example || "").slice(0,800)}\n\nLee únicamente la oración manuscrita principal. Ignora nombre, fecha, márgenes y otras anotaciones. Comprueba si usa correctamente la palabra objetivo. Evalúa con exigencia apropiada al grado: mayúscula inicial, ortografía de palabras legibles, separación, puntuación final, sentido completo y concordancia básica. Comprueba también que no sea una copia literal del ejemplo cuando sea posible. Si la foto no es suficientemente legible, no inventes: marca image_clear=false. No castigues estilo o tamaño de letra si es legible. La retroalimentación debe ser breve, clara y accionable para un niño.\n\nDevuelve SOLO JSON válido con esta estructura exacta:\n{\n  "correct": true,\n  "image_clear": true,\n  "transcription": "texto que logras leer",\n  "message": "retroalimentación breve",\n  "issues": ["problema concreto"],\n  "strengths": ["acierto concreto"],\n  "suggested_correction": "oración corregida, solo si hace falta; de lo contrario cadena vacía"\n}\n\nCriterio de correct=true: la oración es legible, contiene la palabra objetivo correctamente, expresa una idea completa y no tiene un error ortográfico o de puntuación relevante para el nivel.`;

  try {
    const openaiRes = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o",
        store: false,
        max_output_tokens: 700,
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: image_data_url, detail: "high" }
          ]
        }]
      })
    });

    const raw = await openaiRes.json();
    if (!openaiRes.ok) {
      console.error("OpenAI error", raw?.error?.type || openaiRes.status);
      return res.status(502).json({ error: "No fue posible analizar la imagen en este momento." });
    }

    const parsed = parseJsonLoose(extractText(raw));
    const result = {
      correct: Boolean(parsed.correct),
      image_clear: parsed.image_clear !== false,
      transcription: String(parsed.transcription || "").slice(0,500),
      message: String(parsed.message || "").slice(0,500),
      issues: Array.isArray(parsed.issues) ? parsed.issues.map(String).slice(0,6) : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String).slice(0,6) : [],
      suggested_correction: String(parsed.suggested_correction || "").slice(0,500)
    };
    if (!result.image_clear) result.correct = false;
    return res.status(200).json(result);
  } catch (err) {
    console.error("Review error", err?.message || "unknown");
    return res.status(500).json({ error: "Ocurrió un error al revisar la oración." });
  }
}
