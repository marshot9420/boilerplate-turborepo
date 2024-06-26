const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const config = {
  coverageReporters: ["text", "html"],
  setupFilesAfterEnv: ["@package/jest-config/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
};

const defineConfig = nextJest({ dir: "./" });
module.exports = defineConfig(config);
