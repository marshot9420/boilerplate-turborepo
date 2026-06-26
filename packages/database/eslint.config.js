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
              regex: "^@repo/domain(?:/|$)",
              message: "packages/database는 DB 접근 계층이므로 domain을 import할 수 없습니다.",
            },
            {
              regex: "^@repo/(auth-next|design-system)(?:/|$)",
              message: "packages/database는 인증/인가나 UI 계층을 import할 수 없습니다.",
            },
            {
              regex: "^(?:@/|apps/|(?:\\.\\./)+apps/)",
              message: "packages/database에서 apps 내부 코드를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
];
