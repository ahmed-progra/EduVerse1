"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Quote } from "lucide-react";
import { fadeUpSpring } from "@/lib/motion-variants";

const TESTIMONIALS = [
  { quote: "I tried three other platforms before EduVerse. The placement test put me at exactly the right level — no rehashing stuff I already knew.", name: "Alex Chen", role: "Frontend Developer", language: "JavaScript", initials: "AC" },
  { quote: "The AI tutor is genuinely helpful. It doesn&apos;t give you the answer, but it asks the right questions to get you unstuck.", name: "Maria Santos", role: "CS Student", language: "Python", initials: "MS" },
  { quote: "I built my first portfolio project in two weeks. The automated grading caught bugs I wouldn&apos;t have spotted on my own.", name: "James Wright", role: "Career Switcher", language: "HTML & CSS", initials: "JW" },
  { quote: "The gamification actually works. I&apos;ve maintained a 30-day streak because the daily quests make me want to come back.", name: "Priya Patel", role: "Data Analyst", language: "Python", initials: "PP" },
];

export function LandingTestimonials() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const t = TESTIMONIALS[active];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <motion.section
      variants={reduce ? undefined : fadeUpSpring}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      className="border-t border-border py-20 md:py-24"
    >
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">{"// 04"}</span> — community
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Loved by learners worldwide.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">
            Join thousands of developers who started from zero and shipped real projects with EduVerse.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: "10K+", label: "Learners" },
              { value: "500+", label: "Exercises" },
              { value: "96%", label: "Completion" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 22 }}
                className="text-center border border-border bg-card/40 p-3"
              >
                <p className="text-xl font-bold text-primary tabular-nums">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border border-border bg-card/60 p-6 md:p-8">
          <motion.div
            animate={reduce ? undefined : { rotate: [0, -3, 3, 0], y: [0, -2, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Quote className="h-5 w-5 text-primary/40 mb-3" aria-hidden="true" />
          </motion.div>
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.p
                key={active}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="text-sm sm:text-base text-card-foreground leading-relaxed italic"
              >
                &ldquo;{t.quote}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>
          <motion.div
            key={`info-${active}`}
            initial={reduce ? undefined : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-4 flex items-center gap-3 pt-3 border-t border-border"
          >
            <motion.span
              initial={reduce ? undefined : { scale: 0 }}
              animate={reduce ? undefined : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold"
            >
              {t.initials}
            </motion.span>
            <div>
              <p className="text-sm font-medium text-card-foreground">{t.name}</p>
              <p className="text-[11px] text-muted-foreground">{t.role} &middot; {t.language}</p>
            </div>
          </motion.div>
          <div className="flex gap-1.5 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                className={`h-1.5 rounded-full ${i === active ? "w-5 bg-primary" : "w-1.5 bg-border"}`}
                aria-label={`Go to testimonial ${i + 1}`}
                whileHover={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                layout
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
