"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * AnimateText — "soft-blur-in" text reveal.
 *
 * Faithful to pixel-point/animate-text › soft-blur-in: a per-character fade + gentle
 * upward motion + de-blur, on Apple's signature easing cubic-bezier(0.22, 1, 0.36, 1).
 * Implemented with the Motion (framer-motion) adapter the skill specifies.
 *
 * Use `split="char"` for short hero titles; `split="word"` for longer headings
 * (>~40 chars) per the spec's guidance. Honors prefers-reduced-motion.
 */

// Apple "soft-blur" signature easing.
const SOFT_BLUR_EASE = [0.22, 1, 0.36, 1] as const;

const MOTION_TAGS = {
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
} as const;

type TagName = keyof typeof MOTION_TAGS;

type AnimateTextProps = {
  text: string;
  as?: TagName;
  className?: string;
  /** "char" (default) for short titles; "word" for longer headings. */
  split?: "char" | "word";
  /** seconds before the first unit animates */
  delay?: number;
  /** per-unit stagger in seconds (spec default 0.025) */
  stagger?: number;
  /** enter duration in seconds (spec default 0.9) */
  duration?: number;
  /** blur distance in px (spec 12 for hero; ~6 for body) */
  blur?: number;
  /** animate on scroll-into-view instead of on mount */
  inView?: boolean;
};

export function AnimateText({
  text,
  as = "span",
  className,
  split = "char",
  delay = 0,
  stagger = 0.025,
  duration = 0.9,
  blur = 12,
  inView = false,
}: AnimateTextProps) {
  const reduce = useReducedMotion();

  // Reduced motion: render the plain semantic element, no animation.
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const units =
    split === "word" ? text.match(/(\S+|\s+)/g) ?? [text] : Array.from(text);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const unit: Variants = {
    hidden: { opacity: 0, y: 16, filter: `blur(${blur}px)` },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, ease: SOFT_BLUR_EASE },
    },
  };

  // Cast to a single concrete motion component so the union of tag types doesn't
  // fight the shared motion/HTML props we pass (runtime tag is still correct).
  const Comp = MOTION_TAGS[as] as typeof motion.span;
  const trigger = inView
    ? ({ initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" } } as const)
    : ({ initial: "hidden", animate: "visible" } as const);

  return (
    <Comp className={className} variants={container} aria-label={text} {...trigger}>
      {units.map((u, i) => (
        <motion.span
          key={i}
          variants={unit}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {u}
        </motion.span>
      ))}
    </Comp>
  );
}
