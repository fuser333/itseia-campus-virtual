"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm", className)}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-[#1F2F58]/40 transition-colors hover:text-[#1F2F58]"
      >
        <Home className="size-3.5" />
        <span className="hidden sm:inline">Inicio</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-[#1F2F58]/20" />
            {isLast || !item.href ? (
              <span
                className={cn(
                  "truncate max-w-[200px]",
                  isLast
                    ? "font-medium text-[#0A1628]"
                    : "text-[#1F2F58]/40"
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="truncate max-w-[200px] text-[#1F2F58]/40 transition-colors hover:text-[#1F2F58]"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
