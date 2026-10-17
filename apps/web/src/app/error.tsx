"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[#F0846D]/10 border border-[#F0846D]/20 flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-[#F0846D]" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Algo salio mal
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          Ocurrio un error inesperado. Nuestro equipo ha sido notificado.
          Puedes intentar recargar la pagina.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 gap-2 w-full"
            >
              <Home className="w-4 h-4" />
              Ir al inicio
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-white/20 text-xs font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
