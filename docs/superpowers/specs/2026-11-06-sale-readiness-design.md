# 크몽 판매 전 P0 보완 설계

상태: 설계 검토안. 아래 새 명령·파일·정책은 구현 예정이며 현재 제공 기능을 뜻하지 않는다.

기준 Commit: `000a49c` / 작성일: 2026-11-06

## 1. 목적과 확정된 선택

현재 보일러플레이트를 구매자가 재사용할 수 있는 소스 상품으로 납품하기 위해 남은 다섯 P0를 닫는다.

사용자가 선택한 기준:

- 참조 배포: Vercel의 Web·Admin 두 프로젝트와 관리형 PostgreSQL.
- 첫 상품: 소스와 설치 가이드 제공.
- 이용 범위: 구매자 및 고객사 서비스 개발에 재사용 허용. 원본 보일러플레이트 자체의 재판매 제한.

개발자가 구현 과정에서 선택할 기본안:

- 참조 DB는 CI와 맞춘 PostgreSQL 17. DB 업체는 특정하지 않고, 실제 검증할 때 한 업체·리전·연결 방식을 기록한다.
- 로컬 지원은 기존 macOS 검증을 유지하고 Linux는 CI 및 납품본 재현 대상으로 추가한다. Windows는 검증 전 지원 목록에 포함하지 않는다.
- Node는 로컬·CI에서 `.nvmrc`를 따르고, Vercel 두 프로젝트는 Node 24.x를 명시한다. 플랫폼의 실제 Build/Runtime Patch 버전은 검증 기록에 남긴다.
- 최초 상품에는 참조 배포 절차가 포함된다. 구매자 계정의 대행 구축, 상시 운영, 무제한 지원, 구버전 데이터 업그레이드는 별도 범위다.

비교한 접근:

| 관심사    | 선택한 방향                                 | 다른 접근과 판단                                                                           |
| --------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 참조 배포 | Vercel 두 프로젝트 + 관리형 PostgreSQL      | Docker/Linux는 이식성이 높지만 서버·TLS 운영 범위가 늘어남. 사용자 선택으로 Vercel 채택    |
| 판매 형태 | 재사용 가능한 소스 + 설치 가이드            | 단일 프로젝트 구축 용역은 작업·인수·유지보수 계약이 달라 첫 상품에서 분리                  |
| 환경 로딩 | 로컬 호환 수정 + 운영 CLI 전용 Prisma 설정  | 전역 환경 플래그나 새 공통 Package를 추가하는 방식보다 적용 범위가 작고 운영 명령이 명확함 |
| 의존성    | 현재 Advisory를 해결하는 최소 호환 업데이트 | 전면 Major 업데이트와 광범위한 Override는 변경·검증 범위를 불필요하게 확대                 |

이번 범위에서 AI 기능, 실제 파일 저장 Provider, 결제, 새로운 계정 연결 UI, 라이선스 인증 서버는 추가하지 않는다. 기존 Domain / Repository / App 경계와 로컬 초기화 계약을 유지한다.

## 2. 현재 상태와 보존할 계약

- 이메일만 같은 OAuth 계정의 자동 연결을 차단하고 Provider Identity로 로그인한다.
- 삭제 상태를 되돌리지 않는 콘텐츠 CAS Mutation과 사용자·관리자 E2E가 있다.
- 직전 구매자 검증은 기본 테스트 1,654개, DB 통합 16개, Desktop/Mobile Chromium E2E 24개 및 앱 Build/실행 통과다.
- 설치 기록은 macOS, 별도 PostgreSQL 16.14, 가짜 OAuth와 Console Mailer 기준이다. 실제 OAuth·메일·배포 성공의 증거로 사용하지 않는다.
- `pnpm build`와 로컬 `start`는 `.env.local`을 이용할 수 있어야 한다. `NODE_ENV=production`만으로 모든 파일 로딩을 금지하면 이 계약이 깨진다.
- E2E의 앱 Build도 `NODE_ENV=production`이므로 Production Runtime과 E2E 실행 목적을 같은 조건으로 판정하지 않는다.

근거: [설치 재현 기록](../../verification/2026-11-06-buyer-installation.md), [환경변수](../../06_환경변수.md), [구현 안전성](../../22_구현_안전성.md).

