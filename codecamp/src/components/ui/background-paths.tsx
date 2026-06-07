"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";
import { HeroIllustration } from "@/components/ui/hero-illustration";

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

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.6 });
  const y = useSpring(my, { stiffness: 80, damping: 20, mass: 0.6 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 12);
      my.set((e.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [mx, my]);

  return (
    <motion.div className="absolute inset-0 pointer-events-none" style={{ x, y }}>
      <svg className="w-full h-full text-primary" viewBox="0 0 696 316" fill="none">
        <title>Decorative paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.04 + path.id * 0.025}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </motion.div>
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
    <div className="flex items-center gap-6 sm:gap-10">
      {HERO_STATS.map((s, i) => (
        <div key={s.label}>
          <span className="block text-xl sm:text-2xl font-bold text-primary tabular-nums">
            {counts[i]}{s.suffix}
          </span>
          <span className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function LanguageBadges() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {LANGUAGES.map((lang) => (
        <span
          key={lang.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground"
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
  return (
    <div className="relative min-h-[90vh] w-full flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
          {/* Left: content — 7 cols on desktop */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Interactive Coding Platform
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-foreground leading-[1.1]">
                <Typewriter text={title} as="span" speed={80} startDelay={150} />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                className="text-base sm:text-lg text-muted-foreground max-w-xl mb-6 leading-relaxed"
              >
                Master coding with AI-guided lessons, live code execution, and gamified progression.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
                className="mb-6"
              >
                <LanguageBadges />
              </motion.div>

              {description && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                  className="mb-6 space-y-1"
                >
                  {description.map((line, i) => (
                    <p key={i} className="text-sm sm:text-base text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
                className="flex flex-wrap items-center gap-4 justify-center lg:justify-start"
              >
                <Button size="lg" onClick={onCta} className="px-8 py-6 text-base">
                  {cta}
                  <span className="ml-2" aria-hidden="true">→</span>
                </Button>
              </motion.div>

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

          {/* Right: illustration — 5 cols on desktop, hidden on mobile */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
