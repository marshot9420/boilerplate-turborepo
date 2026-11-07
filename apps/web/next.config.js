import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import dotenv from "dotenv";

// Resolve Next's own environment loader so we see its snapshot before app dotenv files.
const resolveFromApp = createRequire(import.meta.url);
const loadNextDependency = createRequire(resolveFromApp.resolve("next/package.json"));
const { initialEnv, loadEnvConfig } = loadNextDependency("@next/env");
const modeKeys = ["NODE_ENV", "E2E", "VERCEL_ENV"];

if (initialEnv) {
  for (const key of modeKeys) {
    if (initialEnv[key] === undefined) delete process.env[key];
    else process.env[key] = initialEnv[key];
  }
}

const hosted = process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "production";
const isE2E = process.env.E2E === "true";

if (hosted && (isE2E || process.env.NODE_ENV === "test")) {
  throw new Error("Test and E2E builds cannot run in a Vercel deployment environment.");
}

if (hosted && initialEnv) {
  // Next has already loaded app files. Remove values that were supplied only by those files.
  const { parsedEnv } = loadEnvConfig(process.cwd());
  for (const key of Object.keys(parsedEnv ?? {})) {
    if (initialEnv[key] === undefined) delete process.env[key];
  }
}

if (!hosted) {
  const files = [".env.local", ".env"];
  if (isE2E) files.push(".env.e2e.local");

  for (const name of files) {
    const file = path.resolve(process.cwd(), "../..", name);
    if (!fs.existsSync(file)) continue;

    for (const [key, value] of Object.entries(dotenv.parse(fs.readFileSync(file)))) {
      if (modeKeys.includes(key)) continue;

      if (name === ".env.e2e.local" || process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  transpilePackages: ["@repo/auth", "@repo/design-system"],

  images: {
    remotePatterns: [
      /**
       * 예:
       * {
       *   protocol: "https",
       *   hostname: "your-storage.example.com",
       *   port: "",
       *   pathname: "/products/**",
       *   search: "",
       * },
       */
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
