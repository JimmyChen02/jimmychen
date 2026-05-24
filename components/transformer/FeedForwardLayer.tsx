"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport, fadeUpVariants } from "@/lib/animation";

function NeuronRow({
  count,
  active,
  delay,
  color = "cyber-cyan",
}: {
  count: number;
  active: boolean;
  delay: number;
  color?: string;
}) {
  const dotColor =
    color === "cyber-purple"
      ? "bg-cyber-purple/70"
      : color === "amber"
      ? "bg-amber-400/70"
      : "bg-cyber-cyan/70";

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`rounded-full ${dotColor}`}
          style={{ width: 8, height: 8 }}
          initial={{ scale: 0.3, opacity: 0.2 }}
          animate={
            active
              ? {
                  scale: [0.3, 1, 0.5],
                  opacity: [0.2, 1, 0.4],
                }
              : {}
          }
          whileInView={{ scale: 1, opacity: 0.7 }}
          viewport={defaultViewport}
          transition={
            active
              ? {
                  duration: 0.6,
                  delay: delay + i * 0.05,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }
              : { delay: delay + i * 0.04, duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

function FeedForwardLayer() {
  return (
    <section
      id="feedforward"
      className="relative py-32 px-6 flex flex-col items-center"
      aria-label="Feed-forward network"
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
          Technical Depth
        </h2>
        <p className="text-white/40 font-mono text-sm max-w-md mx-auto">
          FFN(x) = max(0, xW₁ + b₁)W₂ + b₂
        </p>
      </motion.div>

      <div className="w-full max-w-3xl grid md:grid-cols-2 gap-12 items-start">
        {/* MLP diagram */}
        <div className="flex flex-col items-center">
          <motion.p
            className="font-mono text-xs text-white/20 uppercase tracking-widest mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
          >
            MLP Activation
          </motion.p>

          <div
            className="relative p-6 rounded-xl border border-amber-400/20 bg-amber-400/3 w-full flex flex-col gap-6"
          >
            {/* Layer labels */}
            <div className="flex justify-between font-mono text-xs text-white/20 px-2">
              <span>Input</span>
              <span>Hidden × 2</span>
              <span>Output</span>
            </div>

            {/* Input layer */}
            <NeuronRow count={6} active delay={0} color="cyber-cyan" />

            {/* ReLU activation indicator */}
            <motion.div
              className="text-center font-mono text-xs text-amber-400/50"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={defaultViewport}
              transition={{ delay: 0.3 }}
            >
              ReLU ↓
            </motion.div>

            {/* Hidden layer 1 */}
            <NeuronRow count={8} active delay={0.15} color="amber" />

            {/* Hidden layer 2 */}
            <NeuronRow count={8} active delay={0.25} color="amber" />

            <motion.div
              className="text-center font-mono text-xs text-white/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={defaultViewport}
              transition={{ delay: 0.4 }}
            >
              Linear ↓
            </motion.div>

            {/* Output */}
            <NeuronRow count={4} active delay={0.35} color="cyber-purple" />

            {/* Glow */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(251,191,36,0.04) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>

        {/* Coursework */}
        <div>
          <motion.h3
            className="text-sm font-mono uppercase tracking-widest text-white/30 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
          >
            Coursework
          </motion.h3>

          <div className="space-y-3">
            {siteConfig.courses.map((course, i) => (
              <motion.div
                key={course.name}
                className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 transition-colors group"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={defaultViewport}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                {/* Activation dot */}
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
                <div className="flex-1">
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    {course.name}
                  </span>
                </div>
                <span className="font-mono text-xs text-white/20 shrink-0">
                  {course.code}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="mt-6 font-mono text-xs text-white/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={defaultViewport}
            transition={{ delay: 0.6 }}
          >
            dropout: 0.0 &nbsp;// nothing dropped
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default memo(FeedForwardLayer);
