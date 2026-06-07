export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PASS: 30,
  QUIZ_PERFECT: 50,
  STREAK_BONUS_3: 20,
  STREAK_BONUS_7: 50,
  STREAK_BONUS_30: 200,
  PROJECT_COMPLETE: 200,
  PROJECT_GRADE_A: 100,
  DAILY_GOAL: 30,
  ACHIEVEMENT_UNLOCK: (xp: number) => xp,
} as const;

/**
 * Named progression tiers. Each entry is the minimum level required to hold the
 * title; getLevelTitle returns the highest tier a level has reached. These are
 * the "I am getting better" milestones shown across the platform.
 */
export const LEVEL_TIERS: { level: number; title: string }[] = [
  { level: 1, title: "Explorer" },
  { level: 5, title: "Apprentice" },
  { level: 10, title: "Developer" },
  { level: 20, title: "Engineer" },
  { level: 30, title: "Architect" },
  { level: 50, title: "Master Builder" },
  { level: 75, title: "Elite Engineer" },
  { level: 100, title: "EduVerse Legend" },
];

export function getLevelTitle(level: number): string {
  let title = LEVEL_TIERS[0].title;
  for (const tier of LEVEL_TIERS) {
    if (level >= tier.level) title = tier.title;
    else break;
  }
  return title;
}

/** The next tier the user hasn't reached yet (for "next milestone" hints). */
export function getNextTier(level: number): { level: number; title: string } | null {
  return LEVEL_TIERS.find((t) => t.level > level) ?? null;
}

export function getLevel(xp: number): { level: number; xpForCurrent: number; xpForNext: number } {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForCurrent = Math.pow(level - 1, 2) * 100;
  const xpForNext = Math.pow(level, 2) * 100;
  return { level, xpForCurrent, xpForNext };
}

export function getXpProgress(xp: number): { level: number; progress: number; xpInLevel: number; xpNeeded: number } {
  const { level, xpForCurrent, xpForNext } = getLevel(xp);
  const xpInLevel = xp - xpForCurrent;
  const xpNeeded = xpForNext - xpForCurrent;
  const progress = Math.min(Math.round((xpInLevel / xpNeeded) * 100), 100);
  return { level, progress, xpInLevel, xpNeeded };
}
