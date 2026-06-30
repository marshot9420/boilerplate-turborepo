# @repo/mailer

`@repo/mailer`는 서버 전용 메일 발송 패키지입니다.

현재 구현은 Resend 기반 provider를 중심으로 하며, 개발/테스트 환경에서는 실제 메일을 보내지 않도록 `console` provider와 `fake` provider를 함께 제공합니다.

---

## 역할

이 패키지는 다음 책임만 가집니다.

```txt
메일 발송 provider interface
Resend provider
Console provider
테스트용 Fake provider
메일 주소 정규화
메일 입력값 검증
메일 발송 결과 표준화
```

이 패키지가 담당하지 않는 것:

```txt
환경변수 직접 검증
비즈니스 규칙 판단
DB 접근
인증/session 처리
Next.js route/action 처리
메일 발송 시점 결정
```

환경변수는 앱 또는 `@repo/env`에서 검증한 뒤, provider 생성 시 주입합니다.

---

## Export

```ts
import { createConsoleMailerProvider, createResendMailerProvider } from "@repo/mailer/server";
```

테스트에서는 아래 export를 사용할 수 있습니다.

```ts
import { createFakeMailerProvider } from "@repo/mailer/testing";
```

타입만 필요한 경우:

```ts
import type {
  MailAddress,
  MailerProvider,
  SendMailInput,
  SendMailResult,
} from "@repo/mailer/types";
```

---

## Providers

### Resend Provider

운영 환경에서 실제 메일을 발송하는 provider입니다.

```ts
import { createResendMailerProvider } from "@repo/mailer/server";

const mailer = createResendMailerProvider({
  apiKey: process.env.RESEND_API_KEY,
  defaultFrom: "Example <no-reply@example.com>",
});
```

사용 예시:

```ts
const result = await mailer.sendMail({
  to: "user@example.com",
  subject: "가입이 완료되었습니다.",
  html: "<p>가입이 완료되었습니다.</p>",
  idempotencyKey: "welcome-user/user-id",
  tags: {
    type: "welcome",
  },
});

if (!result.ok) {
  console.error(result.error);
}
```

---

### Console Provider

개발, 테스트, CI에서 실제 메일을 보내지 않고 로그로 출력하는 provider입니다.

```ts
import { createConsoleMailerProvider } from "@repo/mailer/server";

const mailer = createConsoleMailerProvider();

await mailer.sendMail({
  from: "Dev <dev@example.com>",
  to: "user@example.com",
  subject: "테스트 메일",
  text: "본문입니다.",
});
```

---

### Fake Provider

단위 테스트에서 발송된 메일을 메모리에 기록하는 provider입니다.

```ts
import { createFakeMailerProvider } from "@repo/mailer/testing";

const mailer = createFakeMailerProvider();

await mailer.sendMail({
  from: "Test <test@example.com>",
  to: "user@example.com",
  subject: "테스트 메일",
  text: "본문입니다.",
});

expect(mailer.getSentMails()).toHaveLength(1);
```

---

## 환경변수

이 패키지는 환경변수를 직접 읽지 않습니다.

앱 또는 `@repo/env`에서 다음 값을 검증한 뒤 provider에 주입합니다.

```bash
MAIL_PROVIDER="resend"
MAIL_FROM="Example <no-reply@example.com>"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

개발/테스트/CI에서는 실제 발송을 막기 위해 다음처럼 설정하는 것을 권장합니다.

```bash
MAIL_PROVIDER="console"
MAIL_FROM="Dev <dev@example.com>"
```

---

## 앱에서 사용하는 방식

예시:

```ts
import { createConsoleMailerProvider, createResendMailerProvider } from "@repo/mailer/server";
import { serverEnv } from "@repo/env/server";

export const mailer =
  serverEnv.MAIL_PROVIDER === "resend"
    ? createResendMailerProvider({
        apiKey: serverEnv.RESEND_API_KEY,
        defaultFrom: serverEnv.MAIL_FROM,
      })
    : createConsoleMailerProvider();
```

앱은 이렇게 생성한 `mailer`를 Server Action, route handler, 또는 서버 전용 service 조립 지점에서 사용할 수 있습니다.

---

## SendMailInput

```ts
type SendMailInput = {
  from?: MailAddress;
  to: MailAddress | MailAddress[];
  cc?: MailAddress | MailAddress[];
  bcc?: MailAddress | MailAddress[];
  replyTo?: MailAddress;
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  tags?: Record<string, string>;
  idempotencyKey?: string;
};
```

`text` 또는 `html` 중 하나는 반드시 필요합니다.

---

## Result

메일 발송 결과는 throw 대신 `Result` 형태로 반환합니다.

성공:

```ts
{
  ok: true,
  data: {
    messageId: string,
    provider: string,
    accepted: string[],
    rejected: string[],
    raw?: unknown,
  },
}
```

실패:

```ts
{
  ok: false,
  error: {
    code:
      | "MAILER_INVALID_INPUT"
      | "MAILER_NOT_CONFIGURED"
      | "MAILER_PROVIDER_ERROR",
    message: string,
    cause?: unknown,
  },
}
```

---

## 의존성 방향

`@repo/mailer`는 메일 발송 인프라 패키지입니다.

허용 방향:

```txt
apps/* → @repo/mailer
@repo/mailer → @repo/core
```

금지 방향:

```txt
@repo/mailer → apps/*
@repo/mailer → @repo/env
@repo/mailer → @repo/domain
@repo/mailer → @repo/database
@repo/mailer → @repo/auth
@repo/mailer → @repo/design-system
@repo/mailer → @repo/storage
```

환경변수는 `@repo/mailer` 내부에서 읽지 않고, provider 생성 시 외부에서 주입합니다.

---

## 테스트

```bash
pnpm --filter @repo/mailer test
```

watch 모드:

```bash
pnpm --filter @repo/mailer test:watch
```

coverage:

```bash
pnpm --filter @repo/mailer test:coverage
```

---

## 품질 검사

```bash
pnpm --filter @repo/mailer lint
pnpm --filter @repo/mailer check-types
pnpm --filter @repo/mailer test
```

전체 경계 검사:

```bash
pnpm check:boundaries
```

---

## 운영 주의사항

트랜잭션성 메일에는 가능한 `idempotencyKey`를 사용합니다.

예:

```txt
welcome-user/{userId}
order-paid/{orderId}
reset-password/{tokenId}
admin-invite/{inviteId}
```

메일 발송 실패가 사용자 플로우를 막아야 하는지는 호출하는 앱/도메인 흐름에서 결정합니다.

예를 들어 주문 완료 메일 발송 실패는 주문 성공 자체를 되돌리지 않는 편이 일반적입니다. 반면 비밀번호 재설정 메일 발송 실패는 사용자에게 실패로 안내해야 할 수 있습니다.
