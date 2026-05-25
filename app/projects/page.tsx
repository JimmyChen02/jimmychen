import type { Metadata } from "next";
import { fetchEnrichedRepos } from "@/lib/github";
import { mergeProjects } from "@/lib/projects";
import { projectOverrides } from "@/data/project-overrides";
import { siteConfig } from "@/data/site";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description: `All projects by ${siteConfig.name} — ${siteConfig.role}`,
};

export default async function ProjectsPage() {
  let projects = mergeProjects([]);

  try {
    const repos = await fetchEnrichedRepos();
    projects = mergeProjects(repos);
  } catch {
    projects = projectOverrides
      .filter((o) => !o.hidden)
      .map((o) => ({
        title: o.title ?? o.slug,
        slug: o.slug,
        description: o.description ?? "",
        tags: o.tags ?? [],
        githubUrl: `https://github.com/JimmyChen02/${o.slug}`,
        demoUrl: o.demoUrl ?? null,
        language: null,
        languages: {},
        stars: 0,
        forks: 0,
        updatedAt: new Date().toISOString(),
        featured: o.featured ?? false,
        order: o.order ?? 999,
        scores: o.scores,
      }))
      .sort((a, b) => a.order - b.order);
  }

  return (
    <main className="min-h-screen pt-24 pb-16 sm:pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <a
            href="/"
            className="font-mono text-xs text-white/30 hover:text-white/60 transition-colors mb-4 inline-block"
          >
            ← Back home
          </a>
          <p className="font-mono text-xs text-cyber-cyan/50 uppercase tracking-widest mb-2">
            / projects
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            All Projects
          </h1>
          <p className="text-white/45 text-sm max-w-lg">
            Auto-synced from GitHub every hour. Featured projects have custom
            descriptions. Click any card to view the source.
          </p>
        </div>

        {/* Grid */}
        <ProjectsGrid projects={projects} showAll />
      </div>
    </main>
  );
}
