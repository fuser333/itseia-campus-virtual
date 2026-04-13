// ============================================================
// ITSEIA Academy — POST /api/brain/generate
// Feature: segundo-cerebro-mvp
//
// Genera material de estudio: flashcards, resumenes, quizzes,
// tablas comparativas usando Gemini 2.0 Flash.
// ============================================================

import { createClient } from "@/lib/supabase/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

type MaterialType = "flashcards" | "summary" | "quiz" | "comparison";

/** POST: Genera material de estudio a partir de contenido */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    content?: string;
    type?: MaterialType;
    topic?: string;
  };

  if (!body.content || !body.type) {
    return Response.json(
      { error: "content y type son requeridos" },
      { status: 400 }
    );
  }

  const validTypes: MaterialType[] = [
    "flashcards",
    "summary",
    "quiz",
    "comparison",
  ];
  if (!validTypes.includes(body.type)) {
    return Response.json(
      {
        error: `Tipo invalido. Usa: ${validTypes.join(", ")}`,
      },
      { status: 400 }
    );
  }

  try {
    const prompt = buildPrompt(body.type, body.content, body.topic);
    const result = await callGemini(prompt);

    return Response.json({
      type: body.type,
      material: result,
    });
  } catch (err) {
    console.error("[Brain Generate] Error:", err);
    const msg =
      err instanceof Error ? err.message : "Error generando material";
    return Response.json({ error: msg }, { status: 500 });
  }
}

function buildPrompt(
  type: MaterialType,
  content: string,
  topic?: string
): string {
  const topicLabel = topic ? ` sobre "${topic}"` : "";
  const truncated = content.slice(0, 20000);

  switch (type) {
    case "flashcards":
      return `Eres un asistente educativo de ITSEIA (Instituto Ecuatoriano de Inteligencia Artificial).

Genera flashcards${topicLabel} a partir de este contenido:

${truncated}

Genera un JSON con esta estructura:
{
  "flashcards": [
    {"q": "Pregunta clara y directa", "a": "Respuesta concisa y precisa"},
    ...
  ]
}

REGLAS:
- Genera entre 8 y 15 flashcards
- Preguntas que evaluen comprension, no solo memoria
- Respuestas concisas pero completas
- Todo en espanol
- Cubre los conceptos mas importantes del contenido`;

    case "summary":
      return `Eres un asistente educativo de ITSEIA (Instituto Ecuatoriano de Inteligencia Artificial).

Genera un resumen ejecutivo${topicLabel} a partir de este contenido:

${truncated}

Genera un JSON con esta estructura:
{
  "summary": "Resumen en formato markdown con headers, bullets, y conceptos clave destacados en **negrita**. Maximo 1 pagina."
}

REGLAS:
- Estructura clara con secciones
- Destacar conceptos clave en negrita
- Incluir datos numericos si existen
- Todo en espanol
- Util para repasar antes de un examen`;

    case "quiz":
      return `Eres un asistente educativo de ITSEIA (Instituto Ecuatoriano de Inteligencia Artificial).

Genera un quiz de practica${topicLabel} a partir de este contenido:

${truncated}

Genera un JSON con esta estructura:
{
  "quiz": [
    {
      "question": "Pregunta del quiz",
      "options": ["Opcion A", "Opcion B", "Opcion C", "Opcion D"],
      "correct": 0,
      "explanation": "Explicacion de por que la respuesta correcta es correcta"
    },
    ...
  ]
}

REGLAS:
- Genera entre 5 y 10 preguntas
- 4 opciones por pregunta, solo 1 correcta
- "correct" es el indice (0-3) de la opcion correcta
- Mezcla dificultad: 30% facil, 50% medio, 20% dificil
- Explicaciones educativas
- Todo en espanol`;

    case "comparison":
      return `Eres un asistente educativo de ITSEIA (Instituto Ecuatoriano de Inteligencia Artificial).

Genera una tabla comparativa${topicLabel} a partir de este contenido:

${truncated}

Genera un JSON con esta estructura:
{
  "comparison": "Tabla comparativa en formato markdown. Usa | para columnas. Compara los conceptos principales del contenido lado a lado."
}

REGLAS:
- Identificar 2-4 conceptos principales que se puedan comparar
- Usar formato markdown con tabla (| Criterio | Concepto A | Concepto B |)
- Incluir al menos 5 criterios de comparacion
- Todo en espanol
- Que sea util para estudiar las diferencias clave`;
  }
}

async function callGemini(prompt: string): Promise<Record<string, unknown>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no configurada");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[Brain Generate] Gemini error:", errText);
    throw new Error("Error al generar con Gemini");
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  try {
    return JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    return { raw: rawText };
  }
}
