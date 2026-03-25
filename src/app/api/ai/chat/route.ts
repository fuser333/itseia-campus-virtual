// ============================================================
// ITSEIA Academy — AI Chat API Route (POST)
// Proxy seguro: Auth + Quota + Multi-Model Gemini + Streaming
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  buildGeminiRequest,
  buildContextualPrompt,
} from "@/lib/ai/gemini";
import {
  isValidModel,
  getGeminiStreamUrl,
  estimateModelCost,
  DEFAULT_MODEL,
  type AIModelId,
} from "@/lib/ai/models";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_MONTHLY_REQUESTS = 500;

// Admin client for quota checks and logging (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
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
            // Se ignora en Server Components
          }
        },
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    // ── 1. Validar API Key configurada ──
    if (!GEMINI_API_KEY) {
      return Response.json(
        { error: "Servicio de IA no configurado. Contacta al administrador." },
        { status: 500 }
      );
    }

    // ── 2. Autenticar usuario ──
    const supabase = await getSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion para usar el AI Lab." },
        { status: 401 }
      );
    }

    // ── 3. Parsear body ──
    const body = await request.json();
    const { message, history, context, model: requestedModel } = body as {
      message: string;
      history: Array<{ role: string; content: string }>;
      context?: string;
      model?: string;
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json(
        { error: "El mensaje no puede estar vacio." },
        { status: 400 }
      );
    }

    if (message.length > 10000) {
      return Response.json(
        { error: "El mensaje es demasiado largo. Maximo 10,000 caracteres." },
        { status: 400 }
      );
    }

    // ── 4. Validar y resolver modelo ──
    let selectedModel: AIModelId = DEFAULT_MODEL;
    if (requestedModel && typeof requestedModel === "string") {
      if (isValidModel(requestedModel)) {
        selectedModel = requestedModel;
      } else {
        return Response.json(
          { error: `Modelo "${requestedModel}" no disponible. Usa uno de los modelos soportados.` },
          { status: 400 }
        );
      }
    }

    // ── 5. Verificar cuota mensual ──
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count: monthlyUsage, error: quotaError } = await supabaseAdmin
      .from("ai_usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", firstDayOfMonth);

    if (quotaError) {
      console.error("Error verificando cuota:", quotaError);
      return Response.json(
        { error: "Error verificando tu cuota. Intenta de nuevo." },
        { status: 500 }
      );
    }

    const currentUsage = monthlyUsage ?? 0;
    if (currentUsage >= MAX_MONTHLY_REQUESTS) {
      return Response.json(
        {
          error: `Has alcanzado tu limite de ${MAX_MONTHLY_REQUESTS} consultas este mes. Se reinicia el proximo mes.`,
          usage: { used: currentUsage, limit: MAX_MONTHLY_REQUESTS },
        },
        { status: 429 }
      );
    }

    // ── 6. Construir peticion a Gemini ──
    const systemPrompt = buildContextualPrompt(context);
    const geminiBody = buildGeminiRequest(
      message.trim(),
      Array.isArray(history) ? history : [],
      systemPrompt
    );

    // ── 7. Llamar Gemini con streaming (modelo seleccionado) ──
    const geminiUrl = getGeminiStreamUrl(selectedModel, GEMINI_API_KEY);

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Error de Gemini (${selectedModel}):`, geminiResponse.status, errorText);
      return Response.json(
        { error: "El servicio de IA no esta disponible. Intenta en unos minutos." },
        { status: 502 }
      );
    }

    // ── 8. Stream de respuesta al cliente ──
    const userId = user.id;
    let fullResponse = "";
    let totalTokensIn = 0;
    let totalTokensOut = 0;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = geminiResponse.body?.getReader();
          if (!reader) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: "No se pudo leer la respuesta de IA." })}\n\n`
              )
            );
            controller.close();
            return;
          }

          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Procesar lineas SSE del buffer
            const lines = buffer.split("\n");
            // Mantener la ultima linea incompleta en el buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === "data: [DONE]") continue;

              if (trimmed.startsWith("data: ")) {
                try {
                  const jsonStr = trimmed.slice(6);
                  const data = JSON.parse(jsonStr);

                  // Extraer texto del chunk
                  const candidate = data.candidates?.[0];
                  const textPart = candidate?.content?.parts?.[0]?.text;

                  if (textPart) {
                    fullResponse += textPart;
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ text: textPart })}\n\n`
                      )
                    );
                  }

                  // Extraer tokens de uso (viene en el ultimo chunk)
                  if (data.usageMetadata) {
                    totalTokensIn = data.usageMetadata.promptTokenCount || 0;
                    totalTokensOut = data.usageMetadata.candidatesTokenCount || 0;
                  }
                } catch {
                  // Ignorar lineas que no son JSON valido
                }
              }
            }
          }

          // Si no se recibieron tokens del metadata, estimar
          if (totalTokensIn === 0) {
            totalTokensIn = Math.ceil((message.length + (context?.length || 0)) / 4);
          }
          if (totalTokensOut === 0) {
            totalTokensOut = Math.ceil(fullResponse.length / 4);
          }

          // ── 9. Registrar uso en Supabase (fire-and-forget) ──
          const cost = estimateModelCost(selectedModel, totalTokensIn, totalTokensOut);
          supabaseAdmin
            .from("ai_usage_logs")
            .insert({
              user_id: userId,
              model: selectedModel,
              tokens_in: totalTokensIn,
              tokens_out: totalTokensOut,
              cost_usd: cost,
            })
            .then(({ error: logError }) => {
              if (logError) {
                console.error("Error registrando uso de IA:", logError);
              }
            });

          // Enviar evento final con metadata de uso
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                model: selectedModel,
                usage: {
                  tokens_in: totalTokensIn,
                  tokens_out: totalTokensOut,
                  requests_used: currentUsage + 1,
                  requests_limit: MAX_MONTHLY_REQUESTS,
                },
              })}\n\n`
            )
          );

          controller.close();
        } catch (streamError) {
          console.error("Error en streaming:", streamError);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Error procesando la respuesta." })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error en /api/ai/chat:", error);
    return Response.json(
      { error: "Error interno del servidor. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
