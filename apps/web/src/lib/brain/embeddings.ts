// ============================================================
// ITSEIA Academy — OpenAI Embeddings Helper
// Feature: segundo-cerebro-mvp
//
// Genera embeddings de texto usando OpenAI text-embedding-3-small
// Dimensiones: 1536 | Costo: ~$0.02 / 1M tokens
// ============================================================

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-small";
const MAX_TOKENS = 8191; // Limite del modelo

/**
 * Genera un embedding vector para un texto dado.
 * Trunca automaticamente si excede el limite de tokens.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error("El texto no puede estar vacio");
  }

  // Truncar texto muy largo (aprox 4 chars = 1 token)
  const maxChars = MAX_TOKENS * 4;
  const truncated = text.length > maxChars ? text.slice(0, maxChars) : text;

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: truncated,
  });

  return response.data[0].embedding;
}

/**
 * Genera embeddings para multiples textos en batch.
 * Mas eficiente que llamar generateEmbedding() en loop.
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const maxChars = MAX_TOKENS * 4;
  const truncated = texts.map((t) =>
    t.length > maxChars ? t.slice(0, maxChars) : t
  );

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: truncated,
  });

  return response.data.map((d) => d.embedding);
}
