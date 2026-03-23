"use client";

import { useState, type ReactNode } from "react";
import {
  Play,
  Presentation,
  BookOpen,
  HelpCircle,
  FileEdit,
  Sparkles,
  Link2,
  Package,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SessionTab {
  id: string;
  label: string;
  icon: "video" | "slides" | "theory" | "quiz" | "assignment" | "ailab" | "resources" | "live";
  completed: boolean;
  available: boolean;
  content: ReactNode;
}

interface SessionTabsProps {
  tabs: SessionTab[];
  className?: string;
}

const iconMap: Record<SessionTab["icon"], React.ComponentType<{ className?: string }>> = {
  video: Play,
  slides: Presentation,
  theory: BookOpen,
  quiz: HelpCircle,
  assignment: FileEdit,
  ailab: Sparkles,
  resources: Link2,
  live: Video,
};

export default function SessionTabs({ tabs, className }: SessionTabsProps) {
  const availableTabs = tabs.filter((t) => t.available);
  const [activeTabId, setActiveTabId] = useState(
    availableTabs[0]?.id || tabs[0]?.id
  );

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Tab bar */}
      <div className="border-b border-[#1F2F58]/8 bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max px-4 gap-0.5">
            {tabs.map((tab) => {
              const Icon = iconMap[tab.icon] || Package;
              const isActive = tab.id === activeTabId;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.available) setActiveTabId(tab.id);
                  }}
                  disabled={!tab.available}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-all whitespace-nowrap",
                    isActive
                      ? "text-[#0A1628]"
                      : tab.available
                      ? "text-[#1F2F58]/40 hover:text-[#1F2F58]/70"
                      : "text-[#1F2F58]/20 cursor-not-allowed"
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{tab.label}</span>

                  {/* Completed dot */}
                  {tab.completed && (
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                  )}

                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#FBBC0C]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          {activeTab?.available ? (
            activeTab.content
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FBBC0C]/10">
        <Package className="size-8 text-[#FBBC0C]" />
      </div>
      <h3 className="text-base font-semibold text-[#0A1628]">
        Contenido en preparacion
      </h3>
      <p className="max-w-sm text-sm text-[#1F2F58]/50">
        Estamos trabajando en este contenido. Estara disponible pronto.
      </p>
    </div>
  );
}
