"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STAGES, PipelineStageIndicator } from "./PipelineStage";

/**
 * Sticky vertical pipeline sidebar.
 * Tracks which section is in view using IntersectionObserver and highlights
 * the active stage. Collapses on mobile (shows only on md+ screens).
 */
function VerticalPipeline() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [visible, setVisible] = useState(false);

  // Show pipeline only after user scrolls past hero
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer to track active section
  useEffect(() => {
    const sectionIds = STAGES.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleStageClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const activeIndex = STAGES.findIndex((s) => s.id === activeId);

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
          {/* Title */}
          <p className="font-mono text-xs text-white/20 uppercase tracking-widest mb-3 ml-3">
            Pipeline
          </p>

          {/* Stages list */}
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex items-center gap-0">
              <div className="flex flex-col items-center mr-1">
                {/* Connecting line above */}
                {i > 0 && (
                  <div
                    className={`w-px h-3 transition-colors duration-300 ${
                      i <= activeIndex ? "bg-white/30" : "bg-white/8"
                    }`}
                  />
                )}
              </div>

              <PipelineStageIndicator
                stage={stage}
                isActive={activeId === stage.id}
                isPast={i < activeIndex}
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
