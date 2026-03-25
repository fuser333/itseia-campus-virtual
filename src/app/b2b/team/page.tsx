import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Users,
  ArrowLeft,
  Mail,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Mi Equipo | ITSEIA Academy Corporativo",
  description: "Gestion de equipo corporativo en ITSEIA Academy.",
};

export default async function B2BTeamPage() {
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
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#73B8E7]/10">
            <Users className="size-6 text-[#73B8E7]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Mi Equipo
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestion de miembros y accesos corporativos
            </p>
          </div>
        </div>
      </div>

      {/* Coming soon card */}
      <Card className="border-none bg-white shadow-sm">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <div className="mb-5 flex size-20 items-center justify-center rounded-2xl bg-[#73B8E7]/10">
            <Clock className="size-10 text-[#73B8E7]" />
          </div>
          <h2 className="text-xl font-bold text-[#0A1628]">
            Gestion de Equipo — Proximamente
          </h2>
          <p className="mt-2 max-w-md text-sm text-[#1F2F58]/50 leading-relaxed">
            Aqui podras agregar miembros de tu equipo, asignar cursos,
            monitorear el progreso individual y gestionar accesos a la plataforma.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="mailto:administracion@itseia.ai?subject=Agregar%20equipo%20corporativo%20ITSEIA"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1F2F58] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0A1628] transition-colors"
            >
              <Mail className="size-4" />
              Contactar por Email
            </a>
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20quiero%20agregar%20a%20mi%20equipo%20en%20ITSEIA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 transition-colors"
            >
              <MessageCircle className="size-4" />
              WhatsApp +593 95 989 2034
            </a>
          </div>

          <p className="mt-6 text-xs text-[#1F2F58]/30">
            administracion@itseia.ai
          </p>
        </CardContent>
      </Card>

      {/* Info tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Asignacion de Cursos",
            description: "Asigna programas especificos a cada miembro segun su rol.",
            color: "bg-[#73B8E7]/10",
            text: "text-[#73B8E7]",
          },
          {
            title: "Control de Accesos",
            description: "Activa o desactiva el acceso de cualquier empleado.",
            color: "bg-[#FBBC0C]/10",
            text: "text-[#FBBC0C]",
          },
          {
            title: "Progreso Individual",
            description: "Visualiza el avance de cada persona en tiempo real.",
            color: "bg-[#F0846D]/10",
            text: "text-[#F0846D]",
          },
        ].map((tile) => (
          <div
            key={tile.title}
            className={`rounded-xl p-5 ${tile.color}`}
          >
            <p className={`text-sm font-semibold ${tile.text} mb-1`}>
              {tile.title}
            </p>
            <p className="text-xs text-[#1F2F58]/70 leading-relaxed">
              {tile.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
