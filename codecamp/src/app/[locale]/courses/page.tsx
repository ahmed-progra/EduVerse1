import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SpotlightCourseCard } from "@/components/ui/spotlight-course-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: "Course Catalog",
    description: "Browse our premium coding courses — Python, JavaScript, HTML/CSS, C++, and more. Start your learning journey today.",
    openGraph: { title: "Course Catalog — EduVerse", description: "Browse our premium coding courses." },
    alternates: { canonical: `/${params.locale}/courses` },
  };
}

export default async function CoursesPage({
  params,
}: {
  params: { locale: string };
}) {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">Course Catalog</h1>

        {courses.length === 0 ? (
          <p className="text-muted-foreground">No courses available yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <SpotlightCourseCard
                key={course.id}
                href={`/${params.locale}/courses/${course.slug}`}
                icon={course.icon}
                title={course.title}
                description={course.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
