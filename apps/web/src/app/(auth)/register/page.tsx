"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConsentCheckbox from "@/components/privacy/ConsentCheckbox";
import { POLICY_VERSION } from "@/features/privacy/version";
import {
  Eye,
  EyeOff,
  UserPlus,
  Brain,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentError, setConsentError] = useState("");

  // Password strength indicator
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setConsentError("");
    setLoading(true);

    // Validate password
    if (password.length < 8) {
      setError("La contrasena debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    // Validate name
    if (fullName.trim().length < 3) {
      setError("Ingresa tu nombre completo.");
      setLoading(false);
      return;
    }

    // Validate consent — LOPDP Art. 9 (mandatory, not pre-checked)
    if (!consentAccepted) {
      setConsentError("Debes aceptar la politica de privacidad para continuar.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setLoading(false);
      if (authError.message.includes("already registered")) {
        setError(
          "Este email ya esta registrado. Intenta iniciar sesion."
        );
      } else if (authError.message.includes("valid email")) {
        setError("Ingresa un correo electronico valido.");
      } else {
        setError(authError.message);
      }
      return;
    }

    // 2. Insert profile with role "estudiante"
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: authData.user.id,
          email: email.trim(),
          full_name: fullName.trim(),
          role: "estudiante",
          nivel_xp: 0,
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }

      // Register LOPDP consent (Art. 9) — must succeed before completing registration
      try {
        const consentRes = await fetch("/api/privacy/consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ policyVersion: POLICY_VERSION }),
        });
        if (!consentRes.ok) {
          // Rollback: delete the account if consent cannot be registered
          console.error("Failed to register consent — rolling back account creation");
          await supabase.auth.admin?.deleteUser?.(authData.user.id).catch(() => {});
          setError(
            "No se pudo registrar el consentimiento de privacidad. Por favor intenta de nuevo."
          );
          setLoading(false);
          return;
        }
      } catch {
        // Non-blocking: log error but continue — consent will be requested again on next login
        console.error("Consent registration failed silently");
      }

      // Auto-confirm email (MVP - skip email verification)
      try {
        await fetch("/api/auth/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: authData.user.id }),
        });
      } catch {
        // Continue even if confirm fails
      }

      // Auto-enroll in free demo course
      try {
        await fetch("/api/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: authData.user.id }),
        });
      } catch {
        // Don't block registration if auto-enroll fails
      }
    }

    setLoading(false);

    // After auto-confirm, sign in directly
    if (authData.user) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!signInError) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // If sign-in fails, show success message for email confirmation
      setSuccess(true);
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-yellow/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-yellow" />
          </div>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-3">
            Revisa tu correo
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            Enviamos un enlace de confirmacion a
          </p>
          <p className="text-yellow font-medium text-sm mb-6">{email}</p>
          <p className="text-muted-foreground text-xs leading-relaxed mb-8">
            Haz clic en el enlace del correo para activar tu cuenta. Revisa tu
            carpeta de spam si no lo encuentras.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-6 bg-secondary hover:bg-secondary/80 text-foreground font-medium text-sm rounded-lg transition-colors"
          >
            Ir a iniciar sesion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-navy-dark items-center justify-center">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light opacity-90" />
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              className="w-full h-full opacity-[0.03]"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid-reg"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-reg)" />
            </svg>
          </div>
          <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-light-blue/5 blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-coral/5 blur-3xl animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-yellow flex items-center justify-center">
              <Brain className="w-7 h-7 text-navy-dark" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-space-grotesk)]">
              ITSEIA
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
            Unete al futuro
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Forma parte de la primera generacion de profesionales en IA del
            Ecuador. Acceso inmediato al AI Lab.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4 text-left">
            {[
              {
                icon: "01",
                title: "Cursos especializados en IA",
                desc: "22 cursos con 198 modulos de contenido",
              },
              {
                icon: "02",
                title: "AI Lab multi-modelo",
                desc: "Practica con GPT, Claude, Gemini y mas",
              },
              {
                icon: "03",
                title: "Portafolio profesional",
                desc: "Construye proyectos reales desde el dia 1",
              },
            ].map((feature) => (
              <div
                key={feature.icon}
                className="glass rounded-xl p-4 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-yellow/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-yellow font-[family-name:var(--font-space-grotesk)]">
                    {feature.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {feature.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Registration form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-lg bg-yellow flex items-center justify-center">
              <Brain className="w-6 h-6 text-navy-dark" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
              ITSEIA
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
              Crear cuenta
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Registrate para acceder al campus virtual
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-lg bg-coral/10 border border-coral/20 p-3 text-sm text-coral animate-fade-in">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm">
                Nombre completo
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Juan Perez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                autoFocus
                className="h-11 bg-secondary/50 border-border/60 placeholder:text-muted-foreground/50 focus-visible:border-yellow focus-visible:ring-yellow/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Correo electronico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11 bg-secondary/50 border-border/60 placeholder:text-muted-foreground/50 focus-visible:border-yellow focus-visible:ring-yellow/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Contrasena
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-11 pr-10 bg-secondary/50 border-border/60 placeholder:text-muted-foreground/50 focus-visible:border-yellow focus-visible:ring-yellow/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          passwordStrength >= level
                            ? passwordStrength === 1
                              ? "bg-coral"
                              : passwordStrength === 2
                                ? "bg-yellow"
                                : "bg-green-500"
                            : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      {
                        check: passwordChecks.length,
                        label: "Al menos 8 caracteres",
                      },
                      {
                        check: passwordChecks.uppercase,
                        label: "Una letra mayuscula",
                      },
                      { check: passwordChecks.number, label: "Un numero" },
                    ].map((item) => (
                      <p
                        key={item.label}
                        className={`text-xs transition-colors ${
                          item.check
                            ? "text-green-400"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {item.check ? "✓" : "○"} {item.label}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Consent checkbox — LOPDP Art. 9 (NOT pre-checked) */}
            <ConsentCheckbox
              checked={consentAccepted}
              onChange={(v) => {
                setConsentAccepted(v);
                if (v) setConsentError("");
              }}
              error={consentError}
            />

            <Button
              type="submit"
              disabled={loading || passwordStrength < 2 || !consentAccepted}
              className="w-full h-11 bg-yellow hover:bg-yellow-hover text-navy-dark font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(251,188,12,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-yellow hover:text-yellow-hover font-medium transition-colors"
              >
                Inicia sesion
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground/60">
              &copy; {new Date().getFullYear()} ITSEIA - Instituto Ecuatoriano
              de Inteligencia Artificial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
