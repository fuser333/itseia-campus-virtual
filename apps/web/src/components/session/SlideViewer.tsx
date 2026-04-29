"use client";

import { useEffect, useState } from "react";
import {
  Presentation,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideViewerProps {
  slidesUrl: string;
  slidesType: "pdf" | "google_slides";
  title?: string;
  onViewed?: () => void;
  className?: string;
}

/** Determina si una URL es de Supabase Storage o cualquier asset privado */
function isPrivateStorageUrl(url: string): boolean {
  return (
    url.includes("supabase.co/storage") ||
    url.includes("supabase.co/object") ||
    url.includes("s3.amazonaws.com") ||
    url.includes("storage.googleapis.com")
  );
}

/**
 * Convierte la URL pública/de-presentación al embed correcto.
 * Retorna null si no se puede derivar un embed seguro (p.ej. asset privado S3).
 */
function getEmbedUrl(slidesUrl: string, slidesType: "pdf" | "google_slides"): string | null {
  // Supabase Storage / S3 directo → nunca embeddable seguro
  if (isPrivateStorageUrl(slidesUrl)) return null;

  // Gamma.app embed oficial: gamma.app/embed/{docId}
  // El docId es el ÚLTIMO segmento tras el último guión en /docs/TITLE-docId
  if (slidesUrl.includes("gamma.app/")) {
    if (slidesUrl.includes("/embed/")) return slidesUrl;
    const match = slidesUrl.match(/gamma\.app\/docs\/.*?-([a-z0-9]+)\/?(?:\?.*)?$/);
    if (match) return `https://gamma.app/embed/${match[1]}`;
    // Fallback: swap simple /docs/ → /embed/
    return slidesUrl.replace("/docs/", "/embed/");
  }

  if (slidesType === "google_slides") {
    if (slidesUrl.includes("/embed")) return slidesUrl;
    return slidesUrl.replace("/edit", "/embed").replace("/pub", "/embed");
  }

  // PDF: Google Docs viewer
  return `https://docs.google.com/gview?url=${encodeURIComponent(slidesUrl)}&embedded=true`;
}

export default function SlideViewer({
  slidesUrl,
  slidesType,
  title,
  onViewed,
  className,
}: SlideViewerProps) {
  const [viewed, setViewed] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [checking, setChecking] = useState(false);

  const embedUrl = getEmbedUrl(slidesUrl, slidesType);

  useEffect(() => {
    // Si la URL es de storage privado, mostramos fallback directamente
    if (!embedUrl) {
      setEmbedError(true);
      return;
    }

    // Marcar como visto al montar
    if (!viewed) {
      setViewed(true);
      onViewed?.();
    }
  }, [embedUrl, onViewed, viewed]);

  // Estado de carga inicial antes de resolver embed
  if (checking) {
    return (
      <div className="flex h-48 items-center justify-center gap-2">
        <Loader2 className="size-5 animate-spin text-[#FBBC0C]" />
        <span className="text-sm text-[#F9F6E7]/60">Cargando presentación...</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="size-4 text-[#73B8E7]" />
            <h3 className="text-sm font-semibold text-[#F9F6E7]">{title}</h3>
          </div>
          {viewed && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="size-3" />
              Vista
            </span>
          )}
        </div>
      )}

      {/* Slides embed o fallback */}
      {!embedError && embedUrl ? (
        <div className="overflow-hidden rounded-xl border border-[#1F2F58]/30 bg-[#0A1628] shadow-sm">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              allowFullScreen
              title={title || "Presentación de la sesión"}
              onError={() => setEmbedError(true)}
            />
          </div>
        </div>
      ) : (
        /* Fallback bonito cuando no se puede embeber (URL privada o error 403) */
        <div className="flex flex-col items-center gap-5 rounded-xl border border-[#FBBC0C]/25 bg-gradient-to-br from-[#1F2F58]/60 to-[#0A1628]/80 p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FBBC0C]/15">
            <Presentation className="size-8 text-[#FBBC0C]" />
          </div>
          <div>
            <p className="font-semibold text-[#F9F6E7]">
              Presentación disponible
            </p>
            <p className="mt-1.5 text-sm text-[#F9F6E7]/65 max-w-xs">
              Haz clic en el botón para abrir la presentación en una nueva pestaña.
            </p>
          </div>
          <a href={slidesUrl} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 shadow-md shadow-[#FBBC0C]/20">
              <ExternalLink className="size-4" />
              Abrir presentación
            </Button>
          </a>
          <p className="text-[10px] text-[#F9F6E7]/35">
            Se abrirá en una nueva pestaña de tu navegador
          </p>
        </div>
      )}

      {/* Enlace externo — solo si hay embed exitoso */}
      {!embedError && embedUrl && (
        <div className="flex justify-end">
          <a
            href={slidesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#73B8E7] transition-colors hover:text-[#FBBC0C]"
          >
            <ExternalLink className="size-3" />
            Abrir en nueva pestaña
          </a>
        </div>
      )}
    </div>
  );
}
