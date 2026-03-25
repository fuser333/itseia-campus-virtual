// ── POST /api/certifications/enroll ────────────────────────
// Enroll or re-touch enrollment for the authenticated user.
// Idempotent — safe to call multiple times.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let certificationId: string;
  try {
    const body = await req.json();
    certificationId = body.certification_id;
    if (!certificationId) throw new Error();
  } catch {
    return NextResponse.json(
      { error: "certification_id requerido" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("certification_enrollments")
    .upsert(
      {
        user_id: user.id,
        certification_id: certificationId,
        last_accessed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,certification_id" }
    )
    .select("id, user_id, certification_id, started_at, last_accessed_at")
    .single();

  if (error) {
    console.error("[enroll]", error);
    return NextResponse.json({ error: "Error al inscribirse" }, { status: 500 });
  }

  return NextResponse.json({ enrollment: data });
}
