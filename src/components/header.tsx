"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLevel } from "@/lib/xp";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function NavLink({
  href,
  label,
  active,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative py-1 text-xs uppercase tracking-wider transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <motion.span
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {label}
      </motion.span>
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary shadow-[0_0_8px_color-mix(in_oklch,var(--primary)_60%,transparent)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [totalXp, setTotalXp] = useState(0);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const { level } = getLevel(totalXp);

  useEffect(() => {
    async function fetchXp() {
      if (!session?.user?.id) return;
      try {
        const res = await fetch("/api/user/progress/summary");
        const data = await res.json();
        setTotalXp(data.totalXp ?? 0);
      } catch (err) {
        console.warn("Failed to fetch XP summary:", err);
      }
    }
    fetchXp();
  }, [session]);

  return (
    <motion.header
      initial={reduce ? undefined : { y: -20, opacity: 0 }}
      animate={reduce ? undefined : { y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg shadow-[0_1px_0_color-mix(in_oklch,var(--primary)_18%,transparent)]"
    >
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-foreground shrink-0 hover:text-primary transition-colors"
          style={{ fontFamily: "var(--font-display), monospace" }}
          aria-label="EduVerse home"
        >
          <motion.span
            className="text-primary"
            aria-hidden="true"
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >&gt;</motion.span>
          <span>EduVerse</span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-2">
            / interactive coding
          </span>
          <span className="text-primary cursor-blink" aria-hidden="true" />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4 min-w-0" aria-label="Main navigation">
          {totalXp > 0 && (
            <motion.span
              initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="hidden md:inline-flex items-center gap-1.5 border border-border bg-card/40 px-2 py-0.5 text-xs shadow-[0_0_8px_color-mix(in_oklch,var(--primary)_15%,transparent)]"
              aria-label={`Level ${level}, ${totalXp} total XP`}
            >
              <span className="font-semibold text-primary tabular-nums">Lv {level}</span>
              <span className="text-muted-foreground tabular-nums">
                {totalXp.toLocaleString("en-US")} XP
              </span>
            </motion.span>
          )}

          <NavLink href="/courses" label="Courses" active={isActive("/courses")} />

          {session ? (
            <>
              <NavLink href="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
              <NavLink
                href="/leaderboard"
                label="Leaderboard"
                active={isActive("/leaderboard")}
                className="hidden sm:inline"
              />
            </>
          ) : null}

          <motion.button
            whileHover={reduce ? undefined : { scale: 1.08, rotate: 20 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="grid h-8 w-8 place-items-center border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors active:scale-[0.97]"
          >
            {theme === "light" ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            )}
          </motion.button>

          <LanguageSwitcher />

          {session ? (
            <>
              <motion.span
                initial={reduce ? undefined : { opacity: 0 }}
                animate={reduce ? undefined : { opacity: 1 }}
                className="hidden lg:inline text-xs text-muted-foreground truncate max-w-[12ch]"
              >
                {session.user?.name ?? session.user?.email}
              </motion.span>
              <Button variant="outline" size="sm" onClick={() => signOut()} aria-label="Sign out">
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
