"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { transformerStory } from "@/data/transformerStory";

type TransformerSceneProps = {
  progress: MotionValue<number>;
};

type ContentStage = {
  key:
    | "input"
    | "tokenizer"
    | "embedding"
    | "encoder"
    | "latent"
    | "decoder"
    | "softmax"
    | "output";
  label: string;
  range: string;
  start: number;
  end: number;
  headline: string;
  body: string;
};

type PipelineBlock = {
  label: string;
  short: string;
  top: string;
  start: number;
  end: number;
};

const contentStages: ContentStage[] = [
  {
    key: "input",
    label: "Input Sequence",
    range: "00% - 12%",
    start: 0,
    end: 0.12,
    headline: "You are the input sequence.",
    body: "The portfolio opens with you as the raw signal: name, focus, goals, and context entering the model.",
  },
  {
    key: "tokenizer",
    label: "Tokenizer",
    range: "12% - 24%",
    start: 0.12,
    end: 0.24,
    headline: "Identity gets broken into tokens.",
    body: "Signals like research, systems, product taste, and AI/ML become the units the model can reason about.",
  },
  {
    key: "embedding",
    label: "Embedding Projection",
    range: "24% - 36%",
    start: 0.24,
    end: 0.36,
    headline: "Tokens lift into dense vectors.",
    body: "Interests and experiences stop being isolated facts and become weighted capabilities with shared semantic meaning.",
  },
  {
    key: "encoder",
    label: "Encoder Stack",
    range: "36% - 56%",
    start: 0.36,
    end: 0.56,
    headline: "The encoder learns what matters most.",
    body: "Multiple encoder passes highlight how research, engineering, and product thinking reinforce one another.",
  },
  {
    key: "latent",
    label: "Latent State",
    range: "56% - 68%",
    start: 0.56,
    end: 0.68,
    headline: "A compressed representation emerges.",
    body: "The model now holds a summary vector of who you are, what you care about, and where your strongest signal lives.",
  },
  {
    key: "decoder",
    label: "Decoder Stack",
    range: "68% - 82%",
    start: 0.68,
    end: 0.82,
    headline: "The decoder turns identity into shipped work.",
    body: "Projects stream out as visible outputs from the internal representation: research prototypes, systems builds, and product experiments.",
  },
  {
    key: "softmax",
    label: "Softmax",
    range: "82% - 92%",
    start: 0.82,
    end: 0.92,
    headline: "The model assigns probability mass.",
    body: "The final distribution explains where the signal is strongest across roles, strengths, and portfolio themes.",
  },
  {
    key: "output",
    label: "Output Layer",
    range: "92% - 100%",
    start: 0.92,
    end: 1.01,
    headline: "The output layer resolves into action.",
    body: "Resume, links, and contact become the final decoded tokens ready for a real person to click.",
  },
] as const;

const pipelineBlocks: PipelineBlock[] = [
  { label: "Input Sequence", short: "IN", top: "8%", start: 0, end: 0.12 },
  { label: "Tokenizer", short: "TK", top: "17%", start: 0.12, end: 0.24 },
  { label: "Embedding", short: "EMB", top: "26%", start: 0.24, end: 0.36 },
  { label: "Encoder 01", short: "E1", top: "37%", start: 0.36, end: 0.43 },
  { label: "Encoder 02", short: "E2", top: "46%", start: 0.43, end: 0.5 },
  { label: "Encoder 03", short: "E3", top: "55%", start: 0.5, end: 0.56 },
  { label: "Latent State", short: "Z", top: "66%", start: 0.56, end: 0.68 },
  { label: "Decoder", short: "DEC", top: "77%", start: 0.68, end: 0.82 },
  { label: "Softmax", short: "SM", top: "88%", start: 0.82, end: 0.92 },
  { label: "Output", short: "OUT", top: "96%", start: 0.92, end: 1.01 },
] as const;

