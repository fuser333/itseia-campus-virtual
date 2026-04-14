"use client";

import { useEffect, useState } from "react";
import { Presentation, CheckCircle2, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideViewerProps {
  slidesUrl: string;
  slidesType: "pdf" | "google_slides";
  title?: string;
  onViewed?: () => void;
  className?: string;
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

  useEffect(() => {
    // Mark as viewed on mount
    if (!viewed) {
      setViewed(true);
      onViewed?.();
    }
  }, [onViewed, viewed]);

  function getEmbedUrl(): string {
    // Gamma.app embed: /docs/TITLE-ID → /embed/TITLE-ID
    if (slidesUrl.includes("gamma.app/docs/")) {
      return slidesUrl.replace("/docs/", "/embed/");
    }
    if (slidesType === "google_slides") {
      // If it's already an embed URL, use as-is
      if (slidesUrl.includes("/embed")) return slidesUrl;
      // Convert Google Slides URL to embed
      return slidesUrl.replace("/edit", "/embed").replace("/pub", "/embed");
    }
    // PDF: use Google Docs viewer
    return `https://docs.google.com/gview?url=${encodeURIComponent(slidesUrl)}&embedded=true`;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="size-4 text-[#73B8E7]" />
            <h3 className="text-sm font-semibold text-[#0A1628]">{title}</h3>
          </div>
          {viewed && (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle2 className="size-3" />
              Visto
            </span>
          )}
        </div>
      )}

      {/* Slides embed */}
      {!embedError ? (
        <div className="overflow-hidden rounded-xl border border-[#1F2F58]/10 bg-white shadow-sm">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={getEmbedUrl()}
              className="absolute inset-0 h-full w-full"
              allowFullScreen
              title={title || "Presentacion de la sesion"}
              onError={() => setEmbedError(true)}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-[#FBBC0C]/20 bg-[#FBBC0C]/5 p-8 text-center">
          <AlertTriangle className="size-8 text-[#FBBC0C]" />
          <div>
            <p className="font-medium text-[#0A1628]">
              No se pudo cargar la presentacion
            </p>
            <p className="mt-1 text-sm text-[#1F2F58]/70">
              Puedes descargarla directamente usando el boton de abajo.
            </p>
          </div>
          <a href={slidesUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="gap-2 border-[#FBBC0C]/30 text-[#FBBC0C] hover:bg-[#FBBC0C]/10"
            >
              <ExternalLink className="size-4" />
              Abrir presentacion
            </Button>
          </a>
        </div>
      )}

      {/* External link */}
      <div className="flex justify-end">
        <a
          href={slidesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[#73B8E7] transition-colors hover:text-[#1F2F58]"
        >
          <ExternalLink className="size-3" />
          Abrir en nueva pestana
        </a>
      </div>
    </div>
  );
}
