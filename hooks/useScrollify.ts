"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollify — scrollify.js-style full-page scroll snapping.
 *
 * Behaviour:
 * - One wheel tick → advance to next / prev section.
 * - Snapping is DISABLED once the user scrolls past the "output" section
 *   (i.e. anything after the transformer pipeline becomes free-scroll).
 * - For sections taller than the viewport, natural in-section scroll is
 *   preserved; the hook only intercepts at the top/bottom boundary.
 * - A cooldown prevents rapid-fire section jumps.
 * - Touch swipe (mobile) is also supported.
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

const LAST_SNAP_INDEX = SECTION_IDS.length - 1; // "output" is the last snapped section

/** Tolerance in px — how close to a boundary counts as "at the edge" */
const EDGE_PX = 8;
/** Cooldown between snaps (ms) */
const COOLDOWN_MS = 800;
/**
 * Minimum wheel deltaY to register as intentional.
 * Kept low (4) so trackpad users don't need to scroll hard.
 */
const MIN_DELTA = 4;
/** Minimum vertical swipe distance to trigger on touch */
const MIN_SWIPE = 40;

// ─────────────────────────────────────────────────────────

function getActiveIndex(): number {
  const mid = window.innerHeight / 2;
  let best = 0;
  let bestDist = Infinity;

  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sectionMid = rect.top + rect.height / 2;
    const dist = Math.abs(sectionMid - mid);
    if (dist < bestDist) { bestDist = dist; best = i; }
  });

  return best;
}

/** True if the user has scrolled fully past the output section */
function isPastPipeline(): boolean {
  const outputEl = document.getElementById("output");
  if (!outputEl) return false;
  // output section's bottom is above the viewport → user has scrolled past it
  return outputEl.getBoundingClientRect().bottom < -EDGE_PX;
}

function scrollToSection(index: number) {
  const id = SECTION_IDS[Math.max(0, Math.min(index, LAST_SNAP_INDEX))];
  const el = document.getElementById(id);
  if (!el) return;
  // scroll-margin-top (64px navbar) is set in globals.css, so block:"start" is correct
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Returns true when the wheel/touch event should be intercepted.
 * - Never intercepts after the pipeline ends.
 * - For tall sections: only intercepts at their top/bottom edge.
 */
function shouldIntercept(delta: number): boolean {
  // Let the user scroll freely once past the output section
  if (isPastPipeline()) return false;

  const idx = getActiveIndex();

  // If on the last section and scrolling DOWN, don't intercept —
  // let the user drift naturally into the portfolio section below.
  if (idx === LAST_SNAP_INDEX && delta > 0) return false;

  const el = document.getElementById(SECTION_IDS[idx]);
  if (!el) return true;

  const rect = el.getBoundingClientRect();
  const tallerThanViewport = el.scrollHeight > window.innerHeight + EDGE_PX;

  // Short section → always snap
  if (!tallerThanViewport) return true;

  // Tall section → only snap at boundary
  if (delta > 0 && rect.bottom <= window.innerHeight + EDGE_PX) return true;
  if (delta < 0 && rect.top    >= -EDGE_PX)                      return true;
  return false;
}

// ─────────────────────────────────────────────────────────

export function useScrollify() {
  const cooldown    = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    // ── Wheel ──────────────────────────────────────────────
    function onWheel(e: WheelEvent) {
      if (cooldown.current) { e.preventDefault(); return; }
      if (Math.abs(e.deltaY) < MIN_DELTA) return;
      if (!shouldIntercept(e.deltaY)) return;

      e.preventDefault();
      cooldown.current = true;

      const current = getActiveIndex();
      const next = e.deltaY > 0
        ? Math.min(current + 1, LAST_SNAP_INDEX)
        : Math.max(current - 1, 0);

      scrollToSection(next);
      setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
    }

    // ── Touch ──────────────────────────────────────────────
    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      if (cooldown.current) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < MIN_SWIPE) return;
      if (!shouldIntercept(dy)) return;

      cooldown.current = true;
      const current = getActiveIndex();
      const next = dy > 0
        ? Math.min(current + 1, LAST_SNAP_INDEX)
        : Math.max(current - 1, 0);

      scrollToSection(next);
      setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
    }

    // ── Keyboard ──────────────────────────────────────────
    function onKeyDown(e: KeyboardEvent) {
      if (cooldown.current) return;
      if (isPastPipeline()) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown";
      const up   = e.key === "ArrowUp"   || e.key === "PageUp";
      if (!down && !up) return;

      e.preventDefault();
      cooldown.current = true;
      const current = getActiveIndex();
      const next = down
        ? Math.min(current + 1, LAST_SNAP_INDEX)
        : Math.max(current - 1, 0);

      scrollToSection(next);
      setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
    }

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true  });
    window.addEventListener("keydown",    onKeyDown);

    return () => {
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("keydown",    onKeyDown);
    };
  }, []);
}
