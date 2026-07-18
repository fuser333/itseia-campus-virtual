// ============================================================
// ITSEIA Academy — /api/schedule
// CRUD para scheduled_classes (clases programadas en calendario)
//
// GET  /api/schedule?subjectId=...&from=...&to=...
// POST /api/schedule                   — crear clase programada
// PUT  /api/schedule                   — actualizar (body: id + campos)
// DELETE /api/schedule?id=...          — cancelar clase
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ── GET ── Listar clases programadas
export async function GET(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const url = new URL(request.url);
    const subjectId = url.searchParams.get("subjectId");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    let query = supabaseAdmin
      .from("scheduled_classes")
      .select(`
        *,
        subjects:subject_id ( id, name, code ),
        sessions:session_id ( id, number, title ),
        teacher:teacher_id ( id, full_name )
      `)
      .eq("is_cancelled", false)
      .order("scheduled_at", { ascending: true });

    if (subjectId) {
      query = query.eq("subject_id", subjectId);
    }

    if (from) {
      query = query.gte("scheduled_at", from);
    }

    if (to) {
      query = query.lte("scheduled_at", to);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      console.error("[DB] Error listando scheduled_classes:", error);
      return Response.json({ error: "Error al obtener las clases." }, { status: 500 });
    }

    return Response.json({ scheduledClasses: data || [] });
  } catch (error) {
    console.error("Error en GET /api/schedule:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

// ── POST ── Crear clase programada
export async function POST(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    // Verificar rol
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
    if (!profile || !allowedRoles.includes(profile.role)) {
      return Response.json(
        { error: "No tienes permisos para programar clases." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      subjectId,
      sessionId,
      scheduledAt,
      durationMinutes = 90,
      title,
      description,
    } = body as {
      subjectId: string;
      sessionId?: string;
      scheduledAt: string;
      durationMinutes?: number;
      title?: string;
      description?: string;
    };

    if (!subjectId || !scheduledAt) {
      return Response.json(
        { error: "subjectId y scheduledAt son requeridos." },
        { status: 400 }
      );
    }

    const { data: scheduledClass, error: insertError } = await supabaseAdmin
      .from("scheduled_classes")
      .insert({
        subject_id: subjectId,
        session_id: sessionId || null,
        teacher_id: user.id,
        scheduled_at: scheduledAt,
        duration_minutes: durationMinutes,
        title: title || null,
        description: description || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[DB] Error insertando scheduled_class:", insertError);
      return Response.json(
        { error: "Error al programar la clase." },
        { status: 500 }
      );
    }

    return Response.json({ scheduledClass }, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/schedule:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

// ── PUT ── Actualizar clase programada
export async function PUT(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateFields } = body as {
      id: string;
      scheduledAt?: string;
      durationMinutes?: number;
      title?: string;
      description?: string;
      isCancelled?: boolean;
      cancelReason?: string;
    };

    if (!id) {
      return Response.json({ error: "id es requerido." }, { status: 400 });
    }

    // Verificar propiedad o rol admin
    const { data: existing } = await supabaseAdmin
      .from("scheduled_classes")
      .select("teacher_id")
      .eq("id", id)
      .single();

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile && ["super_admin", "admin", "coordinacion"].includes(profile.role);
    const isOwner = existing?.teacher_id === user.id;

    if (!isAdmin && !isOwner) {
      return Response.json(
        { error: "No tienes permisos para modificar esta clase." },
        { status: 403 }
      );
    }

    // Mapear campos a snake_case para la DB
    const dbUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updateFields.scheduledAt !== undefined) dbUpdate.scheduled_at = updateFields.scheduledAt;
    if (updateFields.durationMinutes !== undefined) dbUpdate.duration_minutes = updateFields.durationMinutes;
    if (updateFields.title !== undefined) dbUpdate.title = updateFields.title;
    if (updateFields.description !== undefined) dbUpdate.description = updateFields.description;
    if (updateFields.isCancelled !== undefined) dbUpdate.is_cancelled = updateFields.isCancelled;
    if (updateFields.cancelReason !== undefined) dbUpdate.cancel_reason = updateFields.cancelReason;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("scheduled_classes")
      .update(dbUpdate)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[DB] Error actualizando scheduled_class:", updateError);
      return Response.json({ error: "Error al actualizar la clase." }, { status: 500 });
    }

    return Response.json({ scheduledClass: updated });
  } catch (error) {
    console.error("Error en PUT /api/schedule:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

// ── DELETE ── Cancelar clase programada (soft delete via is_cancelled)
export async function DELETE(request: Request) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return Response.json({ error: "id es requerido." }, { status: 400 });
    }

    // Solo admins pueden eliminar definitivamente
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile && ["super_admin", "admin"].includes(profile.role);

    if (isAdmin) {
      // Hard delete para admins
      await supabaseAdmin.from("scheduled_classes").delete().eq("id", id);
    } else {
      // Soft delete para docentes (marcar como cancelada)
      const { data: existing } = await supabaseAdmin
        .from("scheduled_classes")
        .select("teacher_id")
        .eq("id", id)
        .single();

      if (existing?.teacher_id !== user.id) {
        return Response.json(
          { error: "No tienes permisos para cancelar esta clase." },
          { status: 403 }
        );
      }

      await supabaseAdmin
        .from("scheduled_classes")
        .update({ is_cancelled: true, updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error en DELETE /api/schedule:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
