import path from "node:path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env.local"),
});

process.env.NEXT_PUBLIC_APP_URL = process.env.ADMIN_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;

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
    value: "same-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive, nosnippet",
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
       * web보다 더 좁게.
       * 관리자에서 미리보기해야 하는 내부 storage/CDN만 허용.
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
