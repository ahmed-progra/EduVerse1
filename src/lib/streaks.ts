import { prisma } from "@/lib/prisma";

export async function updateStreak(userId: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let streak = await prisma.learningStreak.findUnique({ where: { userId } });

  if (!streak) {
    streak = await prisma.learningStreak.create({
      data: { userId, currentStreak: 1, longestStreak: 1, lastActivityDate: today },
    });
    return streak;
  }

  const lastActivity = streak.lastActivityDate
    ? new Date(new Date(streak.lastActivityDate).getFullYear(), new Date(streak.lastActivityDate).getMonth(), new Date(streak.lastActivityDate).getDate())
    : null;

  if (!lastActivity) {
    streak = await prisma.learningStreak.update({
      where: { userId },
      data: { currentStreak: 1, longestStreak: Math.max(1, streak.longestStreak), lastActivityDate: today },
    });
    return streak;
  }

  const diffMs = today.getTime() - lastActivity.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return streak;
  }

  if (diffDays === 1) {
    const newStreak = streak.currentStreak + 1;
    streak = await prisma.learningStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActivityDate: today,
      },
    });
  } else {
    streak = await prisma.learningStreak.update({
      where: { userId },
      data: { currentStreak: 1, lastActivityDate: today },
    });
  }

  return streak;
}

export async function updateDailyGoal(userId: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let dailyGoal = await prisma.dailyGoal.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (!dailyGoal) {
    dailyGoal = await prisma.dailyGoal.create({
      data: { userId, date: today, completedLessons: 1 },
    });
  } else {
    dailyGoal = await prisma.dailyGoal.update({
      where: { id: dailyGoal.id },
      data: { completedLessons: dailyGoal.completedLessons + 1 },
    });
  }

  return dailyGoal;
}
