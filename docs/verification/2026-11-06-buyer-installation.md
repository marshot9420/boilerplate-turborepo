# 구매자 환경 설치 재현 — 2026-11-06

새 프로젝트의 설치 절차는 [프로젝트 초기화](../15_프로젝트_초기화.md)가 기준입니다. 이 문서는 해당 절차를 실제로 실행한 검증 기록입니다.

## 검증 환경과 격리 범위

- macOS 26.6.2 / Apple Silicon, Node.js 24.16.0, pnpm 11.9.0, PostgreSQL 16.14.
- 기준 Commit `2ac7fe7`의 추적 파일을 `git archive`로 내보내고 이번 수정 사항을 적용했습니다. 기존 `node_modules`, 앱 Build 결과, Turbo Cache, 실제 로컬 환경 파일은 복사하지 않았습니다.
- 초기화 전 별도 Git 저장소를 만들고 `--remove-git`으로 제거되는 것을 확인했습니다. 실제 프로젝트의 Git 이력은 유지했습니다.
- 프로젝트 이름을 `customer-starter`, Package Scope를 `@customer`, DB 접두어를 `customer_starter`, Session Cookie 이름을 `customer_starter_session`으로 변경했습니다.
- pnpm 저장소는 비어 있는 임시 경로를 사용했습니다. 첫 설치에서 Package 724개를 다운로드했고 재사용은 0개였습니다. 전용 `store-dir` 설정은 검증 복사본에만 적용했습니다.
- PostgreSQL도 기존 서비스와 별개인 임시 Data Directory와 Port `52114`로 실행했습니다. `customer_starter`, `customer_starter_test`, `customer_starter_e2e` 세 개의 빈 DB를 준비했습니다.
- 환경 파일은 공개 Example에서 생성하고 가짜 OAuth 값, Console Mailer, 검증 전용 E2E Secret으로 설정했습니다. 실제 Credential은 사용하지 않았습니다.
- Node.js, pnpm, Git, PostgreSQL 실행 파일과 Playwright Chromium 실행 파일은 호스트에 준비된 것을 사용했습니다. 새 OS / VM 전체를 설치한 검증은 아닙니다.

## 확인한 문제와 보완

| 문제                                                          | 보완                                                                                                                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 설치 전 `pnpm init-project`가 pnpm 11의 자동 설치를 먼저 실행 | 최초 초기화를 의존성 없는 Node 직접 실행으로 안내하고 CLI Help와 README를 일치시킴                                                                                 |
| 초기화와 Scope 변경이 기존 `.env*` 내용까지 읽고 치환         | 정확히 세 Example만 치환하도록 제한하고 로컬 파일의 바이트 보존·Callback 격리·Dry Run 회귀 테스트 3개 추가                                                         |
| 테스트 Example의 빈 OAuth 값이 환경 스키마와 불일치           | 테스트용 가짜 값 제공, DB 접속 계정 예시 통일                                                                                                                      |
| 개발 Example이 외부 메일 발송 설정을 요구                     | 기본 Console Mailer와 빈 Resend Key 사용                                                                                                                           |
| Scope 변경 후 Import 경로 길이 때문에 포맷 검사 실패          | 첫 설치 뒤 `pnpm format`을 실행하도록 CLI와 초기화 절차 보완                                                                                                       |
| 익명 사용자의 콘텐츠 작성 페이지가 500 응답                   | Web의 콘텐츠 작성·수정 / 프로필 조회·수정 네 Page에 앱 전용 인증 Redirect Helper 적용. 세션 조회 오류는 그대로 전파. Unit 3개와 Desktop / Mobile 익명 E2E 8개 추가 |
| 구매자가 DB·OAuth·관리자 준비 순서를 알기 어려움              | PostgreSQL 선택 설치, 환경별 URL·권한, 실제 OAuth와 Seed 관리자 제약, 개발·Production 포트 실행 절차 문서화                                                        |

