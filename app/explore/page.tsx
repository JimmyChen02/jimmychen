import type { Metadata } from "next";
import { fetchEnrichedRepos } from "@/lib/github";
import { mergeProjects, getFeaturedProjects } from "@/lib/projects";
import TransformerPortfolio from "@/components/transformer/TransformerPortfolio";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Interactive Portfolio",
  description: "Explore Jimmy Chen's transformer-inspired interactive portfolio.",
};

export default async function ExplorePage() {
  const repos = await fetchEnrichedRepos();
  const projects = mergeProjects(repos);
  const orderedProjects = [
    ...getFeaturedProjects(projects),
    ...projects.filter((project) => !project.featured),
  ];

  return <TransformerPortfolio projects={orderedProjects} />;
}
