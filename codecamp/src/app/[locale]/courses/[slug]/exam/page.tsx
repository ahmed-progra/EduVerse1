import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ExamClient } from "./exam-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const course = await prisma.course.findUnique({ where: { slug: params.slug }, select: { title: true } });
  if (!course) return { title: "Exam" };
  return {
    title: `${course.title} — Final Exam`,
    description: `Complete the final exam for ${course.title} to earn your certificate.`,
    alternates: { canonical: `/${params.locale}/courses/${params.slug}/exam` },
  };
}

export default async function ExamPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/${params.locale}/login`);

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  const placementResult = await prisma.placementResult.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (!placementResult) {
    redirect(`/${params.locale}/courses/${params.slug}/placement`);
  }

  const progress = await prisma.progress.findMany({
    where: { userId: session.user.id, lessonId: { in: course.lessons.map((l) => l.id) } },
    select: { lessonId: true, completed: true },
  });

  const completedSet = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
  const completedLessons = course.lessons.filter((l) => completedSet.has(l.id));
  const allComplete = course.lessons.length > 0 && completedLessons.length === course.lessons.length;

  if (!allComplete) {
    redirect(`/${params.locale}/courses/${params.slug}`);
  }

  const questions = course.lessons
    .filter((l) => l.quiz)
    .flatMap((l) => {
      const parsed = JSON.parse(l.quiz!) as {
        question: string;
        options: string[];
        correctIndex: number;
      }[];
      return parsed.map((q, idx) => ({
        id: `${l.id}-${idx}`,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
      }));
    });

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href={`/${params.locale}/courses/${params.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← Back to Course
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-display text-foreground">{course.title} — Final Exam</h1>
          <p className="text-muted-foreground mt-2">
            You must answer all {questions.length} questions to earn your certificate.
          </p>
        </div>

        <ExamClient
          courseSlug={params.slug}
          locale={params.locale}
          questions={questions}
        />
      </div>
    </div>
  );
}
