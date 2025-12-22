// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#2B3942",
        "navy-deep": "#1E2A33",
        cashmere: "#EDE6D8",
        copper: "#B87333",
        wool: "#6F7477",
        "navy-veil": "rgba(237,230,216,0.04)",
        "wool-line": "rgba(111,116,119,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
