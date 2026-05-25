"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport, fadeUpVariants, slideInLeft, slideInRight } from "@/lib/animation";
import { Github, Linkedin, Mail, FileText, MapPin, GraduationCap, Cpu } from "lucide-react";

const SKILL_TAGS = [
  { label: "Python",       color: "cyan"   },
  { label: "TypeScript",   color: "blue"   },
  { label: "PyTorch",      color: "purple" },
  { label: "Next.js",      color: "cyan"   },
  { label: "NLP",          color: "teal"   },
  { label: "FastAPI",      color: "blue"   },
  { label: "PostgreSQL",   color: "purple" },
  { label: "Docker",       color: "cyan"   },
  { label: "AWS",          color: "teal"   },
  { label: "LLMs",         color: "purple" },
];

const colorMap: Record<string, string> = {
  cyan:   "border-cyan-400/30   bg-cyan-400/8   text-cyan-300",
  blue:   "border-blue-400/30   bg-blue-400/8   text-blue-300",
  purple: "border-purple-400/30 bg-purple-400/8 text-purple-300",
  teal:   "border-teal-400/30   bg-teal-400/8   text-teal-300",
};

const statsRows = [
  { icon: <GraduationCap size={13} />, label: "School",   value: "Cornell Engineering" },
  { icon: <Cpu           size={13} />, label: "Degree",   value: "B.S. Computer Science" },
  { icon: <Cpu           size={13} />, label: "Focus",    value: "AI / ML · NLP · Systems" },
  { icon: <MapPin        size={13} />, label: "Location", value: "Ithaca, NY" },
];

function AboutSection() {
  return (
    <section
      id="about"
      className="py-28 px-6 max-w-5xl mx-auto"
      aria-label="About section"
    >
      {/* ── Header ───────────────────────────────────────── */}
      <motion.div
        className="mb-16"
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

      {/* ── Two-column layout ────────────────────────────── */}
      <div className="grid md:grid-cols-5 gap-14 items-start">

        {/* Left — bio + links + skill tags */}
        <motion.div
          className="md:col-span-3 space-y-6"
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {siteConfig.about.paragraphs.map((para, i) => (
            <p key={i} className="text-white/60 leading-relaxed text-[0.95rem]">
              {para}
            </p>
          ))}

          {/* Social / contact links */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-sm transition-all"
            >
              <Github size={14} />
              GitHub
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-sm transition-all"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-sm transition-all"
            >
              <Mail size={14} />
              Email
            </a>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-cyan/35 bg-cyber-cyan/6 text-cyber-cyan hover:bg-cyber-cyan/12 text-sm transition-all shadow-[0_0_18px_rgba(6,182,212,0.12)]"
            >
              <FileText size={14} />
              Resume
            </a>
          </div>

          {/* Skill tags */}
          <div className="pt-2">
            <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-3">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_TAGS.map((tag, i) => (
                <motion.span
                  key={tag.label}
                  className={`px-2.5 py-1 rounded-md border font-mono text-xs ${colorMap[tag.color]}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={defaultViewport}
                  transition={{ delay: i * 0.04, duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                >
                  {tag.label}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — portrait + stats card */}
        <motion.div
          className="md:col-span-2 space-y-5"
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {/* Portrait */}
          <div className="relative rounded-2xl overflow-hidden border border-cyber-cyan/15 shadow-[0_0_40px_rgba(6,182,212,0.10)]">
            {/* Cyan radial glow overlay */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.15) 0%, transparent 65%)",
              }}
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5]">
              <Image
                src={siteConfig.about.portraitUrl}
                alt={`${siteConfig.name} portrait`}
                fill
                sizes="(min-width: 768px) 28vw, 90vw"
                className="object-cover object-top"
                priority
              />
            </div>
            {/* Bottom fade so it blends into the stats card */}
            <div
              className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(5,10,18,0.85))",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Stats card */}
          <div className="rounded-xl border border-white/8 bg-white/[0.025] p-5 space-y-4 backdrop-blur-sm">
            {/* Availability badge */}
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-mono text-xs text-emerald-400/80">
                Open to opportunities
              </span>
            </div>

            <div className="h-px bg-white/6" />

            {statsRows.map((row, i) => (
              <motion.div
                key={row.label}
                className="flex items-center justify-between gap-4"
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={defaultViewport}
                transition={{ delay: i * 0.07 }}
              >
                <div className="flex items-center gap-1.5 text-white/30">
                  {row.icon}
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    {row.label}
                  </span>
                </div>
                <span className="text-sm text-white/70 text-right">{row.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(AboutSection);
