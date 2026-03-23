// ============================================================
// app/admin/calendario/page.tsx
// Vista global de calendario para admin/coordinacion
// Todos los eventos de todos los programas, filtrable
// Exportacion iCal para SENESCYT
// ============================================================

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getGlobalEvents } from "@/features/calendar/queries";
import { AcademicCalendar } from "@/components/calendar/AcademicCalendar";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Calendario Global | Admin ITSEIA Academy",
  description: "Vista global del calendario academico institucional para SENESCYT",
};

export default async function AdminCalendarioPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "estudiante";

  if (!["coordinacion", "admin", "super_admin"].includes(role)) {
    redirect("/dashboard");
  }

  // Eventos del mes actual para la vista inicial
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const initialEvents = await getGlobalEvents(from, to);

  // Todas las materias activas para el formulario
  const { data: subjectsData } = await supabaseAdmin
    .from("subjects")
    .select("id, name, code")
    .eq("is_active", true)
    .order("name");

  const subjects = (subjectsData || []) as { id: string; name: string; code: string }[];

  // Stats del mes
  const totalEvents = initialEvents.length;
  const cancelledEvents = initialEvents.filter((e) => e.is_cancelled).length;
  const activeEvents = totalEvents - cancelledEvents;
  const classEvents = initialEvents.filter((e) => e.type === "class" && !e.is_cancelled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-[#1F2F58]/50">
                <ArrowLeft className="size-3.5" />
                Admin
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[#0A1628] tracking-tight">
            Calendario Global Institucional
          </h1>
          <p className="mt-1 text-sm text-[#1F2F58]/50">
            Evidencia de planificacion sistematica para SENESCYT (RPC-SE-04-No.012-2023)
          </p>
        </div>

        {/* Exportar todo el mes */}
        <a
          href={`/api/calendar/export?from=${from.toISOString()}&to=${to.toISOString()}`}
          download="calendario-itseia-institucional.ics"
        >
          <Button className="bg-[#1F2F58] hover:bg-[#2A3F6E] text-white gap-2">
            <Download className="size-4" />
            Exportar iCal SENESCYT
          </Button>
        </a>
      </div>

      {/* Stats del mes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-medium text-[#1F2F58]/40 uppercase tracking-wider">
            Total eventos
          </p>
          <p className="text-2xl font-bold text-[#0A1628] mt-1">{totalEvents}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-medium text-[#1F2F58]/40 uppercase tracking-wider">
            Clases sincronicas
          </p>
          <p className="text-2xl font-bold text-[#1F2F58] mt-1">{classEvents}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-medium text-[#1F2F58]/40 uppercase tracking-wider">
            Activos
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{activeEvents}</p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-medium text-[#1F2F58]/40 uppercase tracking-wider">
            Cancelados
          </p>
          <p className="text-2xl font-bold text-[#F0846D] mt-1">{cancelledEvents}</p>
        </div>
      </div>

      {/* Calendario global */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-4 min-h-[600px]">
        <AcademicCalendar
          initialEvents={initialEvents}
          subjectIds={[]}
          subjects={subjects}
          userRole={role}
          userId={user.id}
          showAdminControls={true}
        />
      </div>

      {/* Nota legal CES */}
      <div className="rounded-lg bg-[#F9F6E7] border border-[#FBBC0C]/20 p-4">
        <p className="text-xs text-[#1F2F58]/60 leading-relaxed">
          <strong className="text-[#1F2F58]">Evidencia CES:</strong> Este calendario registra
          la planificacion documentada de sesiones sincronicas exigida por el
          Reglamento de Regimen Academico (RPC-SE-04-No.012-2023). Los eventos se almacenan
          con historial permanente como evidencia para auditorias SENESCYT.
          El archivo iCal exportado es compatible con Google Calendar, Apple Calendar y Microsoft Outlook.
        </p>
      </div>
    </div>
  );
}
