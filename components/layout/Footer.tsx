import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import HomeSectionLink from "./HomeSectionLink";

export default function Footer() {
  return (
    <footer className="border-t border-paper/15 bg-cyber-black">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs text-knicks-orange">jimmy.chen()</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-paper-muted">A small corner of the internet for experiments, research, and software I cared enough to finish.</p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">New York / Ithaca</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-[1.35fr_1fr]">
            <div className="border-t border-paper/10 pt-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">01 / Navigate</p>
              <nav className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-paper-muted sm:grid-cols-3" aria-label="Footer navigation">
                <HomeSectionLink sectionId="work" className="cursor-pointer transition-colors duration-200 hover:text-knicks-orange">Work</HomeSectionLink>
                <HomeSectionLink sectionId="experience" className="cursor-pointer transition-colors duration-200 hover:text-knicks-orange">Experience</HomeSectionLink>
                <HomeSectionLink sectionId="photography" className="cursor-pointer transition-colors duration-200 hover:text-knicks-orange">Photography</HomeSectionLink>
                <HomeSectionLink sectionId="contact" className="cursor-pointer transition-colors duration-200 hover:text-knicks-orange">Contact</HomeSectionLink>
                <Link href="/projects" className="cursor-pointer transition-colors duration-200 hover:text-knicks-orange">Projects</Link>
              </nav>
            </div>

            <div className="border-t border-paper/10 pt-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">02 / Connect</p>
              <div className="mt-4 grid gap-3 text-sm text-paper-muted">
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="group inline-flex w-fit cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-knicks-orange">
                  GitHub <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
                <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex w-fit cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-knicks-orange">
                  LinkedIn <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
                <a href={`mailto:${siteConfig.email}`} className="group inline-flex w-fit cursor-pointer items-center gap-1.5 transition-colors duration-200 hover:text-knicks-orange">
                  Email <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
