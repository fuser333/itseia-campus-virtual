"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile, DataRequest } from "@/types/database";

const TYPE_LABELS: Record<string, string> = {
  export: "Exportacion",
  delete: "Eliminacion",
  rectify: "Rectificacion",
  oppose: "Oposicion",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  completed: "Completada",
  rejected: "Rechazada",
  held: "Retencion legal",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  held: "bg-gray-100 text-gray-700 border-gray-200",
};

interface MyDataSectionProps {
  profile: Profile;
}

export default function MyDataSection({ profile }: MyDataSectionProps) {
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingNote, setDeletingNote] = useState("");
  const [submittingDelete, setSubmittingDelete] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadRequests() {
      const { data } = await supabase
        .from("data_requests")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      setRequests((data as DataRequest[]) || []);
      setLoadingRequests(false);
    }
    loadRequests();
  }, [profile.id]);

  async function handleExport() {
    setExporting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/privacy/export-data");
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al exportar datos");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mis-datos-itseia-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage({ type: "success", text: "Tus datos han sido descargados exitosamente." });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al descargar tus datos. Intenta de nuevo.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setExporting(false);
    }
  }

  async function handleRequestDelete() {
    setSubmittingDelete(true);
    setMessage(null);
    try {
      const response = await fetch("/api/privacy/request-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: deletingNote || null }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al enviar la solicitud");
      }
      setMessage({
        type: "success",
        text: "Solicitud de eliminacion enviada. Sera atendida en un maximo de 15 dias habiles (LOPDP).",
      });
      setShowDeleteConfirm(false);
      setDeletingNote("");
      // Recargar solicitudes
      const { data: updated } = await supabase
        .from("data_requests")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });
      setRequests((updated as DataRequest[]) || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al enviar la solicitud. Intenta de nuevo.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSubmittingDelete(false);
    }
  }

  const hasPendingDelete = requests.some(
    (r) => r.type === "delete" && ["pending", "processing"].includes(r.status)
  );

  return (
    <div className="space-y-6">
      {/* Mensaje de feedback */}
      {message && (
        <div
          className={`rounded-lg border p-3 text-sm animate-fade-in ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-[#F0846D]/20 bg-[#F0846D]/10 text-[#F0846D]"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      {/* Datos personales almacenados */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">
            Datos personales almacenados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/40 text-xs mb-0.5">Nombre completo</p>
              <p className="text-white/80">{profile.full_name || "—"}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Correo electronico</p>
              <p className="text-white/80">{profile.email}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Rol en la plataforma</p>
              <p className="text-white/80 capitalize">{profile.role}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Miembro desde</p>
              <p className="text-white/80">
                {new Date(profile.created_at).toLocaleDateString("es-EC", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <p className="text-white/30 text-xs">
              Tambien almacenamos: historial de progreso academico, resultados de quizzes,
              entregas de tareas, uso del AI Lab, certificados emitidos y registros de
              consentimiento. Puedes descargar todos tus datos usando el boton de exportacion.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Acciones LOPDP */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">
            Tus derechos LOPDP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exportar datos */}
          <div className="flex items-start justify-between gap-4 p-3 bg-white/5 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">Exportar mis datos</p>
              <p className="text-white/40 text-xs mt-0.5">
                Descarga todos tus datos personales y academicos en formato JSON
                (derecho de portabilidad, Art. 20 LOPDP).
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="flex-shrink-0 bg-[#73B8E7]/20 hover:bg-[#73B8E7]/30 text-[#73B8E7] border border-[#73B8E7]/30 text-sm h-9 px-4"
              variant="outline"
            >
              {exporting ? "Generando..." : "Descargar JSON"}
            </Button>
          </div>

          {/* Solicitar eliminacion */}
          <div className="flex items-start justify-between gap-4 p-3 bg-white/5 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">Solicitar eliminacion de cuenta</p>
              <p className="text-white/40 text-xs mt-0.5">
                Solicita la eliminacion de tus datos personales. Los datos academicos
                pueden retenerse por obligacion legal (Art. 21 LOPDP).
              </p>
            </div>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={hasPendingDelete}
              className="flex-shrink-0 bg-[#F0846D]/10 hover:bg-[#F0846D]/20 text-[#F0846D] border border-[#F0846D]/30 text-sm h-9 px-4"
              variant="outline"
            >
              {hasPendingDelete ? "Solicitud enviada" : "Solicitar"}
            </Button>
          </div>

          {/* Info adicional */}
          <p className="text-white/30 text-xs leading-relaxed">
            Para solicitar rectificacion de datos o ejercer otros derechos,
            escribe a{" "}
            <a
              href="mailto:administracion@itseia.ai"
              className="text-[#73B8E7] hover:underline"
            >
              administracion@itseia.ai
            </a>
            . El plazo de respuesta legal es de 15 dias habiles.
          </p>
        </CardContent>
      </Card>

      {/* Modal confirmacion de eliminacion */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteConfirm(false);
          }}
        >
          <div className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up">
            <h3 className="text-white text-lg font-bold mb-2">
              Solicitar eliminacion de datos
            </h3>
            <div className="space-y-3 text-sm text-white/60 mb-4">
              <p>
                Al enviar esta solicitud, el equipo de ITSEIA revisara y procesara
                la eliminacion de tu cuenta dentro de los <strong className="text-white/80">15 dias habiles</strong> siguientes.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-300 text-xs">
                <strong>Importante:</strong> Los datos academicos (notas, certificados
                emitidos) pueden ser retenidos por obligacion legal aunque se elimine
                tu cuenta, segun el Art. 21 de la LOPDP.
              </div>
              <p>
                Perderás acceso inmediato a la plataforma una vez procesada la solicitud.
              </p>
            </div>

            <div className="mb-4">
              <label className="text-white/50 text-xs mb-1 block">
                Motivo de la solicitud (opcional)
              </label>
              <textarea
                value={deletingNote}
                onChange={(e) => setDeletingNote(e.target.value)}
                rows={2}
                placeholder="Ej: Ya no utilizo la plataforma..."
                className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-[#F0846D]/50"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRequestDelete}
                disabled={submittingDelete}
                className="flex-1 bg-[#F0846D] hover:bg-[#F0846D]/80 text-white font-semibold"
              >
                {submittingDelete ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Historial de solicitudes */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-base">
            Mis solicitudes de datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRequests ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-2 border-[#FBBC0C] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">
              No has enviado ninguna solicitud todavia.
            </p>
          ) : (
            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg text-sm"
                >
                  <div className="min-w-0">
                    <p className="text-white/80 font-medium">
                      {TYPE_LABELS[req.type] || req.type}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {new Date(req.created_at).toLocaleDateString("es-EC", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`flex-shrink-0 text-xs ${STATUS_COLORS[req.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {STATUS_LABELS[req.status] || req.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
