"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

type EncoderSectionProps = {
  progress: MotionValue<number>;
};

const encoderLayers = [
  "Self-Attention",
  "Residual + Norm",
  "Feed Forward",
  "Context Memory",
];

export default function EncoderSection({ progress }: EncoderSectionProps) {
  const panelOpacity = useTransform(progress, [0.58, 0.62, 0.75, 0.79], [
    0,
    1,
    1,
    0,
  ]);
  const panelScale = useTransform(progress, [0.6, 0.75], [0.95, 1]);
  const panelY = useTransform(progress, [0.6, 0.75], [36, 0]);
  const visualX = useTransform(progress, [0.6, 0.75], [-40, 0]);
  const contentX = useTransform(progress, [0.6, 0.75], [40, 0]);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <motion.div
        style={{ opacity: panelOpacity, scale: panelScale, y: panelY }}
        className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <motion.div
          style={{ x: visualX }}
          className="glass-panel relative overflow-hidden px-6 py-8 md:px-8 md:py-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.16),transparent_34%)]" />
          <span className="glow-chip">Encoder Block</span>
          <h2 className="mt-4 text-2xl font-semibold text-white md:text-4xl">
            Deepen the representation.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
            Here the portfolio stops listing facts and starts interpreting them.
            The model asks what matters, what connects, and what it says about
            the builder behind the work.
          </p>

          <div className="mt-8 space-y-4">
            {encoderLayers.map((layer, index) => (
              <div
                key={layer}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-base font-medium text-white">{layer}</p>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-cyan-200">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
                    style={{ width: `${72 + index * 6}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ x: contentX }}
          className="glass-panel px-6 py-8 md:px-8 md:py-10"
        >
          <span className="glow-chip">Understand Me</span>
          <h3 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
            A higher-level summary emerges.
          </h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {portfolioData.insights.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="hud-label">{item.title}</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
