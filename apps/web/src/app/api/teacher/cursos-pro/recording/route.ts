/**
 * POST /api/teacher/cursos-pro/recording
 *
 * Permite a un docente subir la URL de grabación de una sesión cursos-pro.
 * Server-side con service role (evita exponer UPDATE via anon key).
 *
 * Body: { sessionId, recordingUrl, recordingProvider }
 * Auth: requiere user logueado con role staff
 *       (docente / admin / coordinacion / super_admin / finanzas).
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const STAFF_ROLES = new Set([
  "docente",
  "admin",
  "coordinacion",
  "super_admin",
  "finanzas",
]);

const ALLOWED_PROVIDERS = new Set([
  "youtube",
  "loom",
  "vimeo",
  "drive",
  "otro",
]);

interface Body {
  sessionId?: string;
  recordingUrl?: string;
  recordingProvider?: string;
}

export async function POST(req: NextRequest) {
  // ─── Auth ─────────────────────────────────────────────────────────
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // ─── Role check (service role para evitar recursión RLS profiles) ─
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = (profile?.role as string | undefined) ?? "";
  if (!STAFF_ROLES.has(role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // ─── Body validation ──────────────────────────────────────────────
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }
  const sessionId = (body.sessionId || "").trim();
  const recordingUrl = (body.recordingUrl || "").trim();
  const recordingProvider = (body.recordingProvider || "otro").trim();

  if (!sessionId) {
    return NextResponse.json({ error: "missing-sessionId" }, { status: 400 });
  }
  if (!recordingUrl) {
    return NextResponse.json(
      { error: "missing-recordingUrl" },
      { status: 400 }
    );
  }
  if (!ALLOWED_PROVIDERS.has(recordingProvider)) {
    return NextResponse.json({ error: "invalid-provider" }, { status: 400 });
  }

  // URL básica sanity check
  if (!/^https?:\/\//i.test(recordingUrl)) {
    return NextResponse.json(
      { error: "url-must-start-with-http" },
      { status: 400 }
    );
  }

  // ─── Update con service role ──────────────────────────────────────
  const { error: updErr } = await supabaseAdmin
    .from("cursos_pro_sessions")
    .update({
      recording_url: recordingUrl,
      recording_provider: recordingProvider,
    })
    .eq("id", sessionId);

  if (updErr) {
    return NextResponse.json(
      { error: "db-update-failed", detail: updErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
