"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  AI_MODELS,
  getCostIndicator,
  type AIModelId,
} from "@/lib/ai/models";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  selectedModel: AIModelId;
  onModelChange: (model: AIModelId) => void;
}

const MODEL_ENTRIES = Object.entries(AI_MODELS) as [AIModelId, (typeof AI_MODELS)[AIModelId]][];

export default function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const current = AI_MODELS[selectedModel];

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
          "bg-[#0A1628]/60 border border-[#1F2F58]/40 hover:border-[#73B8E7]/40",
          "text-gray-300 hover:text-white",
          isOpen && "border-[#73B8E7]/50 ring-1 ring-[#73B8E7]/20"
        )}
      >
        <span className="text-sm leading-none">{current.icon}</span>
        <span className="hidden sm:inline max-w-[100px] truncate">
          {current.name}
        </span>
        <ChevronDown
          className={cn(
            "w-3 h-3 text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-64 rounded-xl bg-[#0f1d35] border border-[#1F2F58]/60 shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-[#1F2F58]/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Seleccionar modelo
            </p>
          </div>

          <div className="py-1">
            {MODEL_ENTRIES.map(([id, model]) => {
              const isSelected = id === selectedModel;
              const cost = getCostIndicator(id);

              return (
                <button
                  key={id}
                  onClick={() => {
                    onModelChange(id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left",
                    isSelected
                      ? "bg-[#1F2F58]/60 text-white"
                      : "text-gray-400 hover:bg-[#1F2F58]/30 hover:text-gray-200"
                  )}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{
                      backgroundColor: `${model.color}15`,
                      borderColor: `${model.color}30`,
                      borderWidth: "1px",
                    }}
                  >
                    <span className="text-base leading-none">{model.icon}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {model.name}
                      </p>
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">
                      {model.description}
                    </p>
                  </div>

                  {/* Cost indicator */}
                  <div className="shrink-0">
                    <span
                      className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        color: model.color,
                        backgroundColor: `${model.color}15`,
                      }}
                    >
                      {cost}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-[#1F2F58]/30">
            <p className="text-[10px] text-gray-600 text-center">
              Todos usan la misma cuota mensual
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
