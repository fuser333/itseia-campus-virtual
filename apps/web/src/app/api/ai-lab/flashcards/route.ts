// ============================================================
// ITSEIA Academy — API: Flashcards (mazos guardados)
// GET  /api/ai-lab/flashcards?session_id=UUID
// POST /api/ai-lab/flashcards { sessionId, cards, deckName }
// PATCH /api/ai-lab/flashcards { deckId, cardsRevisadas }
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { FlashcardLocal } from "@/types/database";

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

  // Retornar flashcards y decks del usuario
  let flashcardsQuery = supabaseAdmin
    .from("flashcards")
    .select(`
      *,
      sessions:session_id (id, number, title)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (sessionId) {
    flashcardsQuery = flashcardsQuery.eq("session_id", sessionId);
  }

  const decksQuery = supabaseAdmin
    .from("flashcard_decks")
    .select(`
      *,
      sessions:session_id (id, number, title)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const [{ data: flashcards, error: fcError }, { data: decks, error: deckError }] =
    await Promise.all([flashcardsQuery, decksQuery]);

  if (fcError || deckError) {
    return Response.json(
      { error: (fcError || deckError)?.message },
      { status: 500 }
    );
  }

  return Response.json({ flashcards, decks });
}

export async function POST(request: Request) {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { sessionId, cards, deckName } = await request.json() as {
    sessionId?: string;
    cards: FlashcardLocal[];
    deckName?: string;
  };

  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return Response.json({ error: "cards requerido" }, { status: 400 });
  }

  // Insertar flashcards
  const { data: insertedCards, error: cardsError } = await supabaseAdmin
    .from("flashcards")
    .insert(
      cards.map((c) => ({
        user_id: user.id,
        session_id: sessionId ?? null,
        frente: c.frente,
        dorso: c.dorso,
        editada: c.editada ?? false,
        deck_name: deckName ?? null,
      }))
    )
    .select("id");

  if (cardsError || !insertedCards) {
    return Response.json({ error: cardsError?.message }, { status: 500 });
  }

  const flashcardIds = (insertedCards as Array<{ id: string }>).map((c) => c.id);

  // Crear deck
  const { data: deck, error: deckError } = await supabaseAdmin
    .from("flashcard_decks")
    .insert({
      user_id: user.id,
      session_id: sessionId ?? null,
      flashcard_ids: flashcardIds,
      deck_name: deckName ?? null,
    })
    .select("id")
    .single();

  if (deckError || !deck) {
    return Response.json({ error: deckError?.message }, { status: 500 });
  }

  return Response.json({
    deckId: (deck as { id: string }).id,
    flashcardIds,
  });
}

export async function PATCH(request: Request) {
  const user = await getAuth();
  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { deckId, cardsRevisadas } = await request.json() as {
    deckId: string;
    cardsRevisadas: number;
  };

  if (!deckId) {
    return Response.json({ error: "deckId requerido" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("flashcard_decks")
    .update({
      completed_at: new Date().toISOString(),
      cards_revisadas: cardsRevisadas ?? 0,
    })
    .eq("id", deckId)
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
