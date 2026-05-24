"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

type InputTokensProps = {
  progress: MotionValue<number>;
};

const tokenPoses = [
  { start: [-320, -150], settle: [-250, -130], embed: [-180, -70] },
  { start: [0, -220], settle: [0, -175], embed: [0, -70] },
  { start: [320, -150], settle: [250, -130], embed: [180, -70] },
  { start: [-320, 120], settle: [-250, 105], embed: [-180, 70] },
  { start: [0, 220], settle: [0, 175], embed: [0, 70] },
  { start: [320, 120], settle: [250, 105], embed: [180, 70] },
] as const;

type AnimatedTokenProps = {
  label: string;
  index: number;
  progress: MotionValue<number>;
  pose: (typeof tokenPoses)[number];
};

function AnimatedToken({
  label,
  index,
  progress,
  pose,
}: AnimatedTokenProps) {
  const x = useTransform(progress, [0, 0.15, 0.3], [
    pose.start[0],
    pose.settle[0],
    pose.embed[0],
  ]);
  const y = useTransform(progress, [0, 0.15, 0.3], [
    pose.start[1],
    pose.settle[1],
    pose.embed[1],
  ]);
  const opacity = useTransform(progress, [0, 0.03, 0.18, 0.28, 0.3], [
    0.6,
    1,
    1,
    0.35,
    0,
  ]);
  const scale = useTransform(progress, [0, 0.04, 0.18, 0.3], [
    0.7,
    1,
    1,
    0.86,
  ]);
  const rotate = useTransform(progress, [0, 0.15, 0.3], [
    -6 + index * 2,
    0,
    0,
  ]);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        style={{ x, y, opacity, scale, rotate }}
        className="whitespace-nowrap rounded-full border border-cyan-400/25 bg-slate-900/75 px-4 py-3 text-sm font-medium tracking-wide text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-md"
      >
        [{label}]
      </motion.div>
    </div>
  );
}

export default function InputTokens({ progress }: InputTokensProps) {
  const panelOpacity = useTransform(progress, [0, 0.04, 0.16, 0.2], [1, 1, 1, 0]);
  const panelY = useTransform(progress, [0, 0.15], [28, 0]);
  const coreOpacity = useTransform(progress, [0, 0.12, 0.2], [0.32, 0.7, 0]);
  const coreScale = useTransform(progress, [0, 0.15], [0.92, 1.08]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-[16%] z-20 w-[min(90vw,36rem)] -translate-x-1/2">
        <motion.div
          style={{ opacity: panelOpacity, y: panelY }}
          className="glass-panel px-5 py-4 text-center"
        >
          <span className="glow-chip">Input Tokens</span>
          <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
            Identity enters the context window.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
            Personal signals appear as tokens before the network begins encoding
            them into something richer.
          </p>
        </motion.div>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          style={{ opacity: coreOpacity, scale: coreScale }}
          className="h-32 w-32 rounded-full border border-cyan-400/20 bg-cyan-400/10 blur-sm"
        />
      </div>

      <div className="relative mx-auto h-full w-full max-w-6xl">
        {portfolioData.tokens.map((token, index) => (
          <AnimatedToken
            key={token}
            label={token}
            index={index}
            pose={tokenPoses[index]}
            progress={progress}
          />
        ))}
      </div>
    </div>
  );
}
