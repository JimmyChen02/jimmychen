/**
 * app/api/github/route.ts
 *
 * Server-only API route. GITHUB_TOKEN is read here and never sent to the client.
 * Next.js ISR caches the response for 1 hour automatically.
 *
 * Rate limiting: max 10 requests per IP per minute (in-process).
 * Note: serverless functions may have multiple instances, so this is a
 * per-instance limit. For stricter limits use Upstash Redis or Vercel KV.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchEnrichedRepos } from "@/lib/github";
import { mergeProjects } from "@/lib/projects";

export const revalidate = 3600; // Re-generate every hour

// ── Simple in-memory rate limiter ─────────────────────────────────────────────
const WINDOW_MS  = 60_000; // 1 minute
const MAX_HITS   = 10;     // requests per window per IP

const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > MAX_HITS) return true;
  return false;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Cache-Control": "no-store",
        },
      }
    );
  }

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
