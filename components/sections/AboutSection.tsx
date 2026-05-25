"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import {
  defaultViewport,
  fadeUpVariants,
  slideInLeft,
  slideInRight,
} from "@/lib/animation";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  MapPin,
  GraduationCap,
  Cpu,
} from "lucide-react";

// ── Skill badge color by category ─────────────────────────────────────────────
// To update skills: edit siteConfig.skills in data/site.ts.
// When pulling from resume / LinkedIn, deduplicate by `name` there before
// writing back to site.ts — this component will update automatically.
const CATEGORY_COLOR: Record<string, string> = {
  lang:      "border-blue-400/35   bg-blue-400/8   text-blue-300",
  ml:        "border-purple-400/35 bg-purple-400/8 text-purple-300",
  framework: "border-cyan-400/35   bg-cyan-400/8   text-cyan-300",
  data:      "border-teal-400/35   bg-teal-400/8   text-teal-300",
  infra:     "border-sky-400/35    bg-sky-400/8    text-sky-300",
  other:     "border-white/20      bg-white/5      text-white/60",
};

const statsRows = [
  { icon: <GraduationCap size={13} />, label: "School",   value: "Cornell Engineering"   },
  { icon: <Cpu           size={13} />, label: "Degree",   value: "B.S. Computer Science" },
  { icon: <Cpu           size={13} />, label: "Focus",    value: "AI / ML · NLP · Systems" },
  { icon: <MapPin        size={13} />, label: "Location", value: "Ithaca, NY"            },
];

function AboutSection() {
  // Deduplicate skills by name (safe guard for future resume/LinkedIn merges)
  const skills = siteConfig.skills.filter(
    (s, i, arr) => arr.findIndex((x) => x.name === s.name) === i
  );

  return (
    <section
      id="about"
      className="py-28 px-6 max-w-5xl mx-auto"
      aria-label="About section"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
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

      {/* ── Two-column grid — columns stretch to equal height ─────────────── */}
      <div className="grid md:grid-cols-5 gap-14 md:items-stretch">

        {/* Left — bio + links + skill tags ──────────────────────────────── */}
        <motion.div
          className="md:col-span-3 flex flex-col gap-5"
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {/* Bio paragraphs */}
          <div className="space-y-5">
            {siteConfig.about.paragraphs.map((para, i) => (
              <p key={i} className="text-white/60 leading-relaxed text-[0.95rem]">
                {para}
              </p>
            ))}
          </div>

          {/* Social / contact links */}
          <div className="flex flex-wrap gap-2.5">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-sm transition-all"
            >
              <Github size={14} /> GitHub
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-sm transition-all"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-sm transition-all"
            >
              <Mail size={14} /> Email
            </a>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-cyan/35 bg-cyber-cyan/6 text-cyber-cyan hover:bg-cyber-cyan/12 text-sm transition-all shadow-[0_0_18px_rgba(6,182,212,0.12)]"
            >
              <FileText size={14} /> Resume
            </a>
          </div>

          {/* Skill badge row — driven by siteConfig.skills */}
          <div className="pt-2">
            <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-3">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill.name}
                  className={`px-2.5 py-1 rounded-md border font-mono text-xs ${
                    CATEGORY_COLOR[skill.category] ?? CATEGORY_COLOR.other
                  }`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={defaultViewport}
                  transition={{
                    delay: i * 0.035,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — portrait + stats card ────────────────────────────────── */}
        <motion.div
          className="md:col-span-2 flex flex-col gap-4"
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {/* Portrait — flex-1 + min-h-0 so it fills whatever space is left
              after the stats card, keeping both columns the same height.
              No fixed aspect ratio; the grid row height drives it.           */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-cyber-cyan/15 shadow-[0_0_40px_rgba(6,182,212,0.10)]">
            {/* Top cyan radial glow */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.14) 0%, transparent 60%)",
              }}
              aria-hidden="true"
            />
            <Image
              src={siteConfig.about.portraitUrl}
              alt={`${siteConfig.name} portrait`}
              fill
              sizes="(min-width: 768px) 28vw, 90vw"
              className="object-cover object-center"
              priority
            />
            {/* Bottom fade into stats card */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(5,10,18,0.75))",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Stats card */}
          <div className="rounded-xl border border-white/8 bg-white/[0.025] p-5 space-y-4 backdrop-blur-sm shrink-0">
            {/* Availability pulse */}
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
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
                <span className="text-sm text-white/70 text-right">
                  {row.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(AboutSection);
