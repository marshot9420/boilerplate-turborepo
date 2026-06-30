import Link from "next/link";

import { Badge, Card } from "@repo/design-system/web";
import type { ContentResponse } from "@repo/domain/content/client";

import { URLS } from "@/constants";

import { formatContentDate, getContentStatusLabel } from "../../lib";

interface ContentCardProps {
  content: ContentResponse;
}

export default function ContentCard({ content }: ContentCardProps) {
  return (
    <Link
      href={URLS.CLIENT.CONTENTS_DETAIL(content.id)}
      className="block h-full rounded-xl focus-visible:outline-none"
      aria-label={`${content.title} 상세 보기`}
    >
      <Card variant="default" interactive className="h-full p-5">
        <article className="flex h-full flex-col gap-4">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <time
                dateTime={content.createdAt}
                className="text-muted-foreground text-xs font-medium"
              >
                {formatContentDate(content.createdAt)}
              </time>

              <Badge variant="outline" size="sm">
                {getContentStatusLabel(content.status)}
              </Badge>
            </div>

            <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">{content.title}</h2>
          </div>

          <p className="text-muted-foreground truncate text-xs">작성자 {content.authorId}</p>
        </article>
      </Card>
    </Link>
  );
}
