/**
 * lib/projects.ts
 *
 * Merges GitHub API data with local project-overrides.
 * The result is a unified Project type used across all components.
 */

import { type EnrichedRepo } from "./github";
import { projectOverrides, type ProjectOverride } from "@/data/project-overrides";

export interface Project {
  /** Display title */
  title: string;
  /** GitHub repo slug */
  slug: string;
  /** Portfolio-facing description */
  description: string;
  /** Combined tags (local + GitHub topics, deduplicated) */
  tags: string[];
  /** GitHub repo URL */
  githubUrl: string;
  /** Live / demo URL (from homepage or override) */
  demoUrl: string | null;
  /** Primary language from GitHub */
  language: string | null;
  /** All languages with byte counts */
  languages: Record<string, number>;
  /** Star count */
  stars: number;
  /** Fork count */
  forks: number;
  /** ISO date string of the last code push, if known */
  updatedAt: string | null;
  /** Whether this should appear in the featured section */
  featured: boolean;
  /** Display order (lower = first) */
  order: number;
  /** Custom ranking scores */
  scores?: ProjectOverride["scores"];
}

/** Build a Project purely from a local override (no GitHub data needed). */
function projectFromOverride(override: ProjectOverride): Project {
  return {
    title: override.title ?? override.slug,
    slug: override.slug,
    description: override.description ?? "",
    tags: override.tags ?? [],
    githubUrl:
      override.githubUrl ??
      `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "JimmyChen02"}/${override.slug}`,
    demoUrl: override.demoUrl ?? null,
    language: null,
    languages: {},
    stars: 0,
    forks: 0,
    updatedAt: null,
    featured: override.featured ?? false,
    order: override.order ?? 999,
    scores: override.scores,
  };
}

/** Merge GitHub repo data with a local override. Override wins on every field it defines. */
function mergeProject(repo: EnrichedRepo, override: ProjectOverride | undefined): Project {
  const githubTags = repo.topics ?? [];
  const localTags = override?.tags ?? [];
  const mergedTags = Array.from(new Set([...localTags, ...githubTags]));

  return {
    title: override?.title ?? repo.name,
    slug: repo.name,
    description: override?.description ?? repo.description ?? "",
    tags: mergedTags,
    githubUrl: override?.githubUrl ?? repo.html_url,
    demoUrl: override?.demoUrl ?? repo.homepage ?? null,
    language: repo.language,
    languages: repo.languages,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.pushed_at || repo.updated_at || null,
    featured: override?.featured ?? false,
    order: override?.order ?? 999,
    scores: override?.scores,
  };
}

/**
 * Merge GitHub repos with local overrides.
 *
 * Logic:
 * 1. For each local override, find the matching GitHub repo.
 * 2. If found, merge (override wins). If not found, use override alone.
 * 3. Remaining GitHub repos that have no override are appended at the end.
 * 4. Hidden overrides are filtered out.
 */
export function mergeProjects(repos: EnrichedRepo[]): Project[] {
  const overrideMap = new Map(projectOverrides.map((override) => [override.slug, override]));
  const seen = new Set<string>();
  const projects: Project[] = [];

  // Preserve the incoming GitHub repo order (pinned repos first if available).
  for (const repo of repos) {
    const override = overrideMap.get(repo.name);
    if (override?.hidden) continue;
    projects.push(mergeProject(repo, override));
    seen.add(repo.name);
  }

  // Append local-only overrides that have no matching GitHub repo.
  for (const override of projectOverrides) {
    if (override.hidden || seen.has(override.slug)) continue;
    projects.push(projectFromOverride(override));
  }

  return projects;
}

/** Return only featured projects, ordered by the `order` field. */
export function getFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

/**
 * Coarse CS-area categories for filtering the projects grid.
 * Derived from each project's existing tags/GitHub topics — a project can
 * match more than one (e.g. an iOS app that's also an ML project).
 */
export const PROJECT_CATEGORIES = [
  "Full-Stack",
  "iOS",
  "ML",
  "Research",
  "Systems",
  "Game Dev",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** Lowercased tag/topic → category. Only unambiguous signals are mapped. */
const CATEGORY_TAG_MAP: Record<string, ProjectCategory> = {
  // iOS
  swiftui: "iOS", ios: "iOS", mapkit: "iOS", healthkit: "iOS", uikit: "iOS", xcode: "iOS",
  // ML
  ml: "ML", "ai/ml": "ML", ai: "ML", "machine learning": "ML", pytorch: "ML",
  tensorflow: "ML", nlp: "ML", llm: "ML", llms: "ML", "deep learning": "ML",
  // Research
  research: "Research", hci: "Research", "data visualization": "Research",
  // Full-Stack
  react: "Full-Stack", "next.js": "Full-Stack", nextjs: "Full-Stack", fastapi: "Full-Stack",
  postgresql: "Full-Stack", aws: "Full-Stack", supabase: "Full-Stack", django: "Full-Stack",
  "node.js": "Full-Stack", nodejs: "Full-Stack", express: "Full-Stack", docker: "Full-Stack",
  // Systems
  systems: "Systems", networking: "Systems", multithreading: "Systems", tcp: "Systems",
  concurrency: "Systems", "operating systems": "Systems", compilers: "Systems",
  // Game Dev
  "game dev": "Game Dev", "game development": "Game Dev", raylib: "Game Dev", unity: "Game Dev",
};

/** Every category a project matches, derived from its tags. Order follows PROJECT_CATEGORIES. */
export function getProjectCategories(project: Project): ProjectCategory[] {
  const matched = new Set<ProjectCategory>();
  for (const tag of project.tags) {
    const category = CATEGORY_TAG_MAP[tag.toLowerCase()];
    if (category) matched.add(category);
  }
  return PROJECT_CATEGORIES.filter((c) => matched.has(c));
}

/** Format a date string as "Jan 2024" for display. */
export function formatUpdatedAt(iso?: string | null): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
