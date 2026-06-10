import type { AppError } from "@repo/core/errors";
import { logger } from "@repo/core/logger";
import { failure, success, type Result } from "@repo/core/result";
import {
  findUserByIdRepository,
  findUserByNicknameRepository,
  softDeleteUserRepository,
  updateUserRepository,
} from "@repo/database/user";

import type { UserDetailResponse } from "./user.dto";
import { USER_ERROR_CODE } from "./user.error";
import { toUserDetailResponse } from "./user.mapper";
import type { UpdateUserProfileRequestInput } from "./user.schema";

export async function getUserByIdService(
  userId: string,
): Promise<Result<UserDetailResponse, AppError>> {
  try {
    const user = await findUserByIdRepository(userId);

    if (!user || user.status === "DELETED") {
      return failure({
        code: USER_ERROR_CODE.NOT_FOUND,
        message: "사용자를 찾을 수 없습니다.",
      });
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
      return failure({
        code: USER_ERROR_CODE.NOT_FOUND,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    if (user.status === "SUSPENDED") {
      return failure({
        code: USER_ERROR_CODE.SUSPENDED,
        message: "정지된 사용자는 프로필을 수정할 수 없습니다.",
      });
    }

    if (user.status === "BANNED") {
      return failure({
        code: USER_ERROR_CODE.BANNED,
        message: "차단된 사용자는 프로필을 수정할 수 없습니다.",
      });
    }

    if (input.nickname !== user.nickname) {
      const duplicatedUser = await findUserByNicknameRepository(input.nickname);

      if (duplicatedUser) {
        return failure({
          code: USER_ERROR_CODE.NICKNAME_DUPLICATED,
          message: "이미 사용 중인 닉네임입니다.",
          fieldErrors: {
            nickname: ["이미 사용 중인 닉네임입니다."],
          },
        });
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
    logger.error("user.update_profile.failed", {
      userId,
      error,
    });

    return failure(error as AppError);
  }
}

export async function softDeleteUserService(
  userId: string,
): Promise<Result<UserDetailResponse, AppError>> {
  try {
    const user = await findUserByIdRepository(userId);

    if (!user || user.status === "DELETED") {
      return failure({
        code: USER_ERROR_CODE.NOT_FOUND,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    const deletedUser = await softDeleteUserRepository(userId);

    logger.info("user.soft_delete.succeeded", {
      userId,
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
