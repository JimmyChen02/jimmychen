# Routes

- `/` — `app/page.tsx`; recruiter-first portfolio homepage rendered inside `app/layout.tsx`.
- `/explore` — `app/explore/page.tsx`; transformer-inspired interactive portfolio rendered inside `app/layout.tsx`.
- `/projects` — `app/projects/page.tsx`; complete project grid rendered inside `app/layout.tsx`.
- `/api/github` — `app/api/github/route.ts`; server API route with no UI.

All UI routes share the global navbar, footer, Inter font, global CSS, and metadata from `app/layout.tsx`.
