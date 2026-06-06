"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { sectionContainer, sectionItem } from "@/lib/motion-variants";

const GOALS = [
  { id: "career", label: "Career Change" },
  { id: "academic", label: "Academic" },
  { id: "hobby", label: "Personal Project" },
  { id: "upskill", label: "Upskill" },
];

const LANGUAGES = [
  { id: "html-css", label: "HTML & CSS" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

const LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

type Profile = {
  name: string;
  email: string;
  learningGoal: string;
  preferredLanguage: string;
  skillLevel: string;
};

const fieldClass =
  "w-full rounded-[var(--radius)] border border-border bg-background/60 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[var(--glow)] transition-[box-shadow,border-color] duration-150";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const reduce = useReducedMotion();

  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<Profile>({
    name: "",
    email: "",
    learningGoal: "",
    preferredLanguage: "",
    skillLevel: "",
  });
  const [initial, setInitial] = useState<Profile | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (status === "unauthenticated") router.replace(`/${locale}/login`);
  }, [status, router, locale]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        const next: Profile = {
          name: data.name ?? "",
          email: data.email ?? "",
          learningGoal: data.learningGoal ?? "",
          preferredLanguage: data.preferredLanguage ?? "",
          skillLevel: data.skillLevel ?? "",
        };
        setForm(next);
        setInitial(next);
        setLoaded(true);
      } catch {
        /* keep defaults; surfaced on save */
      }
    }
    if (status === "authenticated") load();
    return () => { active = false; };
  }, [status]);

  const dirty =
    initial !== null &&
    (form.name !== initial.name ||
      form.learningGoal !== initial.learningGoal ||
      form.preferredLanguage !== initial.preferredLanguage ||
      form.skillLevel !== initial.skillLevel);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (saveState !== "idle") setSaveState("idle");
  }

  async function handleSave() {
    setSaveState("saving");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || undefined,
          learningGoal: form.learningGoal || undefined,
          preferredLanguage: form.preferredLanguage || undefined,
          skillLevel: form.skillLevel || undefined,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      setInitial(form);
      setSaveState("saved");
      await update?.({ name: form.name.trim() });
    } catch {
      setSaveState("error");
    }
  }

  if (status === "loading" || (status === "authenticated" && !loaded)) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="h-8 w-40 rounded-[var(--radius)] skeleton-shimmer" />
          <div className="mt-8 space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 rounded-[var(--radius)] border border-border bg-card/40 skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <motion.div
        variants={reduce ? undefined : sectionContainer}
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "show"}
        className="container mx-auto px-4 pb-12 max-w-2xl"
      >
        <motion.div variants={reduce ? undefined : sectionItem}>
          <h1 className="text-2xl font-bold text-foreground mb-1.5">Settings</h1>
          <p className="text-sm text-muted-foreground mb-8">
            <span className="text-primary mr-1.5 select-none">&gt;</span>
            Manage your account and learning preferences.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.section variants={reduce ? undefined : sectionItem} className="chamfer border border-border bg-card/50 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
              Profile
            </h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-xs text-muted-foreground mb-1.5">
                  Display name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  maxLength={60}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Email</p>
                <p className="text-sm text-foreground/80 font-mono">{form.email || session?.user?.email}</p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={reduce ? undefined : sectionItem} className="chamfer border border-border bg-card/50 p-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Learning Preferences
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="goal" className="block text-xs text-muted-foreground mb-1.5">Goal</label>
                <select id="goal" value={form.learningGoal} onChange={(e) => set("learningGoal", e.target.value)} className={fieldClass}>
                  <option value="">—</option>
                  {GOALS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="lang" className="block text-xs text-muted-foreground mb-1.5">Language</label>
                <select id="lang" value={form.preferredLanguage} onChange={(e) => set("preferredLanguage", e.target.value)} className={fieldClass}>
                  <option value="">—</option>
                  {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="level" className="block text-xs text-muted-foreground mb-1.5">Level</label>
                <select id="level" value={form.skillLevel} onChange={(e) => set("skillLevel", e.target.value)} className={fieldClass}>
                  <option value="">—</option>
                  {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
            </div>
          </motion.section>

          <motion.div variants={reduce ? undefined : sectionItem} className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={!dirty || saveState === "saving"}>
              {saveState === "saving" ? "Saving…" : "Save Changes"}
            </Button>
            {saveState === "saved" && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-xs text-primary"
              >✓ Saved</motion.span>
            )}
            {saveState === "error" && (
              <span className="text-xs text-destructive" role="alert">Couldn&apos;t save — try again</span>
            )}
            {dirty && saveState === "idle" && (
              <span className="text-xs text-muted-foreground">Unsaved changes</span>
            )}
          </motion.div>

          <motion.section variants={reduce ? undefined : sectionItem} className="chamfer border border-border bg-card/50 p-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Appearance
            </h2>
            <div className="flex items-center gap-3">
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
                className="flex-1"
                aria-pressed={theme === "dark"}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                Dark
              </Button>
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
                className="flex-1"
                aria-pressed={theme === "light"}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                Light
              </Button>
            </div>
          </motion.section>

          <motion.section variants={reduce ? undefined : sectionItem} className="chamfer border border-border bg-card/50 p-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </h2>
            <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })} className="w-full">
              Sign Out
            </Button>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
