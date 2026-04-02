import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "var(--background-primary)",
          surface: "var(--background-surface)",
          elevated: "var(--background-elevated)",
          overlay: "var(--background-overlay)",
        },
        border: {
          default: "var(--border-default)",
          subtle: "var(--border-subtle)",
          hover: "var(--border-hover)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        accent: {
          monad: "var(--accent-monad)",
          "monad-hover": "var(--accent-monad-hover)",
          "monad-subtle": "var(--accent-monad-subtle)",
          "monad-glow": "var(--accent-monad-glow)",
        },
        status: {
          success: "var(--status-success)",
          "success-subtle": "var(--status-success-subtle)",
          warning: "var(--status-warning)",
          "warning-subtle": "var(--status-warning-subtle)",
          danger: "var(--status-danger)",
          "danger-subtle": "var(--status-danger-subtle)",
        }
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        accent: "var(--shadow-accent)",
        glow: "var(--shadow-glow)",
      },
      fontFamily: {
        geist: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-sans)"],
      },
      transitionTimingFunction: {
        bounce: "var(--transition-bounce)",
      },
    },
  },
  plugins: [],
};
export default config;
