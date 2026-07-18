import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { POLICY_VERSION } from "@/features/privacy/version";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { policyVersion } = body;

    // Validar que la version solicitada coincide con la actual
    const version = policyVersion || POLICY_VERSION;

    // Capturar IP del request (Vercel usa x-forwarded-for)
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    const userAgent = request.headers.get("user-agent") || null;

    // Insertar consentimiento — UNICO constraint evita duplicados
    const { error } = await supabaseAdmin.from("consent_records").upsert(
      {
        user_id: user.id,
        policy_version: version,
        accepted_at: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
      },
      { onConflict: "user_id,policy_version" }
    );

    if (error) {
      console.error("Error registrando consentimiento:", error);
      return NextResponse.json(
        { error: "Error al registrar consentimiento" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      policy_version: version,
      accepted_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error en /api/privacy/consent:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
