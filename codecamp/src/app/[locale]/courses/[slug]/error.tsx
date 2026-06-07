"use client";

export default function CourseError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">Failed to load course. Please try again.</p>
        <button
          onClick={reset}
          className="rounded-[var(--radius)] bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold active:scale-[0.97]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
