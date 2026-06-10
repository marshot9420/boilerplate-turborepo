# @repo/vitest-config

Turborepo 보일러플레이트에서 사용하는 공통 Vitest 설정 패키지입니다.

다음 환경에 대한 테스트 설정을 중앙에서 관리합니다.

```txt
Node.js 환경 테스트
React Component 테스트
Coverage 설정
Testing Library 설정
```

---

# 목적

프로젝트 전체에서 테스트 설정을 일관되게 유지하기 위한 패키지입니다.

각 패키지 및 앱은 개별적으로 복잡한 Vitest 설정을 작성하지 않고, 다음과 같이 공통 설정만 가져와 사용합니다.

```ts
export { default } from "@repo/vitest-config/node";
```

또는

```ts
export { default } from "@repo/vitest-config/react";
```

---

# 구조

```txt
packages/vitest-config/
├─ README.md
├─ eslint.config.js
├─ package.json
├─ tsconfig.json
├─ node.ts
└─ react.ts
```

---

# 제공 설정

## `@repo/vitest-config/node`

Node.js 기반 테스트 환경입니다.

다음 패키지에서 사용합니다.

```txt
@repo/core
@repo/domain
@repo/database
@repo/env
tooling/*
```

### 포함 설정

```txt
environment: "node"
globals: true
v8 coverage
```

### 사용 예시

```ts
// vitest.config.ts

export { default } from "@repo/vitest-config/node";
```

---

## `@repo/vitest-config/react`

React + jsdom 기반 테스트 환경입니다.

다음 패키지 및 앱에서 사용합니다.

```txt
@repo/design-system
apps/web
apps/admin
```

### 포함 설정

```txt
environment: "jsdom"
globals: true
@testing-library/jest-dom
@vitejs/plugin-react
v8 coverage
```

### 사용 예시

```ts
// vitest.config.ts

export { default } from "@repo/vitest-config/react";
```

---

# 설치 의존성

내부적으로 다음 패키지들을 사용합니다.

```txt
vitest
@vitest/coverage-v8
@vitejs/plugin-react
jsdom

@testing-library/react
@testing-library/user-event
@testing-library/jest-dom
```

---

# 테스트 파일 네이밍

## 단위 테스트

```txt
*.test.ts
*.test.tsx
```

예시:

```txt
pagination.test.ts
button.test.tsx
```

---

## 통합 테스트

```txt
*.integration.test.ts
*.integration.test.tsx
```

예시:

```txt
user.repository.integration.test.ts
content.service.integration.test.ts
```

현재 보일러플레이트에서는 통합 테스트를 필수로 강제하지 않습니다.

프로젝트 규모에 따라 선택적으로 추가합니다.

---

# 현재 권장 테스트 범위

## 기본 권장

```txt
Unit Test
Component Test
```

### 테스트 대상 예시

```txt
pagination
validation helper
mapper
permission helper
React primitive component
```

---

## 선택 권장

```txt
Integration Test
E2E Test
```

다음과 같은 경우에만 점진적으로 추가합니다.

```txt
복잡한 transaction
결제 로직
권한 처리
DB 제약 조건 검증
대규모 프로젝트
CI/CD 구축
```

---

# Coverage 설정

기본적으로 V8 coverage를 사용합니다.

다음 파일들은 coverage 대상에서 제외됩니다.

```txt
*.d.ts
*.config.*
index.ts
```

---

# 예시

## Core Unit Test

```ts
import { describe, expect, it } from "vitest";

import { createPagination } from "./pagination";

describe("createPagination", () => {
  it("기본 페이지네이션 값을 생성한다", () => {
    expect(createPagination()).toEqual({
      page: 1,
      limit: 20,
      skip: 0,
      take: 20,
    });
  });
});
```

---

## React Component Test

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("children을 렌더링한다", () => {
    render(<Button>저장</Button>);

    expect(
      screen.getByRole("button", {
        name: "저장",
      }),
    ).toBeInTheDocument();
  });
});
```

---

# tsconfig 설정

React 테스트 환경에서는 `jest-dom` 타입을 추가해야 합니다.

예시:

```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

---

# 철학

이 보일러플레이트의 테스트 전략은 다음 원칙을 따릅니다.

```txt
처음부터 과도한 테스트 인프라를 구축하지 않는다.
하지만 필요할 때 확장할 수 있도록 구조는 열어둔다.
```

즉:

```txt
기본:
  Unit + Component

필요 시:
  Integration + E2E
```

전략을 기본 방향으로 사용합니다.
