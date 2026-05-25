"use client";

import { memo, Suspense } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/projects";

// Heavy visual components — lazy-loaded
const NeuralBackground = dynamic(
  () => import("@/components/visuals/NeuralBackground"),
  { ssr: false }
);
const VerticalPipeline = dynamic(
  () => import("./VerticalPipeline"),
  { ssr: false }
);
// Transformer stage sections — lazy-loaded after hero
import HeroInput from "./HeroInput";
const TokenizationLayer = dynamic(() => import("./TokenizationLayer"));
const EmbeddingLayer    = dynamic(() => import("./EmbeddingLayer"));
const EncoderBlock      = dynamic(() => import("./EncoderBlock"));
const AttentionHeads    = dynamic(() => import("./AttentionHeads"));
const FeedForwardLayer  = dynamic(() => import("./FeedForwardLayer"));
const DecoderProjects   = dynamic(() => import("./DecoderProjects"));
const OutputLayer       = dynamic(() => import("./OutputLayer"));

interface TransformerPortfolioProps {
  projects: Project[];
}

/**
 * Top-level orchestration component for the Transformer scroll experience.
 *
 * Layout:
 *  - NeuralBackground  — fixed animated canvas
 *  - VerticalPipeline  — fixed left sidebar (desktop only)
 *  - <main>            — all 9 stage sections stacked
 */
function TransformerPortfolio({ projects }: TransformerPortfolioProps) {
  return (
    <div className="relative">
      <NeuralBackground />
      <VerticalPipeline />

      <main className="relative z-10">
        {/* Stage 0: Raw Input */}
        <HeroInput />

        {/* Stage 1: Tokenization */}
        <Suspense fallback={<StageSkeleton />}>
          <TokenizationLayer />
        </Suspense>

        {/* Stage 2: Embedding */}
        <Suspense fallback={<StageSkeleton />}>
          <EmbeddingLayer />
        </Suspense>

        {/* Stage 3: Encoder */}
        <Suspense fallback={<StageSkeleton />}>
          <EncoderBlock />
        </Suspense>

        {/* Stage 4: Multi-Head Attention */}
        <Suspense fallback={<StageSkeleton />}>
          <AttentionHeads />
        </Suspense>

        {/* Stage 5: Feed-Forward */}
        <Suspense fallback={<StageSkeleton />}>
          <FeedForwardLayer />
        </Suspense>

        {/* Stage 6: Decoder */}
        <Suspense fallback={<StageSkeleton />}>
          <DecoderProjects projects={projects} />
        </Suspense>

        {/* Stage 7: Output */}
        <Suspense fallback={<StageSkeleton />}>
          <OutputLayer />
        </Suspense>
      </main>
    </div>
  );
}

/** Minimal spinner shown while a lazy stage section loads */
function StageSkeleton() {
  return (
    <div className="py-32 flex justify-center" aria-hidden="true">
      <div className="w-6 h-6 border-2 border-cyber-cyan/20 border-t-cyber-cyan/60 rounded-full animate-spin" />
    </div>
  );
}

export default memo(TransformerPortfolio);
