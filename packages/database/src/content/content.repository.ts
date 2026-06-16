import type { Content, ContentStatus, Prisma } from "@prisma/client";

import { prisma } from "../client";
import { mapPrismaError } from "../errors";

export async function createContentRepository(data: Prisma.ContentCreateInput): Promise<Content> {
  try {
    return await prisma.content.create({ data });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findContentByIdRepository(contentId: string): Promise<Content | null> {
  try {
    return await prisma.content.findUnique({
      where: {
        id: contentId,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findContentsRepository(params?: {
  status?: ContentStatus;
  authorId?: string;
  skip?: number;
  take?: number;
}): Promise<Content[]> {
  try {
    return await prisma.content.findMany({
      where: {
        status: params?.status,
        authorId: params?.authorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: params?.skip,
      take: params?.take,
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function countContentsRepository(params?: {
  status?: ContentStatus;
  authorId?: string;
}): Promise<number> {
  try {
    return await prisma.content.count({
      where: {
        status: params?.status,
        authorId: params?.authorId,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function updateContentRepository(
  contentId: string,
  data: Prisma.ContentUpdateInput,
): Promise<Content> {
  try {
    return await prisma.content.update({
      where: {
        id: contentId,
      },
      data,
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function softDeleteContentRepository(contentId: string): Promise<Content> {
  try {
    return await prisma.content.update({
      where: {
        id: contentId,
      },
      data: {
        status: "DELETED",
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}
