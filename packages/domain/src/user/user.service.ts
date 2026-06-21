import { createHash } from "node:crypto";

import type { AppError } from "@repo/core/errors";
import { logger } from "@repo/core/logger";
import { createPagination, createPaginationMeta } from "@repo/core/pagination";
import { failure, success, type Result } from "@repo/core/result";
import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
  findUserByNicknameRepository,
  findUsersAndCountRepository,
  softDeleteUserRepository,
  updateUserRepository,
} from "@repo/database/user";
import {
  createUserOAuthAccountRepository,
  findUserOAuthAccountWithUserRepository,
} from "@repo/database/user-oauth-account";
import { revokeUserSessionsByUserIdRepository } from "@repo/database/user-session";

import type { UserDetailResponse, UserListResponse, UserResponse } from "./user.dto";
import {
  createOAuthLoginFailedError,
  createOAuthUserBlockedError,
  createUserBannedError,
  createUserForbiddenError,
  createUserNicknameDuplicatedError,
  createUserNotFoundError,
  createUserSuspendedError,
} from "./user.error";
import { toUserDetailResponse, toUserListItemResponse, toUserResponse } from "./user.mapper";
import { canAuthenticateUser, canManageUsers, type UserPermissionActor } from "./user.permission";
import type {
  FindOrCreateOAuthUserRequestInput,
  UpdateUserProfileRequestInput,
  UserListQueryInput,
} from "./user.schema";

export async function findOrCreateOAuthUserService(
  input: FindOrCreateOAuthUserRequestInput,
): Promise<Result<UserResponse, AppError>> {
  try {
    const oauthAccount = await findUserOAuthAccountWithUserRepository({
      provider: input.provider,
      providerUserId: input.providerUserId,
    });

    if (oauthAccount) {
      if (!canAuthenticateUser(oauthAccount.user)) {
        return failure(createOAuthUserBlockedError());
      }

      const updatedUser = await updateUserRepository(oauthAccount.user.id, {
        name: input.name,
        avatarUrl: input.avatarUrl,
      });

      logger.info("user.oauth_login.succeeded", {
        userId: updatedUser.id,
        provider: input.provider,
      });

      return success(toUserResponse(updatedUser));
    }

    const existingUser = await findUserByEmailRepository(input.email);

    if (existingUser) {
      if (!canAuthenticateUser(existingUser)) {
        return failure(createOAuthUserBlockedError());
      }

      const updatedUser = await updateUserRepository(existingUser.id, {
        name: input.name,
        avatarUrl: input.avatarUrl,
      });

      await createUserOAuthAccountRepository({
        email: input.email,
        provider: input.provider,
        providerUserId: input.providerUserId,
        user: {
          connect: {
            id: updatedUser.id,
          },
        },
      });

      logger.info("user.oauth_account_linked.succeeded", {
        userId: updatedUser.id,
        provider: input.provider,
      });

      return success(toUserResponse(updatedUser));
    }

    const nicknameHash = createHash("sha256")
      .update(`${input.provider}:${input.providerUserId}`)
      .digest("hex")
      .slice(0, 16);

    const createdUser = await createUserRepository({
      email: input.email,
      name: input.name,
      avatarUrl: input.avatarUrl,
      nickname: `${input.provider.toLowerCase()}_${nicknameHash}`,
      oauthAccounts: {
        create: {
          email: input.email,
          provider: input.provider,
          providerUserId: input.providerUserId,
        },
      },
    });

    logger.info("user.oauth_user_created.succeeded", {
      userId: createdUser.id,
      provider: input.provider,
    });

    return success(toUserResponse(createdUser));
  } catch (error) {
    logger.error("user.oauth_login.failed", {
      provider: input.provider,
      providerUserId: input.providerUserId,
      error,
    });

    return failure(createOAuthLoginFailedError(error));
  }
}

