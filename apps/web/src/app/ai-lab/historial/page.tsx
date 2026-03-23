"use client";

// ============================================================
// ITSEIA Academy — Pagina: Historial de Conversaciones AI Lab
// URL: /ai-lab/historial
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState } from "react";
import { History, ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConversationHistory from "@/components/ai-lab/ConversationHistory";
import type { AIConversationWithSession } from "@/types/database";

export default function HistorialPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<AIConversationWithSession | null>(null);

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 overflow-hidden">
      {/* Sidebar: lista de conversaciones */}
      <aside className="w-80 shrink-0 flex flex-col rounded-2xl bg-[#0A1628] border border-[#1F2F58]/50 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-4 border-b border-[#1F2F58]/40 bg-[#1F2F58]/20">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/ai-lab"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#73B8E7]" />
              <h1 className="text-sm font-semibold text-white">
                Historial de AI Lab
              </h1>
            </div>
          </div>
          <p className="text-[10px] text-gray-500">
            Todas tus conversaciones con el tutor IA, guardadas por sesion.
          </p>
        </div>

        {/* Lista paginada */}
        <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
          <ConversationHistory
            onSelectConversation={setSelectedConversation}
          />
        </div>
      </aside>

      {/* Panel principal: conversacion seleccionada */}
      <main className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <div className="flex flex-col h-full rounded-2xl bg-[#0A1628] border border-[#1F2F58]/50 overflow-hidden">
            {/* Info de la conversacion */}
            <div className="px-4 py-3 border-b border-[#1F2F58]/40 bg-[#1F2F58]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FBBC0C]/15 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-[#FBBC0C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {selectedConversation.title ?? "Conversacion"}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {selectedConversation.model} ·{" "}
                    {selectedConversation.messages.length} mensajes ·{" "}
                    {new Date(selectedConversation.created_at).toLocaleDateString(
                      "es-EC",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                    {selectedConversation.sessions && (
                      <> · Sesion {(selectedConversation.sessions as { number?: number; title?: string }).number}: {(selectedConversation.sessions as { title?: string }).title}</>
                    )}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedConversation(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Cerrar
                </Button>
              </div>
            </div>

            {/* Mostrar historial de mensajes como chat de solo lectura */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {selectedConversation.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                      msg.role === "user"
                        ? "bg-[#FBBC0C]/20"
                        : "bg-[#1F2F58] ring-1 ring-[#73B8E7]/20"
                    }`}
                  >
                    <span className="text-xs">
                      {msg.role === "user" ? "Tu" : "IA"}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#FBBC0C] text-[#0A1628] rounded-tr-md"
                        : "bg-[#1F2F58]/60 text-gray-100 rounded-tl-md border border-[#1F2F58]/40"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continuar conversacion */}
            <div className="px-4 py-3 border-t border-[#1F2F58]/40 bg-[#0A1628]/60">
              <p className="text-xs text-gray-600 text-center">
                Esta es una vista de solo lectura del historial. Para continuar,
                ve a{" "}
                <Link href="/ai-lab" className="text-[#73B8E7] hover:underline">
                  AI Lab
                </Link>{" "}
                e inicia una nueva conversacion.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-2xl bg-[#0A1628] border border-[#1F2F58]/50 text-center px-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#1F2F58]/40 to-[#0A1628] flex items-center justify-center border border-[#1F2F58]/40 mb-4">
              <History className="w-8 h-8 text-[#73B8E7]/50" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Historial de conversaciones
            </h2>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed">
              Selecciona una conversacion del panel izquierdo para revisarla.
              Todas tus interacciones con el tutor IA se guardan automaticamente.
            </p>
            <Link href="/ai-lab" className="mt-6">
              <Button className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold gap-2">
                <MessageSquare className="w-4 h-4" />
                Ir al AI Lab
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

