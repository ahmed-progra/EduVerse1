export default function LessonLoading() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-6" />
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
