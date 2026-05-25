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
  owner: {
    login: string;
  };
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
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
        nodes?: Array<PinnedRepoNode | null>;
      };
    };
  };
}

interface PinnedRepoNode {
  databaseId?: number | null;
  name?: string | null;
  nameWithOwner?: string | null;
  description?: string | null;
  url?: string | null;
  homepageUrl?: string | null;
  repositoryTopics?: {
    nodes?: Array<{
      topic?: {
        name?: string | null;
      } | null;
    } | null>;
  } | null;
  primaryLanguage?: {
    name?: string | null;
  } | null;
  stargazerCount?: number | null;
  forkCount?: number | null;
  updatedAt?: string | null;
  pushedAt?: string | null;
  isFork?: boolean | null;
  isPrivate?: boolean | null;
  owner?: {
    login?: string | null;
  } | null;
}

function getPinnedFallbackNames(): string[] {
  return projectOverrides
    .filter((override) => override.featured)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((override) => override.slug);
}

function mapPinnedRepo(node: PinnedRepoNode | null | undefined): GitHubRepo | null {
  const name = node?.name?.trim();
  const fullName = node?.nameWithOwner?.trim();
  const ownerLogin = node?.owner?.login?.trim() ?? fullName?.split("/")[0];
  const htmlUrl = node?.url?.trim();

  if (!name || !fullName || !ownerLogin || !htmlUrl) {
    return null;
  }

  const topics = (node?.repositoryTopics?.nodes ?? [])
    .map((topicNode) => topicNode?.topic?.name?.trim())
    .filter((topic): topic is string => Boolean(topic));

  return {
    id: node?.databaseId ?? 0,
    name,
    full_name: fullName,
    owner: { login: ownerLogin },
    description: node?.description ?? null,
    html_url: htmlUrl,
    homepage: node?.homepageUrl ?? null,
    topics,
    language: node?.primaryLanguage?.name ?? null,
    stargazers_count: node?.stargazerCount ?? 0,
    forks_count: node?.forkCount ?? 0,
    updated_at: node?.updatedAt ?? node?.pushedAt ?? "",
    pushed_at: node?.pushedAt ?? node?.updatedAt ?? "",
    fork: Boolean(node?.isFork),
    private: Boolean(node?.isPrivate),
  };
}

async function fetchPinnedRepos(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return [];
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
                    databaseId
                    name
                    nameWithOwner
                    description
                    url
                    homepageUrl
                    stargazerCount
                    forkCount
                    updatedAt
                    pushedAt
                    isFork
                    isPrivate
                    owner {
                      login
                    }
                    primaryLanguage {
                      name
                    }
                    repositoryTopics(first: 10) {
                      nodes {
                        topic {
                          name
                        }
                      }
                    }
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
      .map((node) => mapPinnedRepo(node))
      .filter((repo): repo is GitHubRepo => Boolean(repo));
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

function mergePinnedAndOwnedRepos(
  ownedRepos: GitHubRepo[],
  pinnedRepos: GitHubRepo[],
  pinnedFallbackNames: string[],
): GitHubRepo[] {
  if (pinnedRepos.length === 0) {
    return orderReposByPinned(ownedRepos, pinnedFallbackNames);
  }

  const ownedRepoMap = new Map(ownedRepos.map((repo) => [repo.full_name, repo]));
  const orderedRepos: GitHubRepo[] = [];
  const seen = new Set<string>();

  for (const pinnedRepo of pinnedRepos) {
    if (pinnedRepo.fork || pinnedRepo.private) continue;

    const resolvedRepo = ownedRepoMap.get(pinnedRepo.full_name) ?? pinnedRepo;
    if (seen.has(resolvedRepo.full_name)) continue;

    orderedRepos.push(resolvedRepo);
    seen.add(resolvedRepo.full_name);
  }

  for (const repo of ownedRepos) {
    if (seen.has(repo.full_name)) continue;
    orderedRepos.push(repo);
  }

  return orderedRepos;
}

/**
 * Fetch all public repos for the configured user.
 * Results are cached by Next.js for 1 hour (revalidate: 3600).
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const [res, pinnedRepos] = await Promise.all([
      fetch(`${GITHUB_API}/users/${USERNAME}/repos?sort=updated&per_page=100&type=public`, {
        headers: getHeaders(),
        next: { revalidate: 3600 }, // ISR: re-fetch every hour
      }),
      fetchPinnedRepos(),
    ]);

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const repos: GitHubRepo[] = await res.json();
    const publicOwnedRepos = repos.filter((repo) => !repo.fork);

    return mergePinnedAndOwnedRepos(
      publicOwnedRepos,
      pinnedRepos,
      getPinnedFallbackNames(),
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
export async function fetchRepoLanguages(repoFullName: string): Promise<GitHubLanguages> {
  const [owner, repoName] = repoFullName.split("/");
  if (!owner || !repoName) {
    return {};
  }

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${owner}/${repoName}/languages`,
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
      const languages = await fetchRepoLanguages(repo.full_name);
      return { ...repo, languages };
    })
  );

  return enriched;
}
