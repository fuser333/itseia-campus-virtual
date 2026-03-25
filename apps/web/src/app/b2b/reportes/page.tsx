import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  BarChart2,
  ArrowLeft,
  Mail,
  MessageCircle,
  Clock,
  Award,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reportes del Equipo | ITSEIA Academy Corporativo",
  description: "Reportes de progreso y certificados del equipo corporativo en ITSEIA.",
};

export default async function B2BReportesPage() {
  const authClient = await createClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">

      {/* Breadcrumb */}
      <div>
        <Link
          href="/b2b"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Dashboard Corporativo
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#FBBC0C]/10">
            <BarChart2 className="size-6 text-[#FBBC0C]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Reportes del Equipo
            </h1>
            <p className="text-sm text-muted-foreground">
              Progreso, avance y certificaciones del equipo
            </p>
          </div>
        </div>
      </div>

      {/* Coming soon card */}
      <Card className="border-none bg-white shadow-sm">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-[#FBBC0C]/10">
            <Clock className="size-10 text-[#FBBC0C]" />
          </div>
          <h2 className="text-xl font-bold text-[#0A1628]">
            Reportes de Progreso — Disponibles Proximamente
          </h2>
          <p className="mt-2 max-w-md text-sm text-[#1F2F58]/50 leading-relaxed">
            Los reportes detallados de progreso, completacion de cursos y
            certificaciones del equipo estaran disponibles en esta seccion.
            Contacta a administracion para obtener un reporte en este momento.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="mailto:administracion@itseia.ai?subject=Solicitud%20de%20reporte%20de%20progreso%20corporativo"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A1628] transition-colors"
            >
              <Mail className="size-4" />
              Solicitar Reporte por Email
            </a>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20el%20reporte%20de%20progreso%20de%20mi%20equipo%20en%20ITSEIA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-colors"
            >
              <MessageCircle className="size-4" />
              WhatsApp Soporte
            </a>
          </div>

          <p className="mt-6 text-xs text-[#1F2F58]/30">
            administracion@itseia.ai
          </p>
        </CardContent>
      </Card>

      {/* What will be included */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-[#0A1628]">
          Que incluiran los reportes
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: "Progreso por Empleado",
              description: "Avance porcentual de cada miembro en sus cursos asignados.",
              accent: "#73B8E7",
            },
            {
              icon: CheckCircle2,
              title: "Modulos Completados",
              description: "Registro de todos los modulos y lecciones finalizados.",
              accent: "#FBBC0C",
            },
            {
              icon: Award,
              title: "Certificaciones Obtenidas",
              description: "Certificados emitidos por ITSEIA para cada miembro del equipo.",
              accent: "#F0846D",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-4"
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${item.accent}15` }}
                >
                  <Icon className="size-5" style={{ color: item.accent }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0A1628]">{item.title}</p>
                  <p className="text-xs text-[#1F2F58]/50 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/certificates"
          className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
        >
          <Award className="size-4 text-[#F0846D]" />
          Ver Certificados
        </Link>
        <Link
          href="/payments"
          className="inline-flex items-center gap-2 rounded-lg border border-[#1F2F58]/10 bg-white px-4 py-2 text-sm font-medium text-[#1F2F58] hover:bg-[#1F2F58]/5 transition-colors"
        >
          <TrendingUp className="size-4 text-[#73B8E7]" />
          Ver Facturacion
        </Link>
      </div>
    </div>
  );
}
