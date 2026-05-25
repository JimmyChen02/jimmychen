"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STAGES, PipelineStageIndicator } from "./PipelineStage";

const MIN_DESKTOP_WIDTH = 1024;
const HERO_VISIBILITY_THRESHOLD = 0.78;
const PIPELINE_EXIT_THRESHOLD = 0.32;

function getMostVisibleStageId() {
  const viewportHeight = window.innerHeight;
  let bestId = STAGES[0]?.id ?? "hero";
  let bestVisible = -1;
  let bestTopDist = Number.POSITIVE_INFINITY;

  for (const stage of STAGES) {
    const el = document.getElementById(stage.id);
    if (!el) {
      continue;
    }

    const rect = el.getBoundingClientRect();
    const visible = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
    );
    const topDist = Math.abs(rect.top);

    if (visible > bestVisible || (visible === bestVisible && topDist < bestTopDist)) {
      bestVisible = visible;
      bestTopDist = topDist;
      bestId = stage.id;
    }
  }

  return bestId;
}

function shouldShowPipeline() {
  if (window.innerWidth < MIN_DESKTOP_WIDTH) {
    return false;
  }

  const main = document.querySelector("main");
  const hero = document.getElementById("hero");
  const output = document.getElementById("output");

  if (!(main instanceof HTMLElement) || !(hero instanceof HTMLElement) || !(output instanceof HTMLElement)) {
    return false;
  }

  const viewportHeight = window.innerHeight;
  const mainRect = main.getBoundingClientRect();
  const heroRect = hero.getBoundingClientRect();
  const outputRect = output.getBoundingClientRect();

  return (
    heroRect.bottom < viewportHeight * HERO_VISIBILITY_THRESHOLD &&
    mainRect.bottom > viewportHeight * PIPELINE_EXIT_THRESHOLD &&
    outputRect.bottom > viewportHeight * PIPELINE_EXIT_THRESHOLD
  );
}

/**
 * Sticky vertical pipeline sidebar.
 * Tracks the most-visible transformer stage and hides cleanly once the
 * user exits the transformer sequence into the portfolio sections below.
 */
function VerticalPipeline() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setActiveId(getMostVisibleStageId());
        setVisible(shouldShowPipeline());
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleStageClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const activeIndex = STAGES.findIndex((stage) => stage.id === activeId);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-start gap-1 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          aria-label="Transformer pipeline navigation"
        >
          <p className="font-mono text-xs text-white/20 uppercase tracking-widest mb-3 ml-3">
            Pipeline
          </p>

          {STAGES.map((stage, index) => (
            <div key={stage.id} className="flex items-center gap-0">
              <div className="flex flex-col items-center mr-1">
                {index > 0 && (
                  <div
                    className={`w-px h-3 transition-colors duration-300 ${
                      index <= activeIndex ? "bg-cyber-cyan/40" : "bg-white/8"
                    }`}
                  />
                )}
              </div>

              <PipelineStageIndicator
                stage={stage}
                isActive={activeId === stage.id}
                isPast={index < activeIndex}
                onClick={() => handleStageClick(stage.id)}
              />
            </div>
          ))}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default memo(VerticalPipeline);
