import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LessonListClient } from "./lesson-list-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const course = await prisma.course.findUnique({ where: { slug: params.slug }, select: { title: true, description: true } });
  if (!course) return { title: "Course Not Found" };
  return {
    title: course.title,
    description: course.description.slice(0, 160),
    openGraph: { title: `${course.title} — EduVerse`, description: course.description.slice(0, 160) },
    alternates: { canonical: `/${params.locale}/courses/${params.slug}` },
  };
}

export default async function CoursePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const session = await getServerSession(authOptions);

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  const courseId = course.id;

  if (session?.user?.id) {
    const placementResult = await prisma.placementResult.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    if (!placementResult) {
      redirect(`/${params.locale}/courses/${params.slug}/placement`);
    }

    const userProgress = await prisma.progress.findMany({
      where: { userId: session.user.id, lessonId: { in: course.lessons.map((l) => l.id) } },
      select: { lessonId: true, completed: true },
    });

    const completedMap = new Map(userProgress.map((p) => [p.lessonId, p.completed]));
    const completedCount = userProgress.filter((p) => p.completed).length;
    const totalLessons = course.lessons.length;
    const allComplete = completedCount === totalLessons;

    const filteredLessons = course.lessons.filter((l) => {
      if (l.level === placementResult.assignedLevel) return true;
      if (l.level === "beginner" && placementResult.assignedLevel === "intermediate") return true;
      if (l.level !== "advanced" && placementResult.assignedLevel === "advanced") return true;
      return false;
    });

    const firstIncompleteIndex = course.lessons.findIndex(
      (l) => !completedMap.get(l.id)
    );
    const nextLessonSlug = firstIncompleteIndex >= 0
      ? course.lessons[firstIncompleteIndex].slug
      : null;

    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4">
          <Link href={`/${params.locale}/courses`} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Courses
          </Link>

          <div className="mb-6">
            <div className="text-4xl mb-2">{course.icon}</div>
            <h1 className="text-3xl font-display text-foreground">{course.title}</h1>
            <p className="text-muted-foreground mt-2">{course.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-medium capitalize">
                {placementResult.assignedLevel} path
              </span>
              <span className="text-muted-foreground">
                {completedCount}/{totalLessons} lessons completed
              </span>
              <div className="h-2 flex-1 max-w-xs rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${(completedCount / totalLessons) * 100}%` }}
                />
              </div>
            </div>

            {nextLessonSlug && (
              <Link
                href={`/${params.locale}/courses/${course.slug}/lessons/${nextLessonSlug}`}
                className="inline-block mt-4 rounded-[var(--radius)] bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-colors"
              >
                {completedCount === 0 ? "Start First Lesson →" : "Continue →"}
              </Link>
            )}
          </div>

          <LessonListClient
            locale={params.locale}
            courseSlug={course.slug}
            lessons={course.lessons.map((l) => ({
              id: l.id,
              slug: l.slug,
              title: l.title,
              exerciseType: l.exerciseType,
              level: l.level,
              order: l.order,
            }))}
            completedLessonIds={userProgress.filter((p) => p.completed).map((p) => p.lessonId)}
            inPathLessonIds={filteredLessons.map((l) => l.id)}
          />

          {allComplete && (
            <div className="mt-8 text-center">
              <Link href={`/${params.locale}/courses/${course.slug}/exam`}>
                <button
                  className="rounded-[var(--radius)] bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-colors"
                >
                  Take Final Exam →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  const totalLessons = course.lessons.length;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4">
        <Link href={`/${params.locale}/courses`} className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
          ← Back to Courses
        </Link>

        <div className="mb-8">
          <div className="text-4xl mb-2">{course.icon}</div>
          <h1 className="text-3xl font-display text-foreground">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.description}</p>
          <p className="text-sm text-muted-foreground mt-2">{totalLessons} lessons</p>
        </div>

        <div className="space-y-3">
          {course.lessons.map((lesson, idx) => (
            <div key={lesson.id} className="rounded-[var(--radius)] border border-border bg-card/50 p-4 flex items-center gap-4 opacity-60">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                {idx + 1}
              </span>
              <div>
                <h3 className="font-medium text-card-foreground">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">{lesson.exerciseType} exercise</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href={`/${params.locale}/register`}>
            <button className="rounded-[var(--radius)] bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-colors">
              Sign in to start learning →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
