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
              regex: "^(?:@/|apps/|(?:\\.\\./)+apps/)",
              message: "packages/mailer에서 apps 내부 코드를 import할 수 없습니다.",
            },
            {
              regex:
                "^@repo/(auth|auth-next|database|design-system|domain|env|storage|analytics|feature-flags|observability|rate-limit|audit-log|queue)(?:/|$)",
              message:
                "packages/mailer는 메일 발송 인프라 패키지이므로 앱/도메인/DB/UI/환경변수 패키지에 의존할 수 없습니다. 필요한 값은 provider 생성 시 주입하세요.",
            },
            {
              regex: "^next(?:/|$)",
              message:
                "packages/mailer는 Next.js 앱 계층에 의존할 수 없습니다. 서버 전용 보장은 server-only 패키지만 사용하세요.",
            },
          ],
        },
      ],
    },
  },
];
