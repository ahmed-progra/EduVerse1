import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(401, "Not authenticated");
    }

    const body = await request.json();
    const { name, learningGoal, preferredLanguage, skillLevel } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(learningGoal && { learningGoal }),
        ...(preferredLanguage && { preferredLanguage }),
        ...(skillLevel && { skillLevel }),
        onboardingComplete: true,
      },
      select: { id: true, email: true, name: true, onboardingComplete: true, preferredLanguage: true, skillLevel: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
