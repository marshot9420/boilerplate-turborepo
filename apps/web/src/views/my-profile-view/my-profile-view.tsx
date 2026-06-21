import type { AppError } from "@repo/core/errors";
import type { Result } from "@repo/core/result";
import { Alert, AlertDescription, AlertTitle, LinkButton } from "@repo/design-system/web";
import type { UserDetailResponse } from "@repo/domain/user/client";

import { URLS } from "@/constants";
import { UserProfileCard } from "@/entities/user";

export interface MyProfileViewProps {
  result: Result<UserDetailResponse, AppError>;
}

export default function MyProfileView({ result }: MyProfileViewProps) {
  if (!result.ok) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <Alert tone="danger">
          <AlertTitle>내 정보를 불러올 수 없습니다.</AlertTitle>
          <AlertDescription>{result.error.message}</AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium">마이페이지</p>

        <h1 className="text-foreground text-3xl font-bold tracking-tight">내 정보</h1>

        <p className="text-muted-foreground text-sm">
          현재 로그인된 계정의 기본 정보를 확인할 수 있습니다.
        </p>
      </header>

      <UserProfileCard
        user={result.data}
        actions={
          <LinkButton href={`${URLS.CLIENT.MY_PAGE}/edit`} variant="outline" size="sm">
            프로필 수정
          </LinkButton>
        }
      />
    </main>
  );
}
