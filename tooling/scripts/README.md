# `@repo/scripts`

Turborepo 보일러플레이트 내부에서 사용하는 공용 스크립트 패키지입니다.

프로젝트 초기화, 패키지 스코프 변경, 개발용 데이터 시드, 캐시 및 빌드 산출물 정리처럼 루트에서 반복적으로 실행하는 CLI 작업을 담당합니다.

---

# 목적

`tooling/scripts`는 다음 목적을 위해 존재합니다.

```txt
보일러플레이트 초기 설정 자동화
반복적인 CLI 작업 표준화
루트 package.json 단순화
운영체제 의존 명령 최소화
공용 스크립트 중앙 관리
```

---

# 현재 포함 기능

```txt
init-project.ts
  보일러플레이트를 새 프로젝트명과 패키지 스코프로 초기화

setup-scope.ts
  기존 패키지 스코프를 새 스코프로 일괄 변경

seed.ts
  개발용 초기 데이터 생성

clean.ts
  .next
  .turbo
  coverage
  dist
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
   ├─ init-project.ts
   ├─ seed.ts
   ├─ setup-scope.ts
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

## 프로젝트 초기화

보일러플레이트를 새 프로젝트로 복제한 직후 실행합니다.

```bash
pnpm init-project mars
```

실행 시 기본적으로 다음 작업을 수행합니다.

```txt
boilerplate-turborepo → mars
@repo → @mars
루트 package.json name 변경
README 및 문서의 프로젝트명 변경
.env.example 생성 확인
node_modules / .turbo / .next / dist / coverage 정리
.git 제거 여부 선택
초기 commit 안내
```

적용 전 변경 대상만 확인하려면 `--dry-run`을 사용합니다.

```bash
pnpm init-project mars --dry-run
```

패키지 스코프와 프로젝트명을 다르게 쓰고 싶으면 `--scope`를 사용합니다.

```bash
pnpm init-project mars-project --scope mars
```

기존 `.git` 디렉터리를 강제로 제거하려면 `--remove-git`을 사용합니다.

```bash
pnpm init-project mars --remove-git
```

기존 `.git` 디렉터리를 유지하려면 `--keep-git`을 사용합니다.

```bash
pnpm init-project mars --keep-git
```

---

## 패키지 스코프 변경

프로젝트명은 그대로 두고 패키지 스코프만 변경합니다.

```bash
pnpm setup:scope mars
```

기본 동작은 다음과 같습니다.

```txt
@repo → @mars
```

적용 전 변경 대상만 확인하려면 `--dry-run`을 사용합니다.

```bash
pnpm setup:scope mars --dry-run
```

기존 스코프가 `@repo`가 아닌 경우 `--from`을 사용합니다.

```bash
pnpm setup:scope eten --from mars
```

---

## 개발용 데이터 생성

루트 디렉터리에서 실행합니다.

```bash
pnpm db:seed
```

실제 실행 명령은 다음과 같습니다.

```bash
pnpm --filter @repo/scripts run seed
```

`seed.ts`는 개발 및 테스트 환경에서 사용할 초기 데이터를 생성하는 용도로 사용합니다.

---

## 캐시 및 빌드 산출물 정리

루트 디렉터리에서 실행합니다.

```bash
pnpm scripts:clean
```

실행 대상은 `clean.ts` 구현을 기준으로 합니다.

예상 정리 대상:

```txt
.turbo
coverage
dist

apps/*/.next
apps/*/.turbo

