import { describe, expect, it } from "vitest";

import { type FieldErrors } from "@repo/core/errors";
import type { FormActionResult } from "@repo/design-system/form";

import {
  getFieldError,
  getFormError,
  hasAnyFieldError,
  hasFieldErrors,
  resolveFieldError,
} from "./form-error.utils";

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

describe("hasFieldErrors", () => {
  it("fieldErrors가 빈 객체이면 false를 반환한다", () => {
    const fieldErrors: FieldErrors = {};

    expect(hasFieldErrors(fieldErrors)).toBe(false);
  });

  it("모든 필드의 에러 목록이 비어 있으면 false를 반환한다", () => {
    const fieldErrors: FieldErrors = {
      label: [],
      hexCode: [],
    };

    expect(hasFieldErrors(fieldErrors)).toBe(false);
  });

  it("하나 이상의 필드 에러가 있으면 true를 반환한다", () => {
    const fieldErrors: FieldErrors = {
      label: [],
      hexCode: ["유효한 HEX 색상 코드를 입력해 주세요."],
    };

    expect(hasFieldErrors(fieldErrors)).toBe(true);
  });

  it("여러 필드에 에러가 있어도 true를 반환한다", () => {
    const fieldErrors: FieldErrors = {
      label: ["색상명을 입력해 주세요."],
      hexCode: ["유효한 HEX 색상 코드를 입력해 주세요."],
    };

    expect(hasFieldErrors(fieldErrors)).toBe(true);
  });
});

describe("hasAnyFieldError", () => {
  it("결과가 없으면 false를 반환한다", () => {
    expect(hasAnyFieldError(null)).toBe(false);
    expect(hasAnyFieldError(undefined)).toBe(false);
  });

  it("성공 결과이면 false를 반환한다", () => {
    const result: FormActionResult = {
      ok: true,
      data: null,
    };

    expect(hasAnyFieldError(result)).toBe(false);
  });

  it("실패 결과에 fieldErrors가 없으면 false를 반환한다", () => {
    const result: FormActionResult = {
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "요청 처리 중 오류가 발생했습니다.",
    };

    expect(hasAnyFieldError(result)).toBe(false);
  });

  it("fieldErrors가 빈 객체이면 false를 반환한다", () => {
    const result: FormActionResult = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {},
    };

    expect(hasAnyFieldError(result)).toBe(false);
  });

  it("모든 필드의 에러 목록이 비어 있으면 false를 반환한다", () => {
    const result: FormActionResult = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        label: [],
        hexCode: [],
      },
    };

    expect(hasAnyFieldError(result)).toBe(false);
  });

  it("하나 이상의 필드 에러가 있으면 true를 반환한다", () => {
    const result: FormActionResult = {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      fieldErrors: {
        label: [],
        hexCode: ["유효한 HEX 색상 코드를 입력해 주세요."],
      },
    };

    expect(hasAnyFieldError(result)).toBe(true);
  });
});

describe("resolveFieldError", () => {
  it("필드가 touched 상태이면 client error를 반환한다", () => {
    const error = resolveFieldError({
      clientError: "색상명을 입력해 주세요.",
      serverError: "이미 사용 중인 색상명입니다.",
      touched: true,
      submitAttempted: false,
      editedAfterResult: false,
    });

    expect(error).toBe("색상명을 입력해 주세요.");
  });

  it("제출을 시도한 상태이면 client error를 반환한다", () => {
    const error = resolveFieldError({
      clientError: "색상명을 입력해 주세요.",
      serverError: undefined,
      touched: false,
      submitAttempted: true,
      editedAfterResult: false,
    });

    expect(error).toBe("색상명을 입력해 주세요.");
  });

  it("client error는 server error보다 우선한다", () => {
    const error = resolveFieldError({
      clientError: "유효한 HEX 색상 코드를 입력해 주세요.",
      serverError: "HEX 색상 코드를 확인해 주세요.",
      touched: true,
      submitAttempted: true,
      editedAfterResult: false,
    });

    expect(error).toBe("유효한 HEX 색상 코드를 입력해 주세요.");
  });

  it("필드를 건드리지 않았고 제출도 시도하지 않았다면 client error를 표시하지 않는다", () => {
    const error = resolveFieldError({
      clientError: "색상명을 입력해 주세요.",
      serverError: undefined,
      touched: false,
      submitAttempted: false,
      editedAfterResult: false,
    });

    expect(error).toBeUndefined();
  });

  it("server error가 있고 결과 이후 수정되지 않았다면 server error를 반환한다", () => {
    const error = resolveFieldError({
      clientError: undefined,
      serverError: "이미 사용 중인 색상명입니다.",
      touched: true,
      submitAttempted: true,
      editedAfterResult: false,
    });

    expect(error).toBe("이미 사용 중인 색상명입니다.");
  });

  it("server result 이후 필드가 수정되었다면 기존 server error를 제거한다", () => {
    const error = resolveFieldError({
      clientError: undefined,
      serverError: "이미 사용 중인 색상명입니다.",
      touched: true,
      submitAttempted: true,
      editedAfterResult: true,
    });

    expect(error).toBeUndefined();
  });

  it("server result 이후 수정되었더라도 현재 client error가 있으면 client error를 반환한다", () => {
    const error = resolveFieldError({
      clientError: "색상명은 필수입니다.",
      serverError: "이미 사용 중인 색상명입니다.",
      touched: true,
      submitAttempted: true,
      editedAfterResult: true,
    });

    expect(error).toBe("색상명은 필수입니다.");
  });

  it("표시할 client error와 server error가 모두 없으면 undefined를 반환한다", () => {
    const error = resolveFieldError({
      clientError: undefined,
      serverError: undefined,
      touched: false,
      submitAttempted: false,
      editedAfterResult: false,
    });

    expect(error).toBeUndefined();
  });

  it("필드를 건드리지 않았고 제출하지 않았어도 server error가 있으면 반환한다", () => {
    const error = resolveFieldError({
      clientError: undefined,
      serverError: "이미 사용 중인 색상명입니다.",
      touched: false,
      submitAttempted: false,
      editedAfterResult: false,
    });

    expect(error).toBe("이미 사용 중인 색상명입니다.");
  });
});
