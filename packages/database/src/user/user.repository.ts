import type { Prisma, User, UserRole, UserStatus } from "@prisma/client";

import { prisma } from "../client";
import { mapPrismaError } from "../errors";

type UserListSortKey = "EMAIL" | "NICKNAME" | "ROLE" | "STATUS" | "CREATED_AT" | "LAST_LOGIN_AT";

interface FindUsersAndCountRepositoryParams {
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
  sortKey?: UserListSortKey;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
}

export async function createUserRepository(data: Prisma.UserCreateInput): Promise<User> {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUsersAndCountRepository(
  params: FindUsersAndCountRepositoryParams,
): Promise<{
  users: User[];
  totalElements: number;
}> {
  try {
    const where = createUserListWhere(params);
    const orderBy = createUserListOrderBy(params);

    const [users, totalElements] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.take,
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      totalElements,
    };
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserByIdRepository(userId: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserByEmailRepository(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function findUserByNicknameRepository(nickname: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: {
        nickname,
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function updateUserRepository(
  userId: string,
  data: Prisma.UserUpdateInput,
): Promise<User> {
  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

export async function softDeleteUserRepository(userId: string): Promise<User> {
  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: "DELETED",
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

function createUserListWhere(params: FindUsersAndCountRepositoryParams): Prisma.UserWhereInput {
  const keyword = params.keyword?.trim();

  return {
    ...(params.role ? { role: params.role } : {}),
    ...(params.status ? { status: params.status } : {}),

    ...(keyword
      ? {
          OR: [
            {
              email: {
                contains: keyword,
                mode: "insensitive",
              },
            },
            {
              nickname: {
                contains: keyword,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };
}

function createUserListOrderBy(
  params: FindUsersAndCountRepositoryParams,
): Prisma.UserOrderByWithRelationInput[] {
  const sortDirection = params.sortDirection ?? "desc";

  switch (params.sortKey) {
    case "EMAIL":
      return [{ email: sortDirection }, { id: "desc" }];

    case "NICKNAME":
      return [{ nickname: sortDirection }, { id: "desc" }];

    case "ROLE":
      return [{ role: sortDirection }, { id: "desc" }];

    case "STATUS":
      return [{ status: sortDirection }, { id: "desc" }];

    case "LAST_LOGIN_AT":
      return [{ lastLoginAt: sortDirection }, { id: "desc" }];

    case "CREATED_AT":
    default:
      return [{ createdAt: sortDirection }, { id: "desc" }];
  }
}
