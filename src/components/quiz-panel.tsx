"use client";

import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

type QuizQuestion = {
  question: string;
  options: string[];
};

type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  feedback: {
    perQuestion: { questionIndex: number; note: string }[];
    summary: string;
    reviewTopics: string[];
  } | null;
};

type QuizPanelProps = {
  lessonId: string;
  questions: QuizQuestion[];
  correctAnswers: number[];
  onComplete: (passed: boolean) => void;
};

export const QuizPanel = memo(function QuizPanel({ lessonId, questions, correctAnswers, onComplete }: QuizPanelProps) {
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [result, setResult] = useState<QuizResult | null>(null);
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
      const res = await fetch(`/api/lessons/${lessonId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, answers }),
      });

      const data = await res.json();
      setResult(data);
      onComplete(data.passed);
    } catch {
      // fallback: grade locally
      const correctCount = answers.filter(
        (a, i) => a === correctAnswers[i]
      ).length;
      const passed = correctCount >= Math.ceil(questions.length / 2);
      setResult({ score: correctCount, total: questions.length, passed, feedback: null });
      onComplete(passed);
    } finally {
      setIsSubmitting(false);
    }
  }

  const allAnswered = answers.every((a) => a !== -1);

  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-6 space-y-6">
      <h2 className="text-lg font-semibold text-card-foreground">Lesson Quiz</h2>

      {questions.map((q, qi) => (
        <div key={qi} className="space-y-2">
          <p className="text-sm font-medium text-card-foreground">
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const isWrongSelection = result && isSelected && oi !== correctAnswers[qi];
              const showCorrect = result && oi === correctAnswers[qi];

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
                      : isWrongSelection
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
                  {isWrongSelection && (
                    <span className="text-red-600 dark:text-red-400 font-semibold" aria-label="Your incorrect answer">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {result?.feedback && (
            <AnimatePresence>
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-muted-foreground italic"
              >
                {result.feedback.perQuestion.find((f) => f.questionIndex === qi)?.note}
              </motion.p>
            </AnimatePresence>
          )}
        </div>
      ))}

      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      )}

      {result && (
        <div className="space-y-4">
          <div
            className={`rounded-[var(--radius)] p-4 ${
              result.passed
                ? "bg-green-100 dark:bg-green-900/20 border border-green-500"
                : "bg-red-100 dark:bg-red-900/20 border border-red-500"
            }`}
          >
            <p className="font-medium text-card-foreground">
              {result.passed ? "✅ Passed!" : "❌ Not Quite"}
            </p>
            <p className="text-sm text-muted-foreground">
              Score: {result.score}/{result.total}
            </p>
          </div>

          {result.feedback?.summary && (
            <div className="text-sm text-foreground">{result.feedback.summary}</div>
          )}

          {result.feedback?.reviewTopics && result.feedback.reviewTopics.length > 0 && (
            <div>
              <p className="text-sm font-medium text-card-foreground mb-1">Review these topics:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {result.feedback.reviewTopics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          {!result.passed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAnswers(new Array(questions.length).fill(-1));
                setResult(null);
              }}
              className="w-full active:scale-[0.97]"
            >
              Retry Quiz
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
