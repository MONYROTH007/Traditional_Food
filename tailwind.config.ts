import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1C2418",
        "ink-soft": "#26301F",
        paper: "#F3ECD9",
        "paper-deep": "#E8DEC0",
        turmeric: "#D9A441",
        "turmeric-deep": "#B9832A",
        clay: "#A9462A",
        "clay-deep": "#8B3821",
        krama: "#2E4057",
        umber: "#3A2E22",
        leaf: "#4B5D3A"
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      maxWidth: {
        content: "1180px"
      }
    }
  },
  plugins: []
};

export default config;
