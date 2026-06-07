"use client";

import { memo, type ReactNode } from "react";
import { SpotlightCard } from "./spotlight-card";
import { cn } from "@/lib/utils";

type SpotlightStatCardProps = {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  footer?: ReactNode;
  className?: string;
};

function SpotlightStatCardImpl({
  icon,
  value,
  label,
  footer,
  className,
}: SpotlightStatCardProps) {
  return (
    <SpotlightCard className={cn("p-4", className)}>
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
