/**
 * Local project overrides.
 *
 * Any field defined here takes precedence over what GitHub returns.
 * Use this to:
 *  - Rewrite descriptions to be portfolio-facing (not commit-message style)
 *  - Add custom tags / ranking scores
 *  - Mark projects as featured or hidden
 *  - Add demo URLs GitHub doesn't know about
 *
 * The `slug` key should match the GitHub repo name exactly.
 */

export interface ProjectOverride {
  /** GitHub repo name (exact, case-sensitive) */
  slug: string;
  /** Override the GitHub description */
  description?: string;
  /** Override the display title */
  title?: string;
  /** Tags displayed on the card (merged with GitHub topics) */
  tags?: string[];
  /** Mark as featured — shown at top of grid */
  featured?: boolean;
  /** Hide from all project displays */
  hidden?: boolean;
  /** Custom demo / live URL */
  demoUrl?: string;
  /** Override the GitHub repo URL — for repos not under your own account (e.g. a collaborator's). */
  githubUrl?: string;
  /** Custom ranking scores (0–1) */
  scores?: {
    aiml?: number;
    systems?: number;
    product?: number;
    research?: number;
  };
  /** Sort order within featured projects (lower = earlier) */
  order?: number;
}

export const projectOverrides: ProjectOverride[] = [
  {
    slug: "ios-typing-data-collector",
    title: "Adaptive Keyboard Research",
    description:
      "Built two SwiftUI research apps that model per-key touch distributions and capture multimodal typing data. Shipped on-device grip classification at ~95% accuracy and cut input latency by 73%.",
    tags: ["SwiftUI", "ML", "HCI", "Data Visualization", "Research"],
    featured: true,
    order: 1,
    scores: { aiml: 0.96, research: 0.97, product: 0.88, systems: 0.72 },
  },
  {
    slug: "PasswordManager",
    title: "Cloud Password Manager",
    description:
      "Secure password manager using AES-256 encryption, PBKDF2 key derivation, PostgreSQL, and AWS infrastructure. End-to-end encrypted with zero-knowledge design.",
    tags: ["Python", "PostgreSQL", "AWS", "Cryptography", "FastAPI"],
    featured: true,
    order: 4,
    scores: { aiml: 0.45, systems: 0.92, product: 0.89, research: 0.55 },
  },
  {
    slug: "Multithreaded-Chat-Server",
    title: "Multithreaded Chat Server",
    description:
      "Java TCP chat server with real-time messaging, private channels, and thread-safe client handling. Designed for concurrency correctness under load.",
    tags: ["Java", "TCP", "Multithreading", "Systems", "Networking"],
    featured: true,
    order: 5,
    scores: { aiml: 0.2, systems: 0.95, product: 0.65, research: 0.4 },
  },
  {
    slug: "cameldew-valley",
    title: "Cameldew Valley",
    description:
      "Co-built a 5,000+ line OCaml farming simulator on a four-person Agile team, leading core state and pause systems plus an automated test suite reaching 80%+ coverage.",
    githubUrl: "https://github.com/alexstrugacz/cameldew-valley",
    tags: ["OCaml", "Raylib", "SQLite", "Game Dev", "Functional Programming"],
    featured: true,
    order: 2,
    scores: { aiml: 0.2, systems: 0.78, product: 0.82, research: 0.35 },
  },
  {
    slug: "Stridr",
    title: "Stridr",
    description:
      "Built a full-stack iOS running app with real-time GPS tracking, Supabase-backed workout history, magic-link authentication, and HealthKit sync.",
    tags: ["SwiftUI", "MapKit", "HealthKit", "Supabase", "iOS"],
    featured: true,
    order: 3,
    scores: { aiml: 0.35, systems: 0.7, product: 0.9, research: 0.3 },
  },
  // Hidden — noise repos we don't want surfaced as project cards.
  { slug: "TravelPageDesign", hidden: true },
  { slug: "JimJaydenProject", hidden: true },
];

/**
 * Projects to surface in the Softmax ranking section.
 * Uses the slug as key.
 */
export const softmaxRanking = [
  {
    slug: "ios-typing-data-collector",
    title: "Adaptive Keyboard Research",
    overallScore: 0.96,
    scores: { "AI/ML Fit": 0.96, "Systems Depth": 0.72, "Product Polish": 0.88, "Research Impact": 0.97 },
  },
  {
    slug: "PasswordManager",
    title: "Cloud Password Manager",
    overallScore: 0.89,
    scores: { "AI/ML Fit": 0.45, "Systems Depth": 0.92, "Product Polish": 0.89, "Research Impact": 0.55 },
  },
  {
    slug: "Multithreaded-Chat-Server",
    title: "Multithreaded Chat Server",
    overallScore: 0.85,
    scores: { "AI/ML Fit": 0.2, "Systems Depth": 0.95, "Product Polish": 0.65, "Research Impact": 0.4 },
  },
  {
    slug: "cameldew-valley",
    title: "Cameldew Valley",
    overallScore: 0.82,
    scores: { "AI/ML Fit": 0.2, "Systems Depth": 0.78, "Product Polish": 0.82, "Research Impact": 0.35 },
  },
  {
    slug: "Stridr",
    title: "Stridr",
    overallScore: 0.78,
    scores: { "AI/ML Fit": 0.35, "Systems Depth": 0.7, "Product Polish": 0.9, "Research Impact": 0.3 },
  },
];
