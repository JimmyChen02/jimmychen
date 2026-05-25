"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { softmaxRanking } from "@/data/project-overrides";
import { defaultViewport, fadeUpVariants } from "@/lib/animation";

const SCORE_DIMENSIONS = ["AI/ML Fit", "Systems Depth", "Product Polish", "Research Impact"] as const;

const dimColors: Record<string, string> = {
  "AI/ML Fit": "bg-[#60a5fa]",
  "Systems Depth": "bg-[#34d399]",
  "Product Polish": "bg-[#f472b6]",
  "Research Impact": "bg-[#22d3ee]",
};

function ScoreBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  const colorClass = dimColors[label] ?? "bg-[#7dd3fc]";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/35 font-mono w-28 text-right shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colorClass} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value * 100}%` }}
          viewport={defaultViewport}
          transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-xs font-mono text-white/40 w-8 shrink-0">
        {value.toFixed(2)}
      </span>
    </div>
  );
}

function RankingRow({
  item,
  rank,
}: {
  item: (typeof softmaxRanking)[0];
  rank: number;
}) {
  return (
    <motion.div
      className="p-5 rounded-xl border border-white/6 bg-white/2 hover:border-white/16 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={defaultViewport}
      transition={{ delay: rank * 0.1, duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/20">#{rank + 1}</span>
          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
        </div>
        {/* Overall probability */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-mono">p =</span>
          <motion.span
            className="font-mono text-sm font-bold text-[#7dd3fc]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
            transition={{ delay: rank * 0.1 + 0.3 }}
          >
            {item.overallScore.toFixed(2)}
          </motion.span>
        </div>
      </div>

      {/* Overall bar */}
      <div className="mb-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#7dd3fc] rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${item.overallScore * 100}%` }}
          viewport={defaultViewport}
          transition={{ duration: 0.9, delay: rank * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Per-dimension bars */}
      <div className="space-y-2">
        {SCORE_DIMENSIONS.map((dim, i) => (
          <ScoreBar
            key={dim}
            label={dim}
            value={item.scores[dim] ?? 0}
            delay={rank * 0.1 + i * 0.07 + 0.15}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SoftmaxRanking() {
  return (
    <section
      id="softmax"
      className="relative min-h-screen px-6 flex flex-col items-center justify-center pt-24 pb-16"
      aria-label="Softmax ranking"
    >
      {/* Stage header */}
      <motion.div
        className="text-center mb-6"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Best Matches
        </h2>
        <p className="text-white/40 font-mono text-sm max-w-md mx-auto">
          softmax(scores) → probability distribution over projects
        </p>
      </motion.div>

      {/* Rankings */}
      <div className="w-full max-w-2xl space-y-4">
        {softmaxRanking.map((item, i) => (
          <RankingRow key={item.slug} item={item} rank={i} />
        ))}
      </div>
    </section>
  );
}

export default memo(SoftmaxRanking);
