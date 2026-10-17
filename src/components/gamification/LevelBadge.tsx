"use client";

import { getLevelInfo, getLevelIcon, getLevelColor } from "@/lib/gamification";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  xp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LevelBadge({
  xp,
  size = "md",
  className,
}: LevelBadgeProps) {
  const level = getLevelInfo(xp);
  const icon = getLevelIcon(level.level);
  const color = getLevelColor(level.level);

  if (size === "sm") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg",
          className
        )}
        style={{
          backgroundColor: `${color}15`,
          borderColor: `${color}30`,
          borderWidth: "1px",
        }}
      >
        <span className="text-xs leading-none">{icon}</span>
        <span
          className="text-[11px] font-semibold"
          style={{ color }}
        >
          Nv.{level.level}
        </span>
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 p-5 rounded-2xl",
          className
        )}
        style={{
          backgroundColor: `${color}08`,
          borderColor: `${color}25`,
          borderWidth: "1px",
        }}
      >
        {/* Large icon */}
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <span className="text-3xl">{icon}</span>
        </div>

        {/* Level info */}
        <div className="text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nivel {level.level}
          </p>
          <p
            className="text-lg font-bold mt-0.5"
            style={{ color }}
          >
            {level.name}
          </p>
        </div>

        {/* XP display */}
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {xp.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">XP Total</p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-1.5">
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>{level.minXP.toLocaleString()} XP</span>
            <span>{level.maxXP.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#1F2F58]/40 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${level.progress}%`,
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}40`,
              }}
            />
          </div>
          <p className="text-center text-[11px] text-gray-400">
            {Math.round(level.progress)}% al siguiente nivel
          </p>
        </div>
      </div>
    );
  }

  // Default: md size
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-xl",
        className
      )}
      style={{
        backgroundColor: `${color}10`,
        borderColor: `${color}25`,
        borderWidth: "1px",
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <span className="text-lg leading-none">{icon}</span>
      </div>

      {/* Info + progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p
            className="text-xs font-bold"
            style={{ color }}
          >
            {level.name}
          </p>
          <span className="text-[10px] text-gray-500">
            Nv.{level.level}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-1 w-full h-1.5 rounded-full bg-[#1F2F58]/40 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${level.progress}%`,
              backgroundColor: color,
            }}
          />
        </div>

        <p className="mt-0.5 text-[10px] text-gray-500">
          {xp.toLocaleString()} / {level.maxXP.toLocaleString()} XP
        </p>
      </div>
    </div>
  );
}
