"use client";

// ── /certificaciones/[slug] ───────────────────────────────
// Certification detail page: header stats, domain accordion, exam CTA.

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Clock,
  DollarSign,
  Loader2,
  PlayCircle,
  ShieldCheck,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import DomainList from "@/components/certifications/DomainList";
import ExamHistoryChart from "@/components/certifications/ExamHistoryChart";
import { cn } from "@/lib/utils";
import type {
  CertificationProgramWithDomains,
  ExamAttempt,
} from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  basico: { label: "Basico", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  intermedio: { label: "Intermedio", color: "text-[#FBBC0C] bg-[#FBBC0C]/10 border-[#FBBC0C]/20" },
  avanzado: { label: "Avanzado", color: "text-[#F0846D] bg-[#F0846D]/10 border-[#F0846D]/20" },
};

export default function CertificationDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState<CertificationProgramWithDomains | null>(null);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);

    // Fetch certification with domains
    const res = await fetch(`/api/certifications/detail?slug=${slug}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setCert(data.certification);

    // Fetch exam history
    if (user && data.certification?.id) {
      const attemptsRes = await fetch(
        `/api/certifications/attempts?certification_id=${data.certification.id}`
      );
      if (attemptsRes.ok) {
        const attData = await attemptsRes.json();
        setAttempts(attData.attempts || []);
      }
    }

    setLoading(false);
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleEnroll() {
    if (!cert) return;
    setEnrolling(true);
    try {
      const res = await fetch("/api/certifications/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certification_id: cert.id }),
      });
      if (res.ok) {
        await loadData();
      }
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#FBBC0C]" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="p-6 text-center">
        <p className="text-white/40">Certificacion no encontrada.</p>
        <Link href="/certificaciones" className="mt-4 inline-block">
          <Button variant="outline" className="border-white/10 text-white/60">
            Volver al catalogo
          </Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = !!cert.enrollment;
  const levelConfig = LEVEL_LABELS[cert.nivel_dificultad] || LEVEL_LABELS.basico;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Link href="/certificaciones" className="hover:text-white/70 flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" />
          Certificaciones
        </Link>
        <span>/</span>
        <span className="text-white/60">{cert.nombre}</span>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start gap-5 flex-wrap">
          {/* Provider badge */}
          <div className="w-16 h-16 rounded-xl bg-[#1F2F58] flex items-center justify-center text-xl font-black text-[#FBBC0C] flex-shrink-0">
            {cert.proveedor.slice(0, 2)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#73B8E7]/70">
                {cert.proveedor}
              </p>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  levelConfig.color
                )}
              >
                {levelConfig.label}
              </span>
              {cert.estado !== "activa" && (
                <span className="flex items-center gap-1 rounded-full bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 px-2 py-0.5 text-[10px] text-[#FBBC0C]">
                  <AlertTriangle className="w-3 h-3" />
                  {cert.estado === "actualizacion_pendiente"
                    ? "Actualizacion pendiente"
                    : "Archivada"}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">{cert.nombre}</h1>

            {cert.descripcion && (
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {cert.descripcion}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#73B8E7]" />
                {cert.certification_domains.length} dominios
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#73B8E7]" />
                ~{cert.duracion_horas_estimada}h de preparacion
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#73B8E7]" />
                Examen oficial ${cert.costo_examen_usd}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#73B8E7]" />
                Aprobacion {cert.umbral_aprobacion_porcentaje}%
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#73B8E7]" />
                Examen en {cert.idioma_examen}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
            {isEnrolled ? (
              <Button
                onClick={() => router.push(`/certificaciones/${slug}/examen`)}
                className="bg-[#1F2F58] text-white hover:bg-[#2A3F6E] gap-2 border border-[#73B8E7]/20"
              >
                <PlayCircle className="w-4 h-4 text-[#FBBC0C]" />
                Modo Examen
              </Button>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={enrolling || !userId}
                className="bg-[#FBBC0C] text-[#0A1628] font-bold hover:bg-[#FBBC0C]/90 gap-2"
              >
                {enrolling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Iniciar preparacion
                  </>
                )}
              </Button>
            )}
            {isEnrolled && (
              <Button
                onClick={() => router.push(`/certificaciones/${slug}/examen`)}
                variant="outline"
                className="border-[#FBBC0C]/30 text-[#FBBC0C] hover:bg-[#FBBC0C]/5 gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Simulacro de examen
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Domains */}
      <div>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">
          Dominios del examen ({cert.certification_domains.length})
        </h2>
        <DomainList
          domains={cert.certification_domains}
          certificationSlug={slug}
        />
      </div>

      {/* Exam history chart */}
      {isEnrolled && (
        <ExamHistoryChart
          attempts={attempts}
          umbralPorcentaje={cert.umbral_aprobacion_porcentaje}
        />
      )}
    </div>
  );
}
