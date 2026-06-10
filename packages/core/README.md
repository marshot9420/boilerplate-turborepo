# @repo/core

공통 핵심 유틸리티 및 기반 로직 패키지.

`@repo/core`는 전체 모노레포에서 가장 아래 계층에 위치하는 순수 공통 패키지이며, 다음과 같은 역할을 담당한다.

- Result Pattern
- AppError
- Validation Helper
- Server Action Wrapper
- Structured Logger
- Pagination
- Search Params Helper
- 공통 타입
- 범용 유틸 함수

---

# 원칙

`@repo/core`는 다음 원칙을 따른다.

```txt
순수 공통 로직만 포함한다.
비즈니스 로직을 포함하지 않는다.
도메인을 알지 못한다.
DB를 알지 못한다.
UI를 알지 못한다.
Next.js에 의존하지 않는다.
```

즉, 다음 의존성은 금지된다.

```txt
core → domain
core → database
core → auth-next
core → design-system
core → apps/*
```

---

# 디렉터리 구조

```txt
src/
├─ action/
├─ errors/
├─ logger/
├─ pagination/
├─ result/
├─ search-params/
├─ types/
├─ utils/
└─ validation/
```

---

# Result Pattern

```ts
import { failure, success, type Result } from "@repo/core/result";

function parseNumber(value: string): Result<number, string> {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return failure("숫자가 아닙니다.");
  }

  return success(parsed);
}
```

---

# AppError

```ts
import type { AppError } from "@repo/core/errors";

const error: AppError = {
  code: "VALIDATION_ERROR",
  message: "입력값이 올바르지 않습니다.",
};
```

---

# Validation Helper

```ts
import { z } from "zod";

import {
  zFormBoolean,
  zOptionalNumber,
  zRequiredString,
} from "@repo/core/validation";

export const CreateProductRequest = z.object({
  title: zRequiredString(),

  quantity: zOptionalNumber(),

  visible: zFormBoolean(),
});
```

---

# Action Wrapper

```ts
"use server";

import { createAction } from "@repo/core/action";

export async function createContentAction(
  _prevState: unknown,
  formData: FormData,
) {
  return createAction({
    actionName: "content.create",
    schema: CreateContentRequest,
    formData,
    handler: createContentService,
    successMessage: "콘텐츠가 생성되었습니다.",
  });
}
```

---

# Logger

```ts
import { logger } from "@repo/core/logger";

logger.info("content.create.succeeded", {
  contentId: "content_123",
});
```

로그는 JSON 기반 구조화 로그 형태로 출력된다.

```json
{
  "level": "info",
  "message": "content.create.succeeded",
  "timestamp": "2026-06-10T12:00:00.000Z",
  "meta": {
    "contentId": "content_123"
  }
}
```

---

# Pagination

```ts
import { createPagination, createPaginationMeta } from "@repo/core/pagination";

const pagination = createPagination({
  page: 2,
  limit: 20,
});
```

반환값:

```ts
{
  page: 2,
  limit: 20,
  skip: 20,
  take: 20,
}
```

---

# Search Params

```ts
import { getNumberSearchParam, getSearchParam } from "@repo/core/search-params";

const page = getNumberSearchParam(searchParams, "page");

const keyword = getSearchParam(searchParams, "keyword");
```

---

# Types

```ts
import type { ListQuery } from "@repo/core/types";

export interface ContentListQuery extends ListQuery<"CREATED_AT" | "TITLE"> {
  status?: "DRAFT" | "PUBLISHED";
}
```

---

# Utils

```ts
import { isDefined, noop, sleep } from "@repo/core/utils";
```

## isDefined

```ts
const values = [1, null, 2, undefined];

const filtered = values.filter(isDefined);
// number[]
```

## noop

```ts
const onClick = noop;
```

## sleep

```ts
await sleep(300);
```

---

# Scripts

```bash
pnpm --filter @repo/core lint
pnpm --filter @repo/core check-types
```

---

# 기술 스택

- TypeScript
- Zod
- ESLint Flat Config
- Node.js ESM
- Turborepo
