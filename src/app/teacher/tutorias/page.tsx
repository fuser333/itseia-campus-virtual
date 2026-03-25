"use client";

// ============================================================
// /teacher/tutorias — Tutorias virtuales (office hours)
// ============================================================

import Link from "next/link";
import {
  MessageSquare,
  Clock,
  CalendarDays,
  Phone,
  Mail,
  Video,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HORARIOS = [
  { dia: "Lunes", hora: "09:00 – 11:00", disponible: true },
  { dia: "Miercoles", hora: "14:00 – 16:00", disponible: true },
  { dia: "Viernes", hora: "09:00 – 11:00", disponible: true },
  { dia: "Sabado", hora: "10:00 – 12:00", disponible: true },
];

const PASOS = [
  {
    paso: 1,
    titulo: "Contacta al coordinador",
    descripcion:
      "Escribe al coordinador academico por WhatsApp (+593 95 989 2034) o email (administracion@itseia.ai) indicando el tema de la tutoria y el nombre del estudiante.",
    icon: Phone,
  },
  {
    paso: 2,
    titulo: "Agenda el horario",
    descripcion:
      "El coordinador confirmara un slot disponible dentro de los horarios de atencion. Tambien puedes publicar tu disponibilidad en el calendario del campus.",
    icon: CalendarDays,
  },
  {
    paso: 3,
    titulo: "Conecta por video",
    descripcion:
      "La sesion se realiza por Daily.co desde cualquier sesion de tus materias. No requiere instalacion — solo clic en 'Iniciar video' y comparte el enlace con tu estudiante.",
    icon: Video,
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

      {/* Horarios de atencion */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Horarios de atencion disponibles
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HORARIOS.map((h) => (
            <div
              key={h.dia}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#1F2F58]/10">
                <Clock className="size-4 text-[#1F2F58]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{h.dia}</p>
                <p className="text-xs text-gray-500">{h.hora}</p>
              </div>
              {h.disponible && (
                <CheckCircle2 className="ml-auto size-4 shrink-0 text-emerald-500" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Horarios referencial. Confirma disponibilidad con el coordinador antes de agendar.
        </p>
      </div>

      {/* Canales de contacto */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Como contactar
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://wa.me/593959892034"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 transition-colors hover:bg-emerald-100"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
              <Phone className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">WhatsApp Coordinacion</p>
              <p className="text-xs text-gray-600">+593 95 989 2034</p>
            </div>
          </a>

          <a
            href="mailto:administracion@itseia.ai"
            className="flex items-center gap-4 rounded-xl border border-[#73B8E7]/30 bg-[#73B8E7]/5 px-5 py-4 transition-colors hover:bg-[#73B8E7]/10"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#73B8E7]/20">
              <Mail className="size-5 text-[#1F2F58]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Email Coordinacion</p>
              <p className="text-xs text-gray-600">administracion@itseia.ai</p>
            </div>
          </a>
        </div>
      </div>

      {/* Pasos del proceso */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Pasos para agendar una tutoria
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PASOS.map((item) => (
            <Card key={item.paso}>
              <CardContent className="pt-5">
                <div className="mb-3 flex size-8 items-center justify-center rounded-full bg-[#1F2F58] text-sm font-bold text-[#FBBC0C]">
                  {item.paso}
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  {item.titulo}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.descripcion}
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
            Publicar mi disponibilidad
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
