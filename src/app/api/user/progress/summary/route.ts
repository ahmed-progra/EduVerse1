import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(401, "Unauthorized");
    }

    const progress = await prisma.progress.findMany({
      where: { userId: session.user.id },
      select: { xpEarned: true, completed: true },
    });

    const totalXp = progress.reduce((sum, p) => sum + p.xpEarned, 0);
    const completedLessons = progress.filter((p) => p.completed).length;

    return NextResponse.json({ totalXp, completedLessons });
  } catch (error) {
    return handleApiError(error);
  }
}
