"use client";

// ============================================================
// ITSEIA Academy — SourceIngester (Segundo Cerebro)
// Feature: segundo-cerebro-mvp
//
// Formulario para agregar fuentes externas:
// - URL de articulo
// - URL de YouTube
// - Archivo PDF
// ============================================================

import { useState, useRef } from "react";
import {
  Link,
  Youtube,
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SourceTab = "url" | "youtube" | "pdf";

interface SourceIngesterProps {
  onIngested?: (source: {
    id: string;
    title: string;
    source_type: string;
  }) => void;
  className?: string;
}

export default function SourceIngester({
  onIngested,
  className,
}: SourceIngesterProps) {
  const [activeTab, setActiveTab] = useState<SourceTab>("url");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleIngestUrl() {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/brain/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "url", url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({ type: "error", message: data.error || "Error al ingestar URL" });
        return;
      }

      setResult({
        type: "success",
        message: `"${data.source.title}" agregado (${data.extracted.chars.toLocaleString()} caracteres)`,
      });
      setUrl("");
      onIngested?.(data.source);
    } catch {
      setResult({ type: "error", message: "Error de conexion" });
    } finally {
      setLoading(false);
    }
  }

  async function handleIngestYoutube() {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/brain/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "youtube", url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({
          type: "error",
          message: data.error || "Error al obtener transcripcion",
        });
        return;
      }

      setResult({
        type: "success",
        message: `"${data.source.title}" (${data.extracted.duration}) agregado`,
      });
      setUrl("");
      onIngested?.(data.source);
    } catch {
      setResult({ type: "error", message: "Error de conexion" });
    } finally {
      setLoading(false);
    }
  }

  async function handleIngestPdf(file: File) {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/brain/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({ type: "error", message: data.error || "Error al procesar PDF" });
        return;
      }

      setResult({
        type: "success",
        message: `"${data.source.title}" (${data.extracted.pages} pags, ${data.extracted.chars.toLocaleString()} chars) agregado`,
      });
      onIngested?.(data.source);
    } catch {
      setResult({ type: "error", message: "Error de conexion" });
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const tabs: { id: SourceTab; label: string; icon: React.ReactNode }[] = [
    { id: "url", label: "URL", icon: <Link className="w-3 h-3" /> },
    {
      id: "youtube",
      label: "YouTube",
      icon: <Youtube className="w-3 h-3" />,
    },
    { id: "pdf", label: "PDF", icon: <FileText className="w-3 h-3" /> },
  ];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Agregar fuente externa
      </h3>

      {/* Tabs de tipo */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setUrl("");
              setResult(null);
            }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all",
              activeTab === tab.id
                ? "bg-[#1F2F58]/50 text-white border border-[#1F2F58]/60"
                : "text-gray-500 hover:text-gray-300 hover:bg-[#1F2F58]/20"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input para URL / YouTube */}
      {(activeTab === "url" || activeTab === "youtube") && (
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                activeTab === "youtube"
                  ? handleIngestYoutube()
                  : handleIngestUrl();
              }
            }}
            placeholder={
              activeTab === "youtube"
                ? "https://www.youtube.com/watch?v=..."
                : "https://ejemplo.com/articulo"
            }
            disabled={loading}
            className="flex-1 bg-[#0A1628]/60 border border-[#1F2F58]/50 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FBBC0C]/50 disabled:opacity-50"
          />
          <button
            onClick={
              activeTab === "youtube" ? handleIngestYoutube : handleIngestUrl
            }
            disabled={loading || !url.trim()}
            className="flex items-center gap-1 px-3 py-2 bg-[#FBBC0C] text-[#0A1628] rounded-lg text-xs font-semibold hover:bg-[#FBBC0C]/90 disabled:opacity-50 transition-all whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            {loading ? "Procesando..." : "Agregar"}
          </button>
        </div>
      )}

      {/* Input para PDF */}
      {activeTab === "pdf" && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleIngestPdf(file);
            }}
            disabled={loading}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className={cn(
              "w-full flex flex-col items-center gap-2 py-6 rounded-lg border-2 border-dashed transition-all",
              loading
                ? "border-[#1F2F58]/30 opacity-50"
                : "border-[#1F2F58]/40 hover:border-[#FBBC0C]/40 hover:bg-[#FBBC0C]/5 cursor-pointer"
            )}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 text-[#73B8E7] animate-spin" />
            ) : (
              <FileText className="w-6 h-6 text-gray-500" />
            )}
            <span className="text-xs text-gray-400">
              {loading
                ? "Extrayendo texto del PDF..."
                : "Click para seleccionar PDF (max 10MB)"}
            </span>
          </button>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div
          className={cn(
            "flex items-start gap-2 px-3 py-2 rounded-lg text-[11px]",
            result.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-[#F0846D]/10 text-[#F0846D] border border-[#F0846D]/20"
          )}
        >
          {result.type === "success" ? (
            <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          )}
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
}
