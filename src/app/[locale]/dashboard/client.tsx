"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { getXpProgress, getLevelTitle } from "@/lib/xp";
import { resolveCourseSlug } from "@/lib/courses";
import { ErrorBoundary } from "@/components/error-boundary";
import { SpotlightStatCard } from "@/components/ui/spotlight-stat-card";
import { SpotlightWidget } from "@/components/ui/spotlight-widget";
import { generateDailyQuests } from "@/lib/quests";
import { sectionContainer, sectionItem, bounceIn } from "@/lib/motion-variants";
import { AnimatedNumber } from "@/components/ui/animated-number";

type CourseProgress = {
  id: string;
  slug: string;
  title: string;
  icon: string | null;
  language: string;
  totalLessons: number;
  completedLessons: number;
};

type RecentView = {
  title: string;
  lessonSlug: string;
  courseSlug: string;
  courseTitle: string;
  viewedAt: string;
};

type Achievement = {
  icon: string;
  title: string;
  earnedAt: string;
};

type DashboardClientProps = {
  userName: string;
  totalXp: number;
  completedLessons: number;
  totalLessons: number;
  streakDays: number;
  longestStreak: number;
  courseProgressList: CourseProgress[];
  lastLesson: { title: string; courseSlug: string; lessonSlug: string; courseTitle: string } | null;
  recentViews: RecentView[];
  achievements: Achievement[];
  dailyGoalCompleted: number;
  dailyGoalTarget: number;
  skillLevel: string;
  preferredLanguage: string | null;
  leaderboardRank: number | null;
  nextLesson: { title: string; courseSlug: string; lessonSlug: string; courseTitle: string } | null;
};

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ProgressBarSpring({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color ?? "var(--primary)" }}
        initial={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.5 }}
      />
    </div>
  );
}

