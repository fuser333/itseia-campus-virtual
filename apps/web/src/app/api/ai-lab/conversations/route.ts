// ============================================================
// ITSEIA Academy — API: AI Lab Conversations
// GET  /api/ai-lab/conversations?page=N&session_id=UUID
// POST /api/ai-lab/conversations  { messages, sessionId, model, ... }
// DELETE /api/ai-lab/conversations?id=UUID
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { CONVERSATIONS_PAGE_SIZE } from "@/features/ai-lab/constants";
import type { AIConversationMessage } from "@/types/database";

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
            // Ignorar en Server Components
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

export async function GET(request: Request) {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
  const sessionId = searchParams.get("session_id");
  const from = page * CONVERSATIONS_PAGE_SIZE;
  const to = from + CONVERSATIONS_PAGE_SIZE - 1;

  let query = supabaseAdmin
    .from("ai_conversations")
    .select(
      `
      *,
      sessions:session_id (
        id, number, title
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data, page, has_more: (data?.length ?? 0) === CONVERSATIONS_PAGE_SIZE });
}

export async function POST(request: Request) {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json() as {
    messages: AIConversationMessage[];
    conversationId?: string;
    sessionId?: string;
    model?: string;
    esComparacion?: boolean;
    title?: string;
  };

  const {
    messages,
    conversationId,
    sessionId,
    model = "gemini-2.0-flash",
    esComparacion = false,
    title,
  } = body;

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: "messages requerido" }, { status: 400 });
  }

  if (conversationId) {
    // Actualizar existente
    const { error } = await supabaseAdmin
      .from("ai_conversations")
      .update({
        messages,
        updated_at: new Date().toISOString(),
        ...(title ? { title } : {}),
      })
      .eq("id", conversationId)
      .eq("user_id", user.id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ id: conversationId });
  }

  // Crear nueva
  const { data, error } = await supabaseAdmin
    .from("ai_conversations")
    .insert({
      user_id: user.id,
      session_id: sessionId ?? null,
      model,
      messages,
      es_comparacion: esComparacion,
      title:
        title ??
        (messages.length > 0
          ? messages[0].content.slice(0, 60)
          : "Nueva conversacion"),
    })
    .select("id")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ id: (data as { id: string }).id });
}

export async function DELETE(request: Request) {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id requerido" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("ai_conversations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
