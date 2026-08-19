# Extractable components

## Navbar

- Source: `components/layout/Navbar.tsx`
- Category: layout
- Description: Fixed responsive portfolio navigation with desktop links, mobile drawer, and resume CTA.
- Extractable props: `activeItem` (string, default `home`), `resumeHref` (string, default `/resume.pdf`)
- Hardcoded: Jimmy Chen wordmark, Work/Experience/About/Contact labels, Lucide menu icons, Tailwind classes.

## Footer

- Source: `components/layout/Footer.tsx`
- Category: layout
- Description: Three-column portfolio footer with brand summary, navigation, social links, and copyright.
- Extractable props: none
- Hardcoded: brand copy, navigation labels, icon names, styles.

## HomeSectionLink

- Source: `components/layout/HomeSectionLink.tsx`
- Category: basic
- Description: Route-aware anchor that scrolls to homepage sections.
- Extractable props: `sectionId` (string, default `hero`)
- Hardcoded: session storage behavior and route handling.

## ProjectCard

- Source: `components/projects/ProjectCard.tsx`
- Category: basic
- Description: Project summary card with links, tags, language, and repository metadata.
- Extractable props: none; project content remains page data.
- Hardcoded: card layout, icon set, language colors, hover behavior.
