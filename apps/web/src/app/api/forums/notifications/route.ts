// ============================================================
// ITSEIA Academy — GET|PATCH /api/forums/notifications
// GET: Notificaciones no leidas del usuario autenticado
// PATCH: Marcar notificaciones como leidas
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const { data: notifications, error } = await supabaseAdmin
      .from("forum_notifications")
      .select("id, post_id, subject_id, message, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching forum notifications:", error);
      return Response.json({ error: "Error al cargar notificaciones." }, { status: 500 });
    }

    const unreadCount = (notifications ?? []).filter((n) => !n.is_read).length;

    return Response.json({ notifications: notifications ?? [], unreadCount });
  } catch (err) {
    console.error("Error en GET /api/forums/notifications:", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const body = await request.json();
    const ids: string[] | undefined = body.ids;

    let query = supabaseAdmin
      .from("forum_notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);

    if (ids && ids.length > 0) {
      query = query.in("id", ids);
    }
    // Si no se pasan ids, marca todas como leidas

    const { error } = await query;
    if (error) {
      console.error("Error marking notifications as read:", error);
      return Response.json({ error: "Error al actualizar notificaciones." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error en PATCH /api/forums/notifications:", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
