# @repo/typescript-config

공통 TypeScript 설정 패키지입니다.

## Config 종류

### base.json

모든 TypeScript 설정의 기반.

포함 내용:

- strict
- NodeNext
- ES2022
- noUncheckedIndexedAccess
- resolveJsonModule

---

### nextjs.json

Next.js 앱 전용 설정.

적용 대상:

- apps/web
- apps/admin

특징:

- moduleResolution: Bundler
- jsx: preserve
- next plugin
- noEmit

---

### react-library.json

React 라이브러리 패키지용 설정.

적용 대상:

- packages/design-system

---

### node-library.json

Node.js 기반 패키지 설정.

적용 대상:

- packages/core
- packages/domain
- packages/database
- packages/env

---

### test.json

Vitest/JSDOM 테스트 환경 설정.
