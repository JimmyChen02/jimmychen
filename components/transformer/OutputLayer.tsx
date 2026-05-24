"use client";

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport } from "@/lib/animation";
import { Github, Linkedin, FileText, Mail } from "lucide-react";

const OUTPUT_TEXT = "Jimmy Chen: AI/ML-focused software engineer and researcher.";
const TYPING_SPEED = 45;

function useTypingAnimation(text: string, triggered: boolean) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!triggered) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, TYPING_SPEED);
    return () => clearInterval(timer);
  }, [text, triggered]);

  return displayed;
}

const ctaIcons: Record<string, React.ReactNode> = {
  "View Resume": <FileText size={16} />,
  GitHub: <Github size={16} />,
  LinkedIn: <Linkedin size={16} />,
  "Email Me": <Mail size={16} />,
};

function OutputLayer() {
  const [inView, setInView] = useState(false);
  const displayed = useTypingAnimation(OUTPUT_TEXT, inView);

  return (
    <section
      id="output"
      className="relative py-40 px-6 flex flex-col items-center text-center overflow-hidden"
      aria-label="Final output"
    >
      {/* Glow radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Viewport trigger — invisible, just fires setInView */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onViewportEnter={() => setInView(true)}
        viewport={defaultViewport}
      />

      {/* Inference complete indicator */}
      <motion.div
        className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/5"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={defaultViewport}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-cyber-cyan"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="font-mono text-xs text-cyber-cyan">
          inference complete
        </span>
      </motion.div>

      {/* Output token box */}
      <motion.div
        className="mb-10 max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={defaultViewport}
        transition={{ delay: 0.3 }}
      >
        <div className="p-6 rounded-2xl border border-cyber-cyan/30 bg-cyber-cyan/5 shadow-glow-lg backdrop-blur-sm">
          <p className="font-mono text-xs text-white/30 mb-3 text-left">
            output:
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white text-left leading-snug min-h-[3em]">
            {displayed}
            {displayed.length < OUTPUT_TEXT.length && (
              <motion.span
                className="inline-block w-0.5 h-7 bg-cyber-cyan ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>
        </div>
      </motion.div>

      {/* Confidence score */}
      <motion.p
        className="font-mono text-xs text-white/25 mb-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={defaultViewport}
        transition={{ delay: 1.2 }}
      >
        confidence: 0.97 &nbsp;|&nbsp; temperature: 0.7
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={defaultViewport}
        transition={{ delay: 1.4 }}
      >
        {siteConfig.output.ctaButtons.map((btn, i) => {
          const icon = ctaIcons[btn.label];
          const isExternal = "external" in btn && btn.external;

          if (btn.variant === "primary") {
            return (
              <a
                key={btn.label}
                href={btn.href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyber-cyan text-cyber-black font-semibold text-sm hover:bg-glow-cyan transition-colors shadow-glow-sm"
              >
                {icon}
                {btn.label}
              </a>
            );
          }

          if (btn.variant === "secondary") {
            return (
              <a
                key={btn.label}
                href={btn.href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-cyber-cyan/40 text-cyber-cyan text-sm hover:bg-cyber-cyan/10 hover:border-cyber-cyan transition-all"
              >
                {icon}
                {btn.label}
              </a>
            );
          }

          return (
            <a
              key={btn.label}
              href={btn.href}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white/60 hover:text-white text-sm border border-white/10 hover:border-white/20 transition-colors"
            >
              {icon}
              {btn.label}
            </a>
          );
        })}
      </motion.div>
    </section>
  );
}

export default memo(OutputLayer);
