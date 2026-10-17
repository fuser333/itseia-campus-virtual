import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAllTeachersCapacitacion } from "@/features/teacher/queries";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    !["super_admin", "admin", "coordinacion"].includes(profile.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    const rows = await getAllTeachersCapacitacion();
    return NextResponse.json(rows);
  } catch (err) {
    console.error("capacitacion-report error:", err);
    return NextResponse.json(
      { error: "Error generando reporte" },
      { status: 500 }
    );
  }
}
