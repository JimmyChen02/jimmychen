import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import HomeSectionLink from "@/components/layout/HomeSectionLink";
import { photoLocations, photos, type Photo } from "@/data/photography";

export const metadata: Metadata = {
  title: "Photo Archive",
  description: "Photography by Jimmy Chen, arranged by location.",
};

export default function PhotographyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b2031] px-6 pb-20 pt-28 sm:pb-28 sm:pt-32">
      <div className="pointer-events-none absolute -right-20 top-20 font-mono text-[16rem] leading-none text-paper/[0.018]" aria-hidden="true">
        41
      </div>

      <div className="relative mx-auto max-w-6xl">
        <header className="max-w-4xl pb-16 sm:pb-20">
          <HomeSectionLink
            sectionId="photography"
            className="mb-8 inline-flex min-h-11 cursor-pointer items-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45 transition-colors duration-200 hover:text-knicks-orange"
          >
            ← Back to portfolio
          </HomeSectionLink>

          <p className="folio-number mb-5">Photo archive / by location</p>
          <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-paper sm:text-6xl lg:text-7xl">
            Frames, arranged by <span className="editorial-serif font-normal italic text-knicks-orange">place</span>.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-paper-muted sm:text-lg">
            A growing collection of streets, coastlines, meals, and ordinary light, grouped by where I found them.
          </p>

          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Photo locations">
            {photoLocations.map((location) => (
              <a
                key={location.id}
                href={`#${location.id}`}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-paper/15 px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/55 transition-colors duration-200 hover:border-knicks-orange/50 hover:text-knicks-orange"
              >
                <MapPin size={12} aria-hidden="true" />
                {location.name} <span className="text-paper/30">{String(location.photos.length).padStart(2, "0")}</span>
              </a>
            ))}
          </nav>
        </header>

        {photoLocations.map((location) => (
          <section
            key={location.id}
            id={location.id}
            aria-labelledby={`${location.id}-title`}
            className="scroll-mt-24 border-t border-paper/15 py-14 sm:py-20"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <header className="lg:col-span-3 lg:self-start">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-knicks-orange">
                  {String(location.photos.length).padStart(2, "0")} frames
                </p>
                <h2 id={`${location.id}-title`} className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-paper sm:text-3xl">
                  {location.name}
                </h2>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">{location.detail}</p>
              </header>

              <div className={`lg:col-span-9 ${location.photos.length > 1 ? "columns-1 gap-4 sm:columns-2" : "max-w-4xl"}`}>
                {location.photos.map((photo) => (
                  <ArchivePhoto key={photo.id} photo={photo} priority={photo.id === "01"} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function ArchivePhoto({ photo, priority }: { photo: Photo; priority: boolean }) {
  return (
    <figure className="group mb-4 break-inside-avoid overflow-hidden border border-paper/15 bg-cyber-black/35">
      <div className="overflow-hidden">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 1024px) 35vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="h-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.015] motion-reduce:group-hover:scale-100"
        />
      </div>
      <figcaption className="flex items-center justify-between gap-4 border-t border-paper/10 px-4 py-3">
        <span className="text-sm text-paper/80">{photo.caption}</span>
        <span className="shrink-0 font-mono text-[8px] tracking-[0.18em] text-paper/35">
          {photo.id} / {String(photos.length).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}
