"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Trash2,
  Bot,
  User,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ModelSelector from "@/components/ai-lab/ModelSelector";
import { AI_MODELS, DEFAULT_MODEL, type AIModelId } from "@/lib/ai/models";

// ── Tipos ──
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: AIModelId;
}

interface UsageInfo {
  tokens_in: number;
  tokens_out: number;
  requests_used: number;
  requests_limit: number;
}

interface ChatPanelProps {
  suggestedPrompt?: string;
  context?: string;
  onUsageUpdate?: (usage: UsageInfo) => void;
  className?: string;
}

// ── Componente Principal ──
export default function ChatPanel({
  suggestedPrompt,
  context,
  onUsageUpdate,
  className,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModelId>(DEFAULT_MODEL);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll al fondo cuando llegan mensajes nuevos
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cargar el prompt sugerido si existe
  useEffect(() => {
    if (suggestedPrompt && messages.length === 0) {
      setInput(suggestedPrompt);
      textareaRef.current?.focus();
    }
  }, [suggestedPrompt, messages.length]);

  // Generar ID unico para cada mensaje
  const generateId = () =>
    `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // ── Enviar mensaje ──
  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isStreaming) return;

    setError(null);
    setInput("");

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Crear placeholder para respuesta del asistente
    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      model: selectedModel,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsStreaming(true);

    // Construir historial para la API (sin el mensaje actual)
    const history = messages.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedInput,
          history,
          context,
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      });

      // Si la respuesta no es streaming (error JSON)
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error al comunicarse con el tutor IA.");
        // Remover el placeholder del asistente
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
        setIsStreaming(false);
        if (errorData.usage) {
          setUsage(errorData.usage);
          onUsageUpdate?.(errorData.usage);
        }
        return;
      }

      // Procesar stream SSE
      const reader = response.body?.getReader();
      if (!reader) {
        setError("No se pudo leer la respuesta del servidor.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
        setIsStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));

            if (data.error) {
              setError(data.error);
              break;
            }

            if (data.text) {
              accumulatedText += data.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: accumulatedText }
                    : m
                )
              );
            }

            if (data.done && data.usage) {
              const usageData: UsageInfo = {
                tokens_in: data.usage.tokens_in,
                tokens_out: data.usage.tokens_out,
                requests_used: data.usage.requests_used,
                requests_limit: data.usage.requests_limit,
              };
              setUsage(usageData);
              onUsageUpdate?.(usageData);
            }
          } catch {
            // Ignorar lineas JSON invalidas
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Usuario cancelo la peticion
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: m.content + "\n\n*[Respuesta cancelada]*" }
              : m
          )
        );
      } else {
        setError("Error de conexion. Verifica tu internet e intenta de nuevo.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessage.id));
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // ── Limpiar chat ──
  const clearChat = () => {
    if (isStreaming) {
      abortControllerRef.current?.abort();
    }
    setMessages([]);
    setError(null);
    setInput("");
    textareaRef.current?.focus();
  };

  // ── Enter para enviar (Shift+Enter para nueva linea) ──
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[#0A1628] rounded-2xl overflow-hidden border border-[#1F2F58]/50",
        className
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1F2F58] border-b border-[#1F2F58]/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FBBC0C]/15">
            <Sparkles className="w-5 h-5 text-[#FBBC0C]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Tutor IA ITSEIA</h3>
            <p className="text-xs text-[#73B8E7]">
              {AI_MODELS[selectedModel].name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />

          {/* Contador de uso */}
          {usage && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1628]/60 border border-[#1F2F58]/40">
              <span className="text-xs text-[#73B8E7] font-medium">
                {usage.requests_used}/{usage.requests_limit}
              </span>
              <span className="text-xs text-gray-500">consultas</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={clearChat}
            className="text-gray-400 hover:text-white hover:bg-[#0A1628]/60"
            title="Limpiar chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Area de mensajes ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <EmptyState onSuggestionClick={(text) => setInput(text)} />
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && msg === messages[messages.length - 1] && msg.role === "assistant"}
          />
        ))}

        {/* Indicador de escritura */}
        {isStreaming && messages[messages.length - 1]?.content === "" && (
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F2F58]">
              <Bot className="w-4 h-4 text-[#73B8E7]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-400">Escribiendo</span>
              <TypingDots />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 px-4 py-3 mx-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-end gap-2 p-2 rounded-xl bg-[#1F2F58]/40 border border-[#1F2F58]/60 focus-within:border-[#73B8E7]/50 focus-within:ring-1 focus-within:ring-[#73B8E7]/20 transition-all">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta..."
            disabled={isStreaming}
            className="flex-1 min-h-[44px] max-h-[160px] resize-none bg-transparent border-none text-white text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-none p-2"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className={cn(
              "shrink-0 h-10 w-10 rounded-lg transition-all",
              input.trim() && !isStreaming
                ? "bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 shadow-lg shadow-[#FBBC0C]/20"
                : "bg-[#1F2F58]/60 text-gray-500"
            )}
            size="icon"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-2">
          Shift + Enter para nueva linea | El tutor IA puede cometer errores
        </p>
      </div>
    </div>
  );
}

// ── Componente: Burbuja de Mensaje ──
function MessageBubble({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1",
          isUser
            ? "bg-[#FBBC0C]/20"
            : "bg-[#1F2F58] ring-1 ring-[#73B8E7]/20"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-[#FBBC0C]" />
        ) : (
          <Bot className="w-4 h-4 text-[#73B8E7]" />
        )}
      </div>

      {/* Burbuja */}
      <div className={cn("max-w-[80%]", isUser ? "text-right" : "text-left")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-[#FBBC0C] text-[#0A1628] rounded-tr-md shadow-lg shadow-[#FBBC0C]/10"
              : "bg-white text-[#0A1628] rounded-tl-md border border-[#1F2F58]/20 shadow-sm",
            isStreaming && "min-h-[2rem]"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none text-[#0A1628] prose-p:text-[#1F2F58] prose-p:my-1.5 prose-headings:text-[#0A1628] prose-headings:font-bold prose-headings:my-2 prose-li:text-[#1F2F58] prose-li:my-0.5 prose-code:text-[#F0846D] prose-code:bg-[#1F2F58]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-pre:bg-[#0A1628] prose-pre:text-white prose-pre:border prose-pre:border-[#1F2F58]/20 prose-pre:rounded-xl prose-a:text-[#73B8E7] prose-strong:text-[#0A1628]">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-[#73B8E7] animate-pulse rounded-sm ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Model tag for assistant messages */}
        {!isUser && message.model && message.content.length > 0 && !isStreaming && (
          <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-gray-500">
            <span>{AI_MODELS[message.model].icon}</span>
            <span>{AI_MODELS[message.model].name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Componente: Estado vacio con sugerencias ──
function EmptyState({
  onSuggestionClick,
}: {
  onSuggestionClick: (text: string) => void;
}) {
  const suggestions = [
    {
      icon: "\uD83E\uDDE0",
      text: "Explicame que es una red neuronal con un ejemplo simple",
    },
    {
      icon: "\uD83D\uDC0D",
      text: "Como empiezo a programar en Python desde cero?",
    },
    {
      icon: "\uD83D\uDCCA",
      text: "Que diferencia hay entre Machine Learning y Deep Learning?",
    },
    {
      icon: "\uD83D\uDE80",
      text: "Dame un proyecto practico para aprender IA",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      {/* Logo / Icono */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FBBC0C]/20 to-[#73B8E7]/20 flex items-center justify-center border border-[#1F2F58]/40">
          <Sparkles className="w-10 h-10 text-[#FBBC0C]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500/20 border-2 border-[#0A1628] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">
        Tutor IA de ITSEIA
      </h3>
      <p className="text-sm text-gray-400 text-center max-w-sm mb-8">
        Soy tu asistente para aprender sobre Inteligencia Artificial,
        programacion y tecnologia. Preguntame lo que necesites.
      </p>

      {/* Sugerencias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#1F2F58]/30 border border-[#1F2F58]/40 text-left text-sm text-gray-300 hover:bg-[#1F2F58]/50 hover:border-[#73B8E7]/30 hover:text-white transition-all group"
          >
            <span className="text-base mt-0.5 group-hover:scale-110 transition-transform">
              {s.icon}
            </span>
            <span className="leading-snug">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Componente: Puntos de escritura animados ──
function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7] animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7] animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-[#73B8E7] animate-bounce [animation-delay:300ms]" />
    </span>
  );
}
