"use client";

import { memo } from "react";
import { SpotlightCard } from "./spotlight-card";
import { cn } from "@/lib/utils";

type SpotlightAchievementProps = {
  icon: string;
  title: string;
  description: string;
  xpReward: number;
  isEarned: boolean;
  earnedAtLabel?: string;
  justUnlocked?: boolean;
};

const HEXAGON_PATH =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

function rarityMeta(xpReward: number): {
  label: string;
  border: string;
  bg: string;
  text: string;
} {
  if (xpReward >= 300) {
    return {
      label: "Legendary",
      border: "border-amber-400",
      bg: "bg-gradient-to-br from-chart-2/30 via-transparent to-amber-400/10",
      text: "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]",
    };
  }
  if (xpReward >= 150) {
    return {
      label: "Epic",
      border: "border-chart-2/50",
      bg: "bg-chart-2/10",
      text: "text-chart-2",
    };
  }
  if (xpReward >= 75) {
    return {
      label: "Rare",
      border: "border-primary/50",
      bg: "bg-primary/10",
      text: "text-primary",
    };
  }
  return {
    label: "Common",
    border: "border-border",
    bg: "bg-card/30",
    text: "text-muted-foreground",
  };
}

function SpotlightAchievementImpl({
  icon,
  title,
  description,
  xpReward,
  isEarned,
  earnedAtLabel,
}: SpotlightAchievementProps) {
  const meta = rarityMeta(xpReward);

  return (
    <SpotlightCard
      className={cn(
        "p-3 flex items-center gap-3",
        isEarned ? meta.bg : "opacity-60",
      )}
    >
      <div
        className={cn(
          "shrink-0 w-12 h-12 flex items-center justify-center text-lg",
          "clip-hexagon",
          isEarned ? meta.border : "border border-border",
          isEarned ? "bg-card" : "bg-card/50",
        )}
        style={{ clipPath: HEXAGON_PATH }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-card-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={cn("text-[10px] font-bold", isEarned ? meta.text : "text-muted-foreground")}>
            +{xpReward} XP
          </span>
          {!isEarned && (
            <span className="text-[10px] text-muted-foreground">{meta.label}</span>
          )}
          {isEarned && earnedAtLabel && (
            <span className="text-[10px] text-muted-foreground">· {earnedAtLabel}</span>
          )}
        </div>
      </div>
      {isEarned && (
        <span className={cn("text-sm font-bold shrink-0", meta.text)}>✓</span>
      )}
    </SpotlightCard>
  );
}

export const SpotlightAchievement = memo(SpotlightAchievementImpl);
