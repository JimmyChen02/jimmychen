/**
 * lib/github.ts
 *
 * Server-side only. Never import this in client components.
 * The GITHUB_TOKEN env var is read here and stays on the server.
 */

import { projectOverrides } from "@/data/project-overrides";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  private: boolean;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface EnrichedRepo extends GitHubRepo {
  languages: GitHubLanguages;
}

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "JimmyChen02";

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

interface PinnedItemsResponse {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: Array<{ name?: string | null } | null>;
      };
    };
  };
}

async function fetchPinnedRepoNames(): Promise<string[]> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return projectOverrides
      .filter((override) => override.featured)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .map((override) => override.slug);
  }

  try {
    const res = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPinnedRepos($login: String!) {
            user(login: $login) {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    name
                  }
                }
              }
            }
          }
        `,
        variables: { login: USERNAME },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`GitHub GraphQL error: ${res.status} ${res.statusText}`);
      return [];
    }

    const payload: PinnedItemsResponse = await res.json();
    return (payload.data?.user?.pinnedItems?.nodes ?? [])
      .map((node) => node?.name?.trim())
      .filter((name): name is string => Boolean(name));
  } catch (error) {
    console.error("Failed to fetch pinned GitHub repos:", error);
    return [];
  }
}

function orderReposByPinned(repos: GitHubRepo[], pinnedRepoNames: string[]): GitHubRepo[] {
  if (pinnedRepoNames.length === 0) {
    return repos;
  }

  const repoMap = new Map(repos.map((repo) => [repo.name, repo]));
  const pinned = pinnedRepoNames
    .map((name) => repoMap.get(name))
    .filter((repo): repo is GitHubRepo => Boolean(repo));
  const pinnedSet = new Set(pinned.map((repo) => repo.name));
  const remaining = repos.filter((repo) => !pinnedSet.has(repo.name));

  return [...pinned, ...remaining];
}

/**
 * Fetch all public repos for the configured user.
 * Results are cached by Next.js for 1 hour (revalidate: 3600).
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const [res, pinnedRepoNames] = await Promise.all([
      fetch(`${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=100&type=public`, {
        headers: getHeaders(),
        next: { revalidate: 3600 }, // ISR: re-fetch every hour
      }),
      fetchPinnedRepoNames(),
    ]);

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const repos: GitHubRepo[] = await res.json();
    // Filter out forks so only original work shows
    return orderReposByPinned(
      repos.filter((r) => !r.fork),
      pinnedRepoNames,
    );
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return [];
  }
}

/**
 * Fetch language breakdown for a single repo.
 * Used to enrich project cards with actual byte counts.
 */
export async function fetchRepoLanguages(repoName: string): Promise<GitHubLanguages> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${USERNAME}/${repoName}/languages`,
      {
        headers: getHeaders(),
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

/**
 * Fetch repos enriched with language data.
 * Runs language fetches in parallel for speed.
 */
export async function fetchEnrichedRepos(): Promise<EnrichedRepo[]> {
  const repos = await fetchGitHubRepos();

  const enriched = await Promise.all(
    repos.map(async (repo) => {
      const languages = await fetchRepoLanguages(repo.name);
      return { ...repo, languages };
    })
  );

  return enriched;
}
