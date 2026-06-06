import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SpotlightAchievement } from "@/components/ui/spotlight-achievement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Track your earned achievements, badges, and milestones on EduVerse.",
  openGraph: { title: "Achievements — EduVerse", description: "Track your earned achievements and badges." },
};

function RarityBadge({ xpReward, earned }: { xpReward: number; earned: boolean }) {
  let label: string;
  let color: string;
  if (xpReward >= 500) { label = "Epic"; color = "text-chart-2 border-chart-2/50 bg-chart-2/10"; }
  else if (xpReward >= 200) { label = "Rare"; color = "text-primary border-primary/50 bg-primary/10"; }
  else if (xpReward >= 100) { label = "Uncommon"; color = "text-foreground border-border bg-muted"; }
  else { label = "Common"; color = "text-muted-foreground border-border bg-muted/50"; }

  return (
    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${color} ${!earned ? "opacity-40" : ""}`}>
      {label}
    </span>
  );
}

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const allAchievements = await prisma.achievement.findMany({
    orderBy: { category: "asc", xpReward: "desc" },
  });

  const earned = await prisma.userAchievement.findMany({
    where: { userId: session.user.id },
    select: { achievementId: true, earnedAt: true },
  });

  const earnedSet = new Map(earned.map((e) => [e.achievementId, e.earnedAt]));

  let latestEarnedId: string | null = null;
  let latestEarnedAt = 0;
  for (const e of earned) {
    const t = new Date(e.earnedAt).getTime();
    if (t > latestEarnedAt) {
      latestEarnedAt = t;
      latestEarnedId = e.achievementId;
    }
  }

  const totalEarned = earned.length;
  const totalAchievements = allAchievements.length;
  const totalProgress = totalAchievements > 0 ? Math.round((totalEarned / totalAchievements) * 100) : 0;

  const totalXpFromAchievements = allAchievements
    .filter((a) => earnedSet.has(a.id))
    .reduce((sum, a) => sum + a.xpReward, 0);

  const categories = [
    { key: "milestone", label: "Milestones" },
    { key: "streak", label: "Streaks" },
    { key: "quiz", label: "Quizzes" },
    { key: "project", label: "Projects" },
    { key: "course", label: "Courses" },
    { key: "xp", label: "XP Milestones" },
  ];

  const recentlyEarned = earned
    .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
    .slice(0, 4);

  const recentAchievements = recentlyEarned
    .map((e) => allAchievements.find((a) => a.id === e.achievementId))
    .filter(Boolean);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-1.5">
          <h1 className="text-2xl font-display font-bold text-foreground">Achievements</h1>
          <span className="text-xs text-muted-foreground tabular-nums">
            {totalXpFromAchievements.toLocaleString()} XP earned
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          <span className="text-primary mr-1.5 select-none">&gt;</span>
          Complete challenges to earn achievements and XP.
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span>{totalEarned} / {totalAchievements} ({totalProgress}%)</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Recently unlocked */}
        {recentAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-primary" aria-hidden="true">✦</span>
              Recently Unlocked
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {recentAchievements.map((a) =>
                a && (
                  <div
                    key={a.id}
                    className="chamfer-sm border border-primary/30 bg-primary/5 p-3 flex items-center gap-3"
                  >
                    <span className="text-xl">{a.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{a.description}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Achievement categories */}
        <div className="space-y-8">
          {categories.map((cat) => {
            const catAchievements = allAchievements.filter((a) => a.category === cat.key);
            if (catAchievements.length === 0) return null;

            const earnedCount = catAchievements.filter((a) => earnedSet.has(a.id)).length;

            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-foreground">{cat.label}</h2>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {earnedCount}/{catAchievements.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {catAchievements.map((a) => {
                    const isEarned = earnedSet.has(a.id);
                    const earnedAt = earnedSet.get(a.id);
                    return (
                      <div key={a.id} className="relative">
                        <RarityBadge xpReward={a.xpReward} earned={isEarned} />
                        <div className="mt-1">
                          <SpotlightAchievement
                            icon={a.icon}
                            title={a.title}
                            description={a.description}
                            xpReward={a.xpReward}
                            isEarned={isEarned}
                            earnedAtLabel={
                              earnedAt ? new Date(earnedAt).toLocaleDateString() : undefined
                            }
                            justUnlocked={a.id === latestEarnedId}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
