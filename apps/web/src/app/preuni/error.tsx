"use client";

import { useEffect } from "react";

/**
 * Aislamiento de fallos POR MÓDULO (Next.js App Router).
 * Si este módulo revienta, captura el error aquí y muestra un fallback —
 * los DEMÁS módulos siguen funcionando intactos. No tumba toda la plataforma.
 */
export default function ModuleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[module-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FBBC0C]/15 text-3xl">
        ⚠️
      </div>
      <h2 className="text-xl font-semibold text-[#F9F6E7]">
        Este módulo tuvo un problema
      </h2>
      <p className="max-w-md text-sm text-[#F9F6E7]/60">
        Tranquilo — el resto de la plataforma sigue funcionando. Puedes
        reintentar o ir a otro módulo desde el menú.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-[#FBBC0C] px-5 py-2.5 text-sm font-semibold text-[#0A1628] hover:opacity-90"
      >
        Reintentar
      </button>
    </div>
  );
}
