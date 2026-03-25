"use client";

// ============================================================
// ITSEIA Academy — CertificationCard
// Feature: 009-industry-certifications
// ============================================================

import Link from "next/link";
import { Award, Clock, DollarSign, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CertificationProgram, CertificationEnrollment } from "@/types/database";

interface Props {
  program: CertificationProgram;
  enrollment?: CertificationEnrollment | null;
  progressPercent?: number;
}

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  basico: {
    label: "Basico",
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  intermedio: {
    label: "Intermedio",
    color: "bg-[#FBBC0C]/15 text-[#FBBC0C] border-[#FBBC0C]/20",
  },
  avanzado: {
    label: "Avanzado",
    color: "bg-[#F0846D]/15 text-[#F0846D] border-[#F0846D]/20",
  },
};

const STATUS_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  actualizacion_pendiente: {
    label: "Actualizacion pendiente",
    icon: <AlertCircle className="w-3 h-3 text-[#FBBC0C]" />,
  },
  archivada: {
    label: "Archivada",
    icon: <AlertCircle className="w-3 h-3 text-white/40" />,
  },
};

const PROVIDER_COLORS: Record<string, string> = {
  AWS: "#FF9900",
  Google: "#4285F4",
  Microsoft: "#00A4EF",
  GitHub: "#6e5494",
};

function ProviderIcon({ provider }: { provider: string }) {
  const color = PROVIDER_COLORS[provider] || "#73B8E7";

  if (provider === "AWS") {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <path
          d="M13.6 28.8c-.4.2-.8.3-1.2.1l-4.5-2.6c-.3-.2-.5-.5-.5-.9V20c0-.4.2-.7.5-.9l4.5-2.6c.4-.2.8-.2 1.2 0l4.5 2.6c.3.2.5.5.5.9v5.4c0 .4-.2.7-.5.9l-4.5 2.5z"
          fill={color}
        />
        <path
          d="M35.4 28.8c-.4.2-.8.3-1.2.1l-4.5-2.6c-.3-.2-.5-.5-.5-.9V20c0-.4.2-.7.5-.9l4.5-2.6c.4-.2.8-.2 1.2 0l4.5 2.6c.3.2.5.5.5.9v5.4c0 .4-.2.7-.5.9l-4.5 2.5z"
          fill={color}
        />
        <path
          d="M24.5 37.4c-.4.2-.8.3-1.2.1l-4.5-2.6c-.3-.2-.5-.5-.5-.9v-5.4c0-.4.2-.7.5-.9l4.5-2.6c.4-.2.8-.2 1.2 0l4.5 2.6c.3.2.5.5.5.9V34c0 .4-.2.7-.5.9l-4.5 2.5z"
          fill={color}
        />
      </svg>
    );
  }

  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
      style={{ backgroundColor: color }}
    >
      {provider.slice(0, 2)}
    </div>
  );
}

export default function CertificationCard({
  program,
  enrollment,
  progressPercent,
}: Props) {
  const levelConfig = LEVEL_LABELS[program.nivel_dificultad] || LEVEL_LABELS.basico;
  const statusInfo =
    program.estado !== "activa" ? STATUS_LABELS[program.estado] : null;
  const isArchived = program.estado === "archivada";
  const isEnrolled = !!enrollment;

  return (
    <Link
      href={`/certificaciones/${program.slug}`}
      className={cn(
        "group block rounded-2xl border bg-white/5 p-5 transition-all duration-200",
        isArchived
          ? "border-white/5 opacity-60 cursor-not-allowed pointer-events-none"
          : "border-white/10 hover:border-[#FBBC0C]/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-[#FBBC0C]/5"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <ProviderIcon provider={program.proveedor} />
        <div className="flex items-center gap-2">
          {statusInfo && (
            <div className="flex items-center gap-1 rounded-full bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 px-2 py-0.5">
              {statusInfo.icon}
              <span className="text-[10px] text-[#FBBC0C] font-medium">
                {statusInfo.label}
              </span>
            </div>
          )}
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
              levelConfig.color
            )}
          >
            {levelConfig.label}
          </span>
        </div>
      </div>

      {/* Name & Provider */}
      <div className="mb-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#73B8E7]/70 mb-1">
          {program.proveedor}
        </p>
        <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#FBBC0C] transition-colors">
          {program.nombre}
        </h3>
      </div>

      {/* Description */}
      {program.descripcion && (
        <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-4">
          {program.descripcion}
        </p>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-3 text-white/40 text-xs mb-4">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {program.dominios_count} dominios
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          ~{program.duracion_horas_estimada}h
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          Examen ${program.costo_examen_usd}
        </span>
        <span className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          Aprobacion {program.umbral_aprobacion_porcentaje}%
        </span>
      </div>

      {/* Progress bar (if enrolled) */}
      {isEnrolled && progressPercent !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-white/40">Progreso</span>
            <span className="text-[11px] font-semibold text-[#FBBC0C]">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-500"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-[11px] text-white/30">
          {program.idioma_examen === "ingles" ? "Examen en ingles" : "Examen en espanol"}
        </span>
        {isEnrolled ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            En curso
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-[#FBBC0C] group-hover:underline">
            Ver certificacion &rarr;
          </span>
        )}
      </div>
    </Link>
  );
}
