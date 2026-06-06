import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "./client";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Dashboard",
    description: "View your learning progress, XP, streak, and continue your courses.",
    alternates: { canonical: `/${params.locale}/dashboard` },
  };
}

export default async function DashboardPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/${params.locale}/login`);

  const userId = session.user.id;

  const [totalXpAgg, courses, progressCount, totalLessonsAgg, streak, recentViews, achievements, dailyGoal] =
    await Promise.all([
      prisma.progress.aggregate({
        where: { userId },
        _sum: { xpEarned: true },
      }),
      prisma.course.findMany({
        where: { published: true },
        select: {
          id: true,
          slug: true,
          title: true,
          icon: true,
          language: true,
          lessons: { select: { id: true } },
        },
        orderBy: { order: "asc" },
      }),
      prisma.progress.count({
        where: { userId, completed: true },
      }),
      prisma.lesson.count(),
      prisma.learningStreak.findUnique({ where: { userId } }),
      prisma.lessonView.findMany({
        where: { userId },
        orderBy: { viewedAt: "desc" },
        take: 5,
        include: {
          lesson: {
            select: { title: true, slug: true, course: { select: { slug: true, title: true } } },
          },
        },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { earnedAt: "desc" },
        take: 4,
      }),
      prisma.dailyGoal.findFirst({
        where: {
          userId,
          date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        },
      }),
    ]);

  const totalXp = totalXpAgg._sum.xpEarned ?? 0;
  const totalLessons = totalLessonsAgg;

  // Course progress
  const courseProgressList = await Promise.all(
    courses.map(async (course) => {
      const completed = await prisma.progress.count({
        where: { userId, completed: true, lesson: { courseId: course.id } },
      });
      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        icon: course.icon,
        language: course.language,
        totalLessons: course.lessons.length,
        completedLessons: completed,
      };
    })
  );

  const lastProgress = await prisma.progress.findFirst({
    where: { userId, completed: true },
    orderBy: { updatedAt: "desc" },
    include: {
      lesson: {
        select: { title: true, slug: true, course: { select: { slug: true, title: true } } },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, learningGoal: true, skillLevel: true, preferredLanguage: true },
  });

  // Leaderboard rank calculation
  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const allUserIds = allUsers.map((u) => u.id);
  const progressCounts = await prisma.progress.groupBy({
    by: ["userId"],
    where: { userId: { in: allUserIds }, completed: true },
    _count: { id: true },
    _sum: { xpEarned: true },
  });
  const rankedUsers = progressCounts
    .map((p) => ({
      userId: p.userId,
      completedLessons: p._count.id,
      totalXp: p._sum.xpEarned ?? 0,
    }))
    .sort((a, b) => {
      if (b.completedLessons !== a.completedLessons) return b.completedLessons - a.completedLessons;
      return b.totalXp - a.totalXp;
    });
  const userRank = rankedUsers.findIndex((u) => u.userId === userId) + 1;

  // Next recommended lesson
  const latestCourse = courseProgressList
    .filter((c) => c.completedLessons < c.totalLessons)
    .sort((a, b) => {
      const aPct = a.totalLessons > 0 ? a.completedLessons / a.totalLessons : 0;
      const bPct = b.totalLessons > 0 ? b.completedLessons / b.totalLessons : 0;
      return bPct - aPct;
    })[0];

  let nextLesson: { title: string; courseSlug: string; lessonSlug: string; courseTitle: string } | null = null;
  if (latestCourse) {
    const placement = await prisma.placementResult.findUnique({
      where: { userId_courseId: { userId, courseId: latestCourse.id } },
    });
    const allowedLevels = placement
      ? placement.assignedLevel === "beginner"
        ? ["beginner"]
        : placement.assignedLevel === "intermediate"
        ? ["beginner", "intermediate"]
        : ["beginner", "intermediate", "advanced"]
      : ["beginner", "intermediate", "advanced"];

    const firstIncomplete = await prisma.lesson.findFirst({
      where: {
        courseId: latestCourse.id,
        level: { in: allowedLevels },
        progress: { none: { userId, completed: true } },
      },
      orderBy: { order: "asc" },
      select: { title: true, slug: true, course: { select: { slug: true, title: true } } },
    });
    if (firstIncomplete) {
      nextLesson = {
        title: firstIncomplete.title,
        courseSlug: firstIncomplete.course.slug,
        lessonSlug: firstIncomplete.slug,
        courseTitle: firstIncomplete.course.title,
      };
    }
  }

  return (
    <DashboardClient
      userName={user?.name ?? user?.email ?? "Student"}
      totalXp={totalXp}
      completedLessons={progressCount}
      totalLessons={totalLessons}
      streakDays={streak?.currentStreak ?? 0}
      longestStreak={streak?.longestStreak ?? 0}
      courseProgressList={courseProgressList}
      lastLesson={
        lastProgress
          ? {
              title: lastProgress.lesson.title,
              courseSlug: lastProgress.lesson.course.slug,
              lessonSlug: lastProgress.lesson.slug,
              courseTitle: lastProgress.lesson.course.title,
            }
          : null
      }
      recentViews={recentViews.map((v) => ({
        title: v.lesson.title,
        lessonSlug: v.lesson.slug,
        courseSlug: v.lesson.course.slug,
        courseTitle: v.lesson.course.title,
        viewedAt: v.viewedAt.toISOString(),
      }))}
      achievements={achievements.map((a) => ({
        icon: a.achievement.icon,
        title: a.achievement.title,
        earnedAt: a.earnedAt.toISOString(),
      }))}
      dailyGoalCompleted={dailyGoal?.completedLessons ?? 0}
      dailyGoalTarget={dailyGoal?.targetLessons ?? 3}
      skillLevel={user?.skillLevel ?? "beginner"}
      preferredLanguage={user?.preferredLanguage ?? null}
      leaderboardRank={userRank > 0 ? userRank : null}
      nextLesson={nextLesson}
    />
  );
}
