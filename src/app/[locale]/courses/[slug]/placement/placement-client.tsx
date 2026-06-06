"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export function PlacementClient({
  courseSlug,
  locale,
  questions,
}: {
  courseSlug: string;
  locale: string;
  questions: Question[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  async function handleSubmit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/courses/" + courseSlug + "/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error("Failed to submit placement");

      router.push(`/${locale}/courses/${courseSlug}`);
      router.refresh();
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-[var(--radius)] border border-border bg-card p-6">
          <p className="font-medium text-card-foreground mb-3">
            {idx + 1}. {q.text}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, optIdx) => (
              <label
                key={optIdx}
                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  answers[q.id] === optIdx
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={optIdx}
                  checked={answers[q.id] === optIdx}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
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
          {submitting ? "Submitting..." : `Submit (${Object.keys(answers).length}/${questions.length})`}
        </button>
      </div>
    </div>
  );
}
