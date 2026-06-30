import type { PaginationMeta } from "@repo/core/pagination";
import { Pagination } from "@repo/design-system/admin";

import { URLS } from "@/constants";

type ContentPaginationSearchParams = Record<string, string | string[] | undefined>;

export interface ContentPaginationProps {
  meta: PaginationMeta;
  searchParams?: ContentPaginationSearchParams;
}

function createContentListHref(page: number, searchParams: ContentPaginationSearchParams = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page") {
      continue;
    }

    const resolvedValue = Array.isArray(value) ? value[0] : value;

    if (resolvedValue !== undefined && resolvedValue !== "") {
      params.set(key, resolvedValue);
    }
  }

  params.set("page", String(page));

  return `${URLS.CLIENT.CONTENTS}?${params.toString()}`;
}

export default function ContentPagination({ meta, searchParams }: ContentPaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <Pagination
      meta={meta}
      getHref={(page) => createContentListHref(page, searchParams)}
      previousLabel="이전"
      nextLabel="다음"
      aria-label="콘텐츠 목록 페이지네이션"
    />
  );
}
