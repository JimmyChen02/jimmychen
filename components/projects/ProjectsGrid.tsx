"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project, ProjectCategory } from "@/lib/projects";
import { PROJECT_CATEGORIES, getProjectCategories } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import { defaultViewport, staggerContainer, fadeUpVariants } from "@/lib/animation";
import { cn } from "@/lib/utils";

interface ProjectsGridProps {
  projects: Project[];
  showAll?: boolean;
}

const INITIAL_COUNT = 6;

function ProjectsGrid({ projects, showAll = false }: ProjectsGridProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(null);

  const availableCategories = useMemo(
    () =>
      PROJECT_CATEGORIES.filter((category) =>
        projects.some((p) => getProjectCategories(p).includes(category))
      ),
    [projects]
  );

  const filteredProjects = activeCategory
    ? projects.filter((p) => getProjectCategories(p).includes(activeCategory))
    : projects;

  // Filtered sets are already narrow, so skip the "show more" cap once a
  // category is selected — the person filtering wants to see all of them.
  const displayedProjects =
    showAll || activeCategory ? filteredProjects : filteredProjects.slice(0, INITIAL_COUNT);
  const hasMore = !activeCategory && projects.length > INITIAL_COUNT;

  if (projects.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/50 font-mono text-sm">No projects found.</p>
        <p className="text-white/45 text-xs mt-2">
          Check back soon — GitHub data is fetched hourly.
        </p>
      </div>
    );
  }

  return (
    <div>
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg border text-sm font-mono transition-all duration-200",
              activeCategory === null
                ? "border-knicks-orange/40 bg-knicks-orange/8 text-knicks-orange"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/25"
            )}
          >
            All
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg border text-sm font-mono transition-all duration-200",
                activeCategory === category
                  ? "border-knicks-orange/40 bg-knicks-orange/8 text-knicks-orange"
                  : "border-white/10 text-white/50 hover:text-white hover:border-white/25"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <motion.div
        key={activeCategory ?? "all"}
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

      {hasMore && !showAll && (
        <motion.div
          className="flex justify-center mt-10"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <Link
            href="/projects"
            className="px-6 py-2.5 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 text-sm transition-all duration-200 font-mono"
          >
            Show {projects.length} more projects
          </Link>
        </motion.div>
      )}
    </div>
  );
}

export default memo(ProjectsGrid);
