"use client";

// ============================================================
// TrainingProgress — Widget compacto para el dashboard docente
// Muestra progreso de capacitacion 120h y link a la pagina
// ============================================================

import Link from "next/link";
import { GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TrainingProgressSummary } from "@/types/database";

interface TrainingProgressProps {
  progress: TrainingProgressSummary;
  compact?: boolean;
}

export function TrainingProgress({ progress, compact = false }: TrainingProgressProps) {
  const { hoursCompleted, hoursTotal, hasCertificate } = progress;
  const percentage = Math.min(Math.round((hoursCompleted / hoursTotal) * 100), 100);

  const barColor =
    hasCertificate
      ? "bg-emerald-500"
      : percentage >= 75
      ? "bg-[#73B8E7]"
      : percentage >= 40
      ? "bg-[#FBBC0C]"
      : "bg-[#1F2F58]";

  if (compact) {
    return (
      <Link href="/teacher/capacitacion" className="block">
        <div className="flex items-center gap-3 rounded-lg border border-[#1F2F58]/10 bg-[#1F2F58]/5 px-3 py-2 hover:bg-[#1F2F58]/10 transition-colors">
          <GraduationCap className="size-4 shrink-0 text-[#1F2F58]" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-[#1F2F58]">Capacitacion CES</span>
              <span className={`font-semibold ${hasCertificate ? "text-emerald-600" : "text-gray-700"}`}>
                {hoursCompleted}/{hoursTotal}h
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div
                className={`h-1.5 rounded-full transition-all ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          {hasCertificate && (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          )}
        </div>
      </Link>
    );
  }

  return (
    <Card className="border-[#1F2F58]/10 bg-gradient-to-br from-[#1F2F58]/5 to-transparent">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1F2F58]/10">
            <GraduationCap className="size-5 text-[#1F2F58]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <p className="font-semibold text-gray-900">Capacitacion Docente 120h</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Requisito Art. 61 RRA 2022 — CES Ecuador
                </p>
              </div>
              {hasCertificate ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                  Certificado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FBBC0C]/20 px-2.5 py-1 text-xs font-medium text-[#1F2F58]">
                  En progreso
                </span>
              )}
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-gray-600">
                  {hoursCompleted} de {hoursTotal} horas completadas
                </span>
                <span className="font-bold text-[#1F2F58]">{percentage}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                {hoursTotal - hoursCompleted > 0
                  ? `Faltan ${(hoursTotal - hoursCompleted).toFixed(1)} horas para completar la capacitacion`
                  : "Has completado todas las horas requeridas"}
              </p>
            </div>

            <div className="mt-3">
              <Link
                href="/teacher/capacitacion"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1F2F58] hover:text-[#2A3F6E] transition-colors"
              >
                Ver mi capacitacion
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
