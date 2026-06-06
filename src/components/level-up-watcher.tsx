"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { getLevel, getLevelTitle } from "@/lib/xp";

type Celebration = { level: number; title: string; xp: number };

export function LevelUpWatcher() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const lastLevel = useRef<number | null>(null);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const check = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/user/progress/summary");
      if (!res.ok) return;
      const data = await res.json();
      const xp: number = data.totalXp ?? 0;
      const { level } = getLevel(xp);
      const key = `eduverse:lastLevel:${userId}`;

      let stored = lastLevel.current;
      if (stored === null) {
        const raw = localStorage.getItem(key);
        stored = raw ? Number(raw) : null;
      }

      if (stored === null) {
        lastLevel.current = level;
        localStorage.setItem(key, String(level));
        return;
      }

      if (level > stored) {
        setCelebration({ level, title: getLevelTitle(level), xp });
      }
      lastLevel.current = level;
      localStorage.setItem(key, String(level));
    } catch {
      /* network hiccup — ignore */
    }
  }, [userId]);

  useEffect(() => {
    check();
  }, [check, pathname]);

  useEffect(() => {
    const handler = () => check();
    window.addEventListener("eduverse:xp-updated", handler);
    return () => window.removeEventListener("eduverse:xp-updated", handler);
  }, [check]);

  return (
    <AnimatePresence>
      {celebration && <LevelUpOverlay {...celebration} onClose={() => setCelebration(null)} />}
    </AnimatePresence>
  );
}

function ConfettiPiece({ delay, color }: { delay: number; color: string }) {
  const x = (Math.random() - 0.5) * 300;
  const rotation = Math.random() * 720;
  return (
    <motion.span
      className="absolute pointer-events-none"
      style={{
        width: 4 + Math.random() * 4,
        height: 4 + Math.random() * 4,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "0",
        left: "50%",
        top: "50%",
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{
        x,
        y: 200 + Math.random() * 100,
        opacity: 0,
        scale: 1,
        rotate: rotation,
      }}
      transition={{
        delay,
        duration: 1.5 + Math.random(),
        ease: "easeOut",
      }}
    />
  );
}

function LevelUpOverlay({ level, title, xp, onClose }: Celebration & { onClose: () => void }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(onClose, 6500);
    return () => clearTimeout(t);
  }, [onClose]);

  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    return { x: Math.cos(angle) * 160, y: Math.sin(angle) * 160, d: 0.3 + (i % 4) * 0.06 };
  });

  const confettiColors = ["var(--primary)", "var(--chart-2)", "var(--chart-5)", "var(--chart-3)", "#ff6b6b", "#ffd93d"];

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-background/80 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Level up — you reached level ${level}, ${title}`}
    >
      <div className="relative">
        {!reduce && (
          <>
            {particles.map((p, i) => (
              <motion.span
                key={`particle-${i}`}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-primary"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
                transition={{ duration: p.d + 0.6, ease: "easeOut" }}
                style={{ boxShadow: "0 0 8px color-mix(in oklch, var(--primary) 70%, transparent)" }}
              />
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <ConfettiPiece
                key={`confetti-${i}`}
                delay={i * 0.03}
                color={confettiColors[i % confettiColors.length]}
              />
            ))}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
              initial={{ scale: 0, opacity: 0.4 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 15%, transparent) 0%, transparent 70%)",
              }}
            />
          </>
        )}

        <motion.div
          className="chamfer relative border border-primary bg-card px-10 py-8 text-center shadow-[var(--glow)] max-w-sm"
          initial={{ scale: reduce ? 1 : 0.82, y: reduce ? 0 : 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 240, damping: 18, mass: 0.6 }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-primary mb-3 cursor-blink">Level Up</p>
          <motion.p
            className="text-7xl font-extrabold text-foreground text-glow leading-none mb-2"
            initial={reduce ? undefined : { scale: 0.5 }}
            animate={reduce ? undefined : { scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
          >
            {level}
          </motion.p>
          <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">{title}</p>
          <p className="text-xs text-muted-foreground mb-6">
            You&apos;ve reached {xp.toLocaleString("en-US")} XP. Keep building.
          </p>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-primary text-primary-foreground uppercase tracking-wide text-sm font-semibold py-2.5 border border-primary/60 hover:bg-primary/90 transition-colors"
          >
            Continue →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
