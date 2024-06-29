const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: !!process.env.ANALYZE,
});
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../database/.env") });

module.exports = ({ basePath }) => {
  /** @type {import('next').NextConfig} */
  const config = {
    basePath,
    images: { unoptimized: true },
    output: "export",
    pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
    reactStrictMode: true,
    transpilePackages: ["@package/design-system"],
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
  };

  return withBundleAnalyzer(config);
};
