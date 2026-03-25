// ============================================================
// /api/calendar/events
// GET  — Listar eventos por periodo y rol del usuario
// POST — Crear nuevo evento (docente / admin)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEventsForUser } from "@/features/calendar/queries";

// ---- GET /api/calendar/events?from=ISO&to=ISO&subject_id=optional ----
export async function GET(req: NextRequest) {
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

  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const subjectId = searchParams.get("subject_id") || undefined;

  // Default: semana actual
  const now = new Date();
  const from = fromParam
    ? new Date(fromParam)
    : new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const to = toParam
    ? new Date(toParam)
    : new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return NextResponse.json(
      { error: "Parametros de fecha invalidos" },
      { status: 400 }
    );
  }

  const events = await getEventsForUser(user.id, role, from, to, subjectId);

  return NextResponse.json({ events });
}

// ---- POST /api/calendar/events ----
export async function POST(req: NextRequest) {
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
      { error: "Solo docentes y administradores pueden crear eventos" },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON invalido" }, { status: 400 });
  }

  const {
    type,
    subject_id,
    session_id,
    title,
    description,
    scheduled_at,
    duration_minutes,
    location,
    videoconference_link,
  } = body as {
    type: string;
    subject_id?: string;
    session_id?: string;
    title: string;
    description?: string;
    scheduled_at: string;
    duration_minutes?: number;
    location?: string;
    videoconference_link?: string;
  };

  // Validaciones
  if (!type || !["class", "deadline", "tutoring", "exam"].includes(type)) {
    return NextResponse.json(
      { error: "Tipo de evento invalido. Use: class, deadline, tutoring, exam" },
      { status: 400 }
    );
  }

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json(
      { error: "El titulo es obligatorio" },
      { status: 400 }
    );
  }

  if (!scheduled_at || isNaN(new Date(scheduled_at).getTime())) {
    return NextResponse.json(
      { error: "Fecha y hora invalidas" },
      { status: 400 }
    );
  }

  const durationMin = typeof duration_minutes === "number" ? duration_minutes : 60;
  if (durationMin < 15 || durationMin > 300) {
    return NextResponse.json(
      { error: "La duracion debe estar entre 15 y 300 minutos" },
      { status: 400 }
    );
  }

  // Si es docente, verificar que la materia le pertenece
  if (role === "docente" && subject_id) {
    const { data: subject } = await supabaseAdmin
      .from("subjects")
      .select("teacher_id")
      .eq("id", subject_id)
      .single();

    if (!subject || subject.teacher_id !== user.id) {
      return NextResponse.json(
        { error: "Solo puedes crear eventos en tus materias asignadas" },
        { status: 403 }
      );
    }
  }

  const { data: event, error } = await supabaseAdmin
    .from("calendar_events")
    .insert({
      type,
      subject_id: subject_id || null,
      session_id: session_id || null,
      teacher_id: user.id,
      title: title.trim(),
      description: description || null,
      scheduled_at,
      duration_minutes: durationMin,
      location: location || null,
      videoconference_link: videoconference_link || null,
      created_by: user.id,
    })
    .select(
      `*, subjects:subject_id (id, name, code), teacher:teacher_id (id, full_name)`
    )
    .single();

  if (error) {
    console.error("Error creando evento:", error);
    return NextResponse.json(
      { error: "Error al crear el evento" },
      { status: 500 }
    );
  }

  return NextResponse.json({ event }, { status: 201 });
}
