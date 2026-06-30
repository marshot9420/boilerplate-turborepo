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
              regex: "^(?:@/|apps/|(?:\\.\\./)+apps/)",
              message: "packages/database에서 apps 내부 코드를 import할 수 없습니다.",
            },
            {
              regex: "^@repo/(auth|design-system|domain|mailer|storage)(?:/|$)",
              message:
                "packages/database는 DB 접근 계층이므로 auth, domain, mailer, design-system, storage를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
];
