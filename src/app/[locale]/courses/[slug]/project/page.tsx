import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ProjectClient } from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const course = await prisma.course.findUnique({ where: { slug: params.slug }, select: { title: true } });
  if (!course) return { title: "Project" };
  return {
    title: `${course.title} — Final Project`,
    description: `Complete the capstone project for ${course.title} to finish the course.`,
    alternates: { canonical: `/${params.locale}/courses/${params.slug}/project` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/${params.locale}/login`);

  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: { projects: { where: { published: true }, take: 1 } },
  });

  const project = course?.projects?.[0];
  if (!course || !project) notFound();

  const existingSubmission = await prisma.projectSubmission.findUnique({
    where: { projectId_userId: { projectId: project.id, userId: session.user.id } },
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-display text-foreground">{course.title} — Final Project</h1>
          <p className="text-muted-foreground mt-2">Build your capstone project to complete this course.</p>
        </div>

        <ProjectClient
          projectId={project.id}
          projectTitle={project.title}
          projectDescription={project.description}
          projectRequirements={JSON.parse(project.requirements) as string[]}
          existingSubmission={existingSubmission?.code ?? null}
          existingFeedback={existingSubmission?.feedback ?? null}
          existingScore={existingSubmission?.score ?? null}
        />
      </div>
    </div>
  );
}
