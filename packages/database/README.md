# @repo/database

Prisma 기반 데이터베이스 접근 패키지입니다.

이 패키지는 DB 접근만 담당합니다.

## 역할

- Prisma Client 생성
- PostgreSQL Pool 관리
- Transaction helper 제공
- Prisma Error → AppError 변환
- Repository 제공

## 사용 원칙

Repository는 `Result`를 반환하지 않습니다.

```txt
Repository
  - Prisma query 실행
  - 성공 시 Prisma Model 반환
  - 실패 시 mapPrismaError(error)를 throw
```

`Result` 변환은 `domain service` 계층에서 처리합니다.

## Export

```ts
import { prisma } from "@repo/database/client";
import { transaction } from "@repo/database/transaction";
import { mapPrismaError } from "@repo/database/errors";

import { findUserByIdRepository } from "@repo/database/user";
import { findContentByIdRepository } from "@repo/database/content";
```

## Prisma Client

```ts
import { prisma } from "@repo/database/client";

const user = await prisma.user.findUnique({
  where: {
    id: userId,
  },
});
```

대부분의 경우 애플리케이션 코드에서 `prisma`를 직접 사용하지 말고 repository를 사용합니다.

## Repository 사용 예시

```ts
import { findUserByIdRepository } from "@repo/database/user";

const user = await findUserByIdRepository(userId);

if (!user) {
  throw new Error("User not found");
}
```

## Transaction 사용 예시

여러 DB 작업을 하나의 트랜잭션으로 묶을 때 사용합니다.

```ts
import { transaction } from "@repo/database/transaction";

await transaction(async (database) => {
  const user = await database.user.create({
    data: {
      email: "user@example.com",
      nickname: "tester",
    },
  });

  await database.content.create({
    data: {
      title: "첫 번째 글",
      content: "내용입니다.",
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });
});
```

Repository와 함께 사용할 경우에는 repository가 `database` 인자를 받을 수 있도록 확장할 수 있습니다.

```ts
import { transaction } from "@repo/database/transaction";
import { createUserRepository, updateUserRepository } from "@repo/database/user";

await transaction(async (database) => {
  const user = await createUserRepository(
    {
      email: "user@example.com",
      nickname: "tester",
    },
    database,
  );

  await updateUserRepository(
    user.id,
    {
      lastLoginAt: new Date(),
    },
    database,
  );
});
```

단, 현재 repository가 전역 `prisma`만 사용하도록 작성되어 있다면 위 방식은 추후 확장 사항입니다.

## Prisma Error Mapper

Prisma 에러는 외부 계층으로 그대로 노출하지 않습니다.

```ts
import { mapPrismaError } from "@repo/database/errors";

try {
  await prisma.user.create({
    data: {
      email: "duplicated@example.com",
      nickname: "tester",
    },
  });
} catch (error) {
  throw mapPrismaError(error);
}
```

Repository 내부에서는 다음처럼 사용합니다.

```ts
import type { Prisma, User } from "@prisma/client";

import { prisma } from "../client";
import { mapPrismaError } from "../errors";

export async function createUserRepository(data: Prisma.UserCreateInput): Promise<User> {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    throw mapPrismaError(error);
  }
}
```

## Repository 작성 규칙

파일명은 도메인 단위로 작성합니다.

```txt
src/user/user.repository.ts
src/content/content.repository.ts
```

함수명은 다음 패턴을 따릅니다.

```txt
create[Domain]Repository
find[Domain]ByIdRepository
find[Domain]sRepository
update[Domain]Repository
softDelete[Domain]Repository
```

예시:

```ts
createUserRepository;
findUserByIdRepository;
findUserByEmailRepository;
updateUserRepository;
softDeleteUserRepository;
```

## 명령어

```bash
pnpm --filter @repo/database db:generate
pnpm --filter @repo/database db:push
pnpm --filter @repo/database db:migrate
pnpm --filter @repo/database db:studio
```

검사 명령어:

```bash
pnpm --filter @repo/database lint
pnpm --filter @repo/database check-types
```

## 주의사항

- Repository에서 DTO를 반환하지 않습니다.
- Repository에서 `Result`, `success`, `failure`를 사용하지 않습니다.
- Repository는 Prisma Model 또는 Prisma Payload에 가까운 값을 반환합니다.
- Prisma Error는 `mapPrismaError`로 변환해 throw합니다.
- 비즈니스 규칙은 `domain` 패키지에서 처리합니다.
