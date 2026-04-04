// ============================================================
// ITSEIA Academy — pgvector Similarity Search
// Feature: segundo-cerebro-mvp
//
// Busqueda semantica usando pgvector en Supabase.
// Utiliza cosine similarity para encontrar notas relevantes.
// ============================================================

import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateEmbedding } from "./embeddings";
import type { SemanticSearchResult } from "@/types/brain";

/**
 * Busca notas semanticamente similares a una query de texto.
 * Usa OpenAI para vectorizar la query y pgvector para buscar.
 */
export async function searchNotes(
  query: string,
  userId: string,
  options?: {
    threshold?: number;
    limit?: number;
  }
): Promise<SemanticSearchResult[]> {
  const threshold = options?.threshold ?? 0.5;
  const limit = options?.limit ?? 20;

  // Vectorizar la query
  const queryEmbedding = await generateEmbedding(query);

  // Buscar en brain_notes via la funcion SQL
  const { data, error } = await supabaseAdmin.rpc("match_brain_notes", {
    query_embedding: JSON.stringify(queryEmbedding),
    match_user_id: userId,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    console.error("[Brain] Error buscando notas:", error);
    throw new Error("Error en busqueda semantica de notas");
  }

  return (data || []) as SemanticSearchResult[];
}

/**
 * Busca fuentes semanticamente similares a una query de texto.
 */
export async function searchSources(
  query: string,
  userId: string,
  options?: {
    threshold?: number;
    limit?: number;
  }
): Promise<SemanticSearchResult[]> {
  const threshold = options?.threshold ?? 0.5;
  const limit = options?.limit ?? 10;

  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabaseAdmin.rpc("match_brain_sources", {
    query_embedding: JSON.stringify(queryEmbedding),
    match_user_id: userId,
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    console.error("[Brain] Error buscando fuentes:", error);
    throw new Error("Error en busqueda semantica de fuentes");
  }

  return (data || []).map((d: Record<string, unknown>) => ({
    ...d,
    source_type: d.source_type as string,
  })) as SemanticSearchResult[];
}

/**
 * Busca en notas Y fuentes combinadas, ordenadas por relevancia.
 */
export async function searchAll(
  query: string,
  userId: string,
  options?: {
    threshold?: number;
    limit?: number;
  }
): Promise<SemanticSearchResult[]> {
  const [notes, sources] = await Promise.all([
    searchNotes(query, userId, options),
    searchSources(query, userId, options),
  ]);

  // Combinar y ordenar por similarity descendente
  const combined = [...notes, ...sources];
  combined.sort((a, b) => b.similarity - a.similarity);

  return combined.slice(0, options?.limit ?? 20);
}

/**
 * Obtiene las top-N notas mas relevantes para un embedding dado.
 * Usado internamente por el delta engine.
 */
export async function getRelevantNotesForEmbedding(
  embedding: number[],
  userId: string,
  limit: number = 20
): Promise<SemanticSearchResult[]> {
  const { data, error } = await supabaseAdmin.rpc("match_brain_notes", {
    query_embedding: JSON.stringify(embedding),
    match_user_id: userId,
    match_threshold: 0.4,
    match_count: limit,
  });

  if (error) {
    console.error("[Brain] Error obteniendo notas relevantes:", error);
    return [];
  }

  return (data || []) as SemanticSearchResult[];
}
