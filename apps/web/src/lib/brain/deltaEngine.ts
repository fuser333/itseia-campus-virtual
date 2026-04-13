// ============================================================
// ITSEIA Academy — Delta Engine (Gemini Comparison)
// Feature: segundo-cerebro-mvp
//
// Compara contenido nuevo vs base de conocimiento existente.
// Usa Gemini 2.0 Flash para generar el resumen delta:
// "Lo que NO sabias" vs "Lo que ya sabias".
// ============================================================

import { getRelevantNotesForEmbedding } from "./vectorSearch";
import { generateEmbedding } from "./embeddings";
import type { DeltaResult, Flashcard } from "@/types/brain";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Compara contenido nuevo con la base de conocimiento del alumno.
 * Retorna: lo nuevo (delta), lo conocido, flashcards y resumen.
 */
export async function compareDelta(
  newContent: string,
  userId: string
): Promise<DeltaResult> {
  // 1. Vectorizar el contenido nuevo
  const embedding = await generateEmbedding(newContent);

  // 2. Buscar las notas mas relevantes del alumno
  const relevantNotes = await getRelevantNotesForEmbedding(
    embedding,
    userId,
    20
  );

  // 3. Si no hay notas previas, todo es nuevo
  if (relevantNotes.length === 0) {
    return await generateDeltaWithGemini(newContent, "", true);
  }

  // 4. Compilar el conocimiento existente relevante
  const knownContent = relevantNotes
    .map((n) => `## ${n.title}\n${n.content}`)
    .join("\n\n---\n\n");

  // 5. Usar Gemini para comparar y generar delta
  return await generateDeltaWithGemini(newContent, knownContent, false);
}

/**
 * Llama a Gemini para generar el resumen delta.
 */
async function generateDeltaWithGemini(
  newContent: string,
  knownContent: string,
  isFirstTime: boolean
): Promise<DeltaResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no configurada");
  }

  const prompt = isFirstTime
    ? buildFirstTimePrompt(newContent)
    : buildComparisonPrompt(newContent, knownContent);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[DeltaEngine] Error Gemini:", errText);
    throw new Error("Error al procesar con Gemini");
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    const parsed = JSON.parse(rawText) as {
      delta_content?: string;
      known_content?: string;
      flashcards?: Flashcard[];
      summary?: string;
    };
    return {
      delta_content:
        parsed.delta_content || "No se encontro contenido nuevo significativo.",
      known_content: parsed.known_content || "",
      flashcards: parsed.flashcards || [],
      summary: parsed.summary || "",
    };
  } catch {
    // Si Gemini no retorno JSON valido, envolver el texto
    return {
      delta_content: rawText || "Error procesando la comparacion.",
      known_content: "",
      flashcards: [],
      summary: rawText,
    };
  }
}

function buildFirstTimePrompt(newContent: string): string {
  return `Eres un asistente educativo de ITSEIA (Instituto Ecuatoriano de Inteligencia Artificial).

El alumno esta construyendo su "Segundo Cerebro" — una base de conocimiento personal.
Esta es su PRIMERA fuente de conocimiento, asi que todo es nuevo.

CONTENIDO NUEVO:
${newContent.slice(0, 15000)}

Genera un JSON con esta estructura:
{
  "delta_content": "Resumen de los conceptos clave del contenido (en espanol, formato markdown con bullets)",
  "known_content": "",
  "flashcards": [
    {"q": "Pregunta sobre concepto clave 1", "a": "Respuesta concisa"},
    {"q": "Pregunta sobre concepto clave 2", "a": "Respuesta concisa"},
    {"q": "Pregunta sobre concepto clave 3", "a": "Respuesta concisa"},
    {"q": "Pregunta sobre concepto clave 4", "a": "Respuesta concisa"},
    {"q": "Pregunta sobre concepto clave 5", "a": "Respuesta concisa"}
  ],
  "summary": "Resumen ejecutivo de 2-3 parrafos del contenido"
}

IMPORTANTE:
- Todo en espanol
- Flashcards deben ser preguntas claras con respuestas directas
- El resumen debe ser util para estudiar
- Genera al menos 5 flashcards`;
}

function buildComparisonPrompt(
  newContent: string,
  knownContent: string
): string {
  return `Eres un asistente educativo de ITSEIA (Instituto Ecuatoriano de Inteligencia Artificial).

El alumno tiene un "Segundo Cerebro" con conocimiento acumulado. Ahora esta revisando contenido nuevo.
Tu trabajo es COMPARAR y encontrar lo que es NUEVO vs lo que YA SABE.

CONOCIMIENTO EXISTENTE DEL ALUMNO:
${knownContent.slice(0, 20000)}

---

CONTENIDO NUEVO A COMPARAR:
${newContent.slice(0, 15000)}

Genera un JSON con esta estructura:
{
  "delta_content": "SOLO lo que es NUEVO — conceptos, datos, perspectivas que el alumno NO tenia en su base. Formato markdown con bullets.",
  "known_content": "Resumen breve de lo que el alumno YA SABIA y aparece en el contenido nuevo (para confirmar que no se repite).",
  "flashcards": [
    {"q": "Pregunta sobre concepto NUEVO 1", "a": "Respuesta concisa"},
    {"q": "Pregunta sobre concepto NUEVO 2", "a": "Respuesta concisa"},
    {"q": "Pregunta sobre concepto NUEVO 3", "a": "Respuesta concisa"}
  ],
  "summary": "Resumen ejecutivo: que aporta esta fuente al conocimiento del alumno. 2-3 parrafos."
}

REGLAS:
- El delta_content debe contener SOLO informacion nueva, no repetir lo que ya sabe
- Si casi todo es conocido, el delta sera corto y eso esta bien
- Flashcards solo sobre conceptos NUEVOS
- Todo en espanol
- Se honesto: si no hay nada nuevo, di "Este contenido ya esta cubierto en tu base de conocimiento"`;
}