export async function getUsersService(
  actor: UserPermissionActor,
  query: UserListQueryInput,
): Promise<Result<UserListResponse, AppError>> {
  try {
    if (!canManageUsers(actor)) {
      return failure(createUserForbiddenError("사용자 목록을 조회할 권한이 없습니다."));
    }

    const pagination = createPagination({
      page: query.page,
      limit: query.limit,
    });

    const result = await findUsersAndCountRepository({
      keyword: query.keyword,
      role: query.role,
      status: query.status,
      sortKey: query.sortKey,
      sortDirection: query.sortDirection,
      skip: pagination.skip,
      take: pagination.take,
    });

    return success({
      items: result.users.map(toUserListItemResponse),
      meta: createPaginationMeta({
        page: pagination.page,
        limit: pagination.limit,
        totalCount: result.totalElements,
      }),
    });
  } catch (error) {
    logger.error("user.get_list.failed", {
      actorId: actor.id,
      query,
      error,
    });

    return failure(error as AppError);
  }
}

export async function getUserByIdService(
  userId: string,
): Promise<Result<UserDetailResponse, AppError>> {
  try {
    const user = await findUserByIdRepository(userId);

    if (!user || user.status === "DELETED") {
      return failure(createUserNotFoundError());
    }

    return success(toUserDetailResponse(user));
  } catch (error) {
    logger.error("user.get_by_id.failed", {
      userId,
      error,
    });

    return failure(error as AppError);
  }
}

export async function updateUserProfileService(
  userId: string,
  input: UpdateUserProfileRequestInput,
): Promise<Result<UserDetailResponse, AppError>> {
  try {
    const user = await findUserByIdRepository(userId);

    if (!user || user.status === "DELETED") {
      return failure(createUserNotFoundError());
    }

    if (user.status === "SUSPENDED") {
      return failure(createUserSuspendedError("정지된 사용자는 프로필을 수정할 수 없습니다."));
    }

    if (user.status === "BANNED") {
      return failure(createUserBannedError("차단된 사용자는 프로필을 수정할 수 없습니다."));
    }

    if (input.nickname !== user.nickname) {
      const duplicatedUser = await findUserByNicknameRepository(input.nickname);

      if (duplicatedUser) {
        return failure(createUserNicknameDuplicatedError());
      }
    }

    const updatedUser = await updateUserRepository(userId, {
      name: input.name,
      avatarUrl: input.avatarUrl,
      nickname: input.nickname,
    });

    logger.info("user.update_profile.succeeded", {
      userId,
    });

    return success(toUserDetailResponse(updatedUser));
  } catch (error) {
    const appError = error as AppError;

    logger.error("user.update_profile.failed", {
      userId,
      error: appError,
    });

    if (appError.code === "DATABASE_UNIQUE_CONSTRAINT") {
      return failure(createUserNicknameDuplicatedError());
    }

    return failure(appError);
  }
}

export async function softDeleteUserService(
  userId: string,
): Promise<Result<UserDetailResponse, AppError>> {
  try {
    const user = await findUserByIdRepository(userId);

    if (!user || user.status === "DELETED") {
      return failure(createUserNotFoundError());
    }

    if (user.status === "SUSPENDED") {
      return failure(createUserSuspendedError("정지된 사용자는 회원 탈퇴를 할 수 없습니다."));
    }

    if (user.status === "BANNED") {
      return failure(createUserBannedError("차단된 사용자는 회원 탈퇴를 할 수 없습니다."));
    }

    const deletedUser = await softDeleteUserRepository(userId);
    const revokedSessionCount = await revokeUserSessionsByUserIdRepository(userId);

    logger.info("user.soft_delete.succeeded", {
      userId,
      revokedSessionCount,
    });

    return success(toUserDetailResponse(deletedUser));
  } catch (error) {
    logger.error("user.soft_delete.failed", {
      userId,
      error,
    });

    return failure(error as AppError);
  }
}
