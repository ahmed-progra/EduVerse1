export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4">
        <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4" />
        <div className="h-10 w-8 bg-muted rounded animate-pulse mb-2" />
        <div className="h-7 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-full max-w-md bg-muted rounded animate-pulse mb-8" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[var(--radius)] border border-border bg-card p-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
