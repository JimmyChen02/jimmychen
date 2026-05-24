"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport, fadeUpVariants, staggerContainer } from "@/lib/animation";

const categoryLabels: Record<string, string> = {
  lang: "Languages",
  framework: "Frameworks & Libraries",
  ml: "ML / AI",
  data: "Databases",
  infra: "Infrastructure",
};

const categoryOrder = ["lang", "ml", "framework", "data", "infra"];

const skillColors: Record<string, string> = {
  lang: "border-cyber-cyan/30 text-cyber-cyan/80",
  framework: "border-cyber-purple/30 text-cyber-purple/80",
  ml: "border-amber-400/30 text-amber-400/80",
  data: "border-teal-400/30 text-teal-400/80",
  infra: "border-sky-400/30 text-sky-400/80",
};

function SkillsSection() {
  const grouped = categoryOrder.reduce<Record<string, typeof siteConfig.skills>>(
    (acc, cat) => {
      acc[cat] = siteConfig.skills.filter((s) => s.category === cat);
      return acc;
    },
    {}
  );

  return (
    <section
      id="skills"
      className="py-24 px-6 max-w-5xl mx-auto"
      aria-label="Skills section"
    >
      <motion.div
        className="mb-14"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <p className="font-mono text-xs text-cyber-cyan/50 uppercase tracking-widest mb-2">
          / skills
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Technical Skills
        </h2>
      </motion.div>

      <div className="space-y-10">
        {categoryOrder.map((cat, ci) => {
          const skills = grouped[cat];
          if (!skills?.length) return null;
          const colorClass = skillColors[cat] ?? "border-white/20 text-white/60";

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={defaultViewport}
              transition={{ delay: ci * 0.08 }}
            >
              <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">
                {categoryLabels[cat]}
              </p>
              <motion.div
                className="flex flex-wrap gap-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
              >
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill.name}
                    variants={{
                      hidden: { opacity: 0, scale: 0.85 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { delay: i * 0.04, duration: 0.3 },
                      },
                    }}
                    className={`px-3 py-1.5 rounded-md border text-sm font-mono ${colorClass} bg-white/3 hover:bg-white/6 transition-colors cursor-default`}
                    whileHover={{ scale: 1.04 }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default memo(SkillsSection);
