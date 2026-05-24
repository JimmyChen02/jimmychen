# Jimmy Chen — Portfolio

A vertical, scroll-driven Transformer-themed personal portfolio built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Live Demo

Deploy your own copy to Vercel in < 5 minutes (see below).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Background | Canvas API (vanilla, no library) |
| Data | GitHub REST API v3 + local overrides |
| Deployment | Vercel (recommended) |

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/JimmyChen02/portfolio.git
cd portfolio
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Optional but recommended — raises rate limit from 60 to 5000 req/hr
GITHUB_TOKEN=ghp_your_token_here

# Must match your GitHub username
NEXT_PUBLIC_GITHUB_USERNAME=JimmyChen02

# Used for Open Graph metadata
NEXT_PUBLIC_SITE_URL=https://jimmychen.dev
```

**Creating a GitHub token:**
1. Go to github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select `public_repo` scope (read-only is fine)
4. Copy the token into `GITHUB_TOKEN`

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

---

## Customizing Your Content

### Site identity (`data/site.ts`)

This is the single source of truth for all personal info:

- `name`, `role`, `email`, `github`, `linkedin`
- `hero.ctaButtons` — add/remove/reorder CTA buttons
- `tokens` — the identity tokens shown in the Tokenization section
- `embeddingDimensions` — the dimension bars in the Embedding section
- `skills` — listed in Embedding and Skills sections
- `attentionHeads` — the 4 focus areas in the Multi-Head Attention section
- `courses` — coursework in the Feed-Forward section

### Project overrides (`data/project-overrides.ts`)

Controls how GitHub repos appear in the portfolio:

```ts
{
  slug: "my-repo-name",        // Exact GitHub repo name
  title: "Display Title",      // Override the repo name
  description: "...",          // Portfolio-facing description
  tags: ["React", "AI"],       // Shown on card (merged with GitHub topics)
  featured: true,              // Show in Decoder + homepage
  order: 1,                    // Lower = earlier in lists
  demoUrl: "https://...",      // Live demo link
  hidden: false,               // Set true to hide from all views
  scores: {                    // Softmax ranking scores (0–1)
    aiml: 0.95,
    systems: 0.8,
    product: 0.9,
    research: 0.85,
  },
}
```

Changes to this file take effect immediately on next build or ISR refresh.

### Resume

Drop your resume PDF as `public/resume.pdf`. The Resume button links to `/resume.pdf` automatically.

### Favicon / OG image

Replace `public/favicon.ico` and `public/og-image.png` (1200×630 recommended).

---

## How GitHub Auto-Update Works

1. `lib/github.ts` fetches your public repos using the GitHub REST API.
2. The `GITHUB_TOKEN` env var is read **server-side only** — never exposed to the browser.
3. `next: { revalidate: 3600 }` tells Next.js to cache and re-fetch every hour.
4. `lib/projects.ts` merges the GitHub data with your local `project-overrides.ts`.
5. The merged data is passed as a prop to all project components at build time / ISR time.
6. No client-side fetching occurs — GitHub data is embedded in the server-rendered HTML.

**Rate limits:**
- Without a token: 60 requests/hr (enough for a personal site)
- With a token: 5,000 requests/hr

---

## Scroll Animation System

The cinematic section uses Framer Motion's `whileInView` + `viewport` props throughout:

- Each stage section has a unique `id` attribute (`hero`, `tokenization`, `embedding`, etc.)
- The `VerticalPipeline` sidebar uses `IntersectionObserver` to track which section is in view and highlights the active stage
- Individual elements use `initial` / `whileInView` with `viewport={{ once: true }}` for one-shot reveals
- Stagger effects use `staggerContainer` variants from `lib/animation.ts`
- The `NeuralBackground` canvas uses `requestAnimationFrame` directly (no Framer Motion) for maximum performance

**Reduced motion:** All Framer Motion animations respect `prefers-reduced-motion`. The canvas background does not render when reduced motion is preferred. CSS animations are disabled via `globals.css`.

---

## Deploying to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Import your GitHub repository on vercel.com/new
2. Add environment variables in the Vercel dashboard:
   - `GITHUB_TOKEN` (optional but recommended)
   - `NEXT_PUBLIC_GITHUB_USERNAME` → `JimmyChen02`
   - `NEXT_PUBLIC_SITE_URL` → your domain
3. Click Deploy

### Custom domain

1. In Vercel dashboard → Settings → Domains
2. Add your domain and follow the DNS instructions

### Updating content

- Push any commit to your main branch — Vercel auto-deploys
- GitHub data refreshes automatically every hour via ISR (no redeploy needed)

---

## Project Structure

```
jimmy-portfolio/
├── app/
│   ├── layout.tsx              # Root layout, SEO metadata
│   ├── page.tsx                # Homepage (server component)
│   ├── globals.css             # Global styles, CSS variables
│   └── api/github/route.ts     # Server-side GitHub API route
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── transformer/            # Cinematic pipeline stages
│   │   ├── TransformerPortfolio.tsx
│   │   ├── VerticalPipeline.tsx
│   │   ├── PipelineStage.tsx
│   │   ├── HeroInput.tsx
│   │   ├── TokenizationLayer.tsx
│   │   ├── EmbeddingLayer.tsx
│   │   ├── EncoderBlock.tsx
│   │   ├── AttentionHeads.tsx
│   │   ├── FeedForwardLayer.tsx
│   │   ├── DecoderProjects.tsx
│   │   ├── SoftmaxRanking.tsx
│   │   └── OutputLayer.tsx
│   ├── visuals/                # Background effects
│   │   ├── NeuralBackground.tsx
│   │   ├── DataPulse.tsx
│   │   └── GlowingConnection.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   └── ProjectsGrid.tsx
│   └── sections/               # Standard portfolio sections
│       ├── AboutSection.tsx
│       ├── SkillsSection.tsx
│       └── ContactSection.tsx
├── lib/
│   ├── github.ts               # Server-side GitHub API
│   ├── projects.ts             # Data merging logic
│   ├── animation.ts            # Framer Motion constants
│   └── utils.ts                # cn() and helpers
├── data/
│   ├── site.ts                 # Personal info and content
│   └── project-overrides.ts   # Manual project customizations
└── public/
    ├── resume.pdf              # Add your resume here
    ├── og-image.png            # 1200x630 OG image
    └── favicon.ico
```

---

## Suggested Polish After Launch

1. **OG image** — Design a custom 1200×630 banner using Figma or similar
2. **Favicon** — Replace with a custom monogram or logo
3. **Resume** — Drop a PDF in `public/resume.pdf`
4. **Real GitHub repos** — Make sure your featured repos are public and have descriptions
5. **Custom domain** — Point your domain to Vercel
6. **Analytics** — Add Vercel Analytics (one line) or Plausible
7. **Blog** — Add `app/blog/` with MDX if you want a writing section
8. **Experience timeline** — Add a work/research timeline component in `components/sections/ExperienceSection.tsx`
9. **Project detail pages** — Add `app/projects/[slug]/page.tsx` for deep dives
10. **Dark/light toggle** — The design is dark-only but you can add `next-themes`

---

## License

MIT — feel free to fork and adapt for your own portfolio.
