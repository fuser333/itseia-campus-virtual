"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Clock, BookOpen, Zap, GraduationCap } from "lucide-react";
import PayPalCheckout from "@/components/payments/PayPalCheckout";
import Link from "next/link";

interface ProgramData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string;
  price: number;
  duration_months: number | null;
  is_active: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  carrera: "Carrera",
  curso: "Curso",
  preuni: "Preuniversitario",
  bootcamp: "Bootcamp",
};

const PROGRAM_FEATURES: Record<string, string[]> = {
  preuni: [
    "Acceso completo al contenido",
    "AI Lab con tutor personalizado",
    "Certificado de completacion",
    "3 meses de acceso",
  ],
  curso: [
    "Acceso completo a todos los modulos",
    "AI Lab con inteligencia artificial",
    "Certificado institucional ITSEIA",
    "Proyectos practicos con IA",
    "Soporte por WhatsApp",
  ],
  bootcamp: [
    "Acceso completo intensivo",
    "AI Lab multi-modelo",
    "Certificado profesional",
    "Mentoria personalizada",
    "Proyectos con empresas reales",
    "Acceso a bolsa de trabajo",
  ],
  carrera: [
    "Titulo registrado SENESCYT",
    "AI Lab avanzado",
    "Pasantias profesionales",
    "Acceso permanente al contenido",
  ],
};

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [program, setProgram] = useState<ProgramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Check auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=/checkout/${programId}`);
        return;
      }
      setIsAuthenticated(true);

      // Check if already enrolled
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("program_id", programId)
        .eq("status", "active")
        .single();

      if (enrollment) {
        router.push("/dashboard");
        return;
      }

      // Fetch program
      const { data: prog, error: progError } = await supabase
        .from("programs")
        .select("*")
        .eq("id", programId)
        .eq("is_active", true)
        .single();

      if (progError || !prog) {
        setError("Carrera no encontrada o no disponible.");
        setLoading(false);
        return;
      }

      setProgram(prog as ProgramData);
      setLoading(false);
    }

    loadData();
  }, [programId, router, supabase]);

  const handlePaymentSuccess = useCallback(
    (data: { enrollmentId: string; captureId: string }) => {
      // Small delay before redirect to show success state
      setTimeout(() => {
        router.push("/dashboard?payment=success");
      }, 2000);
    },
    [router]
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1628]">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 rounded-full border-2 border-[#FBBC0C] border-t-transparent animate-spin" />
          <p className="text-sm text-white/40">Cargando...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !program) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1628] px-4">
        <Card className="max-w-md border-[#F0846D]/20 bg-white/5">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#F0846D]/10">
              <ShieldCheck className="size-8 text-[#F0846D]" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {error || "Carrera no encontrada"}
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Verifica el enlace o contacta soporte.
            </p>
            <Link href="/dashboard" className="mt-6 inline-block">
              <Button className="bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90">
                <ArrowLeft className="mr-2 size-4" />
                Volver al Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const features = PROGRAM_FEATURES[program.type] || PROGRAM_FEATURES.curso;

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A1628]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/40 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="mr-1 size-4" />
              Volver
            </Button>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <h1 className="text-sm font-medium text-white/60">Checkout</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Order Summary - Left */}
          <div className="lg:col-span-3 space-y-6">
            {/* Program card */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <Badge className="border-none bg-[#FBBC0C]/15 text-[10px] font-semibold uppercase tracking-wider text-[#FBBC0C]">
                    {TYPE_LABELS[program.type] || "Curso"}
                  </Badge>
                  {program.duration_months && (
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="size-3" />
                      {program.duration_months}{" "}
                      {program.duration_months === 1 ? "mes" : "meses"}
                    </span>
                  )}
                </div>
                <CardTitle className="mt-3 text-2xl font-bold text-white">
                  {program.name}
                </CardTitle>
                {program.description && (
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {program.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="border-t border-white/5 pt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
                  Incluye
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FBBC0C]/10">
                        <svg
                          className="size-3 text-[#FBBC0C]"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3">
              <TrustSignal
                icon={<ShieldCheck className="size-4 text-[#73B8E7]" />}
                text="Pago seguro"
              />
              <TrustSignal
                icon={<Zap className="size-4 text-[#FBBC0C]" />}
                text="Acceso inmediato"
              />
              <TrustSignal
                icon={<GraduationCap className="size-4 text-[#F0846D]" />}
                text="Certificado incluido"
              />
            </div>
          </div>

          {/* Payment - Right */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              {/* Price summary */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-white/80">
                    Resumen de pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">{program.name}</span>
                    <span className="text-sm font-medium text-white">
                      ${Number(program.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white">Total</span>
                    <span className="text-2xl font-extrabold text-[#FBBC0C]">
                      ${Number(program.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/25">
                    USD (Dolares americanos). Pago unico, sin recurrencia.
                  </p>
                </CardContent>
              </Card>

              {/* PayPal button */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <PayPalCheckout
                    programId={program.id}
                    programName={program.name}
                    amount={Number(program.price)}
                    onSuccess={handlePaymentSuccess}
                  />
                </CardContent>
              </Card>

              {/* Help */}
              <p className="text-center text-xs text-white/30">
                Problemas con el pago?{" "}
                <a
                  href="https://wa.me/593959892034"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#73B8E7] underline hover:text-[#73B8E7]/80"
                >
                  Contactar soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helper Component ─── */

function TrustSignal({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
      {icon}
      <span className="text-[10px] font-medium text-white/40">{text}</span>
    </div>
  );
}
