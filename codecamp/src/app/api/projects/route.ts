import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";
import { checkAndAwardAchievements } from "@/lib/achievements";
import { z } from "zod";

const submitSchema = z.object({
  projectId: z.string().min(1),
  code: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AppError(401, "Unauthorized");

    const body = await request.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { projectId, code } = parsed.data;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError(404, "Project not found");

    // Auto-grade: check for basic requirements presence
    const requirements: string[] = JSON.parse(project.requirements || "[]");
    let score = 0;
    const maxScore = 100;
    const pointsPerReq = requirements.length > 0 ? Math.floor(maxScore / requirements.length) : 0;

    for (const req of requirements) {
      const keywords = req.toLowerCase().match(/\b\w+\b/g) || [];
      const matches = keywords.filter((kw: string) => code.toLowerCase().includes(kw));
      if (matches.length >= Math.ceil(keywords.length * 0.3)) {
        score += pointsPerReq;
      }
    }

    score = Math.min(score, maxScore);

    const submission = await prisma.projectSubmission.upsert({
      where: { projectId_userId: { projectId, userId: session.user.id } },
      create: {
        projectId,
        userId: session.user.id,
        code,
        status: "graded",
        score,
        feedback: score >= 70
          ? "Great work! Your project meets the key requirements. Consider adding more polish and edge case handling."
          : "Good start! Review the requirements and try to address each one more thoroughly.",
      },
      update: {
        code,
        status: "graded",
        score,
        feedback: score >= 70
          ? "Great work! Your project meets the key requirements. Consider adding more polish and edge case handling."
          : "Good start! Review the requirements and try to address each one more thoroughly.",
      },
    });

    await checkAndAwardAchievements(session.user.id);

    return NextResponse.json(submission);
  } catch (error) {
    return handleApiError(error);
  }
}
