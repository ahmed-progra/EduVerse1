import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

const profileSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  learningGoal: z.enum(["career", "academic", "hobby", "upskill"]).optional(),
  preferredLanguage: z.enum(["html-css", "javascript", "python", "cpp"]).optional(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

const SELECT = {
  id: true,
  email: true,
  name: true,
  learningGoal: true,
  preferredLanguage: true,
  skillLevel: true,
} as const;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AppError(401, "Not authenticated");

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: SELECT,
    });
    if (!user) throw new AppError(404, "User not found");

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AppError(401, "Not authenticated");

    const parsed = profileSchema.safeParse(await request.json());
    if (!parsed.success) {
      throw new AppError(400, "Invalid profile data");
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: SELECT,
    });

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
