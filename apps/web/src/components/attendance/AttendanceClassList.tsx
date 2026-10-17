"use client";

// ============================================================
// ITSEIA Academy — Lista de asistencia post-clase para docente
// Feature: 007-attendance-tracking
//
// Muestra quien asistio a una sesion sincronica especifica,
// con duracion, estado y hora de entrada/salida.
// Disponible inmediatamente despues de terminar la clase.
// ============================================================

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  CheckCircle2,
  MinusCircle,
  AlertCircle,
  Clock,
  Users,
  Video,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus } from "@/types/database";

interface AttendanceRecord {
  id: string;
  user_id: string;
  joined_at: string;
  left_at: string | null;
  duration_seconds: number | null;
  status: AttendanceStatus;
  is_manual_override: boolean;
  profiles: { full_name: string; email: string } | null;
}

interface AttendanceClassListProps {
  liveSessionId: string;
  sessionTitle?: string;
  enrolledCount?: number;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  if (status === "present") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="size-3" />
        Presente
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        <MinusCircle className="size-3" />
        Parcial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
      <AlertCircle className="size-3" />
      Ausente
    </span>
  );
}

export function AttendanceClassList({
  liveSessionId,
  sessionTitle,
  enrolledCount,
}: AttendanceClassListProps) {
  const supabase = createClient();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("attendance")
        .select(`
          id, user_id, joined_at, left_at, duration_seconds, status, is_manual_override,
          profiles:user_id ( full_name, email )
        `)
        .eq("live_session_id", liveSessionId)
        .order("joined_at", { ascending: true });

      setRecords((data as unknown as AttendanceRecord[]) || []);
      setLoading(false);
    }

    load();
  }, [liveSessionId]);

  const presentCount = records.filter((r) => r.status === "present").length;
  const partialCount = records.filter((r) => r.status === "partial").length;
  const absentCount  = records.filter((r) => r.status === "absent").length;

  return (
    <div className="space-y-4">
      {/* Titulo */}
      {sessionTitle && (
        <div className="flex items-center gap-2">
          <Video className="size-4 text-[#73B8E7]" />
          <span className="text-sm font-semibold text-gray-800">{sessionTitle}</span>
        </div>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="size-3.5" />
          {presentCount} presentes
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <MinusCircle className="size-3.5" />
          {partialCount} parciales
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
          <AlertCircle className="size-3.5" />
          {absentCount} ausentes
        </div>
        {enrolledCount !== undefined && (
          <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
            <Users className="size-3.5" />
            {enrolledCount} matriculados
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Estudiante</TableHead>
              <TableHead className="text-center">Entrada</TableHead>
              <TableHead className="text-center">Salida</TableHead>
              <TableHead className="text-center">
                <Clock className="mx-auto size-3.5 text-gray-400" />
              </TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-300" />
                  <p className="mt-1 text-xs text-gray-400">
                    Cargando lista de asistencia...
                  </p>
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-gray-400">
                  No hay registros de asistencia para esta sesion.
                </TableCell>
              </TableRow>
            ) : (
              records.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900 text-sm">
                      {rec.profiles?.full_name ?? "Estudiante"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {rec.profiles?.email ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs text-gray-600">
                    {formatTime(rec.joined_at)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs text-gray-600">
                    {formatTime(rec.left_at)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs text-gray-600">
                    {formatDuration(rec.duration_seconds)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <StatusBadge status={rec.status} />
                      {rec.is_manual_override && (
                        <Badge variant="secondary" className="text-[9px] px-1 py-0">
                          Manual
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