const networkDotsLeft = [
  { top: "14%", left: "8%" },
  { top: "24%", left: "18%" },
  { top: "38%", left: "12%" },
  { top: "54%", left: "16%" },
  { top: "70%", left: "10%" },
  { top: "84%", left: "18%" },
] as const;

const networkDotsRight = [
  { top: "16%", left: "82%" },
  { top: "28%", left: "90%" },
  { top: "42%", left: "85%" },
  { top: "58%", left: "91%" },
  { top: "74%", left: "84%" },
  { top: "88%", left: "89%" },
] as const;

function getActiveStage(progressValue: number) {
  return (
    contentStages.find(
      (stage) => progressValue >= stage.start && progressValue < stage.end,
    ) ?? contentStages[contentStages.length - 1]
  );
}

function getActiveBlockIndex(progressValue: number) {
  const index = pipelineBlocks.findIndex(
    (block) => progressValue >= block.start && progressValue < block.end,
  );

  return index === -1 ? pipelineBlocks.length - 1 : index;
}

function TokenOrbit({
  progress,
  index,
  label,
}: {
  progress: MotionValue<number>;
  index: number;
  label: string;
}) {
  const positions = [
    [-110, -72],
    [0, -116],
    [110, -72],
    [-118, 0],
    [118, 0],
    [-88, 76],
    [0, 112],
    [88, 76],
  ] as const;

  const target = positions[index] ?? [0, 0];
  const opacity = useTransform(progress, [0.1, 0.16, 0.24, 0.28], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.1, 0.18, 0.28], [0.7, 1, 0.9]);
  const x = useTransform(progress, [0.1, 0.18, 0.24, 0.28], [0, target[0], target[0], target[0] * 0.78]);
  const y = useTransform(progress, [0.1, 0.18, 0.24, 0.28], [0, target[1], target[1], target[1] * 0.78]);

  return (
    <motion.div
      style={{ opacity, scale, x, y }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
    >
      <div className="rounded-full border border-cyan-300/20 bg-slate-950/85 px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-cyan-100/90 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
        {label}
      </div>
    </motion.div>
  );
}

