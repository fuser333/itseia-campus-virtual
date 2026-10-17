import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ADMIN_ROLES = ["super_admin", "admin", "coordinacion"];

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !ADMIN_ROLES.includes(profile.role)) return null;

  return user;
}

// PATCH /api/privacy/requests/[id] — actualizar estado de solicitud (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);

    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      status,
      admin_notes,
      legal_hold_reason,
    }: {
      status: "pending" | "processing" | "completed" | "rejected" | "held";
      admin_notes?: string;
      legal_hold_reason?: string;
    } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Se requiere el campo status" },
        { status: 400 }
      );
    }

    // Obtener la solicitud original para conocer el tipo
    const { data: originalRequest, error: fetchError } = await supabaseAdmin
      .from("data_requests")
      .select("type, user_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !originalRequest) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      status,
      admin_notes: admin_notes || null,
      legal_hold_reason: legal_hold_reason || null,
      resolved_by: admin.id,
    };

    if (status === "completed" || status === "rejected" || status === "held") {
      updatePayload.resolved_at = new Date().toISOString();
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("data_requests")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error actualizando solicitud:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar la solicitud" },
        { status: 500 }
      );
    }

    // Si se resuelve una solicitud de eliminacion: marcar perfil como eliminado logicamente
    if (
      status === "completed" &&
      originalRequest.type === "delete"
    ) {
      await supabaseAdmin
        .from("profiles")
        .update({ deleted_at: new Date().toISOString() } as Record<string, unknown>)
        .eq("id", originalRequest.user_id);
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (err) {
    console.error("Error en PATCH /api/privacy/requests/[id]:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
