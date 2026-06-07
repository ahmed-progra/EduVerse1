"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Home,
  BookOpen,
  LayoutDashboard,
  Trophy,
  Award,
  Settings as SettingsIcon,
  Sun,
  Moon,
  LogOut,
  LogIn,
  CornerDownLeft,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/**
 * CommandPalette — a ⌘K / Ctrl+K command palette in the EduVerse terminal style.
 *
 * Power-user navigation, course jumps, and quick actions from anywhere. Mounted
 * once globally (in Providers). Opens on ⌘K/Ctrl+K or a `eduverse:open-command-palette`
 * window event, so any trigger button can dispatch it later. Fully keyboard-driven,
 * respects reduced motion, and never hijacks the Monaco code editor's own ⌘K.
 */

type Group = "Navigate" | "Tracks" | "Actions";

type Command = {
  id: string;
  label: string;
  group: Group;
  icon: ReactNode;
  keywords?: string;
  perform: () => void;
};

const GROUPS: Group[] = ["Navigate", "Tracks", "Actions"];

function Tag({ children }: { children: string }) {
  return (
    <span className="font-display text-[11px] font-bold leading-none">{children}</span>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const reduce = useReducedMotion();

  const go = useCallback(
    (path: string) => router.push(path === "/" ? `/${locale}` : `/${locale}${path}`),
    [router, locale],
  );

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      { id: "home", label: "Home", group: "Navigate", icon: <Home className="h-4 w-4" />, keywords: "landing start", perform: () => go("/") },
      { id: "courses", label: "Browse Courses", group: "Navigate", icon: <BookOpen className="h-4 w-4" />, keywords: "catalog learn tracks", perform: () => go("/courses") },
    ];
    if (session) {
      nav.push(
        { id: "dashboard", label: "Dashboard", group: "Navigate", icon: <LayoutDashboard className="h-4 w-4" />, keywords: "home stats xp progress", perform: () => go("/dashboard") },
        { id: "leaderboard", label: "Leaderboard", group: "Navigate", icon: <Trophy className="h-4 w-4" />, keywords: "rank ranking compete", perform: () => go("/leaderboard") },
        { id: "achievements", label: "Achievements", group: "Navigate", icon: <Award className="h-4 w-4" />, keywords: "badges trophies", perform: () => go("/achievements") },
        { id: "settings", label: "Settings", group: "Navigate", icon: <SettingsIcon className="h-4 w-4" />, keywords: "profile account preferences", perform: () => go("/settings") },
      );
    }

    const tracks: Command[] = [
      { id: "t-py", label: "Python", group: "Tracks", icon: <Tag>Py</Tag>, keywords: "course language backend data", perform: () => go("/courses/python-basics") },
      { id: "t-js", label: "JavaScript", group: "Tracks", icon: <Tag>JS</Tag>, keywords: "course language web interactive", perform: () => go("/courses/javascript-fundamentals") },
      { id: "t-web", label: "HTML & CSS", group: "Tracks", icon: <Tag>{"</>"}</Tag>, keywords: "course web frontend markup style", perform: () => go("/courses/html-css") },
      { id: "t-cpp", label: "C++", group: "Tracks", icon: <Tag>C++</Tag>, keywords: "course language systems performance", perform: () => go("/courses/cpp-basics") },
    ];

    const actions: Command[] = [
      {
        id: "theme",
        label: `Switch to ${theme === "light" ? "dark" : "light"} mode`,
        group: "Actions",
        icon: theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />,
        keywords: "theme toggle appearance dark light",
        perform: () => setTheme(theme === "light" ? "dark" : "light"),
      },
    ];
    if (session) {
      actions.push({ id: "signout", label: "Sign out", group: "Actions", icon: <LogOut className="h-4 w-4" />, keywords: "logout exit", perform: () => signOut() });
    } else {
      actions.push({ id: "signin", label: "Sign in", group: "Actions", icon: <LogIn className="h-4 w-4" />, keywords: "login account", perform: () => go("/login") });
    }

    return [...nav, ...tracks, ...actions];
  }, [session, theme, setTheme, go]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Reset highlight whenever the result set changes.
  useEffect(() => setActive(0), [query, open]);

  // Focus the input, lock background scroll, and restore focus on close.
  useEffect(() => {
    if (!open) return;
    lastFocused.current = (document.activeElement as HTMLElement) ?? null;
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Global hotkey + programmatic open event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        const el = document.activeElement as HTMLElement | null;
        if (el?.closest?.(".monaco-editor")) return; // leave the code editor's ⌘K alone
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("eduverse:open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("eduverse:open-command-palette", onOpen);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    lastFocused.current?.focus?.();
  }, []);

  const run = useCallback(
    (c?: Command) => {
      if (!c) return;
      close();
      c.perform();
    },
    [close],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        run(filtered[active]);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        // keep focus trapped on the input
        e.preventDefault();
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(filtered.length - 1);
        break;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onKeyDown={onKeyDown}
            className="relative w-full max-w-xl overflow-hidden border border-border bg-popover/95 backdrop-blur-xl shadow-[var(--glow)]"
          >
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-border px-4">
              <span className="select-none text-primary" aria-hidden="true">&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="hidden shrink-0 border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[min(60vh,380px)] overflow-y-auto py-2" role="listbox" aria-label="Commands">
              {filtered.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  <span className="mr-1 text-primary">&gt;</span> No matches for &ldquo;{query}&rdquo;
                </p>
              ) : (
                GROUPS.map((g) => {
                  const items = filtered.filter((c) => c.group === g);
                  if (items.length === 0) return null;
                  return (
                    <div key={g} className="px-2 pb-1">
                      <p className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{g}</p>
                      {items.map((c) => {
                        const idx = filtered.indexOf(c);
                        const selected = idx === active;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onMouseMove={() => setActive(idx)}
                            onClick={() => run(c)}
                            className={cn(
                              "flex w-full items-center gap-3 px-2 py-2 text-left text-sm transition-colors",
                              selected ? "bg-primary/10 text-primary" : "text-card-foreground hover:bg-accent/40",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-flex min-w-6 shrink-0 justify-center",
                                selected ? "text-primary" : "text-muted-foreground",
                              )}
                            >
                              {c.icon}
                            </span>
                            <span className="flex-1 truncate">{c.label}</span>
                            {selected && (
                              <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
              <span>
                <span className="font-display font-bold text-primary">EduVerse</span> command palette
              </span>
              <span className="hidden items-center gap-3 sm:flex">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
