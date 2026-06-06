"use client";

import { memo, type ReactNode } from "react";
import { SpotlightCard } from "./spotlight-card";
import { cn } from "@/lib/utils";

/**
 * SpotlightWidget — a general titled container with the spotlight treatment, for
 * prominent non-stat widgets (e.g. the "Next recommended lesson" CTA). Keeps the
 * EduVerse card surface; adds an optional header row with a title + action slot.
 */

type SpotlightWidgetProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  accent?: string;
  intensity?: number;
  tilt?: boolean;
  spotlight?: boolean;
  className?: string;
};

function SpotlightWidgetImpl({
  children,
  title,
  action,
  accent = "var(--primary)",
  intensity = 0.5,
  tilt = true,
  spotlight = true,
  className,
}: SpotlightWidgetProps) {
  return (
    <SpotlightCard
      accent={accent}
      intensity={intensity}
      tilt={tilt}
      spotlight={spotlight}
      className={cn("p-5", className)}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </SpotlightCard>
  );
}

export const SpotlightWidget = memo(SpotlightWidgetImpl);
