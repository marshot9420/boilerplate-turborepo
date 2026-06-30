import { Alert, AlertDescription, AlertTitle, Card, LinkButton } from "@repo/design-system/web";
import type { ContentDetailResponse } from "@repo/domain/content/client";

import { updateMyContentAction } from "@/actions/content";
import { URLS } from "@/constants";
import { UpdateContentForm } from "@/features/content";

export interface UpdateContentViewProps {
  content?: ContentDetailResponse;
  errorMessage?: string;
}

function createContentDetailHref(contentId: string) {
  return `${URLS.CLIENT.CONTENTS}/${contentId}`;
}

export default function UpdateContentView({ content, errorMessage }: UpdateContentViewProps) {
  if (!content) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <Alert tone="danger">
          <AlertTitle>콘텐츠를 불러올 수 없습니다.</AlertTitle>
          <AlertDescription>
            {errorMessage ?? "콘텐츠를 불러오는 중 오류가 발생했습니다."}
          </AlertDescription>
        </Alert>

        <div>
          <LinkButton href={URLS.CLIENT.CONTENTS} variant="outline" size="sm">
            목록으로
          </LinkButton>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">Content</p>

          <div className="space-y-3">
            <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
              콘텐츠 수정
            </h1>

            <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
              작성한 콘텐츠의 제목과 본문을 수정합니다.
            </p>
          </div>
        </div>

        <LinkButton
          href={createContentDetailHref(content.id)}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          상세로
        </LinkButton>
      </header>

      <Card className="p-5 sm:p-6">
        <UpdateContentForm
          content={content}
          action={updateMyContentAction}
          successHref={createContentDetailHref(content.id)}
        />
      </Card>
    </main>
  );
}
