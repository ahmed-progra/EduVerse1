"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

type LeaderboardEntry = {
  userId: string;
  username: string;
  level: number;
  title: string;
  completedLessons: number;
  totalXp: number;
  rank: number;
};

type Period = "all" | "week" | "month";

const PERIODS: { id: Period; label: string }[] = [
  { id: "all", label: "All-Time" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

const PERIOD_BLURB: Record<Period, string> = {
  all: "Ranked by total lessons completed. XP breaks ties.",
  week: "Ranked by lessons completed in the last 7 days.",
  month: "Ranked by lessons completed in the last 30 days.",
};

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("all");

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaderboard?period=${period}`);
      if (!res.ok) return;
      const data = await res.json();
      setLeaderboard(data.leaderboard ?? []);
      setCurrentUserEntry(data.currentUserRank ?? null);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
      return;
    }
    if (status !== "authenticated") return;
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [status, router, locale, fetchLeaderboard]);

  const medals = ["◆", "◇", "◇"];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-start justify-center">
        <p className="text-muted-foreground mt-20">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 pb-12">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: -10 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
            <span className="text-[10px] text-muted-foreground">Auto-updates every 30s</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            <span className="text-primary mr-1.5 select-none">&gt;</span>
            {PERIOD_BLURB[period]}
          </p>
        </motion.div>

        {/* Period tabs */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-1.5 mb-5"
          role="tablist"
          aria-label="Leaderboard period"
        >
          {PERIODS.map((p) => {
            const active = period === p.id;
            return (
              <motion.button
                key={p.id}
                role="tab"
                aria-selected={active}
                onClick={() => setPeriod(p.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`text-xs uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-[var(--glow-soft)]"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {p.label}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 10 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chamfer border border-border bg-card/40 backdrop-blur-sm overflow-hidden"
        >
          <div className="flex items-center gap-3 px-3 sm:px-4 py-2.5 bg-muted/40 text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="w-10 shrink-0">Rank</span>
            <span className="flex-1 min-w-0">User</span>
            <span className="w-10 sm:w-16 text-right shrink-0">Lvl</span>
            <span className="w-14 sm:w-20 text-right shrink-0">Lessons</span>
            <span className="w-12 sm:w-16 text-right shrink-0">XP</span>
          </div>

          {leaderboard.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-10 text-center text-sm text-muted-foreground"
            >
              <span className="text-primary mr-1.5">&gt;</span>
              No users yet. Complete a lesson to claim rank #1.
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {leaderboard.map((entry, idx) => {
              const isCurrentUser = entry.userId === session?.user?.id;
              const isTop3 = entry.rank <= 3;
              return (
                <motion.div
                  key={entry.userId}
                  layout
                  initial={reduce ? undefined : { opacity: 0, x: entry.rank * 2 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{
                    delay: idx * 0.02,
                    type: "spring",
                    stiffness: 250,
                    damping: 22,
                  }}
                  className={`flex items-center gap-3 px-3 sm:px-4 py-3 text-sm border-t border-border transition-colors ${
                    isTop3 ? "bg-primary/[0.06]" : ""
                  } ${isCurrentUser ? "bg-primary/10 shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent)]" : "hover:bg-accent/40"}`}
                >
                  <motion.span
                    animate={isTop3 ? { scale: [1, 1.1, 1] } : undefined}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-10 shrink-0 font-bold tabular-nums ${
                      isTop3 ? "text-primary text-glow" : "text-muted-foreground"
                    }`}
                  >
                    {isTop3 && <span className="mr-0.5" aria-hidden="true">{medals[entry.rank - 1]}</span>}
                    {entry.rank}
                  </motion.span>
                  <span className="flex-1 min-w-0 truncate text-card-foreground">
                    {entry.username}
                    {isCurrentUser && <span className="text-[10px] text-primary ml-1.5">(you)</span>}
                    <span className="hidden md:inline text-[10px] text-muted-foreground ml-2">{entry.title}</span>
                  </span>
                  <span className="w-10 sm:w-16 text-right shrink-0 text-muted-foreground tabular-nums">{entry.level}</span>
                  <span className="w-14 sm:w-20 text-right shrink-0 text-card-foreground font-semibold tabular-nums">{entry.completedLessons}</span>
                  <span className="w-12 sm:w-16 text-right shrink-0 text-primary tabular-nums">{entry.totalXp}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {currentUserEntry && currentUserEntry.rank > 50 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 22 }}
            className="mt-4 chamfer border border-primary/40 bg-card/60 shadow-[var(--glow-soft)] px-3 sm:px-4 py-3"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="w-10 shrink-0 font-bold text-muted-foreground tabular-nums">{currentUserEntry.rank}</span>
              <span className="flex-1 min-w-0 truncate text-card-foreground">
                {currentUserEntry.username} <span className="text-[10px] text-primary ml-1">(you)</span>
              </span>
              <span className="w-10 sm:w-16 text-right shrink-0 text-muted-foreground tabular-nums">{currentUserEntry.level}</span>
              <span className="w-14 sm:w-20 text-right shrink-0 text-card-foreground font-semibold tabular-nums">{currentUserEntry.completedLessons}</span>
              <span className="w-12 sm:w-16 text-right shrink-0 text-primary tabular-nums">{currentUserEntry.totalXp}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-center"
        >
          <Link
            href={`/${locale}/dashboard`}
            className="text-sm text-primary hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
