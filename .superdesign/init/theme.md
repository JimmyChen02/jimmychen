# Theme source

## `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-inter: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  --color-bg: #081827;
  --color-navy: #0d2942;
  --color-cyan: #F58426;
  --color-purple: #006BB6;
  --color-blue: #0ea5e9;
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 700ms;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
body { background-color: var(--color-bg); color: #f0f4f8; font-family: var(--font-inter); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; text-rendering: optimizeLegibility; }
section { will-change: auto; transform: translateZ(0); scroll-margin-top: 64px; }
.font-mono { font-family: var(--font-mono); }
.glass-card { background: rgba(10, 20, 40, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(245, 132, 38, 0.15); }
.text-glow-cyan { text-shadow: 0 0 20px rgba(245, 132, 38, 0.6); }
.text-glow-purple { text-shadow: 0 0 20px rgba(0, 107, 182, 0.6); }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb { background: rgba(245, 132, 38, 0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(245, 132, 38, 0.4); }
::selection { background: rgba(245, 132, 38, 0.25); color: #fff; }
:focus-visible { outline: 2px solid rgba(245, 132, 38, 0.7); outline-offset: 2px; border-radius: 4px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  [data-framer-appear-id] { opacity: 1 !important; transform: none !important; }
}
@keyframes pulseDot { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
.pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
@media print { .no-print { display: none !important; } }
```

## `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "cyber-black": "#081827",
        "cyber-navy": "#0d2942",
        "cyber-blue": "#0ea5e9",
        "cyber-cyan": "#06b6d4",
        "cyber-purple": "#8b5cf6",
        "cyber-violet": "#6d28d9",
        "cyber-pink": "#ec4899",
        "cyber-teal": "#14b8a6",
        "glow-blue": "#38bdf8",
        "glow-cyan": "#67e8f9",
        "glow-purple": "#a78bfa",
        "knicks-orange": "#F58426",
        "knicks-blue": "#006BB6",
        "panel-bg": "rgba(10, 20, 40, 0.7)",
        "panel-border": "rgba(245, 132, 38, 0.2)",
      },
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"], mono: ["var(--font-mono)", "ui-monospace", "monospace"] },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(245,132,38,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,132,38,0.05) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(ellipse at center, rgba(245,132,38,0.15) 0%, transparent 70%)",
      },
      backgroundSize: { "grid-sm": "40px 40px", "grid-md": "60px 60px" },
      boxShadow: {
        "glow-sm": "0 0 8px rgba(245, 132, 38, 0.4)",
        "glow-md": "0 0 16px rgba(245, 132, 38, 0.5)",
        "glow-lg": "0 0 32px rgba(245, 132, 38, 0.4), 0 0 64px rgba(245, 132, 38, 0.2)",
        "glow-purple": "0 0 16px rgba(0, 107, 182, 0.5)",
        "glow-blue": "0 0 16px rgba(0, 107, 182, 0.5)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
```
