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
        href="/"
        className="flex items-center gap-1 text-[#1F2F58]/55 transition-colors hover:text-[#1F2F58] font-medium"
      >
        <Home className="size-3.5" />
        <span className="hidden sm:inline">Inicio</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-[#1F2F58]/35" />
            {isLast || !item.href ? (
              <span
                className={cn(
                  "truncate max-w-[200px]",
                  isLast
                    ? "font-semibold text-[#0A1628]"
                    : "text-[#1F2F58]/55 font-medium"
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="truncate max-w-[200px] text-[#1F2F58]/55 font-medium transition-colors hover:text-[#1F2F58]"
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
