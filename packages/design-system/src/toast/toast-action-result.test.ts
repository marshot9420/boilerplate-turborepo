import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("result가 없으면 toast를 호출하지 않는다", () => {
    toastActionResult(null);

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("성공 result면 success toast를 호출한다", () => {
    const result = {
      ok: true,
      data: null,
      message: "콘텐츠가 생성되었습니다.",
    } satisfies ActionResult;

    toastActionResult(result);

    expect(toast.success).toHaveBeenCalledWith("콘텐츠가 생성되었습니다.");
  });

  it("성공 result에 message가 없으면 기본 성공 메시지를 사용한다", () => {
    const result = {
      ok: true,
      data: null,
    } satisfies ActionResult;

    toastActionResult(result);

    expect(toast.success).toHaveBeenCalledWith(DEFAULT_TOAST_SUCCESS_MESSAGE);
  });

  it("성공 result에 message가 없고 successMessage option이 있으면 option을 사용한다", () => {
    const result = {
      ok: true,
      data: null,
    } satisfies ActionResult;

    toastActionResult(result, {
      successMessage: "완료되었습니다.",
    });

    expect(toast.success).toHaveBeenCalledWith("완료되었습니다.");
  });

  it("실패 result면 error toast를 호출한다", () => {
    const result = {
      ok: false,
      code: "FORBIDDEN",
      message: "권한이 없습니다.",
    } satisfies ActionResult;

    toastActionResult(result);

    expect(toast.error).toHaveBeenCalledWith("권한이 없습니다.");
  });

  it("실패 result에 message가 없을 수 없는 구조지만 fallback option을 유지한다", () => {
    const result = {
      ok: false,
      code: "UNKNOWN",
      message: "",
    } satisfies ActionResult;

    toastActionResult(result, {
      errorMessage: "실패했습니다.",
    });

    expect(toast.error).toHaveBeenCalledWith("실패했습니다.");
  });

  it("실패 result의 message와 option이 모두 비어 있으면 기본 실패 메시지를 사용한다", () => {
    const result = {
      ok: false,
      code: "UNKNOWN",
      message: "",
    } satisfies ActionResult;

    toastActionResult(result);

    expect(toast.error).toHaveBeenCalledWith(DEFAULT_TOAST_ERROR_MESSAGE);
  });
});
