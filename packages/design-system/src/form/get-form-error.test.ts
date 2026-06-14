import type { FormActionResult } from "./form-action-result";
import { getFormError } from "./get-form-error";

describe("getFormError", () => {
  it("결과가 null이면 undefined를 반환한다", () => {
    expect(getFormError(null)).toBeUndefined();
  });

  it("결과가 undefined이면 undefined를 반환한다", () => {
    expect(getFormError(undefined)).toBeUndefined();
  });

  it("성공 결과이면 undefined를 반환한다", () => {
    const result = {
      ok: true,
      data: null,
      message: "저장되었습니다.",
    } satisfies FormActionResult<null>;

    expect(getFormError(result)).toBeUndefined();
  });

  it("실패 결과이면 message를 반환한다", () => {
    const result = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
    } satisfies FormActionResult;

    expect(getFormError(result)).toBe("입력값을 확인해 주세요.");
  });

  it("fieldErrors가 있어도 form error는 message를 반환한다", () => {
    const result = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        email: ["이메일을 입력해 주세요."],
      },
    } satisfies FormActionResult;

    expect(getFormError(result)).toBe("입력값을 확인해 주세요.");
  });
});
