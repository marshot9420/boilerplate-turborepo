import { type Config } from "tailwindcss";

const config: Config = {
  content: [
    "./**/*.{ts,tsx,mdx}",
    "./storybook/**/*.{ts,tsx}",
    "../../packages/design-system/src/**/*.{ts,tsx,mdx}",
  ],
  theme: {},
  plugins: [],
};

export default config;
