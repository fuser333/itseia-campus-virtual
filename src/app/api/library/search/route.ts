// ============================================================
// ITSEIA Academy — Biblioteca Virtual: Search API
// Feature: 004-virtual-library
// GET /api/library/search?q=QUERY&page=1
// Busca en OpenAlex + arXiv + Scielo en paralelo con Promise.allSettled
// Registra la busqueda en library_searches para auditoria SENESCYT
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { searchOpenAlex } from "@/features/library/openalex";
import { searchArXiv } from "@/features/library/arxiv";
import { searchScielo } from "@/features/library/scielo";
import { mergeResults } from "@/features/library/merge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return Response.json(
        { error: "El parametro 'q' es requerido y debe tener al menos 2 caracteres." },
        { status: 400 }
      );
    }

    // ── Autenticacion (opcional — busqueda es publica pero registramos user) ──
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();

    // ── Llamar las 3 fuentes en paralelo con timeout individual de 2.5s ──
    const [openAlexResult, arxivResult, scieloResult] = await Promise.allSettled([
      searchOpenAlex(query, 15),
      searchArXiv(query, 8),
      searchScielo(query, 8),
    ]);

    const openalexPapers =
      openAlexResult.status === "fulfilled" ? openAlexResult.value : [];
    const arxivPapers =
      arxivResult.status === "fulfilled" ? arxivResult.value : [];
    const scieloPapers =
      scieloResult.status === "fulfilled" ? scieloResult.value : [];

    // ── Detectar que fuentes respondieron exitosamente ──
    const sourcesUsed: string[] = [];
    if (openAlexResult.status === "fulfilled" && openalexPapers.length > 0)
      sourcesUsed.push("openalex");
    if (arxivResult.status === "fulfilled" && arxivPapers.length > 0)
      sourcesUsed.push("arxiv");
    if (scieloResult.status === "fulfilled" && scieloPapers.length > 0)
      sourcesUsed.push("scielo");

    // ── Detectar fuentes que fallaron ──
    const failedSources: string[] = [];
    if (openAlexResult.status === "rejected") failedSources.push("openalex");
    if (arxivResult.status === "rejected") failedSources.push("arxiv");
    if (scieloResult.status === "rejected") failedSources.push("scielo");

    // ── Merge y deduplicacion ──
    const merged = mergeResults(openalexPapers, arxivPapers, scieloPapers);

    // ── Registrar busqueda en library_searches (auditoria SENESCYT) ──
    // Fire-and-forget — no bloquear la respuesta
    void supabaseAdmin
      .from("library_searches")
      .insert({
        user_id: user?.id || null,
        query,
        sources_used: sourcesUsed,
        result_count: merged.length,
        subject_id: null,
      }); // ignorar resultado silenciosamente

    // ── Respuesta ──
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (failedSources.length > 0) {
      headers["X-Library-Failed-Sources"] = failedSources.join(",");
    }

    return Response.json(
      {
        results: merged,
        total: merged.length,
        sources_used: sourcesUsed,
        failed_sources: failedSources,
        query,
      },
      { headers }
    );
  } catch (error) {
    console.error("Error en /api/library/search:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
