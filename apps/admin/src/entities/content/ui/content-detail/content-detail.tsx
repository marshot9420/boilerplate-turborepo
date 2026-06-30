import {
  Card,
  DataList,
  DataListItem,
  DataListLabel,
  DataListValue,
  LinkButton,
  Separator,
} from "@repo/design-system/admin";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import { formatContentDate } from "../../lib";
import { ContentStatusBadge } from "../content-status-badge";

export interface ContentDetailProps {
  content: ContentDetailResponse;
}

export default function ContentDetail({ content }: ContentDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">콘텐츠 상세</h1>
          <p className="text-muted-foreground text-sm">콘텐츠 상세 정보를 조회합니다.</p>
        </div>

        <LinkButton href={URLS.CLIENT.CONTENTS} variant="outline">
          목록으로 돌아가기
        </LinkButton>
      </div>

      <Card className="space-y-6 p-6">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 space-y-2">
              <h2 className="text-foreground text-xl font-semibold">{content.title}</h2>
              <p className="text-muted-foreground text-xs break-all">{content.id}</p>
            </div>

            <ContentStatusBadge status={content.status} />
          </div>
        </div>

        <Separator />

        <DataList>
          <DataListItem>
            <DataListLabel>작성자</DataListLabel>
            <DataListValue className="break-all">{content.authorId}</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>상태</DataListLabel>
            <DataListValue>
              <ContentStatusBadge status={content.status} />
            </DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>생성일</DataListLabel>
            <DataListValue>{formatContentDate(content.createdAt)}</DataListValue>
          </DataListItem>

          <DataListItem>
            <DataListLabel>수정일</DataListLabel>
            <DataListValue>{formatContentDate(content.updatedAt)}</DataListValue>
          </DataListItem>
        </DataList>

        <Separator />

        <section className="space-y-3">
          <h3 className="text-foreground text-base font-semibold">본문</h3>

          <div className="border-border bg-muted/30 text-foreground min-h-48 rounded-lg border p-4 text-sm leading-7 whitespace-pre-wrap">
            {content.content}
          </div>
        </section>
      </Card>
    </div>
  );
}
