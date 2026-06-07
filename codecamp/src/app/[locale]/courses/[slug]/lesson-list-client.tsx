"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { staggerFast, sectionItem } from "@/lib/motion-variants";

type LessonItem = {
  id: string;
  slug: string;
  title: string;
  exerciseType: string;
  level: string;
  order: number;
};

type Props = {
  locale: string;
  courseSlug: string;
  lessons: LessonItem[];
  completedLessonIds: string[];
  inPathLessonIds: string[];
};

export function LessonListClient({ locale, courseSlug, lessons, completedLessonIds, inPathLessonIds }: Props) {
  const reduce = useReducedMotion();
  const completedSet = new Set(completedLessonIds);
  const inPathSet = new Set(inPathLessonIds);

  return (
    <motion.div
      variants={reduce ? undefined : staggerFast}
      initial={reduce ? undefined : "hidden"}
      animate={reduce ? undefined : "show"}
      className="space-y-3"
    >
      {lessons.length === 0 && (
        <p className="text-sm text-muted-foreground">No lessons available yet for your level path.</p>
      )}

      {lessons.map((lesson, idx) => {
        const completed = completedSet.has(lesson.id);
        const inPath = inPathSet.has(lesson.id);

        return (
          <motion.div key={lesson.id} variants={reduce ? undefined : sectionItem}>
            <Link
              href={inPath ? `/${locale}/courses/${courseSlug}/lessons/${lesson.slug}` : "#"}
              className={`block rounded-[var(--radius)] border p-4 flex items-center gap-4 transition-colors ${
                inPath
                  ? "border-border bg-card hover:border-primary"
                  : "border-border/50 bg-card/30 opacity-50 cursor-not-allowed"
              }`}
              onClick={(e) => { if (!inPath) e.preventDefault(); }}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  completed
                    ? "bg-green-100 dark:bg-green-900/20 text-green-600"
                    : inPath
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {completed ? "✓" : idx + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="capitalize">{lesson.exerciseType} exercise</span>
                  <span className="capitalize text-[10px] opacity-70">({lesson.level})</span>
                </p>
              </div>
              {completed && <span className="text-xs text-muted-foreground">Complete</span>}
              {!inPath && !completed && (
                <span className="text-xs text-muted-foreground italic">Not in your path</span>
              )}
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
