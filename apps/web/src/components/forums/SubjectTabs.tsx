"use client";

// ============================================================
// ITSEIA Academy — SubjectTabs
// Navegacion de tabs Sesiones / Foro en la pagina de materia
// Componente cliente que envuelve contenido server-rendered
// ============================================================

import { useState } from "react";
import { BookOpen, MessagesSquare } from "lucide-react";
import { SubjectForumTab } from "./SubjectForumTab";

interface SubjectTabsProps {
  subjectId: string;
  currentUserId: string;
  canModerate: boolean;
  sessionsContent: React.ReactNode;
}

type Tab = "sesiones" | "foro";

export function SubjectTabs({
  subjectId,
  currentUserId,
  sessionsContent,
  canModerate,
}: SubjectTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("sesiones");

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 rounded-xl border border-[#1F2F58]/8 bg-white p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("sesiones")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "sesiones"
              ? "bg-[#1F2F58] text-white shadow-sm"
              : "text-[#1F2F58]/50 hover:text-[#1F2F58]/80 hover:bg-[#1F2F58]/5"
          }`}
        >
          <BookOpen className="size-3.5" />
          Sesiones
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("foro")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "foro"
              ? "bg-[#1F2F58] text-white shadow-sm"
              : "text-[#1F2F58]/50 hover:text-[#1F2F58]/80 hover:bg-[#1F2F58]/5"
          }`}
        >
          <MessagesSquare className="size-3.5" />
          Foro
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "sesiones" ? (
          <div>{sessionsContent}</div>
        ) : (
          <SubjectForumTab
            subjectId={subjectId}
            currentUserId={currentUserId}
            canModerate={canModerate}
          />
        )}
      </div>
    </div>
  );
}
