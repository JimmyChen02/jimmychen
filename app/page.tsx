import Link from "next/link";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { fetchEnrichedRepos } from "@/lib/github";
import { mergeProjects, getFeaturedProjects } from "@/lib/projects";
import { siteConfig } from "@/data/site";
import HomeSectionScrollRestorer from "@/components/layout/HomeSectionScrollRestorer";
import CinematicBackground from "@/components/visuals/CinematicBackground";
import MotionReveal from "@/components/motion/MotionReveal";
import ScrollCinematicHero from "@/components/visuals/ScrollCinematicHero";
import PhotographySection from "@/components/sections/PhotographySection";

export const revalidate = 3600;

const skillGroups = [
  { label: "Languages", skills: ["Python", "Swift", "JavaScript", "OCaml", "Java"] },
  { label: "AI / ML", skills: ["PyTorch", "TensorFlow", "Core ML", "CUDA"] },
  { label: "Apps & APIs", skills: ["SwiftUI", "FastAPI", "PostgreSQL", "Supabase", "MapKit", "HealthKit"] },
  { label: "Cloud & Test", skills: ["AWS", "Docker", "GitHub Actions", "pytest", "Git"] },
];

const projectSignals = ["Research / iOS", "Systems / Architecture", "Product / Full-stack"];

function SectionTitle({ folio, children }: { folio: string; children: React.ReactNode }) {
  return (
    <MotionReveal>
      <span className="folio-number mb-4 block">{folio}</span>
      <h2 className="text-4xl font-semibold tracking-tight text-paper sm:text-5xl">{children}</h2>
    </MotionReveal>
  );
}

const railSignals = ["researching touch + grip", "debugging OCaml crops", "running with Stridr", "probably drinking coffee"];