## 실행 결과

아래 명령은 이름과 Scope를 바꾼 검증 복사본의 Root에서 실행했습니다. 첫 실패 후 원인을 수정한 단계는 최종 결과를 기재합니다.

| 단계                  | 명령 / 확인                                                                                         | 결과                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 변경 미리보기         | `node tooling/scripts/src/init-project.ts customer-starter --scope customer --remove-git --dry-run` | 통과                                                                         |
| 초기화                | 위 명령에서 `--dry-run` 제거                                                                        | 이름·Scope·Cookie 변경, 로컬 환경 파일 3개 생성, 임시 `.git` 제거 확인       |
| 빈 저장소 설치        | `pnpm install --no-frozen-lockfile`                                                                 | 통과, 18 Workspace / 712 Package 설치                                        |
| 고정 설치             | `pnpm install --offline --frozen-lockfile`                                                          | 통과                                                                         |
| 초기 포맷             | `pnpm format`                                                                                       | 통과                                                                         |
| 개발 DB 준비          | `pnpm db:generate`, `pnpm db:push`, `pnpm db:seed`                                                  | 모두 통과                                                                    |
| 전체 검사             | `pnpm check`                                                                                        | lint·Boundary·Type·Format 모두 통과                                          |
| 기본 테스트           | `pnpm test`                                                                                         | 1,654개 통과. 기존 Unit / Component와 새 Bootstrap 3개, 인증 Helper 3개 포함 |
| 통합 테스트           | `pnpm db:test:push`, `pnpm test:integration`                                                        | 16개 통과                                                                    |
| Browser 준비          | `pnpm exec playwright install chromium`                                                             | 통과, 기존 호스트의 일치하는 Browser Cache 사용                              |
| Browser E2E           | `CI=true pnpm test:e2e`                                                                             | 24개 통과: Web 18 / Admin 6, Desktop / Mobile Chromium                       |
| 개발 실행             | `pnpm dev`                                                                                          | Web / Admin 동시 실행 확인                                                   |
| 일반 Production Build | `pnpm build --force`                                                                                | Web / Admin 모두 통과, 두 Build Task Cache 사용 없음                         |
| Production 실행       | `pnpm --filter web start --port 3000`, `pnpm --filter admin start --port 3001`                      | 동시 실행·화면 응답·인증 Redirect 모두 통과                                  |

개발 서버와 일반 Production Build 실행 결과 모두에서 Web 홈·공개 콘텐츠 목록·로그인과 Admin 로그인의 HTTP 200 및 기대한 화면 내용을 확인했습니다. Web `/contents/create`와 Admin `/contents`의 익명 접근은 로그인으로 HTTP 307 이동했습니다. 검증 스크립트가 실행한 서버만 종료했습니다. E2E 서버와 별도 PostgreSQL 클러스터도 종료했으며 검증에 사용한 다섯 Port가 닫힌 것을 확인했습니다. 기존 개발 환경과 DB는 변경하지 않았습니다.

## 별도 확인이 필요한 범위

이 기록은 위 macOS 환경의 로컬 설치 검증입니다. Docker PostgreSQL 17 예시는 문서에 제공하지만 이번 실행은 독립 PostgreSQL 16.14 클러스터를 사용했습니다. Linux / Windows와 실제 배포 플랫폼은 이 기록의 검증 대상에 포함하지 않습니다.

실제 Google / Naver / Kakao 로그인, Callback 등록, Resend 발송은 구매자의 외부 서비스 Credential로 확인해야 합니다. E2E는 DB Session Fixture를 사용하므로 외부 OAuth 성공을 증명하지 않습니다. Seed의 가짜 Provider ID를 가진 관리자는 실제 소셜 로그인 계정과 자동 연결되지 않습니다.

개발 DB는 `db:push`로 준비했습니다. 기존 운영 DB에 대한 Migration 배포나 운영 관리자 권한 부여를 검증한 기록은 아닙니다.
