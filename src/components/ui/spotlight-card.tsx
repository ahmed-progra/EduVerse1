"use client";

import { memo, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function SpotlightCardImpl({ children, className, style }: SpotlightCardProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn(
        "relative border border-border bg-card rounded-xl transition-shadow shadow-sm",
        "hover:shadow-md",
        className,
      )}
      style={{ ...style }}
      whileHover={reduce ? undefined : { y: -2 }}
    >
      {children}
    </motion.div>
  );
}

export const SpotlightCard = memo(SpotlightCardImpl);