## 3. P0-1: 운영 DB 환경변수 보호

### 3.1 환경별 로딩 계약

`packages/database/prisma.config.ts`의 일반 로컬 로딩은 먼저 파일끼리 병합한 뒤, 로더 진입 전에 존재한 `process.env` 값을 최우선으로 보존한다. 빈 문자열도 주입된 값으로 취급하고 로컬 값으로 덮지 않는다. 필수 값이 비어 있으면 검증에서 실패한다. 명시적인 Test/E2E 실행에서는 기존 테스트 로더와 맞춰 전용 로컬 파일을 우선한다.

| 실행 경계                   | 파일과 우선순위                                   | 실패 조건                                 |
| --------------------------- | ------------------------------------------------- | ----------------------------------------- |
| 일반 로컬 Prisma CLI        | 주입값 > `.env.local` > `.env`                    | 필요한 연결값 누락·빈 값                  |
| 로컬 Test Prisma CLI        | `.env.test.local` > 주입값 > `.env.test`          | Test 목적 DB 불일치                       |
| 로컬 E2E Prisma CLI         | `.env.e2e.local` > 주입값 > `.env.local` > `.env` | E2E 목적 DB 불일치                        |
| Vercel Preview / Production | 플랫폼 주입값만 사용                              | 로컬 파일로 필수 값 보충 금지             |
| 운영 DB 명령                | 전용 Prisma 설정, 주입된 `DIRECT_URL`만 사용      | 누락·빈 값·Test/E2E/로컬 Vercel 실행 목적 |

Test/E2E의 DB 접속 전 검사는 전용 DB임을 확인하며, 최소한 각각 `_test` / `_e2e`로 끝나는 이름을 요구한다. 이 검사는 환경·계정 분리를 대체하지 않는다. 일반 개발 DB 이름에는 접미사를 강제하지 않는다.

Next의 두 `next.config.js`는 플랫폼 주입값을 보존하고 Vercel Preview/Production에서 루트 로컬 파일을 읽지 않도록 한다. 일반 로컬 Build/Start의 파일 보충은 유지한다. Vitest/Playwright의 기존 테스트 파일 우선 정책은 별도 실행 경계로 유지하며, 운영 로더를 Config Package에 끌어오지 않는다.

Playwright 로더는 자식 Build/Start가 E2E임을 알도록 기존 `E2E=true`를 전파한다. `turbo.json`의 Build 환경 전달·캐시 입력에도 E2E 실행 문맥과 루트 환경 파일을 반영한다. 일반 Build와 E2E Build의 캐시가 서로 잘못 복원되지 않는지 확인한다. Vercel 배포 환경에서 Test/E2E Fixture를 실행하려 하면 접속 전에 거부한다. 테스트 로더와 Prisma 로더의 최종 DB가 같은지 통합 검증한다.

`NODE_ENV`, `E2E`, `VERCEL_ENV` 등 실행 경계는 파일을 읽기 전에 확정하며 파일 내용이 모드를 바꾸지 못하게 한다. 운영 전용 Prisma 설정은 `E2E=true`, `NODE_ENV=test`, `VERCEL_ENV=development`를 거부하고 주입 `DIRECT_URL`의 PostgreSQL URL 형식을 검사한다. `NODE_ENV` 미지정 자체는 거부하지 않는다.

### 3.2 변경 위치와 실행 안전성

- `packages/database/prisma.config.ts`: 환경별 로딩 우선순위와 접속 전 대상 검사.
- 새 `packages/database/prisma.deploy.config.ts`: dotenv 없이 운영용 설정 생성. Schema / Migration 위치는 기존 설정과 일치한다.
- 필요한 환경 병합·검증 Helper는 Database 내부에 둔다. 운영 설정이 로컬 설정을 Import해 파일 로딩 Side Effect를 발생시키지 않도록 한다.
- `tooling/scripts`의 Seed 진입점은 DB Client를 Import하기 전에 환경·대상 검사를 마친다. 개발 Seed는 Production 및 Vercel 배포 환경에서 거부한다. E2E Seed는 `E2E=true`와 전용 DB를 모두 요구한다.
- Import 시 공통 OAuth 환경 전체를 파싱하는 `@repo/env/server`를 Prisma 설정의 로더로 사용하지 않는다. CLI에 불필요한 OAuth Secret을 요구하지 않는다.
- Secret 값, 연결 URL, Provider 응답을 검증 오류나 로그에 출력하지 않는다.

