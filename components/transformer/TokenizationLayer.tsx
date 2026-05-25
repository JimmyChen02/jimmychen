"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { siteConfig } from "@/data/site";

const TOKENS = siteConfig.tokens;
const rawText = siteConfig.hero.inputSequence; // "Jimmy Chen"
const stageViewport = { once: false, amount: 0.55, margin: "-5% 0px -5% 0px" } as const;

type Phase = "idle" | "scanning" | "cutting" | "tokens";

// ─────────────────────────────────────────────────────────
// Scissor cut marker that appears between words
// ─────────────────────────────────────────────────────────
function ScissorCut({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex flex-col items-center self-stretch justify-center gap-0.5 mx-2 select-none"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="flex-1 w-px border-l border-dashed border-cyber-cyan/50"
          />
          <motion.span
            className="font-mono text-xs text-cyber-cyan leading-none py-0.5"
            style={{ fontSize: "14px" }}
            animate={{ rotate: [0, -18, 18, -10, 0] }}
            transition={{ duration: 0.9, delay: 0.3, repeat: Infinity, repeatDelay: 1.2 }}
          >
            ✂
          </motion.span>
          <motion.div
            className="flex-1 w-px border-l border-dashed border-cyber-cyan/50"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────
// Word inside the raw text box — highlights when cutting
// ─────────────────────────────────────────────────────────
function WordFragment({
  layoutId,
  text,
  cutting,
  drift,
}: {
  layoutId: string;
  text: string;
  cutting: boolean;
  drift: number;
}) {
  return (
    <motion.div
      layoutId={layoutId}
      animate={{ x: cutting ? drift * 12 : 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={[
        "relative inline-flex items-center px-2 py-0.5 rounded select-none",
        "transition-all duration-300",
        cutting
          ? "border border-cyber-cyan/55 bg-cyber-cyan/8 shadow-[0_0_14px_rgba(6,182,212,0.3)]"
          : "border border-transparent",
      ].join(" ")}
    >
      <motion.span
        className="font-mono text-xl sm:text-2xl font-medium"
        animate={{ color: cutting ? "#06b6d4" : "#ffffff" }}
        transition={{ duration: 0.35 }}
      >
        {text}
      </motion.span>

      {/* "token" micro-label that appears on top */}
      <AnimatePresence>
        {cutting && (
          <motion.span
            className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-cyber-cyan/55 whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            token
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// BPE chip used in the output row
// ─────────────────────────────────────────────────────────
function BpeChip({
  text,
  index,
  layoutId,
  variant = "cyan",
  enterDelay = 0,
  enterFrom = 0,
}: {
  text: string;
  index: number;
  layoutId?: string;
  variant?: "cyan" | "purple";
  enterDelay?: number;
  enterFrom?: number;
}) {
  const borderCls =
    variant === "purple"
      ? "border-purple-400/40 bg-purple-400/8 text-purple-400"
      : "border-cyber-cyan/40 bg-cyber-cyan/8 text-cyber-cyan";

  // FLIP via layoutId — Framer animates from previous position
  if (layoutId) {
    return (
      <motion.div layoutId={layoutId} className="flex flex-col items-center gap-1.5">
        <div className={`px-3 py-1.5 rounded border font-mono text-sm font-medium ${borderCls}`}>
          {text}
        </div>
        <span className="font-mono text-[10px] text-white/25">{index}</span>
      </motion.div>
    );
  }

  // Directional fly-in for [CLS] / [SEP]
  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, x: enterFrom * 36, scale: 0.65 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay: enterDelay,
        duration: 0.7,
        type: "spring",
        stiffness: 180,
        damping: 22,
      }}
    >
      <div className={`px-3 py-1.5 rounded border font-mono text-sm font-medium ${borderCls}`}>
        {text}
      </div>
      <span className="font-mono text-[10px] text-white/25">{index}</span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────
function TokenizationLayer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [inView, setInView] = useState(false);
  const timersRef = useRef<number[]>([]);

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function resetAnimation() {
    clearTimers();
    setPhase("idle");
  }

  function startAnimation() {
    clearTimers();
    setPhase("scanning");
    timersRef.current = [
      window.setTimeout(() => setPhase("cutting"), 2000),
      window.setTimeout(() => setPhase("tokens"), 4200),
    ];
  }

  useEffect(() => resetAnimation, []);

  const cutting  = phase === "cutting";
  const isTokens = phase === "tokens";

  return (
    <motion.section
      id="tokenization"
      className="relative min-h-[82svh] lg:min-h-[84svh] px-6 pt-20 pb-8 lg:pt-24 lg:pb-10 flex flex-col items-center justify-center"
      aria-label="Tokenization layer"
      onViewportEnter={() => {
        setInView(true);
        startAnimation();
      }}
      onViewportLeave={() => {
        setInView(false);
        resetAnimation();
      }}
      viewport={stageViewport}
    >
      {/* Outer layout wrapper — shifts upward smoothly as content grows */}
      <motion.div layout className="flex flex-col items-center w-full max-w-2xl">

      {/* Header */}
      <motion.div
        layout
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Splitting into Tokens
        </h2>
        <p className="text-white/35 font-mono text-sm">
          tokenizer(<span className="text-cyber-cyan">&quot;{rawText}&quot;</span>)
        </p>
      </motion.div>

      {/* LayoutGroup lets layoutId animate across the text-box → chip-row transition */}
      <LayoutGroup>
        <motion.div layout className="w-full space-y-7 lg:space-y-8">

          {/* ── Raw input box ──────────────────────────────── */}
          <div className="flex flex-col items-center gap-2.5">
            <p className="font-mono text-xs text-white/20 uppercase tracking-widest">Input</p>

            <motion.div
              className="relative rounded-xl border border-white/10 bg-white/[0.02] min-w-[300px]"
              animate={isTokens ? { opacity: 0.4, scale: 0.96 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Scan line — clipped to the box boundary */}
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <AnimatePresence>
                  {phase === "scanning" && (
                    <motion.div
                      className="absolute inset-y-0 w-[2px] bg-cyber-cyan rounded"
                      style={{ boxShadow: "0 0 14px 5px rgba(6,182,212,0.5)" }}
                      initial={{ left: "-2px" }}
                      animate={{ left: "100%" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.75, ease: "linear" }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Inner padding — overflow-visible so floating "token" labels can escape upward */}
              <div className="px-8 py-5 overflow-visible">
              {/* Word fragments with extra top padding for the floating "token" label */}
              <div className="flex items-center justify-center gap-0 flex-wrap pt-4">
                <span className="font-mono text-xl sm:text-2xl text-amber-400/65 mr-0.5 select-none">&quot;</span>

                {/* "Jimmy" — participates in FLIP animation (hidden once tokens show) */}
                {!isTokens && (
                  <WordFragment layoutId="bpe-jimmy" text="Jimmy" cutting={cutting} drift={-1} />
                )}

                {/* Scissor between words */}
                <ScissorCut visible={cutting} />

                {/* "Chen" — same */}
                {!isTokens && (
                  <WordFragment layoutId="bpe-chen" text="Chen" cutting={cutting} drift={1} />
                )}

                <span className="font-mono text-xl sm:text-2xl text-amber-400/65 ml-0.5 select-none">&quot;</span>
              </div>
              </div>{/* end inner padding */}
            </motion.div>
          </div>

          {/* ── BPE chip row ────────────────────────────────── */}
          <AnimatePresence>
            {isTokens && (
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-px bg-white/10" />
                  <p className="font-mono text-xs text-white/20 uppercase tracking-widest">BPE Tokens</p>
                  <span className="w-8 h-px bg-white/10" />
                </div>

                <div className="flex flex-wrap justify-center gap-2.5">
                  {/* [CLS] — flies in from left */}
                  <BpeChip text="[CLS]" index={0} variant="purple" enterDelay={0.04} enterFrom={-1} />

                  {/* Jimmy — FLIP from word fragment */}
                  <BpeChip text="Jimmy" index={1} layoutId="bpe-jimmy" />

                  {/* Chen — FLIP from word fragment */}
                  <BpeChip text="Chen"  index={2} layoutId="bpe-chen"  />

                  {/* [SEP] — flies in from right */}
                  <BpeChip text="[SEP]" index={3} variant="purple" enterDelay={0.04} enterFrom={1} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Down-arrow connector ─────────────────────────── */}
          <AnimatePresence>
            {isTokens && (
              <motion.div
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.3, scaleY: 1 }}
                style={{ originY: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                aria-hidden="true"
              >
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-px h-2.5 bg-white/50" />
                ))}
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-transparent border-t-white/50" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Identity token pills ─────────────────────────── */}
          <AnimatePresence>
            {isTokens && (
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-px bg-white/10" />
                  <p className="font-mono text-xs text-white/20 uppercase tracking-widest">Identity Tokens</p>
                  <span className="w-8 h-px bg-white/10" />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {TOKENS.map((token, i) => (
                    <motion.div
                      key={token.id}
                      initial={{ opacity: 0, scale: 0.85, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 0.7 + i * 0.08,
                        duration: 0.35,
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      whileHover={{ scale: 1.03 }}
                      className="group flex items-center gap-2 px-3.5 py-2 rounded-md border border-white/10 bg-white/[0.03] hover:border-cyber-cyan/30 hover:bg-cyber-cyan/5 transition-colors cursor-default"
                    >
                      <span className="font-mono text-[10px] text-white/20 group-hover:text-cyber-cyan/40 transition-colors w-4 text-right shrink-0">
                        {i}
                      </span>
                      <span className="w-px h-3 bg-white/10 shrink-0" />
                      <span className="font-mono text-sm text-white/70 group-hover:text-white transition-colors">
                        {token.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.p
                  className="font-mono text-xs text-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + TOKENS.length * 0.08 + 0.3 }}
                >
                  seq_len = {TOKENS.length} &nbsp;·&nbsp; vocab complete
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
      </motion.div>
    </motion.section>
  );
}

export default memo(TokenizationLayer);
