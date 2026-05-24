"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

type AttentionHeadsProps = {
  progress: MotionValue<number>;
};

const heads = [
  {
    ...portfolioData.attentionHeads[0],
    className: "left-6 top-6 w-[15rem] xl:left-10 xl:w-[17rem]",
    path: "M600 350 C 500 320, 360 240, 220 150",
  },
  {
    ...portfolioData.attentionHeads[1],
    className: "right-6 top-6 w-[15rem] text-right xl:right-10 xl:w-[17rem]",
    path: "M600 350 C 700 320, 840 240, 980 150",
  },
  {
    ...portfolioData.attentionHeads[2],
    className: "left-6 bottom-6 w-[15rem] xl:left-10 xl:w-[17rem]",
    path: "M600 350 C 500 390, 360 470, 220 560",
  },
  {
    ...portfolioData.attentionHeads[3],
    className: "right-6 bottom-6 w-[15rem] text-right xl:right-10 xl:w-[17rem]",
    path: "M600 350 C 700 390, 840 470, 980 560",
  },
];

type HeadCardProps = {
  title: string;
  description: string;
  signal: string;
  className: string;
  index: number;
  progress: MotionValue<number>;
};

function HeadCard({
  title,
  description,
  signal,
  className,
  index,
  progress,
}: HeadCardProps) {
  const start = 0.47 + index * 0.02;
  const opacity = useTransform(progress, [start, start + 0.06, 0.61], [0, 1, 1]);
  const scale = useTransform(progress, [start, start + 0.06], [0.84, 1]);
  const y = useTransform(progress, [start, start + 0.06], [18, 0]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className={`glass-panel absolute px-5 py-4 ${className}`}
    >
      <p className="hud-label">{title}</p>
      <p className="mt-2 text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        {description}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.24em] text-cyan-200/80">
        Signal: {signal}
      </p>
    </motion.div>
  );
}

export default function AttentionHeads({ progress }: AttentionHeadsProps) {
  const panelOpacity = useTransform(progress, [0.44, 0.48, 0.6, 0.64], [
    0,
    1,
    1,
    0,
  ]);
  const panelScale = useTransform(progress, [0.45, 0.6], [0.96, 1]);
  const panelY = useTransform(progress, [0.45, 0.6], [36, 0]);
  const lineProgress = useTransform(progress, [0.47, 0.56], [0, 1]);
  const coreScale = useTransform(progress, [0.45, 0.6], [0.82, 1.06]);
  const coreOpacity = useTransform(progress, [0.45, 0.5, 0.6], [0, 1, 0.9]);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <motion.div
        style={{ opacity: panelOpacity, scale: panelScale, y: panelY }}
        className="glass-panel w-full max-w-6xl px-6 py-8 md:px-8 md:py-10"
      >
        <div className="max-w-2xl">
          <span className="glow-chip">Multi-Head Attention</span>
          <h2 className="mt-4 text-2xl font-semibold text-white md:text-4xl">
            Four attention heads route the strongest signals.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
            Different views of the same sequence light up in parallel, each one
            emphasizing a different dimension of work and identity.
          </p>
        </div>

        <div className="relative mt-10 hidden h-[34rem] md:block">
          <svg
            viewBox="0 0 1200 700"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {heads.map((head) => (
              <motion.path
                key={head.title}
                d={head.path}
                style={{ pathLength: lineProgress }}
                fill="none"
                stroke="url(#attention-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-[0_0_18px_rgba(34,211,238,0.8)]"
              />
            ))}
            <defs>
              <linearGradient
                id="attention-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="55%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              style={{ scale: coreScale, opacity: coreOpacity }}
              className="flex h-40 w-40 flex-col items-center justify-center rounded-full border border-cyan-300/30 bg-slate-900/85 shadow-neon backdrop-blur-xl"
            >
              <span className="hud-label">Core Query</span>
              <p className="mt-2 text-center text-lg font-semibold text-white">
                {portfolioData.attentionQuery.split(" ").map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
              </p>
            </motion.div>
          </div>

          {heads.map((head, index) => (
            <HeadCard
              key={head.title}
              title={head.title}
              description={head.description}
              signal={head.signal}
              className={head.className}
              index={index}
              progress={progress}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:hidden">
          {heads.map((head) => (
            <div key={head.title} className="glass-panel px-5 py-4">
              <p className="hud-label">{head.title}</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {head.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {head.description}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-cyan-200/80">
                Signal: {head.signal}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
