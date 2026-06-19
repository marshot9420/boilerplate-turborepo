import { notFound } from "next/navigation";

import { getCurrentSession } from "@repo/auth/server";
import { Card, LinkButton } from "@repo/design-system/web";
import { canDeleteContent, canUpdateContent } from "@repo/domain/content/server";

import { deleteMyContentAction, getContentByIdAction } from "@/actions/content";
import { URLS } from "@/constants";
import { ContentDetail } from "@/entities/content";
import { DeleteContentForm } from "@/features/content";

interface ContentDetailViewProps {
  contentId: string;
}

function shouldRenderNotFound(code: string) {
  return (
    code === "VALIDATION_ERROR" ||
    code === "CONTENT_NOT_FOUND" ||
    code === "CONTENT_DELETED" ||
    code === "CONTENT_FORBIDDEN"
  );
}

function createContentEditHref(contentId: string) {
  return `${URLS.CLIENT.CONTENTS}/${contentId}/edit`;
}

export default async function ContentDetailView({ contentId }: ContentDetailViewProps) {
  const [result, session] = await Promise.all([
    getContentByIdAction(contentId),
    getCurrentSession(),
  ]);

  if (!result.ok) {
    if (shouldRenderNotFound(result.code)) {
      notFound();
    }

    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border/80 bg-surface text-surface-foreground space-y-4 border p-6">
          <div className="space-y-2">
            <h1 className="text-foreground text-xl font-bold">콘텐츠를 불러오지 못했습니다.</h1>

            <p className="text-muted-foreground text-sm">{result.message}</p>
          </div>

          <LinkButton href={URLS.CLIENT.CONTENTS} variant="outline" size="sm">
            목록으로 돌아가기
          </LinkButton>
        </Card>
      </main>
    );
  }

  const actor = session
    ? {
        id: session.user.id,
        role: session.user.role,
        status: session.user.status,
      }
    : null;

  const canEdit = actor ? canUpdateContent(actor, result.data) : false;
  const canDelete = actor ? canDeleteContent(actor, result.data) : false;

  return (
    <ContentDetail
      content={result.data}
      backHref={URLS.CLIENT.CONTENTS}
      editHref={canEdit ? createContentEditHref(result.data.id) : undefined}
      actions={
        canDelete ? (
          <DeleteContentForm
            contentId={result.data.id}
            action={deleteMyContentAction}
            successHref={URLS.CLIENT.CONTENTS}
          />
        ) : undefined
      }
    />
  );
}
