import { nodeConfig } from "@repo/eslint-config/node";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nodeConfig,

  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@repo/(database|domain|auth-next|design-system)(?:/|$)",
              message:
                "packages/core는 순수 공통 기반이므로 database, domain, auth-next, design-system을 import할 수 없습니다.",
            },
            {
              regex: "^(?:@/|apps/|(?:\\.\\./)+apps/)",
              message: "packages/core에서 apps 내부 코드를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
];
