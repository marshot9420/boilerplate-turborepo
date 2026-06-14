import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ActionResult } from "@repo/core/action";

import {
  DEFAULT_TOAST_ERROR_MESSAGE,
  DEFAULT_TOAST_SUCCESS_MESSAGE,
  toastActionResult,
} from "./toast-action-result";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("toastActionResult", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("결과가 null이면 toast를 호출하지 않는다", () => {
    toastActionResult(null);

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("결과가 undefined이면 toast를 호출하지 않는다", () => {
    toastActionResult(undefined);

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("성공 결과이면 success toast를 호출한다", () => {
    const result = {
      ok: true,
      data: null,
      message: "저장되었습니다.",
    } satisfies ActionResult<null>;

    toastActionResult(result);

    expect(toast.success).toHaveBeenCalledWith("저장되었습니다.");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("성공 결과에 message가 없으면 기본 성공 메시지를 사용한다", () => {
    const result = {
      ok: true,
      data: null,
    } satisfies ActionResult<null>;

    toastActionResult(result);

    expect(toast.success).toHaveBeenCalledWith(DEFAULT_TOAST_SUCCESS_MESSAGE);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("성공 결과에 message가 없고 successMessage 옵션이 있으면 옵션 메시지를 사용한다", () => {
    const result = {
      ok: true,
      data: null,
    } satisfies ActionResult<null>;

    toastActionResult(result, {
      successMessage: "완료되었습니다.",
    });

    expect(toast.success).toHaveBeenCalledWith("완료되었습니다.");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("실패 결과이면 error toast를 호출한다", () => {
    const result = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
    } satisfies ActionResult;

    toastActionResult(result);

    expect(toast.error).toHaveBeenCalledWith("입력값을 확인해 주세요.");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("실패 결과에 message가 없을 수 있는 방어 케이스에서는 기본 에러 메시지를 사용한다", () => {
    const result = {
      ok: false,
      code: "UNKNOWN_ERROR",
      message: undefined,
    } as unknown as ActionResult;

    toastActionResult(result);

    expect(toast.error).toHaveBeenCalledWith(DEFAULT_TOAST_ERROR_MESSAGE);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("실패 결과에 message가 없고 errorMessage 옵션이 있으면 옵션 메시지를 사용한다", () => {
    const result = {
      ok: false,
      code: "UNKNOWN_ERROR",
      message: undefined,
    } as unknown as ActionResult;

    toastActionResult(result, {
      errorMessage: "다시 시도해 주세요.",
    });

    expect(toast.error).toHaveBeenCalledWith("다시 시도해 주세요.");
    expect(toast.success).not.toHaveBeenCalled();
  });
});
