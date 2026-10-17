"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface XPToastProps {
  xp: number;
  label: string;
  onDismiss: () => void;
}

export default function XPToast({ xp, label, onDismiss }: XPToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 50);

    // Start exit after 2.5s
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 2500);

    // Fully dismiss after animation
    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-[100] pointer-events-none",
        "transition-all duration-300 ease-out",
        visible && !exiting
          ? "translate-x-0 opacity-100"
          : !visible
            ? "translate-x-full opacity-0"
            : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0A1628] border border-[#FBBC0C]/30 shadow-lg shadow-[#FBBC0C]/10 pointer-events-auto">
        {/* XP Icon with pulse */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#FBBC0C]/15">
          <span className="text-lg font-bold text-[#FBBC0C]">XP</span>
          <div className="absolute inset-0 rounded-lg bg-[#FBBC0C]/10 animate-ping" />
        </div>

        {/* Text */}
        <div>
          <p className="text-sm font-bold text-[#FBBC0C]">+{xp} XP</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>

        {/* Sparkle decorations */}
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FBBC0C] animate-bounce opacity-60" />
        <div className="absolute -bottom-0.5 right-4 w-1.5 h-1.5 rounded-full bg-[#FBBC0C]/40 animate-bounce [animation-delay:150ms]" />
      </div>
    </div>
  );
}

// ── Manager para multiples toasts ──
export interface XPToastData {
  id: string;
  xp: number;
  label: string;
}

export function XPToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: XPToastData[];
  onDismiss: (id: string) => void;
}) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ top: `${16 + index * 72}px` }}
          className="fixed right-4 z-[100]"
        >
          <XPToastInner
            xp={toast.xp}
            label={toast.label}
            onDismiss={() => onDismiss(toast.id)}
          />
        </div>
      ))}
    </>
  );
}

function XPToastInner({ xp, label, onDismiss }: XPToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 50);
    const exitTimer = setTimeout(() => setExiting(true), 2500);
    const dismissTimer = setTimeout(() => onDismiss(), 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        visible && !exiting
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0A1628] border border-[#FBBC0C]/30 shadow-lg shadow-[#FBBC0C]/10">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#FBBC0C]/15">
          <span className="text-lg font-bold text-[#FBBC0C]">XP</span>
          <div className="absolute inset-0 rounded-lg bg-[#FBBC0C]/10 animate-ping" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#FBBC0C]">+{xp} XP</p>
          <p className="text-xs text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
