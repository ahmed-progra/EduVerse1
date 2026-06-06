import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateQuizFeedback } from "@/lib/ai";
import { quizFeedbackSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(401, "Unauthorized");
    }

    const body = await request.json();
    const parsed = quizFeedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { questions } = parsed.data;

    const correctCount = questions.filter(
      (q) => q.userAnswer === q.correctIndex
    ).length;

    const feedback = await generateQuizFeedback(questions);

    return NextResponse.json({
      score: correctCount,
      total: questions.length,
      passed: correctCount >= Math.ceil(questions.length / 2),
      feedback,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
