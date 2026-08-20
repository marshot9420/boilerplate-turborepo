# @repo/core

`@repo/core`는 Repository에서 가장 아래에 위치하는 도메인 독립 공통 기반 Package입니다.

특정 Domain, Database, Auth, Design System, App 또는 외부 Provider를 알지 않으며 여러 Workspace에서 재사용할 수 있는 순수 기반만 제공합니다.

## 책임

```txt
action
  ActionResult
  executeFormAction

errors
  AppError
  FieldErrors
  공통 Error Code

format
  Number / Currency / Percentage
  Date / DateTime
  File Size
  Korean Phone Number

input
  입력 정규화
  입력용 Zod Schema Factory

logger
  공통 Logging

pagination
  Pagination 계산
  Pagination Meta

parse
  Raw Input 해석
  FormData JSON Parsing

query
  Search Params Helper
  ListQuery / SortDirection

resolve
  여러 후보나 상태에서 최종 값 결정
  Error Message Resolution

result
  Result Pattern

validation
  Zod Error → FieldErrors 변환
```

## 구조

```txt
packages/core/src/
├─ action/
│  ├─ action-result.ts
│  ├─ execute-form-action.test.ts
│  ├─ execute-form-action.ts
│  └─ index.ts
├─ errors/
│  ├─ app-error.ts
│  ├─ error-code.ts
│  └─ index.ts
├─ format/
│  ├─ date.test.ts
│  ├─ date.ts
│  ├─ file-size.test.ts
│  ├─ file-size.ts
│  ├─ number.test.ts
│  ├─ number.ts
│  ├─ phone-number.test.ts
│  ├─ phone-number.ts
│  └─ index.ts
├─ input/
│  ├─ normalizer.ts
│  ├─ schema.ts
│  └─ index.ts
├─ logger/
│  ├─ logger.ts
│  └─ index.ts
├─ pagination/
│  ├─ pagination.test.ts
│  ├─ pagination.ts
│  └─ index.ts
├─ parse/
│  ├─ form-data.test.ts
│  ├─ form-data.ts
│  └─ index.ts
├─ query/
│  ├─ list-query.ts
│  ├─ search-params.test.ts
│  ├─ search-params.ts
│  └─ index.ts
├─ resolve/
│  ├─ error-message.test.ts
│  ├─ error-message.ts
│  └─ index.ts
├─ result/
│  ├─ result.ts
│  └─ index.ts
└─ validation/
   ├─ field-errors.ts
   └─ index.ts
```

최상위 디렉터리는 코드의 형태가 아니라 Public Responsibility를 나타냅니다.

```txt
types
utils
helpers
libs
```

와 같은 포괄적인 최상위 분류는 사용하지 않습니다. Type, Schema, Mapper, Normalizer 등은 자신이 속한 책임과 가까운 위치에 둡니다.

## Public API

```txt
@repo/core/action
@repo/core/errors
@repo/core/format
@repo/core/input
@repo/core/logger
@repo/core/pagination
@repo/core/parse
@repo/core/query
@repo/core/resolve
@repo/core/result
@repo/core/validation
```

Package 내부 `src/*` 경로를 다른 Workspace에서 직접 Import하지 않습니다.

## Action

```ts
import { executeFormAction } from "@repo/core/action";
```

`executeFormAction`은 Form 기반 Server Action에서 반복되는 다음 흐름을 공통 처리합니다.

```txt
FormData Parsing
  ↓
Zod Validation
  ↓
Domain Result → ActionResult
  ↓
Logging / Unexpected Error 처리
```

단순 Flat Form은 `Object.fromEntries(formData.entries())`를 사용합니다.
복수 값이나 별도 구조가 필요하면 `parseFormData`를 전달합니다.

```ts
const result = await executeFormAction({
  actionName: "content.create",
  schema: CreateContentRequest,
  formData,
  handler: createContentService,
  successMessage: "콘텐츠가 생성되었습니다.",
});
```

```ts
import { parseJsonFormDataValues } from "@repo/core/parse";

const result = await executeFormAction({
  actionName: "order-claim.create",
  schema: CreateOrderClaimRequest,
  formData,
  parseFormData: (formData) => ({
    ...Object.fromEntries(formData.entries()),
    items: parseJsonFormDataValues(formData, "items"),
  }),
  handler: createOrderClaimService,
});
```

## Errors

```ts
import { COMMON_ERROR_CODE, type AppError, type FieldErrors } from "@repo/core/errors";
```

