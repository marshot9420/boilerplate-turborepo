import { Card, LinkButton } from "@repo/design-system/web";

import { createContentAction } from "@/actions/content";
import { URLS } from "@/constants";
import { CreateContentForm } from "@/features/content";

export default function CreateContentView() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">Content</p>

          <div className="space-y-3">
            <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
              콘텐츠 작성
            </h1>

            <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
              제목과 본문을 입력해 새로운 콘텐츠를 생성합니다.
            </p>
          </div>
        </div>

        <LinkButton
          href={URLS.CLIENT.CONTENTS}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          목록으로
        </LinkButton>
      </header>

      <Card className="p-5 sm:p-6">
        <CreateContentForm
          action={createContentAction}
          createdContentHrefPrefix={URLS.CLIENT.CONTENTS}
        />
      </Card>
    </main>
  );
}
