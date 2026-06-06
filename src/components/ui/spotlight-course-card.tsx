"use client";

import { memo } from "react";
import Link from "next/link";
import { SpotlightCard } from "./spotlight-card";
import { Button } from "./button";

/**
 * SpotlightCourseCard — a course tile that grows more energetic with progress.
 * Used on the course catalog. When `progress` is provided the glow intensity
 * scales with it ("Course Progress cards become more energetic as progress
 * increases"); without it, a calm default is used.
 */

type SpotlightCourseCardProps = {
  href: string;
  icon: string | null;
  title: string;
  description: string;
  /** 0..100 — optional completion percentage. Drives glow intensity when present. */
  progress?: number;
};

function intensityFor(progress?: number): number {
  if (progress == null) return 0.45;
  return Math.min(0.95, 0.35 + (progress / 100) * 0.6);
}

function SpotlightCourseCardImpl({
  href,
  icon,
  title,
  description,
  progress,
}: SpotlightCourseCardProps) {
  return (
    <Link href={href} className="block active:scale-[0.99] transition-transform">
      <SpotlightCard accent="var(--primary)" intensity={intensityFor(progress)} className="p-6">
        <div className="text-3xl mb-3">{icon}</div>
        <h2 className="text-xl font-semibold text-card-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {progress != null && (
          <div className="mb-4 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <Button variant="outline" size="sm">
          View Course
        </Button>
      </SpotlightCard>
    </Link>
  );
}

export const SpotlightCourseCard = memo(SpotlightCourseCardImpl);
