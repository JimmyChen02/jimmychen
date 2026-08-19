"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export default function CinematicBackground() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 28 });
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 28 });
  const { scrollYProgress } = useScroll();

  const orbitX = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);
  const orbitY = useTransform(smoothY, [-0.5, 0.5], [-16, 16]);
  const orbitScrollY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const folioY = useTransform(scrollYProgress, [0, 1], [80, -480]);
  const lineY = useTransform(scrollYProgress, [0, 1], [120, -180]);

  useEffect(() => {
    if (reduceMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -right-48 -top-44 h-[34rem] w-[34rem] rounded-full border border-paper/[0.07] sm:h-[44rem] sm:w-[44rem]"
        style={reduceMotion ? undefined : { x: orbitX, y: orbitScrollY }}
      >
        <motion.div
          className="absolute inset-[14%] rounded-full border border-knicks-blue/15"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-[18%] top-[-4px] h-2 w-2 rounded-full bg-knicks-orange/70" />
          <span className="absolute bottom-[11%] right-[5%] h-1.5 w-1.5 rounded-full bg-[#55A7E5]/70" />
        </motion.div>
        <motion.div
          className="absolute inset-[31%] rounded-full border border-paper/[0.05]"
          style={reduceMotion ? undefined : { x: orbitX, y: orbitY }}
        />
      </motion.div>

      <motion.div
        className="absolute right-[-4rem] top-[46%] select-none font-mono text-[13rem] font-semibold leading-none text-paper/[0.025] sm:text-[22rem]"
        style={reduceMotion ? undefined : { y: folioY }}
      >
        01
      </motion.div>

      <motion.div
        className="absolute -left-36 bottom-[8%] h-px w-[44rem] rotate-[12deg] bg-paper/[0.06]"
        style={reduceMotion ? undefined : { y: lineY }}
      />
      <motion.div
        className="absolute left-[7%] top-[38%] h-20 w-px bg-knicks-orange/20"
        animate={reduceMotion ? undefined : { scaleY: [0.35, 1, 0.35], opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="fixed right-4 top-1/2 hidden h-28 w-px -translate-y-1/2 bg-paper/10 lg:block">
        <motion.div className="h-full w-px origin-top bg-knicks-orange" style={{ scaleY: scrollYProgress }} />
      </div>
    </div>
  );
}
