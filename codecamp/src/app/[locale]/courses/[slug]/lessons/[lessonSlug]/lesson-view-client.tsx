"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

type Lesson = {
  id: string;
  title: string;
  markdown: string;
  exerciseType: string;
  starterCode: string;
  solution: string;
  questions: Question[];
};

export function LessonViewClient({
  locale,
  courseSlug,
  lesson,
  initialProgress,
}: {
  locale: string;
  courseSlug: string;
  lesson: Lesson;
  initialProgress: { completed: boolean } | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"content" | "code" | "quiz">("content");
  const [code, setCode] = useState(lesson.starterCode);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [tutorMessage, setTutorMessage] = useState("");
  const [tutorLoading, setTutorLoading] = useState(false);

  const completed = initialProgress?.completed ?? false;

  async function handleRunCode() {
    setRunning(true);
    setOutput("");
    try {
      const res = await fetch("/api/code/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python",
          code,
        }),
      });
      const data = await res.json();
      setOutput(data.output ?? data.error ?? "No output");
    } catch {
      setOutput("Error running code");
    } finally {
      setRunning(false);
    }
  }

  async function handleQuizSubmit() {
    const allAnswered = lesson.questions.every((q) => quizAnswers[q.id] !== undefined);
    if (!allAnswered) return;

    let correct = 0;
    lesson.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) correct++;
    });
    setQuizScore(correct);
    setQuizSubmitted(true);

    try {
      await fetch("/api/lessons/" + lesson.id + "/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      router.refresh();
    } catch {
      // silently fail
    }
  }

  async function handleAskTutor() {
    setTutorLoading(true);
    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: lesson.title,
          lessonMarkdown: lesson.markdown,
          code,
          exerciseGoal: lesson.solution,
        }),
      });
      const data = await res.json();
      setTutorMessage(data.message ?? "I'm here to help!");
    } catch {
      setTutorMessage("Sorry, I couldn't reach the tutor.");
    } finally {
      setTutorLoading(false);
    }
  }

  return (
    <div>
      <Link
        href={`/${locale}/courses/${courseSlug}`}
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        ← Back to Course
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-display text-foreground">{lesson.title}</h1>
        {completed && (
          <span className="inline-block mt-2 text-xs rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 px-3 py-1 font-medium">
            Completed
          </span>
        )}
      </div>

      <div className="flex gap-1 mb-6 border-b border-border">
        {(["content", "code", "quiz"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "content" ? "Lesson" : t === "code" ? "Code Editor" : "Quiz"}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: lesson.markdown }} />
        </div>
      )}

      {tab === "code" && (
        <div className="space-y-4">
          <div className="rounded-[var(--radius)] border border-border overflow-hidden">
            <div className="flex items-center justify-between bg-muted px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground">main.py</span>
              <button
                onClick={handleRunCode}
                disabled={running}
                className="text-xs rounded-md bg-primary text-primary-foreground px-3 py-1 hover:bg-primary/90 active:scale-[0.97] transition-colors disabled:opacity-50"
              >
                {running ? "Running..." : "Run"}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-card text-card-foreground font-mono text-sm p-4 resize-none focus:outline-none"
              rows={16}
              spellCheck={false}
            />
          </div>

          {output && (
            <div className="rounded-[var(--radius)] border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">Output</p>
              <pre className="text-sm text-card-foreground font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          )}

          <div className="rounded-[var(--radius)] border border-border bg-card p-4">
            <p className="text-sm text-card-foreground mb-3">
              Stuck? Ask the AI tutor for help.
            </p>
            <button
              onClick={handleAskTutor}
              disabled={tutorLoading}
              className="rounded-[var(--radius)] border border-border bg-background text-foreground px-4 py-2 text-sm font-medium hover:bg-muted active:scale-[0.97] transition-colors disabled:opacity-50"
            >
              {tutorLoading ? "Thinking..." : "Ask Tutor"}
            </button>
            {tutorMessage && (
              <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
                <p className="text-sm text-card-foreground whitespace-pre-wrap">{tutorMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "quiz" && (
        <div className="space-y-6">
          {lesson.questions.map((q, idx) => (
            <div key={q.id} className="rounded-[var(--radius)] border border-border bg-card p-6">
              <p className="font-medium text-card-foreground mb-3">{idx + 1}. {q.text}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const showCorrect = quizSubmitted && optIdx === q.correctIndex;
                  const showWrong = quizSubmitted && quizAnswers[q.id] === optIdx && optIdx !== q.correctIndex;
                  return (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        showCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                          : showWrong
                          ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                          : quizAnswers[q.id] === optIdx
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={optIdx}
                        checked={quizAnswers[q.id] === optIdx}
                        onChange={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                        disabled={quizSubmitted}
                        className="accent-primary"
                      />
                      <span className="text-sm text-card-foreground">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {!quizSubmitted && (
            <div className="text-center">
              <button
                onClick={handleQuizSubmit}
                disabled={!lesson.questions.every((q) => quizAnswers[q.id] !== undefined)}
                className="rounded-[var(--radius)] bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            </div>
          )}

          {quizSubmitted && (
            <div className="text-center">
              <p className="text-lg font-medium text-card-foreground mb-2">
                {quizScore} / {lesson.questions.length} correct
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {quizScore === lesson.questions.length
                  ? "Perfect! Lesson complete."
                  : "Review the material and try again."}
              </p>
              {quizScore < lesson.questions.length && (
                <button
                  onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                  className="rounded-[var(--radius)] border border-border bg-background text-foreground px-6 py-2 text-sm font-medium hover:bg-muted active:scale-[0.97] transition-colors"
                >
                  Retry Quiz
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
