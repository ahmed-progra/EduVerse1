import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { LessonViewClient } from "./lesson-view-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string; lessonSlug: string } }): Promise<Metadata> {
  const course = await prisma.course.findUnique({ where: { slug: params.slug }, select: { id: true, title: true } });
  if (!course) return { title: "Lesson" };
  const lesson = await prisma.lesson.findFirst({ where: { slug: params.lessonSlug, courseId: course.id }, select: { title: true } });
  if (!lesson) return { title: "Lesson" };
  return {
    title: `${lesson.title} — ${course.title}`,
    description: `Study ${lesson.title} in the ${course.title} course. Interactive coding exercises and quizzes.`,
    alternates: { canonical: `/${params.locale}/courses/${params.slug}/lessons/${params.lessonSlug}` },
  };
}

export default async function LessonPage({
  params,
}: {
  params: { locale: string; slug: string; lessonSlug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/${params.locale}/login`);

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
  });

  if (!course) notFound();

  const placementResult = await prisma.placementResult.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (!placementResult) {
    redirect(`/${params.locale}/courses/${params.slug}/placement`);
  }

  const lesson = await prisma.lesson.findFirst({
    where: { slug: params.lessonSlug, courseId: course.id },
  });

  if (!lesson) notFound();

  const quizData = lesson.quiz
    ? (JSON.parse(lesson.quiz) as {
        question: string;
        options: string[];
        correctIndex: number;
      }[])
    : [];

  const progress = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <LessonViewClient
          locale={params.locale}
          courseSlug={params.slug}
          lesson={{
            id: lesson.id,
            title: lesson.title,
            markdown: lesson.theory,
            exerciseType: lesson.exerciseType,
            starterCode: lesson.starterCode ?? "",
            solution: lesson.exercisePrompt ?? "",
            questions: quizData.map((q, idx) => ({
              id: `${lesson.id}-${idx}`,
              text: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
            })),
          }}
          initialProgress={progress ? { completed: progress.completed } : null}
        />
      </div>
    </div>
  );
}
