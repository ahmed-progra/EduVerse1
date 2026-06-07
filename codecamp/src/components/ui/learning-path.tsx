"use client";

import Link from "next/link";
import { motion } from "motion/react";

type PathCourse = {
  slug: string;
  title: string;
  icon: string | null;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  isActive: boolean;
};

interface LearningPathProps {
  courses: PathCourse[];
  currentCourseSlug?: string;
}

export function LearningPath({ courses, currentCourseSlug }: LearningPathProps) {
  return (
    <div className="space-y-2">
      {courses.map((course, i) => {
        const isCurrent = course.slug === currentCourseSlug;
        const isComplete = course.progress === 100;
        const isLocked = !isCurrent && !isComplete && i > 0 && courses[i - 1]?.progress !== 100;

        return (
          <motion.div
            key={course.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: "easeOut" }}
          >
            <Link
              href={isLocked ? "#" : `/courses/${course.slug}`}
              className={`block rounded-[var(--radius)] border p-4 transition-colors ${
                isCurrent
                  ? "border-primary bg-primary/5"
                  : isComplete
                  ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/20"
                  : isLocked
                  ? "border-border/50 bg-muted/30 opacity-50 cursor-not-allowed"
                  : "border-border bg-card/50 hover:border-primary/30"
              }`}
              onClick={(e) => { if (isLocked) e.preventDefault(); }}
            >
              <div className="flex items-center gap-3">
                {/* Step Number */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isComplete
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isComplete ? "✓" : i + 1}
                </div>

                {/* Icon + Title */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xl flex-shrink-0">{course.icon ?? "📖"}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-card-foreground truncate">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </p>
                  </div>
                </div>

                {/* Progress + Badge */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isLocked && (
                    <span className="text-xs text-muted-foreground">🔒</span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Current
                    </span>
                  )}
                  {isComplete && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                      Complete
                    </span>
                  )}
                  <div className="w-16">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                          isComplete ? "bg-green-500" : "bg-primary"
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right mt-0.5">{course.progress}%</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Connector line */}
            {i < courses.length - 1 && (
              <div className="ml-4 pl-0 h-4 border-l-2 border-border/50" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
