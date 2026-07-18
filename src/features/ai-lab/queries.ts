// ============================================================
// ITSEIA Academy — AI Lab Avanzado: Queries (client-side)
// Feature: 010-ai-lab-advanced
// Usa el cliente Supabase del browser (no bypassa RLS)
// ============================================================

import { createClient } from "@/lib/supabase/client";
import type {
  AIConversation,
  AIConversationWithSession,
  Flashcard,
  FlashcardDeck,
  CodeSnippet,
} from "@/types/database";
import { CONVERSATIONS_PAGE_SIZE } from "./constants";

// ──────────────────────────────────────────────
// Conversations
// ──────────────────────────────────────────────

/**
 * Retorna las conversaciones del usuario paginadas (20/pagina).
 * Si se pasa sessionId, filtra solo las de esa sesion.
 */
export async function getConversations(
  sessionId?: string | null,
  page = 0
): Promise<AIConversationWithSession[]> {
  const supabase = createClient();
  const from = page * CONVERSATIONS_PAGE_SIZE;
  const to = from + CONVERSATIONS_PAGE_SIZE - 1;

  let query = supabase
    .from("ai_conversations")
    .select(
      `
      *,
      sessions:session_id (
        id, number, title
      )
    `
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getConversations error:", error);
    return [];
  }
  return (data ?? []) as AIConversationWithSession[];
}

/**
 * Retorna la ultima conversacion de una sesion especifica.
 * Si sessionId es null, retorna la ultima conversacion global.
 */
export async function getLastConversation(
  sessionId?: string | null
): Promise<AIConversation | null> {
  const supabase = createClient();

  let query = supabase
    .from("ai_conversations")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) return null;
  return data[0] as AIConversation;
}

// ──────────────────────────────────────────────
// Flashcards
// ──────────────────────────────────────────────

/**
 * Retorna las flashcards del usuario.
 * Si se pasa sessionId, filtra solo las de esa sesion.
 */
export async function getFlashcards(
  sessionId?: string | null
): Promise<Flashcard[]> {
  const supabase = createClient();

  let query = supabase
    .from("flashcards")
    .select("*")
    .order("created_at", { ascending: false });

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getFlashcards error:", error);
    return [];
  }
  return (data ?? []) as Flashcard[];
}

/**
 * Retorna todos los mazos del usuario ordenados por fecha.
 */
export async function getFlashcardDecks(): Promise<FlashcardDeck[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("flashcard_decks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFlashcardDecks error:", error);
    return [];
  }
  return (data ?? []) as FlashcardDeck[];
}

// ──────────────────────────────────────────────
// Code Snippets
// ──────────────────────────────────────────────

/**
 * Retorna los snippets de codigo del usuario.
 * Si se pasa sessionId, filtra solo los de esa sesion.
 */
export async function getSnippets(
  sessionId?: string | null
): Promise<CodeSnippet[]> {
  const supabase = createClient();

  let query = supabase
    .from("code_snippets")
    .select("*")
    .order("created_at", { ascending: false });

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getSnippets error:", error);
    return [];
  }
  return (data ?? []) as CodeSnippet[];
}
