// ============================================================
// ITSEIA Academy — Biblioteca Virtual: Save/Unsave Paper
// Feature: 004-virtual-library
// POST /api/library/save — guarda paper en favoritos
// DELETE /api/library/save — elimina paper de favoritos
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateApa } from "@/features/library/apa";
import type { PaperResult } from "@/types/database";

export async function POST(request: Request) {
  try {
    // ── 1. Autenticar usuario ──
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion para guardar papers." },
        { status: 401 }
      );
    }

    // ── 2. Parsear body ──
    const body: PaperResult = await request.json();

    if (!body.id || !body.source || !body.title || !body.url) {
      return Response.json(
        { error: "Datos del paper incompletos. Se requiere: id, source, title, url." },
        { status: 400 }
      );
    }

    // ── 3. Generar cita APA ──
    const apaCitation = generateApa(body);

    // ── 4. Insertar en saved_papers ──
    const { data, error } = await supabaseAdmin
      .from("saved_papers")
      .insert({
        user_id: user.id,
        source: body.source,
        external_id: body.id,
        title: body.title,
        authors: JSON.stringify(body.authors || []),
        url: body.url,
        abstract: body.abstract || null,
        year: body.year || null,
        apa_citation: apaCitation,
      })
      .select()
      .single();

    if (error) {
      // Constraint violation = ya estaba guardado
      if (error.code === "23505") {
        return Response.json(
          { error: "Este paper ya esta en tus favoritos." },
          { status: 409 }
        );
      }
      console.error("Error guardando paper:", error);
      return Response.json(
        { error: "Error al guardar el paper." },
        { status: 500 }
      );
    }

    return Response.json({ saved: true, paper: data }, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/library/save:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // ── 1. Autenticar usuario ──
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion." },
        { status: 401 }
      );
    }

    // ── 2. Parsear body: necesita source + external_id ──
    const body: { source: string; external_id: string } = await request.json();

    if (!body.source || !body.external_id) {
      return Response.json(
        { error: "Se requieren source y external_id." },
        { status: 400 }
      );
    }

    // ── 3. Eliminar de saved_papers ──
    const { error } = await supabaseAdmin
      .from("saved_papers")
      .delete()
      .eq("user_id", user.id)
      .eq("source", body.source)
      .eq("external_id", body.external_id);

    if (error) {
      console.error("Error eliminando paper:", error);
      return Response.json(
        { error: "Error al eliminar el paper." },
        { status: 500 }
      );
    }

    return Response.json({ removed: true });
  } catch (error) {
    console.error("Error en DELETE /api/library/save:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
