import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";
import { updateStreak, updateDailyGoal } from "@/lib/streaks";
import { checkAndAwardAchievements } from "@/lib/achievements";

export async function GET(
  _request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AppError(401, "Unauthorized");

    const progress = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId: params.lessonId } },
    });

    return NextResponse.json(progress ?? { completed: false, xpEarned: 0, score: null });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AppError(401, "Unauthorized");

    const body = await request.json();
    const { completed, score } = body;

    const xpEarned = completed ? 50 : 0;

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId: session.user.id, lessonId: params.lessonId } },
      create: { userId: session.user.id, lessonId: params.lessonId, completed, score: score ?? null, xpEarned },
      update: { completed, score: score ?? undefined, xpEarned },
    });

    // Update streak and daily goal when lesson is completed
    let newAchievements: { key: string; title: string; description: string; icon: string; xpReward: number }[] = [];
    if (completed) {
      await updateStreak(session.user.id);
      await updateDailyGoal(session.user.id);
      const awarded = await checkAndAwardAchievements(session.user.id);
      newAchievements = awarded.map((a) => ({
        key: a.key,
        title: a.title,
        description: a.description,
        icon: a.icon ?? "🏆",
        xpReward: a.xpReward,
      }));
    }

    // Track view
    await prisma.lessonView.create({
      data: { userId: session.user.id, lessonId: params.lessonId },
    });

    return NextResponse.json({ ...progress, newAchievements });
  } catch (error) {
    return handleApiError(error);
  }
}
