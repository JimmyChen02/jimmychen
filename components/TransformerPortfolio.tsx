"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import TransformerScene from "./TransformerScene";

export default function TransformerPortfolio() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={sectionRef} className="relative h-[860vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <TransformerScene progress={scrollYProgress} />
      </div>
    </section>
  );
}
