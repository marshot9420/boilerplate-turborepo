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

import type { ContentDetailResponse, ContentResponse } from "./content.dto";
import { CONTENT_ERROR_CODE } from "./content.error";
import { toContentDetailResponse, toContentResponse } from "./content.mapper";
import type {
  ContentListQuery,
  CreateContentRequestInput,
  UpdateContentRequestInput,
} from "./content.schema";

export async function createContentService(
  input: CreateContentRequestInput,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    const createdContent = await createContentRepository({
      title: input.title,
      content: input.content,
      author: {
        connect: {
          id: input.authorId,
        },
      },
    });

    logger.info("content.create.succeeded", {
      contentId: createdContent.id,
      authorId: input.authorId,
    });

    return success(toContentDetailResponse(createdContent));
  } catch (error) {
    logger.error("content.create.failed", {
      authorId: input.authorId,
      error,
    });

    return failure(error as AppError);
  }
}

export async function getContentByIdService(
  contentId: string,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    const content = await findContentByIdRepository(contentId);

    if (!content || content.status === "DELETED") {
      return failure({
        code: CONTENT_ERROR_CODE.NOT_FOUND,
        message: "콘텐츠를 찾을 수 없습니다.",
      });
    }

    return success(toContentDetailResponse(content));
  } catch (error) {
    logger.error("content.get_by_id.failed", {
      contentId,
      error,
    });

    return failure(error as AppError);
  }
}

export async function getContentsService(query: ContentListQuery = {}): Promise<
  Result<
    {
      items: ContentResponse[];
      meta: ReturnType<typeof createPaginationMeta>;
    },
    AppError
  >
> {
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
  input: UpdateContentRequestInput,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    const content = await findContentByIdRepository(contentId);

    if (!content || content.status === "DELETED") {
      return failure({
        code: CONTENT_ERROR_CODE.NOT_FOUND,
        message: "콘텐츠를 찾을 수 없습니다.",
      });
    }

    const updatedContent = await updateContentRepository(contentId, input);

    logger.info("content.update.succeeded", {
      contentId,
    });

    return success(toContentDetailResponse(updatedContent));
  } catch (error) {
    logger.error("content.update.failed", {
      contentId,
      error,
    });

    return failure(error as AppError);
  }
}

export async function softDeleteContentService(
  contentId: string,
): Promise<Result<ContentDetailResponse, AppError>> {
  try {
    const content = await findContentByIdRepository(contentId);

    if (!content || content.status === "DELETED") {
      return failure({
        code: CONTENT_ERROR_CODE.NOT_FOUND,
        message: "콘텐츠를 찾을 수 없습니다.",
      });
    }

    const deletedContent = await softDeleteContentRepository(contentId);

    logger.info("content.soft_delete.succeeded", {
      contentId,
    });

    return success(toContentDetailResponse(deletedContent));
  } catch (error) {
    logger.error("content.soft_delete.failed", {
      contentId,
      error,
    });

    return failure(error as AppError);
  }
}
