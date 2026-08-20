import { describe, expect, it } from "vitest";

import { failure, isFailure, isSuccess, success } from "./result";

describe("success", () => {
  it("builds a successful result", () => {
    expect(
      success({
        id: "test-id",
      }),
    ).toEqual({
      ok: true,
      data: {
        id: "test-id",
      },
    });
  });
});

describe("failure", () => {
  it("builds a failed result", () => {
    expect(
      failure({
        code: "TEST_ERROR",
        message: "테스트 오류입니다.",
      }),
    ).toEqual({
      ok: false,
      error: {
        code: "TEST_ERROR",
        message: "테스트 오류입니다.",
      },
    });
  });
});

describe("isSuccess", () => {
  it("returns true for a successful result", () => {
    expect(isSuccess(success("value"))).toBe(true);
  });

  it("returns false for a failed result", () => {
    expect(isSuccess(failure("error"))).toBe(false);
  });
});

describe("isFailure", () => {
  it("returns true for a failed result", () => {
    expect(isFailure(failure("error"))).toBe(true);
  });

  it("returns false for a successful result", () => {
    expect(isFailure(success("value"))).toBe(false);
  });
});
