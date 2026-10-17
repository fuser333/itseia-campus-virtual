// ============================================================
// ITSEIA Academy — API: Code Snippets
// GET  /api/ai-lab/snippets?session_id=UUID
// POST /api/ai-lab/snippets { sessionId, language, code, output, title }
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

export async function GET(request: Request) {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  let query = supabaseAdmin
    .from("code_snippets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;
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

  const { sessionId, language, code, output, title } = await request.json() as {
    sessionId?: string;
    language: string;
    code: string;
    output?: string;
    title?: string;
  };

  if (!code || !language) {
    return Response.json(
      { error: "code y language requeridos" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("code_snippets")
    .insert({
      user_id: user.id,
      session_id: sessionId ?? null,
      language,
      code,
      output: output ?? null,
      title: title ?? code.slice(0, 50),
    })
    .select("id")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ id: (data as { id: string }).id });
}