Test는 가짜 환경 파일·가짜 URL·임시 경로를 사용한다. 주입값과 파일의 충돌, 빈 주입값, Vercel 파일 읽기 차단, 파일 없음, `NODE_ENV=production`인 로컬 Build, Production E2E Build의 환경 일치, Seed의 접속 전 거부를 검증한다. 이 목적에 새 Runtime Package나 전역 모드 환경변수는 필요하지 않다.

완료 기준: 운영 주입 URL이 로컬 파일로 바뀌는 기존 재현이 실패하고, 로컬 설치·Build·E2E는 기존 명령으로 통과한다.

## 4. P0-2: 카카오 신규 앱 로그인 호환성

`packages/auth/src/oauth/oauth-url.ts`의 Kakao 기본 Scope를 `profile_nickname`, `profile_image`, `account_email`로 바꾼다. 현재 프로필 DTO가 닉네임과 이미지 URL을 제공하므로 이 두 항목을 기본 요청하되, 필드가 없는 사용자 응답의 기존 Nullable 처리는 유지한다.

- Google의 Scope와 Naver의 콘솔 기반 동작은 유지한다.
- 공개 `scopes` 재정의 API와 Kakao의 쉼표 구분 계약은 유지한다.
- 신규 카카오 앱에서 닉네임·프로필 사진·이메일 동의항목을 설정하는 순서, 이메일 권한 요건, Web/Admin Callback 여섯 주소를 문서화한다.
- 이메일의 유효·인증 Flag 검사, 동일 이메일 충돌 정책, Session 발급 규칙을 완화하지 않는다.

새 Authorize URL Unit Test에서 Provider별 기본값, Kakao의 `profile` 미포함, Scope 재정의·빈 배열, 구분자, Callback URL·State 보존을 확인한다. 기존 Kakao 응답·이메일 회귀 테스트를 실행한다. 실제 신규 앱의 로그인 검증은 P0-4에서 수행한다.

완료 기준: 새 Scope 회귀 테스트 통과와 실제 신규 앱 로그인 기록이 모두 존재한다. Mock 테스트 통과만으로 실제 Provider 검증 완료를 표시하지 않는다.

