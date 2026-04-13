// ============================================================
// ITSEIA Academy — AI Chat API Route (POST)
// Multi-provider: Gemini (directo) + OpenRouter (ChatGPT, Claude, Llama, Mistral)
// Proxy seguro: Auth + Quota + Streaming
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
  AI_MODELS,
  type AIModelId,
} from "@/lib/ai/models";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MAX_MONTHLY_REQUESTS = 500;

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

// ── OpenRouter streaming handler ──────────────────────────────────────────────

async function streamOpenRouter(
  modelConfig: typeof AI_MODELS[AIModelId],
  message: string,
  history: Array<{ role: string; content: string }>,
  systemPrompt: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
): Promise<{ fullResponse: string; tokensIn: number; tokensOut: number }> {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({
      role: h.role === "assistant" ? "assistant" : "user",
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://tecnologico.itseia.ai",
      "X-Title": "ITSEIA Academy AI Lab",
    },
    body: JSON.stringify({
      model: modelConfig.modelId,
      messages,
      stream: true,
      max_tokens: modelConfig.maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenRouter error (${modelConfig.modelId}):`, response.status, errorText);
    throw new Error("OpenRouter API error");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let fullResponse = "";
  let tokensIn = 0;
  let tokensOut = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;

      if (trimmed.startsWith("data: ")) {
        try {
          const data = JSON.parse(trimmed.slice(6));
          const delta = data.choices?.[0]?.delta?.content;

          if (delta) {
            fullResponse += delta;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`)
            );
          }

          // Usage info (comes in final chunk for some providers)
          if (data.usage) {
            tokensIn = data.usage.prompt_tokens || 0;
            tokensOut = data.usage.completion_tokens || 0;
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }

  // Estimate tokens if not provided
  if (tokensIn === 0) tokensIn = Math.ceil(message.length / 4);
  if (tokensOut === 0) tokensOut = Math.ceil(fullResponse.length / 4);

  return { fullResponse, tokensIn, tokensOut };
}

// ── Gemini streaming handler ──────────────────────────────────────────────────

async function streamGemini(
  selectedModel: AIModelId,
  message: string,
  history: Array<{ role: string; content: string }>,
  systemPrompt: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
): Promise<{ fullResponse: string; tokensIn: number; tokensOut: number }> {
  const geminiBody = buildGeminiRequest(message, history, systemPrompt);
  const geminiUrl = getGeminiStreamUrl(selectedModel, GEMINI_API_KEY!);

  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(geminiBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini error (${selectedModel}):`, response.status, errorText);
    throw new Error("Gemini API error");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let fullResponse = "";
  let tokensIn = 0;
  let tokensOut = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;

      if (trimmed.startsWith("data: ")) {
        try {
          const data = JSON.parse(trimmed.slice(6));
          const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (textPart) {
            fullResponse += textPart;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: textPart })}\n\n`)
            );
          }

          if (data.usageMetadata) {
            tokensIn = data.usageMetadata.promptTokenCount || 0;
            tokensOut = data.usageMetadata.candidatesTokenCount || 0;
          }
        } catch {
          // Skip
        }
      }
    }
  }

  if (tokensIn === 0) tokensIn = Math.ceil(message.length / 4);
  if (tokensOut === 0) tokensOut = Math.ceil(fullResponse.length / 4);

  return { fullResponse, tokensIn, tokensOut };
}

// ── Main POST handler ─────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // ── 1. Auth ──
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

    // ── 2. Parse body ──
    const body = await request.json();
    const { message, history, context, model: requestedModel } = body as {
      message: string;
      history: Array<{ role: string; content: string }>;
      context?: string;
      model?: string;
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return Response.json({ error: "El mensaje no puede estar vacio." }, { status: 400 });
    }
    if (message.length > 10000) {
      return Response.json({ error: "Maximo 10,000 caracteres." }, { status: 400 });
    }

    // ── 3. Resolve model ──
    let selectedModel: AIModelId = DEFAULT_MODEL;
    if (requestedModel && typeof requestedModel === "string" && isValidModel(requestedModel)) {
      selectedModel = requestedModel;
    }

    const modelConfig = AI_MODELS[selectedModel];

    // ── 4. Check provider API keys ──
    if (modelConfig.provider === "google" && !GEMINI_API_KEY) {
      return Response.json({ error: "Gemini no configurado." }, { status: 500 });
    }
    if (modelConfig.provider === "openrouter" && !OPENROUTER_API_KEY) {
      return Response.json(
        { error: `${modelConfig.name} no disponible. Usa Gemini por ahora.` },
        { status: 503 }
      );
    }

    // ── 5. Quota check ──
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count: monthlyUsage, error: quotaError } = await supabaseAdmin
      .from("ai_usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", firstDayOfMonth);

    if (quotaError) {
      return Response.json({ error: "Error verificando cuota." }, { status: 500 });
    }

    const currentUsage = monthlyUsage ?? 0;
    if (currentUsage >= MAX_MONTHLY_REQUESTS) {
      return Response.json({
        error: `Limite de ${MAX_MONTHLY_REQUESTS} consultas/mes alcanzado.`,
        usage: { used: currentUsage, limit: MAX_MONTHLY_REQUESTS },
      }, { status: 429 });
    }

    // ── 6. Build system prompt ──
    const systemPrompt = buildContextualPrompt(context);

    // ── 7. Stream response ──
    const userId = user.id;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let result: { fullResponse: string; tokensIn: number; tokensOut: number };

          if (modelConfig.provider === "openrouter") {
            result = await streamOpenRouter(
              modelConfig, message.trim(), Array.isArray(history) ? history : [],
              systemPrompt, controller, encoder
            );
          } else {
            result = await streamGemini(
              selectedModel, message.trim(), Array.isArray(history) ? history : [],
              systemPrompt, controller, encoder
            );
          }

          // ── 8. Log usage ──
          const cost = estimateModelCost(selectedModel, result.tokensIn, result.tokensOut);
          supabaseAdmin
            .from("ai_usage_logs")
            .insert({
              user_id: userId,
              model: selectedModel,
              tokens_in: result.tokensIn,
              tokens_out: result.tokensOut,
              cost_usd: cost,
            })
            .then(({ error: logError }) => {
              if (logError) console.error("Error logging AI usage:", logError);
            });

          // ── 9. Send final event ──
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                model: selectedModel,
                usage: {
                  tokens_in: result.tokensIn,
                  tokens_out: result.tokensOut,
                  requests_used: currentUsage + 1,
                  requests_limit: MAX_MONTHLY_REQUESTS,
                },
              })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Error procesando la respuesta. Intenta con otro modelo." })}\n\n`
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
    return Response.json({ error: "Error interno." }, { status: 500 });
  }
}
