"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { motion, useAnimationControls } from "framer-motion";

/**
 * ContinuousPipe — pipe that connects sections without overlapping content.
 *
 * Design:
 *  - Pipe is drawn ONLY in the transition zones between sections
 *    (bottom padding of section[i] → just before heading of section[i+1]).
 *  - No pipe is drawn through section body content → no overlap.
 *  - Starts below the hero terminal (hero's bottom padding area).
 *  - 8 distinct right-angle winding shapes between sections.
 *  - One traveling glow streak restarts on every scroll (up or down).
 *  - Desktop only (hidden below 1024 px).
 */

const SECTION_IDS = [
  "hero",
  "tokenization",
  "embedding",
  "encoder",
  "attention",
  "feedforward",
  "decoder",
  "softmax",
  "output",
] as const;

const PIPE_W  = 10;   // stroke width of main pipe body
const STREAK  = 120;  // glow streak length in px
const PAD_TOP = 112;  // px below section top where the pipe arrives (just before heading)
const PAD_BOT = 112;  // px above section bottom where the pipe exits (into bottom padding)

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function offsetTopInMain(el: HTMLElement, main: HTMLElement): number {
  let top  = 0;
  let node: HTMLElement | null = el;
  while (node && node !== main) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * Build one winding segment from (cx, y0) to (cx, y1).
 * All bends are 90° — strictly horizontal or vertical L commands.
 */
function windingSegment(
  idx : number,
  y0  : number,
  y1  : number,
  cx  : number,
  vw  : number,
): string {
  const Rl = (f: number) => Math.min(vw - 36, cx + vw * f);
  const Ll = (f: number) => Math.max(36,       cx - vw * f);

  const q1  = Math.round(y0 + (y1 - y0) * 0.33);
  const q2  = Math.round(y0 + (y1 - y0) * 0.67);
  const mid = Math.round((y0 + y1) / 2);

  switch (idx % 8) {
    // 0 — wide right U
    case 0:
      return ` L ${Rl(0.40)} ${y0} L ${Rl(0.40)} ${y1} L ${cx} ${y1}`;

    // 1 — left step
    case 1:
      return ` L ${Ll(0.33)} ${y0} L ${Ll(0.33)} ${mid} L ${cx} ${mid} L ${cx} ${y1}`;

    // 2 — far right step
    case 2:
      return ` L ${Rl(0.44)} ${y0} L ${Rl(0.44)} ${mid} L ${cx} ${mid} L ${cx} ${y1}`;

    // 3 — S-bend right → left
    case 3:
      return (
        ` L ${Rl(0.38)} ${y0}` +
        ` L ${Rl(0.38)} ${q1}` +
        ` L ${Ll(0.28)} ${q1}` +
        ` L ${Ll(0.28)} ${q2}` +
        ` L ${cx} ${q2}` +
        ` L ${cx} ${y1}`
      );

    // 4 — S-bend left → right (mirror of 3)
    case 4:
      return (
        ` L ${Ll(0.38)} ${y0}` +
        ` L ${Ll(0.38)} ${q1}` +
        ` L ${Rl(0.28)} ${q1}` +
        ` L ${Rl(0.28)} ${q2}` +
        ` L ${cx} ${q2}` +
        ` L ${cx} ${y1}`
      );

    // 5 — wide left U
    case 5:
      return ` L ${Ll(0.42)} ${y0} L ${Ll(0.42)} ${y1} L ${cx} ${y1}`;

    // 6 — right-then-left double step
    case 6:
      return (
        ` L ${Rl(0.30)} ${y0}` +
        ` L ${Rl(0.30)} ${q1}` +
        ` L ${Ll(0.24)} ${q1}` +
        ` L ${Ll(0.24)} ${y1}` +
        ` L ${cx} ${y1}`
      );

    // 7 — narrow right bump
    default:
      return ` L ${Rl(0.20)} ${y0} L ${Rl(0.20)} ${y1} L ${cx} ${y1}`;
  }
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

function ContinuousPipe() {
  const [pathD, setPathD]   = useState("");
  const [svgH,  setSvgH]    = useState(10_000);
  const pathRef    = useRef<SVGPathElement>(null);
  const pathLenRef = useRef<number>(8_000);   // always-fresh path length for scroll handler
  const controls   = useAnimationControls();

  /** Immediately reset and replay the streak from the start of the path. */
  const restartStreak = useCallback((len: number) => {
    const cycle = len + STREAK;
    controls.stop();
    controls.set({ strokeDashoffset: STREAK });
    controls.start({
      strokeDashoffset: -cycle,
      transition: { duration: 14, ease: "linear" },
    });
  }, [controls]);

  function build() {
    const main = document.querySelector("main") as HTMLElement | null;
    if (!main) return;

    const vw    = window.innerWidth;
    const mainH = main.scrollHeight;

    if (vw < 1024) { setPathD(""); return; }
    setSvgH(mainH);

    const cx = Math.round(vw / 2);

    type Sect = { top: number; bottom: number; height: number; padTop: number; padBot: number };

    const sects = SECTION_IDS.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const top    = offsetTopInMain(el, main);
      const height = el.offsetHeight;
      // Clamp pads to 35 % of section height so the pipe never crosses the mid-point
      const padTop = Math.min(PAD_TOP, height * 0.35);
      const padBot = Math.min(PAD_BOT, height * 0.35);
      return { top, bottom: top + height, height, padTop, padBot };
    }).filter(Boolean) as Sect[];

    if (sects.length < 2) return;

    // ── Build path ──────────────────────────────────────
    //
    // The pipe is drawn ONLY in the inter-section transition zones:
    //   exit:  (cx, sects[i].bottom − padBot)    → bottom padding of section i
    //   entry: (cx, sects[i+1].top  + padTop)    → just before heading of section i+1
    //
    // Each gap produces one winding subpath (M … L … L …).
    // Multiple subpaths separated by M commands keep the path continuous for
    // the dashoffset animation: the glow streak travels each winding in order,
    // disappearing "inside" each section while it processes, then reappearing.

    const firstExit = sects[0].bottom - sects[0].padBot;
    let d = `M ${cx} ${firstExit}`;

    for (let i = 0; i < sects.length - 1; i++) {
      const exitY  = i === 0 ? firstExit : sects[i].bottom - sects[i].padBot;
      const entryY = sects[i + 1].top + sects[i + 1].padTop;

      if (i > 0) {
        // Jump (without drawing) to the exit point of section[i]
        d += ` M ${cx} ${exitY}`;
      }

      // Winding connector from exitY → entryY
      d += windingSegment(i, exitY, entryY, cx, vw);
    }

    setPathD(d);
  }

  // Build on mount (with two retries for lazy-loaded sections)
  useEffect(() => {
    const t1 = setTimeout(build, 400);
    const t2 = setTimeout(build, 2800);
    window.addEventListener("resize", build);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", build);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure path length and kick off initial animation
  useEffect(() => {
    if (pathRef.current && pathD) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) {
        pathLenRef.current = len;
        restartStreak(len);
      }
    }
  }, [pathD, restartStreak]);

  // Restart streak on every scroll event (up or down)
  // Uses pathLenRef (not state) so the closure is always fresh
  useEffect(() => {
    let busy = false;
    function onScroll() {
      if (busy) return;
      busy = true;
      requestAnimationFrame(() => {
        restartStreak(pathLenRef.current);
        // Short cooldown prevents rapid resets during a single smooth-scroll sequence
        setTimeout(() => { busy = false; }, 120);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [restartStreak]);

  if (!pathD) return null;

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none hidden lg:block"
      style={{ width: "100%", height: svgH, zIndex: 0 }}
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      <defs>
        {/* Soft glow around the whole pipe body */}
        <filter id="pipe-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Sharper, brighter glow for the traveling streak */}
        <filter id="streak-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark backdrop — makes pipe pop off the background */}
      <path
        d={pathD}
        stroke="rgba(0,20,35,0.85)"
        strokeWidth={PIPE_W + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Main pipe body with glow */}
      <path
        d={pathD}
        stroke="rgba(6,182,212,0.75)"
        strokeWidth={PIPE_W}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#pipe-glow)"
      />
      {/* Inner dark core — hollow / tubular look */}
      <path
        d={pathD}
        stroke="rgba(0,10,20,0.6)"
        strokeWidth={PIPE_W - 4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bright top-edge specular highlight */}
      <path
        d={pathD}
        stroke="rgba(150,240,255,0.35)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Invisible clone used only for getTotalLength() */}
      <path ref={pathRef} d={pathD} stroke="none" fill="none" />

      {/* Traveling glow streak */}
      <motion.path
        d={pathD}
        stroke="rgba(6,182,212,1)"
        strokeWidth={PIPE_W + 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${STREAK} 99999`}
        initial={{ strokeDashoffset: STREAK }}
        animate={controls}
        filter="url(#streak-glow)"
      />
    </svg>
  );
}

export default memo(ContinuousPipe);
