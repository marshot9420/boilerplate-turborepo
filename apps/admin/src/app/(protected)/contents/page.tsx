import { requireAdmin } from "@repo/auth/server";
import { ContentListQuery } from "@repo/domain/content/client";
import { getContentsService } from "@repo/domain/content/server";

import { ContentListView } from "@/views";

export const runtime = "nodejs";

interface ContentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContentsPage({ searchParams }: ContentsPageProps) {
  const resolvedSearchParams = await searchParams;

  await requireAdmin();

  const parsed = ContentListQuery.safeParse(resolvedSearchParams);

  if (!parsed.success) {
    return (
      <ContentListView
        errorMessage="콘텐츠 목록 조회 조건을 확인해 주세요."
        searchParams={resolvedSearchParams}
      />
    );
  }

  const result = await getContentsService(parsed.data);

  if (!result.ok) {
    return (
      <ContentListView errorMessage={result.error.message} searchParams={resolvedSearchParams} />
    );
  }

  return <ContentListView data={result.data} searchParams={resolvedSearchParams} />;
}
