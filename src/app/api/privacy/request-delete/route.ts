import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateDeadline } from "@/features/privacy/deadline";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const notes = body?.notes || null;

    // Verificar si ya existe una solicitud pendiente de eliminacion
    const { data: existing } = await supabase
      .from("data_requests")
      .select("id, status, created_at")
      .eq("user_id", user.id)
      .eq("type", "delete")
      .in("status", ["pending", "processing"])
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Ya tienes una solicitud de eliminacion pendiente. Espera a que sea procesada antes de enviar otra.",
          existing_request_id: existing.id,
        },
        { status: 409 }
      );
    }

    const now = new Date();
    const deadline = calculateDeadline(now);

    const { data: newRequest, error } = await supabase
      .from("data_requests")
      .insert({
        user_id: user.id,
        type: "delete",
        status: "pending",
        notes,
        created_at: now.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creando solicitud de eliminacion:", error);
      return NextResponse.json(
        { error: "Error al registrar la solicitud" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      request_id: newRequest.id,
      deadline: deadline.toISOString(),
      message:
        "Tu solicitud de eliminacion de datos fue recibida. Sera atendida en un plazo maximo de 15 dias habiles conforme a la LOPDP.",
    });
  } catch (err) {
    console.error("Error en /api/privacy/request-delete:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
