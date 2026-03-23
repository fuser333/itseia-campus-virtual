"use client";

// ============================================================
// ITSEIA Academy — ComparisonMode
// Modo comparacion: Gemini en columna izquierda,
// modelo externo en columna derecha
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState } from "react";
import { ExternalLink, GitCompare, Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ChatPanel from "./ChatPanel";
import {
  EXTERNAL_MODELS,
  EXTERNAL_MODEL_URLS,
  type ExternalModelId,
} from "@/features/ai-lab/constants";

interface ComparisonModeProps {
  sessionContext?: string;
  className?: string;
}

export default function ComparisonMode({
  sessionContext,
  className,
}: ComparisonModeProps) {
  const [selectedModel, setSelectedModel] = useState<ExternalModelId>("chatgpt");
  const [lastQuestion, setLastQuestion] = useState("");
  const [mobileTab, setMobileTab] = useState<"gemini" | "external">("gemini");

  function handleOpenExternal() {
    if (!lastQuestion.trim()) return;
    const url = EXTERNAL_MODEL_URLS[selectedModel](lastQuestion);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // Para capturar la ultima pregunta desde ChatPanel
  // usamos una funcion de callback via onFirstMessage
  // La implementacion limpia: pasamos un ref del input via context
  // Para simplicidad: el estudiante puede copiar la pregunta y abrirla

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header del modo comparacion */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0A1628]/60 border-b border-[#1F2F58]/40">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#73B8E7]/20 to-[#FBBC0C]/20 border border-[#1F2F58]/40">
          <GitCompare className="w-4 h-4 text-[#73B8E7]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Modo Comparacion</h3>
          <p className="text-[10px] text-gray-500">
            Compara la respuesta de Gemini con otro modelo de IA
          </p>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden ml-auto flex items-center gap-1 bg-[#1F2F58]/40 rounded-lg p-1">
          <button
            onClick={() => setMobileTab("gemini")}
            className={cn(
              "px-2 py-1 rounded-md text-[10px] font-medium transition-all",
              mobileTab === "gemini"
                ? "bg-[#FBBC0C] text-[#0A1628]"
                : "text-gray-400 hover:text-white"
            )}
          >
            Gemini
          </button>
          <button
            onClick={() => setMobileTab("external")}
            className={cn(
              "px-2 py-1 rounded-md text-[10px] font-medium transition-all",
              mobileTab === "external"
                ? "bg-[#73B8E7] text-[#0A1628]"
                : "text-gray-400 hover:text-white"
            )}
          >
            Externo
          </button>
        </div>
      </div>

      {/* Instruccion */}
      <div className="px-4 py-2 bg-[#1F2F58]/10 border-b border-[#1F2F58]/20">
        <p className="text-[10px] text-gray-500 leading-relaxed">
          <span className="text-[#FBBC0C] font-medium">Como usar:</span>{" "}
          Escribe tu pregunta en el chat de Gemini (izquierda). Luego copia tu pregunta,
          pégala en el campo de abajo y abre el modelo externo para comparar respuestas.
        </p>
      </div>

      {/* Cuerpo: dos columnas en desktop, tabs en mobile */}
      <div className="flex-1 flex overflow-hidden">
        {/* Columna izquierda: Gemini */}
        <div
          className={cn(
            "flex-1 border-r border-[#1F2F58]/40 overflow-hidden",
            "hidden md:flex md:flex-col",
            mobileTab === "gemini" ? "flex flex-col" : "hidden"
          )}
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0A1628]/40 border-b border-[#1F2F58]/30">
            <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="text-xs font-semibold text-gray-300">Gemini (ITSEIA)</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[#4285F4]/15 text-[#4285F4]">
              Integrado
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              context={sessionContext}
              className="h-full rounded-none border-none"
            />
          </div>
        </div>

        {/* Columna derecha: Modelo externo */}
        <div
          className={cn(
            "w-full md:w-[340px] md:flex-none flex flex-col",
            mobileTab === "external" ? "flex" : "hidden md:flex"
          )}
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0A1628]/40 border-b border-[#1F2F58]/30">
            <Columns2 className="w-3 h-3 text-[#73B8E7]" />
            <span className="text-xs font-semibold text-gray-300">Modelo externo</span>
          </div>

          <div className="flex-1 flex flex-col p-4 gap-4">
            {/* Selector de modelo */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Seleccionar modelo
              </label>
              <div className="flex flex-col gap-2">
                {EXTERNAL_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left",
                      selectedModel === model.id
                        ? "border-[#73B8E7]/50 bg-[#73B8E7]/10 text-white"
                        : "border-[#1F2F58]/40 bg-[#0A1628]/40 text-gray-400 hover:border-[#1F2F58]/60 hover:text-gray-200"
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: model.color }}
                    />
                    {model.name}
                    {selectedModel === model.id && (
                      <span
                        className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                        style={{
                          background: model.color + "20",
                          color: model.color,
                        }}
                      >
                        Seleccionado
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo de pregunta para abrir externo */}
            <div className="flex-1 flex flex-col">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Tu pregunta
              </label>
              <textarea
                value={lastQuestion}
                onChange={(e) => setLastQuestion(e.target.value)}
                placeholder="Pega aqui la pregunta que enviaste a Gemini para compararla..."
                rows={4}
                className="flex-1 w-full resize-none bg-[#1F2F58]/20 border border-[#1F2F58]/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#73B8E7]/50 focus:ring-1 focus:ring-[#73B8E7]/20 transition-all"
              />
            </div>

            {/* Boton abrir externo */}
            <Button
              onClick={handleOpenExternal}
              disabled={!lastQuestion.trim()}
              className={cn(
                "w-full gap-2 font-semibold h-11 rounded-xl transition-all",
                lastQuestion.trim()
                  ? "bg-[#73B8E7] text-[#0A1628] hover:bg-[#73B8E7]/90 shadow-lg shadow-[#73B8E7]/10"
                  : "bg-[#1F2F58]/40 text-gray-500"
              )}
            >
              <ExternalLink className="w-4 h-4" />
              Abrir en{" "}
              {EXTERNAL_MODELS.find((m) => m.id === selectedModel)?.name}
            </Button>

            {/* Nota */}
            <div className="rounded-xl bg-[#1F2F58]/20 border border-[#1F2F58]/30 px-3 py-2.5">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Se abrira una nueva pestana con tu pregunta precargada en{" "}
                {EXTERNAL_MODELS.find((m) => m.id === selectedModel)?.name}.
                Compara las respuestas para desarrollar criterio sobre los modelos de IA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
