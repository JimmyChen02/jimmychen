"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HOME_SECTION_SCROLL_KEY } from "./HomeSectionLink";

const MAX_SCROLL_ATTEMPTS = 20;
const SCROLL_RETRY_MS = 80;

function getPendingSectionId() {
  const storedTarget = window.sessionStorage.getItem(HOME_SECTION_SCROLL_KEY)?.trim();
  const hashTarget = window.location.hash.replace(/^#/, "").trim();

  return storedTarget || hashTarget || null;
}

export default function HomeSectionScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const targetId = getPendingSectionId();

    if (!targetId) {
      return;
    }

    let attempts = 0;
    let frameId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scrollToTarget = () => {
      attempts += 1;

      const target = document.getElementById(targetId);

      if (!target) {
        if (attempts < MAX_SCROLL_ATTEMPTS) {
          timeoutId = setTimeout(scrollToTarget, SCROLL_RETRY_MS);
        }
        return;
      }

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.sessionStorage.removeItem(HOME_SECTION_SCROLL_KEY);

      if (window.location.hash !== `#${targetId}`) {
        window.history.replaceState(window.history.state, "", `/#${targetId}`);
      }
    };

    frameId = window.requestAnimationFrame(() => {
      timeoutId = setTimeout(scrollToTarget, SCROLL_RETRY_MS);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  return null;
}
