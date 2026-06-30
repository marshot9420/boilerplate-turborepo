import { notFound } from "next/navigation";

import type { Metadata } from "next";

import { requireUser } from "@repo/auth/server";
import { ContentIdParam } from "@repo/domain/content/client";
import { canUpdateContent, getContentByIdService } from "@repo/domain/content/server";

import { UpdateContentView } from "@/views/update-content-view";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "콘텐츠 수정",
  description: "작성한 콘텐츠를 수정합니다.",
};

interface UpdateContentPageProps {
  params: Promise<{
    id: string;
  }>;
}

function shouldRenderNotFound(code: string) {
  return code === "CONTENT_NOT_FOUND" || code === "CONTENT_DELETED" || code === "CONTENT_FORBIDDEN";
}

export default async function UpdateContentPage({ params }: UpdateContentPageProps) {
  const session = await requireUser();

  const { id } = await params;

  const parsed = ContentIdParam.safeParse({
    id,
  });

  if (!parsed.success) {
    notFound();
  }

  const actor = {
    id: session.user.id,
    role: session.user.role,
    status: session.user.status,
  };

  const result = await getContentByIdService(parsed.data.id, actor);

  if (!result.ok) {
    if (shouldRenderNotFound(result.error.code)) {
      notFound();
    }

    return <UpdateContentView errorMessage={result.error.message} />;
  }

  if (!canUpdateContent(actor, result.data)) {
    notFound();
  }

  return <UpdateContentView content={result.data} />;
}
