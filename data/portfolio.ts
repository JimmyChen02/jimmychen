export type PortfolioToken = string;

export type TimelineItem = {
  title: string;
  period: string;
  description: string;
};

export type AttentionHead = {
  title: string;
  description: string;
  signal: string;
};

export type InsightCard = {
  title: string;
  body: string;
};

export type CtaLink = {
  label: string;
  detail: string;
  href: string;
};

export type QuickFact = {
  label: string;
  value: string;
};

export const portfolioData = {
  name: "Jimmy Chen",
  subtitle: "Example AI/ML Portfolio MVP",
  heroDescription:
    "Example placeholder portfolio data for a CS student focused on AI/ML, product-minded engineering, and research-driven building.",
  attentionQuery: "Understand Jimmy",
  tokens: [
    "Jimmy Chen",
    "Cornell CS",
    "AI/ML",
    "NLP",
    "Research",
    "Software",
  ] satisfies PortfolioToken[],
  timeline: [
    {
      title: "Background",
      period: "2022 - Present",
      description:
        "Example placeholder: a CS student building depth in machine learning, software systems, and polished user-facing products.",
    },
    {
      title: "Coursework",
      period: "Core Foundation",
      description:
        "Example placeholder: classes across machine learning, NLP, operating systems, distributed systems, HCI, and product-oriented software design.",
    },
    {
      title: "Research",
      period: "Labs + Prototypes",
      description:
        "Example placeholder: studies around adaptive interfaces, personalization, user behavior, and how intelligent tools can respond in real time.",
    },
    {
      title: "Projects",
      period: "Shipping Momentum",
      description:
        "Example placeholder: end-to-end builds spanning research prototypes, full-stack apps, systems projects, and playful experiments.",
    },
  ] satisfies TimelineItem[],
  attentionHeads: [
    {
      title: "Research Head",
      description:
        "Highlights experimentation, evaluation design, and hypotheses that turn curiosity into measurable learning.",
      signal: "Adaptive interfaces",
    },
    {
      title: "AI/ML Head",
      description:
        "Tracks modeling intuition, LLM product ideas, and a habit of translating ML concepts into working demos.",
      signal: "LLM applications",
    },
    {
      title: "Systems Head",
      description:
        "Focuses on concurrency, backend reliability, performance tradeoffs, and code that still behaves under pressure.",
      signal: "Concurrency + infra",
    },
    {
      title: "Product Head",
      description:
        "Attends to usability, interaction flow, and the layer where technical capability becomes something people want to use.",
      signal: "User experience",
    },
  ] satisfies AttentionHead[],
  insights: [
    {
      title: "About Me",
      body: "Example placeholder: I like building software that feels intelligent, clear, and useful from the first interaction onward.",
    },
    {
      title: "Passions",
      body: "Example placeholder: AI product design, thoughtful developer tools, systems that adapt to people, and interfaces with strong taste.",
    },
    {
      title: "Research Interests",
      body: "Example placeholder: NLP, adaptive UIs, personalization, human-computer interaction, and evaluation for real-world ML systems.",
    },
    {
      title: "What I'm Learning",
      body: "Example placeholder: stronger infra instincts, better applied LLM workflows, and how to ship cleaner end-to-end experiences faster.",
    },
  ] satisfies InsightCard[],
  ctaLinks: [
    {
      label: "View Resume",
      detail: "Placeholder resume target",
      href: "https://example.com/resume",
    },
    {
      label: "GitHub",
      detail: "Placeholder code profile",
      href: "https://github.com/your-handle",
    },
    {
      label: "LinkedIn",
      detail: "Placeholder professional profile",
      href: "https://www.linkedin.com/in/your-handle/",
    },
    {
      label: "Email Me",
      detail: "Placeholder contact route",
      href: "mailto:hello@example.com",
    },
  ] satisfies CtaLink[],
  quickFacts: [
    {
      label: "Availability",
      value: "Example: Summer 2027 internships",
    },
    {
      label: "Based In",
      value: "Example: Ithaca / NYC",
    },
    {
      label: "Focus",
      value: "Example: NLP, HCI, Systems",
    },
    {
      label: "Stack",
      value: "Example: Python, TS, PyTorch",
    },
  ] satisfies QuickFact[],
} as const;
