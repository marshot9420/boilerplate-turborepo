import type { FormActionResult } from "./form-action-result";
import { hasFieldError } from "./has-field-error";

describe("hasFieldError", () => {
  it("결과가 null이면 false를 반환한다", () => {
    expect(hasFieldError(null, "email")).toBe(false);
  });

  it("성공 결과이면 false를 반환한다", () => {
    const result = {
      ok: true,
      data: null,
    } satisfies FormActionResult<null>;

    expect(hasFieldError(result, "email")).toBe(false);
  });

  it("요청한 필드의 에러가 없으면 false를 반환한다", () => {
    const result = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        password: ["비밀번호를 입력해 주세요."],
      },
    } satisfies FormActionResult;

    expect(hasFieldError(result, "email")).toBe(false);
  });

  it("요청한 필드의 에러가 있으면 true를 반환한다", () => {
    const result = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        email: ["이메일을 입력해 주세요."],
      },
    } satisfies FormActionResult;

    expect(hasFieldError(result, "email")).toBe(true);
  });
});
