// ============================================================
// ITSEIA Academy — Biblioteca Virtual: Get Saved Papers
// Feature: 004-virtual-library
// GET /api/library/saved — lista los papers guardados del usuario
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
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

    // ── 2. Obtener papers guardados del usuario ──
    const { data, error } = await supabaseAdmin
      .from("saved_papers")
      .select("*")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false });

    if (error) {
      console.error("Error obteniendo papers guardados:", error);
      return Response.json(
        { error: "Error al obtener la lista de favoritos." },
        { status: 500 }
      );
    }

    return Response.json({ papers: data || [] });
  } catch (error) {
    console.error("Error en GET /api/library/saved:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
