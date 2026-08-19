# Shared layouts

## `app/layout.tsx`

Global Next.js shell with metadata, Inter font, navbar, footer, and analytics.

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/data/site";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} — ${siteConfig.role}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ["Jimmy Chen", "Cornell CS", "AI/ML", "NLP", "software engineering", "portfolio", "machine learning", "full-stack"],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.siteUrl,
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
    siteName: `${siteConfig.name} Portfolio`,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} — ${siteConfig.role}` }],
  },
  twitter: { card: "summary_large_image", title: `${siteConfig.name} — ${siteConfig.role}`, description: siteConfig.description, images: [siteConfig.ogImage] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = { themeColor: "#081827", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-cyber-black text-white min-h-screen">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
```

## `components/layout/Navbar.tsx`

Fixed responsive navigation with a mobile drawer.

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import HomeSectionLink from "./HomeSectionLink";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleScroll = useCallback(() => setScrolled(window.scrollY > 40), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMobileOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <motion.header
      className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", scrolled ? "bg-cyber-navy/80 backdrop-blur-md border-b border-knicks-orange/10 shadow-[0_1px_0_rgba(245,132,38,0.1)]" : "bg-transparent")}
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <HomeSectionLink sectionId="hero" className="font-mono text-sm font-semibold text-knicks-orange hover:text-glow-cyan transition-colors duration-200" aria-label="Jimmy Chen — back to top">
          <span className="text-knicks-orange/50">&lt;</span>Jimmy Chen<span className="text-knicks-orange/50"> /&gt;</span>
        </HomeSectionLink>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <HomeSectionLink key={link.href} sectionId={link.href.slice(1)} className="text-sm text-white/60 hover:text-white transition-colors duration-200 relative group">
              {link.label}<span className="absolute -bottom-0.5 left-0 w-0 h-px bg-knicks-orange group-hover:w-full transition-all duration-300" />
            </HomeSectionLink>
          ))}
          <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm px-4 py-1.5 rounded-md border border-knicks-orange/40 text-knicks-orange hover:bg-knicks-orange/10 hover:border-knicks-orange transition-all duration-200 font-mono">Resume</a>
        </div>
        <button className="md:hidden text-white/70 hover:text-white p-1" onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="md:hidden border-t border-knicks-orange/10 bg-cyber-navy/95 backdrop-blur-md overflow-hidden">
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => <HomeSectionLink key={link.href} sectionId={link.href.slice(1)} onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white transition-colors py-1">{link.label}</HomeSectionLink>)}
              <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="text-knicks-orange font-mono text-sm">Resume ↗</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
```

## `components/layout/Footer.tsx`

Three-column portfolio footer.

```tsx
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { siteConfig } from "@/data/site";
import HomeSectionLink from "./HomeSectionLink";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-knicks-orange/10 bg-cyber-navy/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div><p className="font-mono text-knicks-orange text-sm mb-2">Jimmy Chen</p><p className="text-white/40 text-xs leading-relaxed max-w-xs">CS student at Cornell Engineering. Building at the intersection of AI, ML, NLP, and software systems.</p></div>
          <div><p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-mono">Navigate</p><ul className="space-y-2">{[{ label: "Work", href: "#work" }, { label: "Experience", href: "#experience" }, { label: "About", href: "#about" }, { label: "Contact", href: "#contact" }].map((l) => <li key={l.href}><HomeSectionLink sectionId={l.href.slice(1)} className="text-white/50 hover:text-white text-sm transition-colors">{l.label}</HomeSectionLink></li>)}</ul></div>
          <div><p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-mono">Connect</p><div className="flex gap-4"><a href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-white/40 hover:text-knicks-orange transition-colors"><Github size={18} /></a><a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/40 hover:text-knicks-orange transition-colors"><Linkedin size={18} /></a><a href={`mailto:${siteConfig.email}`} aria-label="Email" className="text-white/40 hover:text-knicks-orange transition-colors"><Mail size={18} /></a><a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Resume" className="text-white/40 hover:text-knicks-orange transition-colors"><ExternalLink size={18} /></a></div></div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2"><p className="text-white/50 text-xs font-mono">© {year} Jimmy Chen. All rights reserved.</p><p className="text-white/45 text-xs font-mono">Built with Next.js · Framer Motion · Tailwind</p></div>
      </div>
    </footer>
  );
}
```
