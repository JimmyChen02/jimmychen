"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Stage {
  id: string;
  label: string;
  shortLabel: string;
  color: "orange" | "blue";
}

// Alternates orange/blue down the pipeline — matches the Knicks accent used
// inside each stage's own content, instead of a separate unrelated hue.
export const STAGES: Stage[] = [
  { id: "hero", label: "Raw Input", shortLabel: "Input", color: "orange" },
  { id: "tokenization", label: "Tokenization", shortLabel: "Token", color: "blue" },
  { id: "embedding", label: "Embedding", shortLabel: "Embed", color: "orange" },
  { id: "encoder", label: "Encoder", shortLabel: "Enc", color: "blue" },
  { id: "attention", label: "Multi-Head Attention", shortLabel: "Attn", color: "orange" },
  { id: "feedforward", label: "Feed-Forward", shortLabel: "FFN", color: "blue" },
  { id: "decoder", label: "Output", shortLabel: "Out", color: "orange" },
  { id: "output", label: "Generated", shortLabel: "Gen", color: "blue" },
];

const colorStyles: Record<Stage["color"], { dot: string; text: string; line: string; glow: string }> = {
  orange: {
    dot: "bg-knicks-orange",
    text: "text-knicks-orange",
    line: "bg-knicks-orange",
    glow: "shadow-glow-sm",
  },
  blue: {
    dot: "bg-knicks-blue",
    text: "text-knicks-blue",
    line: "bg-knicks-blue",
    glow: "shadow-glow-purple",
  },
};

interface PipelineStageProps {
  stage: Stage;
  isActive: boolean;
  isPast: boolean;
  onClick?: () => void;
}

export const PipelineStageIndicator = memo(function PipelineStageIndicator({
  stage,
  isActive,
  isPast,
  onClick,
}: PipelineStageProps) {
  const c = colorStyles[stage.color];

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full text-left group focus:outline-none"
      aria-label={`Go to ${stage.label} section`}
      aria-current={isActive ? "step" : undefined}
    >
      {/* Dot */}
      <motion.div
        className={cn(
          "w-2 h-2 rounded-full shrink-0 transition-all duration-300",
          isActive ? `${c.dot} ${c.glow}` : isPast ? "bg-white/30" : "bg-white/10"
        )}
        animate={isActive ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Label */}
      <span
        className={cn(
          "font-mono text-xs transition-all duration-300 truncate",
          isActive ? `${c.text} font-semibold` : isPast ? "text-white/40" : "text-white/45"
        )}
      >
        {stage.shortLabel}
      </span>
    </button>
  );
});

export default PipelineStageIndicator;
