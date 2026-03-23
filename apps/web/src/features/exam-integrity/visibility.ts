"use client";

// ============================================================
// ITSEIA Academy — Hook useTabVisibility
// Detecta cambios de pestaña via Page Visibility API
// Registra contador de salidas para el reporte de integridad
// ============================================================

import { useEffect, useRef, useState } from "react";

export interface TabVisibilityState {
  tabSwitchCount: number;
  lastSwitchAt: Date | null;
  justSwitched: boolean; // true por 3 segundos despues del primer switch (para mostrar advertencia)
}

/**
 * Hook useTabVisibility
 *
 * Escucha document.visibilitychange y lleva un contador de cuantas
 * veces el usuario salio de la pestaña/ventana durante el quiz.
 *
 * Solo cuenta transiciones hidden -> visible (regreso del usuario),
 * lo que evita doble-conteo.
 */
export function useTabVisibility(): TabVisibilityState {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastSwitchAt, setLastSwitchAt] = useState<Date | null>(null);
  const [justSwitched, setJustSwitched] = useState(false);
  const countRef = useRef(0);
  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleVisibilityChange() {
      // Solo contar cuando el usuario REGRESA (documento vuelve a ser visible)
      // Esto significa que salió antes
      if (document.visibilityState === "hidden") {
        countRef.current += 1;
        const now = new Date();
        setTabSwitchCount(countRef.current);
        setLastSwitchAt(now);
        setJustSwitched(true);

        // Limpiar timer anterior si existe
        if (warnTimerRef.current) {
          clearTimeout(warnTimerRef.current);
        }
        // Quitar el banner de advertencia despues de 4 segundos
        warnTimerRef.current = setTimeout(() => {
          setJustSwitched(false);
        }, 4000);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (warnTimerRef.current) {
        clearTimeout(warnTimerRef.current);
      }
    };
  }, []);

  return { tabSwitchCount, lastSwitchAt, justSwitched };
}
