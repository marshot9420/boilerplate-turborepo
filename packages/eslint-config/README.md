# @repo/eslint-config

공통 ESLint Flat Config 패키지입니다.

## 목표

- import 정렬 일관성 유지
- type import 강제
- any 사용 최소화
- React/Next.js 규칙 통합
- Turborepo 환경 지원

---

## Config 종류

### base

공통 TypeScript 규칙.

포함 내용:

- typescript-eslint
- import/order
- consistent-type-imports
- no-explicit-any
- turbo/no-undeclared-env-vars

---

### next-js

Next.js 앱용 설정.

적용 대상:

- apps/web
- apps/admin

포함 내용:

- @next/eslint-plugin-next
- react
- react-hooks

---

### react-internal

React 라이브러리용 설정.

적용 대상:

- packages/design-system

---

### node

Node.js 패키지용 설정.

적용 대상:

- packages/core
- packages/domain
- packages/database
- packages/env

---

### test

테스트 파일용 설정.

포함 내용:

- vitest globals
- no-explicit-any 허용
