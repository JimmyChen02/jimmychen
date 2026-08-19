"use client";

import { useRef } from "react";
import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Aperture, ArrowDown, ArrowRight, Github, Linkedin } from "lucide-react";
import { siteConfig } from "@/data/site";

export default function ScrollCinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const introOpacity = useTransform(scrollYProgress, [0, 0.16, 0.28], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.28], [0, -70]);
  const cameraRotation = useTransform(scrollYProgress, [0.04, 0.92], [-8, 352]);
  const cameraScale = useTransform(scrollYProgress, [0, 0.18, 0.62, 0.9], [0.74, 0.96, 1.08, 0.8]);
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.08, 0.76, 0.94], [0.18, 0.82, 0.9, 0]);
  const lensRotation = useTransform(scrollYProgress, [0.04, 0.92], [0, -720]);
  const photoStoryOpacity = useTransform(scrollYProgress, [0.26, 0.4, 0.62, 0.73], [0, 1, 1, 0]);
  const photoStoryY = useTransform(scrollYProgress, [0.26, 0.42], [34, 0]);
  const finalOpacity = useTransform(scrollYProgress, [0.72, 0.86], [0, 1]);
  const finalY = useTransform(scrollYProgress, [0.72, 0.88], [42, 0]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduceMotion) {
    return (
      <section id="hero" className="mx-auto max-w-6xl px-6 pb-24 pt-32 lg:pb-32 lg:pt-44" aria-labelledby="hero-title">
        <p className="mb-6 font-mono text-xs text-knicks-orange">hello, world — I&apos;m</p>
        <h1 id="hero-title" className="text-6xl font-semibold tracking-[-0.055em] text-paper sm:text-7xl lg:text-8xl">Jimmy Chen<span className="text-knicks-orange">.</span></h1>
        <p className="editorial-serif mt-6 max-w-3xl text-2xl italic leading-relaxed text-paper-muted">Cornell CS + AI student, software builder, model trainer, photographer, and fashionista. I like systems that help people notice the world differently.</p>
        <div className="mt-12"><CameraLineArt /></div>
        <HeroActions />
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="hero" className="relative h-[245vh]" aria-labelledby="hero-title">
      <div className="sticky top-0 h-screen overflow-hidden bg-cyber-black">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(243,239,228,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(243,239,228,.035)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden="true" />
        <div className="absolute bottom-8 right-6 z-30 flex items-end gap-3 font-mono text-[9px] uppercase tracking-[0.18em] text-paper/30 sm:right-10">scroll<div className="h-14 w-px bg-paper/10"><motion.div className="h-full origin-top bg-knicks-orange" style={{ scaleY: progressScale }} /></div></div>

        <motion.div className="absolute inset-0 z-10 flex items-center px-6" style={{ opacity: introOpacity, y: introY }}>
          <div className="mx-auto w-full max-w-6xl">
            <p className="mb-6 font-mono text-xs text-knicks-orange">hello, world — I&apos;m</p>
            <h1 id="hero-title" className="text-[clamp(4rem,12vw,9.5rem)] font-semibold leading-[.83] tracking-[-0.07em] text-paper">Jimmy<br />Chen<span className="text-knicks-orange">.</span></h1>
            <p className="editorial-serif mt-8 max-w-lg text-xl italic leading-relaxed text-paper-muted sm:text-2xl">Cornell CS + AI student, software builder, model trainer, photographer, and fashionista.</p>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" aria-hidden="true">
          <motion.div className="w-[min(100vw,80rem)]" style={{ rotate: cameraRotation, scale: cameraScale, opacity: cameraOpacity }}>
            <CameraLineArt lensRotation={lensRotation} />
          </motion.div>
        </div>

        <motion.div className="absolute inset-0 z-10 flex items-center px-6" style={{ opacity: photoStoryOpacity, y: photoStoryY }}>
          <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-knicks-orange">away from the keyboard</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-paper sm:text-6xl">I collect<br /><span className="editorial-serif font-normal italic text-knicks-orange">small moments.</span></h2>
            </div>
            <p className="self-end text-base leading-7 text-paper-muted sm:max-w-sm sm:justify-self-end">I enjoy heading outside for hikes and trips to the seashore, taking pictures to capture the small things in life. I love collecting little snippets of moments that I can later turn into stories and share with friends.</p>
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 z-20 flex items-center bg-cyber-black/95 px-6" style={{ opacity: finalOpacity, y: finalY }}>
          <div className="mx-auto w-full max-w-7xl text-center">
            <h2 className="font-semibold leading-[1.02] tracking-[-0.05em] text-paper">
              <span className="block text-[clamp(2.25rem,6.8vw,6.5rem)]">I write software.</span>
              <span className="my-2 block font-mono text-xs font-normal tracking-[0.18em] text-paper/35 sm:text-sm">and</span>
              <span className="editorial-serif block whitespace-nowrap text-[clamp(1.45rem,5.35vw,5.15rem)] font-normal italic leading-[1.05] tracking-[-0.045em] text-knicks-orange">I take pictures to share stories.</span>
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-paper-muted">Explore my engineering work, then stop by my photo journal!</p>
            <HeroActions />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CameraLineArt({ lensRotation }: { lensRotation?: MotionValue<number> }) {
  return (
    <div className="camera-blueprint relative mx-auto aspect-[128/78] w-full max-w-6xl text-paper/55" aria-hidden="true">
      <div className="absolute inset-x-[4%] bottom-[8%] top-[19%] rounded-[clamp(1rem,3vw,2.5rem)] border-2 border-current bg-cyber-black/20 shadow-[0_0_70px_rgba(0,107,182,.12)]">
        <div className="absolute inset-x-0 top-[31%] border-t border-paper/20" />
        <div className="absolute bottom-[8%] left-[4%] right-[4%] h-[34%] rounded-[1.25rem] border border-dashed border-paper/15" />
        <div className="absolute bottom-[9%] right-[3%] h-[53%] w-[14%] rounded-l-[45%] border-l-2 border-knicks-orange/45 bg-knicks-orange/[0.025]" />

        <div className="absolute left-[10%] top-[15%] h-[22%] w-[15%] rounded-md border-2 border-paper/45">
          <div className="absolute inset-[18%] rounded-sm border border-knicks-blue/60" />
          <div className="absolute inset-[38%] rounded-full bg-knicks-blue/45" />
        </div>
        <div className="absolute left-[29%] top-[19%] h-[12%] w-[13%] rounded-sm border border-paper/35">
          <div className="absolute inset-x-[12%] top-1/2 border-t border-dashed border-paper/30" />
        </div>
        <div className="absolute left-[7%] top-[48%] h-[8%] w-[4%] rounded-full border border-knicks-orange/50" />
        <div className="absolute right-[8%] top-[12%] font-mono text-[clamp(.45rem,1.2vw,.8rem)] tracking-[0.22em] text-paper/45">X100VI</div>
        <div className="absolute left-1/2 top-[7%] -translate-x-1/2 font-mono text-[clamp(.48rem,1.35vw,.9rem)] font-semibold tracking-[0.24em] text-paper/50">FUJIFILM</div>

        <div className="absolute left-[44%] top-[35%] aspect-square w-[30%] -translate-x-1/2 -translate-y-[8%] rounded-full border-2 border-paper/55 bg-cyber-black/70 shadow-[0_0_45px_rgba(245,132,38,.1)]">
          <motion.div className="absolute inset-[8%] rounded-full border-2 border-dashed border-knicks-orange/55" style={lensRotation ? { rotate: lensRotation } : undefined}>
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-cyber-black px-2 font-mono text-[clamp(.35rem,.85vw,.58rem)] tracking-[.16em] text-paper/45">FUJINON 23mm F2</span>
          </motion.div>
          <div className="absolute inset-[19%] rounded-full border border-paper/40" />
          <div className="absolute inset-[30%] rounded-full border-2 border-knicks-blue/55 bg-knicks-blue/[0.05]" />
          <div className="absolute inset-[42%] rounded-full border border-knicks-orange/65 bg-knicks-orange/[0.08]" />
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="absolute left-1/2 top-1/2 h-[42%] w-px origin-top bg-paper/15" style={{ rotate: `${index * 45}deg` }} />
          ))}
        </div>
      </div>

      <div className="absolute left-[12%] top-[9%] h-[12%] w-[15%] rounded-t-2xl border-2 border-b-0 border-current bg-cyber-black/30">
        <div className="absolute left-[14%] top-[-30%] aspect-[3/1] w-[44%] rounded-[50%] border border-paper/45" />
      </div>
      <div className="absolute right-[18%] top-[8%] h-[13%] w-[17%] rounded-t-2xl border-2 border-b-0 border-current bg-cyber-black/30">
        <div className="absolute right-[12%] top-[-25%] aspect-[3/1] w-[56%] rounded-[50%] border border-knicks-orange/45" />
      </div>
      <div className="absolute left-1/2 top-[12%] h-[8%] w-[13%] -translate-x-1/2 border-x border-t border-paper/35" />

    </div>
  );
}

function HeroActions() {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
      <a href="#work" className="group inline-flex min-h-11 items-center gap-2 rounded-lg bg-knicks-orange px-6 py-3 text-sm font-semibold text-cyber-black transition-colors hover:bg-orange-300">View my work <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>
      <a href="#photography" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-paper/20 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:border-paper/50">Photo journal <Aperture size={15} /></a>
      <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-paper underline decoration-paper/20 underline-offset-8 hover:text-knicks-orange">Resume</a>
      <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-paper/50 hover:text-knicks-orange" aria-label="GitHub"><Github size={18} /></a>
      <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="text-paper/50 hover:text-knicks-orange" aria-label="LinkedIn"><Linkedin size={18} /></a>
    </div>
  );
}
