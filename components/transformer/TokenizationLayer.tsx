"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport } from "@/lib/animation";

const TOKENS = siteConfig.tokens;

// Fake subword tokens for the raw string, like a real BPE tokenizer would produce
const SUBWORD_TOKENS = ["[CLS]", "Jimmy", "Chen", "[SEP]"];

function TokenizationLayer() {
  const [phase, setPhase] = useState<"idle" | "scanning" | "tokens">("idle");

  function startAnimation() {
    if (phase !== "idle") return;
    setPhase("scanning");
    setTimeout(() => setPhase("tokens"), 1400);
  }

  const rawText = siteConfig.hero.inputSequence;

  return (
    <section
      id="tokenization"
      className="relative py-32 px-6 flex flex-col items-center"
      aria-label="Tokenization layer"
    >
      {/* Stage header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={defaultViewport}
        transition={{ duration: 0.5 }}
        onViewportEnter={startAnimation}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Splitting into Tokens
        </h2>
        <p className="text-white/35 font-mono text-sm">
          tokenizer(<span className="text-cyber-cyan">&quot;{rawText}&quot;</span>)
        </p>
      </motion.div>

      <div className="w-full max-w-2xl space-y-10">

        {/* ── Raw input + scan animation ─────────────── */}
        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-xs text-white/20 uppercase tracking-widest">Input</p>

          <div className="relative px-6 py-3.5 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
            {/* Scan line */}
            <AnimatePresence>
              {phase === "scanning" && (
                <motion.div
                  className="absolute inset-y-0 w-px bg-cyber-cyan/80"
                  style={{ boxShadow: "0 0 10px 2px rgba(6,182,212,0.5)" }}
                  initial={{ left: "0%" }}
                  animate={{ left: "105%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.0, ease: "linear" }}
                />
              )}
            </AnimatePresence>

            <span className="font-mono text-xl sm:text-2xl font-medium text-white">
              &quot;{rawText}&quot;
            </span>
          </div>
        </div>

        {/* ── Subword tokens (BPE-style) ───────────────── */}
        <AnimatePresence>
          {phase === "tokens" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-white/10" />
                <p className="font-mono text-xs text-white/20 uppercase tracking-widest">BPE Tokens</p>
                <span className="w-8 h-px bg-white/10" />
              </div>

              {/* Subword token row */}
              <div className="flex flex-wrap justify-center gap-2">
                {SUBWORD_TOKENS.map((tok, i) => (
                  <motion.div
                    key={tok}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-1"
                  >
                    {/* Token chip */}
                    <div className={`
                      px-3 py-1.5 rounded border font-mono text-sm font-medium
                      ${tok === "[CLS]" || tok === "[SEP]"
                        ? "border-cyber-purple/30 bg-cyber-purple/8 text-cyber-purple"
                        : "border-cyber-cyan/25 bg-cyber-cyan/5 text-cyber-cyan"}
                    `}>
                      {tok}
                    </div>
                    {/* Token ID */}
                    <span className="font-mono text-[10px] text-white/20">{i}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Divider ──────────────────────────────────── */}
        <AnimatePresence>
          {phase === "tokens" && (
            <motion.div
              className="flex flex-col items-center gap-1 opacity-30"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.3, scaleY: 1 }}
              style={{ originY: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              aria-hidden="true"
            >
              {[0, 1, 2].map(i => (
                <div key={i} className="w-px h-3 bg-white/40" />
              ))}
              <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-transparent border-t-white/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Identity token pills ─────────────────────── */}
        <AnimatePresence>
          {phase === "tokens" && (
            <motion.div
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-white/10" />
                <p className="font-mono text-xs text-white/20 uppercase tracking-widest">Identity Tokens</p>
                <span className="w-8 h-px bg-white/10" />
              </div>

              <div className="flex flex-wrap justify-center gap-2.5">
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
                    {/* Position index */}
                    <span className="font-mono text-[10px] text-white/20 group-hover:text-cyber-cyan/40 transition-colors w-4 text-right shrink-0">
                      {i}
                    </span>
                    {/* Separator */}
                    <span className="w-px h-3 bg-white/10 shrink-0" />
                    {/* Label */}
                    <span className="font-mono text-sm text-white/70 group-hover:text-white transition-colors">
                      {token.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Token count footer */}
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
      </div>
    </section>
  );
}

export default memo(TokenizationLayer);
