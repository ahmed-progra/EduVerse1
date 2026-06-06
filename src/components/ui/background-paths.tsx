"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { label: "HTML/CSS", color: "var(--chart-3)" },
  { label: "JavaScript", color: "var(--chart-5)" },
  { label: "Python", color: "var(--chart-2)" },
  { label: "C++", color: "var(--primary)" },
];

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 12 * position} -${189 + i * 15}C-${380 - i * 12 * position} -${189 + i * 15} -${312 - i * 12 * position} ${216 - i * 15} ${152 - i * 12 * position} ${343 - i * 15}C${616 - i * 12 * position} ${470 - i * 15} ${684 - i * 12 * position} ${875 - i * 15} ${684 - i * 12 * position} ${875 - i * 15}`,
    width: 0.5 + i * 0.08,
    duration: 25 + i * 2,
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0.5);
  const [mouseY, setMouseY] = useState(0.5);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouseX(e.clientX / window.innerWidth);
      setMouseY(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const dx = (mouseX - 0.5) * 12;
  const dy = (mouseY - 0.5) * 12;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ transform: `translate(${dx}px, ${dy}px)`, transition: "transform 0.15s ease-out" }}
    >
      <svg className="w-full h-full text-primary" viewBox="0 0 696 316" fill="none">
        <title>Data streams</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.04 + path.id * 0.035}
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function TerminalStatic() {
  return (
    <div className="font-mono text-xs sm:text-sm leading-relaxed">
      <div className="flex items-start gap-2">
        <span className="text-primary shrink-0 select-none">$</span>
        <span className="text-foreground">
          npm create eduverse@latest<span className="text-primary animate-pulse">▌</span>
        </span>
      </div>
    </div>
  );
}

const HERO_STATS = [
  { label: "Courses", value: 4, suffix: "+" },
  { label: "Languages", value: 4, suffix: "" },
  { label: "Exercises", value: 60, suffix: "+" },
];

function AnimatedStats() {
  const [counts, setCounts] = useState([0, 0, 0]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const durations = [1500, 1000, 2000];
    const startTime = performance.now();
    const targets = HERO_STATS.map((s) => s.value);

    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

    function animate(now: number) {
      const elapsed = now - startTime;
      const newCounts = targets.map((target, i) => {
        const raw = Math.min(elapsed / durations[i], 1);
        return Math.floor(easeOutCubic(raw) * target);
      });
      setCounts(newCounts);
      if (newCounts.some((c, i) => c < targets[i])) {
        animRef.current = requestAnimationFrame(animate);
      }
    }
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10">
      {HERO_STATS.map((s, i) => (
        <div key={s.label} className="text-center">
          <span className="block text-xl sm:text-2xl font-bold text-primary tabular-nums">
            {counts[i]}{s.suffix}
          </span>
          <span className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
            {s.label}
          </span>
        </div>
      ))}
      <div className="h-8 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-destructive" style={{ boxShadow: "0 0 6px var(--destructive)" }} />
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Live</span>
      </div>
    </div>
  );
}

function LanguageBadges() {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {LANGUAGES.map((lang) => (
        <span
          key={lang.label}
          className="inline-flex items-center gap-1.5 border border-border bg-card/30 px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
          {lang.label}
        </span>
      ))}
    </div>
  );
}

export function BackgroundPaths({
  title = "Learn to Code",
  description,
  cta = "Start Learning",
  onCta,
}: {
  title?: string;
  description?: string[];
  cta?: string;
  onCta?: () => void;
}) {
  const words = title.split(" ");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Terminal status line */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 border border-border bg-card/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-destructive"
              style={{ boxShadow: "0 0 6px var(--destructive)" }}
            />
            <span className="text-foreground font-semibold">EduVerse</span>
            <span className="text-muted-foreground">—</span>
            Interactive Coding Platform
          </motion.div>

          {/* Title with per-letter spring */}
          <h1 className="text-glow text-5xl sm:text-7xl md:text-8xl font-extrabold mb-6 tracking-tighter text-foreground uppercase">
            {words.map((word, wi) => (
              <span key={wi} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, li) => (
                  <motion.span
                    key={`${wi}-${li}`}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wi * 0.08 + li * 0.025,
                      type: "spring",
                      stiffness: 200,
                      damping: 14,
                      mass: 0.8,
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
            <span className="cursor-blink align-baseline" aria-hidden="true" />
          </h1>

          {/* Shimmer description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="shimmer-strong mb-6 max-w-xl mx-auto text-sm sm:text-base font-semibold tracking-wide"
          >
            Master coding with AI-guided lessons, live code execution, and gamified progression.
          </motion.p>

          {/* Language badges row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
            className="mb-6"
          >
            <LanguageBadges />
          </motion.div>

          {/* Live typing code demo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
            className="mb-6 mx-auto max-w-xs text-left border border-border bg-card/60 backdrop-blur-sm p-3"
          >
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-border">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full bg-primary/60" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground ml-1">
                terminal
              </span>
            </div>
            <TerminalStatic />
          </motion.div>

          {description && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              className="mb-5 max-w-2xl mx-auto space-y-1 text-left sm:text-center"
            >
              {description.map((line, i) => (
                <p key={i} className="text-sm sm:text-base text-muted-foreground">
                  <span className="text-primary mr-2 select-none">&gt;</span>
                  {line}
                </p>
              ))}
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
          >
            <Button
              size="lg"
              onClick={onCta}
              className="chamfer px-8 py-6 text-base"
            >
              {cta}
              <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.75, ease: "easeOut" }}
            className="mt-10"
          >
            <AnimatedStats />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
