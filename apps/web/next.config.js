import path from "node:path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env.local"),
});

process.env.NEXT_PUBLIC_APP_URL = process.env.WEB_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;

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
  typedRoutes: true,
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
