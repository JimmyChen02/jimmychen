"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport, fadeUpVariants, staggerContainer } from "@/lib/animation";

function NodeRow({ count, delay, color = "cyber-cyan" }: { count: number; delay: number; color?: string }) {
  const colorMap: Record<string, string> = {
    "cyber-cyan": "bg-cyber-cyan/60 shadow-glow-sm",
    "cyber-purple": "bg-cyber-purple/60 shadow-glow-purple",
    "sky-400": "bg-sky-400/60",
  };
  const cls = colorMap[color] ?? colorMap["cyber-cyan"];

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${cls}`}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={defaultViewport}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.3,
            type: "spring",
            stiffness: 300,
          }}
        />
      ))}
    </div>
  );
}

function EncoderBlock() {
  return (
    <section
      id="encoder"
      className="relative py-32 px-6 flex flex-col items-center"
      aria-label="Encoder block"
    >
      {/* Stage header */}
      <motion.div
        className="text-center mb-16"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Understanding Jimmy
        </h2>
        <p className="text-white/40 font-mono text-sm max-w-md mx-auto">
          Encoding the full context representation
        </p>
      </motion.div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
        {/* Neural visualization */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="text-xs font-mono text-white/20 uppercase tracking-widest mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
          >
            Encoder Layers
          </motion.div>

          {/* Encoder neural net diagram */}
          <div className="relative p-6 rounded-xl border border-teal-400/20 bg-teal-400/5 w-full max-w-xs">
            <div className="flex flex-col gap-5">
              <NodeRow count={7} delay={0} color="cyber-cyan" />

              {/* Connections hint */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={defaultViewport}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-5 gap-1 w-full px-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 border-l border-teal-400/15 mx-auto"
                    />
                  ))}
                </div>
              </motion.div>

              <NodeRow count={5} delay={0.2} color="cyber-purple" />

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={defaultViewport}
                transition={{ delay: 0.4 }}
              >
                <div className="grid grid-cols-3 gap-1 w-3/4 px-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-6 border-l border-teal-400/15 mx-auto" />
                  ))}
                </div>
              </motion.div>

              <NodeRow count={3} delay={0.4} color="sky-400" />
            </div>

            {/* Glow overlay */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(20,184,166,0.06) 0%, transparent 70%)",
              }}
            />
          </div>

          <motion.p
            className="font-mono text-xs text-white/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
            transition={{ delay: 0.5 }}
          >
            activations: {"{"}7 → 5 → 3{"}"}
          </motion.p>
        </div>

        {/* About me text */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            About Me
          </h3>
          <div className="space-y-4">
            {siteConfig.about.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { delay: i * 0.15, duration: 0.5 },
                  },
                }}
                className="text-white/65 leading-relaxed"
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Context vector representation */}
          <motion.div
            className="mt-8 p-3 rounded-lg border border-teal-400/15 bg-teal-400/5 font-mono text-xs"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white/30">context_vector = </span>
            <span className="text-teal-400">Encoder</span>
            <span className="text-white/30">(embed(Jimmy Chen))</span>
            <br />
            <span className="text-white/20">// shape: [1, 512]  ✓</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(EncoderBlock);