function KineticRail() {
  const sequence = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {railSignals.map((signal) => (
        <div key={signal} className="flex items-center">
          <span className="whitespace-nowrap px-7 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/55 sm:px-10">{signal}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-knicks-orange" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-paper/10 bg-cyber-navy/30 py-4" aria-label={railSignals.join(", ")}>
      <div className="kinetic-track">
        {sequence}
        {sequence}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const repos = await fetchEnrichedRepos();
  const projects = mergeProjects(repos);
  const featuredProjects = getFeaturedProjects(projects).slice(0, 3);

  return (
    <>
      <HomeSectionScrollRestorer />
      <CinematicBackground />
      <main className="editorial-home relative z-10 text-paper">
        <ScrollCinematicHero />

        <KineticRail />

        <section id="work" className="ruled-divider bg-cyber-navy/20 pb-24 pt-16" aria-labelledby="work-title">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-20 grid items-end gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <SectionTitle folio="01 — Things I've built">
                  Selected <span className="editorial-serif font-normal italic">projects</span>
                </SectionTitle>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link href="/projects" className="inline-flex min-h-10 cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper-muted transition-colors hover:text-knicks-orange">
                  Index of all projects <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-paper/10 border-y border-paper/10">
              {featuredProjects.map((project, index) => (
                <MotionReveal key={project.slug} direction={index % 2 === 0 ? "left" : "right"} delay={index * 0.06}>
                <article className="group grid gap-6 py-12 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-1">
                    <span className="font-mono text-5xl text-paper/10 transition-colors duration-300 group-hover:text-knicks-orange/30">0{index + 1}</span>
                  </div>
                  <div className="lg:col-span-7">
                    <h3 className="text-2xl font-semibold text-paper transition-colors duration-200 group-hover:text-knicks-orange">{project.title}</h3>
                    <p className="mt-4 max-w-2xl leading-7 text-paper-muted">{project.description}</p>
                    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="font-mono text-[10px] uppercase tracking-widest text-paper/45">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col lg:col-span-4 lg:items-end lg:text-right">
                    <div className="flex flex-wrap gap-4">
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm text-paper transition-colors hover:text-knicks-orange">
                          Live demo <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      )}
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm text-paper transition-colors hover:text-knicks-orange">
                        View source <Github size={15} aria-hidden="true" />
                      </a>
                    </div>
                    <p className="mt-auto hidden font-mono text-[10px] uppercase tracking-widest text-paper/25 lg:block">Signal type: {projectSignals[index]}</p>
                  </div>
                </article>
                </MotionReveal>
              ))}
            </div>

            <MotionReveal>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/projects"
                  className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-knicks-orange px-6 py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-orange-300"
                >
                  View all projects
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </MotionReveal>
          </div>
        </section>

        <section id="experience" className="ruled-divider py-24" aria-labelledby="experience-title">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionTitle folio="02 — Where I've worked">
                Experience <span className="editorial-serif font-normal italic">so far</span>
              </SectionTitle>
              <p className="mt-6 max-w-xs leading-7 text-paper-muted">Technical depth paired with product execution across research labs and industry.</p>
            </div>
            <div className="divide-y divide-paper/10 border-y border-paper/10 lg:col-span-8">
              {siteConfig.experience.map((item, index) => (
                <MotionReveal key={`${item.role}-${item.organization}`} delay={index * 0.06}>
                <article className="grid gap-4 py-9 md:grid-cols-4 md:gap-8">
                  <p className="pt-1 font-mono text-xs uppercase tracking-wider text-paper/40">{item.period}</p>
                  <div className="md:col-span-3">
                    <h3 className="text-xl font-semibold text-paper">{item.role}</h3>
                    <p className="mt-1 font-mono text-xs text-knicks-orange">{item.organization}</p>
                    <p className="mt-4 text-sm leading-6 text-paper-muted">{item.summary}</p>
                  </div>
                </article>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="ruled-divider bg-cyber-navy/10 py-24" aria-labelledby="about-title">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 max-w-3xl">
              <SectionTitle folio="03 — A bit about me">
                Tools, school, and <span className="editorial-serif font-normal italic">curiosity</span>
              </SectionTitle>
            </div>

            <div className="grid gap-14 md:grid-cols-2 md:gap-16">
              <MotionReveal direction="left">
              <article className="relative border-l border-knicks-orange/25 pl-6">
                <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-knicks-orange">Education</h3>
                <p className="text-xl font-semibold text-paper">Cornell University</p>
                <p className="mt-1 text-paper-muted">College of Engineering</p>
                <p className="editorial-serif mt-4 text-sm italic text-paper/70">{siteConfig.education.degree} · {siteConfig.education.minor}</p>
                <div className="mt-6 flex gap-8 border-t border-paper/10 pt-4 font-mono text-[10px] uppercase tracking-widest text-paper/40">
                  <span>{siteConfig.education.expected.replace("Expected ", "")}</span>
                  <span>{siteConfig.education.location}</span>
                </div>
              </article>
              </MotionReveal>

              <MotionReveal direction="right" delay={0.08}>
              <article className="relative border-l border-knicks-blue/30 pl-6">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#55A7E5]">Core toolkit</h3>
                <p className="mb-7 mt-3 max-w-md text-sm leading-6 text-paper/55">
                  The technologies I reach for most across ML, mobile, and full-stack work.
                </p>
                <div className="grid gap-px overflow-hidden border border-paper/10 bg-paper/10 sm:grid-cols-2">
                  {skillGroups.map((group, index) => (
                    <div key={group.label} className="bg-cyber-black/95 p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#55A7E5]">
                        0{index + 1} / {group.label}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                        {group.skills.map((skill) => (
                          <span key={skill} className="border-b border-paper/10 pb-1 text-sm text-paper-muted">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              </MotionReveal>
            </div>

          </div>
        </section>

        <PhotographySection />

        <section id="contact" className="ruled-divider py-28 sm:py-32" aria-labelledby="contact-title">
          <div className="mx-auto max-w-6xl px-6">
            <MotionReveal>
              <span className="folio-number mb-8 block">05 — Say hello</span>
              <div className="max-w-5xl">
              <h2 id="contact-title" className="text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-paper sm:text-6xl lg:text-7xl">
                Let&apos;s <span className="editorial-serif font-normal italic text-knicks-orange">Connect!</span>
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-paper-muted sm:text-xl">I&apos;m always happy to talk about software architecture, ML systems, research, or opportunities to build useful tools.</p>
              <div className="mt-14 grid gap-8 md:grid-cols-2">
                <a href={`mailto:${siteConfig.email}`} className="group min-h-16 cursor-pointer border-t border-paper/15 pt-4">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-paper/40">Primary contact</span>
                  <span className="mt-2 block text-xl text-paper underline decoration-paper/10 underline-offset-8 transition-colors group-hover:text-knicks-orange sm:text-2xl">{siteConfig.email}</span>
                </a>
                <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="group min-h-16 cursor-pointer border-t border-paper/15 pt-4">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-paper/40">Network</span>
                  <span className="mt-2 block text-xl text-paper underline decoration-paper/10 underline-offset-8 transition-colors group-hover:text-knicks-orange sm:text-2xl">linkedin.com/in/jimmychen02</span>
                </a>
              </div>
              </div>
            </MotionReveal>
          </div>
        </section>
      </main>
    </>
  );
}
