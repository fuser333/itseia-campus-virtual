"use client";

// ============================================================
// ITSEIA Academy — PendingSubmissionsBadge
// Badge que muestra entregas pendientes de calificar para el docente
// Se actualiza automaticamente al montar y cada 60 segundos
// ============================================================

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface PendingSubmissionsBadgeProps {
  className?: string;
}

export function PendingSubmissionsBadge({ className = "" }: PendingSubmissionsBadgeProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const supabase = createClient();

    async function fetchPending() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user is admin (sees all) or docente (sees own subjects)
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const adminRoles = ["super_admin", "admin", "coordinacion"];
        const isAdmin = profile ? adminRoles.includes(profile.role) : false;

        let query = supabase
          .from("submissions")
          .select("id", { count: "exact", head: true })
          .is("grade", null);

        if (!isAdmin) {
          // Get teacher's subject IDs first
          const { data: subjects } = await supabase
            .from("subjects")
            .select("id")
            .eq("teacher_id", user.id)
            .eq("is_active", true);

          if (!subjects || subjects.length === 0) {
            setCount(0);
            return;
          }

          const subjectIds = subjects.map((s) => s.id);

          // Get assignments for teacher's subjects, then filter submissions
          const { data: assignments } = await supabase
            .from("assignments")
            .select("id")
            .in("subject_id", subjectIds);

          if (!assignments || assignments.length === 0) {
            setCount(0);
            return;
          }

          query = query.in(
            "assignment_id",
            assignments.map((a) => a.id)
          );
        }

        const { count: pendingCount } = await query;
        setCount(pendingCount ?? 0);
      } catch {
        // Silencioso — no es critico
      }
    }

    fetchPending();

    // Poll cada 60 segundos
    const interval = setInterval(fetchPending, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <span
      className={`inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#F0846D] px-1 py-0.5 text-[10px] font-bold text-white leading-none ${className}`}
      aria-label={`${count} entregas pendientes de calificar`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
