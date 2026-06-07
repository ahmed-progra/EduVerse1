"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, useReducedMotion } from "motion/react";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Award,
  Settings,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { getLevel } from "@/lib/xp";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

const sidebarItems = [
  { id: "dashboard", labelKey: "dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "courses", labelKey: "courses", icon: BookOpen, href: "/courses" },
  { id: "leaderboard", labelKey: "leaderboard", icon: Trophy, href: "/leaderboard" },
  { id: "achievements", labelKey: "achievements", icon: Award, href: "/achievements" },
  { id: "settings", labelKey: "settings", icon: Settings, href: "/settings" },
];

export function LeftSidebar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const locale = useLocale();
  const t = useTranslations("nav");
  const tTheme = useTranslations("nav.theme");
  const [totalXp, setTotalXp] = useState(0);

  const localized = (path: string) => `/${locale}${path}`;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const { level } = getLevel(totalXp);

  useEffect(() => {
    async function fetchXp() {
      if (!session?.user?.id) return;
      try {
        const res = await fetch("/api/user/progress/summary");
        const data = await res.json();
        setTotalXp(data.totalXp ?? 0);
      } catch {
        // Silently fail
      }
    }
    fetchXp();
  }, [session]);

  const isPublic = pathname === "/login" || pathname === "/register" || pathname === "/" || pathname === "/demo";
  if (isPublic) return null;

  return (
    <motion.aside
      initial={reduce ? undefined : { x: -60, opacity: 0 }}
      animate={reduce ? undefined : { x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-0 start-0 z-40 hidden lg:flex flex-col h-screen w-64 border-e border-border bg-card"
    >
      <div className="flex items-center gap-2 px-6 h-14 border-b border-border shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" />
        <Link href="/" className="text-lg font-bold tracking-tight hover:text-primary transition-colors">
          EduVerse
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Sidebar navigation">
        {sidebarItems.map((item) => {
          const active = isActive(localized(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={localized(item.href)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t(item.labelKey)}</span>
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="ms-auto w-1.5 h-1.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-3">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={`${tTheme("label")}: ${theme === "light" ? tTheme("dark") : tTheme("light")}`}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
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
          <span>{theme === "light" ? tTheme("dark") : tTheme("light")}</span>
        </button>

        {session ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {(session.user?.name ?? session.user?.email ?? "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-foreground">
                  {session.user?.name ?? session.user?.email}
                </p>
                {totalXp > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Lv {level} · {totalXp.toLocaleString()} XP
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("signOut")}</span>
            </button>
          </div>
        ) : (
          <Link
            href={localized("/login")}
            className="flex items-center justify-center w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {t("signIn")}
          </Link>
        )}
      </div>
    </motion.aside>
  );
}
