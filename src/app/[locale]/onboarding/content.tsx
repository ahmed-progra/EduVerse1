"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

const STEPS = ["Welcome", "Goal", "Language", "Level", "Path"];

const GOALS = [
  { id: "career", label: "Career Change", desc: "Switch to a tech career", icon: "💼" },
  { id: "academic", label: "Academic", desc: "Support my studies", icon: "📚" },
  { id: "hobby", label: "Personal Project", desc: "Build something I care about", icon: "🎨" },
  { id: "upskill", label: "Upskill", desc: "Level up my current role", icon: "📈" },
];

const LANGUAGES = [
  { id: "html-css", label: "HTML & CSS", desc: "Web foundations — start here", icon: "🌐", slug: "html-css" },
  { id: "javascript", label: "JavaScript", desc: "Interactive web apps", icon: "🟨", slug: "javascript-fundamentals" },
  { id: "python", label: "Python", desc: "General purpose & data", icon: "🐍", slug: "python-basics" },
  { id: "cpp", label: "C++", desc: "Systems programming", icon: "⚡", slug: "cpp-basics" },
];

const LEVELS = [
  { id: "beginner", label: "Beginner", desc: "No prior experience", icon: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "Some coding experience", icon: "🌿" },
  { id: "advanced", label: "Advanced", desc: "Comfortable with code", icon: "🌳" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(session?.user?.name ?? "");
  const [goal, setGoal] = useState("");
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const languageSlug = LANGUAGES.find((l) => l.id === language)?.slug;

  async function handleComplete() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          learningGoal: goal,
          preferredLanguage: language,
          skillLevel: level,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.message || "Failed to save preferences");
      }

      if (languageSlug) {
        router.push(`/${locale}/courses/${languageSlug}/placement`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function handleSkip() {
    router.push(`/${locale}/dashboard`);
  }

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, scale: 0.96 }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-14 px-4">
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <motion.div
                animate={i <= step ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  animate={{ backgroundColor: i < step ? "var(--primary)" : "var(--muted)" }}
                  className="w-8 h-0.5"
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={step}>
          {step === 0 && (
            <motion.div
              key="welcome"
              custom={0}
              variants={slideVariants}
              initial={reduce ? undefined : "enter"}
              animate={reduce ? undefined : "center"}
              exit={reduce ? undefined : "exit"}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-display font-bold text-foreground">
                  Welcome to EduVerse
                </h1>
                <p className="text-muted-foreground">
                  Let&apos;s set up your personalized learning experience.
                </p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  What should we call you?
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-[var(--radius)] border border-border bg-background/80 px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} className="flex-1">
                  Continue
                </Button>
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="goal"
              custom={1}
              variants={slideVariants}
              initial={reduce ? undefined : "enter"}
              animate={reduce ? undefined : "center"}
              exit={reduce ? undefined : "exit"}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  What brings you here?
                </h2>
                <p className="text-muted-foreground">Choose your learning goal.</p>
              </div>

              <div className="grid gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`w-full text-left rounded-[var(--radius)] border p-4 transition-colors active:scale-[0.99] ${
                      goal === g.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{g.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{g.label}</p>
                        <p className="text-sm text-muted-foreground">{g.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button onClick={() => setStep(2)} className="flex-1" disabled={!goal}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="language"
              custom={2}
              variants={slideVariants}
              initial={reduce ? undefined : "enter"}
              animate={reduce ? undefined : "center"}
              exit={reduce ? undefined : "exit"}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Pick your first language
                </h2>
                <p className="text-muted-foreground">You can learn them all — start where you&apos;re most excited.</p>
              </div>

              <div className="grid gap-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`w-full text-left rounded-[var(--radius)] border p-4 transition-colors active:scale-[0.99] ${
                      language === l.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{l.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{l.label}</p>
                        <p className="text-sm text-muted-foreground">{l.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" disabled={!language}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="level"
              custom={3}
              variants={slideVariants}
              initial={reduce ? undefined : "enter"}
              animate={reduce ? undefined : "center"}
              exit={reduce ? undefined : "exit"}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  How experienced are you?
                </h2>
                <p className="text-muted-foreground">We&apos;ll tailor the lessons to your level.</p>
              </div>

              <div className="grid gap-3">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`w-full text-left rounded-[var(--radius)] border p-4 transition-colors active:scale-[0.99] ${
                      level === l.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{l.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{l.label}</p>
                        <p className="text-sm text-muted-foreground">{l.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1" disabled={!level}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="path"
              custom={4}
              variants={slideVariants}
              initial={reduce ? undefined : "enter"}
              animate={reduce ? undefined : "center"}
              exit={reduce ? undefined : "exit"}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Your Learning Path
                </h2>
                <p className="text-muted-foreground">
                  Here&apos;s your personalized curriculum.
                </p>
              </div>

              <div className="space-y-3">
                {LANGUAGES.map((l, i) => {
                  const isPrimary = l.id === language;
                  return (
                    <motion.div
                      key={l.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, type: "spring", stiffness: 200, damping: 22 }}
                      className={`rounded-[var(--radius)] border p-4 transition-colors ${
                        isPrimary
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={isPrimary ? { scale: [1, 1.1, 1] } : undefined}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isPrimary ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </motion.div>
                        <span className="text-2xl">{l.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{l.label}</p>
                          <p className="text-xs text-muted-foreground">{level} level</p>
                        </div>
                        {i === 0 && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                            Start here
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Setting up..." : "Go to Dashboard →"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
