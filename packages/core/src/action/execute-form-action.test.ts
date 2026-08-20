import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { COMMON_ERROR_CODE } from "../errors";
import { logger } from "../logger";
import { executeFormAction } from "./execute-form-action";

describe("executeFormAction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("validates FormData and passes the parsed input to the handler", async () => {
    const formData = new FormData();

    formData.set("name", "Mars");

    const schema = z.object({
      name: z.string(),
    });

    const handler = vi.fn(async (input: z.infer<typeof schema>) => ({
      ok: true as const,
      data: {
        id: "test-id",
        name: input.name,
      },
    }));

    const loggerInfoSpy = vi.spyOn(logger, "info").mockImplementation(() => undefined);

    const result = await executeFormAction({
      actionName: "user.create",
      schema,
      formData,
      handler,
      successMessage: "사용자가 생성되었습니다.",
    });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({
      name: "Mars",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        id: "test-id",
        name: "Mars",
      },
      message: "사용자가 생성되었습니다.",
    });

    expect(loggerInfoSpy).toHaveBeenCalledWith("user.create.succeeded");
  });

  it("returns validation field errors and does not call the handler when validation fails", async () => {
    const formData = new FormData();

    formData.set("name", "");

    const schema = z.object({
      name: z.string().min(1, "이름을 입력해 주세요."),
    });

    const handler = vi.fn(async () => ({
      ok: true as const,
      data: null,
    }));

    const result = await executeFormAction({
      actionName: "user.create",
      schema,
      formData,
      handler,
    });

    expect(handler).not.toHaveBeenCalled();

    expect(result).toEqual({
      ok: false,
      code: COMMON_ERROR_CODE.VALIDATION_ERROR,
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        name: ["이름을 입력해 주세요."],
      },
    });
  });

  it("uses parseFormData when a custom FormData parser is provided", async () => {
    const formData = new FormData();

    formData.append("tag", "typescript");
    formData.append("tag", "nextjs");

    const schema = z.object({
      tags: z.array(z.string()),
    });

    const parseFormData = vi.fn((targetFormData: FormData) => ({
      tags: targetFormData.getAll("tag"),
    }));

    const handler = vi.fn(async (input: z.infer<typeof schema>) => ({
      ok: true as const,
      data: input,
    }));

    vi.spyOn(logger, "info").mockImplementation(() => undefined);

    const result = await executeFormAction({
      actionName: "content.update-tags",
      schema,
      formData,
      parseFormData,
      handler,
    });

    expect(parseFormData).toHaveBeenCalledOnce();
    expect(parseFormData).toHaveBeenCalledWith(formData);

    expect(handler).toHaveBeenCalledWith({
      tags: ["typescript", "nextjs"],
    });

    expect(result).toEqual({
      ok: true,
      data: {
        tags: ["typescript", "nextjs"],
      },
      message: undefined,
    });
  });

  it("returns the handler error and logs a warning when the handler fails", async () => {
    const formData = new FormData();

    formData.set("email", "mars@example.com");

    const schema = z.object({
      email: z.email(),
    });

    const handler = vi.fn(async () => ({
      ok: false as const,
      error: {
        code: "EMAIL_ALREADY_EXISTS",
        message: "이미 사용 중인 이메일입니다.",
        fieldErrors: {
          email: ["이미 사용 중인 이메일입니다."],
        },
      },
    }));

    const loggerWarnSpy = vi.spyOn(logger, "warn").mockImplementation(() => undefined);

    const result = await executeFormAction({
      actionName: "user.create",
      schema,
      formData,
      handler,
    });

    expect(result).toEqual({
      ok: false,
      code: "EMAIL_ALREADY_EXISTS",
      message: "이미 사용 중인 이메일입니다.",
      fieldErrors: {
        email: ["이미 사용 중인 이메일입니다."],
      },
    });

    expect(loggerWarnSpy).toHaveBeenCalledWith("user.create.failed", {
      code: "EMAIL_ALREADY_EXISTS",
      message: "이미 사용 중인 이메일입니다.",
    });
  });

  it("returns an internal server error and logs the error when an unexpected error is thrown", async () => {
    const formData = new FormData();

    formData.set("name", "Mars");

    const schema = z.object({
      name: z.string(),
    });

    const unexpectedError = new Error("unexpected");

    const handler = vi.fn(async () => {
      throw unexpectedError;
    });

    const loggerErrorSpy = vi.spyOn(logger, "error").mockImplementation(() => undefined);

    const result = await executeFormAction({
      actionName: "user.create",
      schema,
      formData,
      handler,
    });

    expect(result).toEqual({
      ok: false,
      code: COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR,
      message: "요청 처리 중 오류가 발생했습니다.",
    });

    expect(loggerErrorSpy).toHaveBeenCalledWith("user.create.unexpected_error", {
      error: unexpectedError,
    });
  });

  it("handles errors thrown by parseFormData as unexpected errors", async () => {
    const formData = new FormData();

    const schema = z.object({
      name: z.string(),
    });

    const unexpectedError = new Error("parse failed");

    const parseFormData = vi.fn(() => {
      throw unexpectedError;
    });

    const handler = vi.fn(async () => ({
      ok: true as const,
      data: null,
    }));

    const loggerErrorSpy = vi.spyOn(logger, "error").mockImplementation(() => undefined);

    const result = await executeFormAction({
      actionName: "user.create",
      schema,
      formData,
      parseFormData,
      handler,
    });

    expect(handler).not.toHaveBeenCalled();

    expect(result).toEqual({
      ok: false,
      code: COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR,
      message: "요청 처리 중 오류가 발생했습니다.",
    });

    expect(loggerErrorSpy).toHaveBeenCalledWith("user.create.unexpected_error", {
      error: unexpectedError,
    });
  });
});
