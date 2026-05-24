/**
 * lib/github.ts
 *
 * Server-side only. Never import this in client components.
 * The GITHUB_TOKEN env var is read here and stays on the server.
 */

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
const USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "JimmyChen02";

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Fetch all public repos for the configured user.
 * Results are cached by Next.js for 1 hour (revalidate: 3600).
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=100&type=public`,
      {
        headers: getHeaders(),
        next: { revalidate: 3600 }, // ISR: re-fetch every hour
      }
    );

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const repos: GitHubRepo[] = await res.json();
    // Filter out forks so only original work shows
    return repos.filter((r) => !r.fork);
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
