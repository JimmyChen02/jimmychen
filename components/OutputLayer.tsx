"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

type OutputLayerProps = {
  progress: MotionValue<number>;
};

type ActionButtonProps = {
  label: string;
  detail: string;
  href: string;
  index: number;
  progress: MotionValue<number>;
};

function ActionButton({
  label,
  detail,
  href,
  index,
  progress,
}: ActionButtonProps) {
  const start = 0.91 + index * 0.015;
  const revealEnd = Math.min(start + 0.04, 0.995);
  const opacity = useTransform(progress, [start, revealEnd, 1], [0, 1, 1]);
  const y = useTransform(progress, [start, revealEnd], [16, 0]);
  const scale = useTransform(progress, [start, revealEnd], [0.92, 1]);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ opacity, y, scale }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group rounded-[24px] border border-cyan-400/20 bg-white/[0.04] px-5 py-5 text-left backdrop-blur-xl transition-colors hover:border-cyan-300/40 hover:bg-cyan-400/10"
    >
      <p className="text-lg font-semibold text-white">{label}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.22em] text-cyan-200/75">
        Placeholder link
      </p>
      <div className="mt-4 h-px w-full origin-left scale-x-75 bg-gradient-to-r from-cyan-300/70 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
    </motion.a>
  );
}

export default function OutputLayer({ progress }: OutputLayerProps) {
  const panelOpacity = useTransform(progress, [0.88, 0.92, 1], [0, 1, 1]);
  const panelScale = useTransform(progress, [0.9, 1], [0.94, 1]);
  const panelY = useTransform(progress, [0.9, 1], [40, 0]);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <motion.div
        style={{ opacity: panelOpacity, scale: panelScale, y: panelY }}
        className="glass-panel relative w-full max-w-4xl overflow-hidden px-6 py-8 text-center md:px-10 md:py-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_top,rgba(168,85,247,0.1),transparent_30%)]" />
        <div className="relative">
          <span className="glow-chip">Output Layer</span>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            Final output: ready to connect.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            The model resolves into a clear call to action: explore the work,
            review the journey, and open a conversation about what to build
            next.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {portfolioData.ctaLinks.map((action, index) => (
              <ActionButton
                key={action.label}
                label={action.label}
                detail={action.detail}
                href={action.href}
                index={index}
                progress={progress}
              />
            ))}
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-slate-500">
            Mock CTA targets for the MVP. Swap in real links when ready.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
