"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  prompt,
  children,
}: {
  title: string;
  prompt: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen flex items-center justify-center pt-14 px-4">
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 30, scale: 0.95 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.8 }}
        className="w-full max-w-sm"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/"
            className="mb-5 flex items-center justify-center gap-1.5 text-lg font-bold text-foreground transition-colors hover:text-primary"
            style={{ fontFamily: "var(--font-display), monospace" }}
            aria-label="EduVerse home"
          >
            <motion.span
              className="text-primary"
              aria-hidden="true"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >&gt;</motion.span>
            <span>EduVerse</span>
            <span className="text-primary cursor-blink" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 250, damping: 22 }}
          className="chamfer overflow-hidden border border-border bg-card/60 backdrop-blur-xl shadow-[var(--glow-soft)]"
        >
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-primary/60" />
            </span>
            <span className="ml-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {prompt}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={reduce ? undefined : { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              secure
            </span>
          </div>

          <div className="p-8">
            <h1 className="mb-6 text-center text-2xl font-bold text-foreground">{title}</h1>
            {children}
          </div>
        </motion.div>

        <motion.p
          initial={reduce ? undefined : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-center"
        >
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            ← Back to home
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
