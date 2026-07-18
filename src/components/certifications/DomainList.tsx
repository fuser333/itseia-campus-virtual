"use client";

// ============================================================
// ITSEIA Academy — DomainList
// Accordion of domains with session list for a certification
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CertificationDomainWithSessions } from "@/types/database";

interface Props {
  domains: CertificationDomainWithSessions[];
  certificationSlug: string;
  programSlug?: string;    // if sessions reuse the /carreras/[slug] route
}

export default function DomainList({ domains, certificationSlug, programSlug }: Props) {
  const [openDomains, setOpenDomains] = useState<Set<string>>(
    new Set(domains.slice(0, 1).map((d) => d.id))
  );

  function toggle(id: string) {
    setOpenDomains((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {domains.map((domain, idx) => {
        const isOpen = openDomains.has(domain.id);
        const sessionsCount = domain.sessions_count ?? domain.certification_sessions?.length ?? 0;

        return (
          <div
            key={domain.id}
            className="rounded-xl border border-white/10 overflow-hidden"
          >
            {/* Domain header */}
            <button
              onClick={() => toggle(domain.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/[0.03] hover:bg-white/[0.05] transition-colors text-left"
            >
              {/* Order badge */}
              <span className="flex-shrink-0 w-6 h-6 rounded-md bg-[#1F2F58] flex items-center justify-center text-[10px] font-bold text-[#73B8E7]">
                {idx + 1}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {domain.nombre}
                </p>
                <p className="text-[11px] text-white/40 mt-0.5">
                  {sessionsCount} {sessionsCount === 1 ? "sesion" : "sesiones"}
                  {domain.porcentaje_en_examen > 0 &&
                    ` · ${domain.porcentaje_en_examen}% del examen`}
                </p>
              </div>

              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
              )}
            </button>

            {/* Domain body */}
            {isOpen && (
              <div className="border-t border-white/5 px-4 py-3 space-y-2.5">
                {/* Description */}
                {domain.descripcion && (
                  <p className="text-xs text-white/40 leading-relaxed mb-3">
                    {domain.descripcion}
                  </p>
                )}

                {/* Sessions */}
                {sessionsCount === 0 ? (
                  <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/5 px-3 py-2.5">
                    <Lock className="w-4 h-4 text-white/20" />
                    <p className="text-xs text-white/30">
                      Contenido en preparacion — disponible pronto
                    </p>
                  </div>
                ) : (
                  (domain.certification_sessions || []).map((cs, sIdx) => {
                    const sessionUrl = programSlug
                      ? `/carreras/${programSlug}/materia/${certificationSlug}-domain-${idx + 1}/sesion/${sIdx + 1}`
                      : "#";

                    return (
                      <div
                        key={cs.id}
                        className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
                      >
                        <span className="flex-shrink-0">
                          <PlayCircle className="w-4 h-4 text-[#73B8E7]" />
                        </span>
                        <span className="text-xs text-white/70 flex-1">
                          Sesion {sIdx + 1}
                        </span>
                        <BookOpen className="w-3.5 h-3.5 text-white/20" />
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
