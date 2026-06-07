export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[var(--radius)] border border-border bg-card p-6">
              <div className="h-8 w-8 bg-muted rounded animate-pulse mb-3" />
              <div className="h-5 w-32 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-muted rounded animate-pulse mb-4" />
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
