import { LinkButton } from "@repo/design-system/web";
import type { ContentListResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";
import { ContentList, ContentPagination } from "@/entities/content";

interface ContentListViewProps {
  data?: ContentListResponse;
  errorMessage?: string;
}

export default function ContentListView({ data, errorMessage }: ContentListViewProps) {
  if (!data) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">콘텐츠</h1>

            <p className="text-muted-foreground text-sm">
              공개된 콘텐츠 목록을 확인할 수 있습니다.
            </p>
          </div>

          <LinkButton href={URLS.CLIENT.CREATE_CONTENT} size="sm" className="w-full sm:w-auto">
            콘텐츠 작성
          </LinkButton>
        </div>

        <div role="alert" className="border-border bg-muted/40 rounded-xl border px-5 py-4">
          <p className="text-sm font-medium">
            {errorMessage ?? "콘텐츠 목록을 불러오는 중 오류가 발생했습니다."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">콘텐츠</h1>

          <p className="text-muted-foreground text-sm">공개된 콘텐츠 목록을 확인할 수 있습니다.</p>
        </div>

        <div className="flex flex-col gap-3 sm:items-start sm:text-right">
          <LinkButton href={URLS.CLIENT.CREATE_CONTENT} size="sm" className="w-full sm:w-auto">
            콘텐츠 작성
          </LinkButton>

          <p className="text-muted-foreground text-sm">
            총 {data.meta.totalCount.toLocaleString("ko-KR")}개
          </p>
        </div>
      </div>

      <ContentList contents={data.items} />

      <ContentPagination meta={data.meta} />
    </section>
  );
}
