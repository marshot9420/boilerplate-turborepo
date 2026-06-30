import type { AppError } from "@repo/core/errors";
import { logger } from "@repo/core/logger";
import { createPagination, createPaginationMeta } from "@repo/core/pagination";
import { failure, success, type Result } from "@repo/core/result";
import {
  countContentsRepository,
  createContentRepository,
  findContentByIdRepository,
  findContentsRepository,
  softDeleteContentRepository,
  updateContentRepository,
} from "@repo/database/content";

import type { ContentDetailResponse, ContentListResponse } from "./content.dto";
import { CONTENT_ERROR_CODE } from "./content.error";
import { toContentDetailResponse, toContentResponse } from "./content.mapper";
import {
  canCreateContent,
  canDeleteContent,
  canReadContent,
  canUpdateContent,
  canUpdateContentStatus,
  type ContentPermissionActor,
} from "./content.permission";
import type {
  ContentListQueryInput,
  CreateContentRequestInput,
  UpdateContentRequestInput,
  UpdateContentStatusRequestInput,
} from "./content.schema";

export async function createContentService(
  actor: ContentPermissionActor,
  input: CreateContentRequestInput,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    if (!canCreateContent(actor)) {
      return failure({
        code: CONTENT_ERROR_CODE.FORBIDDEN,
        message: "콘텐츠를 생성할 권한이 없습니다.",
      });
    }

    const createdContent = await createContentRepository({
      title: input.title,
      content: input.content,
      author: {
        connect: {
          id: actor.id,
        },
      },
    });

    logger.info("content.create.succeeded", {
      contentId: createdContent.id,
      authorId: actor.id,
    });

    return success(toContentDetailResponse(createdContent));
  } catch (error) {
    logger.error("content.create.failed", {
      authorId: actor.id,
      error,
    });

    return failure(error as AppError);
  }
}

export async function getContentByIdService(
  contentId: string,
  actor: ContentPermissionActor | null = null,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    const content = await findContentByIdRepository(contentId);

    if (!content) {
      return failure({
        code: CONTENT_ERROR_CODE.NOT_FOUND,
        message: "콘텐츠를 찾을 수 없습니다.",
      });
    }

    if (!canReadContent(actor, content)) {
      if (content.status === "DELETED") {
        return failure({
          code: CONTENT_ERROR_CODE.DELETED,
          message: "삭제된 콘텐츠입니다.",
        });
      }

      return failure({
        code: CONTENT_ERROR_CODE.FORBIDDEN,
        message: "콘텐츠를 조회할 권한이 없습니다.",
      });
    }

    return success(toContentDetailResponse(content));
  } catch (error) {
    logger.error("content.get_by_id.failed", {
      contentId,
      actorId: actor?.id,
      actorRole: actor?.role,
      error,
    });

    return failure(error as AppError);
  }
}

export async function getContentsService(
  query: ContentListQueryInput = {},
): Promise<Result<ContentListResponse, AppError>> {
  try {
    const pagination = createPagination({
      page: query.page,
      limit: query.limit,
    });

    const [contents, totalCount] = await Promise.all([
      findContentsRepository({
        status: query.status,
        authorId: query.authorId,
        skip: pagination.skip,
        take: pagination.take,
      }),
      countContentsRepository({
        status: query.status,
        authorId: query.authorId,
      }),
    ]);

    return success({
      items: contents.map(toContentResponse),
      meta: createPaginationMeta({
        page: pagination.page,
        limit: pagination.limit,
        totalCount,
      }),
    });
  } catch (error) {
    logger.error("content.get_list.failed", {
      query,
      error,
    });

    return failure(error as AppError);
  }
}

export async function updateContentService(
  contentId: string,
  actor: ContentPermissionActor,
  input: UpdateContentRequestInput,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    const content = await findContentByIdRepository(contentId);

    if (!content) {
      return failure({
        code: CONTENT_ERROR_CODE.NOT_FOUND,
        message: "콘텐츠를 찾을 수 없습니다.",
      });
    }

    if (content.status === "DELETED") {
      return failure({
        code: CONTENT_ERROR_CODE.DELETED,
        message: "삭제된 콘텐츠입니다.",
      });
    }

    if (!canUpdateContent(actor, content)) {
      return failure({
        code: CONTENT_ERROR_CODE.FORBIDDEN,
        message: "콘텐츠를 수정할 권한이 없습니다.",
      });
    }

    const updatedContent = await updateContentRepository(contentId, {
      title: input.title,
      content: input.content,
    });

    logger.info("content.update.succeeded", {
      contentId,
      actorId: actor.id,
      actorRole: actor.role,
    });

    return success(toContentDetailResponse(updatedContent));
  } catch (error) {
    logger.error("content.update.failed", {
      contentId,
      actorId: actor.id,
      actorRole: actor.role,
      error,
    });

    return failure(error as AppError);
  }
}

export async function updateContentStatusService(
  contentId: string,
  actor: ContentPermissionActor,
  input: UpdateContentStatusRequestInput,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    const content = await findContentByIdRepository(contentId);

    if (!content) {
      return failure({
        code: CONTENT_ERROR_CODE.NOT_FOUND,
        message: "콘텐츠를 찾을 수 없습니다.",
      });
    }

    if (content.status === "DELETED") {
      return failure({
        code: CONTENT_ERROR_CODE.DELETED,
        message: "삭제된 콘텐츠입니다.",
      });
    }

    if (!canUpdateContentStatus(actor)) {
      return failure({
        code: CONTENT_ERROR_CODE.FORBIDDEN,
        message: "콘텐츠 상태를 변경할 권한이 없습니다.",
      });
    }

    const updatedContent = await updateContentRepository(contentId, {
      status: input.status,
    });

    logger.info("content.update_status.succeeded", {
      contentId,
      status: input.status,
      actorId: actor.id,
      actorRole: actor.role,
    });

    return success(toContentDetailResponse(updatedContent));
  } catch (error) {
    logger.error("content.update_status.failed", {
      contentId,
      actorId: actor.id,
      actorRole: actor.role,
      error,
    });

    return failure(error as AppError);
  }
}

export async function softDeleteContentService(
  contentId: string,
  actor: ContentPermissionActor,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    const content = await findContentByIdRepository(contentId);

    if (!content) {
      return failure({
        code: CONTENT_ERROR_CODE.NOT_FOUND,
        message: "콘텐츠를 찾을 수 없습니다.",
      });
    }

    if (content.status === "DELETED") {
      return failure({
        code: CONTENT_ERROR_CODE.DELETED,
        message: "이미 삭제된 콘텐츠입니다.",
      });
    }

    if (!canDeleteContent(actor, content)) {
      return failure({
        code: CONTENT_ERROR_CODE.FORBIDDEN,
        message: "콘텐츠를 삭제할 권한이 없습니다.",
      });
    }

    const deletedContent = await softDeleteContentRepository(contentId);

    logger.info("content.soft_delete.succeeded", {
      contentId,
      actorId: actor.id,
      actorRole: actor.role,
    });

    return success(toContentDetailResponse(deletedContent));
  } catch (error) {
    logger.error("content.soft_delete.failed", {
      contentId,
      actorId: actor.id,
      actorRole: actor.role,
      error,
    });

    return failure(error as AppError);
  }
}
