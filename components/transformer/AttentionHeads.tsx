"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport, fadeUpVariants, staggerContainer } from "@/lib/animation";

const headColors: Record<string, { border: string; bg: string; text: string; dot: string; line: string }> = {
  // Knicks orange heads
  teal: {
    border: "border-knicks-orange/40",
    bg: "bg-knicks-orange/5 hover:bg-knicks-orange/10",
    text: "text-knicks-orange",
    dot: "bg-knicks-orange",
    line: "rgba(245,132,38,0.5)",
  },
  cyan: {
    border: "border-knicks-orange/40",
    bg: "bg-knicks-orange/5 hover:bg-knicks-orange/10",
    text: "text-knicks-orange",
    dot: "bg-knicks-orange",
    line: "rgba(245,132,38,0.5)",
  },
  // Knicks blue heads
  purple: {
    border: "border-knicks-blue/40",
    bg: "bg-knicks-blue/5 hover:bg-knicks-blue/10",
    text: "text-knicks-blue",
    dot: "bg-knicks-blue",
    line: "rgba(0,107,182,0.5)",
  },
  blue: {
    border: "border-knicks-blue/40",
    bg: "bg-knicks-blue/5 hover:bg-knicks-blue/10",
    text: "text-knicks-blue",
    dot: "bg-knicks-blue",
    line: "rgba(0,107,182,0.5)",
  },
};

function AttentionHeadCard({
  head,
  index,
}: {
  head: (typeof siteConfig.attentionHeads)[0];
  index: number;
}) {
  const c = headColors[head.color] ?? headColors.cyan;

  return (
    <motion.div
      className={`
        relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-default
        ${c.border} ${c.bg}
      `}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Head label */}
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className={`w-2 h-2 rounded-full ${c.dot}`}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
        />
        <span className={`font-mono text-xs uppercase tracking-widest ${c.text}`}>
          Head {index + 1} · {head.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed mb-4">
        {head.description}
      </p>

      {/* Attended tokens */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-white/25 font-mono text-xs mr-1">attends:</span>
        {head.tokens.map((token) => (
          <span
            key={token}
            className={`text-xs px-2 py-0.5 rounded border font-mono ${c.border} ${c.text} bg-white/3`}
          >
            {token}
          </span>
        ))}
      </div>

      {/* Animated attention lines */}
      <motion.div
        className="absolute top-2 right-3"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {[0, 60, 120].map((angle, i) => (
            <line
              key={i}
              x1="12"
              y1="12"
              x2={12 + 10 * Math.cos((angle * Math.PI) / 180)}
              y2={12 + 10 * Math.sin((angle * Math.PI) / 180)}
              stroke={c.line}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
          <circle cx="12" cy="12" r="2" fill={c.line} />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function AttentionHeads() {
  return (
    <section
      id="attention"
      className="relative min-h-screen px-6 flex flex-col items-center justify-center pt-24 pb-16"
      aria-label="Multi-head attention"
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
          What I Focus On
        </h2>
        <p className="text-white/40 font-mono text-sm max-w-md mx-auto">
          {siteConfig.attentionHeads.length} attention heads attending to different aspects
        </p>
      </motion.div>

      {/* Heads = num_heads diagram */}
      <motion.p
        className="font-mono text-xs text-white/20 mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={defaultViewport}
        transition={{ delay: 0.2 }}
      >
        MultiHeadAttention(Q, K, V, num_heads=4)
      </motion.p>

      {/* Attention heads grid */}
      <motion.div
        className="w-full max-w-3xl grid sm:grid-cols-2 gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        {siteConfig.attentionHeads.map((head, i) => (
          <AttentionHeadCard key={head.id} head={head} index={i} />
        ))}
      </motion.div>

      {/* Concat annotation */}
      <motion.div
        className="mt-10 font-mono text-xs text-white/20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={defaultViewport}
        transition={{ delay: 0.6 }}
      >
        concat(head_1, ..., head_4) → linear projection → attended_output
      </motion.div>
    </section>
  );
}

export default memo(AttentionHeads);
