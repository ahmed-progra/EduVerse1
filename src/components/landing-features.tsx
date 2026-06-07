"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Radar, SquareTerminal, Sparkles, Trophy, Target, BookOpen,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { staggerMedium, sectionItem } from "@/lib/motion-variants";

const FEATURES = [
  { icon: Radar, title: "Structured Tracks", body: "Curated paths for HTML/CSS, JavaScript, Python, and C++ — beginner to advanced, no guesswork.", intensity: 0.6 },
  { icon: SquareTerminal, title: "Write & Run Live", body: "A real Monaco editor with sandboxed execution. Ship code from lesson one — zero local setup.", intensity: 0.75 },
  { icon: Sparkles, title: "AI Tutor", body: "A Claude-powered mentor that nudges you toward the answer — and never just hands it over.", intensity: 0.7 },
  { icon: Trophy, title: "Earn Your Rank", body: "XP, levels, streaks, achievements, and a live leaderboard. Progress you can actually feel.", intensity: 0.85 },
  { icon: Target, title: "Placement Exams", body: "Two-minute adaptive tests that place you at exactly the right level — no wasted lessons.", intensity: 0.65 },
  { icon: BookOpen, title: "Project Portfolio", body: "Real-world projects with automated grading. Build a portfolio that proves what you know.", intensity: 0.8 },
];

export function LandingFeatures() {
  const reduce = useReducedMotion();
  return (
    <motion.section
      variants={reduce ? undefined : staggerMedium}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
      className="border-t border-border py-20 md:py-24"
    >
      <motion.p
        variants={reduce ? undefined : sectionItem}
        className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        <span className="text-primary">{"// 01"}</span> — capabilities
      </motion.p>
      <motion.h2
        variants={reduce ? undefined : sectionItem}
        className="max-w-2xl text-3xl md:text-4xl font-bold text-foreground"
      >
        Everything you need to go from zero to shipping.
      </motion.h2>

      <motion.div
        variants={reduce ? undefined : staggerMedium}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              variants={reduce ? undefined : sectionItem}
              className="group"
            >
              <SpotlightCard className="h-full p-5 bg-card/80">
                <motion.span
                  className="inline-grid h-10 w-10 place-items-center border border-primary/40 bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors"
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </motion.span>
                <h3 className="mt-3 text-base font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
