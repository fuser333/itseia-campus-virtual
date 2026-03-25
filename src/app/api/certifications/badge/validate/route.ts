// ── POST /api/certifications/badge/validate ─────────────────
// Admin-only: validates a student's uploaded certificate.
// Changes badge_type from simulacro_aprobado to certificado_oficial.

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

  // Verify admin role
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const adminRoles = ["admin", "super_admin", "coordinacion"];
  if (!profile || !adminRoles.includes(profile.role)) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  let badgeId: string;
  try {
    const body = await req.json();
    badgeId = body.badge_id;
    if (!badgeId) throw new Error();
  } catch {
    return NextResponse.json({ error: "badge_id requerido" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("certification_badges")
    .update({
      badge_type: "certificado_oficial",
      validated_by: user.id,
      validation_date: new Date().toISOString(),
    })
    .eq("id", badgeId);

  if (error) {
    console.error("[badge/validate]", error);
    return NextResponse.json({ error: "Error al validar" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
