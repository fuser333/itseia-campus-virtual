// ============================================================
// ITSEIA Academy — OpenAI Assistants API Route (POST)
// Cada modulo tiene su propio asistente con conocimiento completo
// Streaming via SSE
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Map module types to assistant IDs (populated after create_assistants.js runs)
const ASSISTANT_IDS: Record<string, string> = {
  carrera: process.env.OPENAI_ASSISTANT_CARRERAS || "",
  preuni: process.env.OPENAI_ASSISTANT_PREUNI || "",
  curso: process.env.OPENAI_ASSISTANT_CURSOS || "",
  certificacion: process.env.OPENAI_ASSISTANT_CERTIFICACIONES || "",
  teacher_training: process.env.OPENAI_ASSISTANT_DOCENTES || "",
  b2b: process.env.OPENAI_ASSISTANT_B2B || "",
};

// Fallback assistant if no specific one exists
const DEFAULT_ASSISTANT = process.env.OPENAI_ASSISTANT_CARRERAS || "";

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
            // Ignore in Server Components
          }
        },
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "OpenAI no configurado." }, { status: 500 });
    }

    // Auth
    const supabase = await getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    // Parse body
    const body = await request.json();
    const {
      message,
      threadId,
      moduleType,
      sessionContext,
    } = body as {
      message: string;
      threadId?: string;
      moduleType?: string;
      sessionContext?: string;
    };

    if (!message?.trim()) {
      return Response.json({ error: "Mensaje vacio." }, { status: 400 });
    }

    // Select assistant
    const assistantId = ASSISTANT_IDS[moduleType || "carrera"] || DEFAULT_ASSISTANT;

    if (!assistantId) {
      return Response.json({
        error: "Asistente no configurado. Contacta al administrador.",
      }, { status: 503 });
    }

    // Create or reuse thread
    let thread;
    if (threadId) {
      thread = { id: threadId };
    } else {
      thread = await openai.beta.threads.create();
    }

    // Add context as first message if provided and new thread
    if (!threadId && sessionContext) {
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `[CONTEXTO DE LA SESION ACTUAL]\n${sessionContext}\n\n[FIN CONTEXTO]`,
      });
      // Hidden assistant acknowledgment
      await openai.beta.threads.messages.create(thread.id, {
        role: "assistant" as "user",
        content: "Entendido. Tengo el contexto de tu sesion actual. ¿En que puedo ayudarte?",
      });
    }

    // Add user message
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message.trim(),
    });

    // Stream the response
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = openai.beta.threads.runs.stream(thread.id, {
            assistant_id: assistantId,
          });

          // Send thread ID immediately so client can reuse it
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ threadId: thread.id })}\n\n`
            )
          );

          for await (const event of run) {
            if (event.event === "thread.message.delta") {
              const delta = event.data.delta;
              if (delta.content) {
                for (const block of delta.content) {
                  if (block.type === "text" && block.text?.value) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ text: block.text.value })}\n\n`
                      )
                    );
                  }
                }
              }
            }

            if (event.event === "thread.run.completed") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ done: true, threadId: thread.id })}\n\n`
                )
              );
            }

            if (event.event === "thread.run.failed") {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ error: "El asistente no pudo responder." })}\n\n`
                )
              );
            }
          }

          controller.close();
        } catch (err) {
          console.error("Assistant streaming error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Error en el asistente." })}\n\n`
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
    console.error("Error in /api/ai/assistant:", error);
    return Response.json({ error: "Error interno." }, { status: 500 });
  }
}
