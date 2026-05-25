"use client";

import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site";
import { Github, Linkedin, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPING_SPEED = 95;   // ms per char typed
const ERASE_SPEED  = 45;   // ms per char erased
const HOLD_DONE    = 1800; // ms to pause when fully typed
const HOLD_EMPTY   = 500;  // ms to pause when fully erased
const CURSOR_BLINK = 530;

const SUBTITLE     = "Jimmy Chen: AI/ML-focused software engineer and researcher.";
const SUBTITLE_SPEED = 38; // ms per char — faster than name

type Phase = "typing" | "holding" | "erasing" | "waiting";

function useLoopingTyping(text: string, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("waiting");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function typeChar(i: number) {
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setPhase("holding");
        timer = setTimeout(() => { setPhase("erasing"); eraseChar(text.length - 1); }, HOLD_DONE);
      } else {
        timer = setTimeout(() => typeChar(i + 1), TYPING_SPEED);
      }
    }

    function eraseChar(i: number) {
      setDisplayed(text.slice(0, i));
      if (i <= 0) {
        setPhase("waiting");
        timer = setTimeout(() => { setPhase("typing"); typeChar(1); }, HOLD_EMPTY);
      } else {
        timer = setTimeout(() => eraseChar(i - 1), ERASE_SPEED);
      }
    }

    timer = setTimeout(() => { setPhase("typing"); typeChar(1); }, startDelay);
    return () => clearTimeout(timer);
  }, [text, startDelay]);

  return { displayed, isDone: phase === "holding" };
}

/** One-shot typing that restarts each time `active` flips true→false→true */
function useOneShotTyping(text: string, speed: number, active: boolean) {
  const [displayed, setDisplayed] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!active) { setDisplayed(""); return; }

    let i = 0;
    function tick() {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) timerRef.current = setTimeout(tick, speed);
    }
    timerRef.current = setTimeout(tick, 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, text, speed]);

  return displayed;
}

const ctaIcons: Record<string, React.ReactNode> = {
  GitHub: <Github size={15} />,
  LinkedIn: <Linkedin size={15} />,
  Resume: <FileText size={15} />,
};

function HeroInput() {
  const { displayed, isDone } = useLoopingTyping(siteConfig.hero.inputSequence);
  const [cursorOn, setCursorOn] = useState(true);

  // Blink cursor continuously
  useEffect(() => {
    const t = setInterval(() => setCursorOn(v => !v), CURSOR_BLINK);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Faint radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 42%, rgba(6,182,212,0.07) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* "raw input" label */}
      <motion.div
        className="font-mono text-xs text-white/25 tracking-widest uppercase mb-6 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="w-8 h-px bg-white/15" />
        raw input
        <span className="w-8 h-px bg-white/15" />
      </motion.div>


      {/* ── Terminal block ─────────────────────────────── */}
      <motion.div
        className="mb-10 w-full max-w-xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="rounded-xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.06)]">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/3 border-b border-white/8">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <span className="font-mono text-xs text-white/20 ml-2">python · transformers 4.40</span>
          </div>

          {/* REPL body */}
          <div className="px-5 py-5 bg-white/[0.02] text-left space-y-2">
            {/* Line 1 */}
            <p className="font-mono text-xs leading-relaxed">
              <span className="text-cyber-cyan/50">&gt;&gt;&gt; </span>
              <span className="text-purple-400/70">from</span>
              <span className="text-white/40"> transformers </span>
              <span className="text-purple-400/70">import</span>
              <span className="text-white/40"> BertTokenizer</span>
            </p>
            {/* Line 2 */}
            <p className="font-mono text-xs leading-relaxed">
              <span className="text-cyber-cyan/50">&gt;&gt;&gt; </span>
              <span className="text-white/40">tokenizer = BertTokenizer.from_pretrained(</span>
              <span className="text-amber-400/60">&apos;bert-base-uncased&apos;</span>
              <span className="text-white/40">)</span>
            </p>
            {/* Line 3 — name types here */}
            <p className="font-mono text-xs leading-relaxed">
              <span className="text-cyber-cyan/50">&gt;&gt;&gt; </span>
              <span className="text-white/40">tokenizer.encode(</span>
              <span className="text-amber-400/60">&quot;</span>
              {/* ── The name — large and bright ── */}
              <span className="text-white text-lg font-bold tracking-wide">{displayed}</span>
              <span
                className={cn(
                  "inline-block w-[2px] h-[18px] bg-cyber-cyan ml-0.5 align-middle",
                  cursorOn ? "opacity-100" : "opacity-0"
                )}
              />
              {displayed.length === siteConfig.hero.inputSequence.length && (
                <>
                  <span className="text-amber-400/60">&quot;</span>
                  <span className="text-white/40">)</span>
                </>
              )}
            </p>

            {/* Status line */}
            <AnimatePresence mode="wait">
              {isDone && (
                <motion.p
                  key="status"
                  className="font-mono text-xs text-cyber-cyan/50 pt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ✓ input received · {siteConfig.hero.inputSequence.length} chars · tokenizing...
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* CTA buttons — always visible after mount */}
      <motion.div
        data-pipe-cta-row="hero"
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.45 }}
      >
        {siteConfig.hero.ctaButtons.map((btn) => {
          const isExternal = "external" in btn && btn.external;
          const icon = ctaIcons[btn.label];

          if (btn.variant === "primary") return (
            <a key={btn.label} href={btn.href}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyber-cyan text-black font-semibold text-sm hover:opacity-90 transition-opacity"
            >{icon}{btn.label}</a>
          );

          if (btn.variant === "secondary") return (
            <a key={btn.label} href={btn.href}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-cyber-cyan/30 text-cyber-cyan text-sm hover:bg-cyber-cyan/8 transition-colors"
            >{icon}{btn.label}</a>
          );

          return (
            <a key={btn.label} href={btn.href}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white/50 hover:text-white text-sm transition-colors border border-white/8 hover:border-white/20"
            >{icon}{btn.label}</a>
          );
        })}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <p className="font-mono text-xs text-white/20 tracking-widest">scroll to process</p>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={14} className="text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default memo(HeroInput);
