// ============================================================
// ITSEIA Academy — POST /api/brain/ingest
// Feature: segundo-cerebro-mvp
//
// Ingesta de fuentes externas: PDF, URL, YouTube.
// Extrae texto, vectoriza, y guarda en brain_sources.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/brain/embeddings";
import { extractTextFromPdf } from "@/lib/brain/ingestPdf";
import { extractTextFromUrl } from "@/lib/brain/ingestUrl";
import { extractYoutubeTranscript } from "@/lib/brain/ingestYoutube";

/** POST: Ingesta una fuente nueva (PDF via FormData, URL, YouTube) */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";

  // PDF: viene como FormData con campo "file"
  if (contentType.includes("multipart/form-data")) {
    return handlePdfIngest(request, user.id);
  }

  // URL o YouTube: viene como JSON
  const body = (await request.json()) as {
    type?: string;
    url?: string;
    text?: string;
    title?: string;
  };

  if (body.type === "youtube" && body.url) {
    return handleYoutubeIngest(body.url, user.id);
  }

  if (body.type === "url" && body.url) {
    return handleUrlIngest(body.url, user.id);
  }

  if (body.type === "text" && body.text) {
    return handleTextIngest(body.text, body.title || "Nota de texto", user.id);
  }

  return Response.json(
    { error: "Tipo de fuente no soportado. Usa: pdf, url, youtube, text" },
    { status: 400 }
  );
}

async function handlePdfIngest(request: Request, userId: string) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { error: "Archivo PDF requerido" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: "El PDF excede el limite de 10MB" },
        { status: 400 }
      );
    }

    // Extraer texto del PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfResult = await extractTextFromPdf(buffer);

    if (!pdfResult.text || pdfResult.text.length < 20) {
      return Response.json(
        { error: "No se pudo extraer texto del PDF. Asegurate de que no sea un PDF escaneado." },
        { status: 400 }
      );
    }

    // Generar embedding
    let embedding: number[] | null = null;
    try {
      embedding = await generateEmbedding(pdfResult.text);
    } catch (err) {
      console.error("[Brain Ingest] Error generando embedding PDF:", err);
    }

    // Guardar en brain_sources
    const insertData: Record<string, unknown> = {
      user_id: userId,
      source_type: "pdf",
      title: pdfResult.title,
      content: pdfResult.text,
      metadata: {
        pages: pdfResult.numPages,
        filename: file.name,
        size: file.size,
      },
    };
    if (embedding) insertData.embedding = JSON.stringify(embedding);

    const { data, error } = await supabaseAdmin
      .from("brain_sources")
      .insert(insertData)
      .select("id, title, source_type, metadata, created_at")
      .single();

    if (error) {
      console.error("[Brain Ingest] Error guardando PDF:", error);
      return Response.json(
        { error: "Error guardando la fuente" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        source: data,
        extracted: {
          chars: pdfResult.text.length,
          pages: pdfResult.numPages,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Brain Ingest] Error procesando PDF:", err);
    return Response.json(
      { error: "Error procesando el PDF" },
      { status: 500 }
    );
  }
}

async function handleYoutubeIngest(url: string, userId: string) {
  try {
    const ytResult = await extractYoutubeTranscript(url);

    // Generar embedding
    let embedding: number[] | null = null;
    try {
      embedding = await generateEmbedding(ytResult.text);
    } catch (err) {
      console.error("[Brain Ingest] Error generando embedding YT:", err);
    }

    const insertData: Record<string, unknown> = {
      user_id: userId,
      source_type: "youtube",
      title: ytResult.title,
      url: ytResult.url,
      content: ytResult.text,
      metadata: {
        video_id: ytResult.videoId,
        duration: ytResult.duration,
      },
    };
    if (embedding) insertData.embedding = JSON.stringify(embedding);

    const { data, error } = await supabaseAdmin
      .from("brain_sources")
      .insert(insertData)
      .select("id, title, source_type, url, metadata, created_at")
      .single();

    if (error) {
      console.error("[Brain Ingest] Error guardando YouTube:", error);
      return Response.json(
        { error: "Error guardando la fuente" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        source: data,
        extracted: {
          chars: ytResult.text.length,
          duration: ytResult.duration,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Error procesando video de YouTube";
    return Response.json({ error: msg }, { status: 400 });
  }
}

async function handleUrlIngest(url: string, userId: string) {
  try {
    const urlResult = await extractTextFromUrl(url);

    // Generar embedding
    let embedding: number[] | null = null;
    try {
      embedding = await generateEmbedding(urlResult.text);
    } catch (err) {
      console.error("[Brain Ingest] Error generando embedding URL:", err);
    }

    const insertData: Record<string, unknown> = {
      user_id: userId,
      source_type: "url",
      title: urlResult.title,
      url: urlResult.url,
      content: urlResult.text,
      metadata: {
        chars: urlResult.text.length,
      },
    };
    if (embedding) insertData.embedding = JSON.stringify(embedding);

    const { data, error } = await supabaseAdmin
      .from("brain_sources")
      .insert(insertData)
      .select("id, title, source_type, url, metadata, created_at")
      .single();

    if (error) {
      console.error("[Brain Ingest] Error guardando URL:", error);
      return Response.json(
        { error: "Error guardando la fuente" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        source: data,
        extracted: { chars: urlResult.text.length },
      },
      { status: 201 }
    );
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Error procesando la URL";
    return Response.json({ error: msg }, { status: 400 });
  }
}

async function handleTextIngest(
  text: string,
  title: string,
  userId: string
) {
  try {
    let embedding: number[] | null = null;
    try {
      embedding = await generateEmbedding(text);
    } catch (err) {
      console.error("[Brain Ingest] Error generando embedding texto:", err);
    }

    const insertData: Record<string, unknown> = {
      user_id: userId,
      source_type: "text",
      title,
      content: text,
      metadata: { chars: text.length },
    };
    if (embedding) insertData.embedding = JSON.stringify(embedding);

    const { data, error } = await supabaseAdmin
      .from("brain_sources")
      .insert(insertData)
      .select("id, title, source_type, metadata, created_at")
      .single();

    if (error) {
      console.error("[Brain Ingest] Error guardando texto:", error);
      return Response.json(
        { error: "Error guardando la fuente" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        source: data,
        extracted: { chars: text.length },
      },
      { status: 201 }
    );
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Error procesando el texto";
    return Response.json({ error: msg }, { status: 500 });
  }
}
