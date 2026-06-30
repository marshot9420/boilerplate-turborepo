import { ContentListQuery } from "@repo/domain/content/client";
import { getContentsService } from "@repo/domain/content/server";

import { ContentListView } from "@/views/content-list-view";

export const runtime = "nodejs";

interface ContentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContentsPage({ searchParams }: ContentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const parsed = ContentListQuery.safeParse(resolvedSearchParams);

  if (!parsed.success) {
    return <ContentListView errorMessage="콘텐츠 목록 조회 조건을 확인해 주세요." />;
  }

  const result = await getContentsService({
    ...parsed.data,
    status: "PUBLISHED",
  });

  if (!result.ok) {
    return <ContentListView errorMessage={result.error.message} />;
  }

  return <ContentListView data={result.data} />;
}
