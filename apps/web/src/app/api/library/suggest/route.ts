// ============================================================
// ITSEIA Academy — Biblioteca Virtual: Suggest API (Gemini)
// Feature: 004-virtual-library
// GET /api/library/suggest?context=SESSION_TITLE
// Usa Gemini para generar terminos de busqueda desde el contexto
// de la sesion academica activa
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { searchOpenAlex } from "@/features/library/openalex";
import { searchArXiv } from "@/features/library/arxiv";
import { mergeResults } from "@/features/library/merge";

// Migrado Gemini → Kimi (Moonshot) 29 may 2026 — Gemini caído (404)
const KIMI_API_KEY = process.env.KIMI_API_KEY;
const KIMI_URL = "https://api.moonshot.ai/v1/chat/completions";
const KIMI_MODEL = "moonshot-v1-8k";

/**
 * Llama a Gemini para generar terminos de busqueda academica
 * desde el titulo/descripcion de una sesion.
 */
async function generateSearchTerms(context: string): Promise<string[]> {
  if (!KIMI_API_KEY) {
    // Fallback: usar el contexto directo como query
    return [context.slice(0, 80)];
  }

  const prompt = `Dado el siguiente titulo o descripcion de una sesion academica de un instituto de Inteligencia Artificial en Ecuador:

"${context}"

Genera exactamente 3 terminos de busqueda academica en ingles para encontrar papers cientificos relevantes en bases de datos como OpenAlex o arXiv.
Los terminos deben ser especificos y tecnicos (no frases largas).
Responde UNICAMENTE con los 3 terminos separados por comas, sin numeracion, sin explicaciones, sin comillas.

Ejemplo de formato correcto: neural networks, convolutional image classification, deep learning medical imaging`;

  const body = {
    model: KIMI_MODEL,
    temperature: 0.3,
    max_tokens: 100,
    messages: [{ role: "user", content: prompt }],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(KIMI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIMI_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) return [context.slice(0, 80)];

    const data = await res.json();
    const text: string =
      data?.choices?.[0]?.message?.content || "";

    if (!text) return [context.slice(0, 80)];

    // Parsear: "term1, term2, term3"
    const terms = text
      .split(",")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 2 && t.length < 100);

    return terms.length > 0 ? terms : [context.slice(0, 80)];
  } catch {
    return [context.slice(0, 80)];
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: Request) {
  try {
    // ── Autenticacion requerida ──
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context")?.trim();

    if (!context || context.length < 3) {
      return Response.json(
        { error: "El parametro 'context' es requerido." },
        { status: 400 }
      );
    }

    // ── Generar terminos con Gemini ──
    const terms = await generateSearchTerms(context);
    const primaryQuery = terms[0];

    // ── Buscar papers usando el primer termino generado ──
    const [openalexResult, arxivResult] = await Promise.allSettled([
      searchOpenAlex(primaryQuery, 10),
      searchArXiv(primaryQuery, 5),
    ]);

    const openalexPapers =
      openalexResult.status === "fulfilled" ? openalexResult.value : [];
    const arxivPapers =
      arxivResult.status === "fulfilled" ? arxivResult.value : [];

    const results = mergeResults(openalexPapers, arxivPapers, []);

    return Response.json({
      terms,
      primary_query: primaryQuery,
      results,
      context,
    });
  } catch (error) {
    console.error("Error en GET /api/library/suggest:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
