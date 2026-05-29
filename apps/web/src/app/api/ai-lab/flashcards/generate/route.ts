// ============================================================
// ITSEIA Academy — API: Generar Flashcards con Kimi (Moonshot)
// POST /api/ai-lab/flashcards/generate { sessionId }
// Migrado de Gemini → Kimi (Moonshot, API compatible con OpenAI)
// porque Gemini dejó de responder en producción (29 may 2026).
// Retorna array de flashcards sin guardar (el cliente las revisa
// y luego llama a saveFlashcards via Server Action)
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { FlashcardLocal } from "@/types/database";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const KIMI_API_KEY = process.env.KIMI_API_KEY || "";
const KIMI_URL = "https://api.moonshot.ai/v1/chat/completions";
const KIMI_MODEL = "moonshot-v1-32k" as const;

const SYSTEM_PROMPT = `Eres un experto en pedagogia y aprendizaje activo. Tu tarea es generar flashcards de estudio en espanol a partir de un texto academico. Genera entre 5 y 15 flashcards. Cada flashcard debe tener:
- "frente": una pregunta concisa y clara
- "dorso": la respuesta directa, maxima 3 oraciones

Prioriza: conceptos clave, definiciones, formulas, diferencias entre conceptos, y aplicaciones practicas.
Responde SOLO con un array JSON valido. No incluyas texto antes ni despues del JSON.
Formato exacto: [{"frente": "...", "dorso": "..."}]`;

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

async function callKimiForFlashcards(
  theoryMarkdown: string,
  temperature = 0.4
): Promise<FlashcardLocal[] | null> {
  const res = await fetch(KIMI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KIMI_API_KEY}`,
    },
    body: JSON.stringify({
      model: KIMI_MODEL,
      temperature,
      max_tokens: 2048,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Genera flashcards para el siguiente contenido academico:\n\n${theoryMarkdown}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error("Kimi error en flashcards:", res.status, await res.text());
    return null;
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const rawText = data.choices?.[0]?.message?.content ?? "";

  // Limpiar code fences si vienen y aislar el array JSON
  let cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const first = cleaned.indexOf("[");
  const last = cleaned.lastIndexOf("]");
  if (first !== -1 && last !== -1) {
    cleaned = cleaned.slice(first, last + 1);
  }

  try {
    const parsed = JSON.parse(cleaned) as FlashcardLocal[];
    if (!Array.isArray(parsed)) return null;
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

  if (!KIMI_API_KEY) {
    return Response.json(
      { error: "Servicio de IA no configurado" },
      { status: 500 }
    );
  }

  const { sessionId } = (await request.json()) as { sessionId?: string };

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
    return Response.json({ error: "Sesion no encontrada" }, { status: 404 });
  }

  const theoryMarkdown = (session as { theory_markdown?: string; title?: string }).theory_markdown;

  if (!theoryMarkdown || theoryMarkdown.trim().length < 50) {
    return Response.json({ error: "NO_THEORY" }, { status: 400 });
  }

  // Primer intento
  let flashcards = await callKimiForFlashcards(theoryMarkdown);

  // Reintento con temperatura menor si falla el parseo
  if (!flashcards || flashcards.length === 0) {
    flashcards = await callKimiForFlashcards(theoryMarkdown, 0.2);
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
