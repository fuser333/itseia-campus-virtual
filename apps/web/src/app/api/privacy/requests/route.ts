import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getDaysUntilDeadline, calculateDeadline } from "@/features/privacy/deadline";

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

// GET /api/privacy/requests — lista de solicitudes para admin
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);

    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status"); // pending, completed, all

    let query = supabaseAdmin
      .from("data_requests")
      .select(`
        id,
        user_id,
        type,
        status,
        notes,
        admin_notes,
        legal_hold_reason,
        resolved_at,
        created_at,
        profiles!data_requests_user_id_fkey ( id, full_name, email )
      `)
      .order("created_at", { ascending: true });

    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "pending") {
        query = query.in("status", ["pending", "processing"]);
      } else {
        query = query.eq("status", statusFilter);
      }
    } else if (!statusFilter) {
      // Por defecto: no mostrar completadas ni rechazadas
      query = query.not("status", "in", '("completed","rejected")');
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error listando solicitudes:", error);
      return NextResponse.json(
        { error: "Error al obtener solicitudes" },
        { status: 500 }
      );
    }

    // Agregar campo calculado days_until_deadline
    const enriched = (data || []).map((req) => {
      const createdAt = new Date(req.created_at);
      const days = getDaysUntilDeadline(createdAt);
      const deadline = calculateDeadline(createdAt);
      return {
        ...req,
        days_until_deadline: days,
        deadline_date: deadline.toISOString(),
        is_urgent: days <= 3 && req.status !== "completed" && req.status !== "rejected",
        is_overdue: days < 0,
      };
    });

    // Ordenar: vencidas primero, luego por dias ascendente
    enriched.sort((a, b) => a.days_until_deadline - b.days_until_deadline);

    return NextResponse.json({ requests: enriched });
  } catch (err) {
    console.error("Error en GET /api/privacy/requests:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
