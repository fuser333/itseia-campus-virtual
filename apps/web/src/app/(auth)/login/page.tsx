"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, Brain, Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(urlError || "");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setLoading(false);
      if (authError.message === "Invalid login credentials") {
        setError("Credenciales incorrectas. Verifica tu email y contrasena.");
      } else if (authError.message === "Email not confirmed") {
        setError(
          "Tu email no ha sido confirmado. Revisa tu bandeja de entrada."
        );
      } else {
        setError(authError.message);
      }
      return;
    }

    router.push(redirectTo);
    router.refresh();
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
                  id="grid"
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
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-yellow/5 blur-3xl animate-float" />
          <div
            className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-light-blue/5 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative z-10 max-w-md px-8 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-yellow flex items-center justify-center">
              <Brain className="w-7 h-7 text-navy-dark" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-space-grotesk)]">
              ITSEIA
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
            Campus Virtual
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Instituto Ecuatoriano de Inteligencia Artificial. Accede a tus
            cursos, AI Lab y portafolio profesional.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow font-[family-name:var(--font-space-grotesk)]">
                254
              </div>
              <div className="text-xs text-muted-foreground mt-1">Sesiones</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-2xl font-bold text-light-blue font-[family-name:var(--font-space-grotesk)]">
                10
              </div>
              <div className="text-xs text-muted-foreground mt-1">Programas</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-2xl font-bold text-coral font-[family-name:var(--font-space-grotesk)]">
                AI
              </div>
              <div className="text-xs text-muted-foreground mt-1">Lab</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
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
              Iniciar sesion
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Ingresa con tu cuenta de ITSEIA Academy
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-lg bg-coral/10 border border-coral/20 p-3 text-sm text-coral animate-fade-in">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                autoFocus
                className="h-11 bg-secondary/50 border-border/60 placeholder:text-muted-foreground/50 focus-visible:border-yellow focus-visible:ring-yellow/30"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Contrasena
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-light-blue hover:text-light-blue/80 transition-colors"
                >
                  Olvidaste tu contrasena?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contrasena"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-yellow hover:bg-yellow-hover text-navy-dark font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(251,188,12,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <LogIn className="w-4 h-4 mr-2" />
              )}
              {loading ? "Ingresando..." : "Iniciar sesion"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-yellow hover:text-yellow-hover font-medium transition-colors"
              >
                Registrate aqui
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
