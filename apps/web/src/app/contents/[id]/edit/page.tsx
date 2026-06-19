import { notFound } from "next/navigation";

import type { Metadata } from "next";

import { requireUser } from "@repo/auth/server";
import { canUpdateContent } from "@repo/domain/content/server";

import { getContentByIdAction } from "@/actions/content";
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
  return (
    code === "VALIDATION_ERROR" ||
    code === "CONTENT_NOT_FOUND" ||
    code === "CONTENT_DELETED" ||
    code === "CONTENT_FORBIDDEN"
  );
}

export default async function UpdateContentPage({ params }: UpdateContentPageProps) {
  const session = await requireUser();

  const { id } = await params;
  const result = await getContentByIdAction(id);

  if (!result.ok) {
    if (shouldRenderNotFound(result.code)) {
      notFound();
    }

    return <UpdateContentView result={result} />;
  }

  const actor = {
    id: session.user.id,
    role: session.user.role,
    status: session.user.status,
  };

  if (!canUpdateContent(actor, result.data)) {
    notFound();
  }

  return <UpdateContentView result={result} />;
}
