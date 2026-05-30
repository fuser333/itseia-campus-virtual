"use client";

import { useState, useCallback, type ReactNode } from "react";
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
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SessionAccordion from "./SessionAccordion";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export interface SessionTab {
  id: string;
  label: string;
  icon: "video" | "slides" | "theory" | "quiz" | "assignment" | "ailab" | "resources" | "live" | "recordings";
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
  recordings: Youtube,
};

export default function SessionTabs({ tabs, className }: SessionTabsProps) {
  const availableTabs = tabs.filter((t) => t.available);
  const [activeTabId, setActiveTabId] = useState(
    availableTabs[0]?.id || tabs[0]?.id
  );

  // Track which tabs have been visited so we keep them mounted (iframes stay alive)
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set([availableTabs[0]?.id || tabs[0]?.id])
  );

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    setVisitedTabs((prev) => new Set(prev).add(tabId));
  }, []);

  // All available tabs except the currently active one — go into the accordion
  const accordionTabs = tabs.filter(
    (t) => t.available && t.id !== activeTabId
  );

  return (
    <div className={cn("flex flex-col h-full bg-[#0A1628]", className)}>

      {/* ── Tab bar (sticky) ─────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b border-white/8 bg-[#0D1B30] shadow-lg shadow-black/20">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max px-4 gap-0.5">
            {tabs.map((tab) => {
              const Icon = iconMap[tab.icon] || Package;
              const isActive = tab.id === activeTabId;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.available) handleTabClick(tab.id);
                  }}
                  disabled={!tab.available}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-all whitespace-nowrap",
                    isActive
                      ? "text-[#F9F6E7]"
                      : tab.available
                      ? "text-[#F9F6E7]/40 hover:text-[#F9F6E7]/70"
                      : "text-[#F9F6E7]/15 cursor-not-allowed"
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{tab.label}</span>

                  {/* Completion dot */}
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

      {/* ── Scrollable body ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto text-[#F9F6E7]">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">

          {/* Keep visited tabs mounted but hidden — prevents iframe reload */}
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const wasVisited = visitedTabs.has(tab.id);
            if (!tab.available || !wasVisited) return null;

            return (
              <section
                key={tab.id}
                aria-label={tab.label}
                style={{ display: isActive ? "block" : "none" }}
              >
                <ErrorBoundary label={tab.label}>{tab.content}</ErrorBoundary>
              </section>
            );
          })}

          {/* Show empty state if active tab is not available */}
          {!tabs.find((t) => t.id === activeTabId)?.available && (
            <section aria-label="Contenido principal">
              <EmptyState />
            </section>
          )}

          {/* Accordion — all other available tabs */}
          {accordionTabs.length > 0 && (
            <SessionAccordion tabs={accordionTabs} />
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
      <h3 className="text-base font-semibold text-[#F9F6E7]">
        Contenido en preparación
      </h3>
      <p className="max-w-sm text-sm text-[#F9F6E7]/50">
        Estamos trabajando en este contenido. Estará disponible pronto.
      </p>
    </div>
  );
}
