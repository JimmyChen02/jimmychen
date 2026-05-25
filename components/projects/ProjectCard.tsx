import { memo } from "react";
import type { Project } from "@/lib/projects";
import { formatUpdatedAt } from "@/lib/projects";
import { ExternalLink, Github, Star, GitFork, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

/** Language color map for the dot indicator. Add more as needed. */
const langColors: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  OCaml: "#3be133",
  Swift: "#f05138",
  Rust: "#dea584",
  Go: "#00add8",
  C: "#555555",
  "C++": "#f34b7d",
};

function ProjectCard({ project, className }: ProjectCardProps) {
  const topLangs = Object.entries(project.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([lang]) => lang);

  const displayLang = project.language ?? topLangs[0] ?? null;
  const updatedLabel = formatUpdatedAt(project.updatedAt);

  return (
    <article
      className={cn(
        "group flex flex-col p-5 rounded-xl border border-white/8 bg-white/3",
        "hover:border-cyber-cyan/30 hover:bg-white/5 transition-all duration-300",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="font-semibold text-white group-hover:text-cyber-cyan transition-colors text-base leading-snug">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-cyber-cyan transition-colors"
              aria-label={`${project.title} live demo`}
            >
              <ExternalLink size={15} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-cyber-cyan transition-colors"
              aria-label={`${project.title} on GitHub`}
            >
              <Github size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs font-mono border border-white/8 text-white/40 bg-white/3"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta footer */}
      <div className="flex items-center gap-3 text-xs text-white/25 font-mono pt-3 border-t border-white/5">
        {displayLang && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: langColors[displayLang] ?? "#888" }}
              aria-hidden="true"
            />
            {displayLang}
          </span>
        )}
        {project.stars > 0 && (
          <span className="flex items-center gap-1">
            <Star size={11} aria-hidden="true" />
            <span>{project.stars}</span>
          </span>
        )}
        {project.forks > 0 && (
          <span className="flex items-center gap-1">
            <GitFork size={11} aria-hidden="true" />
            <span>{project.forks}</span>
          </span>
        )}
        {updatedLabel && (
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={11} aria-hidden="true" />
            {updatedLabel}
          </span>
        )}
      </div>
    </article>
  );
}

export default memo(ProjectCard);
