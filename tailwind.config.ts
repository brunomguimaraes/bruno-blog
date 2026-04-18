import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          950: "#02040a",
          900: "#050a18",
          800: "#081226",
        },
        cyan: {
          300: "#89e6ff",
          400: "#4fd3ff",
          500: "#1aa3ff",
        },
        accent: {
          DEFAULT: "#4fd3ff",
          bright: "#89e6ff",
          deep: "#1aa3ff",
          soft: "#cfeaff",
          dim: "#7fb3d9",
        },
        danger: "#ff4f7b",
      },
      keyframes: {
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 4px rgba(79,211,255,.4)" },
          "50%": { boxShadow: "0 0 16px rgba(79,211,255,.9)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        blink: "blink 1s steps(2,end) infinite",
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite",
        scan: "scan 7s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