근거: [카카오 동의항목](https://developers.kakao.com/docs/ko/kakaologin/utilize), [기존 profile 항목 제한 공지](https://devtalk.kakao.com/t/request-to-change-scope-for-profile/116264).

## 5. P0-3: 의존성 취약점 판정과 CI Gate

### 5.1 수정 방식

현재 Audit 기준은 High 8 / Moderate 6 / Low 4다. High 경로는 Prisma 개발 도구와 Storybook에 연결된다. 설치 메타데이터의 Production 분류와 실제 요청 Runtime의 도달 가능성을 별도로 기록한다.

후보 하한은 `fast-uri >=3.1.9`, `vite >=8.1.6`, `esbuild >=0.28.1`, `baseline-browser-mapping >=2.11.0`이다. 구현 시 최신 Advisory·Registry·상위 Package 범위로 다시 확인하며, 이 숫자를 검증 없이 강제 Override하지 않는다.

1. 직접 버전은 Catalog와 해당 Manifest에서 조정한다.
2. 전이 의존성은 허용 범위 내 Lockfile 재해석 또는 상위 Package 호환 업데이트를 우선한다.
3. 남은 항목만 부모→자식에 한정한 Override를 검토한다. 사유·제거 조건을 기록한다.
4. Prisma Client/CLI/Adapter 및 Storybook 관련 Package의 정합성을 유지한다.
5. Lockfile은 pnpm으로만 생성하고 Strict Peer 검사를 유지한다. 설치 Script 허용 정책을 일괄 완화하지 않는다.

### 5.2 반복 가능한 판정

계획 파일은 `tooling/scripts/src/audit-dependencies.ts`와 Test, `tooling/scripts/config/audit-exceptions.json`이다. 루트에 `security:audit`를 추가하고 CI의 독립 Security Job에서 실행한다. 판정 로직은 외부 조회와 분리된 순수 함수로 테스트한다.

- Production 분류와 전체 의존성 Audit을 모두 조회하고 중복 Advisory를 정규화한다.
- 미해결 High/Critical은 기본 실패다. Moderate/Low는 목록과 처리 계획을 남긴다.
- 예외는 Advisory ID, Package, Version 범위, Dependency Path, 실행 맥락, 비적용/완화 근거, 담당자·승인자, 재검토일·만료일을 요구한다.
- Version·Path가 달라지거나 예외가 만료되면 다시 실패한다. 조회 오류·잘못된 JSON·필수 필드 누락·알 수 없는 결과 형식도 실패한다.
- PR 작성자가 예외 파일을 수정해 스스로 Gate를 우회하지 못하도록 보호 Branch의 승인된 정책을 기준으로 판정한다. 예외 변경은 별도 Code Owner 검토를 요구한다.
- 신뢰 기준은 예외 JSON뿐 아니라 판정기와 필수 Check의 실행 경로에도 적용한다. 보호된 기준 Commit의 Gate를 실행하고 후보 Commit의 Manifest/Lockfile을 검사 입력으로 전달한다. 후보의 Script·설치 Hook을 보안 판정기로 실행하지 않는다. Gate/Workflow/예외 변경은 보호된 승인 절차로 먼저 검토한다.
- Fork PR은 읽기 전용 권한과 가짜 설정으로 검사한다. 배포 Secret을 PR 코드에 제공하지 않는다.
- Branch Protection과 승인자 설정은 저장소 운영 설정으로 준비하고, YAML만으로 강제된다고 설명하지 않는다.

검증은 Strict Peer Install → Frozen Install → `pnpm check` / 기본·DB 통합 테스트 → 두 앱과 세 Storybook Build → E2E다. Archive 생성 시 같은 Commit·Lockfile에 대한 Audit 결과와 예외 만료를 다시 확인한다.

완료 기준: 미판정 High/Critical 0건, 유효하지 않은 예외 0건, Audit 조회 성공, 호환성 검증 통과. 도구 경유 항목도 패치 가능한 호환 버전이 있으면 예외보다 패치를 우선한다.

## 6. P0-4: Migration과 Vercel 실제 인수

### 6.1 참조 환경

```txt
구매자 관리 계정
  ├─ Vercel Web 프로젝트   → Web HTTPS Origin
  ├─ Vercel Admin 프로젝트 → Admin HTTPS Origin
  └─ 관리형 PostgreSQL
       ├─ 참조 Staging DB
       └─ Production DB (실서비스 전환 시 별도 준비)

보호된 릴리스 단계
  → 검증된 Commit / Frozen Install / Client Generate
  → 대상 DB Migration 한 번 실행 / Status / Drift 확인
  → 같은 Commit의 Web·Admin 배포 / 인수 검사
```

두 Vercel 프로젝트의 Root Directory는 각각 `apps/web`, `apps/admin`이다. Workspace 접근과 고정 pnpm·Node 24 설정을 검증한다. Prisma Client Generate는 기존 앱 Build 단계에서 실행하며, Migration은 두 앱 Build에 넣지 않는다.

최초 참조 릴리스는 보호된 Migration Job과 운영자의 수동 앱 배포 절차로 구성한다. 새 `.github/workflows/release.yml`은 `workflow_dispatch`와 환경 승인으로 실행하고, 보호 Branch에 포함된 정확한 Commit만 허용한다. Migration 승인 이전에 앱이 배포되지 않도록 두 프로젝트의 Production Git 자동 배포를 통제하고, 성공한 Job과 같은 Commit을 운영자가 두 프로젝트에 배포한다. Workflow는 Migration 이후 배포·인수 승인 단계에서 대기하고, 두 배포의 Commit·Deployment ID와 Smoke 결과를 확인한 뒤 완료한다. 환경별 동시성은 이 전체 Workflow가 끝날 때까지 유지한다. 자동 앱 배포까지 확장하는 작업은 참조 절차 확인 후 별도로 결정한다.

Web/Admin의 `DATABASE_URL`은 같은 논리 DB의 Runtime 연결을 사용한다. `DIRECT_URL`은 같은 DB의 Migration 연결이다. Pooling·TLS·Runtime 역할과 DDL 역할은 선택한 DB 업체 기준으로 설정하고, Vercel Instance 수에 따른 연결 수를 확인한다. 각 배포의 대상 DB·Commit·두 Origin을 Secret 없는 기록으로 연결한다.

일반 PR Preview에는 Production DB Secret을 제공하지 않는다. 임의 Preview에서 실제 OAuth와 DB Mutation을 수행하지 않으며, 인수 검증은 고정 HTTPS Origin과 격리 DB를 가진 참조 Staging에서 수행한다. Preview가 데이터 기능을 제공한다면 그 환경 전용 DB를 별도로 준비해야 한다.

각 앱의 명시적인 `WEB_APP_URL` / `ADMIN_APP_URL`을 등록하고 OAuth 콘솔 Callback을 같은 주소로 맞춘다. 현재 Cookie는 Host 전용이며 Web/Admin 사이 자동 SSO를 보장하지 않는다. 두 앱에서 각각 로그인한다.

### 6.2 운영 DB 명령

아래 루트 명령을 계획한다. 모두 `prisma.deploy.config.ts`를 명시하며 dotenv 파일을 읽지 않는다.

| 새 명령                 | Database Package의 동작                                                                                                      | 성공 기준                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `pnpm db:deploy`        | `prisma migrate deploy --config prisma.deploy.config.ts`                                                                     | Migration 적용 성공                |
| `pnpm db:deploy:status` | `prisma migrate status --config prisma.deploy.config.ts`                                                                     | 적용 이력 정상·대기 Migration 없음 |
| `pnpm db:deploy:check`  | `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code --config prisma.deploy.config.ts` | Exit 0, Schema Drift 없음          |

Diff의 Exit 1은 실행 오류, Exit 2는 Drift로 처리한다. Status는 대기 Migration에도 실패할 수 있으므로 배포 전 `status && deploy`로 구성하지 않는다. `deploy → status → check`를 완료한 뒤 앱을 배포한다.

CI의 별도 임시 PostgreSQL 17 DB에서 다음을 검증한다: 빈 DB에 전체 Migration 적용 → 이력·Schema 일치 → 재실행 시 추가 변경 없음 → 사용자 데이터 삽입 후 재실행에도 유지. 이 DB는 기존 `db:push` 기반 Test/E2E DB와 분리한다. 기존 Migration 파일은 수정하지 않는다.

릴리스 단계는 환경별 직렬화하며 실행 중 Migration을 새 Commit 때문에 중간 취소하지 않는다. Prisma Migration Lock도 유지한다. 실패 시 두 앱 승격을 중단하며 자동 Reset·재Seed·Down Migration을 수행하지 않는다. 부분 실패는 로그를 검토한 뒤 승인된 복구 절차로 처리한다.

Web/Admin 동시 전환은 원자적이지 않다. 한 앱 배포가 실패하면 Migration과 호환되는 이전 앱으로 복구하거나 같은 Commit의 나머지 배포를 재시도한다. 최초 릴리스는 빈 DB 설치를 지원하며, 이후 Schema 변경에는 두 앱의 이전/새 버전 호환성이 필요하다. 구버전 데이터 업그레이드를 상품에 추가할 때 별도 이행 검증을 설계한다.

### 6.3 실제 인수 표

| 영역        | 필수 확인                                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 실제 OAuth  | Google/Naver/Kakao 각각 Web/Admin 신규 가입 또는 기존 계정 로그인, 재로그인, 동의 취소·필요 이메일 미제공, State 불일치의 안전한 실패              |
| 계정 정책   | Provider Identity 유지, 다른 Provider의 동일 이메일 자동 연결 차단                                                                                 |
| 세션·권한   | HTTPS Cookie의 Secure/HttpOnly/SameSite/Host 범위, 로그아웃·만료 후 차단, USER의 Admin 접근 차단                                                   |
| 최초 관리자 | Web 가입 USER의 UUID·Provider 연결을 확인한 운영자가 승인된 DB 관리 경로로 ADMIN 지정. 작업 대상·수행자·시간 기록. 이메일만으로 자동 승격하지 않음 |
| 핵심 흐름   | Staging의 실제 로그인 세션으로 CRUD, 다른 사용자 차단, Admin 공개·숨김 및 새로고침 후 유지                                                         |
| 재배포      | 동일 Release 재배포와 두 앱 재시작 후 기존 데이터·세션 정책 유지                                                                                   |
| 오류 관찰   | Vercel 로그에서 실패·요청을 추적할 수 있고 사용자 응답·로그에 Secret이 없음                                                                        |
| 메일        | Console 동작 확인. Resend 지원을 상품 설명에 포함하기 전 검증된 발신 도메인의 실제 발송·실패 확인                                                  |

외부 OAuth는 MFA·CAPTCHA·Provider 심사 등으로 완전 자동화하지 않는다. 검증자가 실행한 수동 단계와 자동 검증 결과를 나누어 기록한다. 사용자 동의가 필요한 화면은 검증 계정 소유자가 처리한다. 토큰·Cookie 원문·실제 개인정보를 스크린샷이나 판매본에 넣지 않는다.

운영 대행은 첫 상품에 포함하지 않는다. DB Backup/Restore와 Vercel 장애·비용 관찰의 구매자 책임 및 업체별 설정 확인 항목을 문서화한다. 참조 환경에서 확인하지 않은 분산 Rate Limit이나 운영 SLA를 보장하지 않는다.

완료 기준: Migration 반복 검증, 두 HTTPS 앱의 실제 인수 표, 동일 Commit의 재배포 기록이 모두 통과한다. 외부 계정·권한이 없거나 Provider 심사가 끝나지 않았으면 해당 항목은 미검증으로 남기고 출고 완료로 표시하지 않는다.

근거: [Vercel Turborepo](https://vercel.com/docs/monorepos/turborepo), [Vercel Node 버전](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Prisma Vercel 배포](https://www.prisma.io/docs/orm/v7/prisma-client/deployment/serverless/deploy-to-vercel), [Prisma CLI](https://www.prisma.io/docs/orm/v7/reference/prisma-cli-reference#migrate-diff).

## 7. P0-5: 이용허락·OSS 고지·판매용 납품본

### 7.1 이용허락과 지원 범위

직접 작성한 코드에는 상업 이용허락 문서를 준비한다. 공개 MIT License를 임의로 선택하지 않는다.

- 구매자의 자체 서비스와 고객사 서비스 개발에 반복 사용·수정·상업 운영을 허용한다.
- 고객사 결과물 운영·유지보수에 필요한 소스 인계를 허용한다. 고객사가 원본을 개발 도구·템플릿으로 다시 판매하는 권리까지 자동 부여하지 않는다.
- 원본 보일러플레이트를 독립 상품으로 재판매하거나 공개 저장소·공유 자료로 재배포하는 행위를 제한한다.
- 제3자 구성요소는 각 원래 License가 적용되며 상업 조건으로 그 권리를 덮어쓰지 않는다.
- 앱 소스의 소유권과 기존 보일러플레이트의 권리 범위를 구별해 설명한다. DRM·원격 라이선스 검사·Runtime 비용을 추가하지 않는다.

계획 산출물은 루트 `LICENSE`, `THIRD_PARTY_NOTICES.md`, 필요한 License 원문, 판매·지원 범위 문서다. `pnpm licenses list --json`을 기초 Inventory로 사용하되 모든 Workspace와 배포할 제3자 자료·설정의 출처를 대조한다. 식별 불가·조건 미확인 구성요소는 수동 검토 후 출고한다.

권리자 표기, 지원 기간·응답 범위, 수정·업데이트 제공 범위, 구매 취소·환불 조건은 판매자가 최종 확정할 입력 항목이다. 설계·구현자가 임의의 기간이나 무조건적 보증을 정하지 않는다. 해당 필드가 미확정이면 판매본 승인을 막는다. 플랫폼 등록 유형과 조건은 실제 상품 구성 및 당시 크몽 가이드를 확인한다.

### 7.2 납품 파일 생성

새 `release:package` 명령은 고정 Commit의 Git Blob과 검토된 생성 고지를 입력으로 사용한다. 작업 디렉터리 전체를 압축하지 않는다. `tooling/scripts/config/release-files.json`에서 포함·제외 규칙을 관리하고 새 추적 파일이 분류 밖이면 실패한다.

| 포함                                                                                          | 제외                                                                                        |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 앱·Package·Generator·Tooling Source, Test/Story, 전체 Migration, Lockfile·Workspace·빌드 설정 | 실제 `.env*`, `.git`, `node_modules`, `.next`, `.turbo`, 테스트 결과·인증 상태·Build 산출물 |
| 정확히 세 공개 Env Example, 설치·운영·구매자 문서, 공개 가능한 검증 기록                      | `.vercel`, `.aws`, 인증 파일·개인 `*.local` 설정·내부 메모                                  |
| `AGENTS.md`, `CLAUDE.md`, 검토된 `.agents`·`.codex`·`.claude` 공유 Scaffold                   | 내부 `docs/superpowers` 설계·작업 기록                                                      |
| `settings.local.example.json` 등 승인된 공개 Example, 이용허락·OSS 고지                       | 미분류 경로, 외부 Symlink, 경로 탈출, 검토되지 않은 License 자료                            |

납품 문서의 내부 Link가 제외 파일을 참조하면 생성에 실패한다. 초기화 명령은 이용허락·제3자 고지·Release Manifest 등 원본 증빙 파일을 이름 치환에서 제외하도록 보완하고, 가짜 고지 Fixture로 바이트 보존을 검증한다.

출력은 `dist/release` 아래 Archive, 파일별 SHA-256·Source Commit·상품 버전·지원 환경·검증 근거 식별자를 담은 Manifest, Archive의 외부 SHA-256 파일이다. Manifest 자기 자신의 Hash와 Archive Hash를 순환 포함하지 않는다. 이 Hash는 납품 시점의 무결성 기준이며 구매자가 초기화·수정한 뒤 같은 Hash를 요구하지 않는다.

Artifact 검사에는 금지 경로·알려진 비밀 패턴 검사를 포함하고 값 원문을 로그에 출력하지 않는다. 패턴 검사만으로 Secret 부재를 보장하지 않으며 공유 설정·고지·문서 Inventory의 검토를 함께 요구한다. 사용자·서버별 설정이나 라이선스 검토 미완 항목을 조용히 포함하지 않는다.

### 7.3 납품본 자체의 인수

1. 생성한 Archive를 새 경로에 풀고 Hash·파일 Inventory·문서 Link를 확인한다.
2. 구매자 가이드대로 Node 직접 초기화, 이름·Scope 변경, 첫 설치·포맷을 수행한다.
3. 갱신된 Lockfile의 Frozen Install과 가짜 로컬 환경 설정을 확인한다.
4. 새 DB에서 검사·기본 테스트·통합 테스트·두 앱 Build/실행·E2E를 검증한다.
5. macOS 및 Linux의 지원 결과와 같은 Source Commit을 연결한다. 참조 배포 기록도 같은 Commit에 맞춘다.

정확한 Release Candidate와 Audit·라이선스·실제 인수 기록의 Commit/Lockfile이 다르면 출고를 중단한다. Archive 게시·크몽 등록은 검토된 납품본으로 별도 수행한다.

완료 기준: 이용허락·지원 필드 확정, OSS 고지 검토, 금지 파일 0개, 납품본의 새 설치·실행 통과, P0-1~4와 동일한 Release Candidate 증거 확보.

근거: [크몽 서비스 등록 가이드](https://kmong.com/support/expert-center/posts/754). 상품 승인이나 법적 적합성을 자동 보장하는 설계가 아니다.

## 8. 문서와 코드의 소유권

아래는 구현 시 갱신할 위치다. 전문 문서가 실제 구현의 기준을 소유하고 이 설계는 제안·결정 기록으로 남긴다.

| 위치                                  | 책임                                                           |
| ------------------------------------- | -------------------------------------------------------------- |
| `docs/06_환경변수.md`                 | 환경별 우선순위와 주입값 계약                                  |
| `docs/07_데이터베이스.md`             | 운영 Prisma 설정, Migration 명령과 실패 처리                   |
| `docs/12_테스트_전략.md`              | 환경·Migration·외부 인수·납품본 Test Level                     |
| `docs/16_개발_워크플로우.md`          | 새 명령 요약과 실행 진입점                                     |
| `docs/17_보안_및_운영_기본정책.md`    | Audit 예외 승인, 환경·Secret·Release 보안 기준                 |
| 새 `docs/23_배포_및_인수.md`          | Vercel/관리형 DB 참조 배포 Runbook, 실제 인수 표               |
| 새 `docs/24_판매_및_납품.md`          | 상품 범위·지원·납품 기준. 이용허락과 OSS 상세는 루트 문서 참조 |
| `docs/00_문서_가이드.md`, Root README | 전문 문서 진입점, 검증된 제공 범위·지원 버전                   |
| `packages/auth/README.md`             | Kakao 동의항목과 Provider Callback 설정                        |
| `tooling/scripts/README.md`           | Audit·Release CLI 사용법                                       |
| `docs/verification/`                  | 날짜·Commit별 실제 검증 결과, 미검증 범위                      |

설계에 새 서버 API·Domain Rule·Prisma Schema 변경은 필요하지 않다. CLI의 DB 작업은 Database Package와 기존 Script Client 경계 안에서 처리한다.

## 9. 구현 단계와 검증 순서

| 단계 | 구현·검증 내용                                                  | 다음 단계의 전제                                  |
| ---- | --------------------------------------------------------------- | ------------------------------------------------- |
| A    | 환경 로딩 수정·Seed 보호·로컬 계약 회귀, Kakao Scope와 URL Test | 기존 설치·Build·E2E 유지                          |
| B    | 최소 호환 보안 패치·Audit 판정기·CI Gate                        | 미판정 High/Critical 제거 및 정적·Unit·Build 검증 |
| C    | 운영 Prisma 설정·명령·임시 DB Migration 반복 CI                 | 빈 DB 설치·재실행·Drift·데이터 유지 통과          |
| D    | Vercel 참조 Staging 두 앱·실제 OAuth·관리자·재배포 인수         | 외부 접근·계정 소유자의 검증, 같은 Commit 기록    |
| E    | 이용허락·고지·지원 조건 확정, Release CLI와 Archive 재현        | 같은 Release Candidate의 모든 출고 기준 충족      |

이용허락·OSS Inventory와 문서 초안은 A~D와 병행할 수 있다. 지원 기간 등 판매자 입력의 미확정 상태는 기술 구현을 막지 않지만 최종 출고를 막는다.

변경 가까이에서 테스트한 뒤 전체 `pnpm check`, `pnpm test`, 관련 DB Integration, E2E, 앱 Build를 수행한다. Dependency 변경 단계에서는 세 Storybook Build도 검증한다. 기존 검증 건수를 고정 목표로 삼지 않고 새 Test를 포함한 실제 결과를 기록한다.

## 10. 구현 전제와 최종 출고 조건

설계 검토 후 구현을 진행한다. 실제 외부 배포·Migration·계정 권한 변경은 대상 계정·환경·권한이 준비된 단계에서 수행하며, 테스트 DB 작업과 운영 데이터 작업을 구분한다.

외부 입력이 필요한 항목은 다음과 같다.

- 참조 Vercel 계정·프로젝트, 안정된 HTTPS Origin, 관리형 PostgreSQL 계정·리전·Staging DB와 역할.
- 세 OAuth Provider 앱과 검증 계정, 필요한 동의항목·심사 완료 여부.
- 메일 발송을 제공 범위에 넣는 경우 Resend 계정·검증 발신 도메인.
- 판매자의 권리자 표기, 지원·업데이트·취소/환불 조건 최종 값.
- Audit 예외 승인자와 보호 Branch / 배포 환경 설정.

출고는 운영 환경변수 회귀·Kakao 실제 로그인·보안 판정·Migration 및 두 앱 인수·납품 Archive 재현·이용허락/고지 검토가 같은 Release Candidate에서 충족됐을 때 승인한다. 준비되지 않은 외부 항목은 미검증 상태로 기록한다.
