import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { streamTutorResponse, type TutorMessage } from "@/lib/ai";
import { sanitizeForAI } from "@/lib/sanitize";
import { tutorMessageSchema } from "@/lib/validations";
import { handleApiError, AppError } from "@/lib/errors";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { "Content-Type": "application/json" } });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(401, "Unauthorized");
    }

    const body = await request.json();
    const parsed = tutorMessageSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { lessonId, message } = parsed.data;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, title: true, theory: true, exercisePrompt: true, starterCode: true },
    });

    if (!lesson) {
      throw new AppError(404, "Lesson not found");
    }

    const chatHistory = await prisma.chatHistory.findFirst({
      where: { lessonId, userId: session.user.id },
    });

    const previousMessages: TutorMessage[] = chatHistory
      ? (JSON.parse(chatHistory.messages) as TutorMessage[])
      : [];

    const updatedMessages: TutorMessage[] = [
      ...previousMessages,
      { role: "user", content: sanitizeForAI(message) },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = "";

          await streamTutorResponse(
            updatedMessages,
            {
              lessonTitle: lesson.title,
              theoryMarkdown: lesson.theory,
              userCode: lesson.starterCode ?? "",
              exerciseGoal: lesson.exercisePrompt ?? "",
            },
            (chunk) => {
              fullResponse += chunk;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
            }
          );

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );

          await prisma.chatHistory.upsert({
            where: {
              id: chatHistory?.id ?? "",
            },
            create: {
              lessonId,
              userId: session.user.id,
              messages: JSON.stringify([
                ...updatedMessages,
                { role: "assistant", content: fullResponse },
              ]),
            },
            update: {
              messages: JSON.stringify([
                ...updatedMessages,
                { role: "assistant", content: fullResponse },
              ]),
            },
          });

          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "AI tutor unavailable. Please try again." })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
