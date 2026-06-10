# `@repo/scripts`

Turborepo 보일러플레이트 내부에서 사용하는 공용 스크립트 패키지입니다.

현재는 프로젝트 전반에서 반복적으로 사용하는 정리(clean) 작업만 담당합니다.

---

# 목적

`tooling/scripts`는 다음 목적을 위해 존재합니다.

```txt
반복적인 CLI 작업 표준화
루트 package.json 단순화
운영체제 의존 명령 최소화
공용 스크립트 중앙 관리
```

---

# 현재 포함 기능

```txt
clean.ts
  .next
  .turbo
  coverage
  등의 캐시 및 빌드 산출물 정리
```

---

# 디렉터리 구조

```txt
tooling/scripts/
├─ eslint.config.js
├─ package.json
├─ README.md
├─ tsconfig.json
└─ src/
   ├─ clean.ts
   └─ index.ts
```

---

# 설치

루트에서 의존성을 설치합니다.

```bash
pnpm install
```

---

# 사용 방법

## 캐시 및 빌드 산출물 정리

루트 디렉터리에서 실행합니다.

```bash
pnpm scripts:clean
```

실행 대상:

```txt
.turbo
coverage

apps/*/.next
apps/*/.turbo

packages/*/.turbo
tooling/scripts/.turbo
```

---

# 루트 `package.json`

```json
{
  "scripts": {
    "scripts:clean": "pnpm --filter @repo/scripts run clean"
  }
}
```

---

# package.json scripts

## `clean`

```bash
pnpm --filter @repo/scripts run clean
```

캐시 및 빌드 산출물을 제거합니다.

---

# TypeScript 설정

`@repo/typescript-config/node-library.json` 기반으로 동작합니다.

```json
{
  "extends": "@repo/typescript-config/node-library.json"
}
```

---

# ESLint 설정

`@repo/eslint-config/node`를 사용합니다.

```js
import nodeConfig from "@repo/eslint-config/node";

export default nodeConfig;
```

---

# 설계 원칙

## 1. 상태를 가지지 않는다

`tooling/scripts`는 비즈니스 상태를 저장하지 않습니다.

```txt
DB 접근 금지
Prisma 의존 금지
도메인 로직 금지
```

---

## 2. 반복 작업만 담당한다

```txt
clean
seed
codegen
icon generation
env sync
```

같은 반복 작업만 위치시킵니다.

---

## 3. 앱 로직과 분리한다

```txt
apps/*
packages/domain
packages/database
```

의 실제 런타임 로직은 포함하지 않습니다.

---

# 현재 제외한 기능

현재 단계에서는 다음 기능들을 의도적으로 추가하지 않았습니다.

```txt
sync-env
seed
generator
icon generation
```

이유:

```txt
아직 실제 앱 구조가 완전히 고정되지 않음
과도한 자동화는 유지보수 비용 증가 가능성 있음
현재 단계에서는 필요성 낮음
```

---

# 추후 추가 가능한 스크립트

프로젝트가 커지면 다음 스크립트들을 추가할 수 있습니다.

```txt
seed.ts
generate-icons.ts
generate-route-types.ts
generate-openapi.ts
generate-domain.ts
```

---

# 주의사항

`pnpm scripts:clean`은 캐시와 빌드 결과물만 제거합니다.

다음은 제거하지 않습니다.

```txt
node_modules
```

전체 의존성까지 제거하려면 루트에서 다음을 사용합니다.

```bash
pnpm clean
```

루트 `clean`은 다음 작업까지 수행합니다.

```txt
turbo cache 제거
전체 node_modules 제거
```

---

# 철학

이 패키지의 핵심 목적은 하나입니다.

```txt
처음부터 과도하게 자동화하지 않는다.
하지만 나중에 확장할 수 있는 구조는 유지한다.
```
