// ============================================================
// ITSEIA Academy — POST/GET/PUT/DELETE /api/brain/notes
// Feature: segundo-cerebro-mvp
//
// CRUD de notas del alumno con vectorizacion automatica.
// Cada nota se vectoriza al crear/actualizar.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/brain/embeddings";

/** GET: Lista notas del usuario autenticado */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  let query = supabaseAdmin
    .from("brain_notes")
    .select("id, title, content, session_id, subject_id, tags, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Brain Notes] Error listando:", error);
    return Response.json({ error: "Error obteniendo notas" }, { status: 500 });
  }

  return Response.json({ notes: data || [] });
}

/** POST: Crea una nueva nota con vectorizacion automatica */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    content?: string;
    session_id?: string;
    subject_id?: string;
    tags?: string[];
  };

  if (!body.title || !body.content) {
    return Response.json(
      { error: "titulo y contenido son requeridos" },
      { status: 400 }
    );
  }

  // Generar embedding del contenido
  let embedding: number[] | null = null;
  try {
    embedding = await generateEmbedding(`${body.title}\n\n${body.content}`);
  } catch (err) {
    console.error("[Brain Notes] Error generando embedding:", err);
    // Continuar sin embedding — se puede re-generar despues
  }

  const insertData: Record<string, unknown> = {
    user_id: user.id,
    title: body.title,
    content: body.content,
    tags: body.tags || [],
    session_id: body.session_id || null,
    subject_id: body.subject_id || null,
  };

  if (embedding) {
    insertData.embedding = JSON.stringify(embedding);
  }

  const { data, error } = await supabaseAdmin
    .from("brain_notes")
    .insert(insertData)
    .select("id, title, content, session_id, tags, created_at, updated_at")
    .single();

  if (error) {
    console.error("[Brain Notes] Error creando:", error);
    return Response.json({ error: "Error creando nota" }, { status: 500 });
  }

  return Response.json({ note: data }, { status: 201 });
}

/** PUT: Actualiza una nota existente y re-vectoriza */
export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    title?: string;
    content?: string;
    tags?: string[];
  };

  if (!body.id) {
    return Response.json({ error: "id es requerido" }, { status: 400 });
  }

  // Verificar que la nota pertenece al usuario
  const { data: existing } = await supabaseAdmin
    .from("brain_notes")
    .select("id, user_id")
    .eq("id", body.id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return Response.json({ error: "Nota no encontrada" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.title) updateData.title = body.title;
  if (body.content) updateData.content = body.content;
  if (body.tags) updateData.tags = body.tags;

  // Re-generar embedding si cambio el contenido o titulo
  if (body.title || body.content) {
    try {
      const textToEmbed = `${body.title || ""}\n\n${body.content || ""}`;
      const embedding = await generateEmbedding(textToEmbed);
      updateData.embedding = JSON.stringify(embedding);
    } catch (err) {
      console.error("[Brain Notes] Error re-generando embedding:", err);
    }
  }

  const { data, error } = await supabaseAdmin
    .from("brain_notes")
    .update(updateData)
    .eq("id", body.id)
    .select("id, title, content, tags, updated_at")
    .single();

  if (error) {
    console.error("[Brain Notes] Error actualizando:", error);
    return Response.json(
      { error: "Error actualizando nota" },
      { status: 500 }
    );
  }

  return Response.json({ note: data });
}

/** DELETE: Elimina una nota del usuario */
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id es requerido" }, { status: 400 });
  }

  // Verificar propiedad
  const { data: existing } = await supabaseAdmin
    .from("brain_notes")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return Response.json({ error: "Nota no encontrada" }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("brain_notes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[Brain Notes] Error eliminando:", error);
    return Response.json(
      { error: "Error eliminando nota" },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
