import { Suspense } from "react";
import { fetchEnrichedRepos } from "@/lib/github";
import { mergeProjects } from "@/lib/projects";
import { projectOverrides } from "@/data/project-overrides";
import TransformerPortfolio from "@/components/transformer/TransformerPortfolio";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";

// ISR: re-generate this page every hour
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch GitHub data server-side — token never exposed to client
  let projects = mergeProjects([]);

  try {
    const repos = await fetchEnrichedRepos();
    projects = mergeProjects(repos);
  } catch {
    // Fallback: build projects from local overrides only
    // (this handles GitHub being down or rate-limited at build time)
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
    <>
      {/* ============================================================
          Cinematic Transformer scroll experience
          ============================================================ */}
      <TransformerPortfolio projects={projects} />

      {/* ============================================================
          Normal portfolio sections — recruiter-friendly quick-scan zone
          ============================================================ */}
      <div className="relative z-10 border-t border-white/5 bg-gradient-to-b from-cyber-black to-cyber-navy">
        {/* Divider label */}
        <div className="max-w-6xl mx-auto px-6 pt-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent" />
            <span className="font-mono text-xs text-white/25 uppercase tracking-widest">
              Portfolio
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent" />
          </div>
        </div>

        <AboutSection />

        {/* Projects section */}
        <section
          id="projects"
          className="py-24 px-6 max-w-5xl mx-auto"
          aria-label="Projects section"
        >
          <div className="mb-14">
            <p className="font-mono text-xs text-cyber-cyan/50 uppercase tracking-widest mb-2">
              / projects
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Projects
            </h2>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <div className="w-6 h-6 border-2 border-cyber-cyan/20 border-t-cyber-cyan/60 rounded-full animate-spin" />
              </div>
            }
          >
            <ProjectsGrid projects={projects} />
          </Suspense>
        </section>

        <SkillsSection />
        <ContactSection />
      </div>
    </>
  );
}
