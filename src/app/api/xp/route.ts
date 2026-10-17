// ============================================================
// ITSEIA Academy — XP Award API Route (POST)
// Auth + Validacion + Incremento XP en profiles
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { XP_EVENTS, isValidXPEvent, checkLevelUp } from "@/lib/gamification";

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se ignora en Server Components
          }
        },
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    // ── 1. Autenticar usuario ──
    const supabase = await getSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion." },
        { status: 401 }
      );
    }

    // ── 2. Parsear body ──
    const body = await request.json();
    const { eventType, metadata } = body as {
      eventType: string;
      metadata?: Record<string, unknown>;
    };

    if (!eventType || !isValidXPEvent(eventType)) {
      return Response.json(
        { error: "Tipo de evento XP invalido." },
        { status: 400 }
      );
    }

    // ── 3. Obtener XP actual del usuario ──
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("nivel_xp")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error obteniendo perfil:", profileError);
      return Response.json(
        { error: "No se encontro el perfil del usuario." },
        { status: 404 }
      );
    }

    const currentXP = profile.nivel_xp || 0;
    const xpToAward = XP_EVENTS[eventType].xp;
    const newXP = currentXP + xpToAward;

    // ── 4. Actualizar XP en el perfil ──
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ nivel_xp: newXP })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error actualizando XP:", updateError);
      return Response.json(
        { error: "Error al actualizar XP." },
        { status: 500 }
      );
    }

    // ── 5. Verificar level up ──
    const { leveledUp, newLevel } = checkLevelUp(currentXP, newXP);

    // ── 6. Log opcional del evento (fire-and-forget) ──
    if (metadata) {
      console.log(`XP awarded: ${user.id} +${xpToAward} (${eventType})`, metadata);
    }

    return Response.json({
      newXP,
      xpAwarded: xpToAward,
      eventLabel: XP_EVENTS[eventType].label,
      levelUp: leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    });
  } catch (error) {
    console.error("Error en /api/xp:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
