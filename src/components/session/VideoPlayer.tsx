"use client";

import { useEffect, useRef, useState } from "react";
import { Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  onWatched?: () => void;
  className?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      const videoId = match[1];
      // playlist=VIDEO_ID prevents YouTube from showing suggested videos at the end
      // rel=0 + modestbranding=1 minimize YouTube branding
      // iv_load_policy=3 hides annotations
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&playlist=${videoId}`;
    }
  }
  return url;
}

export default function VideoPlayer({
  videoUrl,
  title,
  onWatched,
  className,
}: VideoPlayerProps) {
  const [watched, setWatched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  useEffect(() => {
    // Mark as watched after 30 seconds on the page
    timerRef.current = setTimeout(() => {
      if (!watched) {
        setWatched(true);
        onWatched?.();
      }
    }, 30_000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onWatched, watched]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="size-4 text-[#F0846D]" />
            <h3 className="text-sm font-semibold text-[#0A1628]">{title}</h3>
          </div>
          {watched && (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle2 className="size-3" />
              Visto
            </span>
          )}
        </div>
      )}

      {/* Video embed */}
      <div className="overflow-hidden rounded-xl bg-black shadow-lg">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl || ""}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            title={title || "Video de la sesion"}
          />
        </div>
      </div>
    </div>
  );
}
