# Jimmy Chen — Transformer Portfolio

My personal portfolio built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

The homepage is structured like a transformer inference pipeline:

- `hero` → raw input
- `tokenization` → identity tokens
- `embedding` → skill vectors
- `encoder` / `attention` / `feedforward` → context + strengths
- `decoder` / `softmax` / `output` → featured projects + final summary

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Data | GitHub REST API + local project overrides |
| Deploy | Vercel |

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure environment variables

```bash
touch .env.local
```

Then set:

```env
GITHUB_TOKEN=ghp_your_token_here
NEXT_PUBLIC_GITHUB_USERNAME=JimmyChen02
NEXT_PUBLIC_SITE_URL=https://jimmychen.dev
```

Notes:

- `GITHUB_TOKEN` is optional but recommended for higher rate limits.
- `NEXT_PUBLIC_GITHUB_USERNAME` is used for repo fetching and fallback links.
- `NEXT_PUBLIC_SITE_URL` is used for metadata and canonical URLs.

### 3. Run locally

```bash
npm run dev
```

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run type-check
```

## Content Model

### `data/site.ts`

This is the primary content/config file for the portfolio. It controls:

- name, role, email, GitHub, LinkedIn, resume URL
- hero input text and CTA buttons
- tokenization / embedding / attention narrative content
- skills and coursework
- About section portrait + copy
- final output CTA buttons

### `data/project-overrides.ts`

This file lets you shape how GitHub repos appear in the portfolio:

- rewrite titles/descriptions
- add custom tags
- set project order
- mark projects as featured
- add demo URLs
- define softmax ranking scores

## GitHub Project Sync

Projects are fetched server-side in [`lib/github.ts`](./lib/github.ts) and merged in [`lib/projects.ts`](./lib/projects.ts).

Flow:

1. Fetch public repos from the configured GitHub username
2. Fetch per-repo language breakdowns
3. Merge GitHub data with local overrides
4. Render the merged project list into the homepage and `/projects`

The homepage and projects page both use `revalidate = 3600`, so GitHub-backed content refreshes about once per hour without client-side fetching.

## Scroll / Animation Architecture

The transformer experience lives primarily in:

- [`components/transformer/TransformerPortfolio.tsx`](./components/transformer/TransformerPortfolio.tsx)
- [`hooks/useScrollify.ts`](./hooks/useScrollify.ts)
- [`components/transformer/VerticalPipeline.tsx`](./components/transformer/VerticalPipeline.tsx)
- [`components/visuals/ContinuousPipe.tsx`](./components/visuals/ContinuousPipe.tsx)
- [`components/visuals/NeuralBackground.tsx`](./components/visuals/NeuralBackground.tsx)

Current behavior:

- desktop viewports use guided section snapping through the transformer stages
- smaller viewports free-scroll naturally
- the active pipeline stage is derived from visible section area
- scene-level Framer Motion animations replay when re-entering sections
- the continuous pipe is routed around content and only renders on desktop

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
  projects/page.tsx

components/
  layout/
    Navbar.tsx
    Footer.tsx
  projects/
    ProjectCard.tsx
    ProjectsGrid.tsx
  sections/
    AboutSection.tsx
    ContactSection.tsx
    SkillsSection.tsx
  transformer/
    AttentionHeads.tsx
    DecoderProjects.tsx
    EmbeddingLayer.tsx
    EncoderBlock.tsx
    FeedForwardLayer.tsx
    HeroInput.tsx
    OutputLayer.tsx
    PipelineStage.tsx
    SoftmaxRanking.tsx
    TokenizationLayer.tsx
    TransformerPortfolio.tsx
    VerticalPipeline.tsx
  visuals/
    ContinuousPipe.tsx
    NeuralBackground.tsx

data/
  project-overrides.ts
  site.ts

hooks/
  useScrollify.ts

lib/
  animation.ts
  github.ts
  projects.ts
  utils.ts
```

## Assets

- Add your resume at `public/resume.pdf`
- Replace `public/og-image.png` for custom link previews
- Remote profile images are allowed from GitHub-hosted URLs via `next.config.mjs`

## Deploying

The app is set up well for Vercel:

1. Import the repo into Vercel
2. Add the environment variables above
3. Deploy

After that:

- pushes trigger redeploys
- GitHub project data refreshes automatically through ISR

## Notes

- The site is intentionally dark-first and motion-heavy.
- The transformer sequence is the main storytelling surface; the standard sections below it are the fast recruiter scan.
- The README describes the active App Router implementation under `components/transformer/*`, not older experimental files that may still exist in the repo.

## License

MIT