packages/*/.turbo
tooling/*/.turbo
```

---

# 루트 `package.json`

루트에서는 다음처럼 `tooling/scripts`의 명령을 위임합니다.

```json
{
  "scripts": {
    "init-project": "pnpm --filter @repo/scripts init-project",
    "setup:scope": "pnpm --filter @repo/scripts setup:scope",
    "db:seed": "pnpm --filter @repo/scripts run seed",
    "scripts:clean": "pnpm --filter @repo/scripts run clean"
  }
}
```

---

# package.json scripts

## `init-project`

```bash
pnpm --filter @repo/scripts init-project
```

보일러플레이트를 새 프로젝트명과 패키지 스코프로 초기화합니다.

주로 clone 직후 한 번만 실행합니다.

---

## `setup:scope`

```bash
pnpm --filter @repo/scripts setup:scope
```

워크스페이스 내부의 패키지 스코프를 일괄 변경합니다.

예:

```txt
@repo/core → @mars/core
@repo/database → @mars/database
@repo/design-system → @mars/design-system
```

---

## `seed`

```bash
pnpm --filter @repo/scripts run seed
```

개발용 초기 데이터를 생성합니다.

---

## `clean`

```bash
pnpm --filter @repo/scripts run clean
```

캐시 및 빌드 산출물을 제거합니다.

---

# `init-project`와 `setup:scope` 차이

## `init-project`

보일러플레이트를 새 프로젝트로 처음 사용할 때 실행합니다.

```txt
프로젝트명 변경
패키지 스코프 변경
.env.example 확인
캐시/빌드 산출물 정리
.git 제거 여부 선택
다음 작업 안내
```

예:

```bash
pnpm init-project mars
```

---

## `setup:scope`

패키지 스코프만 바꾸고 싶을 때 실행합니다.

```txt
@repo → @mars
```

예:

```bash
pnpm setup:scope mars
```

이미 운영 중인 프로젝트에서 스코프만 바꾸는 경우에는 `setup:scope`가 더 안전합니다.

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

## 1. 앱 런타임 로직과 분리한다

`tooling/scripts`는 앱의 실제 런타임 로직을 포함하지 않습니다.

```txt
페이지 렌더링 로직 금지
Server Action 로직 금지
도메인 서비스 로직 금지
UI 로직 금지
```

---

## 2. 반복 가능한 CLI 작업만 담당한다

다음처럼 루트에서 반복적으로 실행하는 작업만 위치시킵니다.

```txt
project init
scope setup
clean
seed
env sync
icon generation
codegen
```

---

## 3. destructive 작업은 명시적으로 다룬다

파일을 삭제하거나 대량 변경하는 작업은 다음 원칙을 따릅니다.

```txt
--dry-run 지원
실행 결과 출력
변경 파일 목록 출력
삭제 대상 목록 출력
위험한 선택지는 명시 옵션 제공
```

예:

```bash
pnpm init-project mars --dry-run
pnpm init-project mars --remove-git
pnpm init-project mars --keep-git
```

---

## 4. 보일러플레이트 초기화와 일반 유지보수를 구분한다

```txt
init-project
  clone 직후 한 번 실행하는 초기화 명령

setup-scope
  필요할 때 스코프만 바꾸는 유지보수 명령

clean
  반복적으로 실행 가능한 정리 명령

seed
  개발 데이터 준비 명령
```

---

# DB 접근 기준

기본적으로 `tooling/scripts`는 앱 비즈니스 로직을 포함하지 않습니다.

다만 `seed.ts`처럼 개발 환경 준비를 위한 스크립트는 예외적으로 DB 접근을 허용합니다.

허용:

```txt
개발용 초기 데이터 생성
테스트 데이터 생성
로컬 환경 리셋 보조
```

금지:

```txt
실제 서비스 유스케이스 구현
도메인 정책 우회
앱 런타임에서 호출되는 로직 작성
```

DB 접근이 복잡해지는 경우에는 `packages/domain`, `packages/database`의 공개 API를 사용하고, 스크립트 내부에 비즈니스 규칙을 중복 구현하지 않습니다.

---

# 현재 제외한 기능

현재 단계에서는 다음 기능들을 별도 스크립트로 추가하지 않았습니다.

```txt
sync-env
generate-icons
generate-route-types
generate-openapi
```

도메인 생성은 `tooling/generators` 패키지에서 담당합니다.

```bash
pnpm generate
```

---

# 추후 추가 가능한 스크립트

프로젝트가 커지면 다음 스크립트들을 추가할 수 있습니다.

```txt
sync-env.ts
generate-icons.ts
generate-route-types.ts
generate-openapi.ts
reset-local-db.ts
check-workspace.ts
```

---

# 주의사항

## `init-project`

`init-project`는 대량 치환과 정리 작업을 수행합니다.

처음에는 반드시 다음 명령으로 변경 대상을 확인하는 것을 권장합니다.

```bash
pnpm init-project mars --dry-run
```

문제가 없으면 실제 적용합니다.

```bash
pnpm init-project mars
```

적용 후에는 의존성과 lockfile을 갱신합니다.

```bash
pnpm install
pnpm format
pnpm check
```

---

## `setup:scope`

`setup:scope`는 기본적으로 `@repo`를 다른 스코프로 변경합니다.

```bash
pnpm setup:scope mars
```

이미 한 번 스코프를 바꾼 프로젝트에서 다시 바꿀 때는 `--from`을 사용합니다.

```bash
pnpm setup:scope eten --from mars
```

---

## `clean`

`pnpm scripts:clean`은 캐시와 빌드 결과물을 제거합니다.

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

# 권장 초기 사용 흐름

보일러플레이트를 새 프로젝트로 사용할 때는 다음 순서를 권장합니다.

```bash
pnpm install
pnpm init-project mars --dry-run
pnpm init-project mars
pnpm install
pnpm format
pnpm check
```

필요하면 새 Git 저장소를 초기화합니다.

```bash
git init
git add .
git commit -m "chore: initialize project"
```

---

# 철학

이 패키지의 핵심 목적은 하나입니다.

```txt
초기 설정은 빠르게 끝낸다.
반복 작업은 표준화한다.
앱 로직과 자동화 스크립트의 경계는 유지한다.
```
