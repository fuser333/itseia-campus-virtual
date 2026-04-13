// ============================================================
// ITSEIA Academy — YouTube Transcript Ingestion
// Feature: segundo-cerebro-mvp
//
// Obtiene transcripciones de videos YouTube usando
// youtube-transcript (npm). No requiere API key.
// ============================================================

import { YoutubeTranscript } from "youtube-transcript";

interface YoutubeResult {
  text: string;
  title: string;
  videoId: string;
  url: string;
  duration?: string;
}

/**
 * Extrae la transcripcion de un video de YouTube.
 * Acepta URLs completas o video IDs.
 */
export async function extractYoutubeTranscript(
  urlOrId: string
): Promise<YoutubeResult> {
  // Extraer video ID de la URL
  const videoId = extractVideoId(urlOrId);
  if (!videoId) {
    throw new Error("No se pudo extraer el ID del video de YouTube");
  }

  try {
    // Intentar obtener transcripcion en espanol primero, luego ingles
    let transcript;
    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: "es",
      });
    } catch {
      // Fallback a ingles u otro idioma disponible
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    }

    if (!transcript || transcript.length === 0) {
      throw new Error("El video no tiene subtitulos disponibles");
    }

    // Combinar segmentos de transcripcion en texto continuo
    const text = transcript
      .map((segment: { text: string }) => segment.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    // Calcular duracion aproximada del video
    const lastSegment = transcript[transcript.length - 1] as {
      offset: number;
      duration?: number;
    };
    const totalSeconds = Math.ceil(
      (lastSegment.offset + (lastSegment.duration || 0)) / 1000
    );
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Intentar obtener titulo del video via oembed (gratis, sin API key)
    let title = `Video YouTube (${videoId})`;
    try {
      const oembedResp = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (oembedResp.ok) {
        const oembedData = (await oembedResp.json()) as { title?: string };
        if (oembedData.title) {
          title = oembedData.title;
        }
      }
    } catch {
      // No pasa nada si no podemos obtener el titulo
    }

    return {
      text,
      title,
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      duration,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("subtitulos")) {
      throw error;
    }
    throw new Error(
      `No se pudo obtener la transcripcion del video. Verifica que el video tiene subtitulos habilitados.`
    );
  }
}

/**
 * Extrae el video ID de diferentes formatos de URL de YouTube.
 */
function extractVideoId(urlOrId: string): string | null {
  // Si ya es un ID simple (11 caracteres alfanumericos)
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }

  // Patrones de URL de YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match) return match[1];
  }

  return null;
}
