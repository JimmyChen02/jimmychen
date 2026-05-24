export type StoryCard = {
  eyebrow: string;
  title: string;
  body: string;
};

export type Metric = {
  label: string;
  value: string;
};

export type Vector = {
  label: string;
  strength: number;
};

export type Probability = {
  label: string;
  detail: string;
  value: number;
};

export type LinkTarget = {
  label: string;
  detail: string;
  href: string;
};

export const transformerStory = {
  input: {
    name: "Jimmy Chen",
    initials: "JC",
    role: "Example AI/ML Engineer + Researcher",
    tagline:
      "A student builder who likes turning machine learning, systems thinking, and product taste into software that feels intelligent.",
    subtext:
      "This is example placeholder data. Swap in your real resume facts, research focus, and project impact later.",
    metrics: [
      { label: "School", value: "Example: Cornell CS" },
      { label: "Focus", value: "Example: NLP + HCI + Systems" },
      { label: "Seeking", value: "Example: ML internships" },
      { label: "Base", value: "Example: Ithaca / NYC" },
    ] satisfies Metric[],
  },
  tokens: [
    "Jimmy Chen",
    "Cornell CS",
    "AI/ML",
    "NLP",
    "Research",
    "Product",
    "Systems",
    "Builder",
  ],
  vectors: [
    { label: "ML Systems", strength: 0.92 },
    { label: "NLP", strength: 0.88 },
    { label: "Research", strength: 0.82 },
    { label: "Frontend", strength: 0.72 },
    { label: "Distributed Systems", strength: 0.68 },
    { label: "Product Thinking", strength: 0.8 },
  ] satisfies Vector[],
  encoderCards: [
    {
      eyebrow: "About",
      title: "Encode the human behind the code",
      body: "Example placeholder: curious, research-minded, and happiest when software feels both technically sharp and emotionally considered.",
    },
    {
      eyebrow: "Research",
      title: "Interests that shape the stack",
      body: "Example placeholder: adaptive interfaces, LLM applications, NLP evaluation, and ways intelligent systems can respond better to people.",
    },
    {
      eyebrow: "Engineering",
      title: "Bias toward shipping",
      body: "Example placeholder: likes robust APIs, concurrency, polished interfaces, and builds that survive both demos and real usage.",
    },
  ] satisfies StoryCard[],
  latentCards: [
    {
      eyebrow: "Latent State",
      title: "Compressed identity vector",
      body: "Research curiosity + systems rigor + product taste + clear communication + fast iteration.",
    },
    {
      eyebrow: "Current Learning",
      title: "What the model is still training",
      body: "Example placeholder: stronger infra intuition, better experimentation loops, and deeper applied ML product sense.",
    },
  ] satisfies StoryCard[],
  decoderProjects: [
    {
      eyebrow: "Decoded Project 01",
      title: "Adaptive Keyboard Research",
      body: "Example placeholder: personalized typing layouts, behavior signals, and experiments around comfort, speed, and accessibility.",
      meta: "HCI / Research / Adaptive UI",
    },
    {
      eyebrow: "Decoded Project 02",
      title: "Multithreaded Chat Server",
      body: "Example placeholder: concurrent server architecture, thread coordination, and reliable client messaging under load.",
      meta: "Systems / Networking / Concurrency",
    },
    {
      eyebrow: "Decoded Project 03",
      title: "Cloud Password Manager",
      body: "Example placeholder: secure vault flows, encrypted storage patterns, and product-minded account UX.",
      meta: "Security / Full Stack / Product",
    },
    {
      eyebrow: "Decoded Project 04",
      title: "Stridr",
      body: "Example placeholder: a movement and habits concept built around streaks, accountability, and lightweight behavioral design.",
      meta: "Mobile / Product / Behavior Design",
    },
  ] satisfies Array<StoryCard & { meta: string }>,
  softmax: [
    {
      label: "ML Engineer",
      detail: "Build applied intelligence that ships",
      value: 0.34,
    },
    {
      label: "Research Engineer",
      detail: "Prototype, evaluate, and iterate quickly",
      value: 0.27,
    },
    {
      label: "Systems Builder",
      detail: "Care about concurrency and reliability",
      value: 0.21,
    },
    {
      label: "Product Technologist",
      detail: "Translate deep tech into useful software",
      value: 0.18,
    },
  ] satisfies Probability[],
  outputs: [
    {
      label: "View Resume",
      detail: "Example PDF target",
      href: "https://example.com/resume",
    },
    {
      label: "GitHub",
      detail: "Example code profile",
      href: "https://github.com/your-handle",
    },
    {
      label: "LinkedIn",
      detail: "Example professional profile",
      href: "https://www.linkedin.com/in/your-handle/",
    },
    {
      label: "Email",
      detail: "Example contact route",
      href: "mailto:hello@example.com",
    },
  ] satisfies LinkTarget[],
} as const;
