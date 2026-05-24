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
    slug: "adaptive-keyboard",
    title: "Adaptive Keyboard Research",
    description:
      "Behavior-aware mobile keyboard that adapts invisible key regions using touch distributions and language-model priors. Built as an undergraduate research project exploring HCI and ML.",
    tags: ["SwiftUI", "ML", "HCI", "Data Visualization", "Research"],
    featured: true,
    order: 1,
    scores: { aiml: 0.96, research: 0.97, product: 0.88, systems: 0.72 },
  },
  {
    slug: "cloud-password-manager",
    title: "Cloud Password Manager",
    description:
      "Secure password manager using AES-256 encryption, PBKDF2 key derivation, PostgreSQL, and AWS infrastructure. End-to-end encrypted with zero-knowledge design.",
    tags: ["Python", "PostgreSQL", "AWS", "Cryptography", "FastAPI"],
    featured: true,
    order: 2,
    scores: { aiml: 0.45, systems: 0.92, product: 0.89, research: 0.55 },
  },
  {
    slug: "multithreaded-chat-server",
    title: "Multithreaded Chat Server",
    description:
      "Java TCP chat server with real-time messaging, private channels, and thread-safe client handling. Designed for concurrency correctness under load.",
    tags: ["Java", "TCP", "Multithreading", "Systems", "Networking"],
    featured: true,
    order: 3,
    scores: { aiml: 0.2, systems: 0.95, product: 0.65, research: 0.4 },
  },
  {
    slug: "cameldew-valley",
    title: "Cameldew Valley",
    description:
      "2D farming simulator built in OCaml with real-time rendering, full game-state management, save/load, and a persistent SQLite leaderboard.",
    tags: ["OCaml", "Raylib", "SQLite", "Game Dev", "Functional Programming"],
    featured: true,
    order: 4,
    scores: { aiml: 0.2, systems: 0.78, product: 0.82, research: 0.35 },
  },
  {
    slug: "stridr",
    title: "Stridr",
    description:
      "iOS run tracking app with live map rendering, GPS route tracking, and HealthKit integrations. Built with SwiftUI and Supabase backend.",
    tags: ["SwiftUI", "MapKit", "HealthKit", "Supabase", "iOS"],
    featured: true,
    order: 5,
    scores: { aiml: 0.35, systems: 0.7, product: 0.9, research: 0.3 },
  },
];

/**
 * Projects to surface in the Softmax ranking section.
 * Uses the slug as key.
 */
export const softmaxRanking = [
  {
    slug: "adaptive-keyboard",
    title: "Adaptive Keyboard Research",
    overallScore: 0.96,
    scores: { "AI/ML Fit": 0.96, "Systems Depth": 0.72, "Product Polish": 0.88, "Research Impact": 0.97 },
  },
  {
    slug: "cloud-password-manager",
    title: "Cloud Password Manager",
    overallScore: 0.89,
    scores: { "AI/ML Fit": 0.45, "Systems Depth": 0.92, "Product Polish": 0.89, "Research Impact": 0.55 },
  },
  {
    slug: "multithreaded-chat-server",
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
    slug: "stridr",
    title: "Stridr",
    overallScore: 0.78,
    scores: { "AI/ML Fit": 0.35, "Systems Depth": 0.7, "Product Polish": 0.9, "Research Impact": 0.3 },
  },
];
