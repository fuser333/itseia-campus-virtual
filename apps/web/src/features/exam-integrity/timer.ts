"use client";

// ============================================================
// ITSEIA Academy — Hook useQuizTimer
// Temporizador regresivo con persistencia localStorage
// Auto-submit al vencer el tiempo (via onExpire callback)
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";

export interface QuizTimerState {
  secondsLeft: number;
  formattedTime: string;
  isExpired: boolean;
  isWarning: boolean; // true cuando quedan < 60 segundos
}

/**
 * Formatea segundos como MM:SS o HH:MM:SS si >= 1 hora.
 */
function formatTime(seconds: number): string {
  if (seconds <= 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Hook useQuizTimer
 *
 * @param totalSeconds   Duracion total del quiz en segundos. 0 o null = sin limite.
 * @param attemptKey     Clave unica para persistir en localStorage (e.g. `quiz_timer_${quizId}_${userId}`)
 * @param onExpire       Callback que se ejecuta cuando el tiempo llega a 0
 */
export function useQuizTimer(
  totalSeconds: number | null | undefined,
  attemptKey: string,
  onExpire: () => void
): QuizTimerState {
  const noTimer = !totalSeconds || totalSeconds <= 0;

  // Calcular segundos iniciales desde localStorage si existe
  const getInitialSeconds = useCallback((): number => {
    if (noTimer) return 0;
    try {
      const stored = localStorage.getItem(attemptKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > 0) {
          return Math.min(parsed, totalSeconds!);
        }
      }
    } catch {
      // localStorage no disponible (SSR, etc.)
    }
    return totalSeconds!;
  }, [noTimer, totalSeconds, attemptKey]);

  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    typeof window !== "undefined" ? getInitialSeconds() : (totalSeconds ?? 0)
  );
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Hidratar desde localStorage en cliente
  useEffect(() => {
    if (noTimer) return;
    setSecondsLeft(getInitialSeconds());
  }, [noTimer, getInitialSeconds]);

  // Countdown interval
  useEffect(() => {
    if (noTimer) return;
    if (secondsLeft <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      try { localStorage.removeItem(attemptKey); } catch { /* noop */ }
      onExpireRef.current();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        // Persistir cada segundo
        try { localStorage.setItem(attemptKey, String(next)); } catch { /* noop */ }
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true;
          clearInterval(interval);
          try { localStorage.removeItem(attemptKey); } catch { /* noop */ }
          onExpireRef.current();
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noTimer, attemptKey]);

  if (noTimer) {
    return {
      secondsLeft: 0,
      formattedTime: "",
      isExpired: false,
      isWarning: false,
    };
  }

  return {
    secondsLeft,
    formattedTime: formatTime(secondsLeft),
    isExpired: secondsLeft <= 0,
    isWarning: secondsLeft > 0 && secondsLeft <= 60,
  };
}
