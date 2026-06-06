import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runCodeSchema } from "@/lib/validations";
import { executeCode } from "@/lib/judge0";
import { executeLocal } from "@/lib/execution";
import { handleApiError, AppError } from "@/lib/errors";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError(401, "Not authenticated");
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "X-RateLimit-Remaining": "0" } });
    }

    const body = await request.json();
    const parsed = runCodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { language, code } = parsed.data;

    // For HTML, return immediately — client renders live preview
    if (language === "html") {
      return NextResponse.json({
        stdout: "Preview rendered in the live preview panel.",
        stderr: "",
        output: "Preview rendered in the live preview panel.",
      });
    }

    // Try Judge0 remote execution, fall back to local
    try {
      const result = await executeCode({ language, code });
      return NextResponse.json(result, { headers: { "X-RateLimit-Remaining": String(remaining) } });
    } catch {
      // Judge0 unavailable — use local execution
      const localResult = executeLocal({ language, code });
      return NextResponse.json(localResult, { headers: { "X-RateLimit-Remaining": String(remaining) } });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
