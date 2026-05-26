# Jimmy Chen Portfolio

Personal portfolio built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

The site has a transformer-themed homepage, a full projects page, and GitHub-backed project data.

## Routes

- `/` homepage with the transformer story plus About, Projects, Skills, and Contact
- `/projects` full project list
- `/api/github` server route that returns merged project data

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- GitHub REST + GraphQL APIs

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` and set:

```env
NEXT_PUBLIC_SITE_URL=https://your-site-url.com
NEXT_PUBLIC_GITHUB_USERNAME=JimmyChen02
GITHUB_TOKEN=ghp_your_token_here
```

- `NEXT_PUBLIC_SITE_URL` is used for metadata and canonical URLs.
- `NEXT_PUBLIC_GITHUB_USERNAME` controls which GitHub account is queried.
- `GITHUB_TOKEN` is optional, but recommended for rate limits and pinned repo ordering.

## Where To Edit

- `data/site.ts`
  Main site content and metadata.
- `data/project-overrides.ts`
  Project titles, descriptions, tags, demo links, and manual ranking metadata.
- `app/page.tsx`
  Homepage composition.
- `app/projects/page.tsx`
  Full projects page.
- `app/layout.tsx`
  Global layout, metadata, navbar, and footer.
- `app/globals.css`
  Global styles.
- `components/transformer/*`
  Transformer-story sections used on the homepage.
- `components/projects/*`
  Shared project card and grid UI.
- `components/sections/*`
  About, Skills, and Contact sections.
- `lib/github.ts`
  GitHub fetching, pinned repo ordering, and language enrichment.
- `lib/projects.ts`
  Merges GitHub data with local overrides for rendering.

## Project Data Flow

1. Fetch repos from GitHub.
2. Fetch pinned repo data and language breakdowns.
3. Merge GitHub data with `data/project-overrides.ts`.
4. Render the merged projects on `/` and `/projects`.

Project content refreshes hourly through `revalidate = 3600`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run type-check
```

## Active App Structure

```text
app/
  api/github/route.ts
  globals.css
  layout.tsx
  page.tsx
  projects/page.tsx

components/
  layout/
  projects/
  sections/
  transformer/
  visuals/

data/
  project-overrides.ts
  site.ts

lib/
  github.ts
  projects.ts
```

This README only covers the current app implementation.

## License

MIT
