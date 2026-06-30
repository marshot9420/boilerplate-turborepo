import { notFound } from "next/navigation";

import { requireAdmin } from "@repo/auth/server";
import { ContentIdParam } from "@repo/domain/content/client";
import { getContentByIdService } from "@repo/domain/content/server";

import { ContentDetailView } from "@/views";

export const runtime = "nodejs";

interface ContentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  const { id } = await params;
  const session = await requireAdmin();

  const parsed = ContentIdParam.safeParse({ id });

  if (!parsed.success) {
    notFound();
  }

  const result = await getContentByIdService(parsed.data.id, {
    id: session.user.id,
    role: session.user.role,
    status: session.user.status,
  });

  if (!result.ok) {
    if (
      result.error.code === "CONTENT_NOT_FOUND" ||
      result.error.code === "CONTENT_FORBIDDEN" ||
      result.error.code === "CONTENT_DELETED"
    ) {
      notFound();
    }

    return <ContentDetailView errorMessage={result.error.message} />;
  }

  return <ContentDetailView content={result.data} />;
}
