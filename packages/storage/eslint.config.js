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
              regex: "^@repo/(auth|auth-next|database|design-system|domain)(?:/|$)",
              message:
                "packages/storage는 인프라 계층 패키지이므로 auth, database, design-system, domain을 import할 수 없습니다.",
            },
            {
              regex: "^(?:@/|apps/|(?:\\.\\./)+apps/)",
              message: "packages/storage에서 apps 내부 코드를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
];
