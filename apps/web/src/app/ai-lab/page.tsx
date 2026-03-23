"use client";

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import ChatPanel from "@/components/ai-lab/ChatPanel";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Plus,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  Clock,
  History,
  Code2,
  BookMarked,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Lazy imports para componentes pesados
const CodePlayground = lazy(
  () => import("@/components/ai-lab/CodePlayground")
);

// ── Tipos ──
interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

interface UsageStats {
  requests_used: number;
  requests_limit: number;
  total_tokens_in: number;
  total_tokens_out: number;
}

type MainTab = "chat" | "playground";

const CONVERSATIONS_KEY = "itseia_ai_lab_conversations";
const ACTIVE_CONVERSATION_KEY = "itseia_ai_lab_active";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-6 h-6 text-[#73B8E7] animate-spin" />
    </div>
  );
}

export default function AILabPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mainTab, setMainTab] = useState<MainTab>("chat");
  const [usage, setUsage] = useState<UsageStats>({
    requests_used: 0,
    requests_limit: 500,
    total_tokens_in: 0,
    total_tokens_out: 0,
  });

  // Cargar conversaciones del localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONVERSATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Conversation[];
        setConversations(parsed);
      }
      const activeId = localStorage.getItem(ACTIVE_CONVERSATION_KEY);
      if (activeId) {
        setActiveConversationId(activeId);
      }
    } catch {
      // localStorage no disponible o corrupto
    }
  }, []);

  // Guardar conversaciones al localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch {
      // Ignorar errores de localStorage
    }
  }, [conversations]);

  useEffect(() => {
    try {
      if (activeConversationId) {
        localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeConversationId);
      }
    } catch {
      // Ignorar
    }
  }, [activeConversationId]);

  // ── Nuevo chat ──
  const createNewChat = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `Chat ${conversations.length + 1}`,
      createdAt: new Date().toISOString(),
      messageCount: 0,
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setMainTab("chat");
  }, [conversations.length]);

  // ── Eliminar conversacion ──
  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  // ── Handler de uso ──
  const handleUsageUpdate = (usageInfo: {
    tokens_in: number;
    tokens_out: number;
    requests_used: number;
    requests_limit: number;
  }) => {
    setUsage((prev) => ({
      requests_used: usageInfo.requests_used,
      requests_limit: usageInfo.requests_limit,
      total_tokens_in: prev.total_tokens_in + usageInfo.tokens_in,
      total_tokens_out: prev.total_tokens_out + usageInfo.tokens_out,
    }));

    // Actualizar messageCount de la conversacion activa
    if (activeConversationId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, messageCount: c.messageCount + 1 }
            : c
        )
      );
    }
  };

  // Porcentaje de uso para la barra de progreso
  const usagePercent =
    usage.requests_limit > 0
      ? Math.min((usage.requests_used / usage.requests_limit) * 100, 100)
      : 0;

  const formatNumber = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className="flex h-screen bg-[#0A1628] overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "flex flex-col bg-[#0f1d35] border-r border-[#1F2F58]/40 transition-all duration-300 ease-in-out shrink-0",
          sidebarOpen ? "w-72" : "w-0 overflow-hidden"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#1F2F58]/40">
          <Button
            onClick={createNewChat}
            className="w-full bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold shadow-lg shadow-[#FBBC0C]/10 rounded-xl h-10 gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo chat
          </Button>
        </div>

        {/* Quick Nav */}
        <div className="px-2 py-2 border-b border-[#1F2F58]/40 space-y-1">
          <Link
            href="/ai-lab/historial"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1F2F58]/40 transition-all text-sm"
          >
            <History className="w-4 h-4 text-[#73B8E7]/70" />
            Ver historial completo
          </Link>
          <Link
            href="/flashcards"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1F2F58]/40 transition-all text-sm"
          >
            <BookMarked className="w-4 h-4 text-[#FBBC0C]/70" />
            Mi mazo de Flashcards
          </Link>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="w-8 h-8 text-gray-600 mb-3" />
              <p className="text-sm text-gray-500">
                No tienes conversaciones aun
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Crea un nuevo chat para comenzar
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                  activeConversationId === conv.id
                    ? "bg-[#1F2F58] text-white"
                    : "text-gray-400 hover:bg-[#1F2F58]/40 hover:text-gray-200"
                )}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  setMainTab("chat");
                }}
              >
                <MessageSquare className="w-4 h-4 shrink-0 text-[#73B8E7]/60" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{conv.title}</p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(conv.createdAt).toLocaleDateString("es-EC", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    &middot; {conv.messageCount} msgs
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Usage Stats Card */}
        <div className="p-3 border-t border-[#1F2F58]/40">
          <div className="rounded-xl bg-[#0A1628]/80 border border-[#1F2F58]/30 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">
                Uso mensual
              </span>
              <span className="text-xs font-bold text-[#FBBC0C]">
                {usage.requests_used}/{usage.requests_limit}
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full h-2 rounded-full bg-[#1F2F58]/60 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  usagePercent < 50
                    ? "bg-[#73B8E7]"
                    : usagePercent < 80
                      ? "bg-[#FBBC0C]"
                      : "bg-[#F0846D]"
                )}
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            {/* Detalles */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[#73B8E7]" />
                <div>
                  <p className="text-[10px] text-gray-500">Tokens entrada</p>
                  <p className="text-xs font-medium text-gray-300">
                    {formatNumber(usage.total_tokens_in)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3 text-[#FBBC0C]" />
                <div>
                  <p className="text-[10px] text-gray-500">Tokens salida</p>
                  <p className="text-xs font-medium text-gray-300">
                    {formatNumber(usage.total_tokens_out)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 py-3 bg-[#0f1d35] border-b border-[#1F2F58]/40">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white hover:bg-[#1F2F58]/60"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#FBBC0C]/20 to-[#73B8E7]/20 border border-[#1F2F58]/40">
              <Brain className="w-5 h-5 text-[#FBBC0C]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">
                AI Lab ITSEIA
              </h1>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Tu laboratorio personal de Inteligencia Artificial
              </p>
            </div>
          </div>

          {/* Tab selector */}
          <div className="ml-6 flex items-center gap-1 bg-[#1F2F58]/40 rounded-xl p-1">
            <button
              onClick={() => setMainTab("chat")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                mainTab === "chat"
                  ? "bg-[#FBBC0C] text-[#0A1628]"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Tutor IA
            </button>
            <button
              onClick={() => setMainTab("playground")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                mainTab === "playground"
                  ? "bg-[#73B8E7] text-[#0A1628]"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Code2 className="w-3.5 h-3.5" />
              Playground
            </button>
          </div>

          {/* Quick links */}
          <div className="ml-auto flex items-center gap-2">
            <Link href="/ai-lab/historial">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-[#1F2F58]/60 gap-1.5 text-xs"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Historial</span>
              </Button>
            </Link>
            <Link href="/flashcards">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-[#1F2F58]/60 gap-1.5 text-xs"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flashcards</span>
              </Button>
            </Link>

            {/* Mobile usage badge */}
            {usage.requests_used > 0 && (
              <div className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1F2F58]/40 border border-[#1F2F58]/30">
                <span className="text-[10px] font-medium text-[#FBBC0C]">
                  {usage.requests_used}/{usage.requests_limit}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden">
          {mainTab === "chat" ? (
            activeConversationId ? (
              <ChatPanel
                key={activeConversationId}
                onUsageUpdate={handleUsageUpdate}
                className="h-full"
              />
            ) : (
              <WelcomeScreen onNewChat={createNewChat} />
            )
          ) : (
            <Suspense fallback={<LoadingFallback />}>
              <CodePlayground className="h-full" />
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Pantalla de bienvenida ──
function WelcomeScreen({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      {/* Icono animado */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FBBC0C]/15 to-[#73B8E7]/15 flex items-center justify-center border border-[#1F2F58]/30 shadow-2xl shadow-[#FBBC0C]/5">
          <Brain className="w-12 h-12 text-[#FBBC0C]" />
        </div>
        {/* Orbita decorativa */}
        <div className="absolute inset-[-12px] rounded-[28px] border border-[#73B8E7]/10 animate-pulse" />
        <div className="absolute inset-[-24px] rounded-[34px] border border-[#FBBC0C]/5" />
        {/* Punto online */}
        <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0A1628] flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-green-500/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Bienvenido al AI Lab
      </h2>
      <p className="text-sm text-gray-400 max-w-md mb-8 leading-relaxed">
        Tu laboratorio personal de Inteligencia Artificial. Aprende, experimenta
        y resuelve dudas con tu tutor IA potenciado por Gemini.
      </p>

      <Button
        onClick={onNewChat}
        className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold h-12 px-8 rounded-xl shadow-lg shadow-[#FBBC0C]/20 gap-2 text-base"
      >
        <Plus className="w-5 h-5" />
        Iniciar nueva conversacion
      </Button>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-12 max-w-3xl w-full">
        {[
          {
            icon: <MessageSquare className="w-5 h-5 text-[#FBBC0C]" />,
            title: "Tutor IA",
            desc: "Chat contextualizado por sesion",
          },
          {
            icon: <Code2 className="w-5 h-5 text-[#73B8E7]" />,
            title: "Playground",
            desc: "Ejecuta Python en el navegador",
          },
          {
            icon: <BookMarked className="w-5 h-5 text-[#F0846D]" />,
            title: "Flashcards",
            desc: "Genera tarjetas de estudio con IA",
          },
          {
            icon: <History className="w-5 h-5 text-[#73B8E7]" />,
            title: "Historial",
            desc: "Accede a conversaciones pasadas",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1F2F58]/20 border border-[#1F2F58]/30"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0A1628]/60 flex items-center justify-center">
              {feature.icon}
            </div>
            <h4 className="text-sm font-medium text-white">{feature.title}</h4>
            <p className="text-xs text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
