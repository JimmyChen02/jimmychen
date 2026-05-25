"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollify — reliable full-page scroll snapping.
 *
 * Design:
 * - Tracks current section index as a ref (not inferred from DOM each time).
 * - One wheel/swipe tick → next or prev section.
 * - Tall sections (taller than viewport) allow natural scroll inside them;
 *   snapping only fires at their top/bottom boundary.
 * - Releases completely once the user scrolls past the output section.
 * - Cooldown prevents rapid-fire jumps.
 */

const SECTION_IDS = [
  "hero",
  "tokenization",
  "embedding",
  "encoder",
  "attention",
  "feedforward",
  "decoder",
  "output",
] as const;

const LAST_IDX    = SECTION_IDS.length - 1;
const COOLDOWN_MS = 900;   // ms — matches smooth-scroll settle time
const MIN_DELTA   = 5;     // ignore tiny trackpad micro-scrolls
const MIN_SWIPE   = 40;    // px — minimum touch swipe distance
const EDGE_PX     = 48;    // px — boundary tolerance for tall sections

// ─────────────────────────────────────────────────────────────────────────────

function scrollToSection(index: number) {
  const id = SECTION_IDS[Math.max(0, Math.min(index, LAST_IDX))];
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Re-sync index ref to whichever section is most visible right now */
function computeActiveIndex(): number {
  const mid = window.innerHeight / 2;
  let best = 0;
  let bestDist = Infinity;
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Use top of section if it's taller than viewport (content starts at top)
    const anchor = r.height > window.innerHeight ? r.top + window.innerHeight / 2 : r.top + r.height / 2;
    const dist = Math.abs(anchor - mid);
    if (dist < bestDist) { bestDist = dist; best = i; }
  });
  return best;
}


// ─────────────────────────────────────────────────────────────────────────────

export function useScrollify() {
  const cooldown    = useRef(false);
  const idxRef      = useRef(0);          // tracked section index
  const touchStartY = useRef(0);

  useEffect(() => {
    // Sync idxRef on every scroll so tall-section natural scrolling keeps it current
    function syncIdx() {
      idxRef.current = computeActiveIndex();
    }
    window.addEventListener("scroll", syncIdx, { passive: true });

    // ── Shared snap logic ──────────────────────────────────
    function isPastPipeline(): boolean {
      const el = document.getElementById("output");
      if (!el) return false;
      return el.getBoundingClientRect().bottom < 0;
    }

    function trySnap(delta: number) {
      if (cooldown.current) return;
      if (isPastPipeline()) return;

      // Re-entering the pipeline from below (scrolling up from portfolio):
      // output section is partially above viewport → snap to it first
      if (delta < 0) {
        const outputEl = document.getElementById("output");
        if (outputEl) {
          const r = outputEl.getBoundingClientRect();
          if (r.top < 0 && r.bottom >= 0) {
            cooldown.current = true;
            idxRef.current = LAST_IDX;
            scrollToSection(LAST_IDX);
            setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
            return;
          }
        }
      }

      syncIdx();
      const idx = idxRef.current;

      // At last section scrolling down → release into portfolio
      if (idx === LAST_IDX && delta > 0) return;

      const el = document.getElementById(SECTION_IDS[idx]);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const tall = el.scrollHeight > window.innerHeight + EDGE_PX;

      if (tall) {
        // Inside a tall section — only snap at the boundary
        const atBottom = delta > 0 && rect.bottom <= window.innerHeight + EDGE_PX;
        const atTop    = delta < 0 && rect.top    >= -EDGE_PX;
        if (!atBottom && !atTop) return;
      }

      // Fire snap
      cooldown.current = true;
      const next = delta > 0
        ? Math.min(idx + 1, LAST_IDX)
        : Math.max(idx - 1, 0);
      idxRef.current = next;
      scrollToSection(next);
      setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
    }

    // ── Wheel ──────────────────────────────────────────────
    function onWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) < MIN_DELTA) return;
      if (isPastPipeline()) return;

      syncIdx();
      const idx = idxRef.current;
      const el  = document.getElementById(SECTION_IDS[idx]);
      const rect = el?.getBoundingClientRect();
      const tall = el ? el.scrollHeight > window.innerHeight + EDGE_PX : false;

      // Inside a tall section and not at boundary → let browser scroll naturally
      if (tall && rect) {
        const atBottom = e.deltaY > 0 && rect.bottom <= window.innerHeight + EDGE_PX;
        const atTop    = e.deltaY < 0 && rect.top    >= -EDGE_PX;
        if (!atBottom && !atTop) return; // don't intercept
      }

      if (idx === LAST_IDX && e.deltaY > 0) return; // release at end

      e.preventDefault();
      trySnap(e.deltaY);
    }

    // ── Touch ──────────────────────────────────────────────
    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < MIN_SWIPE) return;
      trySnap(dy);
    }

    // ── Keyboard ──────────────────────────────────────────
    function onKeyDown(e: KeyboardEvent) {
      const down = e.key === "ArrowDown" || e.key === "PageDown";
      const up   = e.key === "ArrowUp"   || e.key === "PageUp";
      if (!down && !up) return;
      e.preventDefault();
      trySnap(down ? 1 : -1);
    }

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true  });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true  });
    window.addEventListener("keydown",    onKeyDown);

    return () => {
      window.removeEventListener("scroll",     syncIdx);
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("keydown",    onKeyDown);
    };
  }, []);
}
