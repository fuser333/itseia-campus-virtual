"use client";

// Admin Certifications client — detail view + CSV export + status management

import { useState } from "react";
import {
  Award,
  Download,
  Users,
  Trophy,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Archive,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCertificationStatus, validateBadge } from "@/features/certifications/actions";
import {
  getAdminCertificationStudents,
  type AdminCertificationReport,
  type AdminStudentProgress,
} from "@/features/certifications/queries";
import { cn } from "@/lib/utils";

interface Props {
  initialReports: AdminCertificationReport[];
}

export default function AdminCertificationsClient({ initialReports }: Props) {
  const [reports] = useState<AdminCertificationReport[]>(initialReports);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [students, setStudents] = useState<Record<string, AdminStudentProgress[]>>({});
  const [loadingStudents, setLoadingStudents] = useState<Record<string, boolean>>({});
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [validating, setValidating] = useState<string | null>(null);

  async function loadStudents(certId: string) {
    if (students[certId]) return;
    setLoadingStudents((p) => ({ ...p, [certId]: true }));
    const data = await getAdminCertificationStudents(certId);
    setStudents((p) => ({ ...p, [certId]: data }));
    setLoadingStudents((p) => ({ ...p, [certId]: false }));
  }

  function toggleExpand(certId: string) {
    if (expandedId === certId) {
      setExpandedId(null);
    } else {
      setExpandedId(certId);
      loadStudents(certId);
    }
  }

  function exportCSV(certId: string, certName: string) {
    const data = students[certId];
    if (!data) return;

    const rows = [
      ["Nombre", "Email", "Inscripcion", "Ultimo Acceso", "Badge", "Puntaje Badge", "Ultimo Intento", "% Ultimo Intento"],
      ...data.map((s) => [
        s.full_name,
        s.email,
        new Date(s.started_at).toLocaleDateString("es-EC"),
        new Date(s.last_accessed_at).toLocaleDateString("es-EC"),
        s.badge_type || "Sin badge",
        s.badge_score !== null ? `${s.badge_score}%` : "",
        s.last_attempt_date ? new Date(s.last_attempt_date).toLocaleDateString("es-EC") : "",
        s.last_attempt_percentage !== null ? `${s.last_attempt_percentage}%` : "",
      ]),
    ];

    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificaciones_${certName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleStatusUpdate(
    certId: string,
    status: "activa" | "actualizacion_pendiente" | "archivada"
  ) {
    setStatusUpdating(certId);
    await updateCertificationStatus(certId, status);
    setStatusUpdating(null);
  }

  async function handleValidateBadge(badgeId: string) {
    setValidating(badgeId);
    await validateBadge(badgeId);
    setValidating(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-[#FBBC0C]" />
          <div>
            <h1 className="text-xl font-bold text-[#0A1628]">
              Certificaciones de Industria
            </h1>
            <p className="text-sm text-gray-500">
              Progreso de estudiantes por certificacion
            </p>
          </div>
        </div>
      </div>

      {/* Reports table */}
      {reports.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Award className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No hay certificaciones configuradas aun.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const cert = report.certification;
            const isExpanded = expandedId === cert.id;
            const certStudents = students[cert.id] || [];
            const isLoading = loadingStudents[cert.id];

            return (
              <div
                key={cert.id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                {/* Summary row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Provider + Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {cert.proveedor}
                      </p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                          cert.estado === "activa"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : cert.estado === "actualizacion_pendiente"
                            ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        )}
                      >
                        {cert.estado === "activa"
                          ? "Activa"
                          : cert.estado === "actualizacion_pendiente"
                          ? "Actualizacion pendiente"
                          : "Archivada"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#0A1628]">{cert.nombre}</p>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center hidden sm:block">
                      <p className="text-lg font-bold text-[#0A1628]">{report.active_students}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Activos
                      </p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-lg font-bold text-[#FBBC0C]">
                        {report.approved_simulacros}
                      </p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Simulacros
                      </p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-lg font-bold text-emerald-600">
                        {report.official_certificates}
                      </p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Oficiales
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toggleExpand(cert.id);
                      }}
                      className="gap-1.5 text-xs"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                      Ver detalle
                    </Button>
                  </div>
                </div>

                {/* Detail panel */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                    {/* Toolbar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportCSV(cert.id, cert.nombre)}
                        disabled={certStudents.length === 0}
                        className="gap-1.5 text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Exportar CSV
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusUpdate(cert.id, "actualizacion_pendiente")
                        }
                        disabled={
                          cert.estado === "actualizacion_pendiente" ||
                          statusUpdating === cert.id
                        }
                        className="gap-1.5 text-xs text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Marcar actualizacion
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(cert.id, "archivada")}
                        disabled={
                          cert.estado === "archivada" ||
                          statusUpdating === cert.id
                        }
                        className="gap-1.5 text-xs text-gray-500 border-gray-200 hover:bg-gray-50"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        Archivar
                      </Button>
                      {cert.estado !== "activa" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(cert.id, "activa")}
                          disabled={statusUpdating === cert.id}
                          className="gap-1.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Activar
                        </Button>
                      )}
                    </div>

                    {/* Students table */}
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-[#FBBC0C]" />
                      </div>
                    ) : certStudents.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">
                        Sin estudiantes inscritos aun.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 text-left">
                              <th className="pb-2 text-xs font-semibold text-gray-400 pr-4">Estudiante</th>
                              <th className="pb-2 text-xs font-semibold text-gray-400 pr-4">Inscripcion</th>
                              <th className="pb-2 text-xs font-semibold text-gray-400 pr-4">Badge</th>
                              <th className="pb-2 text-xs font-semibold text-gray-400 pr-4">Ultimo intento</th>
                              <th className="pb-2 text-xs font-semibold text-gray-400">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {certStudents.map((s) => (
                              <tr key={s.user_id} className="hover:bg-gray-50/50">
                                <td className="py-2.5 pr-4">
                                  <p className="font-medium text-[#0A1628]">{s.full_name}</p>
                                  <p className="text-xs text-gray-400">{s.email}</p>
                                </td>
                                <td className="py-2.5 pr-4 text-xs text-gray-500">
                                  {new Date(s.started_at).toLocaleDateString("es-EC")}
                                </td>
                                <td className="py-2.5 pr-4">
                                  {s.badge_type ? (
                                    <span
                                      className={cn(
                                        "rounded-full px-2 py-0.5 text-[10px] font-semibold border",
                                        s.badge_type === "certificado_oficial"
                                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                          : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                      )}
                                    >
                                      {s.badge_type === "certificado_oficial"
                                        ? "Oficial"
                                        : `Simulacro ${s.badge_score?.toFixed(0)}%`}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-300">—</span>
                                  )}
                                </td>
                                <td className="py-2.5 pr-4 text-xs text-gray-500">
                                  {s.last_attempt_date ? (
                                    <>
                                      {new Date(s.last_attempt_date).toLocaleDateString("es-EC")}
                                      {s.last_attempt_percentage !== null && (
                                        <span
                                          className={cn(
                                            "ml-1.5 font-semibold",
                                            (s.last_attempt_percentage ?? 0) >= 70
                                              ? "text-emerald-600"
                                              : "text-red-500"
                                          )}
                                        >
                                          {s.last_attempt_percentage?.toFixed(0)}%
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-gray-300">Sin intentos</span>
                                  )}
                                </td>
                                <td className="py-2.5">
                                  {s.badge_type === "simulacro_aprobado" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleValidateBadge(s.user_id)}
                                      disabled={validating === s.user_id}
                                      className="text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                    >
                                      {validating === s.user_id ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <CheckCircle2 className="w-3 h-3" />
                                      )}
                                      Validar oficial
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
