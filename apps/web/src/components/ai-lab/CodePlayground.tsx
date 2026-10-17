"use client";

// ============================================================
// ITSEIA Academy — CodePlayground
// Editor de codigo con ejecucion Pyodide en Web Worker
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Save,
  Wrench,
  Loader2,
  Code2,
  RotateCcw,
  ChevronDown,
  Globe,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import PlaygroundOutput, { type PlaygroundOutputData } from "./PlaygroundOutput";
import { PLAYGROUND_TIMEOUT_MS } from "@/features/ai-lab/constants";

interface CodePlaygroundProps {
  sessionId?: string | null;
  initialCode?: string;
  initialLanguage?: "python" | "javascript";
  onDebugWithAI?: (code: string, error: string) => void;
  className?: string;
}

const DEFAULT_PYTHON = `# Escribe tu codigo Python aqui
# Ejemplo:
print("Hola ITSEIA!")

numeros = [1, 2, 3, 4, 5]
suma = sum(numeros)
print(f"La suma de {numeros} es {suma}")
`;

const DEFAULT_JS = `// Escribe tu codigo JavaScript aqui
// Ejemplo:
console.log("Hola ITSEIA!");

const numeros = [1, 2, 3, 4, 5];
const suma = numeros.reduce((a, b) => a + b, 0);
console.log(\`La suma de [\${numeros}] es \${suma}\`);
`;

