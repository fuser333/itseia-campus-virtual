import Link from "next/link";
import { Brain, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="relative mb-8 inline-block">
          <div className="w-24 h-24 rounded-3xl bg-[#FBBC0C]/10 border border-[#FBBC0C]/20 flex items-center justify-center mx-auto">
            <Brain className="w-12 h-12 text-[#FBBC0C]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#F0846D]/20 border border-[#F0846D]/30 flex items-center justify-center">
            <span className="text-[#F0846D] font-bold text-sm">?</span>
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
          404
        </h1>
        <h2 className="text-xl font-semibold text-white/80 mb-3">
          Pagina no encontrada
        </h2>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          La pagina que buscas no existe o fue movida. Pero no te preocupes,
          la IA aun no ha conquistado todas las URLs.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold gap-2">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Mi dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
