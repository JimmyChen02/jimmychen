"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

type PositionalTimelineProps = {
  progress: MotionValue<number>;
};

type TimelineStepProps = {
  title: string;
  period: string;
  description: string;
  index: number;
  progress: MotionValue<number>;
};

function TimelineStep({
  title,
  period,
  description,
  index,
  progress,
}: TimelineStepProps) {
  const start = 0.31 + index * 0.03;
  const revealEnd = Math.min(start + 0.06, 0.46);
  const opacity = useTransform(progress, [start, revealEnd, 0.47], [0, 1, 1]);
  const x = useTransform(
    progress,
    [start, revealEnd],
    [index % 2 === 0 ? -40 : 40, 0],
  );
  const y = useTransform(progress, [start, revealEnd], [18, 0]);
  const isLeft = index % 2 === 0;

  const card = (
    <div className="glass-panel px-5 py-4">
      <p className="hud-label">{title}</p>
      <p className="mt-2 text-base font-semibold text-white md:text-lg">
        {title}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-cyan-200/75">
        {period}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        {description}
      </p>
    </div>
  );

  return (
    <motion.div style={{ opacity, x, y }} className="mb-8 md:mb-10">
      <div className="flex items-start gap-4 md:hidden">
        <div className="mt-6 h-4 w-4 shrink-0 rounded-full border border-cyan-300/70 bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)]" />
        <div className="flex-1">{card}</div>
      </div>

      <div className="hidden items-start gap-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className={isLeft ? "block pr-4" : "hidden"}>
          {isLeft ? card : null}
        </div>
        <div className="mx-auto mt-6 h-4 w-4 rounded-full border border-cyan-300/70 bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)]" />
        <div className={isLeft ? "hidden" : "block pl-4"}>
          {!isLeft ? card : null}
        </div>
      </div>
    </motion.div>
  );
}

export default function PositionalTimeline({
  progress,
}: PositionalTimelineProps) {
  const panelOpacity = useTransform(progress, [0.28, 0.32, 0.45, 0.49], [
    0,
    1,
    1,
    0,
  ]);
  const panelScale = useTransform(progress, [0.3, 0.45], [0.96, 1]);
  const panelY = useTransform(progress, [0.3, 0.45], [40, 0]);
  const lineScaleY = useTransform(progress, [0.31, 0.43], [0, 1]);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <motion.div
        style={{ opacity: panelOpacity, scale: panelScale, y: panelY }}
        className="glass-panel relative w-full max-w-5xl px-6 py-8 md:px-10 md:py-10"
      >
        <div className="max-w-2xl">
          <span className="glow-chip">Positional Encoding</span>
          <h2 className="mt-4 text-2xl font-semibold text-white md:text-4xl">
            Context becomes ordered experience.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
            A timeline gives each signal a place, turning scattered facts into
            a coherent path through background, coursework, research, and
            projects.
          </p>
        </div>

        <div className="relative mt-10 md:mt-12">
          <div className="absolute left-2 top-0 h-full w-px bg-white/10 md:left-1/2" />
          <motion.div
            style={{ scaleY: lineScaleY }}
            className="absolute left-2 top-0 h-full w-px origin-top bg-gradient-to-b from-cyan-300 via-blue-400 to-fuchsia-400 md:left-1/2"
          />

          <div className="space-y-2">
            {portfolioData.timeline.map((item, index) => (
              <TimelineStep
                key={item.title}
                title={item.title}
                period={item.period}
                description={item.description}
                index={index}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
