// ============================================================
// ITSEIA Academy — POST /api/brain/delta
// Feature: segundo-cerebro-mvp
//
// Compara contenido nuevo vs base de conocimiento del alumno.
// Retorna resumen delta: "Lo que NO sabias" + flashcards.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { compareDelta } from "@/lib/brain/deltaEngine";

/** POST: Genera un resumen delta para una fuente o texto */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    source_id?: string;
    content?: string;
  };

  let contentToCompare: string;

  // Si se pasa source_id, obtener el contenido de la fuente
  if (body.source_id) {
    const { data: source } = await supabaseAdmin
      .from("brain_sources")
      .select("id, content, user_id")
      .eq("id", body.source_id)
      .single();

    if (!source || source.user_id !== user.id) {
      return Response.json(
        { error: "Fuente no encontrada" },
        { status: 404 }
      );
    }

    contentToCompare = source.content;
  } else if (body.content) {
    contentToCompare = body.content;
  } else {
    return Response.json(
      { error: "source_id o content son requeridos" },
      { status: 400 }
    );
  }

  if (contentToCompare.length < 50) {
    return Response.json(
      { error: "El contenido es demasiado corto para comparar" },
      { status: 400 }
    );
  }

  try {
    // Generar delta
    const deltaResult = await compareDelta(contentToCompare, user.id);

    // Guardar el delta en brain_deltas
    const { data: savedDelta, error } = await supabaseAdmin
      .from("brain_deltas")
      .insert({
        user_id: user.id,
        source_id: body.source_id || null,
        delta_content: deltaResult.delta_content,
        known_content: deltaResult.known_content,
        flashcards: deltaResult.flashcards,
        summary: deltaResult.summary,
      })
      .select("id, delta_content, known_content, flashcards, summary, created_at")
      .single();

    if (error) {
      console.error("[Brain Delta] Error guardando delta:", error);
      // Retornar el resultado aunque no se haya guardado
      return Response.json({ delta: deltaResult, saved: false });
    }

    return Response.json({ delta: savedDelta, saved: true }, { status: 201 });
  } catch (err) {
    console.error("[Brain Delta] Error generando delta:", err);
    const msg =
      err instanceof Error ? err.message : "Error procesando la comparacion";
    return Response.json({ error: msg }, { status: 500 });
  }
}
