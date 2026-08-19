# Jimmy Chen Portfolio Design System

## Product and goal

- Personal engineering and research portfolio for recruiters and technical collaborators.
- The homepage must communicate role, strongest work, experience, education, and contact path in under 30 seconds.
- Creativity should feel authored and specific to Jimmy: editorial, technical, energetic, and grounded in New York/Cornell colors.
- The transformer walkthrough remains an optional `/explore` experience, not the primary homepage structure.

## Visual direction

- **Style:** personal computational sketchbook / living CS lab, with editorial structure underneath.
- **Human signals:** asymmetric composition, visible typographic hierarchy, section folios, ruled dividers, marginal annotations, concise first-person copy.
- **Avoid:** company, agency, startup, SaaS, or product-launch aesthetics; AI-dashboard tropes; glowing cards; glassmorphism; blurred gradient blobs; excessive pills; generic feature-card grids; purple/pink gradients; and equal-weight sections.
- Keep the layout clear enough for recruiter scanning even when composition is playful.

## Palette

- Deep ink background: `#081827`.
- Secondary navy: `#0D2942`.
- Warm paper text: `#F3EFE4`.
- Soft paper-muted text: `#B8C2C8`.
- Knicks orange accent: `#F58426`.
- Knicks blue accent: `#006BB6`.
- Rules: warm paper at 12-24% opacity.
- Orange is the primary action color. Blue is a supporting structural accent only.

## Typography

- Body and navigation: Inter / system sans.
- Editorial display accents: Georgia / Times New Roman / system serif.
- Labels, metadata, dates, and folios: JetBrains Mono / ui-monospace.
- Use a strong scale: 12, 14, 16, 20, 32, 48, 72+.
- Headlines may mix serif italic phrases with sans-serif structure, but never become decorative at the expense of clarity.

## Layout

- Max content width: 1152px (`max-w-6xl`).
- Desktop homepage uses an asymmetric 12-column editorial grid.
- Mobile collapses to one column with comfortable 24px horizontal padding.
- Sections are separated by thin ruled lines rather than rounded containers.
- Project summaries should read like case-study entries or magazine contents, not SaaS feature cards.
- Preserve content order: Hero → Selected Work → Experience → Profile → Photography → Contact.

## Components

- Navigation: slim fixed header, text links, single Resume action; minimal backdrop only after scroll.
- Buttons: rectangular or lightly rounded (4-8px), no glow, clear label and optional arrow.
- Project entry: large index, title, concise outcome, 3-4 technologies, direct link.
- Experience entry: role and organization aligned against date with one outcome-driven sentence.
- Section headers: folio number, mono eyebrow, large editorial title.
- Contact: bold typographic closing statement with email and LinkedIn actions, no generic card grid.

## Motion

- Use cinematic, Apple-like choreography without copying Apple brand assets or layouts.
- The homepage opening is a `430vh` scroll-scrubbed computational sketchbook with a sticky viewport. Its progress must be driven directly by scroll position: Jimmy's personal introduction recedes, three real projects become distinct code-made visual scenes, then the sequence hands off to Things I've Built.
- Borrow the pacing of an interactive product film, but never its sales narrative. The content is Jimmy's work, decisions, outcomes, and personality—not a generic product or brand campaign.
- The hero's primary scroll motif is a large hand-built line-art interpretation of Jimmy's Fujifilm X100VI. It sits at the exact viewport center at roughly 100% viewport width, without positional drift, and completes one clockwise revolution over a compact `245vh` scroll scene; its dashed lens ring counter-rotates for layered depth. It must read as a creative technical sketch, never a small raster product image or advertisement.
- Photography uses an asymmetric contact-sheet composition with frame numbers, film-edge notes, location/year captions, and honest placeholders until Jimmy's originals are supplied. Never pass stock or generated photographs off as Jimmy's work.
- Add a fixed ambient background system made from abstract editorial geometry, fine rules, and oversized typographic fragments. Layers may drift, rotate, and move at different rates with scroll.
- Hero typography may reveal in staggered lines and respond subtly to pointer position.
- Section headings and project entries should enter with restrained mask, opacity, and vertical motion as they cross the viewport.
- Add a slim scroll-progress indicator and one slow kinetic text rail between hero and work.
- Prefer transform and opacity animation for smooth performance; avoid layout-triggering animation.
- Motion must remain secondary to the content and never reduce text contrast.
- Respect `prefers-reduced-motion`.

## Accessibility and responsiveness

- Maintain 4.5:1 contrast for body text.
- Keep sequential heading levels and visible focus states.
- Every icon-only action has an accessible label.
- No horizontal overflow at 375px.
- Interactive targets should be at least 40px where practical.
