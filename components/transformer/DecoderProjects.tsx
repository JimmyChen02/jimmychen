"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { defaultViewport, fadeUpVariants } from "@/lib/animation";
import { softmaxRanking } from "@/data/project-overrides";
import type { Project } from "@/lib/projects";
import { formatUpdatedAt } from "@/lib/projects";
import { ExternalLink, Github, Clock } from "lucide-react";

interface DecoderProjectsProps {
  projects: Project[];
}

const SCORE_DIMS = ["AI/ML Fit", "Systems Depth", "Product Polish", "Research Impact"] as const;

const DIM_COLOR: Record<string, string> = {
  "AI/ML Fit":       "from-cyber-cyan to-cyber-purple",
  "Systems Depth":   "from-sky-400 to-cyber-cyan",
  "Product Polish":  "from-cyber-purple to-pink-500",
  "Research Impact": "from-teal-400 to-cyber-cyan",
};

function ProjectCard({
  project,
  index,
  scores,
  overallScore,
  horizontal = false,
}: {
  project: Project;
  index: number;
  scores: Record<string, number>;
  overallScore: number;
  horizontal?: boolean;
}) {
  return (
    <motion.article
      className={`relative p-5 rounded-xl border border-white/8 bg-white/[0.02] backdrop-blur-sm hover:border-cyber-cyan/25 transition-all duration-300 group ${horizontal ? "sm:flex sm:gap-6 sm:items-start" : ""}`}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={defaultViewport}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      {/* Left column (or full card when not horizontal) */}
      <div className={horizontal ? "sm:flex-1 min-w-0" : ""}>
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-[10px] text-white/20">output_token[{index}]</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/30">p =</span>
          <motion.span
            className="font-mono text-sm font-bold text-cyber-cyan"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {overallScore.toFixed(2)}
          </motion.span>
          <div className="flex gap-1.5">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="text-white/25 hover:text-cyber-cyan transition-colors">
                <Github size={14} />
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                className="text-white/25 hover:text-cyber-cyan transition-colors">
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Overall probability bar */}
      <div className="mb-4 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan via-glow-blue to-cyber-purple rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${overallScore * 100}%` }}
          viewport={defaultViewport}
          transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Title + description */}
      <h3 className="font-semibold text-white group-hover:text-cyber-cyan transition-colors mb-1.5 text-base leading-snug">
        {project.title}
      </h3>
      <p className="text-white/50 text-sm leading-relaxed mb-4">
        {project.description}
      </p>

      </div>{/* end left col */}

      {/* Score bars — right col when horizontal, inline otherwise */}
      <div className={horizontal ? "sm:w-44 sm:shrink-0 sm:pt-1" : "space-y-1.5 mb-4"}>
        <div className={horizontal ? "sm:space-y-1.5" : ""}>
        {SCORE_DIMS.map((dim, i) => (
          <div key={dim} className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-white/25 w-24 text-right shrink-0">{dim}</span>
            <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${DIM_COLOR[dim]} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${(scores[dim] ?? 0) * 100}%` }}
                viewport={defaultViewport}
                transition={{ duration: 0.7, delay: index * 0.1 + i * 0.06 + 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="font-mono text-[10px] text-white/30 w-6 shrink-0">
              {(scores[dim] ?? 0).toFixed(2)}
            </span>
          </div>
        ))}
        </div>
      </div>

      {/* Tags + meta */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/8 text-white/35 bg-white/3">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[10px] text-white/20 font-mono">
        <Clock size={10} />
        {formatUpdatedAt(project.updatedAt)}
      </div>
    </motion.article>
  );
}

function DecoderProjects({ projects }: DecoderProjectsProps) {
  const featured = projects.filter((p) => p.featured);
  const scoreMap = Object.fromEntries(softmaxRanking.map((r) => [r.slug, r]));

  return (
    <section
      id="decoder"
      className="relative min-h-screen px-6 flex flex-col items-center justify-center pt-24 pb-16"
      aria-label="Decoder: project generation"
    >
      <motion.div
        className="text-center mb-10"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          What I Build
        </h2>
        <p className="text-white/40 font-mono text-xs whitespace-nowrap mx-auto">
          decode(context) → tokens · softmax(scores) → p(project)
        </p>
      </motion.div>

      <div className="w-full max-w-3xl grid sm:grid-cols-2 gap-5">
        {featured.map((project, i) => {
          const sm = scoreMap[project.slug];
          const isLastOdd = i === featured.length - 1 && featured.length % 2 !== 0;
          return (
            <div key={project.slug} className={isLastOdd ? "sm:col-span-2" : ""}>
              <ProjectCard
                project={project}
                index={i}
                scores={sm?.scores ?? {}}
                overallScore={sm?.overallScore ?? 0}
                horizontal={isLastOdd}
              />
            </div>
          );
        })}
      </div>

      <motion.p
        className="mt-10 font-mono text-xs text-white/15 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={defaultViewport}
        transition={{ delay: 0.6 }}
      >
        [EOS] · scores are a portfolio metaphor, not a real ML model
      </motion.p>
    </section>
  );
}

export default memo(DecoderProjects);
