export const PREFERRED_LANGUAGE_TO_SLUG: Record<string, string> = {
  "html-css": "html-css",
  javascript: "javascript-fundamentals",
  python: "python-basics",
  cpp: "cpp-basics",
};

export function resolveCourseSlug(preferredLanguage: string | null): string {
  if (!preferredLanguage) return "html-css";
  return PREFERRED_LANGUAGE_TO_SLUG[preferredLanguage] ?? preferredLanguage;
}
