"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import { defaultViewport, staggerContainer, fadeUpVariants } from "@/lib/animation";

interface ProjectsGridProps {
  projects: Project[];
  showAll?: boolean;
}

const INITIAL_COUNT = 6;

function ProjectsGrid({ projects, showAll = false }: ProjectsGridProps) {
  const [expanded, setExpanded] = useState(showAll);
  const displayedProjects = expanded ? projects : projects.slice(0, INITIAL_COUNT);
  const hasMore = projects.length > INITIAL_COUNT;

  if (projects.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/30 font-mono text-sm">No projects found.</p>
        <p className="text-white/20 text-xs mt-2">
          Check back soon — GitHub data is fetched hourly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        {displayedProjects.map((project, i) => (
          <motion.div
            key={project.slug}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <ProjectCard project={project} className="h-full" />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && !expanded && (
        <motion.div
          className="flex justify-center mt-10"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <button
            onClick={() => setExpanded(true)}
            className="px-6 py-2.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-sm transition-all duration-200 font-mono"
          >
            Show all {projects.length} projects
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default memo(ProjectsGrid);
