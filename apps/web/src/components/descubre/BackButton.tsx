"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * BackButton — vuelve a la pagina anterior usando router.back().
 * Si no hay historial, hace fallback a window.history.back() y como ultima
 * opcion redirige a la home del sitio (que respeta el modulo del usuario).
 *
 * Diseñado para reemplazar los "Volver al dashboard" de las paginas /descubre/*
 * que llevaban al dashboard fantasma generico.
 */
export default function BackButton({ label = "Volver" }: { label?: string }) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
