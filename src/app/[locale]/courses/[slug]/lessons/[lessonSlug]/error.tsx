"use client";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-2xl font-display text-foreground mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-[var(--radius)] bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
