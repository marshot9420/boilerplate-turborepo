import { Alert, AlertDescription, AlertTitle, Card } from "@repo/design-system/admin";
import type { UserListQueryInput, UserListResponse } from "@repo/domain/user/client";

import { UserEmpty, UserListPagination, UserTable } from "@/entities/user";
import { UserFilterForm } from "@/features/user";

export interface UserListViewProps {
  action: string;
  query: UserListQueryInput;
  result?: UserListResponse;
  errorMessage?: string;
  getUserHref?: (userId: string) => string;
}

export default function UserListView({
  action,
  query,
  result,
  errorMessage,
  getUserHref,
}: UserListViewProps) {
  const hasUsers = Boolean(result?.items.length);

  return (
    <div className="grid gap-6">
      <header className="grid gap-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">사용자 관리</h1>
        <p className="text-muted-foreground text-sm">
          가입한 사용자를 조회하고 상태와 권한을 확인합니다.
        </p>
      </header>

      <UserFilterForm action={action} query={query} />

      {errorMessage ? (
        <Alert tone="danger">
          <AlertTitle>사용자 목록을 조회하지 못했습니다.</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {result ? (
        <section className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground text-sm">
              총 <strong className="text-foreground font-semibold">{result.meta.totalCount}</strong>
              명
            </p>

            <p className="text-muted-foreground text-xs">
              {result.meta.page} / {result.meta.totalPages} 페이지
            </p>
          </div>

          {hasUsers ? (
            <Card variant="outline">
              <UserTable users={result.items} getUserHref={getUserHref} />
            </Card>
          ) : (
            <UserEmpty />
          )}

          <UserListPagination action={action} query={query} meta={result.meta} />
        </section>
      ) : null}
    </div>
  );
}
