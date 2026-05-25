import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        "cyber-black": "#020408",
        "cyber-navy": "#030d1a",
        "cyber-blue": "#0ea5e9",
        "cyber-cyan": "#06b6d4",
        "cyber-purple": "#8b5cf6",
        "cyber-violet": "#6d28d9",
        "cyber-pink": "#ec4899",
        "cyber-teal": "#14b8a6",
        // Accent glows
        "glow-blue": "#38bdf8",
        "glow-cyan": "#67e8f9",
        "glow-purple": "#a78bfa",
        // Knicks accent (used only in Encoder + Attention + project bars)
        "knicks-orange": "#F58426",
        "knicks-blue": "#006BB6",
        // Neutrals
        "panel-bg": "rgba(10, 20, 40, 0.7)",
        "panel-border": "rgba(6, 182, 212, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        "grid-sm": "40px 40px",
        "grid-md": "60px 60px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "data-flow": "dataFlow 2s linear infinite",
        "scan-line": "scanLine 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.6", filter: "blur(0px)" },
          "50%": { opacity: "1", filter: "blur(1px)" },
        },
        dataFlow: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 8px rgba(6, 182, 212, 0.4)",
        "glow-md": "0 0 16px rgba(6, 182, 212, 0.5)",
        "glow-lg": "0 0 32px rgba(6, 182, 212, 0.4), 0 0 64px rgba(6, 182, 212, 0.2)",
        "glow-purple": "0 0 16px rgba(139, 92, 246, 0.5)",
        "glow-blue": "0 0 16px rgba(14, 165, 233, 0.5)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
