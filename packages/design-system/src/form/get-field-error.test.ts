import type { FormActionResult } from "./form-action-result";
import { getFieldError } from "./get-field-error";

describe("getFieldError", () => {
  it("결과가 null이면 undefined를 반환한다", () => {
    expect(getFieldError(null, "email")).toBeUndefined();
  });

  it("결과가 undefined이면 undefined를 반환한다", () => {
    expect(getFieldError(undefined, "email")).toBeUndefined();
  });

  it("성공 결과이면 undefined를 반환한다", () => {
    const result = {
      ok: true,
      data: null,
      message: "처리되었습니다.",
    } satisfies FormActionResult<null>;

    expect(getFieldError(result, "email")).toBeUndefined();
  });

  it("실패 결과에 fieldErrors가 없으면 undefined를 반환한다", () => {
    const result = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
    } satisfies FormActionResult;

    expect(getFieldError(result, "email")).toBeUndefined();
  });

  it("요청한 필드의 에러가 없으면 undefined를 반환한다", () => {
    const result = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        password: ["비밀번호를 입력해 주세요."],
      },
    } satisfies FormActionResult;

    expect(getFieldError(result, "email")).toBeUndefined();
  });

  it("요청한 필드의 첫 번째 에러 메시지를 반환한다", () => {
    const result = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        email: ["이메일을 입력해 주세요.", "올바른 이메일 형식이 아닙니다."],
      },
    } satisfies FormActionResult;

    expect(getFieldError(result, "email")).toBe("이메일을 입력해 주세요.");
  });
});
