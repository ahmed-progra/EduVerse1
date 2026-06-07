"use client";

import { motion } from "motion/react";

type ProgressBarProps = {
  completed: number;
  total: number;
  xp?: number;
  streak?: number;
};

export function ProgressBar({ completed, total, xp, streak }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {completed}/{total} lessons
        </span>
        <span className="text-foreground font-medium">{percentage}%</span>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.5 }}
          className="h-full rounded-full bg-primary"
        />
      </div>

      {(xp !== undefined || streak !== undefined) && (
        <div className="flex gap-4 text-xs text-muted-foreground">
          {xp !== undefined && <span>⚡ {xp} XP</span>}
          {streak !== undefined && <span>🔥 {streak} day streak</span>}
        </div>
      )}
    </div>
  );
}
