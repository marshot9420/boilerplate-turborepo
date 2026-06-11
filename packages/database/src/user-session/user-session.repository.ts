import type { Prisma, User, UserSession } from "@prisma/client";

import { prisma } from "../client";
import { mapPrismaError } from "../errors";

export async function createUserSessionRepository(
  data: Prisma.UserSessionCreateInput,
): Promise<UserSession> {
  try {
    return await prisma.userSession.create({ data });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserSessionByIdRepository(
  sessionId: string,
): Promise<UserSession | null> {
  try {
    return await prisma.userSession.findUnique({
      where: {
        id: sessionId,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserSessionByTokenHashRepository(
  tokenHash: string,
): Promise<UserSession | null> {
  try {
    return await prisma.userSession.findUnique({
      where: {
        tokenHash,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserSessionWithUserByTokenHashRepository(
  tokenHash: string,
): Promise<(UserSession & { user: User }) | null> {
  try {
    return await prisma.userSession.findUnique({
      where: {
        tokenHash,
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function updateUserSessionRepository(
  sessionId: string,
  data: Prisma.UserSessionUpdateInput,
): Promise<UserSession> {
  try {
    return await prisma.userSession.update({
      where: {
        id: sessionId,
      },
      data,
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function revokeUserSessionByTokenHashRepository(
  tokenHash: string,
): Promise<number> {
  try {
    const result = await prisma.userSession.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return result.count;
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function revokeUserSessionsByUserIdRepository(
  userId: string,
): Promise<number> {
  try {
    const result = await prisma.userSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return result.count;
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function deleteExpiredUserSessionsRepository(
  now = new Date(),
): Promise<number> {
  try {
    const result = await prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    return result.count;
  } catch (error) {
    throw mapPrismaError(error);
  }
}
