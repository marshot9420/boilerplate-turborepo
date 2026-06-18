import nextJsConfig from "@repo/eslint-config/nextjs";
import testConfig from "@repo/eslint-config/test";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  ...testConfig,

  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@repo/design-system/web(?:/|$)",
              message:
                "apps/admin에서는 @repo/design-system/web을 import할 수 없습니다. admin UI는 @repo/design-system/admin을 사용하세요.",
            },
          ],
        },
      ],
    },
  },
];
