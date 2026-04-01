"use client";

// ============================================================
// ITSEIA Academy — AILabPanel (v2 — AI Lab Avanzado)
// Sub-tabs: Chat | Comparar | Playground | Flashcards
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState, lazy, Suspense } from "react";
import ChatPanel from "@/components/ai-lab/ChatPanel";
import {
  Sparkles,
  ClipboardCopy,
  ExternalLink,
  Check,
  MessageSquare,
  GitCompare,
  Code2,
  BookOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy-load componentes pesados (Pyodide, etc.)
const ComparisonMode = lazy(
  () => import("@/components/ai-lab/ComparisonMode")
);
const CodePlayground = lazy(
  () => import("@/components/ai-lab/CodePlayground")
);
const FlashcardGenerator = lazy(
  () => import("@/components/ai-lab/FlashcardGenerator")
);

type AILabTab = "chat" | "comparar" | "playground" | "flashcards";

interface AILabPanelProps {
  sessionContext: string;
  suggestedPrompt?: string;
  onFirstMessage?: () => void;
  sessionId?: string;
  sessionTitle?: string;
  className?: string;
}

// ── Herramientas IA externas ──
const EXTERNAL_TOOLS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chat.openai.com/",
    color: "#10A37F",
    hoverBg: "hover:bg-[#10A37F]/15",
    borderHover: "hover:border-[#10A37F]/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.497v2.999l-2.597 1.5-2.607-1.497z" />
      </svg>
    ),
  },
  {
    id: "claude",
    name: "Claude",
    url: "https://claude.ai/",
    color: "#CC785C",
    hoverBg: "hover:bg-[#CC785C]/15",
    borderHover: "hover:border-[#CC785C]/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.232-4.72-2.648-.226.09-.09.228.09.229 3.927 2.203-3.927 2.201.09.229.226.09zM12.062 6.38l-2.36 4.856.14.216h.255l2.36-4.856-.14-.217h-.255zm3.864 9.247l4.72 2.648.226-.09.09-.23-.09-.228-4.72-2.648-.226.09-.09.228.09.23zm.226-9.495l-4.72 2.648-.09.229.09.229 4.72 2.647.226-.09.09-.228-.09-.229-3.927-2.203 3.927-2.201-.09-.229-.226-.09zM11.925 17.62l2.36-4.856-.14-.216h-.255l-2.36 4.856.14.216h.255zm-3.727.708l4.72 2.647.226-.09.09-.228-.09-.229-4.72-2.648-.226.09-.09.229.09.229z" />
      </svg>
    ),
  },
  {
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com/",
    color: "#4285F4",
    hoverBg: "hover:bg-[#4285F4]/15",
    borderHover: "hover:border-[#4285F4]/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c2.717 0 5.174 1.027 7.022 2.706L4.706 19.022A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2zm0 20a9.96 9.96 0 0 1-7.022-2.706L19.294 4.978A9.96 9.96 0 0 1 22 12c0 5.523-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    id: "perplexity",
    name: "Perplexity",
    url: "https://perplexity.ai/",
    color: "#20B2AA",
    hoverBg: "hover:bg-[#20B2AA]/15",
    borderHover: "hover:border-[#20B2AA]/40",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM6.4 18.6L2 14.2V9.8l4.4-4.4 1.4 1.4L4.2 9.9v4.2l3.6 3.6-1.4 1.3zm11.2 0l-1.4-1.4 3.6-3.6V9.4l-3.6-3.6 1.4-1.4L22 9.8v4.4l-4.4 4.4zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5S10.1 8.5 12 8.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm0-5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    ),
  },
] as const;

