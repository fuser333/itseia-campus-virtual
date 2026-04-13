// ============================================================
// ITSEIA Academy — POST /api/brain/search
// Feature: segundo-cerebro-mvp
//
// Busqueda semantica en notas y fuentes del alumno.
// Vectoriza la query y busca por similaridad coseno.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { searchAll } from "@/lib/brain/vectorSearch";

/** POST: Busqueda semantica en la base de conocimiento */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    query?: string;
    limit?: number;
    threshold?: number;
  };

  if (!body.query || body.query.trim().length < 3) {
    return Response.json(
      { error: "La busqueda debe tener al menos 3 caracteres" },
      { status: 400 }
    );
  }

  try {
    const results = await searchAll(body.query, user.id, {
      limit: body.limit ?? 20,
      threshold: body.threshold ?? 0.5,
    });

    return Response.json({
      results,
      query: body.query,
      count: results.length,
    });
  } catch (err) {
    console.error("[Brain Search] Error:", err);
    const msg =
      err instanceof Error ? err.message : "Error en busqueda semantica";
    return Response.json({ error: msg }, { status: 500 });
  }
}
