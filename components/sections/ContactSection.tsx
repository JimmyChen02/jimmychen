"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { defaultViewport, fadeUpVariants } from "@/lib/animation";
import { Mail, Github, Linkedin, FileText, ArrowRight } from "lucide-react";

const links = [
  {
    icon: <Mail size={20} />,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    description: "Best for detailed questions",
  },
  {
    icon: <Github size={20} />,
    label: "GitHub",
    value: "@JimmyChen02",
    href: siteConfig.github,
    description: "See my code",
    external: true,
  },
  {
    icon: <Linkedin size={20} />,
    label: "LinkedIn",
    value: "in/jimmychen02",
    href: siteConfig.linkedin,
    description: "Let's connect professionally",
    external: true,
  },
  {
    icon: <FileText size={20} />,
    label: "Resume",
    value: "Download PDF",
    href: siteConfig.resumeUrl,
    description: "Full experience & education",
    external: true,
  },
];

function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24 px-6 max-w-5xl mx-auto"
      aria-label="Contact section"
    >
      <motion.div
        className="mb-14"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <p className="font-mono text-xs text-cyber-cyan/50 uppercase tracking-widest mb-2">
          / contact
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Get In Touch
        </h2>
        <p className="text-white/50 max-w-lg leading-relaxed">
          I&apos;m currently open to research collaborations, internship
          opportunities, and interesting projects. Feel free to reach out.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        {links.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex items-start gap-4 p-5 rounded-xl border border-white/8 bg-white/3 hover:border-cyber-cyan/30 hover:bg-white/5 transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -2 }}
          >
            <span className="text-cyber-cyan/60 group-hover:text-cyber-cyan transition-colors mt-0.5 shrink-0">
              {link.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-white/30 mb-0.5">{link.label}</p>
              <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">
                {link.value}
              </p>
              <p className="text-xs text-white/35 mt-0.5">{link.description}</p>
            </div>
            <ArrowRight
              size={15}
              className="text-white/20 group-hover:text-cyber-cyan group-hover:translate-x-1 transition-all mt-1 shrink-0"
            />
          </motion.a>
        ))}
      </div>
    </section>
  );
}

export default memo(ContactSection);
