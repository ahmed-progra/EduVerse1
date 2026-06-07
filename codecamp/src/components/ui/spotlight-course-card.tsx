"use client";

import { memo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SpotlightCard } from "./spotlight-card";

type SpotlightCourseCardProps = {
  href: string;
  icon: string | null;
  title: string;
  description: string;
  progress?: number;
  index?: number;
};

function SpotlightCourseCardImpl({
  href,
  icon,
  title,
  description,
  progress,
  index = 0,
}: SpotlightCourseCardProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.4),
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.7,
      }}
    >
      <Link href={href} className="block active:scale-[0.99] transition-transform">
        <SpotlightCard className="p-6">
          <div className="text-3xl mb-3">{icon}</div>
          <h2 className="text-xl font-semibold text-card-foreground mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {progress != null && (
            <div className="mb-4 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full w-full origin-left rounded-full bg-primary transition-transform duration-500 ease-out"
                style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` }}
              />
            </div>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            View Course <span aria-hidden="true">→</span>
          </span>
        </SpotlightCard>
      </Link>
    </motion.div>
  );
}

export const SpotlightCourseCard = memo(SpotlightCourseCardImpl);
