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
  /** ISO date string of last push */
  updatedAt: string;
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
    githubUrl: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "JimmyChen02"}/${override.slug}`,
    demoUrl: override.demoUrl ?? null,
    language: null,
    languages: {},
    stars: 0,
    forks: 0,
    updatedAt: new Date().toISOString(),
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
    githubUrl: repo.html_url,
    demoUrl: override?.demoUrl ?? repo.homepage ?? null,
    language: repo.language,
    languages: repo.languages,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
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
  const repoMap = new Map(repos.map((r) => [r.name, r]));
  const seen = new Set<string>();
  const projects: Project[] = [];

  // Process overrides in order
  for (const override of projectOverrides) {
    if (override.hidden) continue;
    const repo = repoMap.get(override.slug);
    if (repo) {
      projects.push(mergeProject(repo, override));
    } else {
      // Override exists but no matching GitHub repo — show from local data
      projects.push(projectFromOverride(override));
    }
    seen.add(override.slug);
  }

  // Append remaining GitHub repos that aren't in overrides
  for (const repo of repos) {
    if (!seen.has(repo.name)) {
      projects.push(mergeProject(repo, undefined));
    }
  }

  return projects.sort((a, b) => a.order - b.order);
}

/** Return only featured projects, ordered by the `order` field. */
export function getFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

/** Format a date string as "Jan 2024" for display. */
export function formatUpdatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
