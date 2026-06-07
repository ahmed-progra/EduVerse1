"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { MonacoEditor } from "@/components/monaco-editor";
import { QuizPanel } from "@/components/quiz-panel";
import { AiTutor } from "@/components/ai-tutor";
import { TerminalOutput, type OutputState } from "@/components/ui/terminal-output";
import { HtmlPreview } from "@/components/ui/html-preview";
import { CodeVisualizer, traceCode } from "@/components/code-visualizer";
import type { ExecutionStep } from "@/lib/code-visualizer/types";

type Lesson = {
  id: string;
  title: string;
  theory: string;
  exerciseType: string;
  exercisePrompt: string | null;
  starterCode: string | null;
  language: string | null;
  level: string | null;
  quiz: string | null;
  learningObjectives: string | null;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

type NavLesson = { slug: string; title: string } | null;

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// The container only orchestrates the stagger; its children handle their own
// opacity. Setting `hidden: { opacity: 0 }` here without restoring it in `show`
// (which carries no opacity target) left the whole subtree stuck at opacity 0,
// rendering the lesson body blank. Keep `hidden` empty — matches the shared
// `stagger` variant in lib/motion-variants.ts and the dashboard container.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const sectionItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function LessonContent({
  lesson,
  prevLesson,
  nextLesson,
  courseSlug,
}: {
  lesson: Lesson;
  prevLesson?: NavLesson;
  nextLesson?: NavLesson;
  courseSlug?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState(lesson.starterCode ?? "");
  const [output, setOutput] = useState("");
  const [outputState, setOutputState] = useState<OutputState>("idle");
  const [stderr, setStderr] = useState("");
  const [tutorOpen, setTutorOpen] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [vizSteps, setVizSteps] = useState<ExecutionStep[] | null>(null);

  const canVisualize = lesson.language === "python" || lesson.language === "javascript" || lesson.language === "js";

  function handleVisualize() {
    try {
      const trace = traceCode(code, lesson.language ?? "python");
      setVizSteps(trace.steps);
    } catch {
      setVizSteps([]);
    }
  }

  const quizQuestions: QuizQuestion[] = useMemo(
    () => (lesson.quiz ? JSON.parse(lesson.quiz) : []),
    [lesson.quiz]
  );

  const objectives: string[] = useMemo(
    () => (lesson.learningObjectives ? JSON.parse(lesson.learningObjectives) : []),
    [lesson.learningObjectives]
  );

  const isHtml = lesson.language === "html";

  async function handleRun() {
    setOutputState("running");
    setOutput("");
    setStderr("");

    try {
      const res = await fetch("/api/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lesson.language ?? "python",
          code,
        }),
      });
      const data = await res.json();
      if (data.stderr) {
        setStderr(data.stderr);
        setOutput(data.stdout || "");
        setOutputState("error");
      } else {
        setOutput(data.output || data.stdout || "No output");
        setOutputState("success");
      }
    } catch {
      setStderr("Error running code. Check your connection.");
      setOutputState("error");
    }
  }

  function handleQuizComplete(passed: boolean) {
    if (passed) {
      setQuizDone(true);
      window.dispatchEvent(new CustomEvent("eduverse:xp-updated"));
    }
  }

  async function handleMarkComplete() {
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setXpEarned(data.xpEarned ?? 50);
        if (data.newAchievements) {
          for (const ach of data.newAchievements) {
            window.dispatchEvent(new CustomEvent("eduverse:achievement-unlocked", { detail: ach }));
          }
        }
      } else {
        setXpEarned(50);
      }
    } catch {
      setXpEarned(50);
    }
    setQuizDone(true);
    window.dispatchEvent(new CustomEvent("eduverse:xp-updated"));
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't hijack arrow keys while the user is typing in a field or moving
      // the cursor in the code editor — that would navigate away and lose work.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.closest(".monaco-editor"))
      ) {
        return;
      }
      if (e.key === "ArrowLeft" && prevLesson && courseSlug) {
        router.push(`/courses/${courseSlug}/lessons/${prevLesson.slug}`);
      }
      if (e.key === "ArrowRight" && nextLesson && courseSlug) {
        router.push(`/courses/${courseSlug}/lessons/${nextLesson.slug}`);
      }
    },
    [prevLesson, nextLesson, courseSlug, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "theory", label: "Theory" },
    { id: "exercise", label: "Exercise" },
    { id: "quiz", label: "Quiz" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-12"
    >
      {/* Breadcrumb + Lesson Meta */}
      <motion.div variants={sectionItem} className="mb-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
          <Link href={`/courses/${courseSlug}`} className="hover:text-foreground transition-colors">
            Course
          </Link>
          <span>/</span>
          <span className="text-foreground">{lesson.title}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground">{lesson.title}</h1>
          {lesson.level && (
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                levelColors[lesson.level] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {lesson.level}
            </span>
          )}
        </div>
      </motion.div>

      {/* Progress indicator */}
      <motion.div variants={sectionItem} className="flex gap-1 mb-6">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSection(s.id);
              document
                .getElementById(`lesson-${s.id}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            aria-current={activeSection === s.id ? "true" : undefined}
            className={`text-xs px-3 py-1 rounded-full transition-colors active:scale-[0.97] ${
              activeSection === s.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s.label}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Content */}
        <div className="space-y-8">
          {/* Overview Section */}
          <motion.div variants={sectionItem} id="lesson-overview" className="scroll-mt-20">
            <div className="rounded-[var(--radius)] border border-border bg-card/50 p-5 space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span>📋</span> Overview
              </h2>

              {objectives.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Learning Objectives
                  </p>
                  <ul className="space-y-1.5">
                    {objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-primary mt-0.5">●</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>⏱ ~15 minutes</span>
                <span>💻 {lesson.exerciseType === "code" ? "Coding exercise" : "Reading"}</span>
              </div>
            </div>
          </motion.div>

          {/* Theory Section */}
          <motion.div variants={sectionItem} id="lesson-theory" className="scroll-mt-24">
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>📖</span> Theory
            </h2>
            <div className="prose prose-sm max-w-[70ch] text-foreground [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-[var(--radius)] [&_pre]:overflow-x-auto [&_code]:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {lesson.theory}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* Exercise Section */}
          {lesson.exercisePrompt && (
            <motion.div variants={sectionItem} id="lesson-exercise" className="scroll-mt-24">
              <div className="rounded-[var(--radius)] border border-border bg-card p-5">
                <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                  <span>✍️</span> Exercise
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{lesson.exercisePrompt}</p>
              </div>
            </motion.div>
          )}

          {/* Quiz Section */}
          <motion.div variants={sectionItem} id="lesson-quiz" className="scroll-mt-24">
            {quizQuestions.length > 0 && !quizDone && (
              <QuizPanel
                lessonId={lesson.id}
                questions={quizQuestions.map((q) => ({ question: q.question, options: q.options }))}
                correctAnswers={quizQuestions.map((q) => q.correctIndex)}
                onComplete={handleQuizComplete}
              />
            )}

            {quizQuestions.length === 0 && !quizDone && (
              <div className="rounded-[var(--radius)] border border-border bg-card p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">Finished this lesson?</p>
                <Button onClick={handleMarkComplete}>Mark as Complete</Button>
              </div>
            )}

            <AnimatePresence>
              {quizDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[var(--radius)] border border-green-500/50 bg-green-50 dark:bg-green-950/20 p-6 text-center space-y-2"
                >
                  <p className="text-2xl">🎉</p>
                  <p className="font-semibold text-card-foreground text-lg">Lesson Complete!</p>
                  <p className="text-sm text-muted-foreground">You earned {xpEarned} XP. Keep up the great work!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Summary Section */}
          <motion.div variants={sectionItem}>
            <div className="rounded-[var(--radius)] border border-border bg-card/50 p-5 space-y-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span>📝</span> Summary
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {objectives.slice(0, 3).map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={sectionItem}>
            <div className="flex gap-3">
              {prevLesson && courseSlug ? (
                <Link
                  href={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}
                  className="flex-1 rounded-[var(--radius)] border border-border bg-card p-3 hover:border-primary/50 hover:bg-card/80 transition-colors text-left group"
                >
                  <p className="text-xs text-muted-foreground mb-1">← Previous</p>
                  <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                    {prevLesson.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {nextLesson && courseSlug ? (
                <Link
                  href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}
                  className="flex-1 rounded-[var(--radius)] border border-border bg-card p-3 hover:border-primary/50 hover:bg-card/80 transition-colors text-right group"
                >
                  <p className="text-xs text-muted-foreground mb-1">Next →</p>
                  <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                    {nextLesson.title}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Use ← and → arrow keys to navigate
            </p>
          </motion.div>
        </div>

        {/* Right Column: Code Editor + Output */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {lesson.exerciseType === "code" && (
            <>
              <motion.div variants={sectionItem} className="rounded-[var(--radius)] border border-border overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span>{lesson.language ?? "code"}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCode(lesson.starterCode ?? "")}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                <MonacoEditor
                  value={code}
                  onChange={setCode}
                  language={lesson.language ?? undefined}
                />
              </motion.div>

              <motion.div variants={sectionItem} className="flex gap-3">
                <Button
                  onClick={handleRun}
                  disabled={outputState === "running"}
                  className="flex-1"
                >
                  {outputState === "running" ? "Running..." : "▶ Run Code"}
                </Button>
                {canVisualize && (
                  <Button
                    variant="outline"
                    onClick={handleVisualize}
                    className="flex-1"
                    title="Step through this code line by line"
                  >
                    ◧ Visualize
                  </Button>
                )}
              </motion.div>

              <AnimatePresence>
                {vizSteps !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {vizSteps.length > 0 ? (
                      <CodeVisualizer
                        steps={vizSteps}
                        code={code}
                        language={lesson.language ?? "python"}
                        onClose={() => setVizSteps(null)}
                      />
                    ) : (
                      <div className="rounded-[var(--radius)] border border-border bg-card/50 p-4 text-sm text-muted-foreground flex items-start justify-between gap-3">
                        <span>
                          <span className="text-primary mr-1.5">&gt;</span>
                          Couldn&apos;t trace this code. The visualizer supports core Python — variables, arithmetic, loops, conditionals, and functions.
                        </span>
                        <button onClick={() => setVizSteps(null)} className="text-muted-foreground hover:text-foreground" aria-label="Dismiss">✕</button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {isHtml && (
                <motion.div variants={sectionItem}>
                  <HtmlPreview code={code} language="html" />
                </motion.div>
              )}

              <motion.div variants={sectionItem}>
                <TerminalOutput
                  output={output}
                  state={outputState}
                  stderr={stderr}
                  onClear={() => {
                    setOutput("");
                    setStderr("");
                    setOutputState("idle");
                  }}
                />
              </motion.div>
            </>
          )}

          {lesson.exerciseType === "reading" && (
            <motion.div
              variants={sectionItem}
              className="rounded-[var(--radius)] border border-border bg-card p-8 text-center"
            >
              <p className="text-3xl mb-3">📖</p>
              <p className="text-muted-foreground">
                {quizQuestions.length > 0
                  ? "Reading complete. Take the quiz below."
                  : "Reading complete. Mark it done below to continue."}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <AiTutor
        lessonId={lesson.id}
        isOpen={tutorOpen}
        onToggle={() => setTutorOpen((v) => !v)}
      />
    </motion.div>
  );
}
