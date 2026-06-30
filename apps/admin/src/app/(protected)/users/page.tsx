import { requireAdmin } from "@repo/auth/server";
import { getNumberSearchParam, getSearchParam } from "@repo/core/search-params";
import { UserListQuerySchema } from "@repo/domain/user/client";
import { getUsersService } from "@repo/domain/user/server";

import { URLS } from "@/constants";
import { UserListView } from "@/views";

export const runtime = "nodejs";

interface UsersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await requireAdmin();

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(await searchParams)) {
    if (Array.isArray(value)) {
      params.set(key, value[0] ?? "");
      continue;
    }

    if (value !== undefined) {
      params.set(key, value);
    }
  }

  const parsedQuery = UserListQuerySchema.safeParse({
    page: getNumberSearchParam(params, "page"),
    limit: getNumberSearchParam(params, "limit"),
    keyword: getSearchParam(params, "keyword"),
    role: getSearchParam(params, "role"),
    status: getSearchParam(params, "status"),
    sortKey: getSearchParam(params, "sortKey"),
    sortDirection: getSearchParam(params, "sortDirection"),
  });

  if (!parsedQuery.success) {
    return (
      <UserListView
        action={URLS.CLIENT.USERS}
        query={{}}
        errorMessage="검색 조건이 올바르지 않습니다."
      />
    );
  }

  const result = await getUsersService(session.user, parsedQuery.data);

  if (!result.ok) {
    return (
      <UserListView
        action={URLS.CLIENT.USERS}
        query={parsedQuery.data}
        errorMessage={result.error.message}
      />
    );
  }

  return <UserListView action={URLS.CLIENT.USERS} query={parsedQuery.data} result={result.data} />;
}
