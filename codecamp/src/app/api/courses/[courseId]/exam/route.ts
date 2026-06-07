import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { examSubmitSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(401, "Unauthorized");
    }

    const body = await request.json();
    const parsed = examSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { answers } = parsed.data;

    const course = await prisma.course.findFirst({
      where: { OR: [{ id: params.courseId }, { slug: params.courseId }] },
      select: { id: true },
    });
    if (!course) throw new AppError(404, "Course not found");

    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: "asc" },
      select: { id: true, quiz: true, title: true },
    });

    const allQuestions = lessons
      .filter((l) => l.quiz)
      .flatMap((l) => {
        const quiz = JSON.parse(l.quiz!) as {
          question: string;
          options: string[];
          correctIndex: number;
        }[];
        return quiz.map((q) => ({ ...q, lessonTitle: l.title }));
      });

    if (answers.length !== allQuestions.length) {
      throw new AppError(400, "Answer count mismatch");
    }

    const correctCount = allQuestions.filter(
      (q, i) => q.correctIndex === answers[i]
    ).length;

    const total = allQuestions.length;
    const passed = correctCount >= Math.ceil(total * 0.7);

    if (passed) {
      const courseLessons = await prisma.lesson.findMany({
        where: { courseId: course.id },
        select: { id: true },
      });

      for (const lesson of courseLessons) {
        await prisma.progress.upsert({
          where: {
            userId_lessonId: { userId: session.user.id, lessonId: lesson.id },
          },
          create: {
            userId: session.user.id,
            lessonId: lesson.id,
            completed: true,
            xpEarned: 100,
          },
          update: {
            completed: true,
            xpEarned: 100,
          },
        });
      }
    }

    return NextResponse.json({
      score: correctCount,
      total,
      passed,
      percentage: Math.round((correctCount / total) * 100),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
