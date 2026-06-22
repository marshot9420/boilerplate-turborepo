import path from "node:path";

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env.local"),
});

process.env.NEXT_PUBLIC_APP_URL ??= process.env.ADMIN_APP_URL;

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/auth", "@repo/design-system"],
};

export default nextConfig;
