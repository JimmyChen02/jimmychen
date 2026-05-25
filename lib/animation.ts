/**
 * lib/animation.ts
 *
 * Shared animation constants, variants, and helpers for Framer Motion.
 * Centralizing these avoids drift across components and keeps performance consistent.
 */

import type { Variants, Transition } from "framer-motion";

// ---------------------------------------------------------------------------
// Easing presets (cubic-bezier strings compatible with both CSS and Framer)
// ---------------------------------------------------------------------------
export const ease = {
  /** Apple-style spring-out */
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Smooth snap-in */
  in: [0.7, 0, 0.84, 0] as [number, number, number, number],
  /** Smooth in-out */
  inOut: [0.45, 0, 0.55, 1] as [number, number, number, number],
  /** Overshoot spring */
  spring: { type: "spring" as const, stiffness: 200, damping: 20 },
  /** Tight spring for UI elements */
  tightSpring: { type: "spring" as const, stiffness: 400, damping: 30 },
} as const;

// ---------------------------------------------------------------------------
// Transition presets
// ---------------------------------------------------------------------------
export const transitions = {
  fast: { duration: 0.2, ease: ease.out } satisfies Transition,
  medium: { duration: 0.4, ease: ease.out } satisfies Transition,
  slow: { duration: 0.7, ease: ease.out } satisfies Transition,
  stagger: (i: number, base = 0.06): Transition => ({
    duration: 0.5,
    ease: ease.out,
    delay: i * base,
  }),
} as const;

// ---------------------------------------------------------------------------
// Common scroll-reveal variants
// ---------------------------------------------------------------------------

/** Fade up from below — use with whileInView */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.out },
  },
};

/** Fade in only */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: ease.out },
  },
};

/** Scale up from 90% */
export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: ease.out },
  },
};

/** Staggered container */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Slide in from left */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: ease.out },
  },
};

/** Slide in from right */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: ease.out },
  },
};

// ---------------------------------------------------------------------------
// Token / pill pop variants
// ---------------------------------------------------------------------------
export const tokenPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: i * 0.07,
    },
  }),
};

// ---------------------------------------------------------------------------
// Data pulse helpers
// ---------------------------------------------------------------------------
export const pulseVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.8 },
  visible: {
    opacity: [0, 1, 1, 0],
    y: [0, 20, 40, 60],
    scale: [0.8, 1, 1, 0.8],
    transition: {
      duration: 1.8,
      ease: "linear",
      repeat: Infinity,
      repeatDelay: 0.4,
    },
  },
};

// ---------------------------------------------------------------------------
// Glow animation keyframes (for motion.div style usage)
// ---------------------------------------------------------------------------
export const glowPulseAnimation = {
  boxShadow: [
    "0 0 8px rgba(6, 182, 212, 0.3)",
    "0 0 24px rgba(6, 182, 212, 0.7)",
    "0 0 8px rgba(6, 182, 212, 0.3)",
  ],
  transition: {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

// ---------------------------------------------------------------------------
// Reduced-motion guard
// ---------------------------------------------------------------------------
/**
 * Returns a safe Framer Motion variant set that respects prefers-reduced-motion.
 * Use on the server or SSR — for client-only checks, use the hook below.
 */
export function getReducedMotionVariants<T extends Variants>(
  variants: T
): T {
  // On server we can't check media queries — return full variants.
  // The CSS `@media (prefers-reduced-motion)` in globals.css will suppress CSS animations.
  return variants;
}

/**
 * Default viewport config for whileInView animations.
 * `once: false` so animations replay on every scroll in/out.
 */
export const defaultViewport = { once: false, margin: "-60px 0px" } as const;

/**
 * One-shot viewport config — use for the tokenization section where
 * the animation should only run once (it has its own phase state machine).
 */
export const onceViewport = { once: true, margin: "-60px 0px" } as const;
