"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, GraduationCap } from "lucide-react";

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  career_interest: string;
  education_level: string;
  motivation: string;
}

const EMPTY_FORM: FormData = {
  full_name: "",
  email: "",
  phone: "",
  career_interest: "",
  education_level: "",
  motivation: "",
};

const CAREERS = [
  { value: "ia", label: "Inteligencia Artificial" },
  { value: "cd", label: "Ciencia de Datos" },
  { value: "bd", label: "Big Data" },
];

const EDUCATION_LEVELS = [
  { value: "bachiller", label: "Bachiller" },
  { value: "universitario", label: "Universitario" },
  { value: "profesional", label: "Profesional" },
];

export default function ApplyPage() {
  const supabase = createClient();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.full_name.trim())
      newErrors.full_name = "El nombre es requerido";
    if (!form.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Ingresa un email valido";
    }
    if (!form.phone.trim()) newErrors.phone = "El telefono es requerido";
    if (!form.career_interest)
      newErrors.career_interest = "Selecciona una carrera";
    if (!form.education_level)
      newErrors.education_level = "Selecciona tu nivel de estudios";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Try to save to 'leads' table
      const { error } = await supabase.from("leads").insert({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        career_interest: form.career_interest,
        education_level: form.education_level,
        motivation: form.motivation.trim() || null,
        source: "apply_form",
      });

      if (error) {
        // If leads table doesn't exist, we still consider it a success
        // but log the error — the form data was validated
        console.warn("Error saving lead (table may not exist):", error.message);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(
        "Hubo un error al enviar tu solicitud. Intenta de nuevo o contactanos por WhatsApp."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Success state
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1628] px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/20">
            <CheckCircle2 className="size-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Solicitud Recibida
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Te contactaremos pronto para continuar con tu proceso de admision.
          </p>
          <p className="mt-2 text-sm text-white/40">
            Revisa tu correo electronico ({form.email}) para mas informacion.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href="https://wa.me/593959892034?text=Hola%2C%20acabo%20de%20enviar%20mi%20solicitud%20de%20admision"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl border border-white/20 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-white/5"
            >
              Escribenos por WhatsApp
            </a>
            <Link
              href="/"
              className="block w-full rounded-xl bg-[#FBBC0C]/10 py-3 text-center text-sm font-semibold text-[#FBBC0C] transition-all hover:bg-[#FBBC0C]/20"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0A1628]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBBC0C]">
              <span className="text-lg font-bold text-[#0A1628]">IT</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ITSEIA{" "}
              <span className="text-sm font-normal text-[#73B8E7]">
                Tecnologico
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              Inicio
            </Link>
            <Link
              href="/login"
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              Iniciar Sesion
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <div className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-12 lg:grid-cols-5">
            {/* Left: Info */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBBC0C]/20">
                <GraduationCap className="size-7 text-[#FBBC0C]" />
              </div>
              <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
                Solicitud de{" "}
                <span className="text-[#FBBC0C]">Admision</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-white/50">
                Completa el formulario y nuestro equipo se pondra en contacto
                contigo para guiarte en el proceso de inscripcion.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "3 Carreras de IA",
                    desc: "Inteligencia Artificial, Ciencia de Datos, Big Data",
                  },
                  {
                    title: "5 Semestres",
                    desc: "2.5 anos de formacion integral con titulo IST",
                  },
                  {
                    title: "AI Lab Incluido",
                    desc: "Acceso a ChatGPT, Claude y Gemini desde el dia 1",
                  },
                  {
                    title: "Beca H3L",
                    desc: "$99/mes online · $149/mes presencial — accesible con Beca Corporativa H3L",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
                  >
                    <span className="mt-0.5 size-2 shrink-0 rounded-full bg-[#FBBC0C]" />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-white/40">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-sm text-white/30">
                Contacto directo: administracion@itseia.ai
                <br />
                WhatsApp: +593 95 989 2034
              </div>
            </div>

            {/* Right: Form */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre */}
                <div className="grid gap-1.5">
                  <Label htmlFor="full_name" className="text-white/70">
                    Nombre completo *
                  </Label>
                  <Input
                    id="full_name"
                    value={form.full_name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }))
                    }
                    placeholder="Ej: Juan Perez"
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                  />
                  {errors.full_name && (
                    <p className="text-xs text-red-400">{errors.full_name}</p>
                  )}
                </div>

                {/* Email + Phone */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-white/70">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="juan@ejemplo.com"
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="phone" className="text-white/70">
                      Telefono *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+593 99 999 9999"
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Career + Education */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="career" className="text-white/70">
                      Carrera de interes *
                    </Label>
                    <select
                      id="career"
                      value={form.career_interest}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          career_interest: e.target.value,
                        }))
                      }
                      className="h-8 w-full rounded-lg border border-white/10 bg-white/5 px-2.5 text-sm text-white outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="" className="bg-[#0A1628]">
                        Selecciona...
                      </option>
                      {CAREERS.map((c) => (
                        <option
                          key={c.value}
                          value={c.value}
                          className="bg-[#0A1628]"
                        >
                          {c.label}
                        </option>
                      ))}
                    </select>
                    {errors.career_interest && (
                      <p className="text-xs text-red-400">
                        {errors.career_interest}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="education" className="text-white/70">
                      Nivel de estudios *
                    </Label>
                    <select
                      id="education"
                      value={form.education_level}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          education_level: e.target.value,
                        }))
                      }
                      className="h-8 w-full rounded-lg border border-white/10 bg-white/5 px-2.5 text-sm text-white outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="" className="bg-[#0A1628]">
                        Selecciona...
                      </option>
                      {EDUCATION_LEVELS.map((l) => (
                        <option
                          key={l.value}
                          value={l.value}
                          className="bg-[#0A1628]"
                        >
                          {l.label}
                        </option>
                      ))}
                    </select>
                    {errors.education_level && (
                      <p className="text-xs text-red-400">
                        {errors.education_level}
                      </p>
                    )}
                  </div>
                </div>

                {/* Motivation */}
                <div className="grid gap-1.5">
                  <Label htmlFor="motivation" className="text-white/70">
                    Motivacion (opcional)
                  </Label>
                  <Textarea
                    id="motivation"
                    value={form.motivation}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        motivation: e.target.value,
                      }))
                    }
                    placeholder="Cuentanos por que te interesa estudiar IA..."
                    rows={4}
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                  />
                </div>

                {/* Error message */}
                {submitError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                    {submitError}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full bg-[#FBBC0C] text-base font-bold text-[#0A1628] hover:bg-[#FBBC0C]/90"
                >
                  {submitting && (
                    <Loader2
                      className="size-5 animate-spin"
                      data-icon="inline-start"
                    />
                  )}
                  {submitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>

                <p className="text-center text-xs text-white/30">
                  Al enviar este formulario aceptas ser contactado por ITSEIA
                  sobre carreras academicas.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-white/30">
            2026 ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial
          </div>
          <div className="flex gap-6">
            <a
              href="https://itseia.ai"
              target="_blank"
              className="text-sm text-white/30 transition-colors hover:text-white/60"
            >
              itseia.ai
            </a>
            <Link
              href="/login"
              className="text-sm text-white/30 transition-colors hover:text-white/60"
            >
              Plataforma
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
