"use client";

import { motion, useReducedMotion } from "motion/react";
import { staggerMedium, sectionItem } from "@/lib/motion-variants";

type Track = {
  tag: string;
  name: string;
  blurb: string;
  color: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  description: string;
};

const TRACKS: Track[] = [
  { tag: "</>", name: "HTML & CSS", blurb: "Structure & style the web", color: "var(--chart-3)", difficulty: "Beginner", lessons: 18, description: "Semantic markup, flexbox, grid, responsive design, CSS animations — build real pages from day one." },
  { tag: "JS", name: "JavaScript", blurb: "Make it interactive", color: "var(--chart-5)", difficulty: "Beginner", lessons: 22, description: "Variables, closures, DOM manipulation, async/await, ES6+ — the language of the web." },
  { tag: "Py", name: "Python", blurb: "Logic, data & automation", color: "var(--chart-2)", difficulty: "Intermediate", lessons: 20, description: "Functions, data structures, file I/O, OOP, standard library — versatile and powerful." },
  { tag: "C++", name: "C++", blurb: "Systems & performance", color: "var(--primary)", difficulty: "Advanced", lessons: 16, description: "Pointers, memory management, STL, algorithms — build fast, close-to-metal software." },
];

function DifficultyDots({ level, color }: { level: string; color: string }) {
  const dots = level === "Beginner" ? 1 : level === "Intermediate" ? 2 : 3;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
      <span className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: i < dots ? color : "var(--border)", opacity: i < dots ? 0.7 : 0.4 }}
            animate={i < dots ? { opacity: [0.7, 1, 0.7] } : undefined}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </span>
      {level}
    </span>
  );
}

export function LandingTracks() {
  const reduce = useReducedMotion();
  const vp = { once: true, margin: "-80px" } as const;

  return (
    <motion.section
      variants={reduce ? undefined : staggerMedium}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={vp}
      className="border-t border-border py-20 md:py-24"
    >
      <motion.p
        variants={reduce ? undefined : sectionItem}
        className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span className="text-primary">{"// 03"}</span> — tracks
      </motion.p>
      <motion.h2
        variants={reduce ? undefined : sectionItem}
        className="max-w-2xl text-3xl md:text-4xl font-bold text-foreground"
      >
        Four languages. One coherent path.
      </motion.h2>

      <motion.div
        variants={reduce ? undefined : staggerMedium}
        className="mt-8 grid gap-4 sm:grid-cols-2"
      >
        {TRACKS.map((t) => (
          <motion.div
            key={t.name}
            variants={reduce ? undefined : sectionItem}
            className="group relative border border-border bg-card/60 p-5 transition-all hover:border-primary/50 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <motion.span
                className="grid h-14 w-14 shrink-0 place-items-center border border-border bg-background font-display text-lg font-bold transition-colors group-hover:border-primary/60 group-hover:bg-primary/5"
                style={{ color: t.color }}
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                {t.tag}
              </motion.span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-card-foreground">{t.name}</span>
                  <DifficultyDots level={t.difficulty} color={t.color} />
                  <span className="text-[11px] text-muted-foreground">{t.lessons} lessons</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </div>
            </div>
            <motion.div
              className="mt-3 h-px w-0 group-hover:w-full"
              style={{ backgroundColor: t.color, opacity: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
