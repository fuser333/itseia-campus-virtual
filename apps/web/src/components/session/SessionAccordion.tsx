"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
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
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionTab } from "./SessionTabs";

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

interface AccordionItemProps {
  tab: SessionTab;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ tab, isOpen, onToggle }: AccordionItemProps) {
  const Icon = iconMap[tab.icon] || Package;
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  // Measure content height whenever it opens/closes
  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      // First snapshot actual height, then collapse
      setHeight(contentRef.current.scrollHeight);
      // Next frame: set to 0 so transition fires
      requestAnimationFrame(() => {
        setHeight(0);
      });
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        "rounded-xl border transition-colors duration-200",
        isOpen
          ? "border-[#FBBC0C]/30 bg-white shadow-sm"
          : "border-[#1F2F58]/8 bg-white/60 hover:border-[#1F2F58]/15 hover:bg-white"
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        aria-expanded={isOpen}
      >
        {/* Icon circle */}
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
            isOpen
              ? "bg-[#FBBC0C]/15 text-[#1F2F58]"
              : "bg-[#1F2F58]/5 text-[#1F2F58]/50"
          )}
        >
          <Icon className="size-4" />
        </div>

        {/* Label + status */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span
            className={cn(
              "text-sm font-semibold truncate",
              isOpen ? "text-[#0A1628]" : "text-[#1F2F58]/60"
            )}
          >
            {tab.label}
          </span>
          {tab.completed && (
            <span
              className="size-1.5 shrink-0 rounded-full bg-emerald-400"
              title="Completado"
            />
          )}
        </div>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#1F2F58]/30 transition-transform duration-300",
            isOpen && "rotate-180 text-[#FBBC0C]"
          )}
        />
      </button>

      {/* Collapsible content */}
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? (height ?? "none") : 0 }}
      >
        <div ref={contentRef} className="border-t border-[#1F2F58]/6 px-4 py-5">
          {tab.content}
        </div>
      </div>
    </div>
  );
}

interface SessionAccordionProps {
  tabs: SessionTab[];
  className?: string;
}

export default function SessionAccordion({ tabs, className }: SessionAccordionProps) {
  // Only show available tabs
  const available = tabs.filter((t) => t.available);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (available.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Section header */}
      <div className="flex items-center gap-2 px-1 pb-1">
        <div className="h-px flex-1 bg-[#1F2F58]/8" />
        <span className="text-[11px] font-medium uppercase tracking-widest text-[#1F2F58]/30">
          Mas contenido
        </span>
        <div className="h-px flex-1 bg-[#1F2F58]/8" />
      </div>

      {/* Accordion items */}
      {available.map((tab) => (
        <AccordionItem
          key={tab.id}
          tab={tab}
          isOpen={openIds.has(tab.id)}
          onToggle={() => toggle(tab.id)}
        />
      ))}
    </div>
  );
}
