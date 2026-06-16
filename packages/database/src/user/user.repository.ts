import type { Prisma, User } from "@prisma/client";

import { prisma } from "../client";
import { mapPrismaError } from "../errors";

export async function createUserRepository(data: Prisma.UserCreateInput): Promise<User> {
  try {
    return await prisma.user.create({ data });
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