const TABS: { id: AILabTab; label: string; icon: React.ReactNode; badge?: string }[] = [
  {
    id: "chat",
    label: "Tutor IA",
    icon: <MessageSquare className="w-3.5 h-3.5" />,
  },
  {
    id: "comparar",
    label: "Comparar",
    icon: <GitCompare className="w-3.5 h-3.5" />,
    badge: "Nuevo",
  },
  {
    id: "playground",
    label: "Playground",
    icon: <Code2 className="w-3.5 h-3.5" />,
  },
  {
    id: "flashcards",
    label: "Flashcards",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 text-[#73B8E7] animate-spin" />
    </div>
  );
}

export default function AILabPanel({
  sessionContext,
  suggestedPrompt,
  onFirstMessage,
  sessionId,
  sessionTitle,
  className,
}: AILabPanelProps) {
  const [activeTab, setActiveTab] = useState<AILabTab>("chat");
  const [hasUsed, setHasUsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [debugPrompt, setDebugPrompt] = useState<string | undefined>();

  function handleUsageUpdate() {
    if (!hasUsed) {
      setHasUsed(true);
      onFirstMessage?.();
    }
  }

  async function handleCopyContext() {
    try {
      await navigator.clipboard.writeText(sessionContext);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = sessionContext;
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleDebugWithAI(code: string, error: string) {
    const prompt = `Tengo este codigo ${activeTab === "playground" ? "Python" : ""}:\n\`\`\`\n${code}\n\`\`\`\n\nY este error:\n${error}\n\nExplica que esta mal y como corregirlo.`;
    setDebugPrompt(prompt);
    setActiveTab("chat");
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* ── Sub-tabs ── */}
      <div className="rounded-t-xl border border-b-0 border-[#1F2F58]/40 bg-[#0A1628]/80 px-3 pt-3 pb-0">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-[11px] font-medium transition-all border-b-2 whitespace-nowrap",
                activeTab === tab.id
                  ? "text-white border-[#FBBC0C] bg-[#1F2F58]/40"
                  : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1F2F58]/20"
              )}
            >
              <span
                className={
                  activeTab === tab.id ? "text-[#FBBC0C]" : "text-gray-600"
                }
              >
                {tab.icon}
              </span>
              {tab.label}
              {tab.badge && (
                <span className="text-[9px] px-1 py-0.5 rounded-full bg-[#73B8E7]/15 text-[#73B8E7]">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenido del tab activo ── */}
      <div className="flex-1 min-h-0 border border-t-0 border-[#1F2F58]/40 rounded-b-xl overflow-hidden">
        {/* TAB: Chat */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            {/* Header con boton copiar contexto */}
            <div className="bg-[#0A1628]/80 px-3 py-2 border-b border-[#1F2F58]/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FBBC0C]" />
                  <span className="text-[11px] font-semibold text-[#FBBC0C] uppercase tracking-wider">
                    Tutor IA ITSEIA
                  </span>
                </div>
                <button
                  onClick={handleCopyContext}
                  title="Copia el contexto de la sesion para usar en cualquier herramienta IA"
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all border",
                    copied
                      ? "bg-green-500/15 border-green-500/30 text-green-400"
                      : "bg-[#1F2F58]/40 border-[#1F2F58]/50 text-gray-400 hover:bg-[#FBBC0C]/10 hover:border-[#FBBC0C]/30 hover:text-[#FBBC0C]"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-3 h-3" />
                      <span>Copiar contexto</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Chat panel */}
            <div className="flex-1 min-h-0">
              <ChatPanel
                context={sessionContext}
                suggestedPrompt={debugPrompt ?? suggestedPrompt}
                onUsageUpdate={handleUsageUpdate}
                className="h-full rounded-none border-none"
              />
            </div>
          </div>
        )}

        {/* TAB: Comparar */}
        {activeTab === "comparar" && (
          <Suspense fallback={<LoadingFallback />}>
            <ComparisonMode
              sessionContext={sessionContext}
              className="h-full"
            />
          </Suspense>
        )}

        {/* TAB: Playground */}
        {activeTab === "playground" && (
          <Suspense fallback={<LoadingFallback />}>
            <CodePlayground
              sessionId={sessionId}
              onDebugWithAI={handleDebugWithAI}
              className="h-full rounded-none border-none"
            />
          </Suspense>
        )}

        {/* TAB: Flashcards */}
        {activeTab === "flashcards" && (
          <div className="h-full overflow-y-auto p-4">
            {sessionId ? (
              <Suspense fallback={<LoadingFallback />}>
                <FlashcardGenerator
                  sessionId={sessionId}
                  sessionTitle={sessionTitle}
                />
              </Suspense>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <BookOpen className="w-8 h-8 text-gray-600 mb-3" />
                <p className="text-sm text-gray-500">
                  Las flashcards estan disponibles dentro de una sesion de curso
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

