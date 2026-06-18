import { Badge, Card, LinkButton, Separator } from "@repo/design-system/web";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { formatContentDate, getContentStatusLabel } from "../../lib";

export interface ContentDetailProps {
  content: ContentDetailResponse;
}

export default function ContentDetail({ content }: ContentDetailProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <LinkButton href="/contents" variant="ghost" size="sm">
          목록으로 돌아가기
        </LinkButton>
      </div>

      <Card className="bg-surface text-surface-foreground border-border/80 border p-6 sm:p-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" size="sm">
              {getContentStatusLabel(content.status)}
            </Badge>

            <span className="text-muted-foreground text-sm">
              {formatContentDate(content.createdAt)}
            </span>
          </div>

          <h1 className="text-foreground text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
            {content.title}
          </h1>

          <dl className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center gap-1">
              <dt>작성자</dt>
              <dd>{content.authorId}</dd>
            </div>

            <div className="flex items-center gap-1">
              <dt>수정일</dt>
              <dd>{formatContentDate(content.updatedAt)}</dd>
            </div>
          </dl>
        </header>

        <Separator spacing="lg" />

        <div className="text-foreground text-base leading-8 wrap-break-word whitespace-pre-wrap">
          {content.content}
        </div>
      </Card>
    </article>
  );
}
