"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ExamQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  lessonTitle: string;
};

type ExamClientProps = {
  courseId: string;
  courseSlug: string;
  questions: ExamQuestion[];
};

export function ExamClient({ courseId, courseSlug, questions }: ExamClientProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [result, setResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    percentage: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSelect(qIndex: number, optionIndex: number) {
    if (result) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }

  async function handleSubmit() {
    if (answers.some((a) => a === -1)) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/courses/${courseId}/exam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, answers }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      const correctCount = answers.filter(
        (a, i) => a === questions[i].correctIndex
      ).length;
      const total = questions.length;
      setResult({
        score: correctCount,
        total,
        passed: correctCount >= Math.ceil(total * 0.7),
        percentage: Math.round((correctCount / total) * 100),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const allAnswered = answers.every((a) => a !== -1);

  return (
    <div className="space-y-6 pb-12">
      {questions.map((q, qi) => (
        <div key={qi} className="rounded-[var(--radius)] border border-border bg-card p-5 space-y-3">
          <p className="text-xs text-muted-foreground">{q.lessonTitle}</p>
          <p className="text-sm font-medium text-card-foreground">
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const showCorrect = result && oi === q.correctIndex;
              const isWrong = result && isSelected && oi !== q.correctIndex;

              return (
                <button
                  key={oi}
                  onClick={() => handleSelect(qi, oi)}
                  disabled={!!result}
                  aria-pressed={isSelected}
                  aria-label={`Option ${String.fromCharCode(65 + oi)}: ${opt}`}
                  className={`w-full text-left rounded-[var(--radius)] px-3 py-2 text-sm transition-colors active:scale-[0.99] flex items-center gap-2 ${
                    showCorrect && result
                      ? "bg-green-100 dark:bg-green-900/30 border border-green-500"
                      : isWrong
                      ? "bg-red-100 dark:bg-red-900/30 border border-red-500"
                      : isSelected
                      ? "bg-primary/10 border border-primary"
                      : "border border-border hover:border-primary/50 bg-background"
                  }`}
                >
                  <span className="text-muted-foreground">
                    {String.fromCharCode(65 + oi)}.
                  </span>
                  <span className="flex-1">{opt}</span>
                  {result && showCorrect && (
                    <span className="text-green-600 dark:text-green-400 font-semibold" aria-label="Correct answer">✓</span>
                  )}
                  {isWrong && (
                    <span className="text-red-600 dark:text-red-400 font-semibold" aria-label="Your incorrect answer">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting}
          className="w-full active:scale-[0.97]"
        >
          {isSubmitting ? "Submitting..." : "Submit Exam"}
        </Button>
      )}

      {result && (
        <div className="space-y-4">
          <div
            className={`rounded-[var(--radius)] p-6 text-center ${
              result.passed
                ? "bg-green-100 dark:bg-green-900/20 border border-green-500"
                : "bg-red-100 dark:bg-red-900/20 border border-red-500"
            }`}
          >
            <p className="text-xl font-bold text-card-foreground">
              {result.passed ? "🎉 Congratulations!" : "📖 Keep Learning"}
            </p>
            <p className="text-3xl font-bold text-card-foreground my-2">
              {result.percentage}%
            </p>
            <p className="text-sm text-muted-foreground">
              {result.score}/{result.total} correct
            </p>
          </div>

          {result.passed && (
            <div className="flex gap-3">
              <Button
                onClick={() => window.open(`/api/certificate?courseId=${courseId}`, "_blank")}
                className="flex-1 active:scale-[0.97]"
              >
                Download Certificate
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/courses/${courseSlug}`)}
                className="active:scale-[0.97]"
              >
                Back to Course
              </Button>
            </div>
          )}

          {!result.passed && (
            <Button
              variant="outline"
              onClick={() => {
                setAnswers(new Array(questions.length).fill(-1));
                setResult(null);
              }}
              className="w-full active:scale-[0.97]"
            >
              Retry Exam
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
