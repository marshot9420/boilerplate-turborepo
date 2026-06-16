import type { AuthProvider, Prisma, User, UserOAuthAccount } from "@prisma/client";

import { prisma } from "../client";
import { mapPrismaError } from "../errors";

export async function createUserOAuthAccountRepository(
  data: Prisma.UserOAuthAccountCreateInput,
): Promise<UserOAuthAccount> {
  try {
    return await prisma.userOAuthAccount.create({ data });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserOAuthAccountRepository(params: {
  provider: AuthProvider;
  providerUserId: string;
}): Promise<UserOAuthAccount | null> {
  try {
    return await prisma.userOAuthAccount.findUnique({
      where: {
        provider_providerUserId: params,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserOAuthAccountWithUserRepository(params: {
  provider: AuthProvider;
  providerUserId: string;
}): Promise<(UserOAuthAccount & { user: User }) | null> {
  try {
    return await prisma.userOAuthAccount.findUnique({
      where: {
        provider_providerUserId: params,
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserOAuthAccountsByUserIdRepository(
  userId: string,
): Promise<UserOAuthAccount[]> {
  try {
    return await prisma.userOAuthAccount.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}