function VectorStrip({
  progress,
  index,
  label,
  strength,
}: {
  progress: MotionValue<number>;
  index: number;
  label: string;
  strength: number;
}) {
  const baseY = -120 + index * 46;
  const opacity = useTransform(progress, [0.23, 0.29, 0.36, 0.4], [0, 1, 1, 0]);
  const x = useTransform(progress, [0.23, 0.31, 0.4], [0, 160, 182]);
  const y = useTransform(progress, [0.23, 0.31], [0, baseY]);

  return (
    <motion.div
      style={{ opacity, x, y }}
      className="absolute left-1/2 top-1/2 w-44 -translate-y-1/2 transform-gpu will-change-transform"
    >
      <div className="rounded-[18px] border border-cyan-300/15 bg-slate-950/82 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-300">
            {label}
          </p>
          <p className="text-[0.72rem] text-cyan-200">
            {Math.round(strength * 100)}%
          </p>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400"
            style={{ width: `${strength * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function DecoderChip({
  progress,
  index,
  title,
}: {
  progress: MotionValue<number>;
  index: number;
  title: string;
}) {
  const xTargets = [130, 176, 160, 122];
  const yTargets = [-66, -10, 48, 106];
  const opacity = useTransform(progress, [0.68, 0.74, 0.82, 0.88], [0, 1, 1, 0]);
  const x = useTransform(progress, [0.68, 0.76, 0.82], [0, xTargets[index] ?? 140, (xTargets[index] ?? 140) + 8]);
  const y = useTransform(progress, [0.68, 0.76], [0, yTargets[index] ?? 0]);
  const scale = useTransform(progress, [0.68, 0.76, 0.82], [0.7, 1, 0.96]);

  return (
    <motion.div
      style={{ opacity, x, y, scale }}
      className="absolute left-1/2 top-1/2 w-40 transform-gpu will-change-transform"
    >
      <div className="rounded-[18px] border border-fuchsia-300/18 bg-slate-950/86 px-3 py-3 backdrop-blur-md">
        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-fuchsia-200/80">
          decoded
        </p>
        <p className="mt-2 text-sm font-medium leading-tight text-white">
          {title}
        </p>
      </div>
    </motion.div>
  );
}

function StageNarrative({ stage }: { stage: ContentStage }) {
  return (
    <motion.div
      key={stage.key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-panel px-6 py-6"
    >
      <p className="hud-label">Narrative</p>
      <p className="mt-4 text-[0.72rem] uppercase tracking-[0.3em] text-cyan-200/75">
        {stage.label}
      </p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
        {stage.headline}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-300">{stage.body}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {transformerStory.input.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
              {metric.label}
            </p>
            <p className="mt-2 text-sm text-slate-200">{metric.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StagePayload({ stage }: { stage: ContentStage }) {
  return (
    <motion.div
      key={stage.key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-panel px-6 py-6"
    >
      <p className="hud-label">Pipeline Payload</p>
      {stage.key === "input" ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-cyan-200/80">
              Raw profile vector
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              {transformerStory.input.role}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {transformerStory.input.tagline}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {transformerStory.input.subtext}
            </p>
          </div>
        </div>
      ) : null}

      {stage.key === "tokenizer" ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {transformerStory.tokens.map((token) => (
            <div
              key={token}
              className="rounded-full border border-cyan-300/18 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"
            >
              {token}
            </div>
          ))}
        </div>
      ) : null}

      {stage.key === "embedding" ? (
        <div className="mt-4 space-y-3">
          {transformerStory.vectors.map((vector) => (
            <div
              key={vector.label}
              className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">{vector.label}</p>
                <p className="text-sm text-cyan-200">
                  {Math.round(vector.strength * 100)}%
                </p>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400"
                  style={{ width: `${vector.strength * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {stage.key === "encoder" ? (
        <div className="mt-4 space-y-4">
          {transformerStory.encoderCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-cyan-200/75">
                {card.eyebrow}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {stage.key === "latent" ? (
        <div className="mt-4 space-y-4">
          {transformerStory.latentCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-fuchsia-200/75">
                {card.eyebrow}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {stage.key === "decoder" ? (
        <div className="mt-4 grid gap-4">
          {transformerStory.decoderProjects.map((project) => (
            <div
              key={project.title}
              className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-fuchsia-200/75">
                {project.eyebrow}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {project.body}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                {project.meta}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {stage.key === "softmax" ? (
        <div className="mt-4 space-y-4">
          {transformerStory.softmax.map((probability) => (
            <div
              key={probability.label}
              className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-white">
                    {probability.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {probability.detail}
                  </p>
                </div>
                <p className="text-sm text-cyan-200">
                  {(probability.value * 100).toFixed(0)}%
                </p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400"
                  style={{ width: `${probability.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {stage.key === "output" ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {transformerStory.outputs.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-[20px] border border-cyan-300/18 bg-white/[0.04] px-4 py-4 transition-colors hover:border-cyan-300/35 hover:bg-cyan-400/10"
            >
              <p className="text-base font-semibold text-white">{item.label}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </a>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

export default function TransformerScene({
  progress,
}: TransformerSceneProps) {
  const smoothProgress = useSpring(progress, {
    stiffness: 110,
    damping: 24,
    mass: 0.35,
  });
  const [currentProgress, setCurrentProgress] = useState(() => progress.get());

  useEffect(() => {
    setCurrentProgress(progress.get());
  }, [progress]);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    setCurrentProgress(latest);
  });

  const activeStage = getActiveStage(currentProgress);
  const activeBlockIndex = getActiveBlockIndex(currentProgress);

  const travelerTop = useTransform(smoothProgress, [0, 1], ["8%", "92%"]);
  const haloX = useTransform(smoothProgress, [0, 1], [-140, 120]);
  const haloY = useTransform(smoothProgress, [0, 1], [-80, 90]);
  const violetX = useTransform(smoothProgress, [0, 1], [90, -120]);
  const violetY = useTransform(smoothProgress, [0, 1], [60, -40]);
  const railGlowOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0.35, 0.75, 0.45]);
  const travelerScale = useTransform(
    smoothProgress,
    [0, 0.16, 0.56, 0.82, 1],
    [0.94, 1.04, 1, 1.02, 0.96],
  );
  const travelerRingOpacity = useTransform(
    smoothProgress,
    [0.78, 0.84, 0.92, 1],
    [0, 0.65, 1, 1],
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(2,6,23,0.82))]" />
      <motion.div
        style={{ x: haloX, y: haloY }}
        className="absolute left-[-14rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-cyan-500/14 blur-[130px]"
      />
      <motion.div
        style={{ x: violetX, y: violetY }}
        className="absolute bottom-[-14rem] right-[-14rem] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/12 blur-[150px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-fade bg-[length:72px_72px] opacity-[0.16]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_40%),radial-gradient(circle_at_82%_16%,rgba(167,139,250,0.08),transparent_24%)]" />

      <div className="absolute inset-x-4 top-4 z-30 flex items-start justify-between gap-4 md:inset-x-8 md:top-8">
        <div className="glass-panel max-w-sm px-5 py-4">
          <p className="hud-label">Vertical Transformer</p>
          <h1 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            {transformerStory.input.name}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300 md:text-base">
            Scroll through a neural pipeline where your profile is tokenized,
            encoded, decoded, and resolved into portfolio outputs.
          </p>
        </div>

        <div className="glass-panel hidden min-w-[16rem] px-5 py-4 md:block">
          <p className="hud-label">Active Layer</p>
          <p className="mt-3 text-base font-medium text-cyan-100">
            {activeStage.label}
          </p>
          <p className="mt-1 text-sm text-slate-400">{activeStage.range}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.26em] text-slate-500">
            Next.js + Framer Motion
            <br />
            GPU-first transforms
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto h-full w-full max-w-[1600px] px-4 pt-24 md:px-8 md:pt-28">
        <div className="relative h-[calc(100vh-10rem)]">
          <div className="absolute left-0 top-1/2 hidden w-[27rem] -translate-y-1/2 xl:block">
            <AnimatePresence mode="wait">
              <StageNarrative stage={activeStage} />
            </AnimatePresence>
          </div>

          <div className="absolute right-0 top-1/2 hidden w-[27rem] -translate-y-1/2 xl:block">
            <AnimatePresence mode="wait">
              <StagePayload stage={activeStage} />
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-0 top-0 mx-auto h-full w-full max-w-[26rem]">
            <svg
              viewBox="0 0 420 920"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-75"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="pipeline-gradient"
                  x1="50%"
                  y1="0%"
                  x2="50%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.22" />
                  <stop offset="55%" stopColor="#60a5fa" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient
                  id="network-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.18" />
                </linearGradient>
              </defs>

              <motion.path
                style={{ opacity: railGlowOpacity }}
                d="M210 70 L210 860"
                stroke="url(#pipeline-gradient)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {networkDotsLeft.map((dot, index) => (
                <path
                  key={`left-${dot.top}`}
                  d={`M${70 + (index % 2) * 18} ${140 + index * 118} C 120 ${144 + index * 118}, 154 ${150 + index * 88}, 210 ${160 + index * 78}`}
                  stroke="url(#network-gradient)"
                  strokeWidth="1.5"
                  fill="none"
                />
              ))}
              {networkDotsRight.map((dot, index) => (
                <path
                  key={`right-${dot.top}`}
                  d={`M${350 - (index % 2) * 20} ${152 + index * 110} C 308 ${160 + index * 110}, 270 ${170 + index * 88}, 210 ${184 + index * 78}`}
                  stroke="url(#network-gradient)"
                  strokeWidth="1.5"
                  fill="none"
                />
              ))}
            </svg>

            {networkDotsLeft.map((dot, index) => (
              <div
                key={`dot-left-${dot.top}`}
                style={{ top: dot.top, left: dot.left }}
                className="absolute h-2.5 w-2.5 rounded-full bg-cyan-300/60 shadow-[0_0_22px_rgba(103,232,249,0.55)] animate-pulse-slow"
              />
            ))}
            {networkDotsRight.map((dot, index) => (
              <div
                key={`dot-right-${dot.top}`}
                style={{ top: dot.top, left: dot.left }}
                className="absolute h-2.5 w-2.5 rounded-full bg-fuchsia-300/55 shadow-[0_0_22px_rgba(192,132,252,0.45)] animate-pulse-slow"
              />
            ))}

            {pipelineBlocks.map((block, index) => {
              const isActive = index === activeBlockIndex;
              const isProcessed = index < activeBlockIndex;

              return (
                <motion.div
                  key={block.label}
                  animate={{
                    opacity: isActive ? 1 : isProcessed ? 0.7 : 0.4,
                    scale: isActive ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                  style={{ top: block.top }}
                  className="absolute left-1/2 w-[12.5rem] -translate-x-1/2 transform-gpu"
                >
                  <div
                    className={[
                      "rounded-[22px] border px-4 py-3 text-center backdrop-blur-lg",
                      isActive
                        ? "border-cyan-300/30 bg-cyan-400/10 shadow-[0_0_44px_rgba(34,211,238,0.12)]"
                        : isProcessed
                          ? "border-blue-400/15 bg-blue-400/[0.05]"
                          : "border-white/10 bg-white/[0.03]",
                    ].join(" ")}
                  >
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-400">
                      {block.short}
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {block.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              style={{ top: travelerTop }}
              className="absolute left-1/2 z-20 -translate-x-1/2 transform-gpu will-change-transform"
            >
              <motion.div
                style={{ scale: travelerScale }}
                className="relative h-56 w-56"
              >
                {transformerStory.tokens.map((token, index) => (
                  <TokenOrbit
                    key={token}
                    progress={smoothProgress}
                    index={index}
                    label={token}
                  />
                ))}

                {transformerStory.vectors.map((vector, index) => (
                  <VectorStrip
                    key={vector.label}
                    progress={smoothProgress}
                    index={index}
                    label={vector.label}
                    strength={vector.strength}
                  />
                ))}

                {transformerStory.decoderProjects.map((project, index) => (
                  <DecoderChip
                    key={project.title}
                    progress={smoothProgress}
                    index={index}
                    title={project.title}
                  />
                ))}

                <motion.div
                  style={{ opacity: travelerRingOpacity }}
                  className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-300/20 shadow-[0_0_54px_rgba(192,132,252,0.12)]"
                />

                <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_65%)] blur-2xl" />

                <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/24 bg-slate-950/85 shadow-[0_0_36px_rgba(34,211,238,0.12)] backdrop-blur-xl">
                  <div className="text-center">
                    <p className="text-lg font-semibold tracking-[0.24em] text-white">
                      {transformerStory.input.initials}
                    </p>
                    <p className="mt-1 text-[0.58rem] uppercase tracking-[0.3em] text-cyan-200/75">
                      you
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-28 left-4 right-4 z-30 xl:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel px-5 py-4"
          >
            <p className="hud-label">{activeStage.label}</p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              {activeStage.headline}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {activeStage.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 w-[min(92vw,44rem)] -translate-x-1/2 md:bottom-8">
        <div className="glass-panel px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="hud-label">Scroll Progress</p>
              <p className="mt-1 text-sm text-slate-300">
                {Math.round(currentProgress * 100)
                  .toString()
                  .padStart(2, "0")}
                % processed
              </p>
            </div>
            <p className="text-right text-xs uppercase tracking-[0.28em] text-slate-500">
              vertical transformer
              <br />
              low-lag motion stack
            </p>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              style={{ scaleX: smoothProgress }}
              className="h-full origin-left rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
