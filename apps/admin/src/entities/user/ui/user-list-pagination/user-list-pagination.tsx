import type { PaginationMeta } from "@repo/core/pagination";
import { Pagination } from "@repo/design-system/admin";
import type { UserListQueryInput } from "@repo/domain/user/client";

export interface UserListPaginationProps {
  action: string;
  query: UserListQueryInput;
  meta: PaginationMeta;
}

function createUserListHref(action: string, query: UserListQueryInput, page: number) {
  const searchParams = new URLSearchParams();

  const keyword = query.keyword?.trim();

  if (keyword) {
    searchParams.set("keyword", keyword);
  }

  if (query.role) {
    searchParams.set("role", query.role);
  }

  if (query.status) {
    searchParams.set("status", query.status);
  }

  if (query.sortKey) {
    searchParams.set("sortKey", query.sortKey);
  }

  if (query.sortDirection) {
    searchParams.set("sortDirection", query.sortDirection);
  }

  if (query.limit) {
    searchParams.set("limit", String(query.limit));
  }

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  const queryString = searchParams.toString();

  return queryString ? `${action}?${queryString}` : action;
}

export default function UserListPagination({ action, query, meta }: UserListPaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <Pagination
      aria-label="사용자 목록 페이지 이동"
      className="mt-6"
      meta={meta}
      getHref={(page) => createUserListHref(action, query, page)}
      previousLabel="이전"
      nextLabel="다음"
    />
  );
}
