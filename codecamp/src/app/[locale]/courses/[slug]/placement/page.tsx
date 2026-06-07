import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { PlacementClient } from "./placement-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const course = await prisma.course.findUnique({ where: { slug: params.slug }, select: { title: true } });
  if (!course) return { title: "Placement Test" };
  return {
    title: `${course.title} — Placement Test`,
    description: `Take the placement test for ${course.title} to determine your starting level.`,
    alternates: { canonical: `/${params.locale}/courses/${params.slug}/placement` },
  };
}

export default async function PlacementPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/${params.locale}/login`);

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { placementQuestions: true },
  });

  if (!course) notFound();

  const existingResult = await prisma.placementResult.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (existingResult) {
    redirect(`/${params.locale}/courses/${params.slug}`);
  }

  const questions = course.placementQuestions.map((q) => ({
    id: q.id,
    text: q.question,
    options: JSON.parse(q.options) as string[],
    correctIndex: q.correctAnswer,
  }));

  if (questions.length === 0) {
    await prisma.placementResult.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        score: 0,
        total: 0,
        assignedLevel: "beginner",
      },
    });
    redirect(`/${params.locale}/courses/${params.slug}`);
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <div className="text-4xl mb-2">{course.icon}</div>
          <h1 className="text-3xl font-display text-foreground">Placement Test</h1>
          <p className="text-muted-foreground mt-2">
            Answer {questions.length} questions to determine your starting level for {course.title}.
          </p>
        </div>

        <PlacementClient
          courseSlug={params.slug}
          locale={params.locale}
          questions={questions}
        />
      </div>
    </div>
  );
}
