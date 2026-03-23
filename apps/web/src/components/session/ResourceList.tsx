"use client";

import {
  FileText,
  ExternalLink,
  Play,
  Github,
  Database,
  Wrench,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Resource {
  title: string;
  url: string;
  type: "pdf" | "link" | "video" | "github" | "dataset" | "tool";
  description: string | null;
}

interface ResourceListProps {
  resources: Resource[];
  className?: string;
}

const typeConfig: Record<
  Resource["type"],
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }
> = {
  pdf: {
    icon: FileText,
    color: "text-[#F0846D]",
    bg: "bg-[#F0846D]/10",
    label: "PDF",
  },
  link: {
    icon: Link2,
    color: "text-[#73B8E7]",
    bg: "bg-[#73B8E7]/10",
    label: "Enlace",
  },
  video: {
    icon: Play,
    color: "text-[#FBBC0C]",
    bg: "bg-[#FBBC0C]/10",
    label: "Video",
  },
  github: {
    icon: Github,
    color: "text-[#1F2F58]",
    bg: "bg-[#1F2F58]/10",
    label: "GitHub",
  },
  dataset: {
    icon: Database,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    label: "Dataset",
  },
  tool: {
    icon: Wrench,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    label: "Herramienta",
  },
};

export default function ResourceList({
  resources,
  className,
}: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
        <Link2 className="size-8 text-[#1F2F58]/20" />
        <p className="text-sm text-[#1F2F58]/50">
          No hay recursos adicionales para esta sesion.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-semibold text-[#0A1628] mb-3">
        Recursos y bibliografia
      </h3>
      {resources.map((resource, index) => {
        const config = typeConfig[resource.type] || typeConfig.link;
        const Icon = config.icon;

        return (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-[#1F2F58]/8 bg-white p-3.5 transition-all hover:border-[#73B8E7]/30 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                config.bg
              )}
            >
              <Icon className={cn("size-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0A1628] group-hover:text-[#73B8E7] transition-colors truncate">
                {resource.title}
              </p>
              {resource.description && (
                <p className="mt-0.5 text-xs text-[#1F2F58]/40 line-clamp-1">
                  {resource.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                  config.bg,
                  config.color
                )}
              >
                {config.label}
              </span>
              <ExternalLink className="size-3.5 text-[#1F2F58]/20 group-hover:text-[#73B8E7] transition-colors" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
