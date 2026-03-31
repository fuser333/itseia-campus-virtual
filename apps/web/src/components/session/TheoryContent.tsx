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
            <h3 className="text-sm font-semibold text-[#0A1628]">{title}</h3>
          </div>
          {hasRead && (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle2 className="size-3" />
              Leido
            </span>
          )}
        </div>
      )}

      {/* Markdown content */}
      <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#0A1628] prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-[#1F2F58] prose-p:leading-relaxed prose-a:text-[#73B8E7] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#0A1628] prose-code:rounded-md prose-code:bg-[#1F2F58]/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#F0846D] prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-[#1F2F58]/10 prose-pre:bg-[#0A1628] prose-pre:text-white/80 prose-pre:text-sm prose-img:rounded-xl prose-blockquote:border-l-[#FBBC0C] prose-blockquote:bg-[#FBBC0C]/5 prose-blockquote:py-1 prose-blockquote:text-[#1F2F58] prose-li:text-[#1F2F58] prose-table:text-sm prose-th:bg-[#1F2F58]/5 prose-th:text-[#0A1628] prose-td:text-[#1F2F58] prose-hr:border-[#1F2F58]/10 prose-ul:marker:text-[#FBBC0C]">
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
