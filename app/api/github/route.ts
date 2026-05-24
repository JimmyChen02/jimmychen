/**
 * app/api/github/route.ts
 *
 * Server-only API route. GITHUB_TOKEN is read here and never sent to the client.
 * Next.js ISR caches the response for 1 hour automatically.
 */

import { NextResponse } from "next/server";
import { fetchEnrichedRepos } from "@/lib/github";
import { mergeProjects } from "@/lib/projects";

export const revalidate = 3600; // Re-generate every hour

export async function GET() {
  try {
    const repos = await fetchEnrichedRepos();
    const projects = mergeProjects(repos);

    return NextResponse.json(
      { projects, fetchedAt: new Date().toISOString() },
      {
        headers: {
          // Allow the CDN / browser to cache for 1 hour
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("GitHub route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", projects: [] },
      { status: 500 }
    );
  }
}