`AppError`는 Application 전반에서 사용하는 공통 오류 계약입니다.
Domain별 Error Code는 해당 Domain에서 정의합니다.

## Result

```ts
import { failure, isFailure, isSuccess, success, type Result } from "@repo/core/result";
```

예상 가능한 성공과 실패를 Exception 없이 명시적으로 표현할 때 사용합니다.

## Input

```ts
import {
  formBooleanSchema,
  normalizeBlankStringToUndefined,
  optionalBooleanSchema,
  optionalDateSchema,
  optionalEnumSchema,
  optionalIntegerSchema,
  optionalNumberSchema,
  optionalStringSchema,
  requiredStringSchema,
} from "@repo/core/input";
```

`input`은 외부 입력의 형태 정규화와 입력용 Schema Factory를 담당합니다.
특정 Domain의 Business Validation은 `@repo/domain`에 둡니다.

## Validation

```ts
import { mapZodErrorToFieldErrors } from "@repo/core/validation";
```

Zod Validation Error를 공통 `FieldErrors` 형태로 변환합니다.
Server Action뿐 아니라 Client/Feature의 선행 Validation에서도 사용할 수 있습니다.

## Pagination

```ts
import { buildPagination, buildPaginationMeta } from "@repo/core/pagination";
```

```ts
const pagination = buildPagination({
  page: 2,
  limit: 20,
});

const meta = buildPaginationMeta({
  page: pagination.page,
  limit: pagination.limit,
  totalCount: 45,
});
```

## Query

```ts
import {
  getNumberSearchParam,
  getSearchParam,
  type ListQuery,
  type SortDirection,
} from "@repo/core/query";
```

Search Params 처리와 범용 목록 Query 계약을 제공합니다.

## Format

```ts
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatFileSize,
  formatKoreanPhoneNumber,
  formatNumber,
  formatPercentage,
} from "@repo/core/format";
```

기본 사용 예:

```ts
formatNumber(1_234_567);
formatCurrency(15_000);
formatPercentage(12.5);
formatDateTime("2026-08-20T12:30:00.000Z");
formatFileSize(1_536);
formatKoreanPhoneNumber("01012345678");
```

Formatter는 출력 표현만 담당합니다. 입력 정규화나 Domain 규칙을 포함하지 않습니다.

## Parse

```ts
import { parseJsonFormDataValue, parseJsonFormDataValues } from "@repo/core/parse";
```

`FormData` 등의 Raw Input을 구조화된 값으로 해석합니다.
JSON으로 해석할 수 없는 문자열과 File 값은 원본을 유지합니다.

## Resolve

```ts
import { resolveErrorMessage } from "@repo/core/resolve";
```

```ts
const message = resolveErrorMessage(error, "요청을 처리하지 못했습니다.");
```

여러 후보나 상태를 고려해 최종 값을 결정하는 도메인 독립 Resolver를 둡니다.
특정 Domain의 상태나 표시 정책을 해석하는 Resolver는 해당 Domain 또는 App에 둡니다.

## Logger

```ts
import { logger } from "@repo/core/logger";

logger.info("content.create.succeeded");
logger.warn("content.create.failed", {
  code: "CONTENT_TITLE_DUPLICATED",
});
logger.error("content.create.unexpected_error", {
  error,
});
```

## 추가 기준

`@repo/core`에 새로운 기능을 추가할 때는 다음을 확인합니다.

```txt
특정 Domain을 몰라도 되는가?
Database 없이 동작하는가?
React / Next.js 없이 동작하는가?
특정 Provider 없이 동작하는가?
여러 Workspace에서 같은 의미로 재사용할 수 있는가?
기존 Public Responsibility 중 하나에 자연스럽게 속하는가?
```

새로운 책임이 필요하더라도 `utils`, `types`, `helpers`, `libs` 같은 포괄적인 영역부터 만들지 않습니다.

```txt
출력 표현
→ format

Raw Input 해석
→ parse

입력 정규화 / 입력 Schema
→ input

목록 Query / Search Params
→ query

최종 값 결정
→ resolve
```

실제 사용 사례가 없는 범용 Helper를 미래 사용 가능성만으로 추가하지 않습니다.

## 검증

```bash
pnpm --filter @repo/core lint
pnpm --filter @repo/core check-types
pnpm --filter @repo/core test
```

Repository 전체 변경이 포함되었다면:

```bash
pnpm check
pnpm test
```
