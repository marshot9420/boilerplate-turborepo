# Turborepo Boilerplate Architecture

TODO:

- 디자인 시스템에 form 에러 처리 유틸 함수 추가
- 디자인 시스템에 sonner 공통 함수 추가
- 디자인 시스템에 다음과 같은 기본 컴포넌트 추가

```txt
1. button
2. icon-button
3. link-button

4. input
5. textarea
6. checkbox
7. radio
8. switch
9. select
10. combobox

11. label
12. field
13. field-label
14. field-error
15. field-description

16. card
17. badge
18. separator
19. skeleton
20. spinner

21. avatar
22. image-frame
23. empty-state

24. dialog
25. drawer
26. popover
27. dropdown-menu
28. tooltip

29. tabs
30. accordion
31. pagination
32. breadcrumb

33. table
34. data-list
35. stat-card

36. toast
37. alert
38. confirm-dialog

39. container
40. stack
41. grid
42. section
```

- `pnpm generate domain [도메인명]` 실행 시, 컴포넌트도 자동 생성? 혹은 컴포넌트 자동 생성 추가 (그 전에 컨벤션 확립)
  - 컴포넌트 계층 별로 필요할지도
  - `apps/*/app/**/page.tsx`의 경우, `export const runtime = "nodejs";`가 자동 추가되도록?
- `apps/`에 앱을 추가했을 때 자동 기본 설정 제너레이터
- 보일러 플레이트로 새로운 프로젝트를 만들었을 때 사용할, 모든 `@repo`를 입력한 값으로 수정되게끔 스크립트 추가
- `apps/admin`, `apps/web`에 기본 `next.config.js` 설정 추가
- `docs/` 내용 수정
- `packages/*`, `apps/*` 별 `README.md` 최종 검토
- Vitest 통합 테스트 공통 설정 추가 및 테스트용 DB 연결
- Playwright 공통 설정 패키지 추가
- 필요하다면 도메인 제너레이터 실행 시 Vitest 통합 테스트 파일도 추가되게끔
- `apps/*` 생성 스크립트 실행 시 Playwright 공통 설정 패키지도 적용되게끔
- 워크스페이스 설정 점검 및 `.vscode/` 설정 검토
- 그 외 필요한 것은 없는지 검토
- 루트 `README.md` 작성

---

현재 구조라면 순서는 이렇게 가시면 됩니다.
아키텍처 문서에서도 `design-system`의 역할에 `form helper`, `toast helper`가 포함되어 있으므로 이 작업은 방향이 맞습니다.

## 작업 순서

1. **용어 정리**
   - `sooner`가 아니라 toast 라이브러리인 `sonner`를 의미하는지 먼저 확정합니다.
   - 이후 작업명은 `sonner 공통 함수`가 아니라 `toast 공통 함수`로 잡는 것이 좋습니다.

2. **`@repo/design-system`에 `sonner` 의존성 추가**
   - `packages/design-system/package.json`의 `dependencies`에 `sonner`를 추가합니다.
   - 앱에서 직접 `sonner`를 쓰지 않고 디자인 시스템을 통해 쓰게 만들 목적입니다.

3. **디자인 시스템 exports 확장**
   - `package.json` exports에 다음 경로를 추가합니다.
   - `./form`
   - `./toast`

4. **form 디렉터리 생성**
   - `packages/design-system/src/form`
   - 최소 구성은 다음 정도로 시작합니다.

   ```txt
   form/
   ├─ get-field-error.ts
   ├─ get-form-error.ts
   ├─ has-field-error.ts
   └─ index.ts
   ```

5. **form 에러 처리 유틸 작성**
   - `ActionResult` 기준으로 필드 에러를 안전하게 읽는 함수들을 만듭니다.
   - 우선순위는 다음입니다.
     1. `getFieldError(result, field)`
     2. `hasFieldError(result, field)`
     3. `getFormError(result)`

6. **form 유틸 단위 테스트 추가**
   - `get-field-error.test.ts`
   - `has-field-error.test.ts`
   - `get-form-error.test.ts`
   - 성공 Result, 실패 Result, fieldErrors 없음, 존재하지 않는 필드, 여러 에러 중 첫 번째 반환 케이스를 검증합니다.

7. **toast 디렉터리 생성**
   - `packages/design-system/src/toast`
   - 최소 구성은 다음 정도가 좋습니다.

   ```txt
   toast/
   ├─ toast-action-result.ts
   ├─ toast-provider.tsx
   └─ index.ts
   ```

8. **ToastProvider 작성**
   - 내부적으로 `sonner`의 `Toaster`를 감싸는 컴포넌트를 만듭니다.
   - 앱에서는 `sonner`를 직접 import하지 않고 `@repo/design-system/toast`에서 가져오게 합니다.

9. **ActionResult 기반 toast 함수 작성**
   - `toastActionResult(result)`를 만듭니다.
   - `result.ok === true`면 성공 toast
   - `result.ok === false`면 에러 toast
   - 메시지가 없을 때 사용할 기본 문구도 디자인 시스템 내부에서 통일합니다.

10. **toast 유틸 테스트 추가**

- `sonner`의 `toast.success`, `toast.error`를 mock 처리합니다.
- 성공 Result, 실패 Result, 기본 메시지 fallback 케이스를 검증합니다.

11. **디자인 시스템 Storybook에 ToastProvider 반영**

- `packages/design-system/.storybook/preview.tsx` 또는 공통 preview 설정에서 `ToastProvider`를 감쌉니다.
- toast 관련 예시 스토리를 하나 추가해도 됩니다.

12. **apps/web, apps/admin layout에 ToastProvider 추가**

- 각 앱의 `src/app/layout.tsx`에서 `ToastProvider`를 배치합니다.
- 이렇게 해야 실제 앱에서 `toastActionResult()` 호출 시 정상 표시됩니다.

13. **기존 로그인/로그아웃 UI에 부분 적용**

- 바로 전체 폼에 적용하지 말고, 현재 존재하는 `LoginView`, `SocialLoginButtons`, `LogoutButton` 중 하나에만 먼저 적용합니다.
- Server Action 결과를 받는 폼이 있다면 거기에 `getFieldError`, `toastActionResult`를 연결합니다.

14. **전체 검증 실행**

```bash
pnpm --filter @repo/design-system test
pnpm --filter @repo/design-system check-types
pnpm --filter @repo/design-system lint
pnpm --filter web check-types
pnpm --filter admin check-types
```

15. **README 업데이트**

- `packages/design-system/README.md`에 다음 내용을 추가합니다.
- form helper 사용 예시
- toast helper 사용 예시
- 앱 layout에 `ToastProvider`를 추가해야 한다는 규칙
- 앱에서 `sonner`를 직접 import하지 않는다는 규칙

정리하면, **form helper → 테스트 → toast helper → provider → 앱 layout 적용 → 실제 폼 일부 적용 → 문서화** 순서가 가장 안전합니다.

---

---

1. apps/web/src/actions/user/update-my-profile.action.ts

2. apps/web/src/actions/content/create-content.action.ts

3. content service 권한 시그니처 보강
   - updateContentService(contentId, actorUserId, input)
   - softDeleteContentService(contentId, actorUserId)

4. apps/web/src/actions/content/update-my-content.action.ts

5. apps/web/src/actions/content/delete-my-content.action.ts

6. apps/admin/src/actions/content/\*
7. apps/admin/src/actions/user/\*

---
