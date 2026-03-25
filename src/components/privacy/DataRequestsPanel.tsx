"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type RequestStatus = "pending" | "processing" | "completed" | "rejected" | "held";

interface DataRequestRow {
  id: string;
  user_id: string;
  type: string;
  status: RequestStatus;
  notes: string | null;
  admin_notes: string | null;
  legal_hold_reason: string | null;
  resolved_at: string | null;
  created_at: string;
  days_until_deadline: number;
  deadline_date: string;
  is_urgent: boolean;
  is_overdue: boolean;
  profiles?: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

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

type FilterType = "pending" | "completed" | "all";

export default function DataRequestsPanel() {
  const [requests, setRequests] = useState<DataRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("pending");
  const [resolving, setResolving] = useState<string | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    requestId: string;
    action: "processing" | "completed" | "rejected" | "held";
  } | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [legalReason, setLegalReason] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: filter });
      const res = await fetch(`/api/privacy/requests?${params}`);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  async function handleResolve() {
    if (!actionDialog) return;
    setResolving(actionDialog.requestId);

    try {
      const body: Record<string, unknown> = {
        status: actionDialog.action,
        admin_notes: adminNotes || null,
      };

      if (actionDialog.action === "held") {
        body.legal_hold_reason = legalReason || null;
      }

      const res = await fetch(`/api/privacy/requests/${actionDialog.requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setActionDialog(null);
        setAdminNotes("");
        setLegalReason("");
        await loadRequests();
      }
    } catch {
      // silently fail — UI will show stale data
    } finally {
      setResolving(null);
    }
  }

  const urgentCount = requests.filter((r) => r.is_urgent).length;
  const overdueCount = requests.filter((r) => r.is_overdue).length;
  const totalPending = requests.filter((r) =>
    ["pending", "processing"].includes(r.status)
  ).length;

  function getRowClasses(req: DataRequestRow): string {
    if (req.is_overdue)
      return "bg-red-50 border-l-4 border-l-red-500";
    if (req.is_urgent)
      return "bg-amber-50 border-l-4 border-l-amber-400";
    return "border-l-4 border-l-transparent";
  }

  function getDeadlineBadge(req: DataRequestRow) {
    if (req.is_overdue) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">
          VENCIDO ({Math.abs(req.days_until_deadline)}d)
        </Badge>
      );
    }
    if (req.is_urgent) {
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] font-bold animate-pulse">
          URGENTE ({req.days_until_deadline}d)
        </Badge>
      );
    }
    return (
      <span className="text-xs text-gray-500">
        {req.days_until_deadline}d restantes
      </span>
    );
  }

  const actionLabels: Record<string, string> = {
    processing: "Marcar en proceso",
    completed: "Marcar como resuelta",
    rejected: "Rechazar",
    held: "Retener (razon legal)",
  };

  return (
    <div className="space-y-6">
      {/* Header con conteo ejecutivo */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Solicitudes de Datos (LOPDP)
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Plazo legal de respuesta: 15 dias habiles
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {overdueCount > 0 && (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              {overdueCount} vencida{overdueCount !== 1 ? "s" : ""}
            </Badge>
          )}
          {urgentCount > 0 && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 animate-pulse">
              {urgentCount} urgente{urgentCount !== 1 ? "s" : ""}
            </Badge>
          )}
          {totalPending > 0 && (
            <Badge className="bg-[#1F2F58]/10 text-[#1F2F58] border-[#1F2F58]/20">
              {totalPending} pendiente{totalPending !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {(["pending", "completed", "all"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              filter === f
                ? "bg-[#1F2F58] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "pending"
              ? "Pendientes"
              : f === "completed"
              ? "Completadas"
              : "Todas"}
          </button>
        ))}
      </div>

      {/* Tabla de solicitudes */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-6 h-6 border-2 border-[#1F2F58] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm">No hay solicitudes en este filtro.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-gray-500 bg-gray-50">
                    <th className="px-4 py-3">Estudiante</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Recibida</th>
                    <th className="px-4 py-3">Plazo legal</th>
                    <th className="px-4 py-3">Dias restantes</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((req) => (
                    <tr key={req.id} className={`${getRowClasses(req)} text-gray-700`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {req.profiles?.full_name || "—"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {req.profiles?.email || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="text-xs bg-[#1F2F58]/5 text-[#1F2F58] border-[#1F2F58]/20"
                        >
                          {TYPE_LABELS[req.type] || req.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(req.created_at).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(req.deadline_date).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {getDeadlineBadge(req)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            req.status === "pending"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : req.status === "processing"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : req.status === "completed"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : req.status === "rejected"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {STATUS_LABELS[req.status] || req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {["pending", "processing"].includes(req.status) && (
                          <div className="flex gap-1 flex-wrap">
                            {(
                              ["processing", "completed", "rejected", "held"] as const
                            ).map((action) => (
                              <button
                                key={action}
                                onClick={() => {
                                  setActionDialog({ requestId: req.id, action });
                                  setAdminNotes("");
                                  setLegalReason("");
                                }}
                                className={`text-[10px] px-2 py-1 rounded font-medium transition-colors ${
                                  action === "completed"
                                    ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                                    : action === "rejected"
                                    ? "bg-red-50 hover:bg-red-100 text-red-700"
                                    : action === "held"
                                    ? "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                    : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                                }`}
                              >
                                {actionLabels[action]}
                              </button>
                            ))}
                          </div>
                        )}
                        {req.admin_notes && (
                          <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] truncate" title={req.admin_notes}>
                            Nota: {req.admin_notes}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de accion */}
      {actionDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActionDialog(null);
          }}
        >
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle className="text-base">
                {actionLabels[actionDialog.action]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Notas internas (opcional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  placeholder="Nota interna para el registro..."
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 placeholder:text-gray-300 resize-none focus:outline-none focus:border-[#1F2F58]/50"
                />
              </div>

              {actionDialog.action === "held" && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Razon de retencion legal (obligatorio)
                  </label>
                  <textarea
                    value={legalReason}
                    onChange={(e) => setLegalReason(e.target.value)}
                    rows={2}
                    placeholder="Ej: El estudiante tiene una carrera en curso y obligaciones contractuales vigentes (LOPDP Art. 21)"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 placeholder:text-gray-300 resize-none focus:outline-none focus:border-[#1F2F58]/50"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActionDialog(null)}
                  className="flex-1 text-gray-600"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleResolve}
                  disabled={
                    resolving === actionDialog.requestId ||
                    (actionDialog.action === "held" && !legalReason.trim())
                  }
                  className="flex-1 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white"
                >
                  {resolving === actionDialog.requestId ? "Guardando..." : "Confirmar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
