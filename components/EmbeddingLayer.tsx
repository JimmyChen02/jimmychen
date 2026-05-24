"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type EmbeddingLayerProps = {
  progress: MotionValue<number>;
};

const vectorLabels = [
  "Jimmy Chen",
  "Cornell CS",
  "AI/ML",
  "NLP",
  "Research",
  "Software",
];

const embedSlots = [
  [-180, -70],
  [0, -70],
  [180, -70],
  [-180, 70],
  [0, 70],
  [180, 70],
] as const;

type VectorNodeProps = {
  label: string;
  index: number;
  slot: (typeof embedSlots)[number];
  progress: MotionValue<number>;
};

function VectorNode({ label, index, slot, progress }: VectorNodeProps) {
  const start = 0.17 + index * 0.012;
  const opacity = useTransform(progress, [start, start + 0.05, 0.32], [0, 1, 1]);
  const scale = useTransform(progress, [0.15, 0.23, 0.3], [0.55, 1, 1.02]);
  const y = useTransform(progress, [0.15, 0.3], [slot[1] + 26, slot[1]]);
  const rotate = useTransform(progress, [0.15, 0.3], [-8 + index * 3, 0]);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        style={{ x: slot[0], y, opacity, scale, rotate }}
        className="flex h-24 w-28 flex-col justify-between rounded-[22px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/18 to-blue-500/12 p-3 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.12)]"
      >
        <span className="text-[0.55rem] uppercase tracking-[0.28em] text-cyan-200/70">
          vector
        </span>
        <p className="text-sm font-medium text-white">{label}</p>
        <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400" />
      </motion.div>
    </div>
  );
}

export default function EmbeddingLayer({ progress }: EmbeddingLayerProps) {
  const panelOpacity = useTransform(progress, [0.14, 0.18, 0.32, 0.36], [
    0,
    1,
    1,
    0,
  ]);
  const panelScale = useTransform(progress, [0.15, 0.3], [0.94, 1]);
  const panelY = useTransform(progress, [0.15, 0.3], [40, 0]);
  const haloOpacity = useTransform(progress, [0.15, 0.22, 0.3], [0, 0.75, 0.3]);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <motion.div
        style={{ opacity: panelOpacity, scale: panelScale, y: panelY }}
        className="glass-panel relative w-full max-w-5xl overflow-hidden px-6 py-8 md:px-10 md:py-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_55%)]" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="glow-chip">Embedding Layer</span>
            <h2 className="mt-4 text-2xl font-semibold text-white md:text-4xl">
              Raw tokens lift into semantic vectors.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
              The sequence is compressed into structured representations with
              enough signal to power every layer that follows.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs uppercase tracking-[0.24em] text-slate-400">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              latent space
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              signal boost
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              model ready
            </div>
          </div>
        </div>

        <div className="relative mt-8 h-[22rem] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/50 md:h-[24rem]">
          <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.6rem] uppercase tracking-[0.32em] text-slate-400">
            semantic encoding
          </div>
          <motion.div
            style={{ opacity: haloOpacity }}
            className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
          />

          {vectorLabels.map((label, index) => (
            <VectorNode
              key={label}
              label={label}
              index={index}
              slot={embedSlots[index]}
              progress={progress}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
