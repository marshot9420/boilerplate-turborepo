import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { mapPrismaError } from "./prisma-error.mapper";

function createKnownPrismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError(
    "Prisma known request error",
    {
      code,
      clientVersion: "test",
    },
  );
}

function createValidationPrismaError() {
  return new Prisma.PrismaClientValidationError("Prisma validation error", {
    clientVersion: "test",
  });
}

describe("mapPrismaError", () => {
  it("P2002 에러를 DATABASE_UNIQUE_CONSTRAINT로 변환한다", () => {
    const error = createKnownPrismaError("P2002");

    const result = mapPrismaError(error);

    expect(result).toMatchObject({
      code: "DATABASE_UNIQUE_CONSTRAINT",
      message: "이미 존재하는 데이터입니다.",
    });

    expect(result.cause).toBe(error);
  });

  it("P2003 에러를 DATABASE_FOREIGN_KEY_CONSTRAINT로 변환한다", () => {
    const error = createKnownPrismaError("P2003");

    const result = mapPrismaError(error);

    expect(result).toMatchObject({
      code: "DATABASE_FOREIGN_KEY_CONSTRAINT",
      message: "연결된 데이터가 올바르지 않습니다.",
    });

    expect(result.cause).toBe(error);
  });

  it("P2025 에러를 DATABASE_RECORD_NOT_FOUND로 변환한다", () => {
    const error = createKnownPrismaError("P2025");

    const result = mapPrismaError(error);

    expect(result).toMatchObject({
      code: "DATABASE_RECORD_NOT_FOUND",
      message: "대상을 찾을 수 없습니다.",
    });

    expect(result.cause).toBe(error);
  });

  it("처리하지 않는 Prisma known request error를 DATABASE_KNOWN_ERROR로 변환한다", () => {
    const error = createKnownPrismaError("P9999");

    const result = mapPrismaError(error);

    expect(result).toMatchObject({
      code: "DATABASE_KNOWN_ERROR",
      message: "데이터 처리 중 오류가 발생했습니다.",
    });

    expect(result.cause).toBe(error);
  });

  it("Prisma validation error를 DATABASE_VALIDATION_ERROR로 변환한다", () => {
    const error = createValidationPrismaError();

    const result = mapPrismaError(error);

    expect(result).toMatchObject({
      code: "DATABASE_VALIDATION_ERROR",
      message: "데이터 형식이 올바르지 않습니다.",
    });

    expect(result.cause).toBe(error);
  });

  it("일반 Error를 DATABASE_UNKNOWN_ERROR로 변환한다", () => {
    const error = new Error("unknown error");

    const result = mapPrismaError(error);

    expect(result).toMatchObject({
      code: "DATABASE_UNKNOWN_ERROR",
      message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
    });

    expect(result.cause).toBe(error);
  });

  it("Error 인스턴스가 아닌 값도 DATABASE_UNKNOWN_ERROR로 변환한다", () => {
    const error = "unexpected error";

    const result = mapPrismaError(error);

    expect(result).toMatchObject({
      code: "DATABASE_UNKNOWN_ERROR",
      message: "데이터 처리 중 알 수 없는 오류가 발생했습니다.",
    });

    expect(result.cause).toBe(error);
  });
});
