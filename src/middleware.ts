import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const locales = ["en", "ar"];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts).*)"],
};
