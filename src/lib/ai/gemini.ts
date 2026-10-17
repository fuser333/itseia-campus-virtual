// ============================================================
// ITSEIA Academy — Gemini AI Utilities
// Modelo: gemini-2.0-flash | Proxy seguro server-side
// ============================================================

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiRequest {
  system_instruction?: {
    parts: { text: string }[];
  };
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

/**
 * Construye el body de la peticion para la API de Gemini.
 * Convierte el historial del chat al formato que espera Gemini
 * y anade el system prompt como system_instruction.
 */
export function buildGeminiRequest(
  message: string,
  history: Array<{ role: string; content: string }>,
  systemPrompt: string
): GeminiRequest {
  // Convertir historial al formato Gemini
  const contents: GeminiMessage[] = [];

  for (const msg of history) {
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }

  // Anadir el mensaje actual del usuario
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  return {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
  };
}

/**
 * Calcula el costo estimado en USD basado en el pricing de Gemini 2.0 Flash.
 * Input: $0.10 por 1M tokens
 * Output: $0.40 por 1M tokens
 */
export function estimateCost(tokensIn: number, tokensOut: number): number {
  const INPUT_COST_PER_MILLION = 0.10;
  const OUTPUT_COST_PER_MILLION = 0.40;

  const inputCost = (tokensIn / 1_000_000) * INPUT_COST_PER_MILLION;
  const outputCost = (tokensOut / 1_000_000) * OUTPUT_COST_PER_MILLION;

  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000; // 6 decimales
}

/**
 * System prompt base del tutor IA de ITSEIA.
 */
export const ITSEIA_SYSTEM_PROMPT = `Eres el tutor IA de ITSEIA, el Instituto Ecuatoriano de Inteligencia Artificial. Ayudas a estudiantes a aprender sobre IA, programacion y tecnologia. Responde en espanol. Se claro, practico y motivador. Si el estudiante esta atascado, dale pistas progresivas en vez de la respuesta directa.

Directrices adicionales:
- Usa ejemplos practicos y relevantes al contexto ecuatoriano y latinoamericano cuando sea posible.
- Si el estudiante pregunta algo fuera de tu area de conocimiento, redirigelo amablemente.
- Formatea tus respuestas con Markdown para mejor legibilidad (listas, codigo, negritas).
- Cuando muestres codigo, siempre indica el lenguaje.
- Motiva al estudiante y celebra sus avances.
- Nunca inventes datos o estadisticas. Si no sabes algo, dilo honestamente.`;

/**
 * Construye un system prompt enriquecido con contexto de leccion.
 */
export function buildContextualPrompt(context?: string): string {
  if (!context) return ITSEIA_SYSTEM_PROMPT;

  return `${ITSEIA_SYSTEM_PROMPT}

--- CONTEXTO DE LA LECCION ACTUAL ---
${context}
--- FIN DEL CONTEXTO ---

Usa este contexto para dar respuestas mas especificas y relevantes a lo que el estudiante esta aprendiendo. Referencia conceptos de la leccion cuando sea apropiado.`;
}
