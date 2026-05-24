export const siteConfig = {
  name: "Jimmy Chen",
  role: "Computer Science @ Cornell Engineering",
  tagline:
    "Building at the intersection of AI, ML, NLP, and software systems.",
  description:
    "Computer Science student at Cornell Engineering focused on AI/ML, NLP, systems, and applied research. Building technically deep projects with real user-facing value.",
  email: "jc3673@cornell.edu",
  github: "https://github.com/JimmyChen02",
  githubUsername: "JimmyChen02",
  linkedin: "https://linkedin.com/in/jimmychen02",
  resumeUrl: "/resume.pdf",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jimmychen.dev",

  // Hero section
  hero: {
    inputSequence: "Jimmy Chen",
    subtitle:
      "Computer Science student building at the intersection of AI, ML, NLP, and software systems.",
    ctaButtons: [
      { label: "View Projects", href: "#projects", variant: "primary" },
      { label: "Resume", href: "/resume.pdf", variant: "secondary", external: true },
      { label: "GitHub", href: "https://github.com/JimmyChen02", variant: "ghost", external: true },
      { label: "LinkedIn", href: "https://linkedin.com/in/jimmychen02", variant: "ghost", external: true },
    ],
  },

  // Tokenization layer identity tokens
  tokens: [
    { id: "cornell-cs", label: "Cornell CS", color: "cyan" },
    { id: "ai-ml", label: "AI / ML", color: "purple" },
    { id: "nlp", label: "NLP", color: "blue" },
    { id: "research", label: "Research", color: "teal" },
    { id: "software-eng", label: "Software Engineering", color: "cyan" },
    { id: "systems", label: "Systems", color: "blue" },
    { id: "product", label: "Product Builder", color: "purple" },
  ],

  // Embedding layer dimensions
  embeddingDimensions: [
    { key: "research_dim", label: "research_dim", value: 0.92 },
    { key: "ml_dim", label: "ml_dim", value: 0.95 },
    { key: "systems_dim", label: "systems_dim", value: 0.86 },
    { key: "product_dim", label: "product_dim", value: 0.81 },
    { key: "nlp_dim", label: "nlp_dim", value: 0.9 },
  ],

  // Skills list for embedding layer
  skills: [
    { name: "Python", category: "lang" },
    { name: "Java", category: "lang" },
    { name: "TypeScript", category: "lang" },
    { name: "OCaml", category: "lang" },
    { name: "C", category: "lang" },
    { name: "React", category: "framework" },
    { name: "Next.js", category: "framework" },
    { name: "FastAPI", category: "framework" },
    { name: "PyTorch", category: "ml" },
    { name: "SwiftUI", category: "framework" },
    { name: "PostgreSQL", category: "data" },
    { name: "SQL", category: "data" },
    { name: "AWS", category: "infra" },
    { name: "Docker", category: "infra" },
    { name: "GitHub Actions", category: "infra" },
  ],

  // About section
  about: {
    paragraphs: [
      "I'm a Computer Science student at Cornell Engineering, interested in the space where AI systems meet real-world problems.",
      "My work spans NLP, machine learning systems, backend infrastructure, and applied research. I care about building things that are technically rigorous and genuinely useful.",
      "I'm drawn to projects that require depth — whether that's designing adaptive ML interfaces, building concurrent systems, or exploring how language models can be made more reliable.",
    ],
  },

  // Attention heads
  attentionHeads: [
    {
      id: "research",
      label: "Research Head",
      color: "teal",
      description: "Adaptive interfaces, ML systems, human-computer interaction",
      tokens: ["Cornell CS", "Research", "NLP"],
    },
    {
      id: "ai-ml",
      label: "AI/ML Head",
      color: "purple",
      description: "NLP, transformers, RAG, model evaluation",
      tokens: ["AI / ML", "NLP", "Research"],
    },
    {
      id: "systems",
      label: "Systems Head",
      color: "blue",
      description: "Concurrency, networking, backend systems",
      tokens: ["Systems", "Software Engineering", "Cornell CS"],
    },
    {
      id: "product",
      label: "Product Head",
      color: "cyan",
      description: "Full-stack apps, polished UI, useful tools",
      tokens: ["Product Builder", "Software Engineering", "AI / ML"],
    },
  ],

  // Feed-forward / coursework
  courses: [
    { name: "Machine Learning", code: "CS 4780" },
    { name: "Natural Language Processing", code: "CS 4740" },
    { name: "Computer Systems", code: "CS 3410" },
    { name: "Functional Programming", code: "CS 3110" },
    { name: "AI Ethics & Policy", code: "INFO 4270" },
    { name: "Data Structures & Algorithms", code: "CS 2110" },
  ],

  // Final output
  output: {
    label: "Jimmy Chen: AI/ML-focused software engineer and researcher.",
    ctaButtons: [
      { label: "View Resume", href: "/resume.pdf", variant: "primary", external: true },
      { label: "GitHub", href: "https://github.com/JimmyChen02", variant: "secondary", external: true },
      { label: "LinkedIn", href: "https://linkedin.com/in/jimmychen02", variant: "secondary", external: true },
      { label: "Email Me", href: "mailto:jc3673@cornell.edu", variant: "ghost" },
    ],
  },

  // SEO / OG
  ogImage: "/og-image.png",
};

export type SiteConfig = typeof siteConfig;
