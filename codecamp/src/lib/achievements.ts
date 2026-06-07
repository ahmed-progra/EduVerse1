import { prisma } from "@/lib/prisma";

export const ACHIEVEMENT_DEFINITIONS = [
  { key: "first_lesson", title: "First Steps", description: "Complete your first lesson", icon: "🎯", xpReward: 50, category: "milestone" },
  { key: "streak_3", title: "Getting Started", description: "Maintain a 3-day learning streak", icon: "🔥", xpReward: 50, category: "streak" },
  { key: "streak_7", title: "Week Warrior", description: "Maintain a 7-day learning streak", icon: "🔥", xpReward: 100, category: "streak" },
  { key: "streak_30", title: "Monthly Master", description: "Maintain a 30-day learning streak", icon: "🔥", xpReward: 500, category: "streak" },
  { key: "first_quiz_pass", title: "Quiz Ace", description: "Pass your first quiz", icon: "🧠", xpReward: 50, category: "quiz" },
  { key: "perfect_quiz", title: "Perfect Score", description: "Get 100% on any quiz", icon: "💯", xpReward: 100, category: "quiz" },
  { key: "first_project", title: "Builder", description: "Complete your first final project", icon: "🏗️", xpReward: 200, category: "project" },
  { key: "html_css_complete", title: "HTML Master", description: "Complete the HTML & CSS course", icon: "🌐", xpReward: 300, category: "course" },
  { key: "js_complete", title: "JavaScript Hero", description: "Complete the JavaScript course", icon: "🟨", xpReward: 300, category: "course" },
  { key: "python_complete", title: "Python Pro", description: "Complete the Python course", icon: "🐍", xpReward: 300, category: "course" },
  { key: "cpp_complete", title: "C++ Champion", description: "Complete the C++ course", icon: "⚡", xpReward: 300, category: "course" },
  { key: "all_courses", title: "Polyglot", description: "Complete all 4 courses", icon: "🏆", xpReward: 1000, category: "course" },
  { key: "xp_500", title: "Rising Star", description: "Earn 500 XP", icon: "⭐", xpReward: 100, category: "xp" },
  { key: "xp_1000", title: "Centurion", description: "Earn 1,000 XP", icon: "💎", xpReward: 150, category: "xp" },
  { key: "xp_5000", title: "Power Learner", description: "Earn 5,000 XP", icon: "👑", xpReward: 500, category: "xp" },
  { key: "ten_lessons", title: "Dedicated", description: "Complete 10 lessons", icon: "📚", xpReward: 100, category: "milestone" },
  { key: "fifty_lessons", title: "Learning Machine", description: "Complete 50 lessons", icon: "🤖", xpReward: 500, category: "milestone" },
  { key: "daily_goal_7", title: "Goal Crusher", description: "Hit your daily goal 7 days in a row", icon: "🎯", xpReward: 200, category: "streak" },
] as const;

export async function checkAndAwardAchievements(userId: string) {
  const userProgress = await prisma.progress.findMany({ where: { userId }, select: { completed: true, xpEarned: true } });
  const completedCount = userProgress.filter((p) => p.completed).length;
  const totalXp = userProgress.reduce((sum, p) => sum + p.xpEarned, 0);

  const quizResults = await prisma.quizResult.findMany({ where: { userId, passed: true } });
  const perfectQuizzes = await prisma.quizResult.findMany({ where: { userId } });

  const streak = await prisma.learningStreak.findUnique({ where: { userId } });

  const quizCount = quizResults.length;
  const perfectQuizCount = perfectQuizzes.filter((q) => q.score === q.total).length;

  const existingAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const existingKeys = new Set(existingAchievements.map((a) => a.achievementId));

  const achievementsToAward: string[] = [];

  if (completedCount >= 1) achievementsToAward.push("first_lesson");
  if (completedCount >= 10) achievementsToAward.push("ten_lessons");
  if (completedCount >= 50) achievementsToAward.push("fifty_lessons");
  if (totalXp >= 500) achievementsToAward.push("xp_500");
  if (totalXp >= 1000) achievementsToAward.push("xp_1000");
  if (totalXp >= 5000) achievementsToAward.push("xp_5000");
  if (quizCount >= 1) achievementsToAward.push("first_quiz_pass");
  if (perfectQuizCount >= 1) achievementsToAward.push("perfect_quiz");
  if (streak && streak.currentStreak >= 3) achievementsToAward.push("streak_3");
  if (streak && streak.currentStreak >= 7) achievementsToAward.push("streak_7");
  if (streak && streak.currentStreak >= 30) achievementsToAward.push("streak_30");

  const allAchievements = await prisma.achievement.findMany({
    where: { key: { in: achievementsToAward } },
  });

  const newAchievements = allAchievements.filter((a) => !existingKeys.has(a.id));

  for (const achievement of newAchievements) {
    await prisma.userAchievement.create({
      data: { userId, achievementId: achievement.id },
    });
  }

  return newAchievements;
}
