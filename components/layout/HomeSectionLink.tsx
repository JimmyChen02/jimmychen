"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { usePathname } from "next/navigation";

export const HOME_SECTION_SCROLL_KEY = "portfolio-home-section";

interface HomeSectionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  sectionId: string;
}

export default function HomeSectionLink({
  sectionId,
  onClick,
  children,
  ...props
}: HomeSectionLinkProps) {
  const pathname = usePathname();
  const href = pathname === "/" ? `#${sectionId}` : `/#${sectionId}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") {
      window.sessionStorage.setItem(HOME_SECTION_SCROLL_KEY, sectionId);
    }

    onClick?.(event);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
