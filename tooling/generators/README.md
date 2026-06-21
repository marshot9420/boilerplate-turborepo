# `@repo/generators`

Turborepo 보일러플레이트 내부에서 사용하는 코드 생성기 패키지입니다.

반복적으로 생성되는 도메인, 디자인 시스템 컴포넌트, 앱 feature 구조를 표준화하기 위해 사용합니다.

---

# 목적

`tooling/generators`는 다음 목적을 위해 존재합니다.

```txt
반복 파일 생성 자동화
프로젝트 구조 일관성 유지
보일러플레이트 코드 작성 비용 감소
파일/디렉터리 네이밍 규칙 표준화
도메인/컴포넌트/feature 기본 테스트 생성
```

---

# 실행

루트 디렉터리에서 실행합니다.

```bash
pnpm generate <type> <name> [options]
```

실제 루트 스크립트는 다음 패키지 스크립트를 실행합니다.

```bash
pnpm --filter @repo/generators generate
```

---

# 사용 가능한 generator

```txt
domain
component
feature
```

---

# Domain generator

도메인 패키지와 데이터베이스 패키지에 기본 도메인 구조를 생성합니다.

## 사용법

```bash
pnpm generate domain content
```

## 생성 결과

```txt
packages/domain/src/content/
├─ content.constant.ts
├─ content.dto.ts
├─ content.error.ts
├─ content.schema.ts
├─ content.mapper.ts
├─ content.permission.ts
├─ content.service.ts
├─ client.ts
├─ server.ts
└─ __test__/
   ├─ content.schema.test.ts
   ├─ content.mapper.test.ts
   ├─ content.permission.test.ts
   └─ content.service.test.ts

packages/database/src/content/
├─ content.repository.ts
├─ content.repository.test.ts
└─ index.ts
```

또한 다음 package export를 자동으로 추가합니다.

```txt
packages/domain/package.json
  ./content/client
  ./content/server

packages/database/package.json
  ./content
```

## 생성되는 기본 구성

```txt
constant
  도메인 상수

dto
  Response / DetailResponse 타입

error
  도메인 에러 코드

schema
  IdParam
  ListSortKeys
  CreateRequest
  UpdateRequest

mapper
  Prisma Model → Response DTO 변환

permission
  기본 권한 함수

service
  id 단건 조회 service

repository
  create
  findById
  update
  delete
```

## 주의사항

Domain generator는 Prisma model이 이미 존재한다고 가정합니다.

예를 들어 다음 명령을 실행하면,

```bash
pnpm generate domain product
```

생성된 코드는 내부적으로 다음 타입과 Prisma delegate를 참조합니다.

```ts
import type { Product } from "@prisma/client";

prisma.product;
```

따라서 `packages/database/prisma/schema.prisma`에 `Product` model이 없으면 타입 체크가 실패합니다.

도메인을 새로 추가할 때는 일반적으로 다음 순서로 작업합니다.

```txt
1. Prisma model 추가
2. pnpm db:generate
3. pnpm generate domain <name>
4. 생성된 schema/service/repository를 실제 요구사항에 맞게 수정
5. pnpm check
6. pnpm test
```

---

# Component generator

`packages/design-system`에 primitive, web, admin 컴포넌트를 생성합니다.

## 사용법

```bash
pnpm generate component <name> --target <target> --category <category>
```

## target

```txt
primitive
web
admin
all
```

## options

```txt
--target
  생성 대상입니다.
  primitive, web, admin, all 중 하나를 사용합니다.

--category
  컴포넌트 카테고리입니다.
  예: inputs, buttons, feedback, overlay

--primitive
  web/admin wrapper가 사용할 primitive 이름입니다.
  생략하면 component name과 같은 primitive를 사용합니다.

--force
  이미 존재하는 파일을 덮어씁니다.
```

## 예시

primitive만 생성합니다.

```bash
pnpm generate component phone-input --target primitive --category inputs
```

web wrapper만 생성합니다.

```bash
pnpm generate component phone-input --target web --category inputs --primitive phone-input
```

