"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Stage {
  id: string;
  label: string;
  shortLabel: string;
  color: "cyan" | "purple" | "teal" | "amber" | "blue";
}

export const STAGES: Stage[] = [
  { id: "hero", label: "Raw Input", shortLabel: "Input", color: "cyan" },
  { id: "tokenization", label: "Tokenization", shortLabel: "Token", color: "cyan" },
  { id: "embedding", label: "Embedding", shortLabel: "Embed", color: "purple" },
  { id: "encoder", label: "Encoder", shortLabel: "Enc", color: "teal" },
  { id: "attention", label: "Multi-Head Attention", shortLabel: "Attn", color: "amber" },
  { id: "feedforward", label: "Feed-Forward", shortLabel: "FFN", color: "amber" },
  { id: "decoder", label: "Decoder", shortLabel: "Dec", color: "purple" },
  { id: "softmax", label: "Softmax", shortLabel: "Soft", color: "cyan" },
  { id: "output", label: "Output", shortLabel: "Out", color: "cyan" },
];

const colorStyles: Record<Stage["color"], { dot: string; text: string; line: string; glow: string }> = {
  cyan: {
    dot: "bg-cyber-cyan",
    text: "text-cyber-cyan",
    line: "bg-cyber-cyan",
    glow: "shadow-glow-sm",
  },
  purple: {
    dot: "bg-cyber-purple",
    text: "text-cyber-purple",
    line: "bg-cyber-purple",
    glow: "shadow-glow-purple",
  },
  teal: {
    dot: "bg-teal-400",
    text: "text-teal-400",
    line: "bg-teal-400",
    glow: "",
  },
  amber: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    line: "bg-amber-400",
    glow: "",
  },
  blue: {
    dot: "bg-sky-400",
    text: "text-sky-400",
    line: "bg-sky-400",
    glow: "",
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
          isActive ? `${c.text} font-semibold` : isPast ? "text-white/40" : "text-white/20"
        )}
      >
        {stage.shortLabel}
      </span>
    </button>
  );
});

export default PipelineStageIndicator;
