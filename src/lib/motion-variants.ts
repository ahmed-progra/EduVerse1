import { type Variants } from "motion/react";

const SPRING_STIFF = { type: "spring", stiffness: 300, damping: 25 } as const;
const SPRING_GENTLE = { type: "spring", stiffness: 200, damping: 22 } as const;
const SPRING_BOUNCE = { type: "spring", stiffness: 400, damping: 18 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const fadeUpSpring: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING_GENTLE },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

export const staggerMedium: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export const scaleOnTap = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
};

export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.2, ease: "easeOut" } },
};

export const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export const listItemSlide: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: SPRING_GENTLE },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.08, ease: "easeOut" } },
};

export const pageSlide: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 28, mass: 0.8 } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: SPRING_STIFF },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: SPRING_BOUNCE },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: SPRING_GENTLE },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: SPRING_GENTLE },
};

export const bounceIn: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: SPRING_BOUNCE },
};

export const flipIn: Variants = {
  hidden: { opacity: 0, rotateX: -15, y: 20 },
  visible: { opacity: 1, rotateX: 0, y: 0, transition: SPRING_GENTLE },
};

export const glowPulse: Variants = {
  initial: { boxShadow: "0 0 0 0 color-mix(in oklch, var(--primary) 30%, transparent)" },
  animate: {
    boxShadow: [
      "0 0 0 0 color-mix(in oklch, var(--primary) 30%, transparent)",
      "0 0 18px 2px color-mix(in oklch, var(--primary) 45%, transparent)",
      "0 0 0 0 color-mix(in oklch, var(--primary) 30%, transparent)",
    ],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export const progressFill = {
  initial: { width: "0%" },
  animate: (pct: number) => ({
    width: `${pct}%`,
    transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.5 },
  }),
};

export const cardFloat: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -6, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};

export const notificationSlide: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.92 },
  visible: { opacity: 1, x: 0, scale: 1, transition: SPRING_BOUNCE },
  exit: { opacity: 0, x: 60, scale: 0.92, transition: { duration: 0.2, ease: "easeOut" } },
};

export const modalScale: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: SPRING_STIFF },
  exit: { opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.15, ease: "easeOut" } },
};

export const shimmerSweep: Variants = {
  initial: { x: "-100%" },
  animate: { x: "300%", transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } },
};

export const sectionItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 22, mass: 0.6 } },
};

export const sectionContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
