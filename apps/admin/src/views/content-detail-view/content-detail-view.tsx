import { Card, LinkButton } from "@repo/design-system/admin";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";
import { ContentDetail } from "@/entities/content";

export interface ContentDetailViewProps {
  content?: ContentDetailResponse;
  errorMessage?: string;
}

export default function ContentDetailView({ content, errorMessage }: ContentDetailViewProps) {
  if (!content) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">콘텐츠 상세</h1>
          <p className="text-muted-foreground text-sm">콘텐츠 상세 정보를 조회합니다.</p>
        </div>

        <Card className="space-y-4 p-6">
          <div className="space-y-1">
            <h2 className="text-foreground text-base font-semibold">
              콘텐츠를 불러오지 못했습니다.
            </h2>

            <p className="text-muted-foreground text-sm">
              {errorMessage ?? "콘텐츠를 불러오는 중 오류가 발생했습니다."}
            </p>
          </div>

          <LinkButton href={URLS.CLIENT.CONTENTS} variant="outline">
            목록으로 돌아가기
          </LinkButton>
        </Card>
      </div>
    );
  }

  return <ContentDetail content={content} />;
}
