"use client";

import { memo } from "react";
import { SpotlightCard } from "./spotlight-card";
import { cn } from "@/lib/utils";

/**
 * SpotlightAchievement — an achievement tile.
 * Only EARNED achievements light up and react to the pointer; locked ones stay
 * dimmed and inert (no spotlight), so the effect signals real accomplishment.
 * Rarity (derived from XP reward) drives both intensity and accent: the rarest
 * tier glows purple (`--chart-2`), everything else coral.
 */

type SpotlightAchievementProps = {
  icon: string;
  title: string;
  description: string;
  xpReward: number;
  isEarned: boolean;
  earnedAtLabel?: string;
  /** Play a one-time light-sweep on mount (the most recently unlocked one). */
  justUnlocked?: boolean;
};

function rarity(xpReward: number): { intensity: number; accent: string } {
  if (xpReward >= 150) return { intensity: 0.9, accent: "var(--chart-2)" }; // epic → purple
  if (xpReward >= 75) return { intensity: 0.7, accent: "var(--primary)" }; // rare
  return { intensity: 0.5, accent: "var(--primary)" }; // common
}

function SpotlightAchievementImpl({
  icon,
  title,
  description,
  xpReward,
  isEarned,
  earnedAtLabel,
  justUnlocked = false,
}: SpotlightAchievementProps) {
  const { intensity, accent } = rarity(xpReward);

  return (
    <SpotlightCard
      accent={accent}
      intensity={intensity}
      // Locked achievements are inert: no spotlight, no tilt, dimmed.
      spotlight={isEarned}
      tilt={isEarned}
      sweepOnMount={isEarned && justUnlocked}
      className={cn(
        "p-4",
        isEarned ? "border-primary/40 bg-primary/5" : "border-border bg-card/30 opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("text-2xl", !isEarned && "grayscale")}>{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-card-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-semibold text-primary">+{xpReward} XP</span>
            {isEarned && earnedAtLabel && (
              <span className="text-[10px] text-muted-foreground">· Earned {earnedAtLabel}</span>
            )}
          </div>
        </div>
        {isEarned && <span className="text-primary text-sm shrink-0">✓</span>}
      </div>
    </SpotlightCard>
  );
}

export const SpotlightAchievement = memo(SpotlightAchievementImpl);
