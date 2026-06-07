import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { quizSubmitSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";
import { generateQuizFeedback } from "@/lib/ai";
import { updateStreak, updateDailyGoal } from "@/lib/streaks";
import { checkAndAwardAchievements } from "@/lib/achievements";

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(401, "Unauthorized");
    }

    const body = await request.json();
    const parsed = quizSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { answers } = parsed.data;

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      select: { id: true, quiz: true },
    });

    if (!lesson || !lesson.quiz) {
      throw new AppError(404, "Quiz not found for this lesson");
    }

    const questions = JSON.parse(lesson.quiz) as {
      question: string;
      options: string[];
      correctIndex: number;
    }[];

    if (answers.length !== questions.length) {
      throw new AppError(400, "Answer count mismatch");
    }

    const correctCount = questions.filter(
      (q, i) => q.correctIndex === answers[i]
    ).length;

    const total = questions.length;
    const passed = correctCount >= Math.ceil(total / 2);

    const quizQuestions = questions.map((q, i) => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      userAnswer: answers[i],
    }));

    const feedback = await generateQuizFeedback(quizQuestions);

    const quizResult = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        lessonId: params.lessonId,
        score: correctCount,
        total,
        passed,
        feedback: feedback ? JSON.stringify(feedback) : null,
      },
    });

    if (passed) {
      await prisma.progress.upsert({
        where: {
          userId_lessonId: { userId: session.user.id, lessonId: params.lessonId },
        },
        create: {
          userId: session.user.id,
          lessonId: params.lessonId,
          completed: true,
          score: correctCount,
          xpEarned: 50,
        },
        update: {
          completed: true,
          score: correctCount,
          xpEarned: 50,
        },
      });

      // Drive the gamification loop: streak, daily goal, achievements, recent views.
      // These previously lived only on an endpoint nothing called, so the dashboard
      // never updated. Run them here on the actual completion path.
      await updateStreak(session.user.id);
      await updateDailyGoal(session.user.id);
      await checkAndAwardAchievements(session.user.id);
      await prisma.lessonView.create({
        data: { userId: session.user.id, lessonId: params.lessonId },
      });
    }

    return NextResponse.json({
      score: correctCount,
      total,
      passed,
      feedback,
      quizResultId: quizResult.id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
