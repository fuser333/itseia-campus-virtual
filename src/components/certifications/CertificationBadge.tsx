"use client";

// ============================================================
// ITSEIA Academy — CertificationBadge
// Feature: 009-industry-certifications
// States: not_started | studying | simulacro_passed | officially_certified
// ============================================================

import { useState, useRef } from "react";
import { Award, CheckCircle2, Trophy, Upload, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { CertificationBadgeWithProgram, CertificationBadgeType } from "@/types/database";

type BadgeState = "not_started" | "studying" | "simulacro_passed" | "officially_certified";

interface Props {
  badge: CertificationBadgeWithProgram;
  showUpload?: boolean;     // show upload button (own profile)
  compact?: boolean;        // compact version for grid
  onUploaded?: () => void;
}

const BADGE_CONFIG: Record<
  CertificationBadgeType,
  {
    label: string;
    sublabel: string;
    chipColor: string;
    iconColor: string;
    borderColor: string;
    bgColor: string;
  }
> = {
  simulacro_aprobado: {
    label: "Simulacro Aprobado",
    sublabel: "Listo para el examen oficial",
    chipColor: "bg-[#FBBC0C]/15 text-[#FBBC0C] border-[#FBBC0C]/25",
    iconColor: "text-[#FBBC0C]",
    borderColor: "border-[#FBBC0C]/20",
    bgColor: "bg-[#FBBC0C]/5",
  },
  certificado_oficial: {
    label: "Certificado Oficial",
    sublabel: "Validado por ITSEIA",
    chipColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/25",
    bgColor: "bg-emerald-500/5",
  },
};

export default function CertificationBadge({
  badge,
  showUpload = false,
  compact = false,
  onUploaded,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = BADGE_CONFIG[badge.badge_type];
  const program = badge.certification_programs;
  const isOfficial = badge.badge_type === "certificado_oficial";

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      setUploadError(`El archivo no puede superar ${maxMB}MB`);
      return;
    }

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Solo se permiten archivos PDF, JPG, PNG o WEBP");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const ext = file.name.split(".").pop() || "pdf";
      const path = `${user.id}/${badge.certification_id}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("certification-evidence")
        .upload(path, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("certification-evidence")
        .getPublicUrl(path);

      // Update badge with evidence URL
      await supabase
        .from("certification_badges")
        .update({ evidencia_url: urlData.publicUrl })
        .eq("id", badge.id);

      onUploaded?.();
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "Error al subir el archivo"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (compact) {
    return (
      <div
        className={cn(
          "relative rounded-xl border p-4 flex flex-col items-center text-center gap-2 transition-all",
          config.bgColor,
          config.borderColor
        )}
      >
        {/* Glow effect for official */}
        {isOfficial && (
          <div className="absolute inset-0 rounded-xl bg-emerald-500/5 pointer-events-none" />
        )}

        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isOfficial ? "bg-emerald-500/20" : "bg-[#FBBC0C]/20"
          )}
        >
          {isOfficial ? (
            <Trophy className={cn("w-5 h-5", config.iconColor)} />
          ) : (
            <Award className={cn("w-5 h-5", config.iconColor)} />
          )}
        </div>

        {/* Provider + Name */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
            {program.proveedor}
          </p>
          <p className="text-xs font-bold text-white leading-tight">
            {program.nombre}
          </p>
        </div>

        {/* Badge chip */}
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            config.chipColor
          )}
        >
          {config.label}
        </span>

        {/* Date for official */}
        {isOfficial && badge.validation_date && (
          <p className="text-[10px] text-white/30">
            {new Date(badge.validation_date).toLocaleDateString("es-EC", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    );
  }

  // Full card version
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start gap-4">
        {/* Badge icon */}
        <div
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative",
            isOfficial ? "bg-emerald-500/20" : "bg-[#FBBC0C]/20"
          )}
        >
          {isOfficial ? (
            <>
              <Trophy className={cn("w-7 h-7", config.iconColor)} />
              <Star className="absolute -top-1 -right-1 w-4 h-4 text-emerald-400 fill-emerald-400" />
            </>
          ) : (
            <Award className={cn("w-7 h-7", config.iconColor)} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 mb-0.5">
                {program.proveedor}
              </p>
              <h4 className="text-sm font-bold text-white">{program.nombre}</h4>
            </div>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold flex-shrink-0",
                config.chipColor
              )}
            >
              {config.label}
            </span>
          </div>

          <p className="text-xs text-white/40 mt-1">{config.sublabel}</p>

          {/* Score */}
          {badge.score !== null && (
            <p className="text-xs text-white/60 mt-1">
              Puntaje simulacro:{" "}
              <span className="font-semibold text-[#FBBC0C]">
                {badge.score.toFixed(1)}%
              </span>
            </p>
          )}

          {/* Official validation date */}
          {isOfficial && badge.validation_date && (
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <p className="text-[11px] text-emerald-400">
                Validado el{" "}
                {new Date(badge.validation_date).toLocaleDateString("es-EC", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          {/* Upload button for students awaiting official validation */}
          {showUpload && !isOfficial && (
            <div className="mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              {badge.evidencia_url ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FBBC0C]" />
                  <span className="text-[11px] text-[#FBBC0C]">
                    Certificado subido — pendiente de validacion
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-white/30 hover:text-white/60 underline ml-1"
                  >
                    Reemplazar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border border-[#FBBC0C]/30 bg-[#FBBC0C]/5 px-3 py-1.5 text-xs font-medium text-[#FBBC0C] transition-all hover:bg-[#FBBC0C]/10",
                    uploading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  Subir certificado oficial
                </button>
              )}
              {uploadError && (
                <p className="mt-1 text-[11px] text-[#F0846D]">{uploadError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
