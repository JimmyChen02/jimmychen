"use client";

import { memo, Suspense } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/projects";

// Heavy visual components are lazy-loaded to improve initial page load
const NeuralBackground = dynamic(
  () => import("@/components/visuals/NeuralBackground"),
  { ssr: false }
);
const VerticalPipeline = dynamic(
  () => import("./VerticalPipeline"),
  { ssr: false }
);

// Transformer stages — lazy load everything after hero
import HeroInput from "./HeroInput";
const TokenizationLayer = dynamic(() => import("./TokenizationLayer"));
const EmbeddingLayer = dynamic(() => import("./EmbeddingLayer"));
const EncoderBlock = dynamic(() => import("./EncoderBlock"));
const AttentionHeads = dynamic(() => import("./AttentionHeads"));
const FeedForwardLayer = dynamic(() => import("./FeedForwardLayer"));
const DecoderProjects = dynamic(() => import("./DecoderProjects"));
const SoftmaxRanking = dynamic(() => import("./SoftmaxRanking"));
const OutputLayer = dynamic(() => import("./OutputLayer"));

interface TransformerPortfolioProps {
  projects: Project[];
}

/**
 * Top-level orchestration component for the cinematic Transformer scroll experience.
 * Renders the pipeline sidebar and all stage sections in order.
 * Each stage is lazily imported so the initial bundle stays small.
 */
function TransformerPortfolio({ projects }: TransformerPortfolioProps) {
  return (
    <div className="relative">
      {/* Animated canvas background — rendered once for the whole page */}
      <NeuralBackground />

      {/* Sticky pipeline sidebar (desktop only, appears after hero) */}
      <VerticalPipeline />

      {/* Stage sections */}
      <main className="relative z-10">
        {/* Stage 0: Hero */}
        <HeroInput />

        {/* Divider with data flow visual */}
        <StageDivider />

        {/* Stage 1: Tokenization */}
        <Suspense fallback={<StageSkeleton />}>
          <TokenizationLayer />
        </Suspense>

        <StageDivider />

        {/* Stage 2: Embedding */}
        <Suspense fallback={<StageSkeleton />}>
          <EmbeddingLayer />
        </Suspense>

        <StageDivider />

        {/* Stage 3: Encoder */}
        <Suspense fallback={<StageSkeleton />}>
          <EncoderBlock />
        </Suspense>

        <StageDivider />

        {/* Stage 4: Multi-Head Attention */}
        <Suspense fallback={<StageSkeleton />}>
          <AttentionHeads />
        </Suspense>

        <StageDivider />

        {/* Stage 5: Feed-Forward */}
        <Suspense fallback={<StageSkeleton />}>
          <FeedForwardLayer />
        </Suspense>

        <StageDivider />

        {/* Stage 6: Decoder */}
        <Suspense fallback={<StageSkeleton />}>
          <DecoderProjects projects={projects} />
        </Suspense>

        <StageDivider />

        {/* Stage 7: Softmax */}
        <Suspense fallback={<StageSkeleton />}>
          <SoftmaxRanking />
        </Suspense>

        <StageDivider />

        {/* Stage 8: Output */}
        <Suspense fallback={<StageSkeleton />}>
          <OutputLayer />
        </Suspense>
      </main>
    </div>
  );
}

/** Thin visual divider between pipeline stages */
function StageDivider() {
  return (
    <div className="flex justify-center py-4" aria-hidden="true">
      <div className="flex flex-col items-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-px h-3 bg-gradient-to-b from-cyber-cyan/30 to-transparent"
            style={{ opacity: 1 - i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

/** Minimal skeleton shown while lazy stage loads */
function StageSkeleton() {
  return (
    <div className="py-32 flex justify-center" aria-hidden="true">
      <div className="w-6 h-6 border-2 border-cyber-cyan/20 border-t-cyber-cyan/60 rounded-full animate-spin" />
    </div>
  );
}

export default memo(TransformerPortfolio);
