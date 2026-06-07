"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

type AchievementToastData = {
  title: string;
  description: string;
  icon: string;
  xpReward: number;
};

type Particle = { id: number; x: number; y: number; color: string; size: number; shape: "circle" | "star" };

const COLORS = ["var(--primary)", "var(--chart-2)", "var(--chart-3)", "var(--chart-5)", "#ffd93d", "#ff6b6b"];

export function AchievementToast() {
  const [queue, setQueue] = useState<AchievementToastData[]>([]);
  const [current, setCurrent] = useState<AchievementToastData | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);

  const dequeue = useCallback(() => {
    setQueue((prev) => {
      if (prev.length > 0) {
        const [next, ...rest] = prev;
        setCurrent(next);
        return rest;
      }
      setCurrent(null);
      return [];
    });
  }, []);

  useEffect(() => {
    const handler = (e: CustomEvent<AchievementToastData>) => {
      setQueue((prev) => [...prev, e.detail]);
    };
    window.addEventListener("eduverse:achievement-unlocked", handler as EventListener);
    return () => window.removeEventListener("eduverse:achievement-unlocked", handler as EventListener);
  }, []);

  useEffect(() => {
    if (current) {
      const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
        id: ++idRef.current,
        x: (Math.random() - 0.5) * 200,
        y: -(Math.random() * 120 + 20),
        color: COLORS[i % COLORS.length],
        size: Math.random() * 4 + 2,
        shape: Math.random() > 0.5 ? "circle" : "star",
      }));
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        const ids = new Set(newParticles.map((p) => p.id));
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      }, 800);

      const t = setTimeout(dequeue, 4000);
      return () => clearTimeout(t);
    }
  }, [current, dequeue]);

  useEffect(() => {
    if (!current && queue.length > 0) {
      dequeue();
    }
  }, [current, queue, dequeue]);

  return (
    <div className="fixed bottom-20 right-4 z-[200] pointer-events-none">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.title}
            initial={{ opacity: 0, x: 60, scale: 0.88, rotate: -2 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, x: 60, scale: 0.88, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative pointer-events-auto chamfer border border-primary/40 bg-card shadow-[var(--glow)] p-4 max-w-xs backdrop-blur-lg"
          >
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute pointer-events-none"
                style={{
                  width: p.size,
                  height: p.shape === "star" ? p.size : p.size,
                  backgroundColor: p.color,
                  top: "50%",
                  left: "50%",
                  borderRadius: p.shape === "circle" ? "50%" : "2px",
                  clipPath: p.shape === "star" ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : undefined,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2, rotate: 360 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ))}
            <div className="flex items-start gap-3">
              <motion.span
                className="text-2xl shrink-0"
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.1 }}
              >
                {current.icon}
              </motion.span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.15em] text-primary font-semibold mb-0.5">
                  Achievement Unlocked
                </p>
                <p className="font-semibold text-card-foreground text-sm leading-tight">
                  {current.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{current.description}</p>
                <motion.span
                  className="inline-block mt-1.5 text-[10px] font-semibold text-primary"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                >
                  +{current.xpReward} XP
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
