"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import MotionReveal from "@/components/motion/MotionReveal";
import { featuredPhotos, photos, type Photo } from "@/data/photography";

export default function PhotographySection() {
  return (
    <section id="photography" className="ruled-divider relative overflow-hidden bg-[#0b2031] py-24 sm:py-32" aria-labelledby="photography-title">
      <div className="pointer-events-none absolute -right-20 top-10 font-mono text-[16rem] leading-none text-paper/[0.018]" aria-hidden="true">41</div>
      <div className="mx-auto max-w-6xl px-6">
        <MotionReveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <span className="folio-number mb-5 block">04 — Through my viewfinder</span>
              <h2 id="photography-title" className="pb-[0.14em] text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-paper sm:text-6xl">What I notice when<br />I&apos;m <span className="editorial-serif font-normal italic text-knicks-orange">not coding</span>.</h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-base leading-7 text-paper-muted">Most of my photos come from hikes, shorelines, and ordinary moments that felt worth keeping. I like turning those small moments into stories I can share later.</p>
              <div className="mt-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35"><Camera size={14} className="text-knicks-orange" /> Fujifilm X100VI · 23mm f/2</div>
            </div>
          </div>
        </MotionReveal>

        <div className="mt-16 grid gap-4 md:grid-cols-12 md:grid-rows-[20rem_16rem_22rem] lg:grid-rows-[28rem_19rem_30rem]">
          {featuredPhotos.map((frame, index) => (
            <MotionReveal key={frame.id} className={`${frame.className} h-full`} delay={index * 0.05}>
              <PhotoFrame frame={frame} />
            </MotionReveal>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35 sm:flex-row">
          <p className="text-knicks-orange">Photo journal / volume 01</p>
          <Link
            href="/photography"
            className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-paper/15 px-4 text-paper/50 transition-colors duration-200 hover:border-knicks-orange/50 hover:text-knicks-orange"
            aria-label="View the full photo journal sorted by location"
          >
            View photo archive
            <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PhotoFrame({ frame }: { frame: Photo }) {
  return (
    <figure className={`group relative h-full min-h-0 w-full overflow-hidden border border-paper/15 bg-cyber-black/55 md:aspect-auto ${frame.aspectClass}`}>
      <Image
        src={frame.src}
        alt={frame.alt}
        fill
        quality={88}
        sizes={frame.sizes}
        style={{ objectPosition: frame.objectPosition }}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-[#06131f]/80 via-[#06131f]/20 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5">
        <span className="text-sm font-medium tracking-[-0.01em] text-paper">{frame.caption}</span>
        <span className="font-mono text-[9px] tracking-[0.18em] text-paper/65">
          {frame.id} / {String(photos.length).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}
