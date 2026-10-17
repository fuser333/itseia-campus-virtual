"use client";

// ============================================================
// ITSEIA Academy — ForumBadge
// Badge de notificaciones no leidas del foro para el docente
// Se actualiza automaticamente al montar
// ============================================================

import { useEffect, useState } from "react";

interface ForumBadgeProps {
  className?: string;
  // Si se pasa initialCount, evita el fetch inicial
  initialCount?: number;
}

export function ForumBadge({ className = "", initialCount }: ForumBadgeProps) {
  const [count, setCount] = useState<number>(initialCount ?? 0);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/forums/notifications");
        if (!res.ok) return;
        const data = await res.json();
        setCount(data.unreadCount ?? 0);
      } catch {
        // Silencioso — no es critico
      }
    }

    fetchUnread();

    // Poll cada 60 segundos para actualizar el badge
    const interval = setInterval(fetchUnread, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span
      className={`inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#F0846D] px-1 py-0.5 text-[10px] font-bold text-white leading-none ${className}`}
      aria-label={`${count} notificaciones no leidas del foro`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
