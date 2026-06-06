import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, AppError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(401, "Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) {
      throw new AppError(400, "courseId required");
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    if (!course) {
      throw new AppError(404, "Course not found");
    }

    const allLessons = await prisma.lesson.count({
      where: { courseId },
    });

    const completedLessons = await prisma.progress.count({
      where: { userId: session.user.id, lesson: { courseId }, completed: true },
    });

    if (completedLessons < allLessons) {
      throw new AppError(403, "Complete all lessons before earning a certificate");
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate of Completion</title>
  <style>
    body { font-family: 'Georgia', serif; background: #faf9f5; margin: 0; padding: 40px; }
    .certificate { max-width: 800px; margin: 0 auto; border: 3px solid #c96442; padding: 60px; text-align: center; background: #fff; }
    h1 { color: #c96442; font-size: 28px; margin-bottom: 10px; }
    h2 { color: #3d3929; font-size: 22px; margin-bottom: 30px; }
    p { color: #535146; line-height: 1.6; }
    .student { font-size: 32px; color: #3d3929; margin: 20px 0; }
    .course-name { font-size: 24px; color: #c96442; margin: 20px 0; }
    .date { margin-top: 40px; color: #83827d; }
    .seal { margin-top: 30px; font-size: 48px; }
  </style>
</head>
<body>
  <div class="certificate">
    <h1>Certificate of Completion</h1>
    <p>This certifies that</p>
    <div class="student">${session.user.name ?? session.user.email}</div>
    <p>has successfully completed the course</p>
    <div class="course-name">${course.title}</div>
    <p>with distinction, demonstrating proficiency in the subject matter.</p>
    <div class="date">Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    <div class="seal">🏅</div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
