import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        earth: {
          cream: "#F5F0E8",
          sand: "#E8DFD0",
          tan: "#C4956A",
          brown: "#8B7355",
          dark: "#5C4033",
          deep: "#2C1810",
          forest: "#4A5D3A",
          sage: "#7A8B6F",
          moss: "#5E6B52",
          clay: "#B47B56",
        },
      },
      fontFamily: {
        lora: ["var(--font-lora)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
