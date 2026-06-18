import { notFound } from "next/navigation";

import { Card, LinkButton } from "@repo/design-system/web";

import { getContentByIdAction } from "@/actions/content";
import { ContentDetail } from "@/entities/content";

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

export default async function ContentDetailView({ contentId }: ContentDetailViewProps) {
  const result = await getContentByIdAction(contentId);

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

          <LinkButton href="/contents" variant="outline" size="sm">
            목록으로 돌아가기
          </LinkButton>
        </Card>
      </main>
    );
  }

  return <ContentDetail content={result.data} />;
}
