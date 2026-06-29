import nodeConfig from "@repo/eslint-config/node";

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
              regex: "^@repo/(auth-next|design-system)(?:/|$)",
              message:
                "packages/domain은 비즈니스 규칙 계층이므로 auth-next, design-system을 import할 수 없습니다.",
            },
            {
              regex: "^(?:@/|apps/|(?:\\.\\./)+apps/)",
              message: "packages/domain에서 apps 내부 코드를 import할 수 없습니다.",
            },
            {
              regex: "^@repo/(auth|auth-next|design-system|storage)(?:/|$)",
              message:
                "packages/domain은 비즈니스 규칙 계층이므로 auth, design-system, storage를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
];
