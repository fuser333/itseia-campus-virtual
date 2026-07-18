"use server";

// ============================================================
// ITSEIA Academy — AI Lab Avanzado: Server Actions
// Feature: 010-ai-lab-advanced
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AIConversationMessage, FlashcardLocal } from "@/types/database";

// ──────────────────────────────────────────────
// saveConversation
// UPSERT: si ya hay una conversacion abierta para esa sesion
// y el mismo usuario, actualiza messages. Si no, crea una nueva.
// ──────────────────────────────────────────────

export async function saveConversation(
  messages: AIConversationMessage[],
  options: {
    conversationId?: string | null;
    sessionId?: string | null;
    model?: string;
    esComparacion?: boolean;
    title?: string;
  } = {}
): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const {
    conversationId,
    sessionId,
    model = "gemini-2.0-flash",
    esComparacion = false,
    title,
  } = options;

  if (conversationId) {
    // Actualizar conversacion existente
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
      console.error("saveConversation update error:", error);
      return null;
    }
    return { id: conversationId };
  }

  // Crear nueva conversacion
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
    console.error("saveConversation insert error:", error);
    return null;
  }
  return data as { id: string };
}

// ──────────────────────────────────────────────
// toggleFavorite
// ──────────────────────────────────────────────

export async function toggleFavorite(
  conversationId: string,
  mensajeIndex: number
): Promise<{ added: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { added: false };

  // Check si ya existe
  const { data: existing } = await supabaseAdmin
    .from("ai_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("conversation_id", conversationId)
    .eq("mensaje_index", mensajeIndex)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from("ai_favorites")
      .delete()
      .eq("id", existing.id);
    return { added: false };
  }

  await supabaseAdmin.from("ai_favorites").insert({
    user_id: user.id,
    conversation_id: conversationId,
    mensaje_index: mensajeIndex,
  });
  return { added: true };
}

// ──────────────────────────────────────────────
// saveSnippet
// ──────────────────────────────────────────────

export async function saveSnippet(
  sessionId: string | null,
  language: "python" | "javascript",
  code: string,
  output: string,
  title?: string
): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabaseAdmin
    .from("code_snippets")
    .insert({
      user_id: user.id,
      session_id: sessionId,
      language,
      code,
      output,
      title: title ?? code.slice(0, 50),
    })
    .select("id")
    .single();

  if (error) {
    console.error("saveSnippet error:", error);
    return null;
  }
  return data as { id: string };
}

// ──────────────────────────────────────────────
// saveFlashcards
// Inserta las flashcards y crea un flashcard_deck
// ──────────────────────────────────────────────

export async function saveFlashcards(
  sessionId: string | null,
  cards: FlashcardLocal[],
  deckName?: string
): Promise<{ deckId: string; flashcardIds: string[] } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  if (cards.length === 0) return null;

  // Insertar flashcards
  const { data: insertedCards, error: cardsError } = await supabaseAdmin
    .from("flashcards")
    .insert(
      cards.map((c) => ({
        user_id: user.id,
        session_id: sessionId,
        frente: c.frente,
        dorso: c.dorso,
        editada: c.editada ?? false,
        deck_name: deckName ?? null,
      }))
    )
    .select("id");

  if (cardsError || !insertedCards) {
    console.error("saveFlashcards insert error:", cardsError);
    return null;
  }

  const flashcardIds = insertedCards.map((c: { id: string }) => c.id);

  // Crear deck
  const { data: deck, error: deckError } = await supabaseAdmin
    .from("flashcard_decks")
    .insert({
      user_id: user.id,
      session_id: sessionId,
      flashcard_ids: flashcardIds,
      deck_name: deckName ?? null,
    })
    .select("id")
    .single();

  if (deckError || !deck) {
    console.error("saveFlashcards deck error:", deckError);
    return null;
  }

  return { deckId: (deck as { id: string }).id, flashcardIds };
}

// ──────────────────────────────────────────────
// updateDeckCompletion
// ──────────────────────────────────────────────

export async function updateDeckCompletion(
  deckId: string,
  cardsRevisadas: number
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabaseAdmin
    .from("flashcard_decks")
    .update({
      completed_at: new Date().toISOString(),
      cards_revisadas: cardsRevisadas,
    })
    .eq("id", deckId)
    .eq("user_id", user.id);
}
