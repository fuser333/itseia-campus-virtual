import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STAFF_ROLES = ["super_admin", "admin", "coordinacion", "docente"];
const WRITE_ROLES = ["super_admin", "admin", "coordinacion"];

async function getRoleOrNull(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null };
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return { user, role: (data?.role ?? null) as string | null };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { role } = await getRoleOrNull(supabase);
  if (!role || !STAFF_ROLES.includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("session_teaching_meta")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ meta: data ?? null });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { user, role } = await getRoleOrNull(supabase);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!role || !WRITE_ROLES.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const payload = {
    session_id: sessionId,
    proposito: body.proposito ?? "",
    objetivos_bloom: body.objetivos_bloom ?? [],
    habilidades: body.habilidades ?? [],
    metodologia: body.metodologia ?? {},
    ejercicio_modelo: body.ejercicio_modelo ?? null,
    errores_tipicos: body.errores_tipicos ?? null,
    intervencion_docente: body.intervencion_docente ?? null,
    transferencia_real: body.transferencia_real ?? null,
    fuentes: body.fuentes ?? [],
    updated_by: user.id,
  };

  const { data, error } = await supabase
    .from("session_teaching_meta")
    .upsert(payload, { onConflict: "session_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ meta: data });
}
