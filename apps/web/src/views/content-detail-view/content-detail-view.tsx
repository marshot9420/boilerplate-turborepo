import { Card, LinkButton } from "@repo/design-system/web";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { deleteMyContentAction } from "@/actions/content";
import { URLS } from "@/constants";
import { ContentDetail } from "@/entities/content";
import { DeleteContentForm } from "@/features/content";

export interface ContentDetailViewProps {
  content?: ContentDetailResponse;
  errorMessage?: string;
  canEdit?: boolean;
  canDelete?: boolean;
}

function createContentEditHref(contentId: string) {
  return `${URLS.CLIENT.CONTENTS}/${contentId}/edit`;
}

export default function ContentDetailView({
  content,
  errorMessage,
  canEdit = false,
  canDelete = false,
}: ContentDetailViewProps) {
  if (!content) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border/80 bg-surface text-surface-foreground space-y-4 border p-6">
          <div className="space-y-2">
            <h1 className="text-foreground text-xl font-bold">콘텐츠를 불러오지 못했습니다.</h1>

            <p className="text-muted-foreground text-sm">
              {errorMessage ?? "콘텐츠를 불러오는 중 오류가 발생했습니다."}
            </p>
          </div>

          <LinkButton href={URLS.CLIENT.CONTENTS} variant="outline" size="sm">
            목록으로 돌아가기
          </LinkButton>
        </Card>
      </main>
    );
  }

  return (
    <ContentDetail
      content={content}
      backHref={URLS.CLIENT.CONTENTS}
      editHref={canEdit ? createContentEditHref(content.id) : undefined}
      actions={
        canDelete ? (
          <DeleteContentForm
            contentId={content.id}
            action={deleteMyContentAction}
            successHref={URLS.CLIENT.CONTENTS}
          />
        ) : undefined
      }
    />
  );
}
