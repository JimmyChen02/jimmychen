export type Project = {
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  outcome: string;
};

// This array is structured so it can be replaced by fetched GitHub data later.
export const projects: Project[] = [
  {
    title: "Adaptive Keyboard Research",
    subtitle: "HCI research prototype",
    summary:
      "Example placeholder: explored personalized typing interfaces that adapt key targets in real time to improve comfort, speed, and accessibility.",
    tags: ["HCI", "Research", "Adaptive UI"],
    outcome: "Prototype + study framing",
  },
  {
    title: "Cloud Password Manager",
    subtitle: "Security-focused app concept",
    summary:
      "Example placeholder: built a secure password management concept with encrypted vault flows, clean account UX, and cloud-first portability.",
    tags: ["Security", "Full Stack", "Product"],
    outcome: "Full-stack MVP direction",
  },
  {
    title: "Multithreaded Chat Server",
    subtitle: "Concurrent systems project",
    summary:
      "Example placeholder: implemented a concurrent chat system with robust client handling, message routing, and systems-focused reliability.",
    tags: ["Systems", "Concurrency", "Networking"],
    outcome: "Systems fundamentals demo",
  },
  {
    title: "Cameldew Valley",
    subtitle: "Playful simulation experiment",
    summary:
      "Example placeholder: designed a playful simulation experience with interlocking mechanics, progression loops, and a memorable visual tone.",
    tags: ["Game Dev", "Design", "Systems"],
    outcome: "Mechanics + worldbuilding demo",
  },
  {
    title: "Stridr",
    subtitle: "Habit and movement product concept",
    summary:
      "Example placeholder: prototyped a habit and movement tracker centered on goals, streaks, and lightweight accountability for daily progress.",
    tags: ["Product", "Mobile", "Behavior Design"],
    outcome: "Consumer app concept",
  },
];
