import reactInternalConfig from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactInternalConfig,

  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@repo/(database|domain|auth|env|mailer)(?:/|$)",
              message:
                "packages/design-system은 범용 UI 계층이므로 database, domain, auth, env, mailer를 import할 수 없습니다.",
            },
            {
              regex: "^(?:@/|apps/|(?:\\.\\./)+apps/)",
              message: "packages/design-system에서 apps 내부 코드를 import할 수 없습니다.",
            },
          ],
        },
      ],
    },
  },
];
