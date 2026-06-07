import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";
import { getLevel, getLevelTitle } from "@/lib/xp";

type Period = "all" | "week" | "month";

function windowStart(period: Period): Date | null {
  if (period === "all") return null;
  const now = new Date();
  const days = period === "week" ? 7 : 30;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AppError(401, "Unauthorized");

    const periodParam = new URL(request.url).searchParams.get("period");
    const period: Period =
      periodParam === "week" || periodParam === "month" ? periodParam : "all";
    const since = windowStart(period);

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, image: true },
    });
    const userIds = users.map((u) => u.id);

    // Level is a lifetime stat (all-time XP) — it represents who the user is.
    const lifetime = await prisma.progress.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds }, completed: true },
      _sum: { xpEarned: true },
    });
    const lifetimeXp = new Map(lifetime.map((p) => [p.userId, p._sum.xpEarned ?? 0]));

    // Ranking counts are scoped to the selected window (all/week/month).
    const windowed = await prisma.progress.groupBy({
      by: ["userId"],
      where: {
        userId: { in: userIds },
        completed: true,
        ...(since ? { createdAt: { gte: since } } : {}),
      },
      _count: { id: true },
      _sum: { xpEarned: true },
    });
    const progressMap = new Map(
      windowed.map((p) => [
        p.userId,
        { completedLessons: p._count.id, totalXp: p._sum.xpEarned ?? 0 },
      ])
    );

    const leaderboard = users
      .map((u) => {
        const stats = progressMap.get(u.id) ?? { completedLessons: 0, totalXp: 0 };
        const { level } = getLevel(lifetimeXp.get(u.id) ?? 0);
        return {
          userId: u.id,
          username: u.name ?? u.email?.split("@")[0] ?? "Anonymous",
          level,
          title: getLevelTitle(level),
          completedLessons: stats.completedLessons,
          totalXp: stats.totalXp,
        };
      })
      .sort((a, b) => {
        if (b.completedLessons !== a.completedLessons) {
          return b.completedLessons - a.completedLessons;
        }
        return b.totalXp - a.totalXp;
      })
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .slice(0, 50);

    const currentUserRank = leaderboard.find((e) => e.userId === session.user.id);

    return NextResponse.json({ leaderboard, currentUserRank, period });
  } catch (error) {
    return handleApiError(error);
  }
}