admin wrapper만 생성합니다.

```bash
pnpm generate component phone-input --target admin --category inputs --primitive phone-input
```

primitive, web, admin을 한 번에 생성합니다.

```bash
pnpm generate component empty-state --target all --category feedback
```

기존 파일을 덮어씁니다.

```bash
pnpm generate component empty-state --target all --category feedback --force
```

## Primitive 생성 결과

```txt
packages/design-system/src/primitives/inputs/phone-input/
├─ phone-input.tsx
├─ phone-input.test.tsx
└─ index.ts
```

그리고 다음 index export가 갱신됩니다.

```txt
packages/design-system/src/primitives/inputs/index.ts
packages/design-system/src/primitives/index.ts
```

## Web/Admin 생성 결과

```txt
packages/design-system/src/web/inputs/phone-input/
├─ phone-input.tsx
├─ phone-input.test.tsx
├─ phone-input.stories.tsx
└─ index.ts
```

```txt
packages/design-system/src/admin/inputs/phone-input/
├─ phone-input.tsx
├─ phone-input.test.tsx
├─ phone-input.stories.tsx
└─ index.ts
```

그리고 target에 따라 다음 index export가 갱신됩니다.

```txt
packages/design-system/src/web/inputs/index.ts
packages/design-system/src/web/index.ts

packages/design-system/src/admin/inputs/index.ts
packages/design-system/src/admin/index.ts
```

## 주의사항

web/admin 컴포넌트는 primitive가 먼저 존재해야 합니다.

예를 들어 다음 명령은,

```bash
pnpm generate component phone-input --target web --category inputs --primitive phone-input
```

다음 경로가 존재해야 성공합니다.

```txt
packages/design-system/src/primitives/inputs/phone-input/
```

primitive가 없다면 먼저 생성합니다.

```bash
pnpm generate component phone-input --target primitive --category inputs
```

---

# Feature generator

`apps/web` 또는 `apps/admin` 내부에 feature 구조를 생성합니다.

feature는 사용자 행위 단위의 UI 조각입니다.

예:

```txt
create-content
update-profile
delete-my-account
content-status
```

---

## 사용법

두 가지 형식을 지원합니다.

```bash
pnpm generate feature <name> --app <app>
```

```bash
pnpm generate feature <app> <name>
```

## app

```txt
web
admin
```

## options

```txt
--app
  feature를 생성할 앱입니다.
  web, admin 중 하나를 사용합니다.

--force
  이미 존재하는 파일을 덮어씁니다.
```

## 예시

admin 앱에 `content-status` feature를 생성합니다.

```bash
pnpm generate feature content-status --app admin
```

또는 다음처럼 사용할 수도 있습니다.

```bash
pnpm generate feature admin content-status
```

web 앱에 `update-profile` feature를 생성합니다.

```bash
pnpm generate feature update-profile --app web
```

또는 다음처럼 사용할 수도 있습니다.

```bash
pnpm generate feature web update-profile
```

기존 파일을 덮어씁니다.

```bash
pnpm generate feature update-profile --app web --force
```

---

## 생성 결과

```txt
apps/web/src/features/update-profile/
├─ ui/
│  └─ update-profile-form.tsx
├─ model/
│  └─ update-profile-form-state.ts
├─ update-profile-form.test.tsx
├─ update-profile-form.stories.tsx
└─ index.ts
```

admin 앱이면 다음 위치에 생성됩니다.

```txt
apps/admin/src/features/content-status/
├─ ui/
│  └─ content-status-form.tsx
├─ model/
│  └─ content-status-form-state.ts
├─ content-status-form.test.tsx
├─ content-status-form.stories.tsx
└─ index.ts
```

---

# Feature 구조 기준

생성되는 feature는 다음 구조를 따릅니다.

```txt
ui
  실제 React 컴포넌트

model
  Form state, view state, feature-local type

*.test.tsx
  컴포넌트 단위 테스트

*.stories.tsx
  Storybook story

index.ts
  외부 export 진입점
```

