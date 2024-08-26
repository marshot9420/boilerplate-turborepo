module.exports = () => {
  /** @type {import('next').NextConfig} */
  const config = {
    images: { unoptimized: true },
    reactStrictMode: true,
    transpilePackages: ["@package/design-system"],
  };

  return config;
};
