import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

async function resolveCourse(slugOrId: string) {
  const course = await prisma.course.findFirst({
    where: { OR: [{ id: slugOrId }, { slug: slugOrId }] },
    select: { id: true },
  });
  if (!course) throw new AppError(404, "Course not found");
  return course.id;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AppError(401, "Unauthorized");

    const courseId = await resolveCourse(params.courseId);

    const questions = await prisma.placementQuestion.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    });

    const existingResult = await prisma.placementResult.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
    });

    return NextResponse.json({
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options) as string[],
        difficulty: q.difficulty,
        order: q.order,
      })),
      existingResult: existingResult
        ? {
            score: existingResult.score,
            total: existingResult.total,
            assignedLevel: existingResult.assignedLevel,
          }
        : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AppError(401, "Unauthorized");

    const courseId = await resolveCourse(params.courseId);

    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers)) {
      throw new AppError(400, "Answers must be an array");
    }

    const questions = await prisma.placementQuestion.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    });

    if (answers.length !== questions.length) {
      throw new AppError(400, "Answer count mismatch");
    }

    const correctCount = questions.filter(
      (q, i) => q.correctAnswer === answers[i]
    ).length;

    const total = questions.length;
    const percentage = correctCount / total;

    let assignedLevel: string;
    if (percentage >= 0.8) {
      assignedLevel = "advanced";
    } else if (percentage >= 0.5) {
      assignedLevel = "intermediate";
    } else {
      assignedLevel = "beginner";
    }

    await prisma.placementResult.upsert({
      where: {
        userId_courseId: { userId: session.user.id, courseId },
      },
      create: {
        userId: session.user.id,
        courseId,
        score: correctCount,
        total,
        assignedLevel,
      },
      update: {
        score: correctCount,
        total,
        assignedLevel,
      },
    });

    return NextResponse.json({
      score: correctCount,
      total,
      percentage: Math.round(percentage * 100),
      assignedLevel,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
