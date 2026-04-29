// /carreras/calendario — Calendario académico de las carreras formales.

import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ArrowLeft, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Calendario Académico | Carreras ITSEIA",
  description: "Fechas importantes, inicio de semestres y eventos académicos de ITSEIA.",
};

// Eventos académicos del año 2026
const EVENTOS_ACADEMICOS = [
  {
    fecha: "Junio 2026",
    evento: "Inicio de clases — Cohorte 2026",
    tipo: "inicio",
    descripcion: "Primer semestre para los estudiantes de la cohorte 2026.",
  },
  {
    fecha: "Julio 2026",
    evento: "Evaluaciones parciales",
    tipo: "evaluacion",
    descripcion: "Primera ronda de evaluaciones parciales por materia.",
  },
  {
    fecha: "Agosto 2026",
    evento: "Semana de proyectos integradores",
    tipo: "proyecto",
    descripcion: "Presentación de proyectos prácticos del semestre.",
  },
  {
    fecha: "Septiembre 2026",
    evento: "Evaluaciones finales",
    tipo: "evaluacion",
    descripcion: "Evaluaciones finales del primer semestre.",
  },
  {
    fecha: "Octubre 2026",
    evento: "Inicio segundo semestre",
    tipo: "inicio",
    descripcion: "Comienzo del segundo semestre académico.",
  },
];

const tipoConfig: Record<string, { color: string; bg: string; label: string }> = {
  inicio: { color: "text-[#73B8E7]", bg: "bg-[#73B8E7]/10", label: "Inicio" },
  evaluacion: { color: "text-[#FBBC0C]", bg: "bg-[#FBBC0C]/10", label: "Evaluación" },
  proyecto: { color: "text-[#F0846D]", bg: "bg-[#F0846D]/10", label: "Proyecto" },
};

export default function CalendarioPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/carreras"
          className="inline-flex items-center gap-1.5 text-xs text-[#1F2F58]/60 hover:text-[#1F2F58] mb-4 transition-colors"
        >
          <ArrowLeft className="size-3" />
          Volver al panel
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1628] flex items-center gap-3">
          <CalendarDays className="size-7 text-[#FBBC0C]" />
          Calendario Académico
        </h1>
        <p className="mt-2 text-sm text-[#1F2F58]/70">
          Fechas clave del año académico 2026 de las carreras tecnológicas.
        </p>
      </div>

      {/* Aviso informativo */}
      <div className="flex items-start gap-3 rounded-xl border border-[#73B8E7]/25 bg-[#73B8E7]/8 px-4 py-3">
        <Info className="size-4 text-[#73B8E7] mt-0.5 shrink-0" />
        <p className="text-xs text-[#1F2F58]/70 leading-relaxed">
          Las fechas pueden ajustarse según el coordinador académico. Cualquier
          cambio se comunicará por WhatsApp y correo electrónico con anticipación.
        </p>
      </div>

      {/* Eventos */}
      <div className="space-y-3">
        {EVENTOS_ACADEMICOS.map((ev, idx) => {
          const config = tipoConfig[ev.tipo] || tipoConfig.inicio;
          return (
            <Card
              key={idx}
              className="border border-[#1F2F58]/8 bg-white shadow-sm"
            >
              <CardContent className="flex items-start gap-4 py-4">
                {/* Fecha */}
                <div className="shrink-0 w-28 text-center">
                  <p className="text-xs font-bold text-[#0A1628] leading-tight">
                    {ev.fecha}
                  </p>
                </div>

                <div className="w-px self-stretch bg-[#1F2F58]/10" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#0A1628]">
                      {ev.evento}
                    </h3>
                    <span
                      className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#1F2F58]/60">
                    {ev.descripcion}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA soporte */}
      <Card className="border border-[#1F2F58]/8 bg-white shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-center gap-4 py-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-[#0A1628]">
              ¿Tienes dudas sobre el calendario?
            </p>
            <p className="text-xs text-[#1F2F58]/60 mt-0.5">
              Contacta directamente al equipo académico de ITSEIA.
            </p>
          </div>
          <a
            href="https://wa.me/593959892034?text=Hola%2C%20tengo%20una%20consulta%20sobre%20el%20calendario%20académico"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0A1628] transition-colors shrink-0"
          >
            <CalendarDays className="size-4" />
            Consultar por WhatsApp
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
