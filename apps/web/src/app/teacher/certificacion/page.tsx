"use client";

// ============================================================
// /teacher/certificacion — Mi Certificacion (alias/summary)
// Redirige y muestra el estado de certificacion CES 120h
// ============================================================

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Loader2,
  Award,
  Download,
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TrainingProgressSummary } from "@/types/database";

const HOURS_TOTAL = 120;

export default function MiCertificacionPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [progress, setProgress] = useState<TrainingProgressSummary | null>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [certMessage, setCertMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      const res = await fetch(
        `/api/teacher/training-progress?teacher_id=${user.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleDownloadCertificate() {
    if (!userId) return;
    setDownloadingCert(true);
    try {
      const res = await fetch(
        `/api/teacher/certificate?teacher_id=${userId}`
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "certificado-docencia-virtual-itseia.pdf";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const data = await res.json();
        setCertMessage(data.error || "Error generando certificado");
      }
    } catch {
      setCertMessage("Error de red generando certificado");
    } finally {
      setDownloadingCert(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  const hoursCompleted = progress?.hoursCompleted ?? 0;
  const percentage = Math.min(
    Math.round((hoursCompleted / HOURS_TOTAL) * 100),
    100
  );
  const hasCertificate = progress?.hasCertificate ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Certificacion</h1>
        <p className="mt-1 text-sm text-white/50">
          Certificacion en Docencia Virtual Efectiva — Art. 61 RRA 2022 (CES Ecuador)
        </p>
      </div>

      {/* Certificate message */}
      {certMessage && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          {certMessage}
        </div>
      )}

      {/* Certificate status card */}
      <Card
        className={
          hasCertificate
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-transparent"
            : "border-[#1F2F58]/10 bg-gradient-to-br from-[#1F2F58]/5 to-transparent"
        }
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            {/* Icon */}
            <div
              className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${
                hasCertificate ? "bg-emerald-100" : "bg-[#1F2F58]/10"
              }`}
            >
              {hasCertificate ? (
                <Award className="size-9 text-emerald-600" />
              ) : (
                <GraduationCap className="size-9 text-[#73B8E7]" />
              )}
            </div>

            {/* Status */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <p className="text-lg font-bold text-white">
                  Docencia Virtual Efectiva — 120 horas
                </p>
                {hasCertificate ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="size-3.5" />
                    Certificado obtenido
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBBC0C]/20 px-3 py-1 text-xs font-semibold text-[#73B8E7]">
                    <Clock className="size-3.5" />
                    En progreso
                  </span>
                )}
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white/75">
                    {hoursCompleted} de {HOURS_TOTAL} horas completadas
                  </span>
                  <span className="font-bold text-[#73B8E7]">
                    {percentage}%
                  </span>
                </div>
                <div className="h-3 w-full max-w-sm rounded-full bg-white/15">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      hasCertificate ? "bg-emerald-500" : "bg-[#1F2F58]"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {!hasCertificate && (
                  <p className="mt-1.5 text-xs text-white/55">
                    Faltan {(HOURS_TOTAL - hoursCompleted).toFixed(1)} horas para
                    obtener tu certificado
                  </p>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="shrink-0">
              {hasCertificate ? (
                <Button
                  onClick={handleDownloadCertificate}
                  disabled={downloadingCert}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {downloadingCert ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Descargar PDF
                </Button>
              ) : (
                <Link href="/teacher/capacitacion">
                  <Button className="gap-2 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white">
                    <ArrowRight className="size-4" />
                    Continuar capacitacion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What it covers */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-white">
          Que cubre este certificado
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Fundamentos de educacion virtual", hours: "15h" },
            { label: "Herramientas digitales para docentes", hours: "15h" },
            { label: "Diseno de experiencias de aprendizaje", hours: "20h" },
            { label: "Evaluacion en entornos virtuales", hours: "15h" },
            { label: "Inteligencia Artificial en educacion", hours: "20h" },
            { label: "Tutoria y acompanamiento online", hours: "15h" },
            { label: "Accesibilidad e inclusion digital", hours: "10h" },
            { label: "Normativa CES y buenas practicas", hours: "10h" },
          ].map((item) => (
            <Card key={item.label} size="sm">
              <CardContent className="py-3">
                <div className="flex items-start gap-2">
                  <FileCheck className="size-4 shrink-0 text-[#73B8E7] mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-white">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-white/55 mt-0.5">
                      {item.hours}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA to full training */}
      {!hasCertificate && (
        <div className="rounded-lg border border-[#FBBC0C]/30 bg-[#FBBC0C]/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-white">
                Completa tu capacitacion modulo a modulo
              </p>
              <p className="mt-0.5 text-sm text-white/50">
                Accede al curso completo con todos los modulos, contenido y seguimiento.
              </p>
            </div>
            <Link href="/teacher/capacitacion">
              <Button className="gap-2 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white whitespace-nowrap">
                <GraduationCap className="size-4" />
                Ver curso 120h
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
