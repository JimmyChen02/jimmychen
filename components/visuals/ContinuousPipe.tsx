"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { motion, useAnimationControls } from "framer-motion";

/**
 * ContinuousPipe — glowing pipe connecting every transformer section.
 *
 * Two SVG path strings are built from the same section data:
 *
 *  windingD  — M-subpath windings ONLY (no spine through section bodies).
 *              Used for the static bright pipe body rendering.
 *              Section content never overlaps it.
 *
 *  animD     — One unbroken path: short spine stubs at each section boundary
 *              stitched together by the winding connectors.
 *              Used exclusively for the dashoffset streak animation.
 *              SVG only resets stroke-dasharray per subpath, so a single
 *              continuous path is required for ONE sequential glow streak.
 *
 * Desktop only (hidden below 1024 px).
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

const PIPE_W = 10;
const STREAK = 140;   // glow streak length in px along path
const STUB   = 110;   // px the spine dips into each section before winding

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
 * Winding connector from (cx, y0) to (cx, y1).
 * 8 distinct right-angle shapes (all-L commands, no curves).
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
    case 0: return ` L ${Rl(0.40)} ${y0} L ${Rl(0.40)} ${y1} L ${cx} ${y1}`;
    case 1: return ` L ${Ll(0.33)} ${y0} L ${Ll(0.33)} ${mid} L ${cx} ${mid} L ${cx} ${y1}`;
    case 2: return ` L ${Rl(0.44)} ${y0} L ${Rl(0.44)} ${mid} L ${cx} ${mid} L ${cx} ${y1}`;
    case 3:
      return (
        ` L ${Rl(0.38)} ${y0}` +
        ` L ${Rl(0.38)} ${q1}` +
        ` L ${Ll(0.28)} ${q1}` +
        ` L ${Ll(0.28)} ${q2}` +
        ` L ${cx} ${q2}` +
        ` L ${cx} ${y1}`
      );
    case 4:
      return (
        ` L ${Ll(0.38)} ${y0}` +
        ` L ${Ll(0.38)} ${q1}` +
        ` L ${Rl(0.28)} ${q1}` +
        ` L ${Rl(0.28)} ${q2}` +
        ` L ${cx} ${q2}` +
        ` L ${cx} ${y1}`
      );
    case 5: return ` L ${Ll(0.42)} ${y0} L ${Ll(0.42)} ${y1} L ${cx} ${y1}`;
    case 6:
      return (
        ` L ${Rl(0.30)} ${y0}` +
        ` L ${Rl(0.30)} ${q1}` +
        ` L ${Ll(0.24)} ${q1}` +
        ` L ${Ll(0.24)} ${y1}` +
        ` L ${cx} ${y1}`
      );
    default:
      return ` L ${Rl(0.20)} ${y0} L ${Rl(0.20)} ${y1} L ${cx} ${y1}`;
  }
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

function ContinuousPipe() {
  // windingD: pipe body (M-subpaths, windings only — no section overlap)
  const [windingD, setWindingD] = useState("");
  // animD: single continuous path for streak animation (no M jumps)
  const [animD,    setAnimD]    = useState("");
  const [svgH,     setSvgH]     = useState(10_000);

  const animRef    = useRef<SVGPathElement>(null); // on animD for getTotalLength()
  const pathLenRef = useRef<number>(8_000);
  const controls   = useAnimationControls();

  const restartStreak = useCallback((len: number) => {
    // controls.set() immediately overrides any in-progress animation;
    // no need for controls.stop() (not available in all FM versions).
    controls.set({ strokeDashoffset: STREAK });
    controls.start({
      strokeDashoffset: -(len + STREAK),
      transition: { duration: 16, ease: "linear" },
    });
  }, [controls]);

  function build() {
    const main = document.querySelector("main") as HTMLElement | null;
    if (!main) return;

    const vw    = window.innerWidth;
    const mainH = main.scrollHeight;
    if (vw < 1024) { setWindingD(""); setAnimD(""); return; }
    setSvgH(mainH);

    const cx = Math.round(vw / 2);

    const sects = SECTION_IDS.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const top    = offsetTopInMain(el, main);
      const height = el.offsetHeight;
      const stub   = Math.min(STUB, height * 0.4);
      return { top, bottom: top + height, stub };
    }).filter(Boolean) as { top: number; bottom: number; stub: number }[];

    if (sects.length < 2) return;

    // ── windingD: M-subpath winding connectors only ─────────────────────
    // Pipe body is visible ONLY in the ~220 px padding gap between sections.
    // No line through section content → no overlap with headings or cards.
    let wd = "";
    for (let i = 0; i < sects.length - 1; i++) {
      const exitY  = sects[i].bottom  - sects[i].stub;
      const entryY = sects[i + 1].top + sects[i + 1].stub;
      wd += ` M ${cx} ${exitY}`;
      wd += windingSegment(i, exitY, entryY, cx, vw);
    }

    // ── animD: one unbroken path for the streak ──────────────────────────
    // Windings are stitched together with short vertical stubs that cross
    // the section bodies. Only the 140 px dash is ever visible (the 99999 px
    // gap hides the rest), so the stubs are invisible in practice — the streak
    // simply disappears inside each section and re-emerges at the next winding.
    //
    // One continuous subpath → stroke-dasharray is never reset → exactly one
    // sequential streak travels the full page.
    let ad = `M ${cx} ${sects[0].bottom - sects[0].stub}`;

    for (let i = 0; i < sects.length - 1; i++) {
      const exitY  = sects[i].bottom  - sects[i].stub;
      const entryY = sects[i + 1].top + sects[i + 1].stub;

      // If not the first winding, we are currently at the previous entryY.
      // Drop a vertical stub down to this winding's exitY (stays in padding).
      if (i > 0) {
        ad += ` L ${cx} ${exitY}`;
      }

      // Winding connector (ends at cx, entryY)
      ad += windingSegment(i, exitY, entryY, cx, vw);
    }

    setWindingD(wd.trim());
    setAnimD(ad.trim());
  }

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

  useEffect(() => {
    if (animRef.current && animD) {
      const len = animRef.current.getTotalLength();
      if (len > 0) {
        pathLenRef.current = len;
        restartStreak(len);
      }
    }
  }, [animD, restartStreak]);

  useEffect(() => {
    let busy = false;
    function onScroll() {
      if (busy) return;
      busy = true;
      requestAnimationFrame(() => {
        restartStreak(pathLenRef.current);
        setTimeout(() => { busy = false; }, 150);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [restartStreak]);

  if (!windingD) return null;

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none hidden lg:block"
      style={{ width: "100%", height: svgH, zIndex: 0 }}
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      <defs>
        <filter id="pipe-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="streak-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Static pipe body — winding zones only ───────────────────── */}
      <path d={windingD} stroke="rgba(0,20,35,0.9)"     strokeWidth={PIPE_W + 8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={windingD} stroke="rgba(6,182,212,0.75)"  strokeWidth={PIPE_W}     strokeLinecap="round" strokeLinejoin="round" filter="url(#pipe-glow)" />
      <path d={windingD} stroke="rgba(0,10,20,0.6)"     strokeWidth={PIPE_W - 4} strokeLinecap="round" strokeLinejoin="round" />
      <path d={windingD} stroke="rgba(150,240,255,0.35)" strokeWidth={2}          strokeLinecap="round" strokeLinejoin="round" />

      {/* ── Invisible animD clone — for getTotalLength() ─────────────── */}
      <path ref={animRef} d={animD} stroke="none" fill="none" />

      {/* ── Traveling glow streak — runs on the continuous animD path ── */}
      <motion.path
        d={animD}
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
