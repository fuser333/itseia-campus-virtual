// ============================================================
// ITSEIA Academy — API: AI Lab Favorites
// GET  /api/ai-lab/favorites
// POST /api/ai-lab/favorites  { conversationId, mensajeIndex }
// DELETE /api/ai-lab/favorites?conversation_id=UUID&mensaje_index=N
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function getAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
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
            // Ignorar
          }
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("ai_favorites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data });
}

export async function POST(request: Request) {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { conversationId, mensajeIndex } = await request.json() as {
    conversationId: string;
    mensajeIndex: number;
  };

  if (!conversationId || mensajeIndex === undefined) {
    return Response.json(
      { error: "conversationId y mensajeIndex requeridos" },
      { status: 400 }
    );
  }

  // Check si ya existe para hacer toggle
  const { data: existing } = await supabaseAdmin
    .from("ai_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("conversation_id", conversationId)
    .eq("mensaje_index", mensajeIndex)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin.from("ai_favorites").delete().eq("id", existing.id);
    return Response.json({ added: false });
  }

  const { error } = await supabaseAdmin.from("ai_favorites").insert({
    user_id: user.id,
    conversation_id: conversationId,
    mensaje_index: mensajeIndex,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ added: true });
}
