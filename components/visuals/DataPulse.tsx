"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface DataPulseProps {
  /** Number of pulse dots flowing down the pipe */
  count?: number;
  /** Color class for the dot, e.g. "bg-cyber-cyan" */
  color?: string;
  /** Stagger delay multiplier between dots */
  staggerDelay?: number;
  className?: string;
}

/**
 * Animated dots flowing downward to represent data moving through the pipeline.
 * Each dot is absolutely positioned and offset by stagger to create a stream effect.
 */
function DataPulse({
  count = 3,
  color = "bg-cyber-cyan",
  staggerDelay = 0.6,
  className = "",
}: DataPulseProps) {
  return (
    <div
      className={`relative flex flex-col items-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${color} absolute`}
          style={{ top: 0 }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.8,
            ease: "linear",
            repeat: Infinity,
            delay: i * staggerDelay,
          }}
        />
      ))}
    </div>
  );
}

export default memo(DataPulse);
