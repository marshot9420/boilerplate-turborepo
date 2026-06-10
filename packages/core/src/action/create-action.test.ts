import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { COMMON_ERROR_CODE } from "../errors";
import { failure, success } from "../result";
import { createAction } from "./create-action";

describe("createAction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("검증에 성공하면 handler 결과를 ActionResult로 반환한다", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);

    const formData = new FormData();
    formData.set("title", "테스트 제목");

    const result = await createAction({
      actionName: "content.create",
      schema: z.object({
        title: z.string().min(1),
      }),
      formData,
      handler: async (input) => {
        return success({
          id: "content-1",
          title: input.title,
        });
      },
      successMessage: "생성되었습니다.",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        id: "content-1",
        title: "테스트 제목",
      },
      message: "생성되었습니다.",
    });
  });

  it("Zod 검증에 실패하면 fieldErrors를 반환한다", async () => {
    const formData = new FormData();
    formData.set("title", "");

    const result = await createAction({
      actionName: "content.create",
      schema: z.object({
        title: z.string().min(1, "제목을 입력해 주세요."),
      }),
      formData,
      handler: async () => {
        return success(null);
      },
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.code).toBe(COMMON_ERROR_CODE.VALIDATION_ERROR);
      expect(result.fieldErrors?.title).toEqual(["제목을 입력해 주세요."]);
    }
  });

  it("handler가 실패하면 AppError를 ActionResult로 변환한다", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const formData = new FormData();
    formData.set("title", "중복 제목");

    const result = await createAction({
      actionName: "content.create",
      schema: z.object({
        title: z.string().min(1),
      }),
      formData,
      handler: async () => {
        return failure({
          code: "CONTENT_TITLE_DUPLICATED",
          message: "이미 사용 중인 제목입니다.",
          fieldErrors: {
            title: ["이미 사용 중인 제목입니다."],
          },
        });
      },
    });

    expect(result).toEqual({
      ok: false,
      code: "CONTENT_TITLE_DUPLICATED",
      message: "이미 사용 중인 제목입니다.",
      fieldErrors: {
        title: ["이미 사용 중인 제목입니다."],
      },
    });
  });

  it("예상하지 못한 에러가 발생하면 INTERNAL_SERVER_ERROR를 반환한다", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const formData = new FormData();
    formData.set("title", "테스트 제목");

    const result = await createAction({
      actionName: "content.create",
      schema: z.object({
        title: z.string().min(1),
      }),
      formData,
      handler: async () => {
        throw new Error("unexpected");
      },
    });

    expect(result).toEqual({
      ok: false,
      code: COMMON_ERROR_CODE.INTERNAL_SERVER_ERROR,
      message: "요청 처리 중 오류가 발생했습니다.",
    });
  });
});
