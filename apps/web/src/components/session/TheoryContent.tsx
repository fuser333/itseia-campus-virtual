"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TheoryContentProps {
  content: string;
  title?: string;
  onRead?: () => void;
  className?: string;
}

export default function TheoryContent({
  content,
  title,
  onRead,
  className,
}: TheoryContentProps) {
  const [hasRead, setHasRead] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || hasRead) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRead) {
          setHasRead(true);
          onRead?.();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [onRead, hasRead]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-[#FBBC0C]" />
            <h3 className="text-sm font-semibold text-[#FBBC0C]">{title}</h3>
          </div>
          {hasRead && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="size-3" />
              Leído
            </span>
          )}
        </div>
      )}

      {/* Markdown content — dark theme palette */}
      <article
        className={cn(
          "prose prose-invert prose-lg max-w-none",
          // Headings: amarillo brillante
          "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#FBBC0C]",
          "prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4",
          "prose-h3:text-lg prose-h3:text-[#73B8E7] prose-h3:mt-6 prose-h3:mb-3",
          // Párrafos: beige legible
          "prose-p:text-[#F9F6E7] prose-p:leading-relaxed",
          // Links: azul claro ITSEIA
          "prose-a:text-[#73B8E7] prose-a:no-underline hover:prose-a:text-[#FBBC0C] hover:prose-a:underline",
          // Bold
          "prose-strong:text-[#FBBC0C] prose-strong:font-bold",
          // Code inline
          "prose-code:rounded-md prose-code:bg-[#1F2F58] prose-code:px-1.5 prose-code:py-0.5",
          "prose-code:text-[#F0846D] prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
          // Code blocks
          "prose-pre:rounded-xl prose-pre:border prose-pre:border-[#1F2F58]/60",
          "prose-pre:bg-[#0D1B30] prose-pre:text-[#F9F6E7]/90 prose-pre:text-sm",
          // Listas
          "prose-li:text-[#F9F6E7] prose-ul:marker:text-[#FBBC0C] prose-ol:marker:text-[#FBBC0C]",
          // Tablas
          "prose-table:text-sm prose-th:bg-[#1F2F58] prose-th:text-[#FBBC0C]",
          "prose-td:text-[#F9F6E7] prose-td:border-[#1F2F58]/40",
          // Blockquote
          "prose-blockquote:border-l-[#FBBC0C] prose-blockquote:bg-[#1F2F58]/30",
          "prose-blockquote:py-1 prose-blockquote:text-[#F9F6E7]/80",
          // HR
          "prose-hr:border-[#1F2F58]/40",
          // Imágenes
          "prose-img:rounded-xl"
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ href, children, ...props }) => {
              const isExternal = href && (href.startsWith("http") || href.startsWith("//"));
              return (
                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            },
            table: ({ children, ...props }) => (
              <div className="overflow-x-auto rounded-xl border border-[#1F2F58]/40 my-4">
                <table {...props} className="w-full border-collapse text-sm">
                  {children}
                </table>
              </div>
            ),
            th: ({ children, ...props }) => (
              <th
                {...props}
                className="px-4 py-2 text-left font-semibold text-[#FBBC0C] bg-[#1F2F58] border-b border-[#1F2F58]/60"
              >
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td
                {...props}
                className="px-4 py-2 text-[#F9F6E7] border-b border-[#1F2F58]/20"
              >
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* Sentinel element at the bottom to detect scroll */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
