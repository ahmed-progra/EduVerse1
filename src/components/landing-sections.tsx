"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LandingFeatures } from "@/components/landing-features";
import { LandingTracks } from "@/components/landing-tracks";
import { LandingTestimonials } from "@/components/landing-testimonials";
import { LandingFaqPricing } from "@/components/landing-faq-pricing";
import { fadeUpSpring, sectionContainer, sectionItem } from "@/lib/motion-variants";
import { useMagnetic } from "@/lib/use-magnetic";

const SECTION_CLASS = "py-20 md:py-24 border-t border-border";

export function LandingSections({ cta, onCta }: { cta: string; onCta?: () => void }) {
  const reduce = useReducedMotion();
  const vp = { once: true, margin: "-120px" } as const;

  return (
    <div className="relative border-t border-border">
      <div aria-hidden className="terminal-grid pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative container mx-auto px-4 md:px-6">
        {/* ── About ────────────────────────────────────────────────── */}
        <motion.section
          variants={reduce ? undefined : fadeUpSpring}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={vp}
          className={`${SECTION_CLASS} text-center`}
        >
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">{"// 00"}</span> — about
          </p>
          <motion.h2
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 22 }}
            className="max-w-3xl mx-auto text-3xl md:text-4xl font-bold text-foreground"
          >
            The terminal for your coding journey.
          </motion.h2>
          <motion.p
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 20 }}
            className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed"
          >
            EduVerse combines structured lessons, an AI-powered tutor, live code execution,
            and gamified progression. Whether you are starting from zero or sharpening existing skills,
            EduVerse adapts to your level and keeps you moving forward.
          </motion.p>
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={vp}
            transition={{ delay: 0.35 }}
            className="mt-6 flex items-center justify-center gap-6 flex-wrap text-xs text-muted-foreground"
          >
            <Bullet>AI-guided learning</Bullet>
            <Bullet>Live code execution</Bullet>
            <Bullet>Gamified progression</Bullet>
            <Bullet>Placement exams</Bullet>
          </motion.div>
        </motion.section>

        {/* ── Capabilities ─────────────────────────────────────────── */}
        <LandingFeatures />

        {/* ── How It Works ─────────────────────────────────────────── */}
        <motion.section
          variants={reduce ? undefined : fadeUpSpring}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={vp}
          className={SECTION_CLASS}
        >
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">{"// 02"}</span> — how it works
          </p>
          <motion.h2
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 22 }}
            className="max-w-2xl text-3xl md:text-4xl font-bold text-foreground"
          >
            Four steps to fluency.
          </motion.h2>

          <motion.div
            variants={reduce ? undefined : sectionContainer}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={vp}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { num: "01", icon: "🎯", title: "Pick Your Path", body: "Choose a language or take a placement test to find where you belong." },
              { num: "02", icon: "📖", title: "Learn by Doing", body: "Read theory, write real code, get instant feedback from our AI tutor." },
              { num: "03", icon: "⚡", title: "Build Projects", body: "Apply your skills in real-world projects with automated grading." },
              { num: "04", icon: "🏆", title: "Level Up", body: "Earn XP, unlock achievements, and climb the leaderboard as you grow." },
            ].map((s) => (
              <motion.div key={s.title} variants={reduce ? undefined : sectionItem}>
                <MagneticCard num={s.num} icon={s.icon} title={s.title} body={s.body} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Language tracks ──────────────────────────────────────── */}
        <LandingTracks />

        {/* ── Testimonials ─────────────────────────────────────────── */}
        <LandingTestimonials />

        {/* ── FAQ + Pricing ────────────────────────────────────────── */}
        <LandingFaqPricing />

        {/* ── Final CTA ────────────────────────────────────────────── */}
        <motion.section
          variants={reduce ? undefined : fadeUpSpring}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={vp}
          className={`${SECTION_CLASS} text-center py-24 md:py-28`}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">{"// 07"}</span> — run
          </p>
          <motion.h2
            initial={reduce ? undefined : { opacity: 0, y: 20, scale: 0.95 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={vp}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto mt-4 max-w-2xl text-4xl font-bold text-foreground md:text-5xl"
          >
            Start where you actually belong.
          </motion.h2>
          <motion.p
            initial={reduce ? undefined : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={vp}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base"
          >
            <span className="select-none text-primary">&gt;</span> Take a two-minute placement
            test and get a learning path built around what you already know.
          </motion.p>
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={vp}
            transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 18 }}
            className="mt-8"
          >
            <Button size="lg" onClick={onCta} className="chamfer px-8 py-6 text-base">
              {cta}
              <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-1 w-1 rounded-full bg-primary" />
      {children}
    </span>
  );
}

function MagneticCard({ num, icon, title, body }: { num: string; icon: string; title: string; body: string }) {
  const { handlers, ref } = useMagnetic({ x: 5, y: 5, scale: 1.01 });
  return (
    <div
      ref={ref}
      {...handlers}
      className="relative group border border-border bg-card/60 p-5 transition-colors hover:border-primary/40"
    >
      <span className="absolute top-3 right-3 text-[10px] font-bold text-muted-foreground/40 tabular-nums">
        {num}
      </span>
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <h3 className="mt-3 text-sm font-semibold text-card-foreground">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
