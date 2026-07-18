"use client";

// ============================================================
// ITSEIA Academy — PlaygroundOutput
// Panel de salida del Code Playground
// Feature: 010-ai-lab-advanced
// ============================================================

import { cn } from "@/lib/utils";
import { Terminal, AlertCircle, Clock, Image as ImageIcon } from "lucide-react";

export interface PlaygroundOutputData {
  output: string;
  error: string | null;
  duration_ms: number;
  has_image?: boolean;
  image_b64?: string;
  timed_out?: boolean;
}

interface PlaygroundOutputProps {
  result: PlaygroundOutputData | null;
  isRunning: boolean;
  className?: string;
}

export default function PlaygroundOutput({
  result,
  isRunning,
  className,
}: PlaygroundOutputProps) {
  if (isRunning) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-3 py-6 text-gray-400",
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-[#73B8E7] animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#73B8E7] animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#73B8E7] animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span className="text-sm">Ejecutando codigo...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 py-8 text-center",
          className
        )}
      >
        <Terminal className="w-8 h-8 text-gray-700" />
        <p className="text-sm text-gray-600">
          La salida del programa aparecera aqui
        </p>
        <p className="text-xs text-gray-700">
          Haz clic en &quot;Ejecutar&quot; para correr el codigo
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Barra de estado */}
      <div className="flex items-center gap-3 px-3 py-1.5 bg-[#0A1628]/60 rounded-t-xl border-b border-[#1F2F58]/30">
        <Terminal className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Salida
        </span>
        {result.duration_ms > 0 && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-600">
            <Clock className="w-3 h-3" />
            {result.duration_ms}ms
          </span>
        )}
        {/* Indicador de estado */}
        {result.timed_out ? (
          <span className="flex items-center gap-1 text-[10px] font-medium text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Timeout
          </span>
        ) : result.error ? (
          <span className="flex items-center gap-1 text-[10px] font-medium text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Error
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-medium text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            OK
          </span>
        )}
      </div>

      {/* Timeout especial */}
      {result.timed_out && (
        <div className="flex items-start gap-3 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl mx-0">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-300">
              Tiempo de ejecucion excedido (10s)
            </p>
            <p className="text-xs text-red-400/80 mt-0.5">
              Verifica si hay bucles infinitos en tu codigo (ej:{" "}
              <code className="font-mono">while True:</code> sin condicion de salida).
            </p>
          </div>
        </div>
      )}

      {/* Stdout */}
      {result.output && result.output.trim().length > 0 && (
        <pre className="px-3 py-2.5 text-xs font-mono text-green-300 bg-[#0A1628]/80 rounded-xl border border-[#1F2F58]/30 whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto scrollbar-thin">
          {result.output}
        </pre>
      )}

      {/* Stderr / Error */}
      {result.error && !result.timed_out && (
        <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">
              Error
            </span>
          </div>
          <pre className="text-xs font-mono text-red-300 whitespace-pre-wrap overflow-x-auto">
            {result.error}
          </pre>
        </div>
      )}

      {/* Imagen matplotlib */}
      {result.has_image && result.image_b64 && (
        <div className="rounded-xl border border-[#1F2F58]/40 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0A1628]/60 border-b border-[#1F2F58]/30">
            <ImageIcon className="w-3.5 h-3.5 text-[#73B8E7]" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Grafica generada
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${result.image_b64}`}
            alt="Grafica generada por matplotlib"
            className="w-full bg-white"
          />
        </div>
      )}

      {/* Sin salida */}
      {!result.timed_out &&
        !result.error &&
        (!result.output || result.output.trim().length === 0) &&
        !result.has_image && (
          <div className="px-3 py-2.5 text-center">
            <p className="text-xs text-gray-600">
              El codigo se ejecuto sin producir salida
            </p>
          </div>
        )}
    </div>
  );
}
