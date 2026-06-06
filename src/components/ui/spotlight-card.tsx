"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — the engine behind EduVerse's spotlight enhancement layer.
 *
 * Design intent: take an ordinary EduVerse card (`border-border bg-card`, sharp
 * `--radius` corners) and make it feel alive — a coral glow that tracks the
 * cursor, a faint 3D tilt, and an accent edge on hover. It adds NO new colors:
 * the glow is driven by an `accent` token (defaults to `--primary`; pass
 * `var(--chart-2)` for the purple secondary).
 *
 * Performance: the cursor glow is written straight to CSS custom properties via
 * a ref inside a single requestAnimationFrame — it never calls setState, so
 * pointer movement triggers zero React re-renders. The tilt rides Framer
 * motion-values + a spring (also no re-renders). Honours reduced-motion and
 * downgrades on coarse pointers / small screens.
 */

type SpotlightCardProps = {
  children: ReactNode;
  /** Glow color. Use existing tokens only, e.g. "var(--primary)" | "var(--chart-2)". */
  accent?: string;
  /** 0..1 — how energetic the glow is. Higher = brighter, used to encode "importance". */
  intensity?: number;
  /** Subtle 3D tilt toward the cursor (fine-pointer / desktop only). */
  tilt?: boolean;
  /** Cursor-tracked radial spotlight. */
  spotlight?: boolean;
  /** Border radius — defaults to the EduVerse `--radius` token (sharp terminal corner). */
  radius?: string;
  /** Spotlight diameter in px (auto-reduced on touch screens via CSS). */
  size?: number;
  /** Bump this number to fire a one-shot reward pulse (e.g. on XP gain). */
  pulseKey?: number;
  /** Listen on `window` for this event and pulse when it fires (e.g. "eduverse:xp-updated"). */
  pulseEvent?: string;
  /** Play a single light-sweep on mount — the "just unlocked" moment. */
  sweepOnMount?: boolean;
  className?: string;
  style?: CSSProperties;
};

const SPRING = { stiffness: 150, damping: 18, mass: 0.4 } as const;
const TILT_MAX = 9; // degrees

function useFinePointer(): boolean {
  // Default true so SSR markup matches the common (desktop) case; refined on mount.
  const [fine, setFine] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

function SpotlightCardImpl({
  children,
  accent = "var(--primary)",
  intensity = 0.5,
  tilt = true,
  spotlight = true,
  radius = "var(--radius)",
  size = 300,
  pulseKey,
  pulseEvent,
  sweepOnMount = false,
  className,
  style,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();

  const enableTilt = tilt && fine && !reduce;
  const enableSpot = spotlight && !reduce;

  const rxSource = useMotionValue(0);
  const rySource = useMotionValue(0);
  const rotateX = useSpring(rxSource, SPRING);
  const rotateY = useSpring(rySource, SPRING);

  // rAF-coalesced pointer handling — at most one DOM write per frame, no setState.
  const frame = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);

  const applyFrame = useCallback(() => {
    frame.current = null;
    const el = ref.current;
    const p = pending.current;
    if (!el || !p) return;
    const rect = el.getBoundingClientRect();
    const px = p.x - rect.left;
    const py = p.y - rect.top;
    if (enableSpot) {
      el.style.setProperty("--spotlight-x", `${px}px`);
      el.style.setProperty("--spotlight-y", `${py}px`);
    }
    if (enableTilt && rect.width > 0 && rect.height > 0) {
      const nx = px / rect.width - 0.5;
      const ny = py / rect.height - 0.5;
      rySource.set(nx * TILT_MAX * 2);
      rxSource.set(-ny * TILT_MAX * 2);
    }
  }, [enableSpot, enableTilt, rxSource, rySource]);

  const handleMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      pending.current = { x: e.clientX, y: e.clientY };
      if (frame.current == null) frame.current = requestAnimationFrame(applyFrame);
    },
    [applyFrame],
  );

  const handleEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (enableSpot) el.style.setProperty("--spotlight-active", "1");
    el.setAttribute("data-hover", "true");
  }, [enableSpot]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.setProperty("--spotlight-active", "0");
      el.setAttribute("data-hover", "false");
    }
    rxSource.set(0);
    rySource.set(0);
  }, [rxSource, rySource]);

  useEffect(
    () => () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  // One-shot reward pulse (CSS keyframe toggled via a short-lived class).
  const [pulsing, setPulsing] = useState(false);
  const pulse = useCallback(() => {
    if (reduce) return;
    setPulsing(true);
    const t = window.setTimeout(() => setPulsing(false), 700);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const firstKey = useRef(true);
  useEffect(() => {
    if (firstKey.current) {
      firstKey.current = false;
      return;
    }
    pulse();
  }, [pulseKey, pulse]);

  useEffect(() => {
    if (!pulseEvent) return;
    const handler = () => pulse();
    window.addEventListener(pulseEvent, handler);
    return () => window.removeEventListener(pulseEvent, handler);
  }, [pulseEvent, pulse]);

  // Single light-sweep on mount (achievement unlock).
  const [sweeping, setSweeping] = useState(false);
  useEffect(() => {
    if (!sweepOnMount || reduce) return;
    setSweeping(true);
    const t = window.setTimeout(() => setSweeping(false), 950);
    return () => window.clearTimeout(t);
  }, [sweepOnMount, reduce]);

  const cssVars = {
    borderRadius: radius,
    "--spotlight-color": accent,
    "--spotlight-strength": intensity,
    "--spotlight-size": `${size}px`,
  } as CSSProperties;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "spotlight-surface border border-border bg-card",
        pulsing && "spotlight-pulse",
        className,
      )}
      style={{
        ...cssVars,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformPerspective: 900,
        ...style,
      }}
      whileHover={reduce ? undefined : { y: -2 }}
      onPointerMove={enableSpot || enableTilt ? handleMove : undefined}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      {sweeping && <span aria-hidden className="spotlight-sweep-band" />}
      {children}
    </motion.div>
  );
}

export const SpotlightCard = memo(SpotlightCardImpl);
