# 리팩토링

- `apps/**/`에서, 완화된 FSD를 적용할 때 각 Entity, Feature, View 별 세그먼트(ex: `libs/`, `ui/`, `constants/`, `types/`, `hooks/`, 그 외 기타 등등)을 두는 것

- 프로젝트 초기화 시, 현재 보일러 플레이트의 이름은 `boilerplate-turborepo`이고, 각 패키지는 `@repo`라 생기는 문제
  - 예를 들어, `@repo`를 `@mars`로 바꿔도 각 문서 별로 `boilerplate-turborepo`는 남음.
  - 또한, `boilerplate-turborepo`가 아니라 `Boilerplate Turborepo` 등의 형태로 남을 가능성 존재

- 파일 네이밍 컨벤션 재정의

- 계층별, 디자인 시스템 별 단위 테스트, 통합 테스트, E2E 테스트, 그리고 컴포넌트들의 스토리북 작성 범위 명시

- 스크립트, 제너레이터를 포함한 코드들이 현재 `apps/`에 있는 `admin/`, `web/` 등에 너무 의존하는 중. 만약 `npc/` 등이 추가되면 대응하기가 어려움

- 디자인 시스템 컴포넌트 전부 제거, Primitives 컴포넌트는 제거하고, Admin과 Web 디자인 시스템 컴포넌트만 남겨두고, 이것도 다시 재구축

- 이슈 템플릿 및 PR 템플릿 재작성

- Vercel, Supabase를 고려한 배포 정책
