import { Prisma } from "@prisma/client";

import type { AppError } from "@repo/core/errors";

export function mapPrismaError(error: unknown): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          code: "DATABASE_UNIQUE_CONSTRAINT",
          message: "이미 존재하는 데이터입니다.",
          cause: error,
        };

      case "P2003":
        return {
          code: "DATABASE_FOREIGN_KEY_CONSTRAINT",
          message: "연결된 데이터가 올바르지 않습니다.",
          cause: error,
        };

      case "P2025":
        return {
          code: "DATABASE_RECORD_NOT_FOUND",
          message: "대상을 찾을 수 없습니다.",
          cause: error,
        };

      default:
        return {
          code: "DATABASE_KNOWN_ERROR",
          message: "데이터 처리 중 오류가 발생했습니다.",
          cause: error,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      code: "DATABASE_VALIDATION_ERROR",
      message: "데이터 형식이 올바르지 않습니다.",
      cause: error,
    };
  }

  return {
    code: "DATABASE_UNKNOWN_ERROR",
    message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
    cause: error,
  };
}
