import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paddy: {
          DEFAULT: "#0F2A24",
          light: "#16382F",
          deep: "#081C17",
        },
        gold: {
          DEFAULT: "#C9A227",
          bright: "#E4C34F",
          dim: "#8A6E1B",
        },
        brick: {
          DEFAULT: "#A63D34",
          light: "#C25646",
        },
        sage: {
          DEFAULT: "#7C9473",
          light: "#A9BE9E",
        },
        rice: "#F2E9D8",
        ink: "#0B1512",
      },
      fontFamily: {
        display: [
          "Georgia",
          '"Iowan Old Style"',
          '"Palatino Linotype"',
          '"URW Palladio L"',
          "P052",
          "serif",
        ],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          '"Liberation Mono"',
          "monospace",
        ],
      },
      backgroundImage: {
        krama:
          "repeating-conic-gradient(from 0deg, var(--tw-krama-a) 0deg 90deg, var(--tw-krama-b) 90deg 180deg)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        steam: {
          "0%": { opacity: "0", transform: "translateY(0) scaleX(1)" },
          "50%": { opacity: "0.6" },
          "100%": { opacity: "0", transform: "translateY(-22px) scaleX(1.4)" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.16,1,0.3,1) both",
        steam: "steam 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
