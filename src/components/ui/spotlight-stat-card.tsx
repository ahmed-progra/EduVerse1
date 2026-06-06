"use client";

import { memo, type ReactNode } from "react";
import { SpotlightCard } from "./spotlight-card";
import { cn } from "@/lib/utils";

/**
 * SpotlightStatCard — the dashboard stat widget (XP, Lessons, Streak, Rank).
 * Identical layout to the original card; the only change is the spotlight engine
 * underneath. `intensity` is meant to encode importance (e.g. grow with level,
 * streak, or progress) and `accent` switches coral ↔ purple.
 */

type SpotlightStatCardProps = {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  /** Glow token — "var(--primary)" (default) or "var(--chart-2)". */
  accent?: string;
  /** 0..1 — encode the widget's "importance" (higher XP/streak/progress → brighter). */
  intensity?: number;
  /** Extra content below the label (progress bar, streak dots, a link…). */
  footer?: ReactNode;
  /** Pulse when this window event fires (XP card → "eduverse:xp-updated"). */
  pulseEvent?: string;
  /** Pulse when this value changes. */
  pulseKey?: number;
  className?: string;
};

function SpotlightStatCardImpl({
  icon,
  value,
  label,
  accent = "var(--primary)",
  intensity = 0.5,
  footer,
  pulseEvent,
  pulseKey,
  className,
}: SpotlightStatCardProps) {
  return (
    <SpotlightCard
      accent={accent}
      intensity={intensity}
      pulseEvent={pulseEvent}
      pulseKey={pulseKey}
      className={cn("p-4", className)}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-card-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {footer}
    </SpotlightCard>
  );
}

export const SpotlightStatCard = memo(SpotlightStatCardImpl);
