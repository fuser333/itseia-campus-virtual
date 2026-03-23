// ============================================================
// ITSEIA Academy — API: Generar Flashcards con Gemini
// POST /api/ai-lab/flashcards/generate { sessionId }
// Retorna array de flashcards sin guardar (el cliente las revisa
// y luego llama a saveFlashcards via Server Action)
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getGeminiUrl } from "@/lib/ai/models";
import type { FlashcardLocal } from "@/types/database";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GENERATE_MODEL = "gemini-2.0-flash-lite" as const;

async function getAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorar
          }
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function buildFlashcardPrompt(theoryMarkdown: string): object {
  return {
    system_instruction: {
      parts: [
        {
          text: `Eres un experto en pedagogia y aprendizaje activo. Tu tarea es generar flashcards de estudio en espanol a partir de un texto academico. Genera entre 5 y 15 flashcards. Cada flashcard debe tener:
- "frente": una pregunta concisa y clara
- "dorso": la respuesta directa, maxima 3 oraciones

Prioriza: conceptos clave, definiciones, formulas, diferencias entre conceptos, y aplicaciones practicas.
Responde SOLO con un array JSON valido. No incluyas texto antes ni despues del JSON.
Formato exacto: [{"frente": "...", "dorso": "..."}]`,
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Genera flashcards para el siguiente contenido academico:\n\n${theoryMarkdown}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };
}

async function callGeminiForFlashcards(
  theoryMarkdown: string,
  temperature?: number
): Promise<FlashcardLocal[] | null> {
  const url = getGeminiUrl(GENERATE_MODEL, GEMINI_API_KEY);

  const body = buildFlashcardPrompt(theoryMarkdown);
  if (temperature !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (body as any).generationConfig.temperature = temperature;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Gemini error en flashcards:", res.status, await res.text());
    return null;
  }

  const data = await res.json() as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Intentar parsear JSON — limpiar markdown code fences si vienen
  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as FlashcardLocal[];
    if (!Array.isArray(parsed)) return null;
    // Validar estructura
    return parsed.filter(
      (c) =>
        typeof c.frente === "string" &&
        typeof c.dorso === "string" &&
        c.frente.length > 0 &&
        c.dorso.length > 0
    );
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!GEMINI_API_KEY) {
    return Response.json(
      { error: "Servicio de IA no configurado" },
      { status: 500 }
    );
  }

  const { sessionId } = await request.json() as { sessionId?: string };

  if (!sessionId) {
    return Response.json({ error: "sessionId requerido" }, { status: 400 });
  }

  // Obtener theory_markdown de la sesion
  const { data: session, error: sessionError } = await supabaseAdmin
    .from("sessions")
    .select("theory_markdown, title")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return Response.json(
      { error: "Sesion no encontrada" },
      { status: 404 }
    );
  }

  const theoryMarkdown = (session as { theory_markdown?: string; title?: string }).theory_markdown;

  if (!theoryMarkdown || theoryMarkdown.trim().length < 50) {
    return Response.json(
      { error: "NO_THEORY" },
      { status: 400 }
    );
  }

  // Primer intento
  let flashcards = await callGeminiForFlashcards(theoryMarkdown);

  // Reintento con temperatura menor si falla el parseo
  if (!flashcards || flashcards.length === 0) {
    flashcards = await callGeminiForFlashcards(theoryMarkdown, 0.2);
  }

  if (!flashcards || flashcards.length === 0) {
    return Response.json(
      {
        error:
          "No pude generar flashcards para esta sesion. Intenta de nuevo en un momento.",
      },
      { status: 500 }
    );
  }

  return Response.json({
    flashcards,
    session_title: (session as { title?: string }).title ?? "",
    count: flashcards.length,
  });
}
