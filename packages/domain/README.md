# `@repo/domain`

비즈니스 도메인 규칙과 애플리케이션 레벨 로직을 담당하는 패키지입니다.

`domain`은 단순 타입 모음이나 DTO 저장소가 아니라,
실제 서비스의 "행동 규칙"과 "도메인 정책"을 정의하는 계층입니다.

---

# 목적

`@repo/domain`의 역할은 다음과 같습니다.

```txt
도메인 상수 정의
Zod 입력 스키마 관리
DTO 관리
비즈니스 규칙 처리
권한 정책 처리
DTO Mapper 관리
Repository 조합
Result 반환
```

핵심 원칙:

```txt
database는 DB 접근만 담당한다.
domain은 비즈니스 규칙을 담당한다.
apps는 조립과 라우팅만 담당한다.
```

---

# 의존성 방향

```txt
apps/*
  ↓
domain
  ↓
database
  ↓
core
```

금지 방향:

```txt
database → domain
core → domain
packages/* → apps/*
```

---

# 디렉터리 구조

```txt
packages/domain
├─ src
│  ├─ user
│  │  ├─ client.ts
│  │  ├─ server.ts
│  │  ├─ user.constant.ts
│  │  ├─ user.dto.ts
│  │  ├─ user.error.ts
│  │  ├─ user.mapper.ts
│  │  ├─ user.permission.ts
│  │  ├─ user.schema.ts
│  │  └─ user.service.ts
│  │
│  └─ content
│     ├─ client.ts
│     ├─ server.ts
│     ├─ content.constant.ts
│     ├─ content.dto.ts
│     ├─ content.error.ts
│     ├─ content.mapper.ts
│     ├─ content.permission.ts
│     ├─ content.schema.ts
│     └─ content.service.ts
│
├─ eslint.config.js
├─ package.json
├─ README.md
└─ tsconfig.json
```

---

# 파일 역할

## `*.constant.ts`

도메인 상수 정의.

```ts
export const USER = {
  NICKNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
} as const;
```

포함 대상:

```txt
필드명
검증 길이
정규식
메시지
숫자 범위
```

---

## `*.schema.ts`

Zod 기반 입력 검증 스키마.

```ts
export const UpdateUserProfileRequest = z.object({
  nickname: z.string(),
});
```

포함 대상:

```txt
FormData 검증
Action 입력 검증
Query 검증
Params 검증
```

---

## `*.dto.ts`

서비스/프론트엔드 응답 타입.

```ts
export interface UserResponse {
  id: string;
  nickname: string;
}
```

주의사항:

```txt
DTO는 domain에서만 관리한다.
repository에서 DTO를 반환하지 않는다.
```

---

## `*.mapper.ts`

Prisma Model → DTO 변환.

```ts
export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    nickname: user.nickname,
  };
}
```

---

## `*.permission.ts`

권한 정책 처리.

```ts
export function canUpdateUser(actor: UserPermissionActor, targetUserId: string) {
  return actor.role === "ADMIN" || actor.id === targetUserId;
}
```

포함 대상:

```txt
수정 가능 여부
삭제 가능 여부
조회 가능 여부
관리 권한 여부
```

---

## `*.service.ts`

실제 비즈니스 로직 처리.

```ts
export async function updateUserProfileService() {}
```

포함 대상:

```txt
비즈니스 규칙
상태 검증
중복 검증
Repository 조합
Result 반환
로깅
```

포함하면 안 되는 것:

```txt
HTTP 처리
revalidatePath
redirect
쿠키 직접 처리
Next.js API 의존
```

---

# client / server export 분리

## `client.ts`

브라우저에서도 안전한 코드만 export.

```ts
export * from "./user.constant";
export * from "./user.dto";
export * from "./user.schema";
```

포함 대상:

```txt
상수
DTO
Zod schema
```

---

## `server.ts`

서버 전용 로직 export.

```ts
import "server-only";

export * from "./user.service";
export * from "./user.permission";
export * from "./user.mapper";
export * from "./user.error";
```

포함 대상:

```txt
service
permission
mapper
error
```

주의사항:

```txt
server.ts에서 client.ts를 re-export 하지 않는다.
barrel import로 인해 서버 코드가 클라이언트 번들에 섞이는 문제를 방지한다.
```

---

# Service 작성 규칙

## 기본 흐름

```txt
Service
  → Repository 호출
  → 비즈니스 검증
  → DTO 변환
  → Result 반환
```

---

## 예시

```ts
export async function getUserByIdService(
  userId: string,
): Promise<Result<UserDetailResponse, AppError>> {
  try {
    const user = await findUserByIdRepository(userId);

    if (!user) {
      return failure({
        code: USER_ERROR_CODE.NOT_FOUND,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    return success(toUserDetailResponse(user));
  } catch (error) {
    return failure(error as AppError);
  }
}
```

---

# Result Pattern

모든 service는 `Result`를 반환합니다.

```ts
type Result<T, E> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: E;
    };
```

성공:

```ts
return success(data);
```

실패:

```ts
return failure(error);
```

---

# 비즈니스 로직 문서화 규칙

실제 프로젝트에서는 각 도메인에 비즈니스 정책을 반드시 기록하는 것을 권장합니다.

예시:

```txt
닉네임은 2~50자여야 한다.
DELETED 상태 사용자는 조회되지 않는다.
SUSPENDED 사용자는 프로필 수정이 불가능하다.
HIDDEN 콘텐츠는 작성자와 관리자만 조회 가능하다.
```

추천 위치:

```txt
packages/domain/src/user/README.md
packages/domain/src/content/README.md
```

---

# 도메인 문서 예시

## `src/user/README.md`

```md
# User Domain

## 상태 정책

ACTIVE
정상 사용자

SUSPENDED
일부 기능 제한

BANNED
서비스 접근 차단

DELETED
소프트 삭제 상태

---

## 닉네임 정책

2~50자
한글/영문/숫자/밑줄 허용
중복 불가

---

## 권한 정책

ADMIN
전체 사용자 관리 가능

USER
자기 자신의 데이터만 수정 가능
```

---

# 추천 네이밍

## 파일

```txt
user.service.ts
content.mapper.ts
product.permission.ts
```

---

## 함수

```txt
createContentService
updateUserProfileService
toUserResponse
canManageUsers
```

---

## 타입

```txt
UserResponse
ContentDetailResponse
UpdateUserProfileRequestInput
```

---

# 주의사항

## Repository는 DTO를 반환하지 않는다

잘못된 예:

```ts
return ContentResponse;
```

올바른 예:

```ts
return Content;
```

DTO 변환은 domain에서 처리.

---

## Service에서 Next.js API 사용 금지

잘못된 예:

```ts
redirect("/");
revalidatePath("/");
cookies();
```

이런 것은 apps layer에서 처리.

---

## Service는 가능한 순수하게 유지

좋은 방향:

```txt
입력
→ 검증
→ repository 조합
→ Result 반환
```

---

# lint / type check

```bash
pnpm --filter @repo/domain lint
pnpm --filter @repo/domain check-types
```

---

# 최종 목표

`domain`은 단순 데이터 계층이 아니라:

```txt
서비스의 실제 규칙
상태 전이
권한 정책
도메인 행위
```

를 담당하는 계층으로 유지합니다.

핵심 원칙:

```txt
DB 접근은 database
비즈니스 규칙은 domain
조립과 라우팅은 apps
```
