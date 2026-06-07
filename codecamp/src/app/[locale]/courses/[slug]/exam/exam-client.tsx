"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

export function ExamClient({
  courseSlug,
  locale,
  questions,
}: {
  courseSlug: string;
  locale: string;
  questions: Question[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    new Array(questions.length).fill(null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; score: number; total: number } | null>(null);

  const allAnswered = answers.every((a) => a !== null);

  function setAnswer(index: number, value: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/courses/" + courseSlug + "/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error("Failed to submit exam");

      const data = await res.json();
      setResult(data);
    } catch {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-[var(--radius)] border border-border bg-card p-8 text-center">
        <h2 className="text-2xl font-display text-foreground mb-2">
          {result.passed ? "Congratulations!" : "Try Again"}
        </h2>
        <p className="text-muted-foreground mb-4">
          You scored {result.score} / {result.total}
        </p>
        <p className="text-muted-foreground mb-6">
          {result.passed ? "You passed the exam!" : "You didn't pass this time."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push(`/${locale}/courses/${courseSlug}`)}
            className="rounded-[var(--radius)] bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-colors"
          >
            Back to Course
          </button>
          {!result.passed && (
            <button
              onClick={() => { setResult(null); setAnswers(new Array(questions.length).fill(null)); }}
              className="rounded-[var(--radius)] border border-border bg-background text-foreground px-6 py-2 text-sm font-semibold hover:bg-muted active:scale-[0.97] transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-[var(--radius)] border border-border bg-card p-6">
          <p className="font-medium text-card-foreground mb-3">
            {idx + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, optIdx) => (
              <label
                key={optIdx}
                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  answers[idx] === optIdx
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${idx}`}
                  value={optIdx}
                  checked={answers[idx] === optIdx}
                  onChange={() => setAnswer(idx, optIdx)}
                  className="accent-primary"
                />
                <span className="text-sm text-card-foreground">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className="rounded-[var(--radius)] bg-primary text-primary-foreground px-8 py-3 text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : `Submit (${answers.filter((a) => a !== null).length}/${questions.length})`}
        </button>
      </div>
    </div>
  );
}
