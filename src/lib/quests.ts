export type Quest = {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  link?: { href: string; label: string };
};

export function generateDailyQuests(
  completedToday: number,
  dailyGoalTarget: number,
  streakDays: number,
  courseInProgress: { slug: string; title: string } | null,
): Quest[] {
  const quests: Quest[] = [
    {
      id: "daily_goal",
      title: "Hit Your Daily Goal",
      description: `Complete ${dailyGoalTarget} lessons today`,
      icon: "🎯",
      progress: Math.min(completedToday, dailyGoalTarget),
      target: dailyGoalTarget,
    },
  ];

  if (streakDays > 0 && streakDays % 7 === 0) {
    quests.push({
      id: "streak_milestone",
      title: "Streak Milestone Nearby",
      description: `${streakDays} days and counting!`,
      icon: "🔥",
      progress: streakDays % 7,
      target: 7,
      link: undefined,
    });
  }

  if (courseInProgress) {
    quests.push({
      id: "continue_course",
      title: "Continue Your Course",
      description: courseInProgress.title,
      icon: "📖",
      progress: 0,
      target: 1,
      link: { href: `/courses/${courseInProgress.slug}/lessons`, label: "Continue" },
    });
  }

  return quests;
}
