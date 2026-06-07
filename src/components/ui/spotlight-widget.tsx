"use client";

import { memo, type ReactNode } from "react";
import { SpotlightCard } from "./spotlight-card";
import { cn } from "@/lib/utils";

type SpotlightWidgetProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  className?: string;
};

function SpotlightWidgetImpl({
  children,
  title,
  action,
  className,
}: SpotlightWidgetProps) {
  return (
    <SpotlightCard className={cn("p-5", className)}>
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