export function DashboardClient({
  userName,
  totalXp,
  completedLessons,
  totalLessons,
  streakDays,
  longestStreak,
  courseProgressList,
  lastLesson,
  recentViews,
  achievements,
  skillLevel,
  preferredLanguage,
  leaderboardRank,
  nextLesson,
  dailyGoalCompleted,
  dailyGoalTarget,
}: DashboardClientProps) {
  const reduce = useReducedMotion();
  const { level, progress: xpProgress, xpInLevel, xpNeeded } = getXpProgress(totalXp);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const courseInProgress = courseProgressList.find(
    (c) => c.completedLessons > 0 && c.completedLessons < c.totalLessons,
  ) ?? courseProgressList.find((c) => c.totalLessons > 0) ?? null;
  const dailyQuests = generateDailyQuests(
    dailyGoalCompleted,
    dailyGoalTarget,
    streakDays,
    courseInProgress ? { slug: courseInProgress.slug, title: courseInProgress.title } : null,
  );

  return (
    <ErrorBoundary>
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <motion.div
          variants={reduce ? undefined : sectionContainer}
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "show"}
          className="space-y-6 pb-12"
        >
          {/* Welcome Header */}
          <motion.div variants={reduce ? undefined : sectionItem} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Welcome back, {userName}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {preferredLanguage
                  ? `Focusing on ${preferredLanguage} · ${skillLevel} level`
                  : "Continue your learning journey."}
              </p>
            </div>
            <Link
              href="/courses"
              className="text-sm text-primary hover:underline hidden sm:block"
            >
              Browse courses →
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={reduce ? undefined : sectionItem}>
            <motion.div
              variants={reduce ? undefined : sectionContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <motion.div variants={reduce ? undefined : bounceIn}>
                <SpotlightStatCard
                  icon="⚡"
                  value={<AnimatedNumber value={totalXp} formatter={(n) => n.toLocaleString("en-US")} />}
                  label="Total XP"
                  intensity={Math.min(0.9, 0.4 + level * 0.05)}
                  pulseEvent="eduverse:xp-updated"
                  footer={
                    <>
                      <div className="mt-2">
                        <ProgressBarSpring pct={xpProgress} />
                      </div>
                      <p className="text-[10px] mt-1">
                        <span className="text-primary font-semibold uppercase tracking-wider">Lv {level} · {getLevelTitle(level)}</span>
                        <span className="text-muted-foreground"> · {xpInLevel}/{xpNeeded} to next</span>
                      </p>
                    </>
                  }
                />
              </motion.div>

              <motion.div variants={reduce ? undefined : bounceIn}>
                <SpotlightStatCard
                  icon="📚"
                  value={`${completedLessons}/${totalLessons}`}
                  label="Lessons Done"
                  intensity={0.3 + (overallProgress / 100) * 0.6}
                  pulseKey={completedLessons}
                  footer={
                    <>
                      <div className="mt-2">
                        <ProgressBarSpring pct={overallProgress} color="rgb(34,197,94)" />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{overallProgress}% complete</p>
                    </>
                  }
                />
              </motion.div>

              <motion.div variants={reduce ? undefined : bounceIn}>
                <SpotlightStatCard
                  icon="🔥"
                  value={<AnimatedNumber value={streakDays} />}
                  label="Day Streak"
                  intensity={Math.min(0.85, 0.3 + streakDays * 0.04)}
                  pulseKey={streakDays}
                  footer={
                    <>
                      {streakDays > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 flex gap-0.5"
                        >
                          {Array.from({ length: Math.min(streakDays, 7) }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 15 }}
                              className="w-3 h-1.5 rounded-full bg-orange-500"
                            />
                          ))}
                          {streakDays > 7 && (
                            <span className="text-[10px] text-muted-foreground ml-1">+{streakDays - 7}</span>
                          )}
                        </motion.div>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">Best: {longestStreak} days</p>
                    </>
                  }
                />
              </motion.div>

              <motion.div variants={reduce ? undefined : bounceIn}>
                <SpotlightStatCard
                  icon="🏆"
                  value={leaderboardRank ? `#${leaderboardRank}` : "—"}
                  label="Leaderboard Rank"
                  accent="var(--chart-2)"
                  intensity={leaderboardRank ? Math.max(0.45, 0.9 - (leaderboardRank - 1) * 0.05) : 0.45}
                  footer={
                    <Link
                      href="/leaderboard"
                      className="mt-2 inline-block text-[10px] text-primary hover:underline"
                    >
                      View leaderboard →
                    </Link>
                  }
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <motion.div variants={reduce ? undefined : sectionItem} className="lg:col-span-2 space-y-6">
              {/* Next Recommended Lesson */}
              {nextLesson && (
                <motion.div variants={reduce ? undefined : sectionItem}>
                  <h2 className="text-sm font-semibold text-foreground mb-3">Next Recommended Lesson</h2>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={`/courses/${nextLesson.courseSlug}/lessons/${nextLesson.lessonSlug}`}
                      className="block group"
                    >
                      <SpotlightWidget
                        accent="var(--primary)"
                        intensity={0.75}
                        className="border-primary bg-primary/5"
                      >
                        <p className="text-xs text-muted-foreground mb-1">{nextLesson.courseTitle}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                            {nextLesson.title}
                          </p>
                          <span className="text-sm text-primary">→</span>
                        </div>
                      </SpotlightWidget>
                    </Link>
                  </motion.div>
                </motion.div>
              )}

              {/* Continue Learning */}
              {lastLesson && (
                <motion.div variants={reduce ? undefined : sectionItem}>
                  <h2 className="text-sm font-semibold text-foreground mb-3">Continue Learning</h2>
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={`/courses/${lastLesson.courseSlug}/lessons/${lastLesson.lessonSlug}`}
                      className="block rounded-[var(--radius)] border border-border bg-card p-5 hover:border-primary/50 hover:bg-card/80 transition-colors group"
                    >
                      <p className="text-xs text-muted-foreground mb-1">{lastLesson.courseTitle}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                          {lastLesson.title}
                        </p>
                        <span className="text-sm text-primary">→</span>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              )}

              {/* Course Progress */}
              <motion.div variants={reduce ? undefined : sectionItem}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-foreground">Your Courses</h2>
                  <Link href="/courses" className="text-xs text-primary hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-2">
                  {courseProgressList.map((course, idx) => {
                    const courseProgress =
                      course.totalLessons > 0
                        ? Math.round((course.completedLessons / course.totalLessons) * 100)
                        : 0;
                    return (
                      <motion.div
                        key={course.id}
                        initial={reduce ? undefined : { opacity: 0, x: -10 }}
                        animate={reduce ? undefined : { opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, type: "spring", stiffness: 200, damping: 22 }}
                      >
                        <Link
                          href={`/courses/${course.slug}`}
                          className="block rounded-[var(--radius)] border border-border bg-card/50 p-4 hover:border-primary/30 hover:bg-card/80 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl flex-shrink-0">{course.icon ?? "📖"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-card-foreground truncate">{course.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {course.completedLessons}/{course.totalLessons} lessons
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-semibold text-card-foreground">
                                {courseProgress}%
                              </p>
                              <div className="mt-1 h-1 w-16 ml-auto rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-primary"
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${courseProgress}%` }}
                                  transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.5 }}
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <motion.div variants={reduce ? undefined : sectionItem} className="space-y-6">
              {/* Recent Views */}
              {recentViews.length > 0 && (
                <motion.div variants={reduce ? undefined : sectionItem}>
                  <h2 className="text-sm font-semibold text-foreground mb-3">Recently Viewed</h2>
                  <div className="space-y-1.5">
                    {recentViews.map((view, i) => (
                      <motion.div
                        key={i}
                        initial={reduce ? undefined : { opacity: 0, x: 10 }}
                        animate={reduce ? undefined : { opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 22 }}
                      >
                        <Link
                          href={`/courses/${view.courseSlug}/lessons/${view.lessonSlug}`}
                          className="block rounded-[var(--radius)] border border-border bg-card/50 px-4 py-2.5 hover:border-primary/30 hover:bg-card/80 transition-colors text-sm"
                        >
                          <p className="text-card-foreground truncate">{view.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5" suppressHydrationWarning>
                            {view.courseTitle} · {formatTimeAgo(view.viewedAt)}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements */}
              {achievements.length > 0 && (
                <motion.div variants={reduce ? undefined : sectionItem}>
                  <h2 className="text-sm font-semibold text-foreground mb-3">Latest Achievements</h2>
                  <div className="space-y-1.5">
                    {achievements.map((a, i) => (
                      <motion.div
                        key={i}
                        initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
                        animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, type: "spring", stiffness: 250, damping: 20 }}
                        className="rounded-[var(--radius)] border border-border bg-card/50 px-4 py-2.5 flex items-center gap-3"
                      >
                        <span className="text-lg">{a.icon}</span>
                        <div>
                          <p className="text-sm text-card-foreground">{a.title}</p>
                          <p className="text-[10px] text-muted-foreground" suppressHydrationWarning>
                            Earned {formatTimeAgo(a.earnedAt)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Link
                    href="/achievements"
                    className="text-xs text-primary hover:underline mt-2 inline-block"
                  >
                    View all achievements →
                  </Link>
                </motion.div>
              )}

              {/* Daily Quests */}
              <motion.div variants={reduce ? undefined : sectionItem}>
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary" aria-hidden="true">◈</span>
                  Daily Quests
                </h2>
                <div className="space-y-2">
                  {dailyQuests.map((quest, idx) => (
                    <motion.div
                      key={quest.id}
                      initial={reduce ? undefined : { opacity: 0, y: 10 }}
                      animate={reduce ? undefined : { opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06, type: "spring", stiffness: 200, damping: 22 }}
                      className="rounded-[var(--radius)] border border-border bg-card/50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg shrink-0">{quest.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-card-foreground truncate">{quest.title}</p>
                            <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                              {quest.progress}/{quest.target}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{quest.description}</p>
                        </div>
                      </div>
                      {quest.target > 1 && (
                        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.min(100, Math.round((quest.progress / quest.target) * 100))}%` }}
                            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.5 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={reduce ? undefined : sectionItem}>
                <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
                <div className="space-y-1.5">
                  {[
                    { href: "/courses", label: "📖 Browse all courses" },
                    { href: "/leaderboard", label: "🏆 View leaderboard" },
                    ...(preferredLanguage ? [{ href: `/courses/${resolveCourseSlug(preferredLanguage)}`, label: `🚀 Continue ${preferredLanguage}` }] : []),
                  ].map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={reduce ? undefined : { opacity: 0, x: 10 }}
                      animate={reduce ? undefined : { opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 22 }}
                    >
                      <Link
                        href={item.href}
                        className="block rounded-[var(--radius)] border border-border bg-card/50 px-4 py-2.5 hover:border-primary/30 hover:bg-card/80 transition-colors text-sm text-card-foreground"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
