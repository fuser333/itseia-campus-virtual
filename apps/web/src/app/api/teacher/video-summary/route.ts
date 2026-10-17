import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STAFF_ROLES = ["super_admin", "admin", "coordinacion", "docente"];
const WRITE_ROLES = ["super_admin", "admin", "coordinacion"];

const KIMI_API_KEY = process.env.KIMI_API_KEY || "";
const KIMI_URL = "https://api.moonshot.ai/v1/chat/completions";
const KIMI_MODEL = "moonshot-v1-32k" as const;

const SYSTEM_PROMPT = `Eres un asistente pedagógico que ayuda a docentes a preparar sus clases en ITSEIA (Instituto Ecuatoriano de Inteligencia Artificial). Recibirás la transcripción de un video de una sesión del preuniversitario. Devuelve un resumen para el docente en formato Markdown con esta estructura exacta:

## Resumen ejecutivo
3 frases que capturan la idea central del video.

## 5-7 hitos clave (con timestamp aproximado)
Lista con bullets, cada uno con \`[mm:ss]\` al inicio. Solo los momentos donde el video introduce un concepto, una demo, o un cambio de tema importante.

## Conceptos que el docente debe dominar antes de la clase
Lista de 3-5 bullets concretos.

## Preguntas que probablemente harán los alumnos
3 preguntas reales y específicas (no genéricas).

Tono: directo, profesional, en español ecuatoriano neutro. Sin saludos ni cierre.`;

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function fetchYoutubeTranscript(videoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://video.google.com/timedtext?lang=es&v=${videoId}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const xml = await res.text();
      if (xml && xml.length > 50) {
        return xml
          .replace(/<[^>]+>/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, " ")
          .trim();
      }
    }
    const resEn = await fetch(
      `https://video.google.com/timedtext?lang=en&v=${videoId}`,
      { cache: "no-store" }
    );
    if (resEn.ok) {
      const xml = await resEn.text();
      if (xml && xml.length > 50) {
        return xml
          .replace(/<[^>]+>/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, " ")
          .trim();
      }
    }
  } catch {
    return null;
  }
  return null;
}

async function callKimi(transcriptOrUrl: string, isTranscript: boolean): Promise<string> {
  const userMsg = isTranscript
    ? `Transcripción del video:\n\n${transcriptOrUrl.slice(0, 24000)}`
    : `No tengo transcripción disponible. Genera el resumen mejor posible asumiendo que el video es de una sesión del preuniversitario IGNITE de ITSEIA cuyo URL es: ${transcriptOrUrl}. Indica claramente al docente en el resumen ejecutivo que NO se pudo extraer la transcripción y que debería verificar el contenido en el video original.`;

  const res = await fetch(KIMI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KIMI_API_KEY}`,
    },
    body: JSON.stringify({
      model: KIMI_MODEL,
      temperature: 0.3,
      max_tokens: 2048,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Kimi API error ${res.status}: ${errBody.slice(0, 300)}`);
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Kimi devolvió respuesta vacía");
  }
  return content.trim();
}

export async function POST(req: NextRequest) {
  if (!KIMI_API_KEY) {
    return NextResponse.json(
      { error: "KIMI_API_KEY no configurada en el servidor" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile?.role || !STAFF_ROLES.includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const sessionId = String(body.sessionId ?? "");
  const force = Boolean(body.force);
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  if (!force) {
    const { data: cached } = await supabase
      .from("video_summaries")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();
    if (cached) return NextResponse.json({ summary: cached, cached: true });
  }

  if (!WRITE_ROLES.includes(profile.role)) {
    return NextResponse.json(
      { error: "Solo coordinacion/admin pueden generar nuevos resumenes" },
      { status: 403 }
    );
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("id, video_url")
    .eq("id", sessionId)
    .single();
  if (!session?.video_url) {
    return NextResponse.json(
      { error: "La sesion no tiene video_url" },
      { status: 400 }
    );
  }

  const videoId = extractVideoId(session.video_url);
  let transcript: string | null = null;
  if (videoId) transcript = await fetchYoutubeTranscript(videoId);

  const resumen_md = transcript
    ? await callKimi(transcript, true)
    : await callKimi(session.video_url, false);

  const { data: saved, error } = await supabase
    .from("video_summaries")
    .upsert(
      {
        session_id: sessionId,
        video_url: session.video_url,
        resumen_md,
        timestamps: [],
        modelo: KIMI_MODEL,
        generado_at: new Date().toISOString(),
      },
      { onConflict: "session_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ summary: saved, cached: false, hadTranscript: Boolean(transcript) });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile?.role || !STAFF_ROLES.includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("video_summaries")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ summary: data ?? null });
}