export default function CodePlayground({
  sessionId,
  initialCode,
  initialLanguage = "python",
  onDebugWithAI,
  className,
}: CodePlaygroundProps) {
  const [language, setLanguage] = useState<"python" | "javascript">(
    initialLanguage
  );
  const [code, setCode] = useState(
    initialCode ?? (initialLanguage === "python" ? DEFAULT_PYTHON : DEFAULT_JS)
  );
  const [result, setResult] = useState<PlaygroundOutputData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [pyodideStatus, setPyodideStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [mode, setMode] = useState<"local" | "colab">("local");

  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inicializar el worker cuando el componente monta
  useEffect(() => {
    return () => {
      // Cleanup: terminar worker al desmontar
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function getOrCreateWorker(): Worker {
    if (!workerRef.current) {
      const worker = new Worker(
        new URL("../../features/ai-lab/pyodide-worker.ts", import.meta.url),
        { type: "module" }
      );
      workerRef.current = worker;

      worker.onmessage = (e: MessageEvent) => {
        if (e.data?.type === "ready") {
          setPyodideStatus("ready");
        }
      };

      worker.onerror = () => {
        setPyodideStatus("error");
      };

      if (language === "python") {
        setPyodideStatus("loading");
      }
    }
    return workerRef.current;
  }

  const runCode = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult(null);

    if (language === "python" && pyodideStatus === "idle") {
      setPyodideStatus("loading");
    }

    const worker = getOrCreateWorker();

    // Timeout de 10 segundos
    timeoutRef.current = setTimeout(() => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setResult({
        output: "",
        error: null,
        duration_ms: PLAYGROUND_TIMEOUT_MS,
        timed_out: true,
      });
      setIsRunning(false);
      if (language === "python") setPyodideStatus("idle");
    }, PLAYGROUND_TIMEOUT_MS);

    const messageHandler = (e: MessageEvent) => {
      const data = e.data as {
        type: string;
        output?: string;
        error?: string | null;
        duration_ms?: number;
        has_image?: boolean;
        image_b64?: string;
      };

      if (data.type === "output") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setResult({
          output: data.output ?? "",
          error: data.error ?? null,
          duration_ms: data.duration_ms ?? 0,
          has_image: data.has_image,
          image_b64: data.image_b64,
        });
        setIsRunning(false);
        if (language === "python") setPyodideStatus("ready");

        worker.removeEventListener("message", messageHandler);
      } else if (data.type === "ready") {
        setPyodideStatus("ready");
      }
    };

    worker.addEventListener("message", messageHandler);
    worker.postMessage({ type: "run", code, language });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, language, isRunning, pyodideStatus]);

  function handleLanguageChange(lang: "python" | "javascript") {
    setLanguage(lang);
    setShowLangDropdown(false);
    if (!initialCode) {
      setCode(lang === "python" ? DEFAULT_PYTHON : DEFAULT_JS);
    }
    setResult(null);
    // Re-crear el worker para el nuevo lenguaje
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (lang === "python") {
      setPyodideStatus("idle");
    }
  }

  function handleDebugWithAI() {
    if (!result?.error || !onDebugWithAI) return;
    onDebugWithAI(code, result.error);
  }

  async function handleSave() {
    if (!code.trim()) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/ai-lab/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId ?? undefined,
          language,
          code,
          output: result?.output ?? "",
          title: code.trim().split("\n")[0].replace(/^#\s*/, "").slice(0, 50),
        }),
      });

      if (res.ok) {
        setSavedMsg("Guardado");
        setTimeout(() => setSavedMsg(""), 2500);
      }
    } catch (err) {
      console.error("Error guardando snippet:", err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setCode(language === "python" ? DEFAULT_PYTHON : DEFAULT_JS);
    setResult(null);
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[#0A1628] rounded-2xl overflow-hidden border border-[#1F2F58]/50",
        className
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1F2F58] border-b border-[#1F2F58]/30">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#FBBC0C]/15">
          <Code2 className="w-4 h-4 text-[#FBBC0C]" />
        </div>

        {/* Mode switcher: Local / Google Colab */}
        <div className="flex items-center rounded-lg bg-[#0A1628]/50 border border-[#1F2F58]/50 p-0.5">
          <button
            onClick={() => setMode("local")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
              mode === "local"
                ? "bg-[#FBBC0C]/15 text-[#FBBC0C]"
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            <Monitor className="w-3 h-3" />
            Local
          </button>
          <button
            onClick={() => setMode("colab")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
              mode === "colab"
                ? "bg-[#F9AB00]/15 text-[#F9AB00]"
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            <Globe className="w-3 h-3" />
            Google Colab
            <span className="text-[8px] px-1 py-0.5 rounded bg-[#73B8E7]/15 text-[#73B8E7]">Internet</span>
          </button>
        </div>

        {/* Language selector (only for local mode) */}
        <div className={cn("relative ml-2", mode === "colab" && "hidden")}>
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A1628]/50 border border-[#1F2F58]/50 text-xs font-medium text-gray-300 hover:text-white hover:border-[#1F2F58]/80 transition-all"
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                language === "python" ? "bg-[#3776AB]" : "bg-[#F7DF1E]"
              )}
            />
            {language === "python" ? "Python" : "JavaScript"}
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
          {showLangDropdown && (
            <div className="absolute top-full left-0 mt-1 w-36 rounded-xl bg-[#0D1B30] border border-[#1F2F58]/50 shadow-xl z-10 overflow-hidden">
              {(["python", "javascript"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-[#1F2F58]/40 transition-colors",
                    language === lang ? "text-white" : "text-gray-400"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      lang === "python" ? "bg-[#3776AB]" : "bg-[#F7DF1E]"
                    )}
                  />
                  {lang === "python" ? "Python 3" : "JavaScript"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pyodide status (local mode only) */}
        {mode === "local" && language === "python" && pyodideStatus === "loading" && (
          <span className="flex items-center gap-1.5 text-[10px] text-[#73B8E7] ml-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Cargando Python...
          </span>
        )}
        {mode === "local" && language === "python" && pyodideStatus === "ready" && (
          <span className="flex items-center gap-1.5 text-[10px] text-green-400 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Python listo
          </span>
        )}
        {mode === "local" && language === "python" && pyodideStatus === "error" && (
          <span className="text-[10px] text-red-400 ml-1">
            Error cargando Python
          </span>
        )}

        {/* Actions (local mode only) */}
        <div className={cn("ml-auto flex items-center gap-1.5", mode === "colab" && "hidden")}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleReset}
            className="text-gray-500 hover:text-white hover:bg-[#0A1628]/60"
            title="Restablecer codigo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !code.trim()}
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-[#0A1628]/60 gap-1.5 text-xs"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {savedMsg || "Guardar"}
          </Button>
          <Button
            onClick={runCode}
            disabled={isRunning || !code.trim()}
            size="sm"
            className={cn(
              "gap-1.5 text-xs font-semibold h-8 px-3 rounded-lg",
              isRunning
                ? "bg-[#1F2F58]/60 text-gray-500"
                : "bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 shadow-md shadow-[#FBBC0C]/10"
            )}
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Ejecutar
          </Button>
        </div>
      </div>

      {/* ── Google Colab Mode ── */}
      {mode === "colab" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center" style={{ minHeight: "500px" }}>
          <div className="flex size-20 items-center justify-center rounded-2xl bg-[#F9AB00]/10">
            <Globe className="size-10 text-[#F9AB00]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Google Colab</h3>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Python completo con internet, APIs, pip install, GPU gratis.
              Ideal para ejercicios que necesitan conexion a servicios externos.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <a
              href="https://colab.research.google.com/#create=true"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#F9AB00] px-6 py-3 text-sm font-semibold text-[#0A1628] hover:bg-[#F9AB00]/90 transition-colors shadow-lg shadow-[#F9AB00]/20"
            >
              <Globe className="size-4" />
              Abrir Google Colab
            </a>
            <p className="text-[10px] text-gray-600">
              Se abre en nueva ventana — requiere cuenta Google
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2 w-full max-w-sm">
            <div className="rounded-lg bg-[#1F2F58]/30 p-3 text-center">
              <p className="text-xs font-bold text-[#73B8E7]">Internet</p>
              <p className="text-[10px] text-gray-500">APIs, pip, wget</p>
            </div>
            <div className="rounded-lg bg-[#1F2F58]/30 p-3 text-center">
              <p className="text-xs font-bold text-[#FBBC0C]">GPU</p>
              <p className="text-[10px] text-gray-500">T4 gratis</p>
            </div>
            <div className="rounded-lg bg-[#1F2F58]/30 p-3 text-center">
              <p className="text-xs font-bold text-[#F0846D]">Librerias</p>
              <p className="text-[10px] text-gray-500">pandas, sklearn</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Local Editor + Output split ── */}
      <div className={cn("flex-1 flex flex-col overflow-hidden", mode === "colab" && "hidden")} style={{ minHeight: "500px" }}>
        {/* Editor area — 60% height */}
        <div className="relative" style={{ flex: "3 1 0%" }}>
          {/* Line numbers gutter */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#0D1B30] border-r border-[#1F2F58]/30 overflow-hidden pointer-events-none z-10">
            <div className="pt-3 px-1">
              {code.split("\n").map((_, i) => (
                <div key={i} className="text-[11px] text-gray-700 text-right pr-1 leading-relaxed font-mono h-[1.625rem]">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="absolute inset-0 w-full h-full bg-[#0A1628] text-[#E2E8F0] text-[13px] font-mono resize-none border-none outline-none pl-12 pr-4 py-3 scrollbar-thin leading-relaxed"
            style={{ tabSize: 2 }}
            placeholder={
              language === "python"
                ? "# Escribe tu codigo Python aqui...\n# Usa Ctrl+Enter para ejecutar"
                : "// Escribe tu codigo JavaScript aqui...\n// Usa Ctrl+Enter para ejecutar"
            }
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                const newCode =
                  code.substring(0, start) + "  " + code.substring(end);
                setCode(newCode);
                setTimeout(() => {
                  e.currentTarget.selectionStart = start + 2;
                  e.currentTarget.selectionEnd = start + 2;
                }, 0);
              }
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                runCode();
              }
            }}
          />
        </div>

        {/* ── Output area — 40% height, like a real terminal ── */}
        <div className="border-t-2 border-[#FBBC0C]/30 flex flex-col" style={{ flex: "2 1 0%" }}>
          {/* Output header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#0D1B30] border-b border-[#1F2F58]/30">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Terminal
              </span>
              {result && !result.error && !result.timed_out && (
                <span className="flex items-center gap-1 text-[10px] text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {result.duration_ms}ms
                  <span className="text-gray-600 ml-1">OK</span>
                </span>
              )}
              {result?.error && (
                <span className="flex items-center gap-1 text-[10px] text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Error
                </span>
              )}
            </div>
            {result?.error && onDebugWithAI && !result.timed_out && (
              <Button
                size="sm"
                onClick={handleDebugWithAI}
                className="gap-1.5 text-[10px] h-6 px-2 bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/20 rounded-md"
              >
                <Wrench className="w-3 h-3" />
                Depurar con IA
              </Button>
            )}
          </div>
          {/* Output content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#0A1628]">
            <PlaygroundOutput
              result={result}
              isRunning={isRunning}
              className="p-4 text-[13px] font-mono"
            />
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-1.5 border-t border-[#1F2F58]/30 bg-[#0D1B30]">
        <p className="text-[10px] text-gray-600">
          Ctrl + Enter para ejecutar | Tab para indentar |{" "}
          {language === "python"
            ? "Python 3.11 via WebAssembly (sin instalacion)"
            : "JavaScript en sandbox aislado"}
        </p>
      </div>
    </div>
  );
}
