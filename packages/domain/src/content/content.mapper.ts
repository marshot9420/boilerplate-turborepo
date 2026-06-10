import type { Content } from "@prisma/client";

import type { ContentDetailResponse, ContentResponse } from "./content.dto";

export function toContentDetailResponse(
  content: Content,
): ContentDetailResponse {
  return {
    id: content.id,
    title: content.title,
    content: content.content,
    status: content.status,
    authorId: content.authorId,
    createdAt: content.createdAt.toISOString(),
    updatedAt: content.updatedAt.toISOString(),
  };
}

export function toContentResponse(content: Content): ContentResponse {
  return {
    id: content.id,
    title: content.title,
    status: content.status,
    authorId: content.authorId,
    createdAt: content.createdAt.toISOString(),
    updatedAt: content.updatedAt.toISOString(),
  };
}
