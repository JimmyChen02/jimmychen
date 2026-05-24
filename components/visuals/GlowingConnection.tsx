"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface GlowingConnectionProps {
  /** SVG path or line direction */
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
  color?: string;
  /** Whether to animate a traveling glow dot along the path */
  animated?: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * SVG-based glowing connection line used in attention head visualization.
 * Optionally animates a traveling light along the path.
 */
function GlowingConnection({
  x1 = 0,
  y1 = 0,
  x2 = 100,
  y2 = 100,
  width = 200,
  height = 200,
  color = "rgba(6, 182, 212, 0.6)",
  animated = true,
  strokeWidth = 1,
  className = "",
}: GlowingConnectionProps) {
  const pathD = `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;

  return (
    <svg
      width={width}
      height={height}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={0.4}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Glowing overlay */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 1}
        filter="url(#glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />

      {/* Traveling dot — animates along the cubic bezier path via cx/cy interpolation */}
      {animated && (
        <motion.circle
          r={3}
          fill={color}
          filter="url(#glow)"
          cx={x1}
          cy={y1}
          animate={{
            cx: [x1, (x1 + x2) / 2, x2],
            cy: [y1, (y1 + y2) / 2, y2],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      )}
    </svg>
  );
}

export default memo(GlowingConnection);
