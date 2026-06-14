# Turborepo Boilerplate Architecture

TODO:

- `apps/admin`, `apps/web`에 디자인 패턴(완화된 FSD) 적용 및 샘플 기능 구현 (GOOGLE, NAVER, KAKAO 세션 기반 인증 포함)
- 디자인 시스템에 애플리케이션 별 CSS 토큰, 색상 팔레트, UI 컴포넌트 추가
- 디자인 시스템에 form 에러 처리 유틸 함수 추가
- 디자인 시스템에 sooner 공통 함수 추가
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