초기 생성 코드는 최소 구조만 제공합니다.

실제 action 연결, 입력 필드 구성, validation error 표시, toast 처리 등은 각 feature 요구사항에 맞게 수정합니다.

---

# 생성 파일 덮어쓰기 정책

기본적으로 generator는 기존 파일을 덮어쓰지 않습니다.

이미 같은 파일이 존재하면 에러를 발생시키거나 생성을 건너뜁니다.

강제로 덮어쓰려면 `--force`를 사용합니다.

```bash
pnpm generate feature update-profile --app web --force
```

```bash
pnpm generate component empty-state --target all --category feedback --force
```

`domain generator`는 현재 안전 생성을 기본으로 하며, 기존 파일은 건너뜁니다.

---

# 네이밍 규칙

입력 이름은 내부적으로 kebab-case, PascalCase, camelCase, CONSTANT_CASE로 변환됩니다.

예:

```bash
pnpm generate domain user-profile
```

```txt
kebab-case    user-profile
PascalCase    UserProfile
camelCase     userProfile
CONSTANT_CASE USER_PROFILE
```

파일명은 kebab-case를 사용합니다.

```txt
user-profile.service.ts
update-profile-form.tsx
content-status-form-state.ts
```

컴포넌트명과 타입명은 PascalCase를 사용합니다.

```txt
UpdateProfileForm
ContentStatusForm
UserProfileResponse
```

함수명은 camelCase를 사용합니다.

```txt
getUserProfileByIdService
findUserProfileByIdRepository
toUserProfileResponse
```

상수명은 CONSTANT_CASE를 사용합니다.

```txt
USER_PROFILE
USER_PROFILE_ERROR_CODE
```

---

# 생성 후 권장 확인

generator 실행 후 루트에서 다음 명령을 실행합니다.

```bash
pnpm check
```

필요하면 테스트도 실행합니다.

```bash
pnpm test
```

특정 패키지만 확인하려면 filter를 사용합니다.

```bash
pnpm --filter @repo/generators check-types
pnpm --filter @repo/generators lint
```

앱 단위 테스트 예시입니다.

```bash
pnpm --filter web test
pnpm --filter admin test
```

패키지 단위 테스트 예시입니다.

```bash
pnpm --filter @repo/domain test
pnpm --filter @repo/database test
pnpm --filter @repo/design-system test
```

---

# 문제 해결

## `unsupported generator type`이 발생하는 경우

예:

```txt
[generators] unsupported generator type: feature
```

`src/generators/index.ts`의 `availableGenerators`에 해당 generator가 포함되어 있는지 확인합니다.

```ts
export const availableGenerators = ["domain", "component", "feature"] as const;
```

그리고 generator가 export 되어 있어야 합니다.

```ts
export { generateFeature } from "./feature.generator";
```

---

## web/admin component 생성 시 primitive가 없다고 나오는 경우

web/admin wrapper는 primitive를 감싸는 구조입니다.

먼저 primitive를 생성합니다.

```bash
pnpm generate component phone-input --target primitive --category inputs
```

그 다음 web/admin wrapper를 생성합니다.

```bash
pnpm generate component phone-input --target web --category inputs --primitive phone-input
```

---

## domain 생성 후 타입 체크가 실패하는 경우

대부분 Prisma model이 아직 없거나, Prisma client가 갱신되지 않은 경우입니다.

다음 순서를 확인합니다.

```bash
pnpm db:generate
pnpm check-types
```

Prisma schema에 model 자체가 없다면 먼저 model을 추가해야 합니다.

---

# 현재 포함 기능 요약

```txt
domain generator
  domain package 기본 파일 생성
  database repository 기본 파일 생성
  domain/database 테스트 생성
  package exports 자동 추가

component generator
  design-system primitive 생성
  design-system web/admin wrapper 생성
  테스트 생성
  Storybook story 생성
  index export 자동 정렬

feature generator
  apps/web 또는 apps/admin feature 생성
  ui/model/test/story/index 기본 구조 생성
```
