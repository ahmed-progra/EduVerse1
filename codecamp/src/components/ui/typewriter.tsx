"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Typewriter — reveals text character-by-character with a blinking "|" caret.
 *
 * Performance / correctness notes:
 * - One interval advances a `count` index; it is always cleared on unmount.
 * - The not-yet-typed remainder is rendered transparent so the element keeps
 *   its full width and avoids layout shift.
 * - Respects `prefers-reduced-motion`: when reduced, reveal the whole text
 *   instantly with the caret hidden.
 */

type TypewriterProps = {
  text: string;
  speed?: number;
  startDelay?: number;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  className?: string;
  /** Show a blinking caret at the end of the typed text. */
  caret?: boolean;
};

const DEFAULT_SPEED = 50;
const DEFAULT_DELAY = 0;

export function Typewriter({
  text,
  speed = DEFAULT_SPEED,
  startDelay = DEFAULT_DELAY,
  as: Tag = "span",
  className,
  caret = true,
}: TypewriterProps) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? text.length : 0);
  const [animating, setAnimating] = useState(!reduce);
  const raf = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      setAnimating(false);
      return;
    }

    // Reset and restart if text changes.
    setCount(0);
    setAnimating(true);
    startTime.current = null;

    const FUDGE = 0.3; // ms per char added to avoid near-zero intervals
    raf.current = requestAnimationFrame(function tick(now: number) {
      if (startTime.current === null) startTime.current = now;
      const elapsed = now - startTime.current;
      const delayMs = startDelay * (speed === 0 ? 1 : speed);
      if (elapsed < delayMs) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const adjustedElapsed = elapsed - delayMs;
      const raw = Math.floor(adjustedElapsed / (speed + FUDGE));
      const next = Math.min(raw, text.length);
      setCount(next);
      if (next < text.length) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setAnimating(false);
      }
    });

    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [text, speed, startDelay, reduce]);

  const typed = animating ? text.slice(0, count) : text;
  const rest = animating ? text.slice(count) : "";

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">{typed}</span>
      {caret && <span className="animate-pulse text-primary" aria-hidden="true">|</span>}
      {rest && (
        <span aria-hidden="true" className="opacity-0">
          {rest}
        </span>
      )}
    </Tag>
  );
}
