"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CertificateRow {
  id: string;
  code: string;
  issued_at: string;
  pdf_url: string | null;
  programs: {
    name: string;
    type: string;
  };
}

interface EnrollmentProgress {
  program_name: string;
  total_lessons: number;
  completed_lessons: number;
}

export default function CertificatesPage() {
  const supabase = createClient();
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [enrollmentProgress, setEnrollmentProgress] = useState<EnrollmentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("certificates")
        .select(`*, programs (name, type)`)
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });

      if (data) setCertificates(data as unknown as CertificateRow[]);

      // If no certificates, fetch enrollment progress for motivational message
      if (!data || data.length === 0) {
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select(`
            id,
            programs (name),
            status
          `)
          .eq("user_id", user.id)
          .eq("status", "active");

        if (enrollments && enrollments.length > 0) {
          const progressItems: EnrollmentProgress[] = [];
          for (const enrollment of enrollments) {
            const program = enrollment.programs as unknown as { name: string } | null;
            // Get courses for this enrollment's program
            const { data: courses } = await supabase
              .from("courses")
              .select("id")
              .eq("program_id", (enrollment as unknown as { id: string; programs: { name: string } }).id);

            if (courses) {
              const courseIds = courses.map((c) => c.id);
              if (courseIds.length > 0) {
                const { data: modules } = await supabase
                  .from("modules")
                  .select("id")
                  .in("course_id", courseIds);

                if (modules) {
                  const moduleIds = modules.map((m) => m.id);
                  if (moduleIds.length > 0) {
                    const { data: lessons } = await supabase
                      .from("lessons")
                      .select("id")
                      .in("module_id", moduleIds);

                    const { data: progress } = await supabase
                      .from("lesson_progress")
                      .select("id")
                      .eq("user_id", user.id)
                      .eq("completed", true);

                    progressItems.push({
                      program_name: program?.name || "Carrera",
                      total_lessons: lessons?.length || 0,
                      completed_lessons: progress?.length || 0,
                    });
                  }
                }
              }
            }
          }
          setEnrollmentProgress(progressItems);
        }
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleDownloadPDF(certificateId: string) {
    setDownloading(certificateId);
    try {
      const response = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId }),
      });

      if (!response.ok) {
        throw new Error("Error al generar el certificado");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-${certificateId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Hubo un error al descargar el certificado. Intenta de nuevo.");
    } finally {
      setDownloading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#FBBC0C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Mis Certificados</h1>

      {certificates.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FBBC0C]/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#FBBC0C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Aun no tienes certificados</h3>
            <p className="text-white/40 mb-6">
              Completa una carrera para obtener tu certificado oficial ITSEIA.
            </p>

            {/* Progress toward completing a program */}
            {enrollmentProgress.length > 0 && (
              <div className="mb-6 space-y-4 text-left max-w-md mx-auto">
                <p className="text-[#73B8E7] text-sm font-medium text-center">Tu progreso actual:</p>
                {enrollmentProgress.map((ep, idx) => {
                  const percent = ep.total_lessons > 0
                    ? Math.round((ep.completed_lessons / ep.total_lessons) * 100)
                    : 0;
                  return (
                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{ep.program_name}</span>
                        <span className="text-[#FBBC0C] text-sm font-bold">{percent}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-white/30 text-xs mt-2">
                        {ep.completed_lessons} de {ep.total_lessons} lecciones completadas
                      </p>
                    </div>
                  );
                })}
                <p className="text-white/40 text-xs text-center mt-2">
                  Sigue asi, cada leccion te acerca mas a tu certificado.
                </p>
              </div>
            )}

            {enrollmentProgress.length === 0 && (
              <p className="text-white/30 text-sm mb-6">
                Inscribete en una carrera para comenzar tu camino hacia la certificacion.
              </p>
            )}

            <Link href="/courses">
              <Button className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold">
                Ir a Mis Cursos
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="bg-white/5 border-white/10 overflow-hidden">
              {/* Certificate Preview */}
              <div className="bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6 text-center border-b border-white/10">
                <div className="w-12 h-12 rounded-full bg-[#FBBC0C]/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#FBBC0C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Certificado ITSEIA</p>
                <h3 className="text-white font-bold text-lg">{cert.programs.name}</h3>
                <p className="text-white/40 text-sm mt-1">
                  {new Date(cert.issued_at).toLocaleDateString("es-EC", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <span className="text-white/40 text-sm">Codigo de Verificacion</span>
                  <p className="text-[#FBBC0C] font-mono text-sm mt-1">{cert.code}</p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/verify/${cert.code}`} className="flex-1">
                    <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                      Verificar
                    </Button>
                  </Link>
                  <Button
                    className="flex-1 bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold"
                    onClick={() => handleDownloadPDF(cert.id)}
                    disabled={downloading === cert.id}
                  >
                    {downloading === cert.id ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#0A1628] border-t-transparent rounded-full animate-spin" />
                        Generando...
                      </span>
                    ) : (
                      "Descargar PDF"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
