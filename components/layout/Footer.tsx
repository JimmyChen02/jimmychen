import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { siteConfig } from "@/data/site";
import HomeSectionLink from "./HomeSectionLink";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cyber-cyan/10 bg-cyber-navy/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="font-mono text-cyber-cyan text-sm mb-2">Jimmy Chen</p>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs">
              CS student at Cornell Engineering. Building at the intersection of
              AI, ML, NLP, and software systems.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-mono">
              Navigate
            </p>
            <ul className="space-y-2">
              {[
                { label: "Projects", href: "#projects" },
                { label: "About", href: "#about" },
                { label: "Skills", href: "#skills" },
                { label: "Contact", href: "#contact" },
              ].map((l) => (
                <li key={l.href}>
                  <HomeSectionLink
                    sectionId={l.href.slice(1)}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </HomeSectionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-mono">
              Connect
            </p>
            <div className="flex gap-4">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-white/40 hover:text-cyber-cyan transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/40 hover:text-cyber-cyan transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="text-white/40 hover:text-cyber-cyan transition-colors"
              >
                <Mail size={18} />
              </a>
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume"
                className="text-white/40 hover:text-cyber-cyan transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/25 text-xs font-mono">
            © {year} Jimmy Chen. All rights reserved.
          </p>
          <p className="text-white/20 text-xs font-mono">
            Built with Next.js · Framer Motion · Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
