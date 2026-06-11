import nextJsConfig from "@repo/eslint-config/nextjs";
import testConfig from "@repo/eslint-config/test";

/** @type {import("eslint").Linter.Config[]} */
export default [...nextJsConfig, ...testConfig];
