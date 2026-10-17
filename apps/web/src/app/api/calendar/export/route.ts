// ============================================================
// /api/calendar/export
// GET — Exporta el calendario en formato iCal RFC 5545 (.ics)
// Compatible con Google Calendar, Apple Calendar, Outlook
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getEventsForUser, getGlobalEvents } from "@/features/calendar/queries";
import { generateICal } from "@/features/calendar/ical";

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
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "estudiante";

  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const subjectId = searchParams.get("subject_id") || undefined;
  const eventType = searchParams.get("type") || undefined;

  // Default: mes actual
  const now = new Date();
  const from = fromParam
    ? new Date(fromParam)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const to = toParam
    ? new Date(toParam)
    : new Date(now.getFullYear(), now.getMonth() + 3, 0, 23, 59, 59);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return NextResponse.json(
      { error: "Parametros de fecha invalidos" },
      { status: 400 }
    );
  }

  let events;

  if (["super_admin", "admin", "coordinacion"].includes(role)) {
    // Admin ve todos los eventos, con filtro de tipo opcional
    events = await getGlobalEvents(from, to, subjectId, eventType);
  } else {
    events = await getEventsForUser(user.id, role, from, to, subjectId);
  }

  const calendarName = `ITSEIA Academy — ${profile?.full_name || "Calendario Academico"}`;
  const icalContent = generateICal(events, calendarName);

  const fromStr = from.toISOString().slice(0, 10).replace(/-/g, "");
  const toStr = to.toISOString().slice(0, 10).replace(/-/g, "");
  const filename = `calendario-itseia-${fromStr}-${toStr}.ics`;

  return new NextResponse(icalContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
