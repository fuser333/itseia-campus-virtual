"use client";

// ============================================================
// /teacher/tutorias — Tutorias virtuales (office hours)
// ============================================================

import Link from "next/link";
import {
  MessageSquare,
  Clock,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HOWTO_STEPS = [
  {
    step: 1,
    title: "Agenda tu horario de tutorias",
    description:
      "Usa el calendario para publicar bloques de disponibilidad. Tus estudiantes los veran y podran reservar una sesion contigo.",
  },
  {
    step: 2,
    title: "Comunicate por mensajes directos",
    description:
      "Desde la seccion Anuncios puedes enviar mensajes directos a cada estudiante para coordinar la tutoria.",
  },
  {
    step: 3,
    title: "Realiza la sesion en video",
    description:
      "Usa la sala de video conferencia integrada desde cualquier sesion de tus materias. Sin instalar nada extra.",
  },
];

export default function TutoriasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tutorias</h1>
        <p className="mt-1 text-sm text-gray-500">
          Atencion personalizada y horas de consulta virtuales para tus estudiantes.
        </p>
      </div>

      {/* Coming soon banner */}
      <div className="rounded-xl border border-[#FBBC0C]/40 bg-[#FBBC0C]/5 p-6">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left sm:gap-5">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBBC0C]/20">
            <MessageSquare className="size-7 text-[#1F2F58]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#1F2F58]">
              Modulo de Tutorias — Proximamente
            </p>
            <p className="mt-1 text-sm text-gray-600 max-w-prose">
              Estamos construyendo un sistema de reserva de tutorias integrado.
              Por ahora, usa los canales disponibles para coordinar con tus estudiantes.
            </p>
          </div>
        </div>
      </div>

      {/* How to do it now */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Como hacer tutorias ahora
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {HOWTO_STEPS.map((item) => (
            <Card key={item.step}>
              <CardContent className="pt-5">
                <div className="mb-3 flex size-8 items-center justify-center rounded-full bg-[#1F2F58] text-sm font-bold text-[#FBBC0C]">
                  {item.step}
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/calendario">
          <Button className="gap-2 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white">
            <CalendarDays className="size-4" />
            Ir al calendario
          </Button>
        </Link>
        <Link href="/teacher/comunicacion">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="size-4" />
            Mensajes directos
          </Button>
        </Link>
      </div>

      {/* CES note */}
      <Card className="border-[#73B8E7]/20 bg-[#73B8E7]/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Clock className="size-4 shrink-0 text-[#1F2F58] mt-0.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-[#1F2F58]">Requisito CES:</span>{" "}
              Los docentes deben garantizar horas de atencion para consultas de los
              estudiantes en modalidad virtual. Registra tus sesiones de tutoria
              en el calendario para cumplir con este requisito.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
