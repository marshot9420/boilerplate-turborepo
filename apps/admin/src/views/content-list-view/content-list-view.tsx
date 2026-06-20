import { Card, LinkButton, Separator } from "@repo/design-system/admin";
import type { ContentListResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";
import { ContentEmpty, ContentPagination, ContentTable } from "@/entities/content";
import { ContentFilterForm } from "@/features/content";

type ContentListSearchParams = Record<string, string | string[] | undefined>;

export interface ContentListViewProps {
  data?: ContentListResponse;
  errorMessage?: string;
  searchParams?: ContentListSearchParams;
}

function hasActiveFilter(searchParams: ContentListSearchParams = {}) {
  return Boolean(searchParams.status || searchParams.authorId);
}

export default function ContentListView({
  data,
  errorMessage,
  searchParams,
}: ContentListViewProps) {
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">콘텐츠 관리</h1>
          <p className="text-muted-foreground text-sm">콘텐츠 목록을 조회하고 관리합니다.</p>
        </div>

        <Card className="space-y-4 p-6">
          <div className="space-y-1">
            <h2 className="text-foreground text-base font-semibold">
              콘텐츠 목록을 불러오지 못했습니다.
            </h2>
            <p className="text-muted-foreground text-sm">
              {errorMessage ?? "콘텐츠 목록을 불러오는 중 오류가 발생했습니다."}
            </p>
          </div>

          <LinkButton href={URLS.CLIENT.CONTENTS} variant="outline">
            다시 조회
          </LinkButton>
        </Card>
      </div>
    );
  }

  const { items, meta } = data;
  const filtered = hasActiveFilter(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">콘텐츠 관리</h1>
          <p className="text-muted-foreground text-sm">콘텐츠 목록을 조회하고 관리합니다.</p>
        </div>

        <div className="text-muted-foreground text-sm">총 {meta.totalCount.toLocaleString()}개</div>
      </div>

      <Card className="p-4">
        <ContentFilterForm defaultValues={searchParams} />
      </Card>

      <Separator />

      {items.length > 0 ? <ContentTable contents={items} /> : <ContentEmpty filtered={filtered} />}

      <ContentPagination meta={meta} searchParams={searchParams} />
    </div>
  );
}
