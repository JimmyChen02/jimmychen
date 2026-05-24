"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { projects } from "@/data/projects";

type DecoderProjectsProps = {
  progress: MotionValue<number>;
};

type ProjectCardProps = {
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  outcome: string;
  index: number;
  progress: MotionValue<number>;
};

function ProjectCard({
  title,
  subtitle,
  summary,
  tags,
  outcome,
  index,
  progress,
}: ProjectCardProps) {
  const start = 0.77 + index * 0.018;
  const opacity = useTransform(progress, [start, start + 0.06, 0.92], [0, 1, 1]);
  const x = useTransform(progress, [0.75, 0.9], [68 - index * 8, 0]);
  const y = useTransform(progress, [start, start + 0.06], [18, 0]);
  const scale = useTransform(progress, [start, start + 0.06], [0.9, 1]);

  return (
    <motion.article
      style={{ opacity, x, y, scale }}
      className={`glass-panel px-5 py-5 ${
        index === 0 ? "sm:col-span-2" : ""
      }`}
    >
      <p className="hud-label">Generated Project</p>
      <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-cyan-200/75">
        {subtitle}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-400">Placeholder outcome: {outcome}</p>
    </motion.article>
  );
}

export default function DecoderProjects({ progress }: DecoderProjectsProps) {
  const panelOpacity = useTransform(progress, [0.73, 0.77, 0.9, 0.94], [
    0,
    1,
    1,
    0,
  ]);
  const panelScale = useTransform(progress, [0.75, 0.9], [0.95, 1]);
  const panelY = useTransform(progress, [0.75, 0.9], [40, 0]);
  const visualScale = useTransform(progress, [0.75, 0.9], [0.88, 1.04]);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <motion.div
        style={{ opacity: panelOpacity, scale: panelScale, y: panelY }}
        className="grid w-full max-w-6xl gap-6 xl:grid-cols-[0.8fr_1.2fr]"
      >
        <div className="glass-panel relative overflow-hidden px-6 py-8 md:px-8 md:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(168,85,247,0.18),transparent_30%)]" />
          <span className="glow-chip">Decoder Block</span>
          <h2 className="mt-4 text-2xl font-semibold text-white md:text-4xl">
            Context turns back into output.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
            The decoded portfolio emits concrete work: research prototypes,
            systems projects, and product experiments that carry the earlier
            layers into visible results.
          </p>

          <div className="relative mt-10 h-64 rounded-[28px] border border-white/10 bg-slate-950/50">
            <div className="absolute left-8 top-1/2 -translate-y-1/2">
              <motion.div
                style={{ scale: visualScale }}
                className="flex h-28 w-28 items-center justify-center rounded-[28px] border border-fuchsia-400/30 bg-fuchsia-400/10 shadow-[0_0_36px_rgba(192,132,252,0.18)]"
              >
                <span className="text-center text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-100">
                  decode
                </span>
              </motion.div>
            </div>

            <div className="absolute left-32 right-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-fuchsia-400/70 via-cyan-300/70 to-transparent" />

            <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-3">
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                Adaptive systems
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                Product prototypes
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                Production-ready thinking
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              subtitle={project.subtitle}
              summary={project.summary}
              tags={project.tags}
              outcome={project.outcome}
              index={index}
              progress={progress}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
