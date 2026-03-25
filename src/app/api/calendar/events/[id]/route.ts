// ============================================================
// /api/calendar/events/[id]
// PATCH — Actualizar evento (creador o admin)
// DELETE — Cancelar evento con soft delete (is_cancelled = true)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ---- PATCH /api/calendar/events/[id] ----
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "estudiante";

  if (!["docente", "coordinacion", "admin", "super_admin"].includes(role)) {
    return NextResponse.json(
      { error: "Sin permisos para editar eventos" },
      { status: 403 }
    );
  }

  // Verificar que el evento existe y el usuario tiene permiso
  const { data: existingEvent } = await supabaseAdmin
    .from("calendar_events")
    .select("id, created_by, teacher_id, subject_id")
    .eq("id", id)
    .single();

  if (!existingEvent) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  const isAdmin = ["coordinacion", "admin", "super_admin"].includes(role);
  const isCreator = existingEvent.created_by === user.id;

  if (!isAdmin && !isCreator) {
    return NextResponse.json(
      { error: "Solo puedes editar tus propios eventos" },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON invalido" }, { status: 400 });
  }

  // Campos permitidos para actualizar
  const allowedFields = [
    "title",
    "description",
    "scheduled_at",
    "duration_minutes",
    "location",
    "videoconference_link",
    "type",
    "session_id",
  ];

  const updateData: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field];
    }
  }

  // Validaciones
  if (
    updateData.type &&
    !["class", "deadline", "tutoring", "exam"].includes(
      updateData.type as string
    )
  ) {
    return NextResponse.json(
      { error: "Tipo de evento invalido" },
      { status: 400 }
    );
  }

  if (
    updateData.duration_minutes !== undefined &&
    (typeof updateData.duration_minutes !== "number" ||
      (updateData.duration_minutes as number) < 15 ||
      (updateData.duration_minutes as number) > 300)
  ) {
    return NextResponse.json(
      { error: "Duracion debe estar entre 15 y 300 minutos" },
      { status: 400 }
    );
  }

  if (
    updateData.scheduled_at &&
    isNaN(new Date(updateData.scheduled_at as string).getTime())
  ) {
    return NextResponse.json(
      { error: "Fecha y hora invalidas" },
      { status: 400 }
    );
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No hay campos para actualizar" },
      { status: 400 }
    );
  }

  const { data: updatedEvent, error } = await supabaseAdmin
    .from("calendar_events")
    .update(updateData)
    .eq("id", id)
    .select(
      `*, subjects:subject_id (id, name, code), teacher:teacher_id (id, full_name)`
    )
    .single();

  if (error) {
    console.error("Error actualizando evento:", error);
    return NextResponse.json(
      { error: "Error al actualizar el evento" },
      { status: 500 }
    );
  }

  return NextResponse.json({ event: updatedEvent });
}

// ---- DELETE /api/calendar/events/[id] ----
// Soft delete: marca is_cancelled = true con cancelled_at timestamp
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "estudiante";

  if (!["docente", "coordinacion", "admin", "super_admin"].includes(role)) {
    return NextResponse.json(
      { error: "Sin permisos para cancelar eventos" },
      { status: 403 }
    );
  }

  const { data: existingEvent } = await supabaseAdmin
    .from("calendar_events")
    .select("id, created_by")
    .eq("id", id)
    .single();

  if (!existingEvent) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  const isAdmin = ["coordinacion", "admin", "super_admin"].includes(role);
  const isCreator = existingEvent.created_by === user.id;

  if (!isAdmin && !isCreator) {
    return NextResponse.json(
      { error: "Solo puedes cancelar tus propios eventos" },
      { status: 403 }
    );
  }

  const { error } = await supabaseAdmin
    .from("calendar_events")
    .update({
      is_cancelled: true,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error cancelando evento:", error);
    return NextResponse.json(
      { error: "Error al cancelar el evento" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
