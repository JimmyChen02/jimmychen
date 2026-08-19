"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import HomeSectionLink from "./HomeSectionLink";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Photos", href: "#photography" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleScroll = useCallback(() => setScrolled(window.scrollY > 32), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const handleResize = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };
    query.addEventListener("change", handleResize);
    return () => query.removeEventListener("change", handleResize);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200",
        scrolled || mobileOpen
          ? "border-paper/10 bg-cyber-black/95 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Primary navigation">
        <HomeSectionLink sectionId="hero" className="group inline-flex min-h-10 cursor-pointer items-center font-mono text-xs uppercase tracking-[0.16em] text-paper" aria-label="Jimmy Chen — back to top">
          jimmy<span className="text-knicks-orange">.chen()</span>
        </HomeSectionLink>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <HomeSectionLink key={link.href} sectionId={link.href.slice(1)} className="relative min-h-10 cursor-pointer py-3 text-sm text-paper-muted transition-colors hover:text-paper">
              {link.label}
            </HomeSectionLink>
          ))}
          <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 cursor-pointer items-center border border-paper/20 px-4 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:border-knicks-orange hover:text-knicks-orange">
            Resume
          </a>
        </div>

        <button className="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center text-paper-muted transition-colors hover:text-paper md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-paper/10 bg-cyber-black md:hidden">
            <div className="flex flex-col px-6 py-4">
              {navLinks.map((link, index) => (
                <HomeSectionLink key={link.href} sectionId={link.href.slice(1)} onClick={() => setMobileOpen(false)} className="flex min-h-12 cursor-pointer items-center justify-between border-b border-paper/10 text-paper-muted transition-colors hover:text-paper">
                  <span>{link.label}</span><span className="font-mono text-[10px] text-paper/30">0{index + 1}</span>
                </HomeSectionLink>
              ))}
              <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center bg-knicks-orange px-4 font-mono text-xs uppercase tracking-wider text-cyber-black">
                Open resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
