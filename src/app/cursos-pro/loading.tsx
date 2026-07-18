/**
 * Loading state POR MÓDULO (Next.js App Router).
 * Mientras este módulo carga, muestra su propio spinner —
 * no bloquea la navegación a otros módulos (carga independiente).
 */
export default function ModuleLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-10 animate-spin rounded-full border-4 border-[#1F2F58] border-t-[#FBBC0C]" />
        <span className="text-sm text-[#F9F6E7]/50">Cargando…</span>
      </div>
    </div>
  );
}
