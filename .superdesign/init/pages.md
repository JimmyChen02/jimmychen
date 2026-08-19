# Page dependency trees

## `/` — Home

Entry: `app/page.tsx`

- `components/layout/HomeSectionScrollRestorer.tsx`
  - `components/layout/HomeSectionLink.tsx`
- `data/site.ts`
- `lib/github.ts`
- `lib/projects.ts`
  - `data/project-overrides.ts`
- Shared layout via `app/layout.tsx`
  - `components/layout/Navbar.tsx`
    - `components/layout/HomeSectionLink.tsx`
    - `lib/utils.ts`
    - `data/site.ts`
  - `components/layout/Footer.tsx`
    - `components/layout/HomeSectionLink.tsx`
    - `data/site.ts`
  - `app/globals.css`

## `/explore` — Interactive portfolio

Entry: `app/explore/page.tsx`

- `components/transformer/TransformerPortfolio.tsx`
  - `components/visuals/NeuralBackground.tsx`
  - `components/transformer/VerticalPipeline.tsx`
  - `components/transformer/HeroInput.tsx`
  - `components/sections/AboutSection.tsx`
  - `components/transformer/TokenizationLayer.tsx`
  - `components/transformer/EmbeddingLayer.tsx`
  - `components/transformer/EncoderBlock.tsx`
  - `components/transformer/AttentionHeads.tsx`
  - `components/transformer/FeedForwardLayer.tsx`
  - `components/transformer/DecoderProjects.tsx`
  - `components/transformer/OutputLayer.tsx`
- Shared layout via `app/layout.tsx`

## `/projects` — All projects

Entry: `app/projects/page.tsx`

- `components/projects/ProjectsGrid.tsx`
  - `components/projects/ProjectCard.tsx`
  - `lib/animation.ts`
  - `lib/utils.ts`
  - `lib/projects.ts`
- `components/layout/HomeSectionLink.tsx`
- Shared layout via `app/layout.tsx`
