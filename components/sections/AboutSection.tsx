"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport, fadeUpVariants, staggerContainer, slideInLeft, slideInRight } from "@/lib/animation";
import { Github, Linkedin, Mail, FileText } from "lucide-react";

function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 px-6 max-w-5xl mx-auto"
      aria-label="About section"
    >
      {/* Section header */}
      <motion.div
        className="mb-14"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <p className="font-mono text-xs text-cyber-cyan/50 uppercase tracking-widest mb-2">
          / about
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">About Me</h2>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-12 items-start">
        {/* Text column */}
        <motion.div
          className="md:col-span-3 space-y-5"
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {siteConfig.about.paragraphs.map((para, i) => (
            <p key={i} className="text-white/65 leading-relaxed text-base">
              {para}
            </p>
          ))}

          {/* Social links */}
          <div className="pt-4 flex flex-wrap gap-3">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-all"
            >
              <Github size={15} />
              GitHub
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-all"
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-all"
            >
              <Mail size={15} />
              Email
            </a>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 text-sm transition-all"
            >
              <FileText size={15} />
              Resume
            </a>
          </div>
        </motion.div>

        {/* Stats column */}
        <motion.div
          className="md:col-span-2"
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <div className="p-6 rounded-xl border border-white/8 bg-white/3 space-y-5">
            {[
              { label: "School", value: "Cornell Engineering" },
              { label: "Degree", value: "B.S. Computer Science" },
              { label: "Focus", value: "AI/ML, NLP, Systems" },
              { label: "Status", value: "Open to opportunities" },
              { label: "Location", value: "Ithaca, NY" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="flex justify-between gap-4"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={defaultViewport}
                transition={{ delay: i * 0.08 }}
              >
                <span className="font-mono text-xs text-white/30">{item.label}</span>
                <span className="text-sm text-white/70 text-right">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(AboutSection);
