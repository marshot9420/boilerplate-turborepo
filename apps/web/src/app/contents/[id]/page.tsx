import { notFound } from "next/navigation";

import { getCurrentSession } from "@repo/auth/server";
import { ContentIdParam } from "@repo/domain/content/client";
import {
  canDeleteContent,
  canUpdateContent,
  getContentByIdService,
} from "@repo/domain/content/server";

import { ContentDetailView } from "@/views/content-detail-view";

export const runtime = "nodejs";

interface ContentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function shouldRenderNotFound(code: string) {
  return code === "CONTENT_NOT_FOUND" || code === "CONTENT_DELETED" || code === "CONTENT_FORBIDDEN";
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  const { id } = await params;

  const parsed = ContentIdParam.safeParse({
    id,
  });

  if (!parsed.success) {
    notFound();
  }

  const session = await getCurrentSession();

  const actor = session
    ? {
        id: session.user.id,
        role: session.user.role,
        status: session.user.status,
      }
    : null;

  const result = await getContentByIdService(parsed.data.id, actor);

  if (!result.ok) {
    if (shouldRenderNotFound(result.error.code)) {
      notFound();
    }

    return <ContentDetailView errorMessage={result.error.message} />;
  }

  const canEdit = actor ? canUpdateContent(actor, result.data) : false;
  const canDelete = actor ? canDeleteContent(actor, result.data) : false;

  return <ContentDetailView content={result.data} canEdit={canEdit} canDelete={canDelete} />;
}
