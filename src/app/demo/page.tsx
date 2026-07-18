"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { ArrowLeft, LogIn, AlertCircle, Sparkles } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";

const DEMO_EMAIL = "demo@itseia.ai";
const DEMO_PASSWORD = "demo2026";

export default function DemoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === DEMO_EMAIL &&
        password === DEMO_PASSWORD
      ) {
        try {
          window.localStorage.setItem(
            "itseia_demo_user",
            JSON.stringify({
              email: DEMO_EMAIL,
              name: "Estudiante Demo",
              loggedAt: Date.now(),
            }),
          );
        } catch {}
        router.push("/demo/aula");
      } else {
        setError(
          "Credenciales incorrectas. Usa las del demo que están debajo.",
        );
        setLoading(false);
      }
    }, 500);
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <div className="min-h-screen bg-[#0A1628] text-white flex flex-col">
      <PublicHeader />

      {/* Ambient */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(251,188,12,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(115,184,231,0.08) 0%, transparent 50%)
          `,
        }}
      />

      <main className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/demo-info"
            className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <div
            className="p-8 md:p-10 rounded-3xl border border-white/10"
            style={{
              background:
                "linear-gradient(145deg, rgba(251,188,12,0.05) 0%, rgba(31,47,88,0.4) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 mb-4">
                <Sparkles className="w-3 h-3 text-[#FBBC0C]" />
                <span className="text-[#FBBC0C] text-[10px] font-bold tracking-[0.2em] uppercase">
                  Ingreso al Demo
                </span>
              </div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                Entra al{" "}
                <span className="text-[#FBBC0C]">Campus Virtual</span>
              </h1>
              <p className="text-sm text-white/60">
                Usa las credenciales del demo para explorar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
                  Correo
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@itseia.ai"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FBBC0C]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wide mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo2026"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FBBC0C]/50 transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F0846D]/10 border border-[#F0846D]/20 text-[#F0846D] text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FBBC0C] text-[#0A1628] py-3.5 rounded-xl font-bold text-sm hover:bg-[#E5AB00] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-[#FBBC0C]/20 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Entrando..." : "Entrar al campus"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/[0.08]">
              <p className="text-white/40 text-xs uppercase tracking-wider font-bold mb-3">
                Credenciales del demo
              </p>
              <div className="p-4 rounded-xl bg-[#0A1628] border border-[#FBBC0C]/20">
                <div className="font-mono text-xs text-white space-y-1">
                  <div>
                    <span className="text-[#73B8E7]">email:</span>{" "}
                    demo@itseia.ai
                  </div>
                  <div>
                    <span className="text-[#73B8E7]">pass: </span> demo2026
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="mt-3 text-xs text-[#FBBC0C] hover:underline font-semibold"
              >
                Rellenar automáticamente
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-white/40 mt-6">
            Este es un demo. Los datos que ingreses no se guardan.
          </p>
        </div>
      </main>
    </div>
  );
}
