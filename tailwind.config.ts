import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f2f5f9",
        accent: "#4f46e5",
      },
      boxShadow: {
        clay: "9px 9px 18px rgba(15, 23, 42, 0.15), -9px -9px 18px rgba(255, 255, 255, 0.9)",
      },
      borderRadius: {
        clay: "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
